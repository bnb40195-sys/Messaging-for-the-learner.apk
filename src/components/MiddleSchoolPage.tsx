import React from 'react';
import { ChevronLeft, BookOpen, Pencil } from 'lucide-react';
import { MiddleSchoolIllustration } from './Illustrations';
import { MIDDLE_LEVELS, LevelInfo } from '../data/dirasaData';
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

interface MiddleSchoolPageProps {
  onBack: () => void;
  onSelectYear: (level: LevelInfo) => void;
  onOpenSite?: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

export const MiddleSchoolPage: React.FC<MiddleSchoolPageProps> = ({
  onBack,
  onSelectYear,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const editor = useSectionEditor(customization);

  const openExternal = (url: string) => {
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
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {editor.sectionHeader.title || 'المستوى المتوسط'}
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
        <MiddleSchoolIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* 4 Years Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-4">
        {sortItemsByOrder(MIDDLE_LEVELS, (l) => l.id, editor.buttonOrder).map((lvl) => {
          const ov = editor.overrides[lvl.id];
          if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
            return null;
          }
          const displayName = ov?.label || lvl.name;
          const displaySub = ov?.subtitle || 'الدروس والملخصات';

          const handleClick = () => {
            if (ov?.actionType === 'text') {
              onShowInfo?.(ov.textTitle || displayName, ov.textBody || '');
            } else if (ov?.actionType === 'url' && ov.url) {
              openExternal(ov.url);
            } else {
              onSelectYear(lvl);
            }
          };

          return (
            <div key={lvl.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={handleClick}
                className={`w-full min-h-[64px] px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-base shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer ${
                  ov?.hidden ? 'opacity-45' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline truncate max-w-[110px]">{displaySub}</span>
                </div>
                <span className="text-base tracking-wide">{displayName}</span>
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  {lvl.badgeNumber}
                </div>
              </button>
              <div className="flex items-center justify-between px-3">
                {editor.isAdmin && editor.isEditMode ? (
                  <button
                    type="button"
                    onClick={() =>
                      editor.setEditingButton({
                        id: lvl.id,
                        defaultLabel: lvl.name,
                        defaultSubtitle: 'الدروس والملخصات',
                        defaultUrl: lvl.eDevoirUrl,
                      })
                    }
                    className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>تعديل الزر</span>
                  </button>
                ) : (
                  <span />
                )}
                <a
                  href={lvl.eDevoirUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>موقع الفرض الإلكتروني الرسمي ↗</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Websites & Texts Added to This Section */}
      <SectionCustomEntriesList
        entries={editor.entries}
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        onOpenSite={openExternal}
        onShowInfo={onShowInfo}
        onEditEntry={(entry) =>
          editor.setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
        }
        onDeleteEntry={(id) => customization?.onDeleteCustomEntry(id)}
        onMoveEntry={(id, dir) => customization?.onMoveCustomEntry(id, dir)}
      />

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
        defaultTitle="المستوى المتوسط"
        defaultSubtitle=""
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
