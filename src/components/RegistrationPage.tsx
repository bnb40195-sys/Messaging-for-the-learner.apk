import React, { useState } from 'react';
import {
  ChevronLeft,
  UserCheck,
  UserPlus,
  ExternalLink,
  Info,
  ArrowUpRight,
  Pencil,
} from 'lucide-react';
import { RegistrationIllustration } from './Illustrations';
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

interface RegistrationPageProps {
  onBack: () => void;
  onOpenSite?: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBack,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<'old' | 'new' | null>(null);
  const editor = useSectionEditor(customization);

  const OLD_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/old-student/verify-identity';
  const NEW_STUDENT_URL = 'https://inscriptic.onefd.edu.dz/new-student/create-account';

  const handleOpenExternal = (url: string) => {
    if (onOpenSite) {
      onOpenSite(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const oldOv = editor.overrides['old-student'];
  const newOv = editor.overrides['new-student'];

  const handleButtonAction = (
    ov: typeof oldOv,
    defaultUrl: string,
    defaultTitle: string
  ) => {
    if (ov?.actionType === 'text') {
      onShowInfo?.(ov.textTitle || defaultTitle, ov.textBody || '');
    } else if (ov?.actionType === 'url' && ov.url) {
      handleOpenExternal(ov.url);
    } else {
      handleOpenExternal(defaultUrl);
    }
  };

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          {editor.sectionHeader.title || 'تسجيل الدخول'}
        </h1>

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

      {/* Main Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <RegistrationIllustration className="w-72 h-52 sm:w-80 sm:h-60" />
      </div>

      {/* Headline & Guidance */}
      <div className="w-full max-w-md text-center mb-5">
        <span className="text-xs font-black text-blue-700 dark:text-sky-300 block">
          {editor.sectionHeader.subtitle || 'بوابة تسجيل الدخول والتسجيلات الرسمية'}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 whitespace-pre-line">
          {editor.sectionHeader.note ||
            'اختر نوع الدخول المناسب: متعلم سابق لإعادة التسجيل وتأكيد الهوية، أو تسجيل متعلم جديد'}
        </p>
      </div>

      {/* Unified Login Options Container */}
      <div className="w-full max-w-md flex flex-col gap-3.5">
        {sortItemsByOrder(
          [
            {
              id: 'old-student' as const,
              ov: oldOv,
              render: (
                <div
                  key="old-student"
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow ${
                    oldOv?.hidden ? 'opacity-45' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 shrink-0">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-blue-700 dark:text-sky-300 block">
                          متعلم سابق · إعادة التسجيل
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {oldOv?.label || 'تسجيل الدخول لمتعلم سابق (تأكيد الهوية)'}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedGuide('old')}
                      className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-300 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
                      title="دليل إعادة التسجيل"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {oldOv?.subtitle ||
                      'للطلبة المسجلين سابقاً بالديوان الوطني ONEFD: الدخول برقم الاستمارة أو رقم التسجيل وتأكيد الهوية لاستخراج وثائق الموسم الجديد.'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleButtonAction(oldOv, OLD_STUDENT_URL, 'دخول وتأكيد هوية متعلم سابق')
                    }
                    className="w-full h-11 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>{oldOv?.label || 'دخول وتأكيد هوية متعلم سابق ↗'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {editor.isAdmin && editor.isEditMode && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          editor.setEditingButton({
                            id: 'old-student',
                            defaultLabel: 'دخول وتأكيد هوية متعلم سابق ↗',
                            defaultSubtitle:
                              'للطلبة المسجلين سابقاً بالديوان الوطني ONEFD: الدخول برقم الاستمارة أو رقم التسجيل وتأكيد الهوية لاستخراج وثائق الموسم الجديد.',
                            defaultUrl: OLD_STUDENT_URL,
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
              ),
            },
            {
              id: 'new-student' as const,
              ov: newOv,
              render: (
                <div
                  key="new-student"
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow ${
                    newOv?.hidden ? 'opacity-45' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 block">
                          متعلم جديد · لأول مرة
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {newOv?.label || 'إنشاء حساب وتسجيل متعلم جديد'}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedGuide('new')}
                      className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
                      title="دليل التسجيل والشروط"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {newOv?.subtitle ||
                      'للراغبين في التسجيل لأول مرة في الطور المتوسط أو الثانوي: إدخال بيانات الحالة المدنية وتوليد استمارة التسجيل وحوالة بريد الجزائر.'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleButtonAction(newOv, NEW_STUDENT_URL, 'إنشاء حساب وتسجيل جديد')
                    }
                    className="w-full h-11 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>{newOv?.label || 'إنشاء حساب وتسجيل جديد ↗'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {editor.isAdmin && editor.isEditMode && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          editor.setEditingButton({
                            id: 'new-student',
                            defaultLabel: 'إنشاء حساب وتسجيل جديد ↗',
                            defaultSubtitle:
                              'للراغبين في التسجيل لأول مرة في الطور المتوسط أو الثانوي: إدخال بيانات الحالة المدنية وتوليد استمارة التسجيل وحوالة بريد الجزائر.',
                            defaultUrl: NEW_STUDENT_URL,
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
              ),
            },
          ],
          (item) => item.id,
          editor.buttonOrder
        ).map((item) => {
          if (item.ov?.hidden && !(editor.isAdmin && editor.isEditMode)) return null;
          return item.render;
        })}
      </div>

      {/* Custom Websites & Texts Added to This Section */}
      <SectionCustomEntriesList
        entries={editor.entries}
        isAdmin={editor.isAdmin}
        isEditMode={editor.isEditMode}
        onOpenSite={handleOpenExternal}
        onShowInfo={onShowInfo}
        onEditEntry={(entry) =>
          editor.setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
        }
        onDeleteEntry={(id) => customization?.onDeleteCustomEntry(id)}
        onMoveEntry={(id, dir) => customization?.onMoveCustomEntry(id, dir)}
      />

      {/* Guide Modals */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                  {selectedGuide === 'new' ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedGuide === 'new'
                      ? 'إجراءات تسجيل متعلم جديد 2026/2027'
                      : 'إجراءات إعادة تسجيل متعلم سابق 2026/2027'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الديوان الوطني للتعليم والتكوين عن بعد (ONEFD)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-blue-700 dark:text-sky-300 block">
                  الملف المطلوب:
                </span>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>استمارة التسجيل الإلكترونية مستخرجة من الموقع الرسمي.</li>
                  <li>وصل دفع حقوق التسجيل المسلم من بريد الجزائر (حوالة بريدية).</li>
                  <li>شهادة ميلاد أصلية حديثة (للمتعلم الجديد).</li>
                  <li>كشف نقاط المستوى الدراسي الأخير أو شهادة مدرسية أصلية.</li>
                  <li>صورتان شمسيتان حديثتان وظرفان بريديان عليهما طابع وعنوان الإقامة.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  const targetUrl =
                    selectedGuide === 'new' ? NEW_STUDENT_URL : OLD_STUDENT_URL;
                  setSelectedGuide(null);
                  handleOpenExternal(targetUrl);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:opacity-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>زيارة الموقع الرسمي ↗</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تنبيه: كافة عمليات تسجيل الدخول والتسجيلات تتم عبر خادم الديوان الوطني inscriptic المشفر
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
        defaultTitle="تسجيل الدخول"
        defaultSubtitle="بوابة تسجيل الدخول والتسجيلات الرسمية"
        defaultNote="اختر نوع الدخول المناسب: متعلم سابق لإعادة التسجيل وتأكيد الهوية، أو تسجيل متعلم جديد"
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
