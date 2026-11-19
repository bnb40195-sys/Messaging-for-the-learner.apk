import React, { useState } from 'react';
import { 
  ChevronLeft, Laptop, ExternalLink, AlertCircle, 
  ZoomIn, X, CheckCircle2, Globe, Sparkles
} from 'lucide-react';
import { E_DEVOIR_SECONDARY, E_DEVOIR_MIDDLE, EDevoirLevel } from '../data/dirasaData';
import { SecondarySchoolIllustration, MiddleSchoolIllustration } from './Illustrations';

interface HomeworkPageProps {
  onBack: () => void;
  onOpenSite: (url: string) => void;
}

export const HomeworkPage: React.FC<HomeworkPageProps> = ({ onBack, onOpenSite }) => {
  const [activeTab, setActiveTab] = useState<'secondary' | 'middle'>('secondary');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const secondaryScreenshot = '/assets/aistudio/Screenshot_2026-11-12-23-37-56-253_com.dirasam.dirasam1_eb954954.jpg';
  const middleScreenshot = '/assets/aistudio/Screenshot_2026-11-12-23-37-50-103_com.dirasam.dirasam1_337c274b.jpg';

  const currentLevels = activeTab === 'secondary' ? E_DEVOIR_SECONDARY : E_DEVOIR_MIDDLE;
  const currentTitle = activeTab === 'secondary' ? 'المستوى الثانوي' : 'المستوى المتوسط';
  const currentScreenshot = activeTab === 'secondary' ? secondaryScreenshot : middleScreenshot;

  return (
    <div className="min-h-full pb-16 flex flex-col items-center max-w-xl mx-auto">
      {/* Top App Bar matching Screenshot header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>{currentTitle}</span>
        </h1>

        <button
          onClick={() => setZoomedImage(currentScreenshot)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 transition-colors"
          title="معاينة صورة الواجهة الأصلية"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Level Switcher (ثانوي / متوسط) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-indigo-100/60 dark:bg-slate-800/80 mb-4 border border-indigo-200/60 dark:border-slate-700 w-full max-w-md">
        <button
          onClick={() => setActiveTab('secondary')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'secondary'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <span>المستوى الثانوي (3)</span>
        </button>
        <button
          onClick={() => setActiveTab('middle')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'middle'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <span>المستوى المتوسط (4)</span>
        </button>
      </div>

      {/* Top Vector Illustration matching the screenshots */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300 flex justify-center">
        {activeTab === 'secondary' ? (
          <SecondarySchoolIllustration className="w-72 h-44 sm:w-80 sm:h-52" />
        ) : (
          <MiddleSchoolIllustration className="w-72 h-44 sm:w-80 sm:h-52" />
        )}
      </div>

      {/* Official Alert Box */}
      <div className="w-full max-w-md p-3.5 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5 text-indigo-900 dark:text-indigo-300">
            مواقع الفرض الإلكتروني الرسمي ONEFD:
          </strong>
          اضغط على السنة الدراسية للانتقال مباشرة إلى بوابة الفرض الخاصة بمستواك واحتساب نقطة المراقبة المستمرة.
        </div>
      </div>

      {/* Pill Action Buttons styled exactly like screenshots */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-1">
        {currentLevels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => onOpenSite(lvl.url)}
            className="w-full h-16 px-6 rounded-full bg-gradient-to-r from-[#e3ddfe] via-[#d0c7fe] to-[#aba0fe] hover:from-[#dad2fe] hover:to-[#9f91fd] text-[#2d226b] font-black text-base sm:text-lg shadow-md shadow-indigo-500/10 flex items-center justify-between transition-all transform active:scale-[0.98] border border-white/70 dark:border-indigo-400/30 cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-900 font-bold opacity-80 group-hover:opacity-100">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">دخول ↗</span>
            </div>

            <span className="text-base sm:text-lg tracking-wide">{lvl.name}</span>

            <div className="w-9 h-9 rounded-xl bg-[#6754e2] text-white font-black text-base flex items-center justify-center shadow-xs">
              {lvl.badgeNumber}
            </div>
          </button>
        ))}
      </div>

      {/* Quick link to preview original screenshot */}
      <div className="mt-5 text-center">
        <button
          onClick={() => setZoomedImage(currentScreenshot)}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>معاينة صورة الواجهة الأصلية المرفقة (Screenshot) 🔍</span>
        </button>
      </div>

      {/* Footer Notice matching screenshot */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-400">
          إعلان
        </p>
      </div>

      {/* Screenshot Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm max-h-[92vh] flex flex-col items-center bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-3"
          >
            <div className="w-full flex items-center justify-between pb-2 px-1 text-white text-xs font-bold">
              <span>{activeTab === 'secondary' ? 'صورة المستوى الثانوي الأصلية' : 'صورة المستوى المتوسط الأصلية'}</span>
              <button 
                onClick={() => setZoomedImage(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(92vh-50px)]">
              <img 
                src={zoomedImage} 
                alt="Screenshot preview" 
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
