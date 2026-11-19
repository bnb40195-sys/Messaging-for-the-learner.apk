import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  Send,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Mail,
  UserPlus,
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  ADMIN_EMAIL,
  AdminEmailItem,
  AnnouncementPriority,
  LiveAnnouncement,
  publishAnnouncement,
  subscribeToAdminEmails,
  addAdminEmail,
  removeAdminEmail,
  triggerLocalPushNotification,
  playAlertChime,
  initFirebaseMessaging,
  savePushSubscription,
} from '../lib/firebase';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface PushNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: LiveAnnouncement[];
  currentUser: FirebaseUser | null;
  activeEmail: string;
  isAdmin: boolean;
  permissionState: NotificationPermission | 'unsupported';
  onPermissionChange: (state: NotificationPermission | 'unsupported') => void;
  inAppAlertsEnabled: boolean;
  onInAppAlertsChange: (enabled: boolean) => void;
  onTestNotification?: () => void;
  onOpenSite: (url: string) => void;
  onSignOut: () => void;
  onPublishLocalAnnouncement: (payload: {
    title: string;
    body: string;
    tag: string;
    priority: AnnouncementPriority;
    targetUrl?: string;
    authorEmail: string;
  }) => void;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  localAdminEmails: string[];
  onAddLocalAdminEmail: (email: string) => string;
  onRemoveLocalAdminEmail: (email: string) => void;
  initialTab?: 'inbox' | 'send';
}

export const PushNotificationsModal: React.FC<PushNotificationsModalProps> = ({
  isOpen,
  onClose,
  announcements,
  currentUser,
  activeEmail,
  isAdmin,
  permissionState,
  onPermissionChange,
  inAppAlertsEnabled,
  onInAppAlertsChange,
  onTestNotification,
  onOpenSite,
  onSignOut,
  onPublishLocalAnnouncement,
  onDeleteAnnouncement,
  localAdminEmails,
  onAddLocalAdminEmail,
  onRemoveLocalAdminEmail,
  initialTab = 'inbox',
}) => {
  const isOnline = useOnlineStatus();

  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('هام جداً');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetUrl, setTargetUrl] = useState('');
  const [vapidKey, setVapidKey] = useState(() => localStorage.getItem('onefd_vapid_key') || '');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const [adminEmails, setAdminEmails] = useState<AdminEmailItem[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSavingAdminEmail, setIsSavingAdminEmail] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setActiveTab('inbox');
    } else if (isOpen && initialTab === 'send') {
      setActiveTab('send');
    }
  }, [isOpen, initialTab, isAdmin]);

  useEffect(() => {
    if (!isOpen || !isAdmin) {
      setAdminEmails([]);
      return;
    }
    const unsub = subscribeToAdminEmails(
      (items) => setAdminEmails(items),
      () => setAdminEmails([])
    );
    return () => unsub();
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    setStatusFeedback(null);
    setIsEnablingPush(true);

    try {
      // Always enable real-time in-app alerts + chime immediately so notifications work reliably
      onInAppAlertsChange(true);
      playAlertChime(false);

      if (typeof window === 'undefined' || !('Notification' in window)) {
        onPermissionChange('unsupported');
        onTestNotification?.();
        setStatusFeedback({
          type: 'success',
          message: 'تم تفعيل الإشعارات الفورية والتنبيه الصوتي داخل التطبيق بنجاح.',
        });
        return;
      }

      let finalPermission: NotificationPermission = Notification.permission;
      if (finalPermission === 'default') {
        try {
          finalPermission = await Notification.requestPermission();
        } catch {
          finalPermission = Notification.permission;
        }
      }
      onPermissionChange(finalPermission);

      if (finalPermission === 'granted') {
        const { token } = await initFirebaseMessaging(vapidKey);
        if (token) {
          setFcmToken(token);
          if (currentUser?.uid) {
            await savePushSubscription({
              userId: currentUser.uid,
              fcmToken: token,
              notificationsEnabled: true,
            });
          }
        }

        await triggerLocalPushNotification(
          'تم تفعيل الإشعارات الفورية بنجاح',
          'ستصلك تنبيهات الفروض الإلكترونية ومواعيد الامتحانات مباشرة على جهازك.'
        );
        onTestNotification?.();

        setStatusFeedback({
          type: 'success',
          message: token
            ? 'تم تفعيل الإشعارات وربط الجهاز بخدمة الإشعارات الفورية (FCM).'
            : 'تم تفعيل الإشعارات الفورية والتنبيه الصوتي بنجاح.',
        });
      } else {
        // Fallback smoothly to in-app live notifications + audio alert when browser/WebView blocks external push
        onTestNotification?.();
        setStatusFeedback({
          type: 'success',
          message:
            'تم تفعيل الإشعارات الفورية والتنبيه الصوتي داخل التطبيق بنجاح! ستصلك التنبيهات فور نشرها.',
        });
      }
    } catch {
      onInAppAlertsChange(true);
      onTestNotification?.();
      setStatusFeedback({
        type: 'success',
        message: 'تم تفعيل الإشعارات الفورية والتنبيه الصوتي داخل التطبيق بنجاح.',
      });
    } finally {
      setIsEnablingPush(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);

    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (cleanTitle.length < 2 || cleanBody.length < 2) {
      setStatusFeedback({
        type: 'error',
        message: 'يرجى إدخال عنوان ومحتوى صالحين للإشعار.',
      });
      return;
    }

    setIsSending(true);
    try {
      const isStrict = priority === 'strict';
      if (currentUser && isOnline) {
        await publishAnnouncement({
          title: cleanTitle,
          body: cleanBody,
          tag,
          priority,
          targetUrl: targetUrl || undefined,
        });
      } else {
        onPublishLocalAnnouncement({
          title: cleanTitle,
          body: cleanBody,
          tag,
          priority,
          targetUrl: targetUrl.trim() || undefined,
          authorEmail: activeEmail || ADMIN_EMAIL,
        });
      }

      playAlertChime(isStrict);
      if (permissionState === 'granted') {
        await triggerLocalPushNotification(
          isStrict ? `🚨 إشعار صارم: ${cleanTitle}` : cleanTitle,
          cleanBody,
          targetUrl || undefined,
          isStrict
        );
      }

      setTitle('');
      setBody('');
      setPriority('normal');
      setTargetUrl('');
      setStatusFeedback({
        type: 'success',
        message: isStrict
          ? 'تم إرسال الإشعار الصارم بنجاح وسيظهر فوراً كتنبيه إلزامي على شاشات الطلبة.'
          : 'تم إرسال ونشر الإشعار بنجاح داخل التطبيق.',
      });
      setActiveTab('inbox');
    } catch (err) {
      setStatusFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'فشل نشر الإشعار.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);
    const normalized = newAdminEmail.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalized) || normalized.length > 120) {
      setStatusFeedback({
        type: 'error',
        message: 'يرجى إدخال بريد إلكتروني صحيح.',
      });
      return;
    }

    setIsSavingAdminEmail(true);
    try {
      const saved = onAddLocalAdminEmail(normalized);
      if (currentUser && isOnline) {
        await addAdminEmail(saved);
      }
      setNewAdminEmail('');
      setStatusFeedback({
        type: 'success',
        message: `تم اعتماد البريد الإلكتروني (${saved}) كمشرف بنجاح.`,
      });
    } catch (err) {
      setStatusFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'تعذر حفظ البريد الإلكتروني للمشرف.',
      });
    } finally {
      setIsSavingAdminEmail(false);
    }
  };

  const handleRemoveAdminEmailItem = async (email: string) => {
    onRemoveLocalAdminEmail(email);
    if (currentUser && isOnline) {
      try {
        await removeAdminEmail(email);
      } catch {
        // Ignore if only stored locally
      }
    }
  };

  const mergedDelegatedAdminEmails = Array.from(
    new Set([
      ...localAdminEmails.map((e) => e.trim().toLowerCase()),
      ...adminEmails.map((item) => item.email.trim().toLowerCase()),
    ])
  ).filter((email) => email && email !== ADMIN_EMAIL.toLowerCase());

  const formatTimestamp = (item: LiveAnnouncement) => {
    try {
      const date = item.createdAt
        ? item.createdAt.toDate()
        : item.createdAtMs
        ? new Date(item.createdAtMs)
        : null;
      if (!date) return 'الآن';
      return date.toLocaleDateString('ar-DZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'حديث';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                الإشعارات الفورية والتنبيهات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                تزامن مباشر وتنبيهات فورية معتمدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs: Admin tab ONLY appears when signed-in Google account is Admin */}
        {isAdmin && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>الإشعارات الواردة ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'send'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>قسم المشرف · إرسال إشعار</span>
            </button>
          </div>
        )}

        {/* Status Feedback */}
        {statusFeedback && (
          <div
            className={`mb-3 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
              statusFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}
          >
            {statusFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusFeedback.message}</span>
          </div>
        )}

        {/* TAB 1: INBOX & PUSH PERMISSION */}
        {(!isAdmin || activeTab === 'inbox') && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {/* Enable Push & In-App Alerts Banner */}
            {(() => {
              const isAlertsActive = permissionState === 'granted' || inAppAlertsEnabled;
              return (
                <div
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isAlertsActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/35 dark:to-teal-950/25 border-emerald-200/80 dark:border-emerald-800/60'
                      : 'bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/30 border-indigo-200/80 dark:border-indigo-800/60'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isAlertsActive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <BellRing className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                      <span>
                        حالة الإشعارات الفورية:{' '}
                        {permissionState === 'granted'
                          ? 'مفعّلة (الجهاز + التطبيق)'
                          : inAppAlertsEnabled
                          ? 'مفعّلة داخل التطبيق'
                          : 'غير مفعّلة بعد'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {isAlertsActive
                        ? 'تصلك التنبيهات ومواعيد الفروض فوراً على شاشة التطبيق مع نغمة تنبيه.'
                        : 'فعّل الإشعارات ليصلك كل تنبيه أو موعد فرض فوري داخل التطبيق وعلى جهازك.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {!isAlertsActive || permissionState === 'default' ? (
                      <button
                        onClick={handleEnablePush}
                        disabled={isEnablingPush}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm shrink-0 cursor-pointer disabled:opacity-60"
                      >
                        {isEnablingPush ? 'جاري التفعيل...' : 'تفعيل الإشعارات 🔔'}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            playAlertChime(false);
                            onTestNotification?.();
                            if (permissionState === 'granted') {
                              triggerLocalPushNotification(
                                'تجربة الإشعار الفوري',
                                'نظام الإشعارات الفورية والتنبيه الصوتي يعمل بنجاح.'
                              );
                            }
                            setStatusFeedback({
                              type: 'success',
                              message: 'نظام الإشعارات الفورية والتنبيه الصوتي يعمل بنجاح.',
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>تجربة التنبيه</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onInAppAlertsChange(false)}
                          className="px-2.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold hover:bg-slate-100 cursor-pointer"
                        >
                          إيقاف مؤقت
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Announcements List */}
            {announcements.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  لا توجد إشعارات منشورة حالياً
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  ستظهر هنا جميع التنبيهات الرسمية ومواعيد الفروض فور نشرها.
                </p>
              </div>
            ) : (
              announcements.map((item) => {
                const isStrict = item.priority === 'strict';
                return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl space-y-2 ${
                    isStrict
                      ? 'bg-rose-50/90 dark:bg-rose-950/35 border-2 border-rose-400/80 dark:border-rose-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isStrict && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>إشعار صارم</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {item.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimestamp(item)}</span>
                      </span>

                      {isAdmin && (
                        <button
                          onClick={() => onDeleteAnnouncement(item.id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="حذف الإشعار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.body}
                  </p>

                  {item.targetUrl && (
                    <button
                      onClick={() => onOpenSite(item.targetUrl!)}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                    >
                      <span>فتح الرابط المرفق</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
                );
              })
            )}

          </div>
        )}

        {/* TAB 2: ADMIN SECTION (ONLY RENDERED WHEN VERIFIED ADMIN EMAIL IS SIGNED IN) */}
        {isAdmin && activeTab === 'send' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-0.5">
            <form onSubmit={handlePublish} className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">قسم المشرف مفعل: {activeEmail || currentUser?.email}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer shrink-0 mr-2"
                >
                  خروج
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الإشعار
                </label>
                <input
                  type="text"
                  required
                  maxLength={140}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: انطلاق الفرض الإلكتروني الأول 2026/2027"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  مستوى صرامة الإشعار
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('normal')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      priority === 'normal'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>إشعار عادي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPriority('strict');
                      if (tag === 'هام جداً') setTag('إشعار صارم');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      priority === 'strict'
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>إشعار صارم وعاجل</span>
                  </button>
                </div>

                {priority === 'strict' && (
                  <p className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] font-bold text-rose-700 dark:text-rose-300 leading-relaxed">
                    سيظهر هذا الإشعار كنافذة تنبيه إجبارية وبارزة أمام جميع المتعلمين مع صوت تنبيه ولا يختفي إلا بعد الضغط على «تم الاطلاع».
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التصنيف
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="إشعار صارم">إشعار صارم</option>
                  <option value="هام جداً">هام جداً</option>
                  <option value="الفرض الإلكتروني">الفرض الإلكتروني</option>
                  <option value="المعلام">المعلام</option>
                  <option value="الاستدعاءات والنتائج">الاستدعاءات والنتائج</option>
                  <option value="تنبيه عام">تنبيه عام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نص الإشعار
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="اكتب تفاصيل الإشعار التي ستظهر على شاشات الطلبة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط مرفق (اختياري)
                </label>
                <input
                  type="url"
                  maxLength={300}
                  dir="ltr"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://devoir.onefd.edu.dz/"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <details className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                <summary className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  إعداد مفتاح Web Push (VAPID) للإرسال من لوحة Firebase (اختياري)
                </summary>
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={vapidKey}
                    onChange={(e) => {
                      setVapidKey(e.target.value);
                      localStorage.setItem('onefd_vapid_key', e.target.value);
                    }}
                    placeholder="أدخل مفتاح VAPID من Firebase Cloud Messaging"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono"
                  />
                  {fcmToken && (
                    <p className="text-[10px] text-emerald-600 break-all font-mono" dir="ltr">
                      Token: {fcmToken}
                    </p>
                  )}
                </div>
              </details>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3 rounded-xl hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                  priority === 'strict'
                    ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 shadow-rose-600/25'
                    : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600'
                }`}
              >
                {priority === 'strict' ? <ShieldAlert className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>
                  {isSending
                    ? 'جاري الإرسال...'
                    : priority === 'strict'
                    ? 'إرسال إشعار صارم وعاجل الآن'
                    : 'إرسال ونشر الإشعار الآن'}
                </span>
              </button>
            </form>

            {/* Admin-Only Email Configuration */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>تغيير / إضافة البريد الإلكتروني للمشرف</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70">
                  <span className="font-mono text-emerald-800 dark:text-emerald-300 truncate" dir="ltr">
                    {ADMIN_EMAIL}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    أساسي
                  </span>
                </div>

                {mergedDelegatedAdminEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate" dir="ltr">
                      {email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmailItem(email)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="إزالة هذا البريد من صلاحية المشرف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddAdminEmail} className="flex gap-2">
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="new-admin@gmail.com"
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-left"
                />
                <button
                  type="submit"
                  disabled={isSavingAdminEmail}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSavingAdminEmail ? 'جاري الحفظ...' : 'اعتماد البريد'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
