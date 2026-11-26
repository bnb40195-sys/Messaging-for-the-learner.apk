import React from 'react';
import { ChevronLeft, GraduationCap, Info, Pencil } from 'lucide-react';
import { HomeHeroIllustration } from './Illustrations';
import { sortItemsByOrder } from '../lib/customContent';
import {
  ButtonEditModal,
  SectionAdminToolbar,
  SectionCustomEntriesList,
  SectionCustomizationContext,
  SectionEntryModal,
  SectionHeaderEditModal,
  useSectionEditor,
} from './SectionCustomEditor';

interface PlatformsPageProps {
  onBack: () => void;
  onSelectLevel?: (level: 'middle' | '1as' | '2as' | '3as') => void;
  onShowInfo: (levelTitle: string, info: string) => void;
  onOpenSite: (url: string) => void;
  customization?: SectionCustomizationContext;
}

export const PlatformsPage: React.FC<PlatformsPageProps> = ({
  onBack,
  onShowInfo,
  onOpenSite,
  customization,
}) => {
  const editor = useSectionEditor(customization);

  const levels = [
    {
      id: 'middle' as const,
      title: 'المتوسط',
      url: 'https://scolarium-moyen.onefd.edu.dz/',
      subdomain: 'scolarium-moyen.onefd.edu.dz',
      info: 'أرضية المعلام للتعليم المتوسط: تشمل السنوات الأولى، الثانية، الثالثة، والرابعة متوسط (BEM). الدخول برقم التسجيل وتحميل الدروس.',
    },
    {
      id: '1as' as const,
      title: 'أولى ثانوي',
      url: 'https://scolarium-1as.onefd.edu.dz/',
      subdomain: 'scolarium-1as.onefd.edu.dz',
      info: 'أرضية المعلام للسنة الأولى ثانوي: جذع مشترك علوم وتكنولوجيا، وجذع مشترك آداب مع كافة الدروس والحلول النموذجية.',
    },
    {
      id: '2as' as const,
      title: 'ثانية ثانوي',
      url: 'https://scolarium-2as.onefd.edu.dz/',
      subdomain: 'scolarium-2as.onefd.edu.dz',
      info: 'أرضية المعلام للسنة الثانية ثانوي: شعب العلوم التجريبية، الرياضيات، التقني رياضي، التسيير والاقتصاد، اللغات، والآداب.',
    },
    {
      id: '3as' as const,
      title: 'ثالثة ثانوي',
      url: 'https://scolarium-3as.onefd.edu.dz/',
      subdomain: 'scolarium-3as.onefd.edu.dz',
      info: 'أرضية المعلام لتحضير البكالوريا (BAC): دروس متكاملة، بنك مواضيع البكالوريا، وشعب التعليم الثانوي كاملة.',
    },
  ];

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {editor.sectionHeader.title || 'الأرضيات التعليمية (المعلام)'}
          </h1>
          {editor.sectionHeader.subtitle && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {editor.sectionHeader.subtitle}
            </p>
          )}
        </div>

        <div className="w-11" />
      </div>

      {/* Admin Customization Toolbar */}
      <SectionAdminToolbar
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        hasOverrides={editor.hasOverrides}
        onToggleEditMode={() => editor.setIsEditMode((v) => !v)}
        onOpenAddEntry={(type) =>
          editor.setEntryModal({ isOpen: true, initialType: type, editingEntry: null })
        }
        onEditSectionHeader={() => editor.setIsHeaderModalOpen(true)}
        onResetSectionOverrides={() => customization?.onResetSectionOverrides()}
      />

      {editor.sectionHeader.note && (
        <div className="w-full max-w-md mb-3 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/35 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {editor.sectionHeader.note}
        </div>
      )}

      {/* Main Vector Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <HomeHeroIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* 4 Level Cards */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-4">
        {sortItemsByOrder(levels, (l) => l.id, editor.buttonOrder).map((lvl) => {
          const ov = editor.overrides[lvl.id];
          if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
            return null;
          }
          const displayTitle = ov?.label || lvl.title;
          const displaySub = ov?.subtitle || lvl.subdomain;
          const handleClick = () => {
            if (ov?.actionType === 'text') {
              onShowInfo(ov.textTitle || displayTitle, ov.textBody || lvl.info);
            } else if (ov?.actionType === 'url' && ov.url) {
              onOpenSite(ov.url);
            } else {
              onOpenSite(lvl.url);
            }
          };

          return (
            <div key={lvl.id} className="space-y-1.5">
              <div
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }}
                className={`w-full min-h-[64px] px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800/90 text-slate-900 dark:text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer ${
                  ov?.hidden ? 'opacity-45' : ''
                }`}
              >
                {/* Left Info Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowInfo(
                      displayTitle,
                      ov?.actionType === 'text' && ov.textBody ? ov.textBody : lvl.info
                    );
                  }}
                  className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="معلومات المستوى"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Title and Subdomain */}
                <div className="flex flex-col items-center px-2 min-w-0">
                  <span className="text-base tracking-wide font-extrabold truncate">
                    {displayTitle}
                  </span>
                  <span
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-medium font-mono truncate max-w-[220px]"
                    dir="auto"
                  >
                    {displaySub}
                  </span>
                </div>

                {/* Right Cap Icon */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              {editor.isAdmin && editor.isEditMode && (
                <div className="flex justify-end px-2">
                  <button
                    type="button"
                    onClick={() =>
                      editor.setEditingButton({
                        id: lvl.id,
                        defaultLabel: lvl.title,
                        defaultSubtitle: lvl.subdomain,
                        defaultUrl: lvl.url,
                      })
                    }
                    className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>تعديل هذا الزر</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Websites & Texts Added to This Section */}
      <SectionCustomEntriesList
        entries={editor.entries}
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        onOpenSite={onOpenSite}
        onShowInfo={onShowInfo}
        onEditEntry={(entry) =>
          editor.setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
        }
        onDeleteEntry={(id) => customization?.onDeleteCustomEntry(id)}
        onMoveEntry={(id, dir) => customization?.onMoveCustomEntry(id, dir)}
      />

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          يمكنك الدخول إلى أرضية المعلام عبر حسابك وكلمة المرور الخاصة برقم التسجيل
        </p>
      </div>

      {/* Modals */}
      <ButtonEditModal
        target={editor.editingButton}
        currentOverride={editor.editingButton ? editor.overrides[editor.editingButton.id] : undefined}
        onSave={(id, next) => customization?.onSaveButtonOverride(id, next)}
        onReset={(id) => customization?.onResetButtonOverride(id)}
        onClose={() => editor.setEditingButton(null)}
      />

      <SectionEntryModal
        isOpen={editor.entryModal.isOpen}
        initialType={editor.entryModal.initialType}
        editingEntry={editor.entryModal.editingEntry}
        onSave={(entry, editingId) => customization?.onSaveCustomEntry(entry, editingId)}
        onClose={() => editor.setEntryModal((p) => ({ ...p, isOpen: false }))}
      />

      <SectionHeaderEditModal
        isOpen={editor.isHeaderModalOpen}
        current={editor.sectionHeader}
        defaultTitle="الأرضيات التعليمية (المعلام)"
        defaultSubtitle=""
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
