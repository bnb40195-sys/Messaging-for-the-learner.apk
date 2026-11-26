import React, { useState } from 'react';
import {
  ChevronLeft,
  ExternalLink,
  BookOpen,
  Download,
  FileText,
  CheckCircle,
  Award,
  Pencil,
} from 'lucide-react';
import { LevelInfo, SAMPLE_EXAMS } from '../data/dirasaData';
import { sampleExamToPdfPayload } from '../data/levelExamsCatalog';
import { PdfDocumentPayload } from '../lib/pdfEngine';
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

interface LevelDetailPageProps {
  level: LevelInfo;
  onBack: () => void;
  onOpenSite: (url: string) => void;
  onOpenPdf?: (payload: PdfDocumentPayload) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

export const LevelDetailPage: React.FC<LevelDetailPageProps> = ({
  level,
  onBack,
  onOpenSite,
  onOpenPdf,
  onShowInfo,
  customization,
}) => {
  const [selectedTab, setSelectedTab] = useState<'subjects' | 'exams' | 'branches'>('subjects');
  const editor = useSectionEditor(customization);

  const devoirOv = editor.overrides['hero-edevoir'];
  const scolariumOv = editor.overrides['hero-scolarium'];

  return (
    <div className="min-h-full pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{editor.sectionHeader.title || level.name}</span>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            {level.badgeNumber}
          </span>
        </h1>

        <div className="w-11" />
      </div>

      {/* Admin Customization Toolbar */}
      <div className="flex flex-col items-center">
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
      </div>

      {/* Main Level Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-600/15 mb-6 border border-blue-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-100 block mb-1">
              الديوان الوطني للتعليم والتكوين عن بعد · ONEFD
            </span>
            <h2 className="text-xl font-extrabold text-white mb-2">
              {editor.sectionHeader.subtitle || `منهاج ودروس ${level.name} 2026/2027`}
            </h2>
            <p className="text-xs text-blue-50/90 leading-relaxed max-w-xl whitespace-pre-line">
              {editor.sectionHeader.note || level.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {sortItemsByOrder(
              [
                {
                  id: 'hero-edevoir' as const,
                  ov: devoirOv,
                  render: (
                    <div key="hero-edevoir" className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (devoirOv?.actionType === 'text') {
                            onShowInfo?.(
                              devoirOv.textTitle || devoirOv.label || 'الفرض الإلكتروني',
                              devoirOv.textBody || ''
                            );
                          } else if (devoirOv?.actionType === 'url' && devoirOv.url) {
                            onOpenSite(devoirOv.url);
                          } else {
                            onOpenSite(level.eDevoirUrl);
                          }
                        }}
                        className={`min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white font-extrabold text-xs shadow-md hover:bg-slate-900 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
                          devoirOv?.hidden ? 'opacity-45' : ''
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{devoirOv?.label || 'الفرض الإلكتروني ↗'}</span>
                      </button>
                      {editor.isAdmin && editor.isEditMode && (
                        <button
                          type="button"
                          onClick={() =>
                            editor.setEditingButton({
                              id: 'hero-edevoir',
                              defaultLabel: 'الفرض الإلكتروني ↗',
                              defaultUrl: level.eDevoirUrl,
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-white/20 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>تعديل</span>
                        </button>
                      )}
                    </div>
                  ),
                },
                {
                  id: 'hero-scolarium' as const,
                  ov: scolariumOv,
                  render: (
                    <div key="hero-scolarium" className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (scolariumOv?.actionType === 'text') {
                            onShowInfo?.(
                              scolariumOv.textTitle || scolariumOv.label || 'أرضية المعلام',
                              scolariumOv.textBody || ''
                            );
                          } else if (scolariumOv?.actionType === 'url' && scolariumOv.url) {
                            onOpenSite(scolariumOv.url);
                          } else {
                            onOpenSite(level.scolariumUrl);
                          }
                        }}
                        className={`min-h-[44px] px-4 py-2.5 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-blue-50 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
                          scolariumOv?.hidden ? 'opacity-45' : ''
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{scolariumOv?.label || 'أرضية المعلام ↗'}</span>
                      </button>
                      {editor.isAdmin && editor.isEditMode && (
                        <button
                          type="button"
                          onClick={() =>
                            editor.setEditingButton({
                              id: 'hero-scolarium',
                              defaultLabel: 'أرضية المعلام ↗',
                              defaultUrl: level.scolariumUrl,
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-white/20 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>تعديل</span>
                        </button>
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedTab('subjects')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            selectedTab === 'subjects'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          المواد والدروس ({level.subjectsCount})
        </button>

        {level.branches && (
          <button
            type="button"
            onClick={() => setSelectedTab('branches')}
            className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
              selectedTab === 'branches'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الشعب والتخصصات ({level.branches.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setSelectedTab('exams')}
          className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
            selectedTab === 'exams'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          بنك الفروض والامتحانات
        </button>
      </div>

      {/* Tab 1: Subjects */}
      {selectedTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'اللغة العربية وآدابها', 'الرياضيات', 'العلوم الفيزيائية',
            'علوم الطبيعة والحياة', 'اللغة الفرنسية', 'اللغة الإنجليزية',
            'التاريخ والجغرافيا', 'التربية الإسلامية', 'التربية المدنية / الفلسفة',
            'التكنولوجيا والمعلوماتية', 'التربية الفنية والموسيقية',
          ]
            .slice(0, level.subjectsCount)
            .map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs tabular-nums">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {sub}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">دروس وملخصات المعلام</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSite(level.scolariumUrl)}
                  className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="فتح الدروس في المعلام"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Tab 2: Branches */}
      {selectedTab === 'branches' && level.branches && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {level.branches.map((branch, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {branch}
                  </h4>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    متاحة للتعليم والتكوين عن بعد 2026/2027
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenSite(level.scolariumUrl)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
              >
                الدروس
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Exams */}
      {selectedTab === 'exams' && (
        <div className="space-y-3">
          {SAMPLE_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exam.subject} - {exam.year}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {exam.topic} · المدة: {exam.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>مع التصحيح النموذجي</span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPdf?.(sampleExamToPdfPayload(exam))}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>فتح PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Websites, Texts & Images Added to This Level */}
      {editor.entries.length > 0 && (
        <div className="flex flex-col items-center mt-4">
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
        </div>
      )}

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
        defaultTitle={level.name}
        defaultSubtitle={`منهاج ودروس ${level.name} 2026/2027`}
        defaultNote={level.description}
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
