import React from 'react';
import { Palette, Check, X, Globe, Image as ImageIcon, Settings } from 'lucide-react';
import { APP_BACKGROUNDS, APP_THEMES, AppBackground, AppTheme } from '../types/theme';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: AppTheme;
  currentBackground: AppBackground;
  currentLanguage: AppLanguage;
  onSelectTheme: (theme: AppTheme) => void;
  onSelectBackground: (bg: AppBackground) => void;
  onSelectLanguage: (lang: AppLanguage) => void;
  onClose: () => void;
}

const LANGUAGE_OPTIONS: { id: AppLanguage; label: string; native: string; dirLabel: string }[] = [
  { id: 'ar', label: 'العربية', native: 'Arabic', dirLabel: 'RTL' },
  { id: 'fr', label: 'Français', native: 'الفرنسية', dirLabel: 'LTR' },
  { id: 'en', label: 'English', native: 'الإنجليزية', dirLabel: 'LTR' },
];

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  currentBackground,
  currentLanguage,
  onSelectTheme,
  onSelectBackground,
  onSelectLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.settings}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.languageDesc} · {t.backgroundDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              {t.languageTitle}
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGE_OPTIONS.map((lang) => {
              const selected = currentLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onSelectLanguage(lang.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-indigo-300'
                  }`}
                >
                  <span className="block text-xs font-black text-slate-900 dark:text-white">
                    {lang.label}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang.native}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Background Preset Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              {t.backgroundTitle}
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(APP_BACKGROUNDS).map((bg) => {
              const isSelected = currentBackground === bg.id;
              const bgTitle =
                currentLanguage === 'fr'
                  ? bg.nameFr
                  : currentLanguage === 'en'
                  ? bg.nameEn
                  : bg.nameAr;

              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onSelectBackground(bg.id)}
                  className={`p-2.5 rounded-2xl border text-start transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl shrink-0 shadow-xs ${bg.previewSwatch}`}
                  />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 flex-1">
                    {bgTitle}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Themes Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              {t.themeTitle}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(APP_THEMES).map((th) => {
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onSelectTheme(th.id)}
                  className={`p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/50 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      {th.id === 'futuristic-lavender' && (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#7c6bee] inline-block" />
                          <span className="w-3.5 h-3.5 rounded-full bg-[#c6bffe] inline-block" />
                        </>
                      )}
                      {th.id === 'cyber-dark' && (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-cyan-400 inline-block" />
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 inline-block" />
                        </>
                      )}
                      {th.id === 'academic-blue' && (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-300 inline-block" />
                        </>
                      )}
                      {th.id === 'emerald-study' && (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block" />
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-300 inline-block" />
                        </>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentLanguage === 'ar' ? th.nameAr : th.nameEn}
                      </h5>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          {t.applyAndClose}
        </button>
      </div>
    </div>
  );
};
