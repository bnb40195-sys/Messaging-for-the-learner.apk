import React, { useState } from 'react';
import { ChevronLeft, ExternalLink, AlertCircle, Pencil } from 'lucide-react';
import { E_DEVOIR_SECONDARY, E_DEVOIR_MIDDLE } from '../data/dirasaData';
import { SecondarySchoolIllustration, MiddleSchoolIllustration } from './Illustrations';
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

interface HomeworkPageProps {
  onBack: () => void;
  onOpenSite: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

export const HomeworkPage: React.FC<HomeworkPageProps> = ({
  onBack,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const [activeTab, setActiveTab] = useState<'secondary' | 'middle'>('secondary');
  const editor = useSectionEditor(customization);

  const currentLevels = activeTab === 'secondary' ? E_DEVOIR_SECONDARY : E_DEVOIR_MIDDLE;
  const currentTitle = activeTab === 'secondary' ? 'المستوى الثانوي' : 'المستوى المتوسط';

  return (
    <div className="min-h-full pb-16 flex flex-col items-center max-w-xl mx-auto">
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
            <span>{editor.sectionHeader.title || currentTitle}</span>
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

      {/* Level Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 mb-4 border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('secondary')}
          className={`flex-1 min-h-[44px] py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'secondary'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>المستوى الثانوي (3)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('middle')}
          className={`flex-1 min-h-[44px] py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'middle'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>المستوى المتوسط (4)</span>
        </button>
      </div>

      {/* Top Vector Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300 flex justify-center">
        {activeTab === 'secondary' ? (
          <SecondarySchoolIllustration className="w-72 h-44 sm:w-80 sm:h-52" />
        ) : (
          <MiddleSchoolIllustration className="w-72 h-44 sm:w-80 sm:h-52" />
        )}
      </div>

      {/* Official Info Box */}
      <div className="w-full max-w-md p-3.5 mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 shadow-xs">
        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5 text-slate-900 dark:text-white">
            مواقع الفرض الإلكتروني الرسمي ONEFD:
          </strong>
          <span className="whitespace-pre-line">
            {editor.sectionHeader.note ||
              'اضغط على السنة الدراسية للانتقال مباشرة إلى بوابة الفرض الخاصة بمستواك واحتساب نقطة المراقبة المستمرة.'}
          </span>
        </div>
      </div>

      {/* Blue Action Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3.5 mt-1">
        {sortItemsByOrder(currentLevels, (l) => l.id, editor.buttonOrder).map((lvl) => {
          const ov = editor.overrides[lvl.id];
          if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
            return null;
          }
          const displayName = ov?.label || lvl.name;

          const handleClick = () => {
            if (ov?.actionType === 'text') {
              onShowInfo?.(ov.textTitle || displayName, ov.textBody || '');
            } else if (ov?.actionType === 'url' && ov.url) {
              onOpenSite(ov.url);
            } else {
              onOpenSite(lvl.url);
            }
          };

          return (
            <div key={lvl.id} className="space-y-1">
              <button
                type="button"
                onClick={handleClick}
                className={`w-full min-h-[64px] px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-base sm:text-lg shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer group ${
                  ov?.hidden ? 'opacity-45' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold opacity-85 group-hover:opacity-100">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">دخول</span>
                </div>

                <div className="text-center px-2 min-w-0">
                  <span className="text-base sm:text-lg tracking-wide block truncate">
                    {displayName}
                  </span>
                  {ov?.subtitle && (
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                      {ov.subtitle}
                    </span>
                  )}
                </div>

                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                  {lvl.badgeNumber}
                </div>
              </button>

              {editor.isAdmin && editor.isEditMode && (
                <div className="flex justify-end px-2">
                  <button
                    type="button"
                    onClick={() =>
                      editor.setEditingButton({
                        id: lvl.id,
                        defaultLabel: lvl.name,
                        defaultSubtitle: '',
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
        defaultTitle="الفرض الإلكتروني الرسمي"
        defaultSubtitle=""
        defaultNote="اضغط على السنة الدراسية للانتقال مباشرة إلى بوابة الفرض الخاصة بمستواك واحتساب نقطة المراقبة المستمرة."
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
