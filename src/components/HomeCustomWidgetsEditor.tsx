import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Calendar,
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
  compressImageToDataUrl,
  DEFAULT_CALENDAR_MILESTONES,
  HeroOverride,
  HomeCalendarMilestone,
  HomeCalendarOverride,
  HomeCountdownOverride,
  HomeCustomWidget,
  HomeSupportOverride,
  normalizeExternalUrl,
} from '../lib/customContent';
import { AppSectionItem, HomeBlockConfig, HomeBlockId } from '../types/sections';

interface HomeAdminBarProps {
  isAdmin: boolean;
  isHomeEditMode: boolean;
  onToggleEditMode: () => void;
  onAddWidget: (type: 'text' | 'image' | 'url') => void;
  onEditHero: () => void;
  onOpenOrderModal?: () => void;
}

export const HomeAdminBar: React.FC<HomeAdminBarProps> = ({
  isAdmin,
  isHomeEditMode,
  onToggleEditMode,
  onAddWidget,
  onEditHero,
  onOpenOrderModal,
}) => {
  if (!isAdmin) return null;

  return (
    <div className="p-3.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-blue-800/70 shadow-sm space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black text-blue-700 dark:text-sky-300 flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4" />
          <span>تخصيص واجهة التطبيق</span>
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onEditHero}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            <span>الواجهة الترحيبية</span>
          </button>

          {onOpenOrderModal && (
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3 h-3" />
              <span>ترتيب الأقسام</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleEditMode}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors ${
              isHomeEditMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 hover:bg-blue-100'
            }`}
          >
            <Pencil className="w-3 h-3" />
            <span>{isHomeEditMode ? 'إنهاء التعديل' : 'تعديل كل الأقسام'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onAddWidget('text')}
          className="py-2.5 px-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة نص</span>
        </button>

        <button
          type="button"
          onClick={() => onAddWidget('image')}
          className="py-2.5 px-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ImagePlus className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة صورة</span>
        </button>

        <button
          type="button"
          onClick={() => onAddWidget('url')}
          className="py-2.5 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>إضافة زر / موقع</span>
        </button>
      </div>
    </div>
  );
};

interface HomeWidgetModalProps {
  isOpen: boolean;
  initialType: 'text' | 'image' | 'url';
  editingWidget: HomeCustomWidget | null;
  onSave: (widget: Omit<HomeCustomWidget, 'id'>, editingId?: string) => void;
  onClose: () => void;
}

export const HomeWidgetModal: React.FC<HomeWidgetModalProps> = ({
  isOpen,
  initialType,
  editingWidget,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<'text' | 'image' | 'url'>(initialType);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [accent, setAccent] = useState<'blue' | 'emerald' | 'amber' | 'slate'>('blue');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUploadErr(null);
    if (editingWidget) {
      setType(editingWidget.type);
      setTitle(editingWidget.title || '');
      setBody(editingWidget.body || '');
      setImageUrl(editingWidget.imageUrl || '');
      setUrl(editingWidget.url || '');
      setAccent(editingWidget.accent || 'blue');
    } else {
      setType(initialType);
      setTitle('');
      setBody('');
      setImageUrl('');
      setUrl('');
      setAccent('blue');
    }
  }, [isOpen, initialType, editingWidget]);

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
    if (type === 'text') {
      if (!title.trim() && !body.trim()) return;
      onSave(
        {
          type: 'text',
          title: title.trim(),
          body: body.trim(),
          accent,
        },
        editingWidget?.id
      );
    } else if (type === 'image') {
      if (!imageUrl.trim()) {
        setUploadErr('يرجى اختيار صورة من جهازك أو إدخال رابط صورة.');
        return;
      }
      onSave(
        {
          type: 'image',
          title: title.trim(),
          body: body.trim(),
          imageUrl: imageUrl.trim(),
          url: url.trim() ? normalizeExternalUrl(url) : '',
          accent,
        },
        editingWidget?.id
      );
    } else {
      if (!title.trim() || !url.trim()) return;
      onSave(
        {
          type: 'url',
          title: title.trim(),
          body: body.trim(),
          url: normalizeExternalUrl(url),
          accent,
        },
        editingWidget?.id
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            {type === 'image' ? (
              <ImagePlus className="w-4 h-4 text-sky-600" />
            ) : type === 'url' ? (
              <Globe className="w-4 h-4 text-emerald-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
            <span>
              {editingWidget
                ? 'تعديل العنصر في واجهة التطبيق'
                : type === 'image'
                  ? 'إضافة صورة في واجهة التطبيق'
                  : type === 'url'
                    ? 'إضافة زر موقع في واجهة التطبيق'
                    : 'إضافة نص في واجهة التطبيق'}
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
              <span>موقع</span>
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {type === 'image'
                ? 'عنوان أو تعليق على الصورة (اختياري):'
                : type === 'url'
                  ? 'اسم الموقع أو الزر:'
                  : 'عنوان النص:'}
            </label>
            <input
              type="text"
              required={type !== 'image'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'image'
                  ? 'مثال: إعلان هام للطلبة'
                  : type === 'url'
                    ? 'مثال: الموقع الرسمي للمعلام'
                    : 'مثال: توجيهات وإرشادات هامة'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          {type === 'image' && (
            <div className="space-y-2.5">
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
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-sky-400 dark:border-sky-700 bg-sky-50/70 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-extrabold flex items-center justify-center gap-2 hover:bg-sky-100/70 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'جاري تجهيز الصورة...' : 'اختيار صورة من الجهاز'}</span>
              </button>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  أو لصق رابط صورة مباشر (اختياري):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                />
              </div>

              {imageUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
                  <img
                    src={imageUrl}
                    alt="معاينة"
                    className="w-full max-h-44 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer"
                    title="إزالة الصورة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {uploadErr && (
                <p className="text-[11px] font-bold text-red-600 dark:text-red-400">{uploadErr}</p>
              )}
            </div>
          )}

          {(type === 'text' || type === 'image') && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'image' ? 'وصف أسفل الصورة (اختياري):' : 'محتوى النص:'}
              </label>
              <textarea
                rows={type === 'text' ? 4 : 2}
                required={type === 'text'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="اكتب النص الذي سيظهر في واجهة التطبيق..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
              />
            </div>
          )}

          {(type === 'url' || type === 'image') && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'image' ? 'رابط عند الضغط على الصورة (اختياري):' : 'رابط الموقع (URL):'}
              </label>
              <input
                type="url"
                dir="ltr"
                required={type === 'url'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.onefd.edu.dz/"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
              />
            </div>
          )}

          {type === 'url' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                وصف مختصر (اختياري):
              </label>
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="وصف يظهر أسفل اسم الموقع"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {type === 'text' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                لون البطاقة:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'blue' as const, label: 'أزرق' },
                  { id: 'emerald' as const, label: 'أخضر' },
                  { id: 'amber' as const, label: 'تنبيه' },
                  { id: 'slate' as const, label: 'عادي' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccent(opt.id)}
                    className={`py-1.5 rounded-xl font-bold cursor-pointer ${
                      accent === opt.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingWidget ? 'حفظ التعديلات' : 'إضافة في الواجهة'}</span>
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

interface HeroEditModalProps {
  isOpen: boolean;
  current: HeroOverride;
  defaultBadge: string;
  defaultTitle: string;
  defaultSubtitle: string;
  onSave: (next: HeroOverride) => void;
  onReset: () => void;
  onClose: () => void;
}

export const HeroEditModal: React.FC<HeroEditModalProps> = ({
  isOpen,
  current,
  defaultBadge,
  defaultTitle,
  defaultSubtitle,
  onSave,
  onReset,
  onClose,
}) => {
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setBadge(current.badge ?? defaultBadge);
    setTitle(current.title ?? defaultTitle);
    setSubtitle(current.subtitle ?? defaultSubtitle);
    setImageUrl(current.imageUrl ?? '');
  }, [isOpen, current, defaultBadge, defaultTitle, defaultSubtitle]);

  if (!isOpen) return null;

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setImageUrl(dataUrl);
    } catch {
      // Ignore invalid image
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            تعديل البطاقة الترحيبية في واجهة التطبيق
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              badge: badge.trim() || defaultBadge,
              title: title.trim() || defaultTitle,
              subtitle: subtitle.trim() || defaultSubtitle,
              imageUrl: imageUrl.trim(),
            });
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الشريط العلوي الصغير:
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان الرئيسي في الواجهة:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              النص التوضيحي:
            </label>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              صورة داخل البطاقة الترحيبية (اختياري):
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" />
                <span>{imageUrl ? 'تغيير الصورة' : 'رفع صورة'}</span>
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 font-bold cursor-pointer"
                >
                  حذف الصورة
                </button>
              )}
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="معاينة"
                className="mt-2 w-full max-h-36 object-cover rounded-2xl border border-slate-200 dark:border-slate-700"
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black cursor-pointer"
            >
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
            >
              افتراضي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface HomeCustomWidgetsListProps {
  widgets: HomeCustomWidget[];
  isAdmin: boolean;
  isEditMode: boolean;
  cardBgClass: string;
  onOpenSite: (url: string) => void;
  onEditWidget: (w: HomeCustomWidget) => void;
  onDeleteWidget: (id: string) => void;
  onMoveWidget: (id: string, dir: 'up' | 'down') => void;
}

export const HomeCustomWidgetsList: React.FC<HomeCustomWidgetsListProps> = ({
  widgets,
  isAdmin,
  isEditMode,
  cardBgClass,
  onOpenSite,
  onEditWidget,
  onDeleteWidget,
  onMoveWidget,
}) => {
  if (widgets.length === 0) return null;

  const getAccentStyle = (accent?: HomeCustomWidget['accent']) => {
    switch (accent) {
      case 'emerald':
        return 'bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70';
      case 'amber':
        return 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/70';
      case 'blue':
        return 'bg-blue-50/90 dark:bg-blue-950/35 border-blue-200 dark:border-blue-800/70';
      default:
        return `${cardBgClass}`;
    }
  };

  return (
    <div className="space-y-4">
      {widgets.map((widget, idx) => (
        <div key={widget.id} className="space-y-1.5">
          {widget.type === 'text' && (
            <div className={`p-5 rounded-3xl border shadow-md space-y-2 ${getAccentStyle(widget.accent)}`}>
              {widget.title && (
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                  <span>{widget.title}</span>
                </h3>
              )}
              {widget.body && (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {widget.body}
                </p>
              )}
            </div>
          )}

          {widget.type === 'image' && widget.imageUrl && (
            <div className={`rounded-3xl border shadow-md overflow-hidden ${cardBgClass}`}>
              <div
                onClick={() => {
                  if (widget.url) onOpenSite(widget.url);
                }}
                className={widget.url ? 'cursor-pointer group' : ''}
              >
                <img
                  src={widget.imageUrl}
                  alt={widget.title || 'صورة مضافة'}
                  className="w-full max-h-96 object-cover bg-slate-100 dark:bg-slate-950"
                />
                {(widget.title || widget.body || widget.url) && (
                  <div className="p-4 space-y-1">
                    {widget.title && (
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          {widget.title}
                        </h3>
                        {widget.url && (
                          <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                        )}
                      </div>
                    )}
                    {widget.body && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {widget.body}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {widget.type === 'url' && widget.url && (
            <button
              type="button"
              onClick={() => onOpenSite(widget.url!)}
              className={`w-full p-4 rounded-3xl border shadow-sm hover:shadow-md flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${cardBgClass}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {widget.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" dir="auto">
                    {widget.body || widget.url}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </button>
          )}

          {isAdmin && isEditMode && (
            <div className="flex items-center justify-end gap-1.5 px-2">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => onMoveWidget(widget.id, 'up')}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                title="تحريك للأعلى"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === widgets.length - 1}
                onClick={() => onMoveWidget(widget.id, 'down')}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                title="تحريك للأسفل"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onEditWidget(widget)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteWidget(widget.id)}
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

interface HomeBlockEditHeaderProps {
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onHide: () => void;
}

export const HomeBlockEditHeader: React.FC<HomeBlockEditHeaderProps> = ({
  label,
  canMoveUp,
  canMoveDown,
  onEdit,
  onMoveUp,
  onMoveDown,
  onHide,
}) => (
  <div className="mb-1.5 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-blue-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] shadow-xs">
    <span className="font-black text-blue-700 dark:text-sky-300 truncate">{label}</span>
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 cursor-pointer"
      >
        <Pencil className="w-3 h-3" />
        <span>تعديل القسم</span>
      </button>
      <button
        type="button"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
        title="تحريك للأعلى"
      >
        <ArrowUp className="w-3 h-3" />
      </button>
      <button
        type="button"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
        title="تحريك للأسفل"
      >
        <ArrowDown className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onHide}
        className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold flex items-center gap-1 cursor-pointer"
        title="إخفاء القسم"
      >
        <EyeOff className="w-3 h-3" />
        <span>إخفاء</span>
      </button>
    </div>
  </div>
);

interface HiddenHomeBlocksRestoreBarProps {
  hiddenBlocks: { id: string; label: string }[];
  onRestore: (id: string) => void;
}

export const HiddenHomeBlocksRestoreBar: React.FC<HiddenHomeBlocksRestoreBarProps> = ({
  hiddenBlocks,
  onRestore,
}) => {
  if (hiddenBlocks.length === 0) return null;
  return (
    <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 space-y-2 text-xs">
      <span className="block font-black text-amber-900 dark:text-amber-200">
        أقسام مخفية في الواجهة الرئيسية (اضغط لإظهارها):
      </span>
      <div className="flex flex-wrap gap-1.5">
        {hiddenBlocks.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onRestore(b.id)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface CountdownEditModalProps {
  isOpen: boolean;
  current?: HomeCountdownOverride;
  defaultTitle: string;
  defaultDesc: string;
  defaultDaysLabel: string;
  onSave: (next: HomeCountdownOverride) => void;
  onReset: () => void;
  onClose: () => void;
}

export const CountdownEditModal: React.FC<CountdownEditModalProps> = ({
  isOpen,
  current,
  defaultTitle,
  defaultDesc,
  defaultDaysLabel,
  onSave,
  onReset,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [daysLabel, setDaysLabel] = useState('');
  const [targetDateIso, setTargetDateIso] = useState('2027-05-05');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(current?.title ?? defaultTitle);
    setDesc(current?.desc ?? defaultDesc);
    setDaysLabel(current?.daysLabel ?? defaultDaysLabel);
    setTargetDateIso(current?.targetDateIso ?? '2027-05-05');
  }, [isOpen, current, defaultTitle, defaultDesc, defaultDaysLabel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>تعديل قسم العد التنازلي للامتحان</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              title: title.trim() || defaultTitle,
              desc: desc.trim() || defaultDesc,
              daysLabel: daysLabel.trim() || defaultDaysLabel,
              targetDateIso: targetDateIso || '2027-05-05',
            });
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان البطاقة:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف الموعد:
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                تسمية الأيام:
              </label>
              <input
                type="text"
                value={daysLabel}
                onChange={(e) => setDaysLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الامتحان:
              </label>
              <input
                type="date"
                dir="ltr"
                value={targetDateIso}
                onChange={(e) => setTargetDateIso(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديل</span>
            </button>
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
          </div>
        </form>
      </div>
    </div>
  );
};

interface CalendarEditModalProps {
  isOpen: boolean;
  current?: HomeCalendarOverride;
  onSave: (next: HomeCalendarOverride) => void;
  onReset: () => void;
  onClose: () => void;
}

export const CalendarEditModal: React.FC<CalendarEditModalProps> = ({
  isOpen,
  current,
  onSave,
  onReset,
  onClose,
}) => {
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [sectionLabel, setSectionLabel] = useState('');
  const [milestones, setMilestones] = useState<HomeCalendarMilestone[]>(DEFAULT_CALENDAR_MILESTONES);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setBadge(current?.badge ?? 'الديوان الوطني للتعليم والتكوين عن بعد · الرزنامة الرسمية');
    setTitle(
      current?.title ??
        'رزنامة التقويمات التكوينية للمتعلمين عن بعد للسنة الدراسية 2026-2027'
    );
    setSubtitle(
      current?.subtitle ??
        'المواعيد المعتمدة لفروض المراقبة الذاتية، نشر الإجابات، والفرض الإلكتروني'
    );
    setSectionLabel(
      current?.sectionLabel ?? 'تفاصيل المحطات والتقويمات الخمسة المعتمدة بالرزنامة:'
    );
    setMilestones(
      current?.milestones && current.milestones.length > 0
        ? current.milestones.map((m) => ({ ...m }))
        : DEFAULT_CALENDAR_MILESTONES.map((m) => ({ ...m }))
    );
    setNoteTitle(current?.noteTitle ?? 'ملاحظة هامة ورسمية:');
    setNoteBody(
      current?.noteBody ??
        'إن المشاركة في هذه التقويمات تدخل في حساب نقطة المراقبة المستمرة التي تدخل في حساب معدل النجاح السنوي.'
    );
  }, [isOpen, current]);

  if (!isOpen) return null;

  const updateMilestone = (idx: number, field: keyof HomeCalendarMilestone, val: string) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>تعديل قسم الرزنامة والتقويمات</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              badge: badge.trim(),
              title: title.trim(),
              subtitle: subtitle.trim(),
              sectionLabel: sectionLabel.trim(),
              milestones,
              noteTitle: noteTitle.trim(),
              noteBody: noteBody.trim(),
            });
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الشارة العلوية:
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان الرئيسي:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الوصف المختصر:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              عنوان قائمة المحطات:
            </label>
            <input
              type="text"
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <span className="block font-black text-slate-800 dark:text-slate-200">
              تعديل مواعيد المحطات:
            </span>
            {milestones.map((m, idx) => (
              <div
                key={m.num}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <span className="text-[11px] font-black text-blue-700 dark:text-sky-300 block">
                  محطة {m.num}
                </span>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={m.dateText}
                    onChange={(e) => updateMilestone(idx, 'dateText', e.target.value)}
                    placeholder="التاريخ"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={m.durationText}
                    onChange={(e) => updateMilestone(idx, 'durationText', e.target.value)}
                    placeholder="المدة"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              عنوان الملاحظة أسفل الرزنامة:
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <textarea
              rows={2}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ الرزنامة</span>
            </button>
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
          </div>
        </form>
      </div>
    </div>
  );
};

interface SupportEditModalProps {
  isOpen: boolean;
  current?: HomeSupportOverride;
  onSave: (next: HomeSupportOverride) => void;
  onReset: () => void;
  onClose: () => void;
}

export const SupportEditModal: React.FC<SupportEditModalProps> = ({
  isOpen,
  current,
  onSave,
  onReset,
  onClose,
}) => {
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [card1Title, setCard1Title] = useState('');
  const [card1Desc, setCard1Desc] = useState('');
  const [card2Title, setCard2Title] = useState('');
  const [card2Desc, setCard2Desc] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setBadge(
      current?.badge ??
        'مرافقة بيداغوجية ونفسية مستمرة · الديوان الوطني للتعليم والتكوين عن بعد'
    );
    setTitle(
      current?.title ??
        'انطلاق المرافقة البيداغوجية والنفسية عبر الأرضيات التعليمية الإلكترونية'
    );
    setSubtitle(
      current?.subtitle ??
        'ابتداءً من يوم الاثنين 02 نوفمبر 2026 لفائدة جميع المتعلمين في كل المستويات والشعب'
    );
    setCard1Title(current?.card1Title ?? 'مرافقة بيداغوجية');
    setCard1Desc(current?.card1Desc ?? 'دعم وتوجيه دراسي مستمر عبر الأرضيات التعليمية');
    setCard2Title(current?.card2Title ?? 'مرافقة نفسية');
    setCard2Desc(current?.card2Desc ?? 'إرشاد نفسي وتحفيز للمتعلمين في كافة المستويات والشعب');
  }, [isOpen, current]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pencil className="w-4 h-4 text-blue-600" />
            <span>تعديل قسم المرافقة البيداغوجية</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              badge: badge.trim(),
              title: title.trim(),
              subtitle: subtitle.trim(),
              card1Title: card1Title.trim(),
              card1Desc: card1Desc.trim(),
              card2Title: card2Title.trim(),
              card2Desc: card2Desc.trim(),
            });
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الشارة العلوية:
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان الرئيسي:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              الوصف:
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="block font-black text-emerald-700 dark:text-emerald-400">
              البطاقة الأولى:
            </span>
            <input
              type="text"
              value={card1Title}
              onChange={(e) => setCard1Title(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={card1Desc}
              onChange={(e) => setCard1Desc(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="block font-black text-blue-700 dark:text-sky-400">
              البطاقة الثانية:
            </span>
            <input
              type="text"
              value={card2Title}
              onChange={(e) => setCard2Title(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={card2Desc}
              onChange={(e) => setCard2Desc(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديل</span>
            </button>
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
          </div>
        </form>
      </div>
    </div>
  );
};

interface SectionsOrderModalProps {
  isOpen: boolean;
  sections: AppSectionItem[];
  homeBlocks: HomeBlockConfig[];
  onMoveSection: (id: string, dir: 'up' | 'down') => void;
  onUpdateSection: (id: string, updates: Partial<AppSectionItem>) => void;
  onAddSection: (newSection: Omit<AppSectionItem, 'id'>) => void;
  onDeleteSection: (id: string) => void;
  onMoveHomeBlock: (id: HomeBlockId, dir: 'up' | 'down') => void;
  onToggleHomeBlock: (id: HomeBlockId) => void;
  onEditHomeBlock: (id: HomeBlockId) => void;
  onResetLayout: () => void;
  onClose: () => void;
}

export const SectionsOrderModal: React.FC<SectionsOrderModalProps> = ({
  isOpen,
  sections,
  homeBlocks,
  onMoveSection,
  onUpdateSection,
  onAddSection,
  onDeleteSection,
  onMoveHomeBlock,
  onToggleHomeBlock,
  onEditHomeBlock,
  onResetLayout,
  onClose,
}) => {
  const [editingSecId, setEditingSecId] = useState<string | null>(null);
  const [secLabel, setSecLabel] = useState('');
  const [secDesc, setSecDesc] = useState('');
  const [secUrl, setSecUrl] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('https://');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const startEditSection = (sec: AppSectionItem) => {
    setEditingSecId(sec.id);
    setSecLabel(sec.label);
    setSecDesc(sec.desc);
    setSecUrl(sec.targetType === 'url' ? sec.targetValue : '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>ترتيب وتعديل جميع أقسام التطبيق</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Home Blocks Ordering */}
        <div className="space-y-2 text-xs">
          <h4 className="font-black text-slate-800 dark:text-slate-200">
            1. ترتيب وأقسام الصفحة الرئيسية:
          </h4>
          <div className="space-y-1.5">
            {homeBlocks.map((block, bIdx) => (
              <div
                key={block.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              >
                <span
                  className={`font-bold truncate ${
                    block.visible
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 line-through'
                  }`}
                >
                  {block.label}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditHomeBlock(block.id);
                    }}
                    className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    disabled={bIdx === 0}
                    onClick={() => onMoveHomeBlock(block.id, 'up')}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                    title="تحريك للأعلى"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={bIdx === homeBlocks.length - 1}
                    onClick={() => onMoveHomeBlock(block.id, 'down')}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                    title="تحريك للأسفل"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleHomeBlock(block.id)}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      block.visible
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                        : 'bg-red-50 dark:bg-red-950/60 text-red-500'
                    }`}
                    title={block.visible ? 'إخفاء' : 'إظهار'}
                  >
                    {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Drawer Sections Ordering & Renaming */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-800 dark:text-slate-200">
              2. ترتيب وأسماء أقسام القائمة الجانبية:
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew((v) => !v)}
              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>إضافة قسم / موقع</span>
            </button>
          </div>

          {isAddingNew && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLabel.trim() || !newUrl.trim()) return;
                onAddSection({
                  label: newLabel.trim(),
                  desc: newDesc.trim() || newUrl.trim(),
                  targetType: 'url',
                  targetValue: normalizeExternalUrl(newUrl),
                  iconName: 'globe',
                  color: 'from-blue-600 to-sky-600',
                });
                setNewLabel('');
                setNewDesc('');
                setNewUrl('https://');
                setIsAddingNew(false);
              }}
              className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2"
            >
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="اسم القسم أو الزر الجديد"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
              <input
                type="url"
                dir="ltr"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="وصف مختصر (اختياري)"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  حفظ وإضافة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                {editingSecId === sec.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={secLabel}
                      onChange={(e) => setSecLabel(e.target.value)}
                      placeholder="اسم القسم"
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={secDesc}
                      onChange={(e) => setSecDesc(e.target.value)}
                      placeholder="وصف مختصر"
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    {sec.targetType === 'url' && (
                      <input
                        type="url"
                        dir="ltr"
                        value={secUrl}
                        onChange={(e) => setSecUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left"
                      />
                    )}
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!secLabel.trim()) return;
                          onUpdateSection(sec.id, {
                            label: secLabel.trim(),
                            desc: secDesc.trim(),
                            ...(sec.targetType === 'url' && secUrl.trim()
                              ? { targetValue: normalizeExternalUrl(secUrl) }
                              : {}),
                          });
                          setEditingSecId(null);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                      >
                        حفظ
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSecId(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {sec.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {sec.desc}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveSection(sec.id, 'up')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => onMoveSection(sec.id, 'down')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        title="تحريك للأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditSection(sec)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-300 cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 cursor-pointer"
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
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={onResetLayout}
            className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ترتيب افتراضي</span>
          </button>
        </div>
      </div>
    </div>
  );
};

