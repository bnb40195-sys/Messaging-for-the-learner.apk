import React from 'react';
import { ChevronLeft, GraduationCap, Info, BookOpen } from 'lucide-react';
import { HomeHeroIllustration } from './Illustrations';

interface PlatformsPageProps {
  onBack: () => void;
  onSelectLevel: (level: 'middle' | '1as' | '2as' | '3as') => void;
  onShowInfo: (levelTitle: string, info: string) => void;
  onOpenSite: (url: string) => void;
}

export const PlatformsPage: React.FC<PlatformsPageProps> = ({ 
  onBack, 
  onSelectLevel,
  onShowInfo,
  onOpenSite
}) => {
  const levels = [
    {
      id: 'middle' as const,
      title: 'المتوسط',
      url: 'https://scolarium-moyen.onefd.edu.dz/',
      subdomain: 'scolarium-moyen.onefd.edu.dz',
      info: 'أرضية المعلام للتعليم المتوسط: تشمل السنوات الأولى، الثانية، الثالثة، والرابعة متوسط (BEM). الدخول برقم التسجيل وتحميل الدروس.'
    },
    {
      id: '1as' as const,
      title: 'أولى ثانوي',
      url: 'https://scolarium-1as.onefd.edu.dz/',
      subdomain: 'scolarium-1as.onefd.edu.dz',
      info: 'أرضية المعلام للسنة الأولى ثانوي: جذع مشترك علوم وتكنولوجيا، وجذع مشترك آداب مع كافة المقررات والحلول النموذجية.'
    },
    {
      id: '2as' as const,
      title: 'ثانية ثانوي',
      url: 'https://scolarium-2as.onefd.edu.dz/',
      subdomain: 'scolarium-2as.onefd.edu.dz',
      info: 'أرضية المعلام للسنة الثانية ثانوي: شعب العلوم التجريبية، الرياضيات، التقني رياضي، التسيير والاقتصاد، اللغات، والآداب.'
    },
    {
      id: '3as' as const,
      title: 'ثالثة ثانوي',
      url: 'https://scolarium-3as.onefd.edu.dz/',
      subdomain: 'scolarium-3as.onefd.edu.dz',
      info: 'أرضية المعلام لتحضير البكالوريا (BAC): دروس متكاملة، بنك مواضيع البكالوريا، وشعب التعليم الثانوي كاملة.'
    }
  ];

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar matching Screenshot 6 */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>الأرضيات التعليمية (المعلام)</span>
          <span className="text-lg">📲</span>
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Main Vector Illustration matching Screenshot 6 */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <HomeHeroIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* 4 Level Buttons matching Screenshot 6 with left (i) and right grad cap */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-4">
        {levels.map((lvl) => (
          <div key={lvl.id} className="flex flex-col gap-1.5">
            <div
              onClick={() => onOpenSite(lvl.url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenSite(lvl.url);
                }
              }}
              className="w-full h-15 px-6 rounded-full bg-gradient-to-r from-[#dcd7fe] via-[#c6bffe] to-[#a499fe] hover:from-[#cfc7fe] hover:to-[#9385fd] text-[#312579] font-bold text-base shadow-md shadow-indigo-500/10 flex items-center justify-between transition-all transform active:scale-[0.98] border border-white/60 dark:border-indigo-400/30 cursor-pointer"
            >
              {/* Left Info Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo(lvl.title, lvl.info);
                }}
                className="w-8 h-8 rounded-full bg-white/70 dark:bg-indigo-900/60 hover:bg-white text-indigo-700 dark:text-indigo-300 flex items-center justify-center transition-colors shadow-xs"
                title="معلومات المستوى"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Title and Subdomain */}
              <div className="flex flex-col items-center">
                <span className="text-base tracking-wide font-extrabold">{lvl.title}</span>
                <span className="text-[10px] text-indigo-800/80 font-medium font-mono" dir="ltr">{lvl.subdomain}</span>
              </div>

              {/* Right Cap Icon */}
              <div className="w-10 h-10 rounded-full bg-[#7564eb] text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            {/* Sub-action to browse subjects or view on web */}
            <div className="flex items-center justify-between px-3 text-[11px] text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSite(lvl.url);
                }}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                title="فتح موقع المعلام في المتصفح الخارجي"
              >
                <span>فتح الموقع في المتصفح ↗</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLevel(lvl.id);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                <span>استعراض المقررات</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-400">
          إعلان: يمكنك الدخول إلى أرضية المعلام عبر حسابك وكلمة المرور الخاصة برقم التسجيل
        </p>
      </div>
    </div>
  );
};
