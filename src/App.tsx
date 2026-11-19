import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Settings, CheckCircle2, 
  Download, Calendar, ArrowUpRight, Menu,
  Maximize2, ZoomIn, X, Bell, HeartHandshake, BookOpenCheck,
  ShieldCheck, LogIn, User
} from 'lucide-react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { RegistrationPage } from './components/RegistrationPage';
import { DocumentsPage } from './components/DocumentsPage';
import { HomeworkPage } from './components/HomeworkPage';
import { PlatformsPage } from './components/PlatformsPage';
import { AppTopicsPage } from './components/AppTopicsPage';
import { StudentsDirectoryPage } from './components/StudentsDirectoryPage';
import { MiddleSchoolPage } from './components/MiddleSchoolPage';
import { SecondarySchoolPage } from './components/SecondarySchoolPage';
import { LevelDetailPage } from './components/LevelDetailPage';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { SideDrawer } from './components/SideDrawer';
import { PushNotificationsModal } from './components/PushNotificationsModal';
import { GoogleEntryModal } from './components/GoogleEntryModal';
import { StrictAlertModal } from './components/StrictAlertModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  auth,
  checkIsAdminUser,
  checkIsAdminEmailString,
  signOutUser,
  subscribeToAnnouncements,
  removeAnnouncement,
  AnnouncementPriority,
  LiveAnnouncement,
  triggerLocalPushNotification,
  playAlertChime,
  initFirebaseMessaging,
  deriveStudentKey,
  subscribeToRegisteredStudents,
  upsertRegisteredStudent,
  updateStudentPresenceOnly,
  removeRegisteredStudent,
  RegisteredStudentItem,
} from './lib/firebase';
import { AppLanguage, TRANSLATIONS } from './lib/i18n';
import { LevelInfo, SECONDARY_LEVELS } from './data/dirasaData';
import { APP_BACKGROUNDS, APP_THEMES, AppBackground, AppTheme } from './types/theme';
import {
  AppSectionItem,
  DEFAULT_HOME_BLOCKS,
  DEFAULT_OFFICIAL_SITE_URL,
  DEFAULT_SECTIONS,
  HomeBlockConfig,
  HomeBlockId,
} from './types/sections';

type ScreenView = 
  | 'home' 
  | 'registration' 
  | 'documents' 
  | 'homework' 
  | 'platforms' 
  | 'app-topics'
  | 'students'
  | 'middle' 
  | 'secondary' 
  | 'level-detail';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('home');
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);
  
  // Settings: Theme, Background & Language state
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('onefd_app_theme') as AppTheme | null;
      return saved && saved in APP_THEMES ? saved : 'futuristic-lavender';
    } catch {
      return 'futuristic-lavender';
    }
  });
  const [currentBackground, setCurrentBackground] = useState<AppBackground>(() => {
    try {
      const saved = localStorage.getItem('onefd_app_bg') as AppBackground | null;
      return saved && saved in APP_BACKGROUNDS ? saved : 'theme-default';
    } catch {
      return 'theme-default';
    }
  });
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('onefd_app_lang') as AppLanguage | null;
      return saved === 'ar' || saved === 'fr' || saved === 'en' ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Side Drawer Window state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Image lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    title: string;
    downloadName: string;
  } | null>(null);

  // Firebase Auth, In-App Email Account, Live Announcements & Push Notifications state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('onefd_active_email') || '';
    } catch {
      return '';
    }
  });
  const [localAdminEmails, setLocalAdminEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_admin_emails');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [savedEmails, setSavedEmails] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_saved_emails');
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      const rawAdmins = localStorage.getItem('onefd_admin_emails');
      const adminExtras = rawAdmins ? (JSON.parse(rawAdmins) as string[]) : [];
      const active = localStorage.getItem('onefd_active_email');
      const combined =
        active && !parsed.includes(active) ? [active, ...parsed] : parsed;
      // Never leak admin email into saved account list for other users on shared devices
      return combined.filter((email) => !checkIsAdminEmailString(email, adminExtras));
    } catch {
      return [];
    }
  });
  const [sections, setSections] = useState<AppSectionItem[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_custom_sections');
      const parsed = raw ? (JSON.parse(raw) as AppSectionItem[]) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        let next = parsed.filter(
          (s) => s.id !== 'past-exams' && s.targetValue !== 'past-exams'
        );
        let modified = next.length !== parsed.length;

        const seededTopics = localStorage.getItem('onefd_app_topics_seeded');
        if (!seededTopics && !next.some((s) => s.id === 'app-topics' || s.targetValue === 'app-topics')) {
          const topicsDef = DEFAULT_SECTIONS.find((s) => s.id === 'app-topics');
          if (topicsDef) {
            const platformsIdx = next.findIndex((s) => s.id === 'platforms');
            if (platformsIdx >= 0) {
              next.splice(platformsIdx + 1, 0, topicsDef);
            } else {
              next.push(topicsDef);
            }
            modified = true;
          }
        }
        if (!seededTopics) {
          localStorage.setItem('onefd_app_topics_seeded', '1');
        }

        const seededStudents = localStorage.getItem('onefd_students_seeded');
        if (!seededStudents && !next.some((s) => s.id === 'students' || s.targetValue === 'students')) {
          const studentsDef = DEFAULT_SECTIONS.find((s) => s.id === 'students');
          if (studentsDef) {
            const topicsIdx = next.findIndex((s) => s.id === 'app-topics');
            const platformsIdx = next.findIndex((s) => s.id === 'platforms');
            const insertIdx = topicsIdx >= 0 ? topicsIdx : platformsIdx;
            if (insertIdx >= 0) {
              next.splice(insertIdx + 1, 0, studentsDef);
            } else {
              next.push(studentsDef);
            }
            modified = true;
          }
        }
        if (!seededStudents) {
          localStorage.setItem('onefd_students_seeded', '1');
        }

        if (modified) {
          localStorage.setItem('onefd_custom_sections', JSON.stringify(next));
        }
        return next;
      }
      localStorage.setItem('onefd_app_topics_seeded', '1');
      localStorage.setItem('onefd_students_seeded', '1');
      return DEFAULT_SECTIONS;
    } catch {
      return DEFAULT_SECTIONS;
    }
  });
  const [homeBlocks, setHomeBlocks] = useState<HomeBlockConfig[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_home_blocks');
      const parsed = raw ? (JSON.parse(raw) as HomeBlockConfig[]) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HOME_BLOCKS;
    } catch {
      return DEFAULT_HOME_BLOCKS;
    }
  });
  const [officialSiteUrl, setOfficialSiteUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('onefd_official_site_url') || DEFAULT_OFFICIAL_SITE_URL;
    } catch {
      return DEFAULT_OFFICIAL_SITE_URL;
    }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [cloudAnnouncements, setCloudAnnouncements] = useState<LiveAnnouncement[]>([]);
  const [localAnnouncements, setLocalAnnouncements] = useState<LiveAnnouncement[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_local_announcements');
      return raw ? (JSON.parse(raw) as LiveAnnouncement[]) : [];
    } catch {
      return [];
    }
  });
  const [cloudStudents, setCloudStudents] = useState<RegisteredStudentItem[]>([]);
  const [localStudents, setLocalStudents] = useState<RegisteredStudentItem[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_local_students');
      return raw ? (JSON.parse(raw) as RegisteredStudentItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'inbox' | 'send'>('inbox');
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [inAppAlertsEnabled, setInAppAlertsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('onefd_in_app_alerts');
      return saved === null ? true : saved === '1';
    } catch {
      return true;
    }
  });
  const inAppAlertsRef = useRef(inAppAlertsEnabled);
  useEffect(() => {
    inAppAlertsRef.current = inAppAlertsEnabled;
  }, [inAppAlertsEnabled]);

  const [liveToast, setLiveToast] = useState<{
    title: string;
    body: string;
    tag: string;
  } | null>(null);
  const liveToastTimerRef = useRef<number | null>(null);
  const seenAnnouncementIdsRef = useRef<Set<string> | null>(null);

  const showLiveToast = (title: string, body: string, tag = 'تنبيه فوري') => {
    setLiveToast({ title, body, tag });
    if (liveToastTimerRef.current) {
      window.clearTimeout(liveToastTimerRef.current);
    }
    liveToastTimerRef.current = window.setTimeout(() => {
      setLiveToast(null);
    }, 7000);
  };

  const handleInAppAlertsChange = (enabled: boolean) => {
    setInAppAlertsEnabled(enabled);
    try {
      localStorage.setItem('onefd_in_app_alerts', enabled ? '1' : '0');
    } catch {
      // Ignore storage errors
    }
  };

  const [ackStrictIds, setAckStrictIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_ack_strict_ids');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const announcements = useMemo(() => {
    const map = new Map<string, LiveAnnouncement>();
    for (const item of localAnnouncements) {
      map.set(item.id, item);
    }
    for (const item of cloudAnnouncements) {
      map.set(item.id, item);
    }
    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() ?? a.createdAtMs ?? 0;
      const timeB = b.createdAt?.toMillis?.() ?? b.createdAtMs ?? 0;
      return timeB - timeA;
    });
  }, [cloudAnnouncements, localAnnouncements]);

  const pendingStrictAnnouncement =
    announcements.find((item) => item.priority === 'strict' && !ackStrictIds.includes(item.id)) || null;

  const handleAcknowledgeStrict = (id: string) => {
    setAckStrictIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('onefd_ack_strict_ids', JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const computeCountdownDays = () => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const examMidnight = new Date(2027, 4, 5).getTime(); // 5 May 2027
    return Math.max(0, Math.round((examMidnight - todayMidnight) / (1000 * 60 * 60 * 24)));
  };

  // Dynamic daily countdown starting from today (days only)
  const [examCountdownDays, setExamCountdownDays] = useState(computeCountdownDays);

  useEffect(() => {
    const updateCountdown = () => {
      setExamCountdownDays(computeCountdownDays());
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to Firebase Auth & real-time announcements (offline-cached via Firestore)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email) {
          const emailLower = user.email.toLowerCase();
          setSelectedEmail(emailLower);
          try {
            localStorage.setItem('onefd_active_email', emailLower);
          } catch {
            // Ignore storage errors
          }
          if (!checkIsAdminEmailString(emailLower)) {
            setSavedEmails((prev) => {
              const next = [emailLower, ...prev.filter((e) => e !== emailLower)].slice(0, 8);
              try {
                localStorage.setItem('onefd_saved_emails', JSON.stringify(next));
              } catch {
                // Ignore storage errors
              }
              return next;
            });
          }
        }
        setIsAccountModalOpen(false);
      }
      setAuthReady(true);
    });

    const unsubAnnouncements = subscribeToAnnouncements(
      (items) => {
        setCloudAnnouncements(items);

        if (seenAnnouncementIdsRef.current === null) {
          seenAnnouncementIdsRef.current = new Set(items.map((item) => item.id));
          return;
        }

        const newItems = items.filter((item) => !seenAnnouncementIdsRef.current!.has(item.id));
        newItems.forEach((item) => seenAnnouncementIdsRef.current!.add(item.id));

        if (newItems.length > 0) {
          const newest = newItems[0];
          const isStrict = newest.priority === 'strict';
          if (inAppAlertsRef.current) {
            playAlertChime(isStrict);
            if (!isStrict) {
              showLiveToast(newest.title, newest.body, newest.tag);
            }
          }
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            triggerLocalPushNotification(
              isStrict ? `🚨 إشعار صارم: ${newest.title}` : newest.title,
              newest.body,
              newest.targetUrl,
              isStrict
            );
          }
        }
      },
      (err) => {
        console.warn('Announcements subscription warning:', err.message);
      }
    );

    const unsubStudents = subscribeToRegisteredStudents(
      (items) => {
        setCloudStudents(items);
      },
      (err) => {
        console.warn('Registered students subscription warning:', err.message);
      }
    );

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const savedVapid = localStorage.getItem('onefd_vapid_key') || undefined;
      initFirebaseMessaging(savedVapid);
    }

    return () => {
      unsubAuth();
      unsubAnnouncements();
      unsubStudents();
    };
  }, []);

  // Resolve Admin privileges immediately in-app when the entered email matches Admin email
  useEffect(() => {
    let cancelled = false;
    const evaluateAdmin = async () => {
      const emailToCheck = currentUser?.email || selectedEmail;
      if (!emailToCheck) {
        if (!cancelled) setIsAdmin(false);
        return;
      }

      if (currentUser) {
        const cloudOk = await checkIsAdminUser(currentUser);
        const localOk = checkIsAdminEmailString(emailToCheck, localAdminEmails);
        if (!cancelled) setIsAdmin(cloudOk || localOk);
        return;
      }

      const localOk = checkIsAdminEmailString(emailToCheck, localAdminEmails);
      if (!cancelled) setIsAdmin(localOk);
    };

    evaluateAdmin();
    return () => {
      cancelled = true;
    };
  }, [currentUser, selectedEmail, localAdminEmails]);

  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const activeEmail = currentUser?.email || selectedEmail;
  const isCurrentEmailAdmin = activeEmail
    ? checkIsAdminEmailString(activeEmail, localAdminEmails) || isAdmin
    : false;
  const myStudentKey =
    activeEmail && !isCurrentEmailAdmin ? deriveStudentKey(activeEmail) : null;

  const mySavedName = useMemo(() => {
    if (!myStudentKey) return '';
    try {
      const stored = localStorage.getItem(`onefd_student_name_${myStudentKey}`);
      if (stored && stored.trim().length >= 2) return stored.trim();
    } catch {
      // Ignore storage errors
    }
    if (currentUser?.displayName && currentUser.displayName.trim().length >= 2) {
      return currentUser.displayName.trim();
    }
    const localPrefix = activeEmail.split('@')[0]?.trim() || 'متعلم';
    return `طالب ${localPrefix.slice(0, 20)}`;
  }, [myStudentKey, currentUser, activeEmail]);

  const mySavedLevel = useMemo(() => {
    if (!myStudentKey) return '3 ثانوي (BAC)';
    try {
      return localStorage.getItem(`onefd_student_level_${myStudentKey}`) || '3 ثانوي (BAC)';
    } catch {
      return '3 ثانوي (BAC)';
    }
  }, [myStudentKey]);

  const registeredStudents = useMemo(() => {
    const map = new Map<string, RegisteredStudentItem>();
    for (const s of localStudents) {
      map.set(s.studentKey, s);
    }
    for (const s of cloudStudents) {
      map.set(s.studentKey, s);
    }
    return Array.from(map.values()).sort((a, b) => {
      const aActive = a.isOnline ? 1 : 0;
      const bActive = b.isOnline ? 1 : 0;
      if (aActive !== bActive) return bActive - aActive;
      const tA = a.lastActiveAt?.toMillis?.() ?? a.lastActiveAtMs ?? 0;
      const tB = b.lastActiveAt?.toMillis?.() ?? b.lastActiveAtMs ?? 0;
      return tB - tA;
    });
  }, [cloudStudents, localStudents]);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  useEffect(() => {
    const isDark =
      currentTheme === 'cyber-dark' || Boolean(APP_BACKGROUNDS[currentBackground]?.isDarkSurface);
    document.documentElement.classList.toggle('dark', isDark);
  }, [currentTheme, currentBackground]);

  const persistLocalStudent = (item: RegisteredStudentItem) => {
    setLocalStudents((prev) => {
      const next = [item, ...prev.filter((s) => s.studentKey !== item.studentKey)].slice(0, 100);
      try {
        localStorage.setItem('onefd_local_students', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Register logged-in student (excluding Admin account for privacy) & keep active status synced
  useEffect(() => {
    if (!myStudentKey) return;

    const syncPresence = (online: boolean) => {
      const nowMs = Date.now();
      persistLocalStudent({
        id: myStudentKey,
        studentKey: myStudentKey,
        displayName: mySavedName,
        levelBadge: mySavedLevel,
        isOnline: online,
        lastActiveAt: null,
        lastActiveAtMs: nowMs,
        createdAt: null,
        updatedAt: null,
      });

      upsertRegisteredStudent({
        studentKey: myStudentKey,
        displayName: mySavedName,
        levelBadge: mySavedLevel,
        isOnline: online,
      }).catch(() => {});
    };

    syncPresence(true);

    const heartbeatId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateStudentPresenceOnly(myStudentKey, true).catch(() => {});
      }
    }, 90 * 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        updateStudentPresenceOnly(myStudentKey, false).catch(() => {});
      } else {
        updateStudentPresenceOnly(myStudentKey, true).catch(() => {});
      }
    };

    const handlePageHide = () => {
      updateStudentPresenceOnly(myStudentKey, false).catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.clearInterval(heartbeatId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [myStudentKey, mySavedName, mySavedLevel]);

  const handleSaveMyStudentProfile = async (name: string, levelBadge: string) => {
    if (!myStudentKey) return;
    const cleanName = name.trim().slice(0, 80);
    const cleanLevel = levelBadge.trim().slice(0, 40) || 'متعلم ONEFD';
    try {
      localStorage.setItem(`onefd_student_name_${myStudentKey}`, cleanName);
      localStorage.setItem(`onefd_student_level_${myStudentKey}`, cleanLevel);
    } catch {
      // Ignore storage errors
    }

    const nowMs = Date.now();
    persistLocalStudent({
      id: myStudentKey,
      studentKey: myStudentKey,
      displayName: cleanName,
      levelBadge: cleanLevel,
      isOnline: true,
      lastActiveAt: null,
      lastActiveAtMs: nowMs,
      createdAt: null,
      updatedAt: null,
    });

    try {
      await upsertRegisteredStudent({
        studentKey: myStudentKey,
        displayName: cleanName,
        levelBadge: cleanLevel,
        isOnline: true,
      });
    } catch {
      // Local persistence already updated for offline use
    }
  };

  const handleAddCustomStudent = async (name: string, levelBadge: string) => {
    const cleanName = name.trim().slice(0, 80);
    const cleanLevel = levelBadge.trim().slice(0, 40) || 'متعلم ONEFD';
    const rand = Math.random().toString(36).slice(2, 7);
    const customKey = `stu_manual_${Date.now()}_${rand}`;
    const nowMs = Date.now();

    persistLocalStudent({
      id: customKey,
      studentKey: customKey,
      displayName: cleanName,
      levelBadge: cleanLevel,
      isOnline: true,
      lastActiveAt: null,
      lastActiveAtMs: nowMs,
      createdAt: null,
      updatedAt: null,
    });

    try {
      await upsertRegisteredStudent({
        studentKey: customKey,
        displayName: cleanName,
        levelBadge: cleanLevel,
        isOnline: true,
      });
    } catch {
      // Local persistence already updated for offline use
    }
  };

  const handleDeleteStudent = async (studentKey: string) => {
    setLocalStudents((prev) => {
      const next = prev.filter((s) => s.studentKey !== studentKey);
      try {
        localStorage.setItem('onefd_local_students', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    if (currentUser && isAdmin) {
      try {
        await removeRegisteredStudent(studentKey);
      } catch {
        // Ignore network/permission errors for local-only entries
      }
    }
  };

  const handleSelectEmailInApp = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setSelectedEmail(normalized);
    try {
      localStorage.setItem('onefd_active_email', normalized);
    } catch {
      // Ignore storage errors
    }
    if (!checkIsAdminEmailString(normalized, localAdminEmails)) {
      setSavedEmails((prev) => {
        const next = [normalized, ...prev.filter((e) => e !== normalized)].slice(0, 8);
        try {
          localStorage.setItem('onefd_saved_emails', JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    }
    if (currentUser && currentUser.email?.toLowerCase() !== normalized) {
      signOutUser().catch(() => {});
    }
  };

  const handleSignOutAll = () => {
    if (myStudentKey) {
      const existingEntry = registeredStudents.find((s) => s.studentKey === myStudentKey);
      if (existingEntry) {
        persistLocalStudent({
          ...existingEntry,
          isOnline: false,
          lastActiveAtMs: Date.now(),
        });
      }
      updateStudentPresenceOnly(myStudentKey, false).catch(() => {});
    }
    setSelectedEmail('');
    setIsAdmin(false);
    setSavedEmails((prev) => {
      const cleaned = prev.filter((e) => !checkIsAdminEmailString(e, localAdminEmails));
      try {
        localStorage.removeItem('onefd_active_email');
        localStorage.setItem('onefd_saved_emails', JSON.stringify(cleaned));
      } catch {
        // Ignore storage errors
      }
      return cleaned;
    });
    if (currentUser) {
      signOutUser().catch(() => {});
    }
  };

  const persistSections = (next: AppSectionItem[]) => {
    setSections(next);
    try {
      localStorage.setItem('onefd_custom_sections', JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSelectSection = (section: AppSectionItem) => {
    if (section.targetType === 'url') {
      handleOpenExternalSite(section.targetValue);
    } else {
      setCurrentView((section.targetValue as ScreenView) || 'home');
    }
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    if (!isAdmin) return;
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(idx, 1);
    next.splice(swapIdx, 0, moved);
    persistSections(next);
  };

  const handleUpdateSection = (id: string, updates: Partial<AppSectionItem>) => {
    if (!isAdmin) return;
    const next = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    persistSections(next);
  };

  const handleAddSection = (newSection: Omit<AppSectionItem, 'id'>) => {
    if (!isAdmin) return;
    const item: AppSectionItem = {
      ...newSection,
      id: `custom_sec_${Date.now()}`,
    };
    persistSections([...sections, item]);
  };

  const handleDeleteSection = (id: string) => {
    if (!isAdmin) return;
    const next = sections.filter((s) => s.id !== id);
    persistSections(next);
  };

  const persistHomeBlocks = (next: HomeBlockConfig[]) => {
    setHomeBlocks(next);
    try {
      localStorage.setItem('onefd_home_blocks', JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleMoveHomeBlock = (id: HomeBlockId, direction: 'up' | 'down') => {
    if (!isAdmin) return;
    const idx = homeBlocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= homeBlocks.length) return;
    const next = [...homeBlocks];
    const [moved] = next.splice(idx, 1);
    next.splice(swapIdx, 0, moved);
    persistHomeBlocks(next);
  };

  const handleToggleHomeBlock = (id: HomeBlockId) => {
    if (!isAdmin) return;
    const next = homeBlocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b));
    persistHomeBlocks(next);
  };

  const handleUpdateOfficialSiteUrl = (url: string) => {
    if (!isAdmin) return;
    const normalized =
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    setOfficialSiteUrl(normalized);
    try {
      localStorage.setItem('onefd_official_site_url', normalized);
    } catch {
      // Ignore storage errors
    }
  };

  const handleResetLayout = () => {
    if (!isAdmin) return;
    persistSections(DEFAULT_SECTIONS);
    persistHomeBlocks(DEFAULT_HOME_BLOCKS);
    setOfficialSiteUrl(DEFAULT_OFFICIAL_SITE_URL);
    try {
      localStorage.setItem('onefd_official_site_url', DEFAULT_OFFICIAL_SITE_URL);
    } catch {
      // Ignore storage errors
    }
  };

  const handlePublishLocalAnnouncement = (payload: {
    title: string;
    body: string;
    tag: string;
    priority: AnnouncementPriority;
    targetUrl?: string;
    authorEmail: string;
  }) => {
    const newItem: LiveAnnouncement = {
      id: `local_ann_${Date.now()}`,
      title: payload.title.slice(0, 140),
      body: payload.body.slice(0, 500),
      tag: payload.tag.slice(0, 40) || 'هام جداً',
      priority: payload.priority,
      targetUrl: payload.targetUrl,
      authorId: payload.authorEmail,
      createdAt: null,
      createdAtMs: Date.now(),
    };
    setLocalAnnouncements((prev) => {
      const next = [newItem, ...prev].slice(0, 30);
      try {
        localStorage.setItem('onefd_local_announcements', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleDeleteAnnouncement = async (id: string) => {
    setLocalAnnouncements((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('onefd_local_announcements', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    if (currentUser && !id.startsWith('local_ann_')) {
      try {
        await removeAnnouncement(id);
      } catch {
        // Ignore permission errors when offline or local-only
      }
    }
  };

  const handleAddLocalAdminEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setLocalAdminEmails((prev) => {
      const next = Array.from(new Set([...prev, normalized]));
      try {
        localStorage.setItem('onefd_admin_emails', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    return normalized;
  };

  const handleRemoveLocalAdminEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setLocalAdminEmails((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== normalized);
      try {
        localStorage.setItem('onefd_admin_emails', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const activeThemeConfig = APP_THEMES[currentTheme];
  const activeBgClass =
    APP_BACKGROUNDS[currentBackground]?.className || activeThemeConfig.bgGradient;
  const t = TRANSLATIONS[currentLanguage];

  // Open site directly in external browser
  const handleOpenExternalSite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectLevelFromPlatforms = (levelKey: 'middle' | '1as' | '2as' | '3as') => {
    if (levelKey === 'middle') {
      setCurrentView('middle');
    } else if (levelKey === '1as') {
      setSelectedLevel(SECONDARY_LEVELS[0]);
      setCurrentView('level-detail');
    } else if (levelKey === '2as') {
      setSelectedLevel(SECONDARY_LEVELS[1]);
      setCurrentView('level-detail');
    } else if (levelKey === '3as') {
      setSelectedLevel(SECONDARY_LEVELS[2]);
      setCurrentView('level-detail');
    }
  };

  if (!authReady) {
    return (
      <div className={`min-h-screen ${activeBgClass} flex flex-col items-center justify-center p-6 text-center`}>
        <img
          src="/app-logo.png"
          alt={t.appName}
          className="w-20 h-20 rounded-3xl shadow-xl shadow-indigo-500/25 object-cover mb-4 animate-pulse"
        />
        <h1 className="text-lg font-black text-slate-900 dark:text-white">
          {t.appName}
        </h1>
        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
          {t.seasonTag}
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${activeBgClass} transition-colors duration-300 pb-10`}>
      {/* App Settings Modal (Language, Background, Theme) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentTheme={currentTheme}
        currentBackground={currentBackground}
        currentLanguage={currentLanguage}
        onSelectTheme={(th) => {
          setCurrentTheme(th);
          try {
            localStorage.setItem('onefd_app_theme', th);
          } catch {
            // Ignore storage errors
          }
        }}
        onSelectBackground={(bg) => {
          setCurrentBackground(bg);
          try {
            localStorage.setItem('onefd_app_bg', bg);
          } catch {
            // Ignore storage errors
          }
        }}
        onSelectLanguage={(lang) => {
          setCurrentLanguage(lang);
          try {
            localStorage.setItem('onefd_app_lang', lang);
          } catch {
            // Ignore storage errors
          }
        }}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-6 flex flex-col justify-between">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between mb-5 bg-white/75 dark:bg-slate-900/80 backdrop-blur-md p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Drawer Menu Trigger + App Brand */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/25 transition-transform active:scale-95 cursor-pointer shrink-0"
                title={t.menuTitle}
                aria-label={t.menuTitle}
              >
                <Menu className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setCurrentView('home')} 
                className="flex items-center gap-3 text-start group"
              >
                <img
                  src="/app-logo.png"
                  alt={t.appName}
                  className="w-11 h-11 rounded-2xl shadow-md shadow-indigo-500/20 object-cover group-hover:scale-105 transition-transform shrink-0"
                />
                <div>
                  <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {t.appName}
                  </h1>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block">
                    {t.seasonTag}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Install PWA Offline App Button */}
              <div className="hidden sm:block">
                <PWAInstallButton compact />
              </div>

              {/* Google Account / Admin Status Button */}
              {isAdmin ? (
                <button
                  onClick={() => {
                    setNotificationTab('send');
                    setIsNotificationsOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title={t.adminBadge}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline text-xs font-extrabold">{t.adminBadge}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title={activeEmail || t.loginBtn}
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || t.appName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : activeEmail ? (
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="hidden md:inline text-xs font-extrabold">{t.loginBtn}</span>
                    </>
                  )}
                </button>
              )}

              {/* Notifications Bell Button */}
              <button
                onClick={() => {
                  setNotificationTab('inbox');
                  setIsNotificationsOpen(true);
                }}
                className="relative flex items-center gap-1.5 px-3 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={t.notifications}
                aria-label={t.notifications}
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-extrabold">{t.notifications}</span>
                {announcements.length > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {announcements.length}
                  </span>
                )}
              </button>

              {/* App Settings Trigger (Language, Background, Theme) */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={t.settings}
                aria-label={t.settings}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-xs font-extrabold">{t.settings}</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard / Home View */}
          {currentView === 'home' && (
            <div className="space-y-6">
              {homeBlocks
                .filter((block) => block.visible)
                .map((block) => {
                  if (block.id === 'hero') {
                    return (
                      <div key="hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#705ee8] via-[#5944d6] to-[#3924aa] text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/15">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <div className="relative z-10 max-w-2xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-indigo-100 mb-3 border border-white/20">
                            <span>{t.heroCountry}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black leading-snug">
                            {t.heroTitle}
                          </h2>
                          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 leading-relaxed">
                            {t.heroSubtitle}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'countdown') {
                    return (
                      <div key="countdown" className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl shadow-indigo-950/40 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-white">
                              {t.countdownTitle}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{t.countdownDesc}</span>
                            </p>
                          </div>

                          {/* Days Only Display */}
                          <div className="w-full sm:w-auto min-w-[170px] px-7 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0">
                            <span className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight block leading-none">
                              {examCountdownDays}
                            </span>
                            <span className="text-xs font-extrabold text-slate-200 mt-2 block">
                              {t.daysRemaining}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'calendar') {
                    return (
                      <div key="calendar" className={`p-6 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-6`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mb-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>الديوان الوطني للتعليم والتكوين عن بعد · وثيقة رسمية</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              رزنامة التقويمات التكوينية للمتعلمين عن بعد للسنة الدراسية 2026-2027
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              المواعيد المعتمدة لفروض المراقبة الذاتية، نشر الإجابات، والفرض الإلكتروني
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setLightboxImage({
                                src: '/assets/aistudio/IMG_20261112_233154_db1b8818.jpg',
                                title: 'رزنامة التقويمات التكوينية 2026-2027 (ONEFD)',
                                downloadName: 'رزنامة_التقويمات_التكوينية_2026_2027_ONEFD.jpg',
                              })
                            }
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0 cursor-pointer"
                          >
                            <ZoomIn className="w-4 h-4 text-indigo-600" />
                            <span>تكبير الرزنامة كاملة 🔍</span>
                          </button>
                        </div>

                        {/* Calendar Image Display with click-to-zoom */}
                        <div 
                          onClick={() =>
                            setLightboxImage({
                              src: '/assets/aistudio/IMG_20261112_233154_db1b8818.jpg',
                              title: 'رزنامة التقويمات التكوينية 2026-2027 (ONEFD)',
                              downloadName: 'رزنامة_التقويمات_التكوينية_2026_2027_ONEFD.jpg',
                            })
                          }
                          className="relative group rounded-2xl overflow-hidden border-2 border-indigo-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50"
                          title="انقر لتكبير ومعاينة الصورة بالحجم الكامل"
                        >
                          <img 
                            src="/assets/aistudio/IMG_20261112_233154_db1b8818.jpg" 
                            alt="رزنامة التقويمات التكوينية للمتعلمين عن بعد للسنة الدراسية 2026-2027 - ONEFD" 
                            className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                            <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-lg backdrop-blur-sm">
                              <Maximize2 className="w-4 h-4 text-indigo-600" />
                              <span>انقر للتكبير والمعاينة بالحجم الكامل 🔍</span>
                            </span>
                          </div>
                        </div>

                        {/* Digitized 5 Milestones from the Calendar */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>تفاصيل المحطات والتقويمات الخمسة المعتمدة بالرزنامة:</span>
                          </h4>

                          <div className="grid grid-cols-1 gap-2.5">
                            {/* Milestone 01 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                                  01
                                </span>
                                <div>
                                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    فرض المراقبة الذاتية رقم 01
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    من <strong>22 ديسمبر 2026</strong> إلى <strong>21 جانفي 2027</strong>
                                  </span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shrink-0">
                                المدة: 31 يوماً
                              </span>
                            </div>

                            {/* Milestone 02 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                                  02
                                </span>
                                <div>
                                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    نشر إجابات فرض المراقبة الذاتية رقم 01
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    من <strong>11 جانفي 2027</strong> إلى <strong>11 فيفري 2027</strong>
                                  </span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-[11px] shrink-0">
                                المدة: 32 يوماً
                              </span>
                            </div>

                            {/* Milestone 03 */}
                            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                                  03
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200">
                                      الفرض الإلكتروني الرسمي
                                    </h5>
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                                      إجباري
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                                    من <strong>22 فيفري 2027</strong> إلى <strong>25 مارس 2027</strong>
                                  </span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-indigo-200/80 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 font-bold text-[11px] shrink-0">
                                المدة: 32 يوماً
                              </span>
                            </div>

                            {/* Milestone 04 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                                  04
                                </span>
                                <div>
                                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    فرض المراقبة الذاتية رقم 02
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    من <strong>15 مارس 2027</strong> إلى <strong>15 أفريل 2027</strong>
                                  </span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-[11px] shrink-0">
                                المدة: 32 يوماً
                              </span>
                            </div>

                            {/* Milestone 05 */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                                  05
                                </span>
                                <div>
                                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    نشر إجابات فرض المراقبة الذاتية رقم 02
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    من <strong>12 أفريل 2027</strong> إلى <strong>29 أفريل 2027</strong>
                                  </span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shrink-0">
                                المدة: 18 يوماً
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Official Ministerial Alert Banner */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-sm">
                            !
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-amber-900 dark:text-amber-200">
                              ملاحظة هامة ورسمية:
                            </h5>
                            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed font-semibold">
                              إن المشاركة في هذه التقويمات تدخل في حساب نقطة المراقبة المستمرة التي تدخل في حساب معدل النجاح السنوي.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'support') {
                    return (
                      <div key="support" className={`p-6 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-5`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mb-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>إعلان هام · الديوان الوطني للتعليم والتكوين عن بعد</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              انطلاق المرافقة البيداغوجية والنفسية عبر الأرضيات التعليمية الإلكترونية
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              ابتداءً من يوم <strong>الاثنين 02 نوفمبر 2026</strong> لفائدة جميع المتعلمين في كل المستويات والشعب
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setLightboxImage({
                                src: '/assets/aistudio/pedag_psy_d43e3690.jpeg',
                                title: 'إعلان هام - المرافقة البيداغوجية والنفسية (ONEFD)',
                                downloadName: 'اعلان_المرافقة_البيداغوجية_والنفسية_ONEFD.jpeg',
                              })
                            }
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0 cursor-pointer"
                          >
                            <ZoomIn className="w-4 h-4 text-indigo-600" />
                            <span>تكبير الإعلان 🔍</span>
                          </button>
                        </div>

                        {/* Announcement Poster Image */}
                        <div
                          onClick={() =>
                            setLightboxImage({
                              src: '/assets/aistudio/pedag_psy_d43e3690.jpeg',
                              title: 'إعلان هام - المرافقة البيداغوجية والنفسية (ONEFD)',
                              downloadName: 'اعلان_المرافقة_البيداغوجية_والنفسية_ONEFD.jpeg',
                            })
                          }
                          className="relative group rounded-2xl overflow-hidden border-2 border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50"
                          title="انقر لتكبير ومعاينة الإعلان بالحجم الكامل"
                        >
                          <img
                            src="/assets/aistudio/pedag_psy_d43e3690.jpeg"
                            alt="إعلان هام حول انطلاق المرافقة البيداغوجية والنفسية عبر الأرضيات التعليمية الإلكترونية ابتداءً من الاثنين 02 نوفمبر 2026"
                            className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                            <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-lg backdrop-blur-sm">
                              <Maximize2 className="w-4 h-4 text-emerald-600" />
                              <span>انقر لتكبير ومعاينة الإعلان 🔍</span>
                            </span>
                          </div>
                        </div>

                        {/* Highlights matching poster */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <BookOpenCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                                مرافقة بيداغوجية
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                                دعم وتوجيه دراسي مستمر عبر الأرضيات التعليمية
                              </p>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                              <HeartHandshake className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-purple-950 dark:text-purple-200">
                                مرافقة نفسية
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                                إرشاد نفسي وتحفيز للمتعلمين في كافة المستويات والشعب
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

              {/* Custom Link Sections Added by User */}
              {sections.some((s) => s.targetType === 'url') && (
                <div className={`p-5 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-3`}>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    روابط وأقسام مخصصة
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sections
                      .filter((s) => s.targetType === 'url')
                      .map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => handleSelectSection(sec)}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-right transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                              {sec.label}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate" dir="ltr">
                              {sec.targetValue}
                            </span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subpages Routing */}
          {currentView === 'registration' && (
            <RegistrationPage 
              onBack={() => setCurrentView('home')} 
              onOpenSite={handleOpenExternalSite} 
            />
          )}

          {currentView === 'documents' && (
            <DocumentsPage 
              onBack={() => setCurrentView('home')} 
              onOpenSite={handleOpenExternalSite} 
            />
          )}

          {currentView === 'homework' && (
            <HomeworkPage 
              onBack={() => setCurrentView('home')} 
              onOpenSite={handleOpenExternalSite} 
            />
          )}

          {currentView === 'platforms' && (
            <PlatformsPage 
              onBack={() => setCurrentView('home')} 
              onSelectLevel={handleSelectLevelFromPlatforms}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              onOpenSite={handleOpenExternalSite}
            />
          )}

          {currentView === 'app-topics' && (
            <AppTopicsPage
              language={currentLanguage}
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'students' && (
            <StudentsDirectoryPage
              students={registeredStudents}
              myStudentKey={myStudentKey}
              mySavedName={
                (myStudentKey &&
                  registeredStudents.find((s) => s.studentKey === myStudentKey)?.displayName) ||
                mySavedName
              }
              mySavedLevel={
                (myStudentKey &&
                  registeredStudents.find((s) => s.studentKey === myStudentKey)?.levelBadge) ||
                mySavedLevel
              }
              isAdmin={isAdmin}
              language={currentLanguage}
              onBack={() => setCurrentView('home')}
              onSaveMyStudentProfile={handleSaveMyStudentProfile}
              onAddCustomStudent={handleAddCustomStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentView === 'middle' && (
            <MiddleSchoolPage 
              onBack={() => setCurrentView('platforms')} 
              onSelectYear={(lvl) => {
                setSelectedLevel(lvl);
                setCurrentView('level-detail');
              }}
            />
          )}

          {currentView === 'secondary' && (
            <SecondarySchoolPage 
              onBack={() => setCurrentView('platforms')} 
              onSelectYear={(lvl) => {
                setSelectedLevel(SECONDARY_LEVELS[0]);
                if (lvl) {
                  setSelectedLevel(lvl);
                }
                setCurrentView('level-detail');
              }}
            />
          )}

          {currentView === 'level-detail' && selectedLevel && (
            <LevelDetailPage 
              level={selectedLevel}
              onBack={() => {
                if (selectedLevel.level === 'middle') {
                  setCurrentView('middle');
                } else {
                  setCurrentView('platforms');
                }
              }}
              onOpenSite={handleOpenExternalSite}
            />
          )}
        </div>
      </div>

      {/* Comprehensive In-App Menu with Section & Button Customization */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        isAdmin={isAdmin}
        language={currentLanguage}
        onOpenSettings={() => setIsThemeModalOpen(true)}
        sections={sections}
        homeBlocks={homeBlocks}
        officialSiteUrl={officialSiteUrl}
        onSelectSection={handleSelectSection}
        onMoveSection={handleMoveSection}
        onUpdateSection={handleUpdateSection}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onMoveHomeBlock={handleMoveHomeBlock}
        onToggleHomeBlock={handleToggleHomeBlock}
        onUpdateOfficialSiteUrl={handleUpdateOfficialSiteUrl}
        onResetLayout={handleResetLayout}
      />

      {/* Strict Mandatory Alert Modal */}
      <StrictAlertModal
        announcement={activeEmail ? pendingStrictAnnouncement : null}
        onAcknowledge={handleAcknowledgeStrict}
        onOpenSite={handleOpenExternalSite}
      />

      {/* In-App Email Picker Entry Gate & Account Modal */}
      <GoogleEntryModal
        isOpen={!activeEmail || isAccountModalOpen}
        isMandatoryGate={!activeEmail}
        isAdmin={isAdmin}
        activeEmail={activeEmail}
        savedEmails={savedEmails}
        currentUser={currentUser}
        onSelectEmail={handleSelectEmailInApp}
        onSignOut={handleSignOutAll}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* Push Notifications & Admin Sender Modal */}
      <PushNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={announcements}
        currentUser={currentUser}
        activeEmail={activeEmail}
        isAdmin={isAdmin}
        permissionState={permissionState}
        onPermissionChange={setPermissionState}
        inAppAlertsEnabled={inAppAlertsEnabled}
        onInAppAlertsChange={handleInAppAlertsChange}
        onTestNotification={() =>
          showLiveToast(
            'الإشعارات الفورية مفعّلة',
            'ستصلك جميع التنبيهات ومواعيد الفروض مباشرة داخل التطبيق.',
            'تنبيه فوري'
          )
        }
        onOpenSite={handleOpenExternalSite}
        onSignOut={handleSignOutAll}
        onPublishLocalAnnouncement={handlePublishLocalAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        localAdminEmails={localAdminEmails}
        onAddLocalAdminEmail={handleAddLocalAdminEmail}
        onRemoveLocalAdminEmail={handleRemoveLocalAdminEmail}
        initialTab={notificationTab}
      />

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {infoModal.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              {infoModal.content}
            </p>
            <button
              onClick={() => setInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom / Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[94vh] flex flex-col items-center bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-750 p-2 sm:p-4"
          >
            {/* Modal Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-black">
                  {lightboxImage.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage.src}
                  download={lightboxImage.downloadName}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تحميل الصورة</span>
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable image container */}
            <div className="w-full overflow-auto max-h-[calc(94vh-70px)] mt-2 flex items-center justify-center rounded-2xl bg-black/60 p-2">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title} 
                className="max-w-full h-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating In-App Live Notification Toast */}
      {liveToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:max-w-sm z-[60] rounded-2xl bg-slate-900/95 text-white border border-indigo-500/40 shadow-2xl p-3.5 flex items-start gap-3 animate-fadeIn backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/25 text-indigo-200 text-[10px] font-bold mb-1">
              {liveToast.tag}
            </span>
            <h4 className="text-xs font-black text-white truncate">{liveToast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{liveToast.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setLiveToast(null)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
