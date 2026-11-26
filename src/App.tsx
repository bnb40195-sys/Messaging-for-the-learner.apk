import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Menu,
  X,
  Bell,
  HeartHandshake,
  BookOpenCheck,
  ShieldCheck,
  Users,
  UserPlus,
  Pencil,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Check,
  ImagePlus,
  User,
} from 'lucide-react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { DocumentsPage } from './components/DocumentsPage';
import { HomeworkPage } from './components/HomeworkPage';
import { PlatformsPage } from './components/PlatformsPage';
import { AppTopicsPage } from './components/AppTopicsPage';
import { PdfViewerModal } from './components/PdfViewerModal';
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
import { AdminEditorPage } from './components/AdminEditorPage';
import { PdfDocumentPayload } from './lib/pdfEngine';
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
import { APP_THEMES, AppTheme, ColorMode } from './types/theme';
import {
  AppSectionItem,
  DEFAULT_HOME_BLOCKS,
  DEFAULT_OFFICIAL_SITE_URL,
  DEFAULT_SECTIONS,
  HomeBlockConfig,
  HomeBlockId,
} from './types/sections';
import {
  ButtonOrdersMap,
  ButtonOverride,
  ButtonOverridesMap,
  compressImageToDataUrl,
  CustomSectionEntry,
  DEFAULT_CALENDAR_MILESTONES,
  HeroOverride,
  HomeBlocksContentOverride,
  HomeCustomWidget,
  loadButtonOrders,
  loadButtonOverrides,
  loadHeroOverride,
  loadHomeBlocksContent,
  loadHomeWidgets,
  loadSectionEntries,
  loadSectionHeaders,
  loadShowInlineAdminTools,
  saveButtonOrders,
  saveButtonOverrides,
  saveHeroOverride,
  saveHomeBlocksContent,
  saveHomeWidgets,
  saveSectionEntries,
  saveSectionHeaders,
  saveShowInlineAdminTools,
  SectionEntriesMap,
  SectionHeaderOverride,
  SectionHeadersMap,
  SectionKey,
} from './lib/customContent';
import {
  SectionAdminToolbar,
  SectionCustomEntriesList,
  SectionCustomizationContext,
  SectionEntryModal,
  useSectionEditor,
} from './components/SectionCustomEditor';
import {
  CalendarEditModal,
  CountdownEditModal,
  HeroEditModal,
  HiddenHomeBlocksRestoreBar,
  HomeAdminBar,
  HomeBlockEditHeader,
  HomeCustomWidgetsList,
  HomeWidgetModal,
  SectionsOrderModal,
  SupportEditModal,
} from './components/HomeCustomWidgetsEditor';
import { ChevronLeft, FileText } from 'lucide-react';

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
  | 'level-detail'
  | 'custom-text'
  | 'admin-editor';

const REMOVED_SECTION_KEYS = new Set([
  'past-exams',
  'downloads',
  'curricula',
  'students',
  'registration',
]);

interface CustomTextSectionViewProps {
  section: AppSectionItem;
  cardBgClass: string;
  backLabel: string;
  customization: SectionCustomizationContext;
  onBack: () => void;
  onUpdateSection: (id: string, updates: Partial<AppSectionItem>) => void;
  onOpenSite: (url: string) => void;
  onShowInfo: (title: string, body: string) => void;
}

const CustomTextSectionView: React.FC<CustomTextSectionViewProps> = ({
  section,
  cardBgClass,
  backLabel,
  customization,
  onBack,
  onUpdateSection,
  onOpenSite,
  onShowInfo,
}) => {
  const editor = useSectionEditor(customization);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [draftLabel, setDraftLabel] = useState(section.label);
  const [draftDesc, setDraftDesc] = useState(section.desc);
  const [draftBody, setDraftBody] = useState(section.textContent || '');
  const [draftImage, setDraftImage] = useState(section.imageUrl || '');

  useEffect(() => {
    setDraftLabel(section.label);
    setDraftDesc(section.desc);
    setDraftBody(section.textContent || '');
    setDraftImage(section.imageUrl || '');
    setIsEditingContent(false);
  }, [section.id, section.label, section.desc, section.textContent, section.imageUrl]);

  return (
    <div className="min-h-full pb-16 max-w-2xl mx-auto space-y-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={backLabel}
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <span>{section.label}</span>
        </h1>

        <div className="w-11" />
      </div>

      <SectionAdminToolbar
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        hasOverrides={editor.hasOverrides}
        onToggleEditMode={() => editor.setIsEditMode((v) => !v)}
        onOpenAddEntry={(type) =>
          editor.setEntryModal({ isOpen: true, initialType: type, editingEntry: null })
        }
        onEditSectionHeader={editor.isAdmin ? () => setIsEditingContent((v) => !v) : undefined}
        onResetSectionOverrides={() => customization.onResetSectionOverrides()}
        hideButtonEditToggle={editor.entries.length === 0}
      />

      {editor.isAdmin && isEditingContent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draftLabel.trim()) return;
            onUpdateSection(section.id, {
              label: draftLabel.trim(),
              desc: draftDesc.trim(),
              textContent: draftBody.trim(),
              imageUrl: draftImage.trim() || undefined,
            });
            setIsEditingContent(false);
          }}
          className={`w-full p-5 rounded-3xl border shadow-md space-y-3 text-xs ${cardBgClass}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white">تعديل محتوى القسم</h3>
            <button
              type="button"
              onClick={() => setIsEditingContent(false)}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            required
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="عنوان القسم"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
          />
          <input
            type="text"
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            placeholder="وصف مختصر"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
          <textarea
            rows={4}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            placeholder="النص الرئيسي..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <ImagePlus className="w-4 h-4" />
              <span>{draftImage ? 'تغيير الصورة' : 'إرفاق صورة'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const dataUrl = await compressImageToDataUrl(file);
                    setDraftImage(dataUrl);
                  } catch {
                    // Ignore invalid image
                  } finally {
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {draftImage && (
              <button
                type="button"
                onClick={() => setDraftImage('')}
                className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 font-bold cursor-pointer"
              >
                حذف الصورة
              </button>
            )}
          </div>
          {draftImage && (
            <img
              src={draftImage}
              alt={draftLabel}
              className="w-full max-h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-700"
            />
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingContent(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className={`w-full p-6 rounded-3xl border shadow-md space-y-3 ${cardBgClass}`}>
          {section.desc && (
            <p className="text-xs font-bold text-blue-700 dark:text-sky-300">{section.desc}</p>
          )}
          {section.imageUrl && (
            <img
              src={section.imageUrl}
              alt={section.label}
              className="w-full max-h-80 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          )}
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {section.textContent || section.desc}
          </p>
        </div>
      )}

      <SectionCustomEntriesList
        entries={editor.entries}
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        onOpenSite={onOpenSite}
        onShowInfo={onShowInfo}
        onEditEntry={(entry) =>
          editor.setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
        }
        onDeleteEntry={(id) => customization.onDeleteCustomEntry(id)}
        onMoveEntry={(id, dir) => customization.onMoveCustomEntry(id, dir)}
      />

      <SectionEntryModal
        isOpen={editor.entryModal.isOpen}
        initialType={editor.entryModal.initialType}
        editingEntry={editor.entryModal.editingEntry}
        onSave={(entry, editingId) => customization.onSaveCustomEntry(entry, editingId)}
        onClose={() => editor.setEntryModal((p) => ({ ...p, isOpen: false }))}
      />
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('home');
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);

  // Settings: ColorMode, App Color Theme & Language state
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    try {
      const savedMode = localStorage.getItem('onefd_color_mode');
      if (savedMode === 'light' || savedMode === 'dark') return savedMode;
      return 'light';
    } catch {
      return 'light';
    }
  });

  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('onefd_app_theme') as AppTheme | null;
      return saved && saved in APP_THEMES ? saved : 'academic-blue';
    } catch {
      return 'academic-blue';
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

  // In-app PDF viewer state
  const [activePdf, setActivePdf] = useState<PdfDocumentPayload | null>(null);
  const [externalPdfFile, setExternalPdfFile] = useState<{ name: string; url: string } | null>(null);

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
      const combined = active && !parsed.includes(active) ? [active, ...parsed] : parsed;
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
        const next = parsed
          .filter(
            (s) =>
              !REMOVED_SECTION_KEYS.has(s.id) &&
              !REMOVED_SECTION_KEYS.has(s.targetValue)
          )
          .map((s) => {
            const def = DEFAULT_SECTIONS.find((d) => d.id === s.id);
            const hasLegacyColors =
              /indigo|purple|violet|pink|rose|fuchsia/i.test(s.color || '');
            let nextItem = hasLegacyColors && def ? { ...s, color: def.color } : s;
            if (
              s.id === 'documents' &&
              s.desc === 'إعادة طبع الوثائق، رقم التسجيل، وأي استفسار' &&
              def
            ) {
              nextItem = { ...nextItem, desc: def.desc };
            }
            return nextItem;
          });

        let modified = next.length !== parsed.length;

        const seededTopics = localStorage.getItem('onefd_app_topics_seeded');
        if (
          !seededTopics &&
          !next.some((s) => s.id === 'app-topics' || s.targetValue === 'app-topics')
        ) {
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

        if (
          modified ||
          next.some((s, i) => s.color !== parsed[i]?.color || s.desc !== parsed[i]?.desc)
        ) {
          localStorage.setItem('onefd_custom_sections', JSON.stringify(next));
        }
        return next.length > 0 ? next : DEFAULT_SECTIONS;
      }
      localStorage.setItem('onefd_app_topics_seeded', '1');
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

  // Button overrides, button orders, per-section custom websites/texts, and Home custom texts/images
  const [buttonOverrides, setButtonOverrides] = useState<ButtonOverridesMap>(() =>
    loadButtonOverrides()
  );
  const [buttonOrders, setButtonOrders] = useState<ButtonOrdersMap>(() => loadButtonOrders());
  const [sectionEntries, setSectionEntries] = useState<SectionEntriesMap>(() =>
    loadSectionEntries()
  );
  const [sectionHeaders, setSectionHeaders] = useState<SectionHeadersMap>(() =>
    loadSectionHeaders()
  );
  const [homeWidgets, setHomeWidgets] = useState<HomeCustomWidget[]>(() => loadHomeWidgets());
  const [heroOverride, setHeroOverride] = useState<HeroOverride>(() => loadHeroOverride());
  const [homeBlocksContent, setHomeBlocksContent] = useState<HomeBlocksContentOverride>(() =>
    loadHomeBlocksContent()
  );
  const [showInlineAdminTools, setShowInlineAdminTools] = useState<boolean>(() =>
    loadShowInlineAdminTools()
  );
  const [isHomeEditMode, setIsHomeEditMode] = useState(false);
  const [homeWidgetModal, setHomeWidgetModal] = useState<{
    isOpen: boolean;
    initialType: 'text' | 'image' | 'url';
    editingWidget: HomeCustomWidget | null;
  }>({ isOpen: false, initialType: 'text', editingWidget: null });
  const [isHeroEditModalOpen, setIsHeroEditModalOpen] = useState(false);
  const [editingHomeBlockModal, setEditingHomeBlockModal] = useState<
    null | 'countdown' | 'calendar' | 'support'
  >(null);
  const [isSectionsOrderModalOpen, setIsSectionsOrderModalOpen] = useState(false);
  const [activeTextSection, setActiveTextSection] = useState<AppSectionItem | null>(null);

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
  const [deletedStudentKeys, setDeletedStudentKeys] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_deleted_student_keys');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [localStudents, setLocalStudents] = useState<RegisteredStudentItem[]>(() => {
    try {
      const raw = localStorage.getItem('onefd_local_students');
      const parsed = raw ? (JSON.parse(raw) as RegisteredStudentItem[]) : [];
      if (!localStorage.getItem('onefd_cleanup_ali_v1')) {
        const cleaned = parsed.filter((s) => s.displayName.trim() !== 'علي');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('onefd_local_students', JSON.stringify(cleaned));
        }
        return cleaned;
      }
      return parsed;
    } catch {
      return [];
    }
  });
  const [studentRegVersion, setStudentRegVersion] = useState(0);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingLevel, setOnboardingLevel] = useState('3 ثانوي (BAC)');
  const [onboardingSaving, setOnboardingSaving] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'inbox' | 'send'>('inbox');
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>(
    () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission;
      }
      return 'unsupported';
    }
  );
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
    announcements.find((item) => item.priority === 'strict' && !ackStrictIds.includes(item.id)) ||
    null;

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

  const computeCountdownDays = (targetIso?: string) => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let examMidnight = new Date(2027, 4, 5).getTime(); // 5 May 2027 default
    if (targetIso) {
      const parts = targetIso.split('-').map(Number);
      if (parts.length === 3 && !parts.some(Number.isNaN)) {
        examMidnight = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      }
    }
    return Math.max(0, Math.round((examMidnight - todayMidnight) / (1000 * 60 * 60 * 24)));
  };

  const [examCountdownDays, setExamCountdownDays] = useState(() =>
    computeCountdownDays(homeBlocksContent.countdown?.targetDateIso)
  );

  useEffect(() => {
    const targetIso = homeBlocksContent.countdown?.targetDateIso;
    const updateCountdown = () => {
      setExamCountdownDays(computeCountdownDays(targetIso));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000);
    return () => clearInterval(interval);
  }, [homeBlocksContent.countdown?.targetDateIso]);

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
          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
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

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const savedVapid = localStorage.getItem('onefd_vapid_key') || undefined;
      initFirebaseMessaging(savedVapid);
    }

    return () => {
      unsubAuth();
      unsubAnnouncements();
      unsubStudents();
    };
  }, []);

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
  const effectiveIsAdmin = isAdmin || isCurrentEmailAdmin;
  const myStudentKey = activeEmail ? deriveStudentKey(activeEmail) : null;

  const mySavedName = useMemo(() => {
    if (!myStudentKey) return '';
    try {
      const stored = localStorage.getItem(`onefd_student_name_${myStudentKey}`);
      if (stored && stored.trim().length >= 2) return stored.trim();
    } catch {
      // Ignore storage errors
    }
    return '';
  }, [myStudentKey, studentRegVersion]);

  const mySavedLevel = useMemo(() => {
    if (!myStudentKey) return '3 ثانوي (BAC)';
    try {
      return localStorage.getItem(`onefd_student_level_${myStudentKey}`) || '3 ثانوي (BAC)';
    } catch {
      return '3 ثانوي (BAC)';
    }
  }, [myStudentKey, studentRegVersion]);

  const hasRegisteredMyStudent = useMemo(() => {
    if (!myStudentKey) return false;
    try {
      if (localStorage.getItem(`onefd_student_registered_${myStudentKey}`) === '1') {
        return true;
      }
      const storedName = localStorage.getItem(`onefd_student_name_${myStudentKey}`);
      if (storedName && storedName.trim().length >= 2 && storedName.trim() !== 'علي') {
        return true;
      }
    } catch {
      // Ignore storage errors
    }
    const cloudMatch = cloudStudents.find(
      (s) =>
        s.studentKey === myStudentKey &&
        !deletedStudentKeys.includes(s.studentKey) &&
        s.isOnline &&
        s.displayName.trim().length >= 2 &&
        s.displayName.trim() !== 'علي' &&
        !s.displayName.trim().startsWith('طالب ')
    );
    return Boolean(cloudMatch);
  }, [myStudentKey, cloudStudents, deletedStudentKeys, studentRegVersion]);

  const isOnboardingDismissed = useMemo(() => {
    if (!myStudentKey) return true;
    try {
      return localStorage.getItem(`onefd_student_onboarding_skip_${myStudentKey}`) === '1';
    } catch {
      return false;
    }
  }, [myStudentKey, studentRegVersion]);

  const registeredStudents = useMemo(() => {
    const deletedSet = new Set(deletedStudentKeys);
    const map = new Map<string, RegisteredStudentItem>();
    for (const s of localStudents) {
      if (!deletedSet.has(s.studentKey)) {
        map.set(s.studentKey, s);
      }
    }
    for (const s of cloudStudents) {
      if (!deletedSet.has(s.studentKey)) {
        map.set(s.studentKey, s);
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const aActive = a.isOnline ? 1 : 0;
      const bActive = b.isOnline ? 1 : 0;
      if (aActive !== bActive) return bActive - aActive;
      const tA = a.lastActiveAt?.toMillis?.() ?? a.lastActiveAtMs ?? 0;
      const tB = b.lastActiveAt?.toMillis?.() ?? b.lastActiveAtMs ?? 0;
      return tB - tA;
    });
  }, [cloudStudents, localStudents, deletedStudentKeys]);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
  }, [colorMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-app-theme', currentTheme);
  }, [currentTheme]);

  const handleChangeColorMode = (mode: ColorMode) => {
    setColorMode(mode);
    try {
      localStorage.setItem('onefd_color_mode', mode);
    } catch {
      // Ignore storage errors
    }
  };

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

  // One-time removal of legacy student named "علي" from both local cache and active Firestore list
  useEffect(() => {
    let alreadyCleaned = false;
    try {
      alreadyCleaned = localStorage.getItem('onefd_cleanup_ali_v1') === '1';
    } catch {
      // Ignore storage errors
    }
    const aliCloudEntries = cloudStudents.filter((s) => s.displayName.trim() === 'علي');
    const aliLocalEntries = localStudents.filter((s) => s.displayName.trim() === 'علي');
    const targets = [...aliCloudEntries, ...aliLocalEntries];

    if (targets.length === 0) {
      if (!alreadyCleaned && cloudStudents.length > 0) {
        try {
          localStorage.setItem('onefd_cleanup_ali_v1', '1');
        } catch {
          // Ignore storage errors
        }
      }
      return;
    }

    if (alreadyCleaned) return;

    const keysToDelete = Array.from(new Set(targets.map((s) => s.studentKey)));
    setDeletedStudentKeys((prev) => {
      const next = Array.from(new Set([...prev, ...keysToDelete]));
      try {
        localStorage.setItem('onefd_deleted_student_keys', JSON.stringify(next));
        localStorage.setItem('onefd_cleanup_ali_v1', '1');
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    setLocalStudents((prev) => {
      const next = prev.filter((s) => !keysToDelete.includes(s.studentKey));
      try {
        localStorage.setItem('onefd_local_students', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    for (const k of keysToDelete) {
      updateStudentPresenceOnly(k, false).catch(() => {});
      if (currentUser && isAdmin) {
        removeRegisteredStudent(k).catch(() => {});
      }
    }
  }, [cloudStudents, localStudents, currentUser, isAdmin]);

  useEffect(() => {
    if (!myStudentKey || !hasRegisteredMyStudent || !mySavedName) return;
    if (deletedStudentKeys.includes(myStudentKey)) return;

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
  }, [myStudentKey, hasRegisteredMyStudent, mySavedName, mySavedLevel, deletedStudentKeys]);

  const handleSaveMyStudentProfile = async (name: string, levelBadge: string) => {
    if (!myStudentKey) return;
    const cleanName = name.trim().slice(0, 80);
    const cleanLevel = levelBadge.trim().slice(0, 40) || 'متعلم ONEFD';
    try {
      localStorage.setItem(`onefd_student_name_${myStudentKey}`, cleanName);
      localStorage.setItem(`onefd_student_level_${myStudentKey}`, cleanLevel);
      localStorage.setItem(`onefd_student_registered_${myStudentKey}`, '1');
      localStorage.removeItem(`onefd_student_onboarding_skip_${myStudentKey}`);
    } catch {
      // Ignore storage errors
    }

    setDeletedStudentKeys((prev) => {
      if (!prev.includes(myStudentKey)) return prev;
      const next = prev.filter((k) => k !== myStudentKey);
      try {
        localStorage.setItem('onefd_deleted_student_keys', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    setStudentRegVersion((v) => v + 1);

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

  const handleDeleteStudent = async (studentKey: string) => {
    setDeletedStudentKeys((prev) => {
      const next = Array.from(new Set([...prev, studentKey]));
      try {
        localStorage.setItem('onefd_deleted_student_keys', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    setLocalStudents((prev) => {
      const next = prev.filter((s) => s.studentKey !== studentKey);
      try {
        localStorage.setItem('onefd_local_students', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    updateStudentPresenceOnly(studentKey, false).catch(() => {});

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
    } else if (section.targetType === 'text') {
      setActiveTextSection(section);
      setCurrentView('custom-text');
    } else {
      setCurrentView((section.targetValue as ScreenView) || 'home');
    }
  };

  const handleToggleShowInlineAdminTools = (show: boolean) => {
    setShowInlineAdminTools(show);
    saveShowInlineAdminTools(show);
  };

  const getSectionCustomization = (sectionKey: SectionKey): SectionCustomizationContext => ({
    isAdmin: effectiveIsAdmin,
    showInlineTools: showInlineAdminTools,
    buttonOverrides: buttonOverrides[sectionKey] || {},
    buttonOrder: buttonOrders[sectionKey] || [],
    customEntries: sectionEntries[sectionKey] || [],
    sectionHeader: sectionHeaders[sectionKey],
    onSaveButtonOverride: (buttonId: string, next: ButtonOverride) => {
      if (!effectiveIsAdmin) return;
      setButtonOverrides((prev) => {
        const updated: ButtonOverridesMap = {
          ...prev,
          [sectionKey]: {
            ...(prev[sectionKey] || {}),
            [buttonId]: next,
          },
        };
        saveButtonOverrides(updated);
        return updated;
      });
    },
    onResetButtonOverride: (buttonId: string) => {
      if (!effectiveIsAdmin) return;
      setButtonOverrides((prev) => {
        const secMap = { ...(prev[sectionKey] || {}) };
        delete secMap[buttonId];
        const updated: ButtonOverridesMap = { ...prev, [sectionKey]: secMap };
        saveButtonOverrides(updated);
        return updated;
      });
    },
    onMoveButton: (buttonId: string, dir: 'up' | 'down', defaultIds: string[]) => {
      if (!effectiveIsAdmin) return;
      setButtonOrders((prev) => {
        const existing = prev[sectionKey] || [];
        const merged = [
          ...existing.filter((id) => defaultIds.includes(id)),
          ...defaultIds.filter((id) => !existing.includes(id)),
        ];
        const extra = existing.filter((id) => !defaultIds.includes(id));
        const idx = merged.indexOf(buttonId);
        if (idx === -1) return prev;
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= merged.length) return prev;
        [merged[idx], merged[swapIdx]] = [merged[swapIdx], merged[idx]];
        const updated: ButtonOrdersMap = { ...prev, [sectionKey]: [...merged, ...extra] };
        saveButtonOrders(updated);
        return updated;
      });
    },
    onResetSectionOverrides: () => {
      if (!effectiveIsAdmin) return;
      setButtonOverrides((prev) => {
        const updated = { ...prev };
        delete updated[sectionKey];
        saveButtonOverrides(updated);
        return updated;
      });
      setButtonOrders((prev) => {
        const updated = { ...prev };
        delete updated[sectionKey];
        saveButtonOrders(updated);
        return updated;
      });
      setSectionHeaders((prev) => {
        const updated = { ...prev };
        delete updated[sectionKey];
        saveSectionHeaders(updated);
        return updated;
      });
    },
    onSaveCustomEntry: (entry: Omit<CustomSectionEntry, 'id'>, editingId?: string) => {
      if (!effectiveIsAdmin) return;
      setSectionEntries((prev) => {
        const list = prev[sectionKey] || [];
        const nextList = editingId
          ? list.map((item) => (item.id === editingId ? { ...entry, id: editingId } : item))
          : [...list, { ...entry, id: `sec_entry_${Date.now()}` }];
        const updated = { ...prev, [sectionKey]: nextList };
        saveSectionEntries(updated);
        return updated;
      });
    },
    onDeleteCustomEntry: (entryId: string) => {
      if (!effectiveIsAdmin) return;
      setSectionEntries((prev) => {
        const nextList = (prev[sectionKey] || []).filter((item) => item.id !== entryId);
        const updated = { ...prev, [sectionKey]: nextList };
        saveSectionEntries(updated);
        return updated;
      });
    },
    onMoveCustomEntry: (entryId: string, dir: 'up' | 'down') => {
      if (!effectiveIsAdmin) return;
      setSectionEntries((prev) => {
        const list = [...(prev[sectionKey] || [])];
        const idx = list.findIndex((i) => i.id === entryId);
        if (idx === -1) return prev;
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= list.length) return prev;
        const [moved] = list.splice(idx, 1);
        list.splice(swapIdx, 0, moved);
        const updated = { ...prev, [sectionKey]: list };
        saveSectionEntries(updated);
        return updated;
      });
    },
    onSaveSectionHeader: (next: SectionHeaderOverride) => {
      if (!effectiveIsAdmin) return;
      setSectionHeaders((prev) => {
        const updated: SectionHeadersMap = { ...prev, [sectionKey]: next };
        saveSectionHeaders(updated);
        return updated;
      });
    },
    onResetSectionHeader: () => {
      if (!effectiveIsAdmin) return;
      setSectionHeaders((prev) => {
        const updated = { ...prev };
        delete updated[sectionKey];
        saveSectionHeaders(updated);
        return updated;
      });
    },
  });

  const handleSaveHomeWidget = (widget: Omit<HomeCustomWidget, 'id'>, editingId?: string) => {
    if (!effectiveIsAdmin) return;
    setHomeWidgets((prev) => {
      const next = editingId
        ? prev.map((w) => (w.id === editingId ? { ...widget, id: editingId } : w))
        : [{ ...widget, id: `home_w_${Date.now()}` }, ...prev];
      saveHomeWidgets(next);
      return next;
    });
  };

  const handleDeleteHomeWidget = (id: string) => {
    if (!effectiveIsAdmin) return;
    setHomeWidgets((prev) => {
      const next = prev.filter((w) => w.id !== id);
      saveHomeWidgets(next);
      return next;
    });
  };

  const handleMoveHomeWidget = (id: string, dir: 'up' | 'down') => {
    if (!effectiveIsAdmin) return;
    setHomeWidgets((prev) => {
      const list = [...prev];
      const idx = list.findIndex((w) => w.id === id);
      if (idx === -1) return prev;
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return prev;
      const [moved] = list.splice(idx, 1);
      list.splice(swapIdx, 0, moved);
      saveHomeWidgets(list);
      return list;
    });
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    if (!effectiveIsAdmin) return;
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
    if (!effectiveIsAdmin) return;
    const next = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    persistSections(next);
    if (activeTextSection?.id === id) {
      setActiveTextSection((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const handleAddSection = (newSection: Omit<AppSectionItem, 'id'>) => {
    if (!effectiveIsAdmin) return;
    const item: AppSectionItem = {
      ...newSection,
      id: `custom_sec_${Date.now()}`,
    };
    persistSections([...sections, item]);
  };

  const handleDeleteSection = (id: string) => {
    if (!effectiveIsAdmin) return;
    const next = sections.filter((s) => s.id !== id);
    persistSections(next);
    if (activeTextSection?.id === id) {
      setActiveTextSection(null);
      setCurrentView('home');
    }
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
    if (!effectiveIsAdmin) return;
    const idx = homeBlocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= homeBlocks.length) return;
    const next = [...homeBlocks];
    const [moved] = next.splice(idx, 1);
    next.splice(swapIdx, 0, moved);
    persistHomeBlocks(next);
  };

  const handleMoveVisibleHomeBlock = (id: HomeBlockId, direction: 'up' | 'down') => {
    if (!effectiveIsAdmin) return;
    const visibleBlocks = homeBlocks.filter((b) => b.visible);
    const vIdx = visibleBlocks.findIndex((b) => b.id === id);
    if (vIdx === -1) return;
    const targetVIdx = direction === 'up' ? vIdx - 1 : vIdx + 1;
    if (targetVIdx < 0 || targetVIdx >= visibleBlocks.length) return;
    const targetId = visibleBlocks[targetVIdx].id;
    const idxA = homeBlocks.findIndex((b) => b.id === id);
    const idxB = homeBlocks.findIndex((b) => b.id === targetId);
    if (idxA === -1 || idxB === -1) return;
    const next = [...homeBlocks];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    persistHomeBlocks(next);
  };

  const handleToggleHomeBlock = (id: HomeBlockId) => {
    if (!effectiveIsAdmin) return;
    const next = homeBlocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b));
    persistHomeBlocks(next);
  };

  const handleOpenHomeBlockEditor = (id: HomeBlockId) => {
    if (id === 'hero') {
      setIsHeroEditModalOpen(true);
    } else {
      setEditingHomeBlockModal(id);
    }
  };

  const handleUpdateOfficialSiteUrl = (url: string) => {
    if (!effectiveIsAdmin) return;
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
    if (!effectiveIsAdmin) return;
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

  const activeThemeConfig = APP_THEMES[currentTheme] || APP_THEMES['academic-blue'];
  const activeBgClass = activeThemeConfig.bgGradient;
  const t = TRANSLATIONS[currentLanguage];

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

  const handleClosePdfModal = () => {
    setActivePdf(null);
    if (externalPdfFile?.url) {
      URL.revokeObjectURL(externalPdfFile.url);
    }
    setExternalPdfFile(null);
  };

  if (!authReady) {
    return (
      <div
        className={`min-h-screen ${activeBgClass} flex flex-col items-center justify-center p-6 text-center`}
      >
        <img
          src="/app-logo.png"
          alt={t.appName}
          className="w-20 h-20 rounded-3xl shadow-xl shadow-blue-600/20 object-cover mb-4"
        />
        <h1 className="text-lg font-black text-slate-900 dark:text-white">{t.appName}</h1>
        <p className="text-xs font-bold text-blue-700 dark:text-sky-300 mt-1">{t.seasonTag}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${activeBgClass} transition-colors duration-300 pb-10`}>
      {/* App Settings Modal (Appearance, Language, App Colors) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        colorMode={colorMode}
        currentTheme={currentTheme}
        currentLanguage={currentLanguage}
        onChangeColorMode={handleChangeColorMode}
        onSelectTheme={(th) => {
          setCurrentTheme(th);
          document.documentElement.setAttribute('data-app-theme', th);
          try {
            localStorage.setItem('onefd_app_theme', th);
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
          <div className="flex items-center justify-between gap-2 mb-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Drawer Menu Trigger + App Brand */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md shadow-blue-600/20 transition-transform active:scale-95 cursor-pointer shrink-0"
                title={t.menuTitle}
                aria-label={t.menuTitle}
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2.5 text-start group cursor-pointer min-w-0"
              >
                <img
                  src="/app-logo.png"
                  alt={t.appName}
                  className="w-11 h-11 rounded-2xl shadow-md shadow-blue-600/15 object-cover group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                    {t.appName}
                  </h1>
                  <span className="text-[11px] text-blue-700 dark:text-sky-300 font-bold block truncate">
                    {t.seasonTag}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Install PWA Offline App Button */}
              <div className="hidden sm:block">
                <PWAInstallButton compact />
              </div>

              {/* Personal Account Button (Replaced Top-Bar Modifications) */}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={
                  currentLanguage === 'fr'
                    ? 'Mon compte'
                    : currentLanguage === 'en'
                      ? 'My Account'
                      : 'الحساب الشخصي'
                }
                aria-label={
                  currentLanguage === 'fr'
                    ? 'Mon compte'
                    : currentLanguage === 'en'
                      ? 'My Account'
                      : 'الحساب الشخصي'
                }
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={activeEmail || t.loginBtn}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-blue-300 dark:border-blue-700"
                  />
                ) : (
                  <User className="w-4 h-4 shrink-0" />
                )}
                <span className="hidden md:inline text-xs font-extrabold">
                  {currentLanguage === 'fr'
                    ? 'Mon compte'
                    : currentLanguage === 'en'
                      ? 'My Account'
                      : 'الحساب الشخصي'}
                </span>
              </button>

              {/* Admin Status Button */}
              {effectiveIsAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setNotificationTab('send');
                    setIsNotificationsOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  title={t.adminBadge}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline text-xs font-extrabold">{t.adminBadge}</span>
                </button>
              )}

              {/* Notifications Bell Button (hidden for admin since Admin button opens notifications) */}
              {!effectiveIsAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setNotificationTab('inbox');
                    setIsNotificationsOpen(true);
                  }}
                  className="relative flex items-center gap-1.5 px-3 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  title={t.notifications}
                  aria-label={t.notifications}
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline text-xs font-extrabold">{t.notifications}</span>
                  {announcements.length > 0 && (
                    <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      {announcements.length}
                    </span>
                  )}
                </button>
              )}

              {/* Registered Students Trigger (Moved in place of Settings) */}
              <button
                type="button"
                onClick={() => setCurrentView('students')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-11 rounded-2xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  currentView === 'students'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-sky-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
                title="الطلاب المسجلون"
                aria-label="الطلاب المسجلون"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-xs font-extrabold">الطلاب المسجلون</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard / Home View */}
          {currentView === 'home' && (
            <div className="space-y-6">
              <HomeAdminBar
                isAdmin={effectiveIsAdmin && showInlineAdminTools}
                isHomeEditMode={isHomeEditMode}
                onToggleEditMode={() => setIsHomeEditMode((v) => !v)}
                onAddWidget={(type) =>
                  setHomeWidgetModal({ isOpen: true, initialType: type, editingWidget: null })
                }
                onEditHero={() => setIsHeroEditModalOpen(true)}
                onOpenOrderModal={() => setIsSectionsOrderModalOpen(true)}
              />

              {effectiveIsAdmin && showInlineAdminTools && isHomeEditMode && (
                <HiddenHomeBlocksRestoreBar
                  hiddenBlocks={homeBlocks
                    .filter((b) => !b.visible)
                    .map((b) => ({ id: b.id, label: b.label }))}
                  onRestore={(id) => handleToggleHomeBlock(id as HomeBlockId)}
                />
              )}

              <HomeCustomWidgetsList
                widgets={homeWidgets}
                isAdmin={effectiveIsAdmin && showInlineAdminTools}
                isEditMode={isHomeEditMode}
                cardBgClass={activeThemeConfig.cardBg}
                onOpenSite={handleOpenExternalSite}
                onEditWidget={(w) =>
                  setHomeWidgetModal({
                    isOpen: true,
                    initialType: w.type,
                    editingWidget: w,
                  })
                }
                onDeleteWidget={handleDeleteHomeWidget}
                onMoveWidget={handleMoveHomeWidget}
              />

              {(() => {
                const visibleBlocks = homeBlocks.filter((b) => b.visible);
                const countdownOv = homeBlocksContent.countdown;
                const calendarOv = homeBlocksContent.calendar;
                const supportOv = homeBlocksContent.support;
                const calendarMilestones =
                  calendarOv?.milestones && calendarOv.milestones.length > 0
                    ? calendarOv.milestones
                    : DEFAULT_CALENDAR_MILESTONES;

                return visibleBlocks.map((block, vIdx) => {
                  const editHeader =
                    effectiveIsAdmin && showInlineAdminTools && isHomeEditMode ? (
                      <HomeBlockEditHeader
                        label={block.label}
                        canMoveUp={vIdx > 0}
                        canMoveDown={vIdx < visibleBlocks.length - 1}
                        onEdit={() => handleOpenHomeBlockEditor(block.id)}
                        onMoveUp={() => handleMoveVisibleHomeBlock(block.id, 'up')}
                        onMoveDown={() => handleMoveVisibleHomeBlock(block.id, 'down')}
                        onHide={() => handleToggleHomeBlock(block.id)}
                      />
                    ) : null;

                  if (block.id === 'hero') {
                    return (
                      <div key="hero">
                        {editHeader}
                        <div
                          className={`relative overflow-hidden rounded-3xl ${activeThemeConfig.headerBg} text-white p-6 sm:p-8 shadow-xl shadow-blue-900/15`}
                        >
                          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                          <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-sky-100 mb-3 border border-white/20">
                              <span>{heroOverride.badge || t.heroCountry}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black leading-snug">
                              {heroOverride.title || t.heroTitle}
                            </h2>
                            <p className="text-xs sm:text-sm text-sky-100/95 mt-2 leading-relaxed whitespace-pre-line">
                              {heroOverride.subtitle || t.heroSubtitle}
                            </p>
                            {heroOverride.imageUrl && (
                              <img
                                src={heroOverride.imageUrl}
                                alt={heroOverride.title || t.heroTitle}
                                className="mt-4 w-full max-h-60 object-cover rounded-2xl border border-white/20 shadow-md"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'countdown') {
                    return (
                      <div key="countdown">
                        {editHeader}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-400/30 shadow-xl shadow-slate-900/25 relative overflow-hidden">
                          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

                          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-white">
                                {countdownOv?.title || t.countdownTitle}
                              </h3>
                              <p className="text-xs text-sky-200 mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                                <span>{countdownOv?.desc || t.countdownDesc}</span>
                              </p>
                            </div>

                            {/* Days Only Display */}
                            <div className="w-full sm:w-auto min-w-[170px] px-7 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0">
                              <span className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight block leading-none tabular-nums">
                                {examCountdownDays}
                              </span>
                              <span className="text-xs font-extrabold text-sky-100 mt-2 block">
                                {countdownOv?.daysLabel || t.daysRemaining}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'calendar') {
                    return (
                      <div key="calendar">
                        {editHeader}
                        <div
                          className={`p-6 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-5`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mb-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>
                                  {calendarOv?.badge ||
                                    'الديوان الوطني للتعليم والتكوين عن بعد · الرزنامة الرسمية'}
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                {calendarOv?.title ||
                                  'رزنامة التقويمات التكوينية للمتعلمين عن بعد للسنة الدراسية 2026-2027'}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                                {calendarOv?.subtitle ||
                                  'المواعيد المعتمدة لفروض المراقبة الذاتية، نشر الإجابات، والفرض الإلكتروني'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-blue-700 dark:text-sky-300 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                              <span>
                                {calendarOv?.sectionLabel ||
                                  'تفاصيل المحطات والتقويمات الخمسة المعتمدة بالرزنامة:'}
                              </span>
                            </h4>

                            <div className="grid grid-cols-1 gap-2.5">
                              {calendarMilestones.map((m, mIdx) => {
                                const badgeColors = m.isPrimary
                                  ? 'bg-blue-600 text-white'
                                  : mIdx % 2 === 0
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-amber-500 text-white';
                                const rowStyle = m.isPrimary
                                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/60'
                                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800';
                                const durationStyle = m.isPrimary
                                  ? 'bg-blue-200/80 dark:bg-blue-900/60 text-blue-900 dark:text-sky-200'
                                  : mIdx % 2 === 0
                                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300';

                                return (
                                  <div
                                    key={`${m.num}_${mIdx}`}
                                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${rowStyle}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`w-9 h-9 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${badgeColors}`}
                                      >
                                        {m.num}
                                      </span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h5
                                            className={`text-xs font-extrabold ${
                                              m.isPrimary
                                                ? 'text-blue-900 dark:text-sky-200'
                                                : 'text-slate-900 dark:text-white'
                                            }`}
                                          >
                                            {m.title}
                                          </h5>
                                          {m.badgeText && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                                              {m.badgeText}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                          {m.dateText}
                                        </span>
                                      </div>
                                    </div>
                                    <span
                                      className={`px-3 py-1 rounded-full font-bold text-[11px] shrink-0 ${durationStyle}`}
                                    >
                                      {m.durationText}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Official Ministerial Alert Banner */}
                          {(calendarOv?.noteTitle || calendarOv?.noteBody || !calendarOv) && (
                            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-sm">
                                !
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-amber-900 dark:text-amber-200">
                                  {calendarOv?.noteTitle || 'ملاحظة هامة ورسمية:'}
                                </h5>
                                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed font-semibold">
                                  {calendarOv?.noteBody ||
                                    'إن المشاركة في هذه التقويمات تدخل في حساب نقطة المراقبة المستمرة التي تدخل في حساب معدل النجاح السنوي.'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (block.id === 'support') {
                    return (
                      <div key="support">
                        {editHeader}
                        <div
                          className={`p-6 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-5`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800/60 text-[11px] font-bold mb-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                                <span>
                                  {supportOv?.badge ||
                                    'مرافقة بيداغوجية ونفسية مستمرة · الديوان الوطني للتعليم والتكوين عن بعد'}
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                {supportOv?.title ||
                                  'انطلاق المرافقة البيداغوجية والنفسية عبر الأرضيات التعليمية الإلكترونية'}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                                {supportOv?.subtitle ||
                                  'ابتداءً من يوم الاثنين 02 نوفمبر 2026 لفائدة جميع المتعلمين في كل المستويات والشعب'}
                              </p>
                            </div>
                          </div>

                          {/* Pedagogical & Psychological support cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <BookOpenCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                  {supportOv?.card1Title || 'مرافقة بيداغوجية'}
                                </h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                  {supportOv?.card1Desc ||
                                    'دعم وتوجيه دراسي مستمر عبر الأرضيات التعليمية'}
                                </p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                                <HeartHandshake className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                  {supportOv?.card2Title || 'مرافقة نفسية'}
                                </h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                  {supportOv?.card2Desc ||
                                    'إرشاد نفسي وتحفيز للمتعلمين في كافة المستويات والشعب'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                });
              })()}

              {/* Custom Link Sections Added by User */}
              {(sections.some((s) => s.targetType === 'url') ||
                (effectiveIsAdmin && showInlineAdminTools && isHomeEditMode)) && (
                <div
                  className={`p-5 rounded-3xl ${activeThemeConfig.cardBg} border shadow-md space-y-3`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      روابط وأقسام مخصصة
                    </h3>
                    {effectiveIsAdmin && showInlineAdminTools && isHomeEditMode && (
                      <button
                        type="button"
                        onClick={() => setIsSectionsOrderModalOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>ترتيب / إضافة قسم</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sections
                      .filter((s) => s.targetType === 'url')
                      .map((sec) => (
                        <div key={sec.id} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleSelectSection(sec)}
                            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-right transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                                {sec.label}
                              </span>
                              <span
                                className="text-[10px] text-slate-500 dark:text-slate-300 block truncate"
                                dir="ltr"
                              >
                                {sec.targetValue}
                              </span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                          </button>
                          {effectiveIsAdmin && showInlineAdminTools && isHomeEditMode && (
                            <div className="flex items-center justify-end gap-1 px-1">
                              <button
                                type="button"
                                onClick={() => handleMoveSection(sec.id, 'up')}
                                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                                title="تحريك"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveSection(sec.id, 'down')}
                                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                                title="تحريك"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsSectionsOrderModalOpen(true)}
                                className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-300 cursor-pointer"
                                title="تعديل"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(sec.id)}
                                className="p-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subpages Routing */}
          {(currentView === 'documents' || currentView === 'registration') && (
            <DocumentsPage
              onBack={() => setCurrentView('home')}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('documents')}
            />
          )}

          {currentView === 'homework' && (
            <HomeworkPage
              onBack={() => setCurrentView('home')}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('homework')}
            />
          )}

          {currentView === 'platforms' && (
            <PlatformsPage
              onBack={() => setCurrentView('home')}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              onOpenSite={handleOpenExternalSite}
              customization={getSectionCustomization('platforms')}
            />
          )}

          {currentView === 'app-topics' && (
            <AppTopicsPage
              language={currentLanguage}
              onBack={() => setCurrentView('home')}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('app-topics')}
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
              hasRegisteredMyStudent={hasRegisteredMyStudent}
              isAdmin={effectiveIsAdmin}
              language={currentLanguage}
              onBack={() => setCurrentView('home')}
              onSaveMyStudentProfile={handleSaveMyStudentProfile}
              onDeleteStudent={handleDeleteStudent}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('students')}
            />
          )}

          {currentView === 'middle' && (
            <MiddleSchoolPage
              onBack={() => setCurrentView('platforms')}
              onSelectYear={(lvl) => {
                setSelectedLevel(lvl);
                setCurrentView('level-detail');
              }}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('middle')}
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
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization('secondary')}
            />
          )}

          {currentView === 'custom-text' && activeTextSection && (
            <CustomTextSectionView
              section={activeTextSection}
              cardBgClass={activeThemeConfig.cardBg}
              backLabel={t.backLabel}
              customization={getSectionCustomization(`custom-text-${activeTextSection.id}`)}
              onBack={() => setCurrentView('home')}
              onUpdateSection={handleUpdateSection}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
            />
          )}

          {currentView === 'admin-editor' && effectiveIsAdmin && (
            <AdminEditorPage
              onBack={() => setCurrentView('home')}
              sections={sections}
              homeBlocks={homeBlocks}
              homeWidgets={homeWidgets}
              heroOverride={heroOverride}
              officialSiteUrl={officialSiteUrl}
              showInlineAdminTools={showInlineAdminTools}
              onToggleShowInlineAdminTools={handleToggleShowInlineAdminTools}
              getSectionCustomization={getSectionCustomization}
              onMoveSection={handleMoveSection}
              onUpdateSection={handleUpdateSection}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              onMoveHomeBlock={handleMoveHomeBlock}
              onToggleHomeBlock={handleToggleHomeBlock}
              onEditHomeBlock={handleOpenHomeBlockEditor}
              onAddHomeWidget={(type) =>
                setHomeWidgetModal({ isOpen: true, initialType: type, editingWidget: null })
              }
              onEditHomeWidget={(w) =>
                setHomeWidgetModal({
                  isOpen: true,
                  initialType: w.type,
                  editingWidget: w,
                })
              }
              onDeleteHomeWidget={handleDeleteHomeWidget}
              onMoveHomeWidget={handleMoveHomeWidget}
              onUpdateOfficialSiteUrl={handleUpdateOfficialSiteUrl}
              onResetLayout={handleResetLayout}
              onOpenSite={handleOpenExternalSite}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
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
              onOpenPdf={(payload) => {
                setExternalPdfFile(null);
                setActivePdf(payload);
              }}
              onShowInfo={(title, content) => setInfoModal({ title, content })}
              customization={getSectionCustomization(`level-detail-${selectedLevel.id}`)}
            />
          )}
        </div>
      </div>

      {/* Comprehensive In-App Menu */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        isAdmin={effectiveIsAdmin}
        language={currentLanguage}
        onOpenSettings={() => setIsThemeModalOpen(true)}
        onOpenAdminEditor={() => setCurrentView('admin-editor')}
        sections={sections}
        onSelectSection={handleSelectSection}
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
        isAdmin={effectiveIsAdmin}
        activeEmail={activeEmail}
        savedEmails={savedEmails}
        currentUser={currentUser}
        onSelectEmail={handleSelectEmailInApp}
        onSignOut={handleSignOutAll}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* One-Time Student Registration Prompt Upon Entry */}
      {Boolean(activeEmail) &&
        Boolean(myStudentKey) &&
        !isAccountModalOpen &&
        !hasRegisteredMyStudent &&
        !isOnboardingDismissed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setOnboardingError(null);
                const clean = onboardingName.trim();
                if (clean.length < 2) {
                  setOnboardingError('يرجى كتابة الاسم الكامل للطالب (حرفان على الأقل).');
                  return;
                }
                setOnboardingSaving(true);
                try {
                  await handleSaveMyStudentProfile(clean, onboardingLevel);
                  setOnboardingName('');
                } catch {
                  setOnboardingError('تعذر حفظ معلومات الطالب، حاول مرة أخرى.');
                } finally {
                  setOnboardingSaving(false);
                }
              }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    تسجيل الطالب (مرة واحدة عند الدخول)
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    يُضاف طالب واحد لحسابك ويمكنك تعديل معلوماتك لاحقاً في أي وقت
                  </p>
                </div>
              </div>

              {onboardingError && (
                <p className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-bold text-red-700 dark:text-red-300">
                  {onboardingError}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الكامل للطالب:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    autoFocus
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    placeholder="مثال: محمد أمين بن عبد الله"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المستوى الدراسي:
                  </label>
                  <select
                    value={onboardingLevel}
                    onChange={(e) => setOnboardingLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {[
                      '3 ثانوي (BAC)',
                      '2 ثانوي',
                      '1 ثانوي',
                      '4 متوسط (BEM)',
                      '3 متوسط',
                      '2 متوسط',
                      '1 متوسط',
                      'متعلم ONEFD',
                    ].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={onboardingSaving}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {onboardingSaving ? 'جاري التسجيل...' : 'حفظ وتسجيل الطالب'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (myStudentKey) {
                      try {
                        localStorage.setItem(`onefd_student_onboarding_skip_${myStudentKey}`, '1');
                      } catch {
                        // Ignore storage errors
                      }
                      setStudentRegVersion((v) => v + 1);
                    }
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  لاحقاً
                </button>
              </div>
            </form>
          </div>
        )}

      {/* Push Notifications & Admin Sender Modal */}
      <PushNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={announcements}
        currentUser={currentUser}
        activeEmail={activeEmail}
        isAdmin={effectiveIsAdmin}
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

      {/* In-App PDF Reader & Downloader Modal */}
      <PdfViewerModal
        documentPayload={activePdf}
        externalPdfFile={externalPdfFile}
        onClose={handleClosePdfModal}
      />

      {/* Home Custom Widget (Text / Image / Website) & Block Editor Modals */}
      <HomeWidgetModal
        isOpen={homeWidgetModal.isOpen}
        initialType={homeWidgetModal.initialType}
        editingWidget={homeWidgetModal.editingWidget}
        onSave={handleSaveHomeWidget}
        onClose={() => setHomeWidgetModal((p) => ({ ...p, isOpen: false }))}
      />

      <HeroEditModal
        isOpen={isHeroEditModalOpen}
        current={heroOverride}
        defaultBadge={t.heroCountry}
        defaultTitle={t.heroTitle}
        defaultSubtitle={t.heroSubtitle}
        onSave={(next) => {
          setHeroOverride(next);
          saveHeroOverride(next);
        }}
        onReset={() => {
          setHeroOverride({});
          saveHeroOverride({});
        }}
        onClose={() => setIsHeroEditModalOpen(false)}
      />

      <CountdownEditModal
        isOpen={editingHomeBlockModal === 'countdown'}
        current={homeBlocksContent.countdown}
        defaultTitle={t.countdownTitle}
        defaultDesc={t.countdownDesc}
        defaultDaysLabel={t.daysRemaining}
        onSave={(next) => {
          const updated: HomeBlocksContentOverride = { ...homeBlocksContent, countdown: next };
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onReset={() => {
          const updated = { ...homeBlocksContent };
          delete updated.countdown;
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onClose={() => setEditingHomeBlockModal(null)}
      />

      <CalendarEditModal
        isOpen={editingHomeBlockModal === 'calendar'}
        current={homeBlocksContent.calendar}
        onSave={(next) => {
          const updated: HomeBlocksContentOverride = { ...homeBlocksContent, calendar: next };
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onReset={() => {
          const updated = { ...homeBlocksContent };
          delete updated.calendar;
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onClose={() => setEditingHomeBlockModal(null)}
      />

      <SupportEditModal
        isOpen={editingHomeBlockModal === 'support'}
        current={homeBlocksContent.support}
        onSave={(next) => {
          const updated: HomeBlocksContentOverride = { ...homeBlocksContent, support: next };
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onReset={() => {
          const updated = { ...homeBlocksContent };
          delete updated.support;
          setHomeBlocksContent(updated);
          saveHomeBlocksContent(updated);
        }}
        onClose={() => setEditingHomeBlockModal(null)}
      />

      <SectionsOrderModal
        isOpen={isSectionsOrderModalOpen}
        sections={sections}
        homeBlocks={homeBlocks}
        onMoveSection={handleMoveSection}
        onUpdateSection={handleUpdateSection}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onMoveHomeBlock={handleMoveHomeBlock}
        onToggleHomeBlock={handleToggleHomeBlock}
        onEditHomeBlock={handleOpenHomeBlockEditor}
        onResetLayout={handleResetLayout}
        onClose={() => setIsSectionsOrderModalOpen(false)}
      />

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {infoModal.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed whitespace-pre-line">
              {infoModal.content}
            </p>
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {/* Floating In-App Live Notification Toast */}
      {liveToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:max-w-sm z-[60] rounded-2xl bg-slate-900/95 text-white border border-blue-500/40 shadow-2xl p-3.5 flex items-start gap-3 animate-fadeIn backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/25 text-sky-200 text-[10px] font-bold mb-1">
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
