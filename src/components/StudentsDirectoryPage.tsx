import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Edit3,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { RegisteredStudentItem } from '../lib/firebase';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface StudentsDirectoryPageProps {
  students: RegisteredStudentItem[];
  myStudentKey: string | null;
  mySavedName: string;
  mySavedLevel: string;
  isAdmin: boolean;
  language?: AppLanguage;
  onBack: () => void;
  onSaveMyStudentProfile: (name: string, levelBadge: string) => Promise<void>;
  onAddCustomStudent: (name: string, levelBadge: string) => Promise<void>;
  onDeleteStudent: (studentKey: string) => Promise<void>;
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
  isAdmin,
  language = 'ar',
  onBack,
  onSaveMyStudentProfile,
  onAddCustomStudent,
  onDeleteStudent,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding/updating a student name
  const [formMode, setFormMode] = useState<'add' | 'mine'>(myStudentKey ? 'mine' : 'add');
  const [studentNameInput, setStudentNameInput] = useState(mySavedName || '');
  const [newStudentNameInput, setNewStudentNameInput] = useState('');
  const [levelInput, setLevelInput] = useState(mySavedLevel || '3 ثانوي (BAC)');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

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
    const rawName = (formMode === 'mine' ? studentNameInput : newStudentNameInput).trim();
    if (rawName.length < 2) {
      setStatusMessage({ type: 'err', text: 'يرجى كتابة اسم الطالب (حرفان على الأقل).' });
      return;
    }
    setIsSaving(true);
    try {
      if (formMode === 'mine' && myStudentKey) {
        await onSaveMyStudentProfile(rawName, levelInput);
        setStatusMessage({ type: 'ok', text: 'تم حفظ اسمك في قائمة الطلاب النشطين.' });
      } else {
        await onAddCustomStudent(rawName, levelInput);
        setNewStudentNameInput('');
        setStatusMessage({ type: 'ok', text: `تمت إضافة الطالب "${rawName}" بنجاح.` });
      }
    } catch (err) {
      setStatusMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'تعذر حفظ اسم الطالب، حاول مرة أخرى.',
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
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          title={t.backLabel}
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.studentsTitle}</span>
          </h1>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {t.studentsSubtitle}
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* Active Students Count Card (Active accounts only) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/70 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <span>{t.studentsTitle}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] font-bold text-emerald-800/80 dark:text-emerald-300/80">
              {t.studentsSubtitle}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800 text-center shrink-0">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block leading-none">
            {activeStudents.length}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">
            {t.activeNowLabel}
          </span>
        </div>
      </div>

      {/* Add / Update Student Name Form (No manual active status toggle) */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-indigo-200/70 dark:border-indigo-900/60 shadow-sm space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t.addStudentNameTitle}</span>
          </h2>

          {myStudentKey && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFormMode('mine')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  formMode === 'mine'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                اسمي في التطبيق
              </button>
              <button
                type="button"
                onClick={() => setFormMode('add')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  formMode === 'add'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                إضافة طالب جديد
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              {formMode === 'mine' ? 'اسم الطالب الخاص بك:' : 'الاسم الكامل للطالب:'}
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={formMode === 'mine' ? studentNameInput : newStudentNameInput}
              onChange={(e) =>
                formMode === 'mine'
                  ? setStudentNameInput(e.target.value)
                  : setNewStudentNameInput(e.target.value)
              }
              placeholder="مثال: محمد أمين بن عبد الله"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              المستوى الدراسي:
            </label>
            <select
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
          >
            {formMode === 'mine' ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isSaving ? 'جاري الحفظ...' : t.saveMyNameBtn}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{isSaving ? 'جاري الإضافة...' : t.addStudentBtn}</span>
              </>
            )}
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === 'ok'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}
      </form>

      {/* Search Active Students */}
      <div className="p-3.5 rounded-3xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      {/* Active Students List Only */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 text-center space-y-2">
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
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800'
                    : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800'
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
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-black">
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
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>نشط</span>
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(student.studentKey)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 cursor-pointer transition-colors"
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
    </div>
  );
};
