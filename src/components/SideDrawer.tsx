import React from 'react';
import {
  X,
  Home,
  BookOpen,
  User,
  FileText,
  Laptop,
  ChevronLeft,
  Globe,
  Star,
  SlidersHorizontal,
  ExternalLink,
  Award,
  Users,
  Settings,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AppSectionItem } from '../types/sections';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  isAdmin?: boolean;
  language?: AppLanguage;
  onOpenSettings?: () => void;
  onOpenAdminEditor?: () => void;
  sections: AppSectionItem[];
  onSelectSection: (section: AppSectionItem) => void;
}

function getSectionIcon(iconName: AppSectionItem['iconName']) {
  switch (iconName) {
    case 'home':
      return Home;
    case 'book':
      return BookOpen;
    case 'user':
      return User;
    case 'users':
      return Users;
    case 'file':
      return FileText;
    case 'laptop':
      return Laptop;
    case 'star':
      return Star;
    case 'award':
      return Award;
    case 'globe':
    default:
      return Globe;
  }
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  isAdmin = false,
  language = 'ar',
  onOpenSettings,
  onOpenAdminEditor,
  sections,
  onSelectSection,
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Side Window Panel - Slides from Right (RTL) */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-slideInRight">
          {/* Header */}
          <div className="p-5 border-b border-blue-700/20 dark:border-slate-800 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 dark:from-slate-800 dark:to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/app-logo.png"
                alt="شعار بوابة المتعلم"
                className="w-11 h-11 rounded-2xl shadow-md object-cover shrink-0 border border-white/30"
              />
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {t.appName}
                </h3>
                <span className="text-[11px] text-white/85 font-bold block">
                  {t.seasonTag}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              title={t.closeMenu}
              aria-label={t.closeMenu}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.sectionsHeading}
                </span>
              </div>

              <div className="space-y-2.5">
                {sections.map((item) => {
                  const Icon = getSectionIcon(item.iconName);
                  const isActive =
                    item.targetType === 'view' && currentView === item.targetValue;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 shadow-xs'
                          : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800'
                      }`}
                    >
                      <div className="p-3.5 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSection(item);
                            onClose();
                          }}
                          className="flex-1 flex items-center gap-3 text-right min-w-0 cursor-pointer"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-extrabold truncate ${
                                isActive
                                  ? 'text-blue-600 dark:text-sky-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.label}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {item.desc}
                            </p>
                          </div>
                        </button>

                        {item.targetType === 'url' ? (
                          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronLeft className="w-4 h-4 text-slate-400 rtl:rotate-180 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unified Modifications & Customization Section (Admin Only) */}
            {isAdmin && onOpenAdminEditor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminEditor();
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  currentView === 'admin-editor'
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700'
                    : 'bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div className="text-start min-w-0">
                    <h4 className="text-xs font-black text-blue-900 dark:text-sky-200 truncate">
                      قسم التعديلات والتخصيص
                    </h4>
                    <p className="text-[10px] text-blue-700/80 dark:text-sky-300/80 mt-0.5 truncate">
                      تعديل الأقسام، تغيير مواقع الأزرار، وتخصيص الواجهة
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-blue-600 dark:text-sky-400 rtl:rotate-180 shrink-0" />
              </button>
            )}

            {/* Settings Shortcut (Appearance, Language & Background) */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 text-white flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="text-start">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {t.settings}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.appearanceTitle} · {t.languageTitle} · {t.themeTitle}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 rtl:rotate-180 shrink-0" />
              </button>
            )}

            {/* Install Offline App Button (only shown when installable) */}
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </div>
  );
};
