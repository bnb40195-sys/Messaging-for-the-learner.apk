import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  Globe,
  ImagePlus,
  Pencil,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  ButtonOverride,
  compressImageToDataUrl,
  CustomSectionEntry,
  normalizeExternalUrl,
  SectionHeaderOverride,
} from '../lib/customContent';

export interface SectionCustomizationContext {
  isAdmin: boolean;
  showInlineTools?: boolean;
  buttonOverrides: Record<string, ButtonOverride>;
  buttonOrder?: string[];
  customEntries: CustomSectionEntry[];
  sectionHeader?: SectionHeaderOverride;
  onSaveButtonOverride: (buttonId: string, next: ButtonOverride) => void;
  onResetButtonOverride: (buttonId: string) => void;
  onMoveButton?: (buttonId: string, dir: 'up' | 'down', defaultIds: string[]) => void;
  onResetSectionOverrides: () => void;
  onSaveCustomEntry: (entry: Omit<CustomSectionEntry, 'id'>, editingId?: string) => void;
  onDeleteCustomEntry: (entryId: string) => void;
  onMoveCustomEntry: (entryId: string, dir: 'up' | 'down') => void;
  onSaveSectionHeader?: (next: SectionHeaderOverride) => void;
  onResetSectionHeader?: () => void;
}

export function useSectionEditor(customization?: SectionCustomizationContext) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingButton, setEditingButton] = useState<EditableButtonTarget | null>(null);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [entryModal, setEntryModal] = useState<{
    isOpen: boolean;
    initialType: 'url' | 'text' | 'image';
    editingEntry: CustomSectionEntry | null;
  }>({ isOpen: false, initialType: 'url', editingEntry: null });

  const isAdmin = Boolean(customization?.isAdmin && customization?.showInlineTools !== false);
  const rawIsAdmin = Boolean(customization?.isAdmin);
  const overrides = customization?.buttonOverrides || {};
  const buttonOrder = customization?.buttonOrder || [];
  const entries = customization?.customEntries || [];
  const sectionHeader = customization?.sectionHeader || {};
  const hasHeaderOverride = Boolean(
    sectionHeader.title || sectionHeader.subtitle || sectionHeader.note
  );
  const hasOverrides =
    Object.keys(overrides).length > 0 || buttonOrder.length > 0 || hasHeaderOverride;

  return {
    isAdmin,
    rawIsAdmin,
    isEditMode,
    setIsEditMode,
    editingButton,
    setEditingButton,
    isHeaderModalOpen,
    setIsHeaderModalOpen,
    entryModal,
    setEntryModal,
    overrides,
    buttonOrder,
    entries,
    sectionHeader,
    hasHeaderOverride,
    hasOverrides,
  };
}

interface SectionAdminToolbarProps {
  isAdmin: boolean;
  isEditMode: boolean;
  hasOverrides: boolean;
  onToggleEditMode: () => void;
  onOpenAddEntry: (type: 'url' | 'text' | 'image') => void;
  onResetSectionOverrides: () => void;
  onEditSectionHeader?: () => void;
  hideButtonEditToggle?: boolean;
}

export const SectionAdminToolbar: React.FC<SectionAdminToolbarProps> = ({
  isAdmin,
  isEditMode,
  hasOverrides,
  onToggleEditMode,
  onOpenAddEntry,
  onResetSectionOverrides,
  onEditSectionHeader,
  hideButtonEditToggle = false,
}) => {
  if (!isAdmin) return null;

  return (
    <div className="w-full max-w-md mb-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-blue-800/70 shadow-sm space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-black text-blue-700 dark:text-sky-300 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>تعديل هذا القسم ومحتواه</span>
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onEditSectionHeader && (
            <button
              type="button"
              onClick={onEditSectionHeader}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span>تعديل عنوان القسم</span>
            </button>
          )}

          {!hideButtonEditToggle && (
            <button
              type="button"
              onClick={onToggleEditMode}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isEditMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 hover:bg-blue-100'
              }`}
            >
              <Pencil className="w-3 h-3" />
              <span>{isEditMode ? 'إنهاء تعديل الأزرار' : 'تعديل الأزرار'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() => onOpenAddEntry('url')}
          className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة زر / موقع</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddEntry('text')}
          className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة نص</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddEntry('image')}
          className="py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer"
        >
          <ImagePlus className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة صورة</span>
        </button>
      </div>

      {hasOverrides && (
        <button
          type="button"
          onClick={onResetSectionOverrides}
          className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
          title="استعادة الإعدادات الافتراضية لهذا القسم"
        >
          <RotateCcw className="w-3 h-3" />
          <span>استعادة الإعدادات الافتراضية للقسم</span>
        </button>
      )}
    </div>
  );
};

interface SectionHeaderEditModalProps {
  isOpen: boolean;
  current?: SectionHeaderOverride;
  defaultTitle: string;
  defaultSubtitle?: string;
  defaultNote?: string;
  onSave: (next: SectionHeaderOverride) => void;
  onReset?: () => void;
  onClose: () => void;
}

export const SectionHeaderEditModal: React.FC<SectionHeaderEditModalProps> = ({
  isOpen,
  current,
  defaultTitle,
  defaultSubtitle = '',
  defaultNote = '',
  onSave,
  onReset,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(current?.title ?? defaultTitle);
    setSubtitle(current?.subtitle ?? defaultSubtitle);
    setNote(current?.note ?? defaultNote);
  }, [isOpen, current, defaultTitle, defaultSubtitle, defaultNote]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim() || defaultTitle,
      subtitle: subtitle.trim(),
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pencil className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>تعديل عنوان ومحتوى القسم</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان القسم:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الوصف المختصر تحت العنوان (اختياري):
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="اكتب وصفاً مختصراً للقسم..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظة أو نص تعريفي إضافي (اختياري):
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توجيه أو ملاحظة تظهر أعلى القسم..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديل</span>
            </button>
            {onReset && (
              <button
                type="button"
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>افتراضي</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export interface EditableButtonTarget {
  id: string;
  defaultLabel: string;
  defaultSubtitle?: string;
  defaultUrl?: string;
}

interface ButtonEditModalProps {
  target: EditableButtonTarget | null;
  currentOverride?: ButtonOverride;
  onSave: (buttonId: string, next: ButtonOverride) => void;
  onReset: (buttonId: string) => void;
  onClose: () => void;
}

export const ButtonEditModal: React.FC<ButtonEditModalProps> = ({
  target,
  currentOverride,
  onSave,
  onReset,
  onClose,
}) => {
  const [label, setLabel] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [actionType, setActionType] = useState<'default' | 'url' | 'text'>('default');
  const [url, setUrl] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textBody, setTextBody] = useState('');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!target) return;
    setLabel(currentOverride?.label ?? target.defaultLabel);
    setSubtitle(currentOverride?.subtitle ?? target.defaultSubtitle ?? '');
    setActionType(currentOverride?.actionType ?? (target.defaultUrl ? 'url' : 'default'));
    setUrl(currentOverride?.url ?? target.defaultUrl ?? '');
    setTextTitle(currentOverride?.textTitle ?? target.defaultLabel);
    setTextBody(currentOverride?.textBody ?? '');
    setHidden(Boolean(currentOverride?.hidden));
  }, [target, currentOverride]);

  if (!target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = label.trim() || target.defaultLabel;
    const next: ButtonOverride = {
      label: cleanLabel,
      subtitle: subtitle.trim(),
      actionType,
      url: actionType === 'url' ? normalizeExternalUrl(url) : url.trim(),
      textTitle: textTitle.trim() || cleanLabel,
      textBody: textBody.trim(),
      hidden,
    };
    onSave(target.id, next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pencil className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>تعديل الزر</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان الزر:
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف مختصر / نص فرعي (اختياري):
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="مثال: رابط البوابة أو شرح مختصر"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              إجراء الزر عند الضغط:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setActionType('default')}
                className={`py-2 px-2 rounded-xl font-bold cursor-pointer ${
                  actionType === 'default'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                الافتراضي
              </button>
              <button
                type="button"
                onClick={() => setActionType('url')}
                className={`py-2 px-2 rounded-xl font-bold cursor-pointer ${
                  actionType === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                فتح موقع
              </button>
              <button
                type="button"
                onClick={() => setActionType('text')}
                className={`py-2 px-2 rounded-xl font-bold cursor-pointer ${
                  actionType === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                عرض نص
              </button>
            </div>
          </div>

          {actionType === 'url' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                رابط الموقع الجديد:
              </label>
              <input
                type="url"
                dir="ltr"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
              />
            </div>
          )}

          {actionType === 'text' && (
            <div className="space-y-2.5">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان النص:
                </label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المحتوى النصي:
                </label>
                <textarea
                  rows={4}
                  required
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  placeholder="اكتب النص أو التعليمات التي ستظهر للمتعلم..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            className={`w-full py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
              hidden
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hidden ? 'هذا الزر مخفي عن الطلاب (اضغط لإظهاره)' : 'الزر ظاهر للجميع (اضغط لإخفائه)'}</span>
          </button>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديل</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onReset(target.id);
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
              title="إعادة للوضع الافتراضي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>افتراضي</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SectionEntryModalProps {
  isOpen: boolean;
  initialType: 'url' | 'text' | 'image';
  editingEntry: CustomSectionEntry | null;
  onSave: (entry: Omit<CustomSectionEntry, 'id'>, editingId?: string) => void;
  onClose: () => void;
}

export const SectionEntryModal: React.FC<SectionEntryModalProps> = ({
  isOpen,
  initialType,
  editingEntry,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<'url' | 'text' | 'image'>(initialType);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('https://');
  const [textBody, setTextBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayMode, setDisplayMode] = useState<'card' | 'button'>('card');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUploadErr(null);
    if (editingEntry) {
      setType(editingEntry.type);
      setTitle(editingEntry.title);
      setSubtitle(editingEntry.subtitle || '');
      setUrl(editingEntry.url || (editingEntry.type === 'url' ? 'https://' : ''));
      setTextBody(editingEntry.textBody || '');
      setImageUrl(editingEntry.imageUrl || '');
      setDisplayMode(editingEntry.displayMode || 'card');
    } else {
      setType(initialType);
      setTitle('');
      setSubtitle('');
      setUrl(initialType === 'url' ? 'https://' : '');
      setTextBody('');
      setImageUrl('');
      setDisplayMode('card');
    }
  }, [isOpen, initialType, editingEntry]);

  if (!isOpen) return null;

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr(null);
    setIsUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setImageUrl(dataUrl);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'تعذر تحميل الصورة.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (type === 'url') {
      if (!cleanTitle) return;
      const normalized = normalizeExternalUrl(url);
      if (!normalized) return;
      onSave(
        {
          type: 'url',
          title: cleanTitle,
          subtitle: subtitle.trim() || normalized,
          url: normalized,
        },
        editingEntry?.id
      );
    } else if (type === 'image') {
      if (!imageUrl.trim()) {
        setUploadErr('يرجى اختيار صورة من جهازك أو إدخال رابط صورة.');
        return;
      }
      onSave(
        {
          type: 'image',
          title: cleanTitle || 'صورة توضيحية',
          subtitle: subtitle.trim(),
          imageUrl: imageUrl.trim(),
          url: url.trim() && url.trim() !== 'https://' ? normalizeExternalUrl(url) : '',
        },
        editingEntry?.id
      );
    } else {
      if (!cleanTitle || !textBody.trim()) return;
      onSave(
        {
          type: 'text',
          title: cleanTitle,
          subtitle: subtitle.trim(),
          textBody: textBody.trim(),
          displayMode,
        },
        editingEntry?.id
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            {type === 'url' ? (
              <Globe className="w-4 h-4 text-emerald-600" />
            ) : type === 'image' ? (
              <ImagePlus className="w-4 h-4 text-sky-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
            <span>
              {editingEntry
                ? type === 'url'
                  ? 'تعديل الزر / الموقع'
                  : type === 'image'
                    ? 'تعديل الصورة المضافة'
                    : 'تعديل النص المضاف'
                : type === 'url'
                  ? 'إضافة زر أو موقع جديد في القسم'
                  : type === 'image'
                    ? 'إضافة صورة جديدة في القسم'
                    : 'إضافة نص جديد في القسم'}
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setType('url')}
              className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                type === 'url'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>زر / موقع</span>
            </button>
            <button
              type="button"
              onClick={() => setType('text')}
              className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                type === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>نص</span>
            </button>
            <button
              type="button"
              onClick={() => setType('image')}
              className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
                type === 'image'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span>صورة</span>
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {type === 'url'
                ? 'اسم الزر / الموقع:'
                : type === 'image'
                  ? 'عنوان الصورة (اختياري):'
                  : 'عنوان النص:'}
            </label>
            <input
              type="text"
              required={type !== 'image'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'url'
                  ? 'مثال: بوابة النتائج الرسمية'
                  : type === 'image'
                    ? 'مثال: توضيح خطوات التسجيل'
                    : 'مثال: تنبيه هام للطلبة'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          {type === 'url' ? (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط الموقع (URL):
                </label>
                <input
                  type="url"
                  dir="ltr"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.onefd.edu.dz/"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف مختصر (اختياري):
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="يظهر تحت اسم الزر"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </>
          ) : type === 'image' ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFilePick}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'جاري معالجة الصورة...' : 'اختيار صورة من الجهاز'}</span>
              </button>

              {uploadErr && <p className="text-[11px] font-bold text-red-600">{uploadErr}</p>}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  أو رابط الصورة (URL):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://.../image.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                />
              </div>

              {imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <img
                    src={imageUrl}
                    alt="معاينة الصورة"
                    className="w-full max-h-40 object-contain mx-auto"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف تحت الصورة (اختياري):
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="شرح مختصر يظهر أسفل الصورة"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط عند الضغط على الصورة (اختياري):
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={url === 'https://' ? '' : url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  طريقة العرض في القسم:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDisplayMode('card')}
                    className={`py-2 px-3 rounded-xl font-bold cursor-pointer ${
                      displayMode === 'card'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    بطاقة نصية ظاهرة
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode('button')}
                    className={`py-2 px-3 rounded-xl font-bold cursor-pointer ${
                      displayMode === 'button'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    زر يفتح النص
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  محتوى النص:
                </label>
                <textarea
                  rows={4}
                  required
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  placeholder="اكتب النص الذي تريد إضافته في هذا القسم..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingEntry ? 'حفظ التعديلات' : 'إضافة في القسم'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SectionCustomEntriesListProps {
  entries: CustomSectionEntry[];
  isAdmin: boolean;
  isEditMode: boolean;
  onOpenSite: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  onEditEntry: (entry: CustomSectionEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onMoveEntry: (entryId: string, dir: 'up' | 'down') => void;
}

export const SectionCustomEntriesList: React.FC<SectionCustomEntriesListProps> = ({
  entries,
  isAdmin,
  isEditMode,
  onOpenSite,
  onShowInfo,
  onEditEntry,
  onDeleteEntry,
  onMoveEntry,
}) => {
  if (entries.length === 0) return null;

  return (
    <div className="w-full max-w-md flex flex-col gap-3 mt-4">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="space-y-1.5">
          {entry.type === 'url' ? (
            <button
              type="button"
              onClick={() => entry.url && onOpenSite(entry.url)}
              className="w-full min-h-[60px] px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-sm hover:shadow-md flex items-center justify-between gap-3 transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 text-center">
                <span className="text-sm sm:text-base font-extrabold block truncate">
                  {entry.title}
                </span>
                {entry.subtitle && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate" dir="auto">
                    {entry.subtitle}
                  </span>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Globe className="w-5 h-5" />
              </div>
            </button>
          ) : entry.type === 'image' ? (
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-right">
              {entry.imageUrl && (
                <button
                  type="button"
                  onClick={() => entry.url && onOpenSite(entry.url)}
                  className={`block w-full ${entry.url ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <img
                    src={entry.imageUrl}
                    alt={entry.title || 'صورة القسم'}
                    className="w-full max-h-80 object-cover"
                  />
                </button>
              )}
              {(entry.title || entry.subtitle) && (
                <div className="p-3.5 space-y-1">
                  {entry.title && (
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {entry.title}
                    </h4>
                  )}
                  {entry.subtitle && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {entry.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : entry.displayMode === 'button' ? (
            <button
              type="button"
              onClick={() => onShowInfo?.(entry.title, entry.textBody || '')}
              className="w-full min-h-[60px] px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-sm hover:shadow-md flex items-center justify-between gap-3 transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 text-center">
                <span className="text-sm sm:text-base font-extrabold block truncate">
                  {entry.title}
                </span>
                {entry.subtitle && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {entry.subtitle}
                  </span>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 text-right">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {entry.title}
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pr-1">
                {entry.textBody}
              </p>
            </div>
          )}

          {isAdmin && isEditMode && (
            <div className="flex items-center justify-end gap-1.5 px-2">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => onMoveEntry(entry.id, 'up')}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                title="تحريك للأعلى"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === entries.length - 1}
                onClick={() => onMoveEntry(entry.id, 'down')}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                title="تحريك للأسفل"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onEditEntry(entry)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteEntry(entry.id)}
                className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
