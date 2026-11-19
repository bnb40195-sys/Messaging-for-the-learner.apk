import React, { useState } from 'react';
import { ChevronLeft, ExternalLink, BookOpen, Download, FileText, CheckCircle, Award } from 'lucide-react';
import { LevelInfo, SAMPLE_EXAMS } from '../data/dirasaData';

interface LevelDetailPageProps {
  level: LevelInfo;
  onBack: () => void;
  onOpenSite: (url: string) => void;
}

export const LevelDetailPage: React.FC<LevelDetailPageProps> = ({ level, onBack, onOpenSite }) => {
  const [selectedTab, setSelectedTab] = useState<'subjects' | 'exams' | 'branches'>('subjects');

  return (
    <div className="min-h-full pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{level.name}</span>
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            {level.badgeNumber}
          </span>
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Main Level Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#dcd7fe] via-[#c6bffe] to-[#a499fe] text-[#2c2069] shadow-md shadow-indigo-500/10 mb-6 border border-white/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900/80 block mb-1">
              الديوان الوطني للتعليم والتكوين عن بعد · ONEFD
            </span>
            <h2 className="text-xl font-extrabold text-[#221757] mb-2">
              منهاج ومقررات {level.name} 2026/2027
            </h2>
            <p className="text-xs text-indigo-950/80 leading-relaxed max-w-xl">
              {level.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => onOpenSite(level.eDevoirUrl)}
              className="px-4 py-2.5 rounded-2xl bg-[#6754e2] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>الفرض الإلكتروني ↗</span>
            </button>
            <button
              onClick={() => onOpenSite(level.scolariumUrl)}
              className="px-4 py-2.5 rounded-2xl bg-white text-indigo-700 font-extrabold text-xs shadow-md hover:bg-indigo-50 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>أرضية المعلام ↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSelectedTab('subjects')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            selectedTab === 'subjects'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          المواد والدروس المقررة ({level.subjectsCount})
        </button>

        {level.branches && (
          <button
            onClick={() => setSelectedTab('branches')}
            className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
              selectedTab === 'branches'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            الشعب والتخصصات ({level.branches.length})
          </button>
        )}

        <button
          onClick={() => setSelectedTab('exams')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 ${
            selectedTab === 'exams'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          بنك الفروض والامتحانات
        </button>
      </div>

      {/* Tab 1: Subjects */}
      {selectedTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'اللغة العربية وآدابها', 'الرياضيات', 'العلوم الفيزيائية', 
            'علوم الطبيعة والحياة', 'اللغة الفرنسية', 'اللغة الإنجليزية', 
            'التاريخ والجغرافيا', 'التربية الإسلامية', 'التربية المدنية / الفلسفة',
            'التكنولوجيا والمعلوماتية', 'التربية الفنية والموسيقية'
          ].slice(0, level.subjectsCount).map((sub, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {sub}
                  </h4>
                  <span className="text-[10px] text-slate-400">دروس وملخصات المعلام</span>
                </div>
              </div>

              <button
                onClick={() => onOpenSite(level.scolariumUrl)}
                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                title="تحميل الدروس"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Branches */}
      {selectedTab === 'branches' && level.branches && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {level.branches.map((branch, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c6bee] to-[#4f3fc7] text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {branch}
                  </h4>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    متاحة للتعليم والتكوين عن بعد 2026/2027
                  </span>
                </div>
              </div>
              <button
                onClick={() => onOpenSite(level.scolariumUrl)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50"
              >
                المقررات
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Exams */}
      {selectedTab === 'exams' && (
        <div className="space-y-3">
          {SAMPLE_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exam.subject} - {exam.year}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {exam.topic} · المدة: {exam.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>مع التصحيح النموذجي</span>
                </span>
                <button
                  onClick={() => alert(`جاري تحميل موضوع امتحان ${exam.subject}...`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
