import React from 'react';
import { Palette, Check, X, Globe, Settings, Sun, Moon } from 'lucide-react';
import { APP_THEMES, AppTheme, ColorMode } from '../types/theme';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  colorMode: ColorMode;
  currentTheme: AppTheme;
  currentLanguage: AppLanguage;
  onChangeColorMode: (mode: ColorMode) => void;
  onSelectTheme: (theme: AppTheme) => void;
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
  colorMode,
  currentTheme,
  currentLanguage,
  onChangeColorMode,
  onSelectTheme,
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.settings}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.appearanceTitle} · {t.languageTitle} · {t.themeTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
            aria-label={t.closeMenu}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Light / Dark Mode Switcher */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            {colorMode === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              {t.appearanceTitle}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onChangeColorMode('light')}
              className={`min-h-[44px] rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                colorMode === 'light'
                  ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t.lightModeLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeColorMode('dark')}
              className={`min-h-[44px] rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                colorMode === 'dark'
                  ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t.darkModeLabel}</span>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
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
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300'
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

        {/* App Colors Grid (Backgrounds Removed, 9 Curated Color Themes Applied Globally) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white">
              {t.themeTitle}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(APP_THEMES).map((th) => {
              const isSelected = currentTheme === th.id;
              const label =
                currentLanguage === 'fr'
                  ? th.nameFr
                  : currentLanguage === 'en'
                    ? th.nameEn
                    : th.nameAr;

              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onSelectTheme(th.id)}
                  className={`p-3 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/70 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`w-4 h-4 rounded-full inline-block ring-1 ring-black/10 ${th.swatchPrimaryClass}`}
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full inline-block ring-1 ring-black/10 ${th.swatchSecondaryClass}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {label}
                      </h5>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          {t.applyAndClose}
        </button>
      </div>
    </div>
  );
};
