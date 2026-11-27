import React, { useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  ArrowUpRight,
  Pencil,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { DocumentsIllustration } from './Illustrations';
import { DOCUMENT_ACTIONS, DocumentAction } from '../data/dirasaData';
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

interface DocumentsPageProps {
  onBack: () => void;
  onOpenSite: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

const OLD_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/old-student/verify-identity';
const NEW_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/new-student/create-account';

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  onBack,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const editor = useSectionEditor(customization);
  const [subView, setSubView] = useState<'main' | 'registration'>('main');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'check':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'id':
        return <CreditCard className="w-5 h-5" />;
      case 'help':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleDirectOpen = (action: DocumentAction) => {
    const ov = editor.overrides[action.id];
    if (ov?.actionType === 'text') {
      onShowInfo?.(ov.textTitle || ov.label || action.title, ov.textBody || action.description);
    } else if (ov?.actionType === 'url' && ov.url) {
      onOpenSite(ov.url);
    } else if (action.externalUrl) {
      onOpenSite(action.externalUrl);
    }
  };

  const regTriggerOv = editor.overrides['correspondence-reg'];
  const oldOv = editor.overrides['old-student'];
  const newOv = editor.overrides['new-student'];

  const handleRegTriggerClick = () => {
    if (regTriggerOv?.actionType === 'text') {
      onShowInfo?.(
        regTriggerOv.textTitle || regTriggerOv.label || 'تسجيل المراسلة',
        regTriggerOv.textBody || ''
      );
    } else if (regTriggerOv?.actionType === 'url' && regTriggerOv.url) {
      onOpenSite(regTriggerOv.url);
    } else {
      setSubView('registration');
    }
  };

  const handleRegAction = (
    ov: typeof oldOv,
    defaultUrl: string,
    defaultTitle: string
  ) => {
    if (ov?.actionType === 'text') {
      onShowInfo?.(ov.textTitle || ov.label || defaultTitle, ov.textBody || '');
    } else if (ov?.actionType === 'url' && ov.url) {
      onOpenSite(ov.url);
    } else {
      onOpenSite(defaultUrl);
    }
  };

  const mainButtons = sortItemsByOrder(
    [
      ...DOCUMENT_ACTIONS.map((action) => ({
        id: action.id,
        kind: 'doc' as const,
        action,
      })),
      {
        id: 'correspondence-reg',
        kind: 'correspondence-reg' as const,
      },
    ],
    (item) => item.id,
    editor.buttonOrder
  );

  const registrationButtons = sortItemsByOrder(
    [
      {
        id: 'old-student' as const,
        defaultLabel: 'تسجيل متعلم سابق',
        defaultSubtitle: 'inscriptic.onefd.edu.dz · تأكيد الهوية وإعادة التسجيل',
        defaultUrl: OLD_STUDENT_URL,
      },
      {
        id: 'new-student' as const,
        defaultLabel: 'تسجيل متعلم جديد',
        defaultSubtitle: 'inscriptic.onefd.edu.dz · إنشاء حساب وتسجيل لأول مرة',
        defaultUrl: NEW_STUDENT_URL,
      },
    ],
    (item) => item.id,
    editor.buttonOrder
  );

  const handleTopBack = () => {
    if (subView === 'registration') {
      setSubView('main');
      return;
    }
    onBack();
  };

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleTopBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {subView === 'registration'
              ? regTriggerOv?.label || 'تسجيل المراسلة'
              : editor.sectionHeader.title || 'سحب الوثائق'}
          </h1>
          {subView === 'main' && editor.sectionHeader.subtitle && (
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

      {subView === 'main' && editor.sectionHeader.note && (
        <div className="w-full max-w-md mb-3 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/35 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {editor.sectionHeader.note}
        </div>
      )}

      {/* Main Vector Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <DocumentsIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* MAIN VIEW: Documents Pill Buttons + "تسجيل المراسلة" Pill Button */}
      {subView === 'main' && (
        <div className="w-full max-w-md flex flex-col gap-3.5 mt-4">
          {mainButtons.map((item) => {
            if (item.kind === 'correspondence-reg') {
              if (regTriggerOv?.hidden && !(editor.isAdmin && editor.isEditMode)) {
                return null;
              }
              const displayTitle = regTriggerOv?.label || 'تسجيل المراسلة';
              return (
                <div key="correspondence-reg" className="space-y-1">
                  <button
                    type="button"
                    onClick={handleRegTriggerClick}
                    className={`w-full min-h-[60px] px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer ${
                      regTriggerOv?.hidden ? 'opacity-45' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="text-center px-2 min-w-0">
                      <span className="text-base tracking-wide block truncate">
                        {displayTitle}
                      </span>
                      {regTriggerOv?.subtitle && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {regTriggerOv.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </button>

                  {editor.isAdmin && editor.isEditMode && (
                    <div className="flex justify-end px-2">
                      <button
                        type="button"
                        onClick={() =>
                          editor.setEditingButton({
                            id: 'correspondence-reg',
                            defaultLabel: 'تسجيل المراسلة',
                            defaultSubtitle: 'تسجيل متعلم سابق وتسجيل متعلم جديد',
                            defaultUrl: '',
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
            }

            const action = item.action;
            const ov = editor.overrides[action.id];
            if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
              return null;
            }
            const displayTitle = ov?.label || action.title;
            const displayDesc = ov?.subtitle || action.description;

            return (
              <div key={action.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleDirectOpen(action)}
                  className={`w-full min-h-[60px] px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer ${
                    ov?.hidden ? 'opacity-45' : ''
                  }`}
                  title={displayDesc}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-center px-2 min-w-0">
                    <span className="text-base tracking-wide block truncate">{displayTitle}</span>
                    {ov?.subtitle && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {ov.subtitle}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    {getIcon(action.iconName)}
                  </div>
                </button>

                {editor.isAdmin && editor.isEditMode && (
                  <div className="flex justify-end px-2">
                    <button
                      type="button"
                      onClick={() =>
                        editor.setEditingButton({
                          id: action.id,
                          defaultLabel: action.title,
                          defaultSubtitle: action.description,
                          defaultUrl: action.externalUrl,
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
      )}

      {/* SUB-VIEW: Inside "تسجيل المراسلة" (Old Student + New Student Buttons with Official Websites) */}
      {subView === 'registration' && (
        <div className="w-full max-w-md flex flex-col gap-3.5 mt-4 animate-fadeIn">
          {registrationButtons.map((btn) => {
            const ov = btn.id === 'old-student' ? oldOv : newOv;
            if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
              return null;
            }
            const displayLabel = ov?.label || btn.defaultLabel;
            const displaySub = ov?.subtitle || btn.defaultSubtitle;
            const isOld = btn.id === 'old-student';

            return (
              <div key={btn.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleRegAction(ov, btn.defaultUrl, btn.defaultLabel)}
                  className={`w-full min-h-[60px] px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-between transition-all active:scale-[0.98] border border-slate-200 dark:border-slate-800 cursor-pointer ${
                    ov?.hidden ? 'opacity-45' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="text-center px-2 min-w-0">
                    <span className="text-base tracking-wide block truncate">{displayLabel}</span>
                    {displaySub && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {displaySub}
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-sm shrink-0 ${
                      isOld ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  >
                    {isOld ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {editor.isAdmin && editor.isEditMode && (
                  <div className="flex justify-end px-2">
                    <button
                      type="button"
                      onClick={() =>
                        editor.setEditingButton({
                          id: btn.id,
                          defaultLabel: btn.defaultLabel,
                          defaultSubtitle: btn.defaultSubtitle,
                          defaultUrl: btn.defaultUrl,
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
      )}

      {/* Custom Websites & Texts Added to This Section */}
      {subView === 'main' && (
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
      )}

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          بالضغط على أي زر يتم توجيهك مباشرة إلى الموقع الرسمي للديوان الوطني للتعليم والتكوين عن بعد
        </p>
      </div>

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
        defaultTitle="سحب الوثائق"
        defaultSubtitle=""
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
