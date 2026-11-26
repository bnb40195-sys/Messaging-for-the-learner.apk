import React, { useState } from 'react';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          compact
            ? 'flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition-transform active:scale-95 cursor-pointer'
            : 'w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer'
        }
        title="تثبيت التطبيق على جهازك للوصول السريع"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            compact
              ? 'flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-xs font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer'
              : 'w-full p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer'
          }
          title="طريقة التثبيت على آيفون وآيباد"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                  <span>التثبيت على الآيفون والآيباد</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    اضغط على زر <strong>المشاركة</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 dark:text-sky-400" /> في شريط متصفح Safari.
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    مرّر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية</strong> (Add to Home Screen).
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
