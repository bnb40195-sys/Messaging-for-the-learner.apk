import React, { useState, useEffect } from 'react';
import {
  X,
  Home,
  BookOpen,
  User,
  FileText,
  Laptop,
  ChevronLeft,
  Globe,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Pencil,
  RotateCcw,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Eye,
  EyeOff,
  Award,
  Users,
  Settings,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AppSectionItem, HomeBlockConfig } from '../types/sections';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  isAdmin?: boolean;
  language?: AppLanguage;
  onOpenSettings?: () => void;
  sections: AppSectionItem[];
  homeBlocks: HomeBlockConfig[];
  officialSiteUrl: string;
  onSelectSection: (section: AppSectionItem) => void;
  onMoveSection: (id: string, direction: 'up' | 'down') => void;
  onUpdateSection: (id: string, updates: Partial<AppSectionItem>) => void;
  onAddSection: (newSection: Omit<AppSectionItem, 'id'>) => void;
  onDeleteSection: (id: string) => void;
  onMoveHomeBlock: (id: HomeBlockConfig['id'], direction: 'up' | 'down') => void;
  onToggleHomeBlock: (id: HomeBlockConfig['id']) => void;
  onUpdateOfficialSiteUrl: (url: string) => void;
  onResetLayout: () => void;
}

const SECTION_COLORS = [
  'from-indigo-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-rose-600 to-pink-600',
  'from-blue-600 to-cyan-600',
  'from-amber-600 to-orange-600',
];

function getSectionIcon(iconName: AppSectionItem['iconName']) {
  switch (iconName) {
    case 'home':
      return Home;
    case 'book':
      return BookOpen;
    case 'user':
      return User;
    case 'users':
      return Users;
    case 'file':
      return FileText;
    case 'laptop':
      return Laptop;
    case 'star':
      return Star;
    case 'award':
      return Award;
    case 'globe':
    default:
      return Globe;
  }
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  isAdmin = false,
  language = 'ar',
  onOpenSettings,
  sections,
  homeBlocks,
  officialSiteUrl,
  onSelectSection,
  onMoveSection,
  onUpdateSection,
  onAddSection,
  onDeleteSection,
  onMoveHomeBlock,
  onToggleHomeBlock,
  onUpdateOfficialSiteUrl,
  onResetLayout,
}) => {
  const t = TRANSLATIONS[language];
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editType, setEditType] = useState<'view' | 'url'>('view');

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('https://');
  const [newColor, setNewColor] = useState(SECTION_COLORS[0]);

  const [headerUrlDraft, setHeaderUrlDraft] = useState(officialSiteUrl);

  useEffect(() => {
    if (!isAdmin) {
      setIsEditing(false);
      setEditingId(null);
      setIsAdding(false);
    }
  }, [isAdmin]);

  if (!isOpen) return null;

  const startEditItem = (item: AppSectionItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditDesc(item.desc);
    setEditType(item.targetType);
    setEditUrl(item.targetValue);
  };

  const saveEditItem = (id: string) => {
    const cleanLabel = editLabel.trim();
    if (!cleanLabel) return;
    onUpdateSection(id, {
      label: cleanLabel,
      desc: editDesc.trim(),
      targetType: editType,
      targetValue: editUrl.trim() || 'home',
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = newLabel.trim();
    const cleanUrl = newUrl.trim();
    if (!cleanLabel || !cleanUrl) return;
    const normalizedUrl =
      cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
        ? cleanUrl
        : `https://${cleanUrl}`;

    onAddSection({
      label: cleanLabel,
      desc: newDesc.trim() || normalizedUrl,
      targetType: 'url',
      targetValue: normalizedUrl,
      iconName: 'globe',
      color: newColor,
    });
    setNewLabel('');
    setNewDesc('');
    setNewUrl('https://');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Side Window Panel - Slides from Right (RTL) */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-slideInRight">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-blue-50/70 to-emerald-50/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/app-logo.png"
                alt="شعار بوابة المتعلم"
                className="w-11 h-11 rounded-2xl shadow-md shadow-indigo-500/20 object-cover shrink-0"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  {t.appName}
                </h3>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block">
                  {t.seasonTag}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={t.closeMenu}
              aria-label={t.closeMenu}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.sectionsHeading}
                </span>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeaderUrlDraft(officialSiteUrl);
                      setIsEditing((v) => !v);
                      setEditingId(null);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isEditing
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'إنهاء التخصيص' : 'تخصيص الأقسام والمواقع'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {sections.map((item, idx) => {
                  const Icon = getSectionIcon(item.iconName);
                  const isActive =
                    item.targetType === 'view' && currentView === item.targetValue;
                  const isItemEditing = isAdmin && isEditing && editingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/60 border-indigo-200 dark:border-indigo-800 shadow-xs'
                          : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-800'
                      }`}
                    >
                      {isItemEditing ? (
                        <div className="p-3.5 space-y-2.5">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="اسم القسم أو الزر"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="وصف مختصر"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                          />

                          <div className="flex items-center gap-2 text-[11px]">
                            <button
                              type="button"
                              onClick={() => setEditType('url')}
                              className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                                editType === 'url'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              رابط موقع خارجي
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditType('view')}
                              className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                                editType === 'view'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              صفحة داخل التطبيق
                            </button>
                          </div>

                          {editType === 'url' ? (
                            <input
                              type="url"
                              dir="ltr"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white text-left"
                            />
                          ) : (
                            <select
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="home">الواجهة الرئيسية</option>
                              <option value="platforms">الأرضيات التعليمية (المعلام)</option>
                              <option value="app-topics">مواضيع وأسئلة التطبيق</option>
                              <option value="students">الطلاب المسجلون</option>
                              <option value="registration">تسجيل الدخول (جديد / سابق)</option>
                              <option value="documents">سحب الوثائق</option>
                              <option value="homework">الفرض الإلكتروني الرسمي</option>
                            </select>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => saveEditItem(item.id)}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>حفظ</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSection(item);
                              onClose();
                            }}
                            className="flex-1 flex items-center gap-3 text-right min-w-0 cursor-pointer"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4
                                className={`text-xs font-extrabold truncate ${
                                  isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {item.label}
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {item.desc}
                              </p>
                            </div>
                          </button>

                          {isAdmin && isEditing ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => onMoveSection(item.id, 'up')}
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                                title="تحريك للأعلى"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === sections.length - 1}
                                onClick={() => onMoveSection(item.id, 'down')}
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                                title="تحريك للأسفل"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditItem(item)}
                                className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 cursor-pointer"
                                title="تعديل الاسم أو رابط الزر"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteSection(item.id)}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 cursor-pointer"
                                title="حذف القسم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : item.targetType === 'url' ? (
                            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronLeft className="w-4 h-4 text-slate-400 rtl:rotate-180 shrink-0" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Section & Home Layout Customization Controls (Admin Only) */}
              {isAdmin && isEditing && (
                <div className="mt-4 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {!isAdding ? (
                    <button
                      type="button"
                      onClick={() => setIsAdding(true)}
                      className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة قسم أو زر موقع جديد</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleAddSubmit}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                    >
                      <span className="block text-xs font-black text-slate-900 dark:text-white">
                        إضافة قسم / زر موقع جديد
                      </span>
                      <input
                        type="text"
                        required
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="اسم القسم (مثال: نتائج الامتحانات)"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="وصف مختصر (اختياري)"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="url"
                        dir="ltr"
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white text-left"
                      />
                      <div className="flex items-center gap-1.5">
                        {SECTION_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setNewColor(c)}
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} cursor-pointer ${
                              newColor === c ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                        >
                          إضافة القسم
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAdding(false)}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Change Header Official Website URL */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-[11px] font-black text-slate-800 dark:text-slate-200">
                      رابط زر «الموقع الرسمي ↗» في الأعلى:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        dir="ltr"
                        value={headerUrlDraft}
                        onChange={(e) => setHeaderUrlDraft(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white text-left"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (headerUrlDraft.trim()) {
                            onUpdateOfficialSiteUrl(headerUrlDraft.trim());
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                      >
                        حفظ
                      </button>
                    </div>
                  </div>

                  {/* Home Sections Order & Visibility */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-[11px] font-black text-slate-800 dark:text-slate-200">
                      ترتيب وإظهار/حذف أقسام الصفحة الرئيسية:
                    </span>
                    <div className="space-y-1.5">
                      {homeBlocks.map((block, bIdx) => (
                        <div
                          key={block.id}
                          className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px]"
                        >
                          <span
                            className={`font-bold truncate ${
                              block.visible
                                ? 'text-slate-800 dark:text-slate-200'
                                : 'text-slate-400 line-through'
                            }`}
                          >
                            {block.label}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={bIdx === 0}
                              onClick={() => onMoveHomeBlock(block.id, 'up')}
                              className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                              title="تحريك للأعلى"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={bIdx === homeBlocks.length - 1}
                              onClick={() => onMoveHomeBlock(block.id, 'down')}
                              className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                              title="تحريك للأسفل"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleHomeBlock(block.id)}
                              className={`p-1 rounded-md cursor-pointer ${
                                block.visible
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
                              }`}
                              title={block.visible ? 'إخفاء القسم' : 'إظهار القسم'}
                            >
                              {block.visible ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onResetLayout();
                      setHeaderUrlDraft('https://www.onefd.edu.dz/');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ترتيب الأقسام والأزرار الافتراضي</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings Shortcut (Language & Background) */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="text-start">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {t.settings}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.languageTitle} · {t.backgroundTitle}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 rtl:rotate-180 shrink-0" />
              </button>
            )}

            {/* Install Offline App Button (only shown when installable) */}
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </div>
  );
};
