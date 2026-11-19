import React, { useState } from 'react';
import { ChevronLeft, ZoomIn, X, ExternalLink, BookOpen } from 'lucide-react';
import { MiddleSchoolIllustration } from './Illustrations';
import { MIDDLE_LEVELS, LevelInfo } from '../data/dirasaData';

interface MiddleSchoolPageProps {
  onBack: () => void;
  onSelectYear: (level: LevelInfo) => void;
}

export const MiddleSchoolPage: React.FC<MiddleSchoolPageProps> = ({ onBack, onSelectYear }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const middleScreenshot = '/assets/aistudio/Screenshot_2026-11-12-23-37-50-103_com.dirasam.dirasam1_337c274b.jpg';

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar matching Screenshot */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>المستوى المتوسط</span>
        </h1>

        <button
          onClick={() => setZoomedImage(middleScreenshot)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 transition-colors"
          title="معاينة صورة الواجهة الأصلية"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Main Vector Illustration matching Screenshot */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <MiddleSchoolIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* 4 Years Buttons with [1], [2], [3], [4] on the right */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-4">
        {MIDDLE_LEVELS.map((lvl) => (
          <div key={lvl.id} className="flex flex-col gap-1">
            <button
              onClick={() => onSelectYear(lvl)}
              className="w-full h-16 px-6 rounded-full bg-gradient-to-r from-[#e3ddfe] via-[#d0c7fe] to-[#aba0fe] hover:from-[#dad2fe] hover:to-[#9f91fd] text-[#2d226b] font-black text-base shadow-md shadow-indigo-500/10 flex items-center justify-between transition-all transform active:scale-[0.98] border border-white/70 dark:border-indigo-400/30 cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs text-indigo-800 font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">المقررات والدروس</span>
              </div>
              <span className="text-base tracking-wide">{lvl.name}</span>
              <div className="w-9 h-9 rounded-xl bg-[#6754e2] text-white font-black text-base flex items-center justify-center shadow-xs">
                {lvl.badgeNumber}
              </div>
            </button>
            <div className="flex justify-end px-3">
              <a
                href={lvl.eDevoirUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>موقع الفرض الإلكتروني الرسمي ↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot Zoom Link */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setZoomedImage(middleScreenshot)}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>معاينة صورة الواجهة الأصلية 🔍</span>
        </button>
      </div>

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-400">
          إعلان: تحضير شامل لشهادة التعليم المتوسط (BEM) عبر أرضيات المعلام الرسمية
        </p>
      </div>

      {/* Screenshot Modal */}
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
              <span>صورة المستوى المتوسط الأصلية</span>
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
