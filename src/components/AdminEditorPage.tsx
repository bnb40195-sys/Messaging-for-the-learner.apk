import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  FileText,
  Globe,
  ImagePlus,
  LayoutGrid,
  Layers,
  Pencil,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  DOCUMENT_ACTIONS,
  E_DEVOIR_MIDDLE,
  E_DEVOIR_SECONDARY,
  MIDDLE_LEVELS,
  SECONDARY_LEVELS,
} from '../data/dirasaData';
import {
  getTopicsForSelection,
  TOPIC_LEVEL_DEFINITIONS,
  TopicLevelId,
} from '../data/appTopicsBank';
import {
  compressImageToDataUrl,
  HeroOverride,
  HomeCustomWidget,
  normalizeExternalUrl,
  SectionKey,
  sortItemsByOrder,
} from '../lib/customContent';
import { AppSectionItem, HomeBlockConfig, HomeBlockId } from '../types/sections';
import {
  ButtonEditModal,
  EditableButtonTarget,
  SectionCustomEntriesList,
  SectionCustomizationContext,
  SectionEntryModal,
  SectionHeaderEditModal,
} from './SectionCustomEditor';

interface SectionButtonCatalogItem {
  id: string;
  defaultLabel: string;
  defaultSubtitle?: string;
  defaultUrl?: string;
  groupTag?: string;
}

interface EditableSectionOption {
  key: SectionKey;
  label: string;
  category: 'main' | 'levels' | 'custom';
  defaultTitle: string;
  defaultSubtitle?: string;
  defaultNote?: string;
  buttons?: SectionButtonCatalogItem[];
  customSectionItem?: AppSectionItem;
}

const SECTION_COLORS = [
  'from-blue-600 to-sky-600',
  'from-emerald-600 to-teal-600',
  'from-red-600 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-amber-600 to-orange-600',
];

interface AdminEditorPageProps {
  onBack: () => void;
  sections: AppSectionItem[];
  homeBlocks: HomeBlockConfig[];
  homeWidgets: HomeCustomWidget[];
  heroOverride: HeroOverride;
  officialSiteUrl: string;
  showInlineAdminTools: boolean;
  onToggleShowInlineAdminTools: (show: boolean) => void;
  getSectionCustomization: (sectionKey: SectionKey) => SectionCustomizationContext;
  onMoveSection: (id: string, dir: 'up' | 'down') => void;
  onUpdateSection: (id: string, updates: Partial<AppSectionItem>) => void;
  onAddSection: (newSection: Omit<AppSectionItem, 'id'>) => void;
  onDeleteSection: (id: string) => void;
  onMoveHomeBlock: (id: HomeBlockId, dir: 'up' | 'down') => void;
  onToggleHomeBlock: (id: HomeBlockId) => void;
  onEditHomeBlock: (id: HomeBlockId) => void;
  onAddHomeWidget: (type: 'text' | 'image' | 'url') => void;
  onEditHomeWidget: (widget: HomeCustomWidget) => void;
  onDeleteHomeWidget: (id: string) => void;
  onMoveHomeWidget: (id: string, dir: 'up' | 'down') => void;
  onUpdateOfficialSiteUrl: (url: string) => void;
  onResetLayout: () => void;
  onOpenSite: (url: string) => void;
  onShowInfo: (title: string, body: string) => void;
}

export const AdminEditorPage: React.FC<AdminEditorPageProps> = ({
  onBack,
  sections,
  homeBlocks,
  homeWidgets,
  heroOverride,
  officialSiteUrl,
  showInlineAdminTools,
  onToggleShowInlineAdminTools,
  getSectionCustomization,
  onMoveSection,
  onUpdateSection,
  onAddSection,
  onDeleteSection,
  onMoveHomeBlock,
  onToggleHomeBlock,
  onEditHomeBlock,
  onAddHomeWidget,
  onEditHomeWidget,
  onDeleteHomeWidget,
  onMoveHomeWidget,
  onUpdateOfficialSiteUrl,
  onResetLayout,
  onOpenSite,
  onShowInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'buttons' | 'sections' | 'home'>('buttons');

  // Official Site URL form
  const [siteUrlDraft, setSiteUrlDraft] = useState(officialSiteUrl);
  const [siteUrlSaved, setSiteUrlSaved] = useState(false);

  useEffect(() => {
    setSiteUrlDraft(officialSiteUrl);
  }, [officialSiteUrl]);

  // App Topics level/stream picker for editing topic buttons
  const topicCombos = useMemo(() => {
    const list: { key: string; levelId: TopicLevelId; streamId: string; label: string }[] = [];
    for (const lvl of TOPIC_LEVEL_DEFINITIONS) {
      if (lvl.stage === 'middle') {
        list.push({
          key: `${lvl.id}::general`,
          levelId: lvl.id,
          streamId: 'general',
          label: lvl.cardLabel,
        });
      } else {
        for (const st of lvl.streams) {
          list.push({
            key: `${lvl.id}::${st.id}`,
            levelId: lvl.id,
            streamId: st.id,
            label: `${lvl.cardLabel} · ${st.label}`,
          });
        }
      }
    }
    return list;
  }, []);
  const [selectedTopicComboKey, setSelectedTopicComboKey] = useState<string>('3as::sci');

  // Homework tab filter inside the editor so Secondary & Middle button positions are super clear
  const [homeworkGroupTab, setHomeworkGroupTab] = useState<'secondary' | 'middle'>('secondary');

  // Catalog of all editable sections
  const sectionOptions: EditableSectionOption[] = useMemo(() => {
    const activeTopicCombo =
      topicCombos.find((c) => c.key === selectedTopicComboKey) || topicCombos[0];
    const topicButtons: SectionButtonCatalogItem[] = activeTopicCombo
      ? getTopicsForSelection(activeTopicCombo.levelId, activeTopicCombo.streamId).map((tp) => ({
          id: tp.id,
          defaultLabel: tp.buttonLabel,
          defaultSubtitle: `${tp.quizQuestions.length} سؤال`,
          defaultUrl: '',
        }))
      : [];

    const mainOptions: EditableSectionOption[] = [
      {
        key: 'platforms',
        label: 'الأرضيات التعليمية (المعلام)',
        category: 'main',
        defaultTitle: 'الأرضيات التعليمية (المعلام)',
        defaultSubtitle: '',
        buttons: [
          {
            id: 'middle',
            defaultLabel: 'المتوسط',
            defaultSubtitle: 'scolarium-moyen.onefd.edu.dz',
            defaultUrl: 'https://scolarium-moyen.onefd.edu.dz/',
          },
          {
            id: '1as',
            defaultLabel: 'أولى ثانوي',
            defaultSubtitle: 'scolarium-1as.onefd.edu.dz',
            defaultUrl: 'https://scolarium-1as.onefd.edu.dz/',
          },
          {
            id: '2as',
            defaultLabel: 'ثانية ثانوي',
            defaultSubtitle: 'scolarium-2as.onefd.edu.dz',
            defaultUrl: 'https://scolarium-2as.onefd.edu.dz/',
          },
          {
            id: '3as',
            defaultLabel: 'ثالثة ثانوي',
            defaultSubtitle: 'scolarium-3as.onefd.edu.dz',
            defaultUrl: 'https://scolarium-3as.onefd.edu.dz/',
          },
        ],
      },
      {
        key: 'documents',
        label: 'سحب الوثائق',
        category: 'main',
        defaultTitle: 'سحب الوثائق',
        defaultSubtitle: '',
        buttons: [
          ...DOCUMENT_ACTIONS.map((a) => ({
            id: a.id,
            defaultLabel: a.title,
            defaultSubtitle: a.description,
            defaultUrl: a.externalUrl,
          })),
          {
            id: 'correspondence-reg',
            defaultLabel: 'تسجيل المراسلة',
            defaultSubtitle: 'تسجيل متعلم سابق وتسجيل متعلم جديد',
            defaultUrl: '',
          },
          {
            id: 'old-student',
            defaultLabel: 'تسجيل متعلم سابق',
            defaultSubtitle: 'inscriptic.onefd.edu.dz · تأكيد الهوية وإعادة التسجيل',
            defaultUrl: 'https://inscriptic.onefd.edu.dz/old-student/verify-identity',
          },
          {
            id: 'new-student',
            defaultLabel: 'تسجيل متعلم جديد',
            defaultSubtitle: 'inscriptic.onefd.edu.dz · إنشاء حساب وتسجيل لأول مرة',
            defaultUrl: 'https://inscriptic.onefd.edu.dz/new-student/create-account',
          },
        ],
      },
      {
        key: 'homework',
        label: 'الفرض الإلكتروني الرسمي',
        category: 'main',
        defaultTitle: 'الفرض الإلكتروني الرسمي',
        defaultSubtitle: '',
        defaultNote:
          'اضغط على السنة الدراسية للانتقال مباشرة إلى بوابة الفرض الخاصة بمستواك واحتساب نقطة المراقبة المستمرة.',
        buttons: [
          ...E_DEVOIR_SECONDARY.map((l) => ({
            id: l.id,
            defaultLabel: l.name,
            defaultSubtitle: l.fullDomain,
            defaultUrl: l.url,
            groupTag: 'secondary',
          })),
          ...E_DEVOIR_MIDDLE.map((l) => ({
            id: l.id,
            defaultLabel: l.name,
            defaultSubtitle: l.fullDomain,
            defaultUrl: l.url,
            groupTag: 'middle',
          })),
        ],
      },
      {
        key: 'middle',
        label: 'المستوى المتوسط (قائمة السنوات)',
        category: 'main',
        defaultTitle: 'المستوى المتوسط',
        defaultSubtitle: '',
        buttons: MIDDLE_LEVELS.map((l) => ({
          id: l.id,
          defaultLabel: l.name,
          defaultSubtitle: 'الدروس والملخصات',
          defaultUrl: l.eDevoirUrl,
        })),
      },
      {
        key: 'secondary',
        label: 'المستوى الثانوي (قائمة السنوات)',
        category: 'main',
        defaultTitle: 'المستوى الثانوي',
        defaultSubtitle: '',
        buttons: SECONDARY_LEVELS.map((l) => ({
          id: l.id,
          defaultLabel: l.name,
          defaultSubtitle: 'الدروس والملخصات',
          defaultUrl: l.eDevoirUrl,
        })),
      },
      {
        key: 'app-topics',
        label: 'مواضيع وأسئلة التطبيق',
        category: 'main',
        defaultTitle: 'مواضيع وأسئلة التطبيق',
        defaultSubtitle: '',
        buttons: topicButtons,
      },
      {
        key: 'students',
        label: 'الطلاب المسجلون',
        category: 'main',
        defaultTitle: 'الطلاب المسجلون',
        defaultSubtitle: '',
        buttons: [],
      },
    ];

    const levelOptions: EditableSectionOption[] = [...SECONDARY_LEVELS, ...MIDDLE_LEVELS].map(
      (lvl) => ({
        key: `level-detail-${lvl.id}`,
        label: `صفحة: ${lvl.name}`,
        category: 'levels',
        defaultTitle: lvl.name,
        defaultSubtitle: `منهاج ودروس ${lvl.name} 2026/2027`,
        defaultNote: lvl.description,
        buttons: [
          {
            id: 'hero-edevoir',
            defaultLabel: 'الفرض الإلكتروني ↗',
            defaultSubtitle: 'بوابة الفرض الإلكتروني',
            defaultUrl: lvl.eDevoirUrl,
          },
          {
            id: 'hero-scolarium',
            defaultLabel: 'أرضية المعلام ↗',
            defaultSubtitle: 'منصة الدروس الرسمية',
            defaultUrl: lvl.scolariumUrl,
          },
        ],
      })
    );

    const customTextOptions: EditableSectionOption[] = sections
      .filter((s) => s.targetType === 'text')
      .map((s) => ({
        key: `custom-text-${s.id}`,
        label: `قسم مضاف: ${s.label}`,
        category: 'custom',
        defaultTitle: s.label,
        defaultSubtitle: s.desc,
        defaultNote: s.textContent,
        buttons: [],
        customSectionItem: s,
      }));

    return [...mainOptions, ...levelOptions, ...customTextOptions];
  }, [sections, topicCombos, selectedTopicComboKey]);

  const [selectedSectionKey, setSelectedSectionKey] = useState<SectionKey>('platforms');
  const activeSectionOption =
    sectionOptions.find((o) => o.key === selectedSectionKey) || sectionOptions[0];
  const activeCustomization = getSectionCustomization(activeSectionOption.key);

  // Modals for per-section button editing, custom entry adding/editing, and header editing
  const [editingButton, setEditingButton] = useState<EditableButtonTarget | null>(null);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [entryModal, setEntryModal] = useState<{
    isOpen: boolean;
    initialType: 'url' | 'text' | 'image';
    editingEntry: ReturnType<typeof getSectionCustomization>['customEntries'][number] | null;
  }>({ isOpen: false, initialType: 'url', editingEntry: null });

  // Custom-text section direct editor inside AdminEditorPage
  const [customSecDraft, setCustomSecDraft] = useState<{
    isOpen: boolean;
    label: string;
    desc: string;
    textContent: string;
    imageUrl: string;
  }>({ isOpen: false, label: '', desc: '', textContent: '', imageUrl: '' });

  // SideDrawer section editor state (Tab 2: sections)
  const [editingDrawerSecId, setEditingDrawerSecId] = useState<string | null>(null);
  const [drawerEditLabel, setDrawerEditLabel] = useState('');
  const [drawerEditDesc, setDrawerEditDesc] = useState('');
  const [drawerEditType, setDrawerEditType] = useState<'view' | 'url' | 'text'>('view');
  const [drawerEditUrl, setDrawerEditUrl] = useState('');
  const [drawerEditText, setDrawerEditText] = useState('');
  const [drawerEditImage, setDrawerEditImage] = useState('');

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSecType, setNewSecType] = useState<'url' | 'text'>('url');
  const [newSecLabel, setNewSecLabel] = useState('');
  const [newSecDesc, setNewSecDesc] = useState('');
  const [newSecUrl, setNewSecUrl] = useState('https://');
  const [newSecText, setNewSecText] = useState('');
  const [newSecImage, setNewSecImage] = useState('');
  const [newSecColor, setNewSecColor] = useState(SECTION_COLORS[0]);

  const startEditDrawerSec = (item: AppSectionItem) => {
    setEditingDrawerSecId(item.id);
    setDrawerEditLabel(item.label);
    setDrawerEditDesc(item.desc);
    setDrawerEditType(item.targetType);
    setDrawerEditUrl(item.targetValue);
    setDrawerEditText(item.textContent || '');
    setDrawerEditImage(item.imageUrl || '');
  };

  const saveEditDrawerSec = (id: string) => {
    const cleanLabel = drawerEditLabel.trim();
    if (!cleanLabel) return;
    onUpdateSection(id, {
      label: cleanLabel,
      desc: drawerEditDesc.trim(),
      targetType: drawerEditType,
      targetValue:
        drawerEditType === 'url'
          ? normalizeExternalUrl(drawerEditUrl)
          : drawerEditType === 'text'
            ? 'text-page'
            : drawerEditUrl.trim() || 'home',
      textContent: drawerEditType === 'text' ? drawerEditText.trim() : undefined,
      imageUrl: drawerEditType === 'text' ? drawerEditImage.trim() || undefined : undefined,
    });
    setEditingDrawerSecId(null);
  };

  const handleAddDrawerSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = newSecLabel.trim();
    if (!cleanLabel) return;

    if (newSecType === 'text') {
      const cleanText = newSecText.trim();
      if (!cleanText && !newSecImage.trim()) return;
      onAddSection({
        label: cleanLabel,
        desc: newSecDesc.trim() || cleanText.slice(0, 60) || 'صورة ومحتوى مخصص',
        targetType: 'text',
        targetValue: 'text-page',
        textContent: cleanText,
        imageUrl: newSecImage.trim() || undefined,
        iconName: 'file',
        color: newSecColor,
      });
    } else {
      const normalized = normalizeExternalUrl(newSecUrl);
      if (!normalized) return;
      onAddSection({
        label: cleanLabel,
        desc: newSecDesc.trim() || normalized,
        targetType: 'url',
        targetValue: normalized,
        iconName: 'globe',
        color: newSecColor,
      });
    }

    setNewSecLabel('');
    setNewSecDesc('');
    setNewSecUrl('https://');
    setNewSecText('');
    setNewSecImage('');
    setIsAddingSection(false);
  };

  // Filtered & sorted buttons for the selected section
  const allSectionButtons = activeSectionOption.buttons || [];
  const allSectionButtonIds = allSectionButtons.map((b) => b.id);
  const displayedSectionButtons = useMemo(() => {
    const sorted = sortItemsByOrder(
      allSectionButtons,
      (b) => b.id,
      activeCustomization.buttonOrder
    );
    if (activeSectionOption.key === 'homework') {
      return sorted.filter((b) => b.groupTag === homeworkGroupTab);
    }
    return sorted;
  }, [
    allSectionButtons,
    activeCustomization.buttonOrder,
    activeSectionOption.key,
    homeworkGroupTab,
  ]);

  const handleMoveDisplayedButton = (btnId: string, dir: 'up' | 'down') => {
    if (!activeCustomization.onMoveButton) return;
    activeCustomization.onMoveButton(
      btnId,
      dir,
      displayedSectionButtons.map((b) => b.id)
    );
  };

  const sectionHasOverrides =
    Object.keys(activeCustomization.buttonOverrides).length > 0 ||
    (activeCustomization.buttonOrder?.length || 0) > 0 ||
    Boolean(
      activeCustomization.sectionHeader?.title ||
        activeCustomization.sectionHeader?.subtitle ||
        activeCustomization.sectionHeader?.note
    );

  return (
    <div className="min-h-full pb-16 max-w-2xl mx-auto space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center min-w-0">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
            <span className="truncate">قسم التعديلات والتخصيص</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            إدارة الأقسام، تغيير مواقع الأزرار، وتعديل المحتوى من مكان واحد
          </p>
        </div>

        <div className="w-11 shrink-0" />
      </div>

      {/* Mode Switch Banner */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xs font-black text-slate-900 dark:text-white">
            وضع الصفحات النظيف
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {showInlineAdminTools
              ? 'أشرطة التعديل ظاهرة أيضاً داخل كل صفحة'
              : 'كل التعديلات محوّلة إلى هذا القسم فقط لإبقاء الصفحات نظيفة'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onToggleShowInlineAdminTools(!showInlineAdminTools)}
          className={`px-3 py-2 rounded-2xl text-[11px] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            showInlineAdminTools
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50'
          }`}
        >
          {showInlineAdminTools ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showInlineAdminTools ? 'إخفاء أزرار التعديل بالصفحات' : 'إظهار التعديل بالصفحات أيضاً'}</span>
        </button>
      </div>

      {/* 3 Primary Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('buttons')}
          className={`min-h-[44px] py-2 px-2 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'buttons'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">الأزرار والأقسام</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`min-h-[44px] py-2 px-2 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">ترتيب القائمة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`min-h-[44px] py-2 px-2 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">الواجهة الرئيسية</span>
        </button>
      </div>

      {/* TAB 1: SECTION HEADERS, BUTTON ORDERING, RENAMING, URLS & CUSTOM ENTRIES */}
      {activeTab === 'buttons' && (
        <div className="space-y-4">
          {/* Section Selector */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
              اختر القسم الذي تريد تعديله أو تغيير مواقع أزراره:
            </label>
            <select
              value={activeSectionOption.key}
              onChange={(e) => {
                setSelectedSectionKey(e.target.value as SectionKey);
                setCustomSecDraft((p) => ({ ...p, isOpen: false }));
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white"
            >
              <optgroup label="الأقسام الرئيسية">
                {sectionOptions
                  .filter((o) => o.category === 'main')
                  .map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="صفحات السنوات الدراسية">
                {sectionOptions
                  .filter((o) => o.category === 'levels')
                  .map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
              </optgroup>
              {sectionOptions.some((o) => o.category === 'custom') && (
                <optgroup label="الأقسام المضافة">
                  {sectionOptions
                    .filter((o) => o.category === 'custom')
                    .map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>

            {/* Quick Section Header Info & Edit Button */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 block">
                  عنوان القسم الحالي
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {activeCustomization.sectionHeader?.title || activeSectionOption.defaultTitle}
                </h3>
                {(activeCustomization.sectionHeader?.subtitle || activeSectionOption.defaultSubtitle) && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {activeCustomization.sectionHeader?.subtitle || activeSectionOption.defaultSubtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeSectionOption.customSectionItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      const sec = activeSectionOption.customSectionItem!;
                      setCustomSecDraft({
                        isOpen: true,
                        label: sec.label,
                        desc: sec.desc,
                        textContent: sec.textContent || '',
                        imageUrl: sec.imageUrl || '',
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>تعديل محتوى القسم</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsHeaderModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>تعديل العنوان والوصف</span>
                  </button>
                )}

                {sectionHasOverrides && (
                  <button
                    type="button"
                    onClick={() => activeCustomization.onResetSectionOverrides()}
                    className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="استعادة الافتراضي لهذا القسم"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Inline Custom-Text Section Editor if selected */}
            {customSecDraft.isOpen && activeSectionOption.customSectionItem && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customSecDraft.label.trim()) return;
                  onUpdateSection(activeSectionOption.customSectionItem!.id, {
                    label: customSecDraft.label.trim(),
                    desc: customSecDraft.desc.trim(),
                    textContent: customSecDraft.textContent.trim(),
                    imageUrl: customSecDraft.imageUrl.trim() || undefined,
                  });
                  setCustomSecDraft((p) => ({ ...p, isOpen: false }));
                }}
                className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2.5 text-xs"
              >
                <span className="font-black text-blue-800 dark:text-sky-200 block">
                  تعديل نص وصورة القسم المضاف:
                </span>
                <input
                  type="text"
                  required
                  value={customSecDraft.label}
                  onChange={(e) => setCustomSecDraft((p) => ({ ...p, label: e.target.value }))}
                  placeholder="عنوان القسم"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={customSecDraft.desc}
                  onChange={(e) => setCustomSecDraft((p) => ({ ...p, desc: e.target.value }))}
                  placeholder="وصف مختصر"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <textarea
                  rows={3}
                  value={customSecDraft.textContent}
                  onChange={(e) =>
                    setCustomSecDraft((p) => ({ ...p, textContent: e.target.value }))
                  }
                  placeholder="المحتوى النصي"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
                <div className="flex flex-wrap gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <ImagePlus className="w-4 h-4" />
                    <span>{customSecDraft.imageUrl ? 'تغيير الصورة' : 'إرفاق صورة'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await compressImageToDataUrl(file);
                          setCustomSecDraft((p) => ({ ...p, imageUrl: dataUrl }));
                        } catch {
                          // Ignore invalid image
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                  {customSecDraft.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomSecDraft((p) => ({ ...p, imageUrl: '' }))}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold cursor-pointer"
                    >
                      حذف الصورة
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-black cursor-pointer"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomSecDraft((p) => ({ ...p, isOpen: false }))}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section Built-in Buttons Reorder + Rename + URL Edit */}
          {allSectionButtons.length > 0 && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  مواقع وترتيب أزرار القسم ({displayedSectionButtons.length})
                </h3>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  استعمل السهمين لتغيير موقع أي زر
                </span>
              </div>

              {activeSectionOption.key === 'homework' && (
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setHomeworkGroupTab('secondary')}
                    className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                      homeworkGroupTab === 'secondary'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    المستوى الثانوي
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeworkGroupTab('middle')}
                    className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                      homeworkGroupTab === 'middle'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    المستوى المتوسط
                  </button>
                </div>
              )}

              {activeSectionOption.key === 'app-topics' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    اختر المستوى والشعبة لعرض أزرار المواد:
                  </label>
                  <select
                    value={selectedTopicComboKey}
                    onChange={(e) => setSelectedTopicComboKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {topicCombos.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                {displayedSectionButtons.map((btn, idx) => {
                  const ov = activeCustomization.buttonOverrides[btn.id];
                  const displayName = ov?.label || btn.defaultLabel;
                  const displayUrlOrSub =
                    ov?.actionType === 'text'
                      ? `نص: ${ov.textTitle || displayName}`
                      : ov?.url || btn.defaultUrl || ov?.subtitle || btn.defaultSubtitle || '';

                  return (
                    <div
                      key={btn.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                        ov?.hidden
                          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 opacity-75'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {displayName}
                          </span>
                          {ov?.hidden && (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[9px] font-bold">
                              مخفي
                            </span>
                          )}
                        </div>
                        {displayUrlOrSub && (
                          <span
                            className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5"
                            dir="auto"
                          >
                            {displayUrlOrSub}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveDisplayedButton(btn.id, 'up')}
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-blue-50 cursor-pointer"
                          title="تحريك الزر للأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === displayedSectionButtons.length - 1}
                          onClick={() => handleMoveDisplayedButton(btn.id, 'down')}
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-blue-50 cursor-pointer"
                          title="تحريك الزر للأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingButton({
                              id: btn.id,
                              defaultLabel: btn.defaultLabel,
                              defaultSubtitle: btn.defaultSubtitle,
                              defaultUrl: btn.defaultUrl,
                            })
                          }
                          className="px-2.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                          title="تعديل الاسم أو الرابط"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            activeCustomization.onSaveButtonOverride(btn.id, {
                              ...(ov || {}),
                              hidden: !ov?.hidden,
                            })
                          }
                          className={`p-2 rounded-xl cursor-pointer ${
                            ov?.hidden
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-600'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                          }`}
                          title={ov?.hidden ? 'إظهار الزر' : 'إخفاء الزر'}
                        >
                          {ov?.hidden ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Entries inside the selected section (Add Website/Button, Text, Image + Reorder) */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              أزرار ومواقع ونصوص وصور إضافية في هذا القسم ({activeCustomization.customEntries.length})
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  setEntryModal({ isOpen: true, initialType: 'url', editingEntry: null })
                }
                className="py-2.5 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة زر / موقع</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setEntryModal({ isOpen: true, initialType: 'text', editingEntry: null })
                }
                className="py-2.5 px-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة نص</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setEntryModal({ isOpen: true, initialType: 'image', editingEntry: null })
                }
                className="py-2.5 px-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة صورة</span>
              </button>
            </div>

            {activeCustomization.customEntries.length === 0 ? (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-3">
                لا توجد عناصر مضافة بعد في هذا القسم. اضغط أحد الأزرار أعلاه للإضافة.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <SectionCustomEntriesList
                  entries={activeCustomization.customEntries}
                  isAdmin={true}
                  isEditMode={true}
                  onOpenSite={onOpenSite}
                  onShowInfo={onShowInfo}
                  onEditEntry={(entry) =>
                    setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
                  }
                  onDeleteEntry={(id) => activeCustomization.onDeleteCustomEntry(id)}
                  onMoveEntry={(id, dir) => activeCustomization.onMoveCustomEntry(id, dir)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SIDE DRAWER SECTIONS REORDERING, RENAMING & ADDING */}
      {activeTab === 'sections' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                ترتيب وأسماء أقسام القائمة الجانبية ({sections.length})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                غيّر ترتيب الأقسام أو عدّل أسماءها أو أضف قسماً جديداً (موقع أو نص وصورة)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingSection((v) => !v)}
              className="px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          {isAddingSection && (
            <form
              onSubmit={handleAddDrawerSectionSubmit}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewSecType('url')}
                  className={`py-2 rounded-xl font-bold cursor-pointer ${
                    newSecType === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  قسم لموقع ويب
                </button>
                <button
                  type="button"
                  onClick={() => setNewSecType('text')}
                  className={`py-2 rounded-xl font-bold cursor-pointer ${
                    newSecType === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  صفحة نص وصورة
                </button>
              </div>
              <input
                type="text"
                required
                value={newSecLabel}
                onChange={(e) => setNewSecLabel(e.target.value)}
                placeholder={newSecType === 'url' ? 'اسم القسم أو الموقع' : 'عنوان الصفحة النصية'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newSecDesc}
                onChange={(e) => setNewSecDesc(e.target.value)}
                placeholder="وصف مختصر (اختياري)"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              {newSecType === 'url' ? (
                <input
                  type="url"
                  dir="ltr"
                  required
                  value={newSecUrl}
                  onChange={(e) => setNewSecUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                />
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    required={!newSecImage.trim()}
                    value={newSecText}
                    onChange={(e) => setNewSecText(e.target.value)}
                    placeholder="اكتب المحتوى النصي..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                  />
                  <label className="w-full py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>{newSecImage ? 'تم إرفاق صورة (اضغط للتغيير)' : 'إرفاق صورة (اختياري)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await compressImageToDataUrl(file);
                          setNewSecImage(dataUrl);
                        } catch {
                          // Ignore invalid image
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                {SECTION_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewSecColor(c)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} cursor-pointer ${
                      newSecColor === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
                >
                  حفظ وإضافة القسم
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSection(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              >
                {editingDrawerSecId === sec.id ? (
                  <div className="space-y-2.5 text-xs">
                    <input
                      type="text"
                      value={drawerEditLabel}
                      onChange={(e) => setDrawerEditLabel(e.target.value)}
                      placeholder="اسم القسم"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={drawerEditDesc}
                      onChange={(e) => setDrawerEditDesc(e.target.value)}
                      placeholder="وصف مختصر"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDrawerEditType('url')}
                        className={`py-1.5 rounded-lg font-bold cursor-pointer ${
                          drawerEditType === 'url'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        رابط موقع
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerEditType('view')}
                        className={`py-1.5 rounded-lg font-bold cursor-pointer ${
                          drawerEditType === 'view'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        صفحة تطبيق
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerEditType('text')}
                        className={`py-1.5 rounded-lg font-bold cursor-pointer ${
                          drawerEditType === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        نص مخصص
                      </button>
                    </div>

                    {drawerEditType === 'url' ? (
                      <input
                        type="url"
                        dir="ltr"
                        value={drawerEditUrl}
                        onChange={(e) => setDrawerEditUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                      />
                    ) : drawerEditType === 'text' ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={drawerEditText}
                          onChange={(e) => setDrawerEditText(e.target.value)}
                          placeholder="محتوى النص..."
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                        />
                        <label className="w-full py-1.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                          <ImagePlus className="w-3.5 h-3.5" />
                          <span>{drawerEditImage ? 'تغيير الصورة' : 'إرفاق صورة (اختياري)'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const dataUrl = await compressImageToDataUrl(file);
                                setDrawerEditImage(dataUrl);
                              } catch {
                                // Ignore invalid image
                              } finally {
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <select
                        value={drawerEditUrl}
                        onChange={(e) => setDrawerEditUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="home">الواجهة الرئيسية</option>
                        <option value="app-topics">مواضيع وأسئلة التطبيق</option>
                        <option value="platforms">الأرضيات التعليمية (المعلام)</option>
                        <option value="documents">سحب الوثائق</option>
                        <option value="homework">الفرض الإلكتروني الرسمي</option>
                        <option value="students">الطلاب المسجلون</option>
                      </select>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEditDrawerSec(sec.id)}
                        className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>حفظ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingDrawerSecId(null)}
                        className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {sec.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                        {sec.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveSection(sec.id, 'up')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => onMoveSection(sec.id, 'down')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditDrawerSec(sec)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onResetLayout}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الترتيب الافتراضي للأقسام</span>
          </button>
        </div>
      )}

      {/* TAB 3: HOME PAGE BLOCKS, HERO, COUNTDOWN, CALENDAR, SUPPORT & WIDGETS */}
      {activeTab === 'home' && (
        <div className="space-y-4">
          {/* Home Blocks Order & Content */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>أقسام الواجهة الرئيسية وترتيبها</span>
            </h3>

            <div className="space-y-2">
              {homeBlocks.map((block, bIdx) => (
                <div
                  key={block.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs font-extrabold block truncate ${
                        block.visible
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 line-through'
                      }`}
                    >
                      {block.label}
                    </span>
                    {block.id === 'hero' && (heroOverride.title || heroOverride.imageUrl) && (
                      <span className="text-[10px] text-blue-600 dark:text-sky-400 block truncate">
                        {heroOverride.title || 'معدّل'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditHomeBlock(block.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      disabled={bIdx === 0}
                      onClick={() => onMoveHomeBlock(block.id, 'up')}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="تحريك للأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={bIdx === homeBlocks.length - 1}
                      onClick={() => onMoveHomeBlock(block.id, 'down')}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="تحريك للأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleHomeBlock(block.id)}
                      className={`p-2 rounded-xl cursor-pointer ${
                        block.visible
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                          : 'bg-red-50 dark:bg-red-950/60 text-red-500'
                      }`}
                      title={block.visible ? 'إخفاء القسم' : 'إظهار القسم'}
                    >
                      {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add & Reorder Widgets in Home Screen */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              نصوص وصور وأزرار إضافية في الواجهة ({homeWidgets.length})
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onAddHomeWidget('text')}
                className="py-2.5 px-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة نص</span>
              </button>
              <button
                type="button"
                onClick={() => onAddHomeWidget('image')}
                className="py-2.5 px-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة صورة</span>
              </button>
              <button
                type="button"
                onClick={() => onAddHomeWidget('url')}
                className="py-2.5 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة زر / موقع</span>
              </button>
            </div>

            {homeWidgets.length === 0 ? (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-3">
                لم يتم إضافة أي نص أو صورة أو زر مخصص في الواجهة الرئيسية بعد.
              </p>
            ) : (
              <div className="space-y-2">
                {homeWidgets.map((w, idx) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                        {w.title || (w.type === 'image' ? 'صورة مضافة' : 'نص مضاف')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {w.type === 'url' ? w.url : w.type === 'image' ? 'صورة في الواجهة' : w.body}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveHomeWidget(w.id, 'up')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === homeWidgets.length - 1}
                        onClick={() => onMoveHomeWidget(w.id, 'down')}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditHomeWidget(w)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteHomeWidget(w.id)}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Site URL Setting */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 text-xs">
            <span className="block font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>رابط «الموقع الرسمي ONEFD»</span>
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                dir="ltr"
                value={siteUrlDraft}
                onChange={(e) => {
                  setSiteUrlDraft(e.target.value);
                  setSiteUrlSaved(false);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
              />
              <button
                type="button"
                onClick={() => {
                  if (siteUrlDraft.trim()) {
                    onUpdateOfficialSiteUrl(siteUrlDraft.trim());
                    setSiteUrlSaved(true);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                {siteUrlSaved ? 'تم الحفظ' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for active section editing */}
      <ButtonEditModal
        target={editingButton}
        currentOverride={
          editingButton ? activeCustomization.buttonOverrides[editingButton.id] : undefined
        }
        onSave={(id, next) => activeCustomization.onSaveButtonOverride(id, next)}
        onReset={(id) => activeCustomization.onResetButtonOverride(id)}
        onClose={() => setEditingButton(null)}
      />

      <SectionEntryModal
        isOpen={entryModal.isOpen}
        initialType={entryModal.initialType}
        editingEntry={entryModal.editingEntry}
        onSave={(entry, editingId) => activeCustomization.onSaveCustomEntry(entry, editingId)}
        onClose={() => setEntryModal((p) => ({ ...p, isOpen: false }))}
      />

      <SectionHeaderEditModal
        isOpen={isHeaderModalOpen}
        current={activeCustomization.sectionHeader}
        defaultTitle={activeSectionOption.defaultTitle}
        defaultSubtitle={activeSectionOption.defaultSubtitle || ''}
        defaultNote={activeSectionOption.defaultNote || ''}
        onSave={(next) => activeCustomization.onSaveSectionHeader?.(next)}
        onReset={() => activeCustomization.onResetSectionHeader?.()}
        onClose={() => setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
