import { initializeApp } from 'firebase/app';
import { getAuth, signOut, type User } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocFromServer,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

export const ADMIN_EMAIL = 'ogemezur61@gmail.com';

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore operating in offline cache mode.');
    }
  }
}
testConnection();

export type AnnouncementPriority = 'normal' | 'strict';

export interface LiveAnnouncement {
  id: string;
  title: string;
  body: string;
  tag: string;
  priority: AnnouncementPriority;
  targetUrl?: string;
  authorId: string;
  createdAt: Timestamp | null;
  createdAtMs?: number;
}

export function subscribeToAnnouncements(
  onData: (items: LiveAnnouncement[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'announcements';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(30));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: LiveAnnouncement[] = snapshot.docs.map((d) => {
        const data = d.data();
        const rawPriority = data.priority === 'strict' || data.tag === 'إشعار صارم' ? 'strict' : 'normal';
        return {
          id: d.id,
          title: String(data.title || ''),
          body: String(data.body || ''),
          tag: String(data.tag || 'تنبيه'),
          priority: rawPriority,
          targetUrl: data.targetUrl ? String(data.targetUrl) : undefined,
          authorId: String(data.authorId || ''),
          createdAt: (data.createdAt as Timestamp) || null,
        };
      });
      onData(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export async function publishAnnouncement(payload: {
  title: string;
  body: string;
  tag: string;
  priority?: AnnouncementPriority;
  targetUrl?: string;
}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('يجب تسجيل الدخول بحساب المشرف أولاً.');
  }

  const title = payload.title.trim().slice(0, 140);
  const body = payload.body.trim().slice(0, 500);
  const tag = payload.tag.trim().slice(0, 40) || 'هام';
  const priority: AnnouncementPriority = payload.priority === 'strict' ? 'strict' : 'normal';
  const targetUrl = payload.targetUrl?.trim().slice(0, 300);

  if (title.length < 2 || body.length < 2) {
    throw new Error('يرجى إدخال عنوان ومحتوى صالحين للإشعار.');
  }

  const announcementId = `ann_${Date.now()}`;
  const path = `announcements/${announcementId}`;

  const docData: Record<string, unknown> = {
    title,
    body,
    tag,
    priority,
    authorId: user.uid,
    createdAt: serverTimestamp(),
  };

  if (targetUrl) {
    docData.targetUrl = targetUrl;
  }

  try {
    await setDoc(doc(db, 'announcements', announcementId), docData);
    return announcementId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeAnnouncement(announcementId: string) {
  const path = `announcements/${announcementId}`;
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePushSubscription(params: {
  userId: string;
  fcmToken: string;
  notificationsEnabled: boolean;
}) {
  const path = `push_subscriptions/${params.userId}`;
  try {
    await setDoc(
      doc(db, 'push_subscriptions', params.userId),
      {
        userId: params.userId,
        fcmToken: params.fcmToken.slice(0, 512),
        platform: (navigator.userAgent || 'web').slice(0, 64),
        notificationsEnabled: params.notificationsEnabled,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function checkIsAdminEmailString(email: string, extraAdminEmails: string[] = []): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === ADMIN_EMAIL.toLowerCase()) return true;
  return extraAdminEmails.some((item) => item.trim().toLowerCase() === normalized);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function checkIsAdminUser(user: User | null): Promise<boolean> {
  if (!user || !user.email || user.emailVerified !== true) return false;
  const emailLower = user.email.toLowerCase();
  if (emailLower === ADMIN_EMAIL.toLowerCase()) return true;
  try {
    const snap = await getDoc(doc(db, 'admin_emails', emailLower));
    return snap.exists();
  } catch {
    return false;
  }
}

export interface AdminEmailItem {
  email: string;
  addedBy: string;
  createdAt: Timestamp | null;
}

export function subscribeToAdminEmails(
  onData: (items: AdminEmailItem[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'admin_emails';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(20));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: AdminEmailItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          email: String(data.email || d.id),
          addedBy: String(data.addedBy || ''),
          createdAt: (data.createdAt as Timestamp) || null,
        };
      });
      onData(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export async function addAdminEmail(emailInput: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('يجب تسجيل الدخول بحساب المشرف أولاً.');
  }

  const normalized = emailInput.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalized) || normalized.length > 120) {
    throw new Error('يرجى إدخال بريد إلكتروني صحيح.');
  }

  const path = `admin_emails/${normalized}`;
  try {
    await setDoc(doc(db, 'admin_emails', normalized), {
      email: normalized,
      addedBy: user.uid,
      createdAt: serverTimestamp(),
    });
    return normalized;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeAdminEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const path = `admin_emails/${normalized}`;
  try {
    await deleteDoc(doc(db, 'admin_emails', normalized));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export interface RegisteredStudentItem {
  id: string;
  studentKey: string;
  displayName: string;
  levelBadge: string;
  isOnline: boolean;
  lastActiveAt: Timestamp | null;
  lastActiveAtMs?: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export function deriveStudentKey(identifier: string): string {
  const normalized = identifier.trim().toLowerCase() || 'guest';
  let h1 = 2166136261;
  let h2 = 3735928559;
  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 16777619);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 2654435761);
  }
  const part1 = (h1 >>> 0).toString(36);
  const part2 = (h2 >>> 0).toString(36);
  return `stu_${part1}_${part2}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}

export function subscribeToRegisteredStudents(
  onData: (items: RegisteredStudentItem[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'registered_students';
  const q = query(collection(db, path), orderBy('lastActiveAt', 'desc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: RegisteredStudentItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        const lastTs = (data.lastActiveAt as Timestamp) || null;
        return {
          id: d.id,
          studentKey: String(data.studentKey || d.id),
          displayName: String(data.displayName || 'طالب مسجل'),
          levelBadge: String(data.levelBadge || 'متعلم ONEFD'),
          isOnline: Boolean(data.isOnline),
          lastActiveAt: lastTs,
          lastActiveAtMs: lastTs?.toMillis?.() ?? Date.now(),
          createdAt: (data.createdAt as Timestamp) || null,
          updatedAt: (data.updatedAt as Timestamp) || null,
        };
      });
      onData(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

export async function upsertRegisteredStudent(params: {
  studentKey: string;
  displayName: string;
  levelBadge?: string;
  isOnline: boolean;
}) {
  const cleanKey = params.studentKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const cleanName = params.displayName.trim().slice(0, 80);
  const cleanLevel = (params.levelBadge || 'متعلم ONEFD').trim().slice(0, 40) || 'متعلم ONEFD';

  if (cleanKey.length < 4) {
    throw new Error('معرّف الطالب غير صالح.');
  }
  if (cleanName.length < 2) {
    throw new Error('يرجى إدخال اسم الطالب (حرفان على الأقل).');
  }

  const docRef = doc(db, 'registered_students', cleanKey);
  const path = `registered_students/${cleanKey}`;

  const getServerOrCachedSnap = async () => {
    try {
      return await getDocFromServer(docRef);
    } catch {
      return await getDoc(docRef);
    }
  };

  try {
    const snap = await getServerOrCachedSnap();
    if (!snap.exists()) {
      try {
        await setDoc(docRef, {
          studentKey: cleanKey,
          displayName: cleanName,
          levelBadge: cleanLevel,
          isOnline: params.isOnline,
          lastActiveAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (writeErr) {
        const msg = writeErr instanceof Error ? writeErr.message : String(writeErr);
        if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
          const retrySnap = await getServerOrCachedSnap();
          if (retrySnap.exists()) {
            const existingData = retrySnap.data();
            if (existingData?.createdAt && existingData?.studentKey === cleanKey) {
              await updateDoc(docRef, {
                displayName: cleanName,
                levelBadge: cleanLevel,
                isOnline: params.isOnline,
                lastActiveAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            } else {
              await setDoc(docRef, {
                studentKey: cleanKey,
                displayName: cleanName,
                levelBadge: cleanLevel,
                isOnline: params.isOnline,
                lastActiveAt: serverTimestamp(),
                createdAt: existingData?.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
            return cleanKey;
          }
        }
        throw writeErr;
      }
    } else {
      const existingData = snap.data();
      if (existingData?.createdAt && existingData?.studentKey === cleanKey) {
        await updateDoc(docRef, {
          displayName: cleanName,
          levelBadge: cleanLevel,
          isOnline: params.isOnline,
          lastActiveAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          studentKey: cleanKey,
          displayName: cleanName,
          levelBadge: cleanLevel,
          isOnline: params.isOnline,
          lastActiveAt: serverTimestamp(),
          createdAt: existingData?.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
    return cleanKey;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateStudentPresenceOnly(studentKey: string, isOnline: boolean) {
  const cleanKey = studentKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  if (cleanKey.length < 4) return;
  const docRef = doc(db, 'registered_students', cleanKey);
  const path = `registered_students/${cleanKey}`;
  try {
    let snap;
    try {
      snap = await getDocFromServer(docRef);
    } catch {
      snap = await getDoc(docRef);
    }
    if (!snap.exists()) return;
    const existingData = snap.data();
    if (!existingData?.createdAt || existingData?.studentKey !== cleanKey) {
      await setDoc(docRef, {
        studentKey: cleanKey,
        displayName: String(existingData?.displayName || 'طالب مسجل').slice(0, 80),
        levelBadge: String(existingData?.levelBadge || 'متعلم ONEFD').slice(0, 40),
        isOnline,
        lastActiveAt: serverTimestamp(),
        createdAt: existingData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }
    await updateDoc(docRef, {
      isOnline,
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('not-found') || msg.includes('No document to update')) {
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeRegisteredStudent(studentKey: string) {
  const cleanKey = studentKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `registered_students/${cleanKey}`;
  try {
    await deleteDoc(doc(db, 'registered_students', cleanKey));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function playAlertChime(isStrict = false) {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isStrict ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(isStrict ? 0.2 : 0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    if (isStrict) {
      playTone(880, now, 0.16);
      playTone(660, now + 0.18, 0.16);
      playTone(880, now + 0.36, 0.22);
    } else {
      playTone(659.25, now, 0.14);
      playTone(880, now + 0.14, 0.18);
    }
  } catch {
    // Ignore autoplay audio restrictions
  }
}

export async function triggerLocalPushNotification(
  title: string,
  body: string,
  targetUrl?: string,
  isStrict = false
) {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const options: NotificationOptions & { renotify?: boolean; vibrate?: number[] } = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    dir: 'rtl',
    lang: 'ar',
    requireInteraction: isStrict,
    tag: isStrict ? `strict-alert-${Date.now()}` : 'onefd-alert',
    renotify: isStrict,
    vibrate: isStrict ? [300, 120, 300, 120, 400] : [150],
    data: { url: targetUrl || '/', isStrict },
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, options);
        return true;
      }
    }
    new Notification(title, options);
    return true;
  } catch {
    try {
      new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }
}

let cachedMessaging: Messaging | null = null;

export async function initFirebaseMessaging(vapidKey?: string): Promise<{
  token: string | null;
  supported: boolean;
}> {
  try {
    const supported = await isSupported();
    if (!supported || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return { token: null, supported: false };
    }

    if (!cachedMessaging) {
      cachedMessaging = getMessaging(app);
    }

    onMessage(cachedMessaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || 'إشعار جديد';
      const body = payload.notification?.body || payload.data?.body || '';
      const url = payload.data?.targetUrl;
      triggerLocalPushNotification(title, body, url);
    });

    if (Notification.permission !== 'granted') {
      return { token: null, supported: true };
    }

    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/firebase-cloud-messaging-push-scope',
    });

    if (vapidKey && vapidKey.trim().length > 10) {
      const fcmToken = await getToken(cachedMessaging, {
        vapidKey: vapidKey.trim(),
        serviceWorkerRegistration: swReg,
      });
      return { token: fcmToken || null, supported: true };
    }

    return { token: null, supported: true };
  } catch {
    return { token: null, supported: false };
  }
}
