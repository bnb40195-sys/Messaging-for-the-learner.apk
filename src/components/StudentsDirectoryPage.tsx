import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Edit3,
  Plus,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { RegisteredStudentItem } from '../lib/firebase';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';
import {
  SectionAdminToolbar,
  SectionCustomEntriesList,
  SectionCustomizationContext,
  SectionEntryModal,
  SectionHeaderEditModal,
  useSectionEditor,
} from './SectionCustomEditor';

interface StudentsDirectoryPageProps {
  students: RegisteredStudentItem[];
  myStudentKey: string | null;
  mySavedName: string;
  mySavedLevel: string;
  hasRegisteredMyStudent: boolean;
  isAdmin: boolean;
  language?: AppLanguage;
  onBack: () => void;
  onSaveMyStudentProfile: (name: string, levelBadge: string) => Promise<void>;
  onDeleteStudent: (studentKey: string) => Promise<void>;
  onOpenSite?: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

const LEVEL_OPTIONS = [
  '3 ثانوي (BAC)',
  '2 ثانوي',
  '1 ثانوي',
  '4 متوسط (BEM)',
  '3 متوسط',
  '2 متوسط',
  '1 متوسط',
  'متعلم ONEFD',
];

export function isStudentCurrentlyActive(
  student: RegisteredStudentItem,
  nowMs: number
): boolean {
  if (!student.isOnline) return false;
  if (student.studentKey.startsWith('stu_manual_')) {
    return true;
  }
  const lastMs = student.lastActiveAt?.toMillis?.() ?? student.lastActiveAtMs ?? nowMs;
  return nowMs - lastMs < 10 * 60 * 1000;
}

export const StudentsDirectoryPage: React.FC<StudentsDirectoryPageProps> = ({
  students,
  myStudentKey,
  mySavedName,
  mySavedLevel,
  hasRegisteredMyStudent,
  isAdmin,
  language = 'ar',
  onBack,
  onSaveMyStudentProfile,
  onDeleteStudent,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const t = TRANSLATIONS[language];
  const editor = useSectionEditor(customization);
  const [searchQuery, setSearchQuery] = useState('');

  // Active tab state: 'active' (الطلاب الناشطين) or 'manage' (إضافة الطالب مرة واحدة / تعديل معلوماتي)
  const [activeTab, setActiveTab] = useState<'active' | 'manage'>('active');
  const [studentNameInput, setStudentNameInput] = useState(
    hasRegisteredMyStudent ? mySavedName : ''
  );
  const [levelInput, setLevelInput] = useState(mySavedLevel || '3 ثانوي (BAC)');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (hasRegisteredMyStudent && mySavedName) {
      setStudentNameInput(mySavedName);
    }
    if (mySavedLevel) {
      setLevelInput(mySavedLevel);
    }
  }, [hasRegisteredMyStudent, mySavedName, mySavedLevel]);

  const nowMs = Date.now();

  // Show ONLY active student accounts
  const activeStudents = useMemo(
    () => students.filter((s) => isStudentCurrentlyActive(s, nowMs)),
    [students, nowMs]
  );

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeStudents;
    return activeStudents.filter(
      (student) =>
        student.displayName.toLowerCase().includes(q) ||
        student.levelBadge.toLowerCase().includes(q)
    );
  }, [activeStudents, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!myStudentKey) {
      setStatusMessage({ type: 'err', text: 'يرجى تسجيل الدخول بحساب أولاً.' });
      return;
    }
    const rawName = studentNameInput.trim();
    if (rawName.length < 2) {
      setStatusMessage({ type: 'err', text: 'يرجى كتابة اسم الطالب (حرفان على الأقل).' });
      return;
    }
    setIsSaving(true);
    try {
      const wasAlreadyRegistered = hasRegisteredMyStudent;
      await onSaveMyStudentProfile(rawName, levelInput);
      setStatusMessage({
        type: 'ok',
        text: wasAlreadyRegistered
          ? `تم تحديث معلومات الطالب "${rawName}" بنجاح.`
          : `تم تسجيل الطالب "${rawName}" في قائمة الطلاب النشطين (مرة واحدة لحسابك).`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'تعذر حفظ معلومات الطالب، حاول مرة أخرى.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-16 max-w-3xl mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={t.backLabel}
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            <span>{editor.sectionHeader.title || 'الطلاب المسجلون'}</span>
          </h1>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {editor.sectionHeader.subtitle || t.studentsSubtitle}
          </span>
        </div>

        <div className="w-11" />
      </div>

      {/* Admin Customization Toolbar */}
      <div className="flex flex-col items-center">
        <SectionAdminToolbar
          isAdmin={editor.isAdmin}
          isEditMode={editor.isEditMode}
          hasOverrides={editor.hasOverrides}
          hideButtonEditToggle={editor.entries.length === 0}
          onToggleEditMode={() => editor.setIsEditMode((v) => !v)}
          onOpenAddEntry={(type) =>
            editor.setEntryModal({ isOpen: true, initialType: type, editingEntry: null })
          }
          onEditSectionHeader={() => editor.setIsHeaderModalOpen(true)}
          onResetSectionOverrides={() => customization?.onResetSectionOverrides()}
        />

        {editor.sectionHeader.note && (
          <div className="w-full max-w-md mb-2 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/35 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {editor.sectionHeader.note}
          </div>
        )}
      </div>

      {/* Active Students Count Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              {t.studentsTitle}
            </h2>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              يتم إضافة طالب واحد لكل شخص مع إمكانية تعديل معلوماته
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-center shrink-0">
          <span className="text-2xl font-black text-blue-700 dark:text-sky-300 font-mono block leading-none tabular-nums">
            {activeStudents.length}
          </span>
          <span className="text-[10px] font-extrabold text-blue-700 dark:text-sky-200 mt-1 block">
            {t.activeNowLabel}
          </span>
        </div>
      </div>

      {/* Active Students / Add Once or Edit Own Info Control Card */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            {activeTab === 'active' ? (
              <>
                <Users className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <span>الطلاب الناشطين ({activeStudents.length})</span>
              </>
            ) : hasRegisteredMyStudent ? (
              <>
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <span>تعديل معلوماتي</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <span>إضافة الطالب (مرة واحدة)</span>
              </>
            )}
          </h2>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('active');
                setStatusMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              الطلاب الناشطين
            </button>

            {myStudentKey && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('manage');
                  setStatusMessage(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {hasRegisteredMyStudent ? 'تعديل معلوماتي' : 'إضافة الطالب'}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'manage' && myStudentKey && (
          <>
            <p className="text-[11px] font-bold text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-3 py-2 rounded-2xl">
              {hasRegisteredMyStudent
                ? 'تم تسجيل اسمك مرة واحدة لحسابك، ويمكنك تغيير الاسم أو المستوى الدراسي من هنا في أي وقت.'
                : 'يمكن لكل شخص إضافة طالب واحد فقط لحسابه عند الدخول، مع إمكانية تعديل معلوماته لاحقاً.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  الاسم الكامل للطالب:
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="مثال: محمد أمين بن عبد الله"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  المستوى الدراسي:
                </label>
                <select
                  value={levelInput}
                  onChange={(e) => setLevelInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                {hasRegisteredMyStudent ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{isSaving ? 'جاري التسجيل...' : 'تسجيل الطالب'}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {statusMessage && (
          <div
            className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === 'ok'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}
      </form>

      {/* Search Active Students */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Active Students List Only */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              لا توجد حسابات نشطة مطابقة للبحث حالياً.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isMe = myStudentKey === student.studentKey;
            const initial = student.displayName.trim().charAt(0).toUpperCase() || 'ط';

            return (
              <div
                key={student.studentKey}
                className={`p-3.5 sm:p-4 rounded-3xl border shadow-xs flex items-center justify-between gap-3 transition-colors ${
                  isMe
                    ? 'bg-blue-50/80 dark:bg-blue-950/35 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl font-black text-base flex items-center justify-center text-white shadow-xs bg-gradient-to-br from-emerald-500 to-teal-600">
                      {initial}
                    </div>
                    <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                        {student.displayName}
                      </h3>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black">
                          أنت
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {student.levelBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>نشط حالياً داخل التطبيق</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>نشط</span>
                  </span>

                  {isMe && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('manage');
                        setStatusMessage(null);
                      }}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-sky-300 cursor-pointer transition-colors"
                      title="تعديل معلوماتي"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(student.studentKey)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                      title="حذف الطالب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Custom Websites, Texts & Images Added to Students Section */}
      {editor.entries.length > 0 && (
        <div className="flex flex-col items-center">
          <SectionCustomEntriesList
            entries={editor.entries}
            isAdmin={editor.isAdmin}
            isEditMode={editor.isEditMode}
            onOpenSite={(url) => onOpenSite?.(url)}
            onShowInfo={onShowInfo}
            onEditEntry={(entry) =>
              editor.setEntryModal({ isOpen: true, initialType: entry.type, editingEntry: entry })
            }
            onDeleteEntry={(id) => customization?.onDeleteCustomEntry(id)}
            onMoveEntry={(id, dir) => customization?.onMoveCustomEntry(id, dir)}
          />
        </div>
      )}

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
        defaultTitle="الطلاب المسجلون"
        defaultSubtitle={t.studentsSubtitle}
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
