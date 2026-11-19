import React, { useState } from 'react';
import { 
  ChevronLeft, UserCheck, UserPlus, ExternalLink, 
  Info, ArrowUpRight
} from 'lucide-react';
import { RegistrationIllustration } from './Illustrations';

interface RegistrationPageProps {
  onBack: () => void;
  onOpenSite?: (url: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onBack, onOpenSite }) => {
  const [selectedGuide, setSelectedGuide] = useState<'old' | 'new' | null>(null);

  const OLD_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/old-student/verify-identity';
  const NEW_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/new-student/create-account';

  const handleOpenExternal = (url: string) => {
    if (onOpenSite) {
      onOpenSite(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>تسجيل الدخول</span>
          <span className="text-lg">🔐</span>
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Main Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <RegistrationIllustration className="w-72 h-52 sm:w-80 sm:h-60" />
      </div>

      {/* Headline & Guidance */}
      <div className="w-full max-w-md text-center mb-5">
        <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/80 dark:border-indigo-800">
          بوابة تسجيل الدخول والتسجيلات الرسمية
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          اختر نوع الدخول المناسب: متعلم سابق لإعادة التسجيل وتأكيد الهوية، أو تسجيل متعلم جديد
        </p>
      </div>

      {/* Unified Login Options Container */}
      <div className="w-full max-w-md flex flex-col gap-3.5">
        
        {/* Option 1: تسجيل دخول متعلم سابق (تأكيد الهوية) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  متعلم سابق · إعادة التسجيل
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  تسجيل الدخول لمتعلم سابق (تأكيد الهوية)
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedGuide('old')}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 shrink-0"
              title="دليل إعادة التسجيل"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            للطلبة المسجلين سابقاً بالديوان الوطني ONEFD: الدخول برقم الاستمارة أو رقم التسجيل وتأكيد الهوية لاستخراج وثائق الموسم الجديد.
          </p>

          <button
            onClick={() => handleOpenExternal(OLD_STUDENT_URL)}
            className="w-full h-11 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span>دخول وتأكيد هوية متعلم سابق ↗</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Option 2: تسجيل متعلم جديد (حساب جديد) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  متعلم جديد · لأول مرة
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  إنشاء حساب وتسجيل متعلم جديد
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedGuide('new')}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 shrink-0"
              title="دليل التسجيل والشروط"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            للراغبين في التسجيل لأول مرة في الطور المتوسط أو الثانوي: إدخال بيانات الحالة المدنية وتوليد استمارة التسجيل وحوالة بريد الجزائر.
          </p>

          <button
            onClick={() => handleOpenExternal(NEW_STUDENT_URL)}
            className="w-full h-11 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span>إنشاء حساب وتسجيل جديد ↗</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Guide Modals */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {selectedGuide === 'new' ? <UserPlus className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedGuide === 'new' ? 'إجراءات تسجيل متعلم جديد 2026/2027' : 'إجراءات إعادة تسجيل متعلم سابق 2026/2027'}
                  </h3>
                  <p className="text-xs text-slate-500">الديوان الوطني للتعليم والتكوين عن بعد (ONEFD)</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block">الملف المطلوب:</span>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>استمارة التسجيل الإلكترونية مستخرجة من الموقع الرسمي.</li>
                  <li>وصل دفع حقوق التسجيل المسلم من بريد الجزائر (حوالة بريدية).</li>
                  <li>شهادة ميلاد أصلية حديثة (للمتعلم الجديد).</li>
                  <li>كشف نقاط المستوى الدراسي الأخير أو شهادة مدرسية أصلية.</li>
                  <li>صورتان شمسيتان حديثتان وظرفان بريديان عليهما طابع وعنوان الإقامة.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  const targetUrl = selectedGuide === 'new' ? NEW_STUDENT_URL : OLD_STUDENT_URL;
                  setSelectedGuide(null);
                  handleOpenExternal(targetUrl);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <span>الانتقال للموقع الرسمي في المتصفح ↗</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-400">
          تنبيه: كافة عمليات تسجيل الدخول والتسجيلات تتم عبر خادم الديوان الوطني inscriptic المشفر
        </p>
      </div>
    </div>
  );
};
