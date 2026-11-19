import React, { useState } from 'react';
import { 
  Globe, ExternalLink, Copy, Check, Search, ShieldCheck, 
  RefreshCw, Laptop, BookOpen, FileText, Award, Smartphone, 
  HelpCircle, ChevronLeft, ArrowRight
} from 'lucide-react';
import { ONEFD_WEBSITES, OnefdWebsite } from '../data/dirasaData';

interface WebsitesHubPageProps {
  onBack: () => void;
  onOpenInApp: (url: string) => void;
}

export const WebsitesHubPage: React.FC<WebsitesHubPageProps> = ({ onBack, onOpenInApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSite, setActiveSite] = useState<OnefdWebsite | null>(ONEFD_WEBSITES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inAppPreviewUrl, setInAppPreviewUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'كافة المواقع' },
    { id: 'registration', label: 'التسجيل والوثائق' },
    { id: 'scolarium', label: 'المعلام (Scolarium)' },
    { id: 'exams', label: 'الفروض والاستدعاء' },
    { id: 'results', label: 'النقاط والشهادات' }
  ];

  const filteredSites = ONEFD_WEBSITES.filter(site => {
    const matchesCat = selectedCategory === 'all' || site.category === selectedCategory;
    const matchesQuery = site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = (site: OnefdWebsite) => {
    navigator.clipboard.writeText(site.url);
    setCopiedId(site.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-full pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>بوابة المواقع والخدمات التعليمية</span>
            <span className="text-lg">🌐</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            الدليل الشامل للوصول إلى كافة أرضيات ومواقع الديوان الوطني ONEFD لعام 2026/2027
          </p>
        </div>

        <div className="w-10"></div>
      </div>

      {/* In-App Browser Simulation Modal */}
      {inAppPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[85vh]">
            {/* Browser chrome header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block cursor-pointer" onClick={() => setInAppPreviewUrl(null)}></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>

              {/* URL bar */}
              <div className="flex-1 max-w-lg mx-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate flex-1 text-left" dir="ltr">{inAppPreviewUrl}</span>
                <button 
                  onClick={() => setInAppPreviewUrl(inAppPreviewUrl)}
                  className="p-1 hover:text-indigo-600 transition-colors"
                  title="تحديث"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenExternal(inAppPreviewUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <span>فتح في نافذة كاملة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setInAppPreviewUrl(null)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Browser body / Iframe fallback area */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  الانتقال إلى البوابة الرسمية
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  تتطلب بوابات الديوان الوطني للتعليم والتكوين عن بعد اتصالاً مباشراً ومشفرًا عبر الخادم الرسمي لضمان أمان بيانات التسجيل والفروض.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleOpenExternal(inAppPreviewUrl)}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  >
                    <span>فتح الموقع داخل التطبيق</span>
                    <Globe className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inAppPreviewUrl);
                      alert('تم نسخ الرابط بنجاح!');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ رابط الموقع ومشاركته</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              امسح الرمز لفتح الموقع على الهاتف
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              يمكنك مسح الرمز بكاميرا هاتفك للانتقال مباشرة للبوابة
            </p>
            {/* Simulated Clean SVG QR Code */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block mb-4 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-44 h-44">
                <rect width="100" height="100" fill="#ffffff" />
                {/* QR corners */}
                <rect x="5" y="5" width="25" height="25" fill="#1e1b4b" rx="3" />
                <rect x="9" y="9" width="17" height="17" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="9" height="9" fill="#1e1b4b" rx="1" />

                <rect x="70" y="5" width="25" height="25" fill="#1e1b4b" rx="3" />
                <rect x="74" y="9" width="17" height="17" fill="#ffffff" rx="2" />
                <rect x="78" y="13" width="9" height="9" fill="#1e1b4b" rx="1" />

                <rect x="5" y="70" width="25" height="25" fill="#1e1b4b" rx="3" />
                <rect x="9" y="74" width="17" height="17" fill="#ffffff" rx="2" />
                <rect x="13" y="78" width="9" height="9" fill="#1e1b4b" rx="1" />

                {/* Data dots */}
                <rect x="36" y="8" width="6" height="6" fill="#4338ca" />
                <rect x="46" y="8" width="6" height="12" fill="#4338ca" />
                <rect x="56" y="12" width="8" height="6" fill="#4338ca" />

                <rect x="8" y="36" width="6" height="6" fill="#4338ca" />
                <rect x="20" y="44" width="12" height="6" fill="#4338ca" />
                <rect x="36" y="36" width="10" height="10" fill="#1e1b4b" />
                <rect x="52" y="36" width="8" height="8" fill="#4338ca" />
                <rect x="68" y="36" width="12" height="8" fill="#1e1b4b" />

                <rect x="36" y="54" width="14" height="6" fill="#4338ca" />
                <rect x="56" y="54" width="8" height="14" fill="#1e1b4b" />
                <rect x="72" y="54" width="14" height="6" fill="#4338ca" />

                <rect x="36" y="72" width="8" height="16" fill="#1e1b4b" />
                <rect x="50" y="78" width="16" height="8" fill="#4338ca" />
                <rect x="74" y="72" width="16" height="16" fill="#1e1b4b" />
              </svg>
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate mb-5" dir="ltr">
              {showQrModal}
            </p>
            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن موقع (تسجيل، معلام، فرض، استدعاء، كشف نقاط)..."
          className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#7c6bee] to-[#6351e6] text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredSites.map((site) => {
          const isSelected = activeSite?.id === site.id;
          return (
            <div
              key={site.id}
              onClick={() => setActiveSite(site)}
              className={`p-5 rounded-3xl transition-all border cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20 border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 shadow-sm'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7c6bee] to-[#4f3fc7] text-white flex items-center justify-center shadow-sm shrink-0">
                      {site.iconType === 'link' && <Globe className="w-5 h-5" />}
                      {site.iconType === 'laptop' && <Laptop className="w-5 h-5" />}
                      {site.iconType === 'book' && <BookOpen className="w-5 h-5" />}
                      {site.iconType === 'file' && <FileText className="w-5 h-5" />}
                      {site.iconType === 'award' && <Award className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {site.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                          {site.badge}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {site.statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {site.description}
                </p>

                {/* URL preview */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 mb-4 text-[11px] font-mono text-slate-500" dir="ltr">
                  <span className="truncate max-w-[200px]">{site.url}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(site);
                    }}
                    className="p-1 hover:text-indigo-600 transition-colors"
                    title="نسخ الرابط"
                  >
                    {copiedId === site.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenExternal(site.url);
                  }}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
                  title="فتح الموقع الرسمي في المتصفح الخارجي"
                >
                  <span>فتح الموقع في المتصفح ↗</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQrModal(site.url);
                  }}
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shrink-0"
                  title="رمز QR للهاتف"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Guide & Guidelines Banner for the Selected Site */}
      {activeSite && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              تعليمات الاستخدام وإرشادات الدخول إلى: {activeSite.title}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {activeSite.guidelines.map((guide, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-slate-950 border border-indigo-100/60 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {guide}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
