import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  CorrespondenceQuizItem,
  CorrespondenceTopicModel,
  ONEFD_CORRESPONDENCE_QUIZZES,
  ONEFD_CORRESPONDENCE_TOPICS,
} from '../data/onefdCorrespondenceBank';
import { LEVEL_EXAMS_CATALOG } from '../data/levelExamsCatalog';
import {
  getTopicsForSelection,
  TOPIC_LEVEL_DEFINITIONS,
  TopicLevelId,
} from '../data/appTopicsBank';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleCorrespondenceQuestions(
  questions: CorrespondenceQuizItem[]
): CorrespondenceQuizItem[] {
  return shuffleArray(questions).map((q) => {
    const tagged = q.options.map((text, idx) => ({
      text,
      isCorrect: idx === q.correctIndex,
    }));
    const mixed = shuffleArray(tagged);
    const newCorrectIndex = mixed.findIndex((o) => o.isCorrect);
    return {
      ...q,
      options: mixed.map((o) => o.text),
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    };
  });
}

export type CorrespondenceStep = 'select' | 'subjects' | 'topic';

export interface CorrespondenceComboOption {
  key: string;
  levelId: TopicLevelId | 'all-onefd';
  streamId: string;
  label: string;
}

interface CorrespondenceSubjectEntry {
  id: string;
  subjectKey: string;
  title: string;
  subtitle: string;
  questions: CorrespondenceQuizItem[];
  topics: CorrespondenceTopicModel[];
}

interface CorrespondenceBranchViewProps {
  step: CorrespondenceStep;
  selectedComboKey: string;
  onSelectComboKey: (key: string) => void;
  onChangeStep: (nextStep: CorrespondenceStep) => void;
  onChangeActiveSubjectTitle: (title: string) => void;
}

const PLATFORM_BADGES = [
  'الفرض الإلكتروني · e-devoir',
  'أرضية المعلام · Scolarium',
  'فروض المراقبة الذاتية',
  'امتحان إثبات المستوى ONEFD',
] as const;

export const CORRESPONDENCE_COMBO_OPTIONS: CorrespondenceComboOption[] = (() => {
  const list: CorrespondenceComboOption[] = [
    {
      key: 'onefd-system::general',
      levelId: 'all-onefd',
      streamId: 'general',
      label: 'نظام المراسلة وأرضيات الديوان (ONEFD)',
    },
  ];
  for (const lvl of TOPIC_LEVEL_DEFINITIONS) {
    if (lvl.stage === 'middle') {
      list.push({
        key: `${lvl.id}::general`,
        levelId: lvl.id,
        streamId: 'general',
        label: lvl.cardLabel,
      });
    } else {
      for (const st of lvl.streams) {
        list.push({
          key: `${lvl.id}::${st.id}`,
          levelId: lvl.id,
          streamId: st.id,
          label: `${lvl.cardLabel} · ${st.label}`,
        });
      }
    }
  }
  return list;
})();

function normalizeArabicSubjectMatch(a: string, b: string): boolean {
  const clean = (s: string) =>
    s
      .replace(/مادة\s+/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();
  const ca = clean(a);
  const cb = clean(b);
  return ca.includes(cb) || cb.includes(ca);
}

export const CorrespondenceBranchView: React.FC<CorrespondenceBranchViewProps> = ({
  step,
  selectedComboKey,
  onSelectComboKey,
  onChangeStep,
  onChangeActiveSubjectTitle,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectionHint, setSelectionHint] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');

  const [activeSubject, setActiveSubject] = useState<CorrespondenceSubjectEntry | null>(null);
  const [topicTab, setTopicTab] = useState<'quiz' | 'topics'>('quiz');

  // Step 3 Quiz State
  const [shuffledQuestions, setShuffledQuestions] = useState<CorrespondenceQuizItem[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answerRequiredWarning, setAnswerRequiredWarning] = useState(false);

  // Step 3 Topics Expandable Solutions
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const selectedCombo = useMemo(
    () => CORRESPONDENCE_COMBO_OPTIONS.find((c) => c.key === selectedComboKey) || null,
    [selectedComboKey]
  );

  // Build full in-app ONEFD topics catalog across sessions 25/26, 2025, 2024 + ONEFD correspondence bank
  const allCatalogTopics: CorrespondenceTopicModel[] = useMemo(() => {
    const catalogConverted: CorrespondenceTopicModel[] = LEVEL_EXAMS_CATALOG.filter((ex) =>
      ['25/26', '2025'].includes(ex.sessionId)
    ).map((ex) => ({
      id: ex.id,
      levelId: ex.levelId,
      levelLabel: ex.levelLabel,
      streamLabel: ex.streamLabel,
      subject: `${ex.subject} — ${ex.sessionTitle}`,
      platformSource: 'امتحان إثبات المستوى ONEFD',
      duration: ex.duration,
      pointsLabel: '20 نقطة',
      summary: ex.summary,
      tasks: ex.sections.flatMap((sec) => [sec.heading, ...sec.items]),
      solutionSteps: ex.solutionSections.flatMap((sec) => sec.items),
    }));
    return [...ONEFD_CORRESPONDENCE_TOPICS, ...catalogConverted];
  }, []);

  // Build subject entries for Step 2
  const subjectEntries: CorrespondenceSubjectEntry[] = useMemo(() => {
    if (!selectedCombo) return [];

    if (selectedCombo.levelId === 'all-onefd') {
      const systemQuestions = ONEFD_CORRESPONDENCE_QUIZZES.filter(
        (q) => q.levelId === 'all-onefd'
      );
      const systemEntries: CorrespondenceSubjectEntry[] = [
        {
          id: 'corr-sys-all',
          subjectKey: 'all-onefd',
          title: 'الفرض الإلكتروني وأرضيات الديوان (شامل)',
          subtitle: 'المراقبة المستمرة، المعلام، والامتحانات',
          questions: systemQuestions,
          topics: ONEFD_CORRESPONDENCE_TOPICS.slice(0, 4),
        },
        {
          id: 'corr-sys-edevoir',
          subjectKey: 'edevoir',
          title: 'نماذج الفرض الإلكتروني (e-devoir)',
          subtitle: 'أسئلة ومواضيع الفرض الإلكتروني داخل التطبيق',
          questions: ONEFD_CORRESPONDENCE_QUIZZES.filter(
            (q) => q.platformSource === 'الفرض الإلكتروني · e-devoir'
          ),
          topics: allCatalogTopics.filter(
            (t) => t.platformSource === 'الفرض الإلكتروني · e-devoir'
          ),
        },
        {
          id: 'corr-sys-scolarium',
          subjectKey: 'scolarium',
          title: 'مواضيع أرضية المعلام (Scolarium)',
          subtitle: 'دروس وتقييمات أرضية المعلام الرسمية',
          questions: ONEFD_CORRESPONDENCE_QUIZZES.filter(
            (q) => q.platformSource === 'أرضية المعلام · Scolarium'
          ),
          topics: allCatalogTopics.filter(
            (t) => t.platformSource === 'أرضية المعلام · Scolarium'
          ),
        },
        {
          id: 'corr-sys-self',
          subjectKey: 'self-eval',
          title: 'فروض المراقبة الذاتية الرسمية',
          subtitle: 'مواضيع المراقبة الذاتية والحلول النموذجية',
          questions: ONEFD_CORRESPONDENCE_QUIZZES.filter(
            (q) => q.platformSource === 'فروض المراقبة الذاتية'
          ),
          topics: allCatalogTopics.filter(
            (t) => t.platformSource === 'فروض المراقبة الذاتية'
          ),
        },
      ];
      return systemEntries;
    }

    const lvlId = selectedCombo.levelId;
    const baseSubjects = getTopicsForSelection(lvlId, selectedCombo.streamId);

    return baseSubjects.map((subj) => {
      const levelSpecificCorrQuestions = ONEFD_CORRESPONDENCE_QUIZZES.filter(
        (q) =>
          q.levelId === lvlId &&
          normalizeArabicSubjectMatch(q.subjectName, subj.subjectName)
      );

      const taggedBankQuestions: CorrespondenceQuizItem[] = subj.quizQuestions.map(
        (q, idx) => ({
          ...q,
          id: `corr-${subj.id}-${q.id}`,
          levelId: lvlId,
          levelLabel: selectedCombo.label,
          subjectName: subj.subjectName,
          platformSource: PLATFORM_BADGES[idx % PLATFORM_BADGES.length],
        })
      );

      const combinedQuestions = [
        ...levelSpecificCorrQuestions,
        ...taggedBankQuestions.filter(
          (tq) => !levelSpecificCorrQuestions.some((lq) => lq.prompt === tq.prompt)
        ),
      ];

      const matchingCatalogTopics = allCatalogTopics.filter(
        (t) =>
          t.levelId === lvlId &&
          normalizeArabicSubjectMatch(t.subject, subj.subjectName)
      );

      const exerciseTopics: CorrespondenceTopicModel[] = subj.exercises.map((ex, idx) => ({
        id: `corr-ex-${subj.id}-${idx}`,
        levelId: lvlId,
        levelLabel: selectedCombo.label,
        streamLabel: 'المراسلة ONEFD',
        subject: `${ex.title} — ${subj.subjectName}`,
        platformSource: PLATFORM_BADGES[(idx + 1) % PLATFORM_BADGES.length],
        duration: 'موضوع مراسلة محلول',
        pointsLabel: ex.pointsLabel,
        summary: subj.focusSummary,
        tasks: ex.tasks,
        solutionSteps: ex.solutionSteps,
      }));

      return {
        id: `corr-${subj.id}`,
        subjectKey: subj.subjectKey,
        title: `${subj.buttonLabel} (المراسلة)`,
        subtitle: subj.focusSummary,
        questions: combinedQuestions,
        topics: [...matchingCatalogTopics, ...exerciseTopics],
      };
    });
  }, [selectedCombo, allCatalogTopics]);

  const filteredSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return subjectEntries;
    return subjectEntries.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
    );
  }, [subjectEntries, subjectSearch]);

  const handleProceedToSubjects = () => {
    if (!selectedCombo) {
      setIsDropdownOpen(true);
      setSelectionHint(true);
      return;
    }
    setSelectionHint(false);
    setSubjectSearch('');
    onChangeStep('subjects');
  };

  const openSubject = (entry: CorrespondenceSubjectEntry) => {
    setActiveSubject(entry);
    onChangeActiveSubjectTitle(entry.title);
    setTopicTab('quiz');
    setShuffledQuestions(shuffleCorrespondenceQuestions(entry.questions));
    setQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setAnswerRequiredWarning(false);
    setOpenSolutions({});
    onChangeStep('topic');
  };

  const resetQuiz = () => {
    if (!activeSubject) return;
    setShuffledQuestions(shuffleCorrespondenceQuestions(activeSubject.questions));
    setQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setAnswerRequiredWarning(false);
  };

  const handleAnswerSelect = (qId: string, oIdx: number) => {
    if (qId in selectedAnswers) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: oIdx }));
    setAnswerRequiredWarning(false);
  };

  const quizStats = useMemo(() => {
    const total = shuffledQuestions.length;
    if (total === 0) return { answered: 0, correct: 0, total: 0, scoreOutOf20: '0.0' };
    let answered = 0;
    let correct = 0;
    for (const q of shuffledQuestions) {
      if (q.id in selectedAnswers) {
        answered += 1;
        if (selectedAnswers[q.id] === q.correctIndex) correct += 1;
      }
    }
    return {
      answered,
      correct,
      total,
      scoreOutOf20: ((correct / total) * 20).toFixed(1),
    };
  }, [shuffledQuestions, selectedAnswers]);

  const currentQuestion = shuffledQuestions[questionIndex] || null;
  const totalQuestions = shuffledQuestions.length;
  const progressPercent =
    totalQuestions > 0 ? Math.round(((questionIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* STEP 1: Exact Screenshot Layout (اختر المستوى والشعبة + اختيار المادة) */}
      {step === 'select' && (
        <div className="rounded-[2rem] p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="max-w-lg mx-auto space-y-4">
            {/* Dropdown Trigger Box */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="w-full min-h-[62px] px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-500/70 dark:border-blue-600/70 shadow-sm flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-blue-600"
              >
                <span className="w-6 shrink-0" />
                <span
                  className={`flex-1 text-center text-base sm:text-lg font-black ${
                    selectedCombo
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {selectedCombo ? selectedCombo.label : 'اختر المستوى والشعبة'}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform shrink-0 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-950 border-2 border-blue-500/70 dark:border-slate-700 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
                  {CORRESPONDENCE_COMBO_OPTIONS.map((combo) => {
                    const isPicked = combo.key === selectedComboKey;
                    return (
                      <button
                        key={combo.key}
                        type="button"
                        onClick={() => {
                          onSelectComboKey(combo.key);
                          setIsDropdownOpen(false);
                          setSelectionHint(false);
                        }}
                        className={`w-full min-h-[46px] px-4 py-2.5 text-center text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                          isPicked
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {combo.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectionHint && (
              <p className="text-center text-xs font-bold text-red-600 dark:text-red-400">
                يرجى اختيار المستوى والشعبة أولاً ثم الضغط على اختيار المادة
              </p>
            )}

            {/* Centered "اختيار المادة" button */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleProceedToSubjects}
                className="min-w-[220px] min-h-[54px] px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-black shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                اختيار المادة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ONEFD Correspondence Subjects Grid */}
      {step === 'subjects' && (
        <div className="rounded-[2rem] p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="ابحث باسم المادة في فرع المراسلة (رياضيات، علوم، تاريخ، المعلام...)"
              className="w-full min-h-[46px] pr-11 pl-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-7 h-7 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                لا توجد مادة مطابقة لبحثك
              </p>
              <button
                type="button"
                onClick={() => setSubjectSearch('')}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black cursor-pointer"
              >
                عرض كل المواد
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSubjects.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => openSubject(entry)}
                  className="w-full min-h-[60px] px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-900 dark:text-white text-sm sm:text-base font-black shadow-xs flex items-center justify-between gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="truncate text-start">{entry.title}</span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                    {entry.questions.length} سؤال
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: In-App ONEFD Correspondence Quiz & Solved Official Topics */}
      {step === 'topic' && activeSubject && (
        <div className="space-y-4">
          <div className="rounded-2xl p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setTopicTab('quiz')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                topicTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>أسئلة المراسلة ({totalQuestions})</span>
            </button>

            <button
              type="button"
              onClick={() => setTopicTab('topics')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                topicTab === 'topics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>مواضيع المراسلة ({activeSubject.topics.length})</span>
            </button>
          </div>

          {/* Interactive ONEFD Correspondence Quiz */}
          {topicTab === 'quiz' && (
            <div className="rounded-[2rem] p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {quizCompleted && quizStats.answered === quizStats.total && quizStats.total > 0 ? (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 text-center space-y-4 shadow-md">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      أنهيت جميع أسئلة المراسلة بنجاح
                    </h2>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                      الإجابات الصحيحة: {quizStats.correct} من {quizStats.total} · النتيجة التقديرية:{' '}
                      {quizStats.scoreOutOf20} / 20
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة المحاولة بأسئلة متجددة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChangeStep('subjects')}
                      className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black cursor-pointer"
                    >
                      اختيار مادة أخرى
                    </button>
                  </div>
                </div>
              ) : (
                currentQuestion &&
                (() => {
                  const chosenIdx = selectedAnswers[currentQuestion.id];
                  const isAnswered = chosenIdx !== undefined;
                  const isCorrect = chosenIdx === currentQuestion.correctIndex;

                  return (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black">
                            {currentQuestion.platformSource}
                          </span>
                          <button
                            type="button"
                            onClick={resetQuiz}
                            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                            <span>تغيير الأسئلة</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 tabular-nums">
                          <span>
                            السؤال {questionIndex + 1} من {totalQuestions}
                          </span>
                          <span>{progressPercent}%</span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 shadow-xs text-center">
                        <h2
                          dir="auto"
                          className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed"
                        >
                          {currentQuestion.prompt}
                        </h2>
                      </div>

                      <div className="space-y-3 pt-1">
                        {currentQuestion.options.map((opt, oIdx) => {
                          const isThisSelected = chosenIdx === oIdx;
                          const isThisCorrect = oIdx === currentQuestion.correctIndex;

                          let btnClasses =
                            'bg-white hover:bg-blue-50/70 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100';
                          if (isAnswered) {
                            if (isThisCorrect) {
                              btnClasses =
                                'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                            } else if (isThisSelected) {
                              btnClasses =
                                'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
                            } else {
                              btnClasses =
                                'bg-slate-50/60 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handleAnswerSelect(currentQuestion.id, oIdx)}
                              dir="auto"
                              className={`w-full min-h-[54px] px-5 py-3 rounded-2xl border-2 text-center text-sm sm:text-base font-black shadow-xs flex items-center justify-center gap-2.5 transition-all ${
                                isAnswered
                                  ? 'cursor-default'
                                  : 'cursor-pointer active:scale-[0.99]'
                              } ${btnClasses}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && isThisCorrect && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                              {isAnswered && isThisSelected && !isThisCorrect && (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div
                          className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                          }`}
                        >
                          <div className="font-black">
                            {isCorrect ? 'إجابة صحيحة' : 'توضيح الإجابة الصحيحة'}
                          </div>
                          <p dir="auto" className="font-semibold">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      )}

                      {answerRequiredWarning && !isAnswered && (
                        <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-black flex items-center justify-center gap-2 text-center">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>
                            {questionIndex + 1 < totalQuestions
                              ? 'لا يمكن الانتقال للسؤال التالي بدون اختيار إجابة أولاً.'
                              : 'لا يمكن عرض النتيجة بدون الإجابة عن هذا السؤال أولاً.'}
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAnswered) {
                              setAnswerRequiredWarning(true);
                              return;
                            }
                            setAnswerRequiredWarning(false);
                            if (questionIndex + 1 < totalQuestions) {
                              setQuestionIndex((i) => i + 1);
                            } else {
                              setQuizCompleted(true);
                            }
                          }}
                          className={`w-full min-h-[52px] rounded-2xl font-black text-base shadow-md transition-all ${
                            isAnswered
                              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {questionIndex + 1 < totalQuestions ? 'التالي' : 'عرض النتيجة'}
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* Solved Official ONEFD Correspondence Topics (100% Inside App, No External Redirects) */}
          {topicTab === 'topics' && (
            <div className="space-y-3.5">
              {activeSubject.topics.map((topic) => {
                const isOpen = Boolean(openSolutions[topic.id]);
                return (
                  <article
                    key={topic.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black">
                            {topic.platformSource}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                            {topic.levelLabel}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {topic.subject}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[11px] font-bold">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                          <span>{topic.duration}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 font-black">
                          {topic.pointsLabel}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {topic.tasks.map((task, idx) => (
                        <p
                          key={idx}
                          dir="auto"
                          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed"
                        >
                          {task}
                        </p>
                      ))}
                    </div>

                    {topic.solutionSteps.length > 0 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenSolutions((prev) => ({
                              ...prev,
                              [topic.id]: !prev[topic.id],
                            }))
                          }
                          className="min-h-[42px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          {isOpen ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span>إخفاء الحل النموذجي</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>عرض الإجابة النموذجية وسلّم التنقيط</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {isOpen && (
                          <div className="mt-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                            <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                              الإجابة النموذجية المعتمدة:
                            </h4>
                            <ul className="space-y-1.5">
                              {topic.solutionSteps.map((st, sIdx) => (
                                <li
                                  key={sIdx}
                                  dir="auto"
                                  className="text-xs font-semibold text-emerald-950 dark:text-emerald-100 leading-relaxed"
                                >
                                  {st}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
