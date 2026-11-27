import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  HelpCircle,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  AppSubjectTopic,
  getTopicsForSelection,
  PracticeExercise,
  RealQuizQuestion,
  TOPIC_LEVEL_DEFINITIONS,
  TopicLevelId,
} from '../data/appTopicsBank';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';
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

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuizQuestions(questions: RealQuizQuestion[]): RealQuizQuestion[] {
  return shuffleArray(questions).map((q) => {
    const taggedOptions = q.options.map((text, idx) => ({
      text,
      isCorrect: idx === q.correctIndex,
    }));
    const mixedOptions = shuffleArray(taggedOptions);
    const newCorrectIndex = mixedOptions.findIndex((o) => o.isCorrect);
    return {
      ...q,
      options: mixedOptions.map((o) => o.text),
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    };
  });
}

function pickQuestionBatch(
  pool: RealQuizQuestion[],
  excludeIds: string[] = [],
  batchSize = 20
): RealQuizQuestion[] {
  if (pool.length === 0) return [];
  const target = Math.min(batchSize, pool.length);
  const excludeSet = new Set(excludeIds);
  const unseen = shuffleArray(pool.filter((q) => !excludeSet.has(q.id)));
  const seen = shuffleArray(pool.filter((q) => excludeSet.has(q.id)));
  const selected = [...unseen, ...seen].slice(0, target);
  return shuffleQuizQuestions(selected);
}

function getScoreBadge(scoreNum: number): { label: string; classes: string } {
  if (scoreNum >= 16) {
    return {
      label: 'ممتاز',
      classes: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    };
  }
  if (scoreNum >= 13) {
    return {
      label: 'جيد جداً',
      classes: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-sky-200 border-blue-300 dark:border-blue-700',
    };
  }
  if (scoreNum >= 10) {
    return {
      label: 'مقبول / متوسط',
      classes: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    };
  }
  return {
    label: 'يحتاج إلى مراجعة',
    classes: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
  };
}

interface AppTopicsPageProps {
  language?: AppLanguage;
  onBack: () => void;
  onOpenSite?: (url: string) => void;
  onShowInfo?: (title: string, body: string) => void;
  customization?: SectionCustomizationContext;
}

type TopicsStep = 'select' | 'subjects' | 'topic';

interface ComboOption {
  key: string;
  levelId: TopicLevelId;
  streamId: string;
  label: string;
}

export const AppTopicsPage: React.FC<AppTopicsPageProps> = ({
  language = 'ar',
  onBack,
  onOpenSite,
  onShowInfo,
  customization,
}) => {
  const t = TRANSLATIONS[language];
  const editor = useSectionEditor(customization);

  const allCombos: ComboOption[] = useMemo(() => {
    const list: ComboOption[] = [];
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
  }, []);

  const [step, setStep] = useState<TopicsStep>('select');
  const [selectedComboKey, setSelectedComboKey] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState<AppSubjectTopic | null>(null);
  const [topicTab, setTopicTab] = useState<'quiz' | 'exercises'>('quiz');
  const [selectionHint, setSelectionHint] = useState(false);

  // Interactive Quiz state (20 questions per batch, rotates unseen on "تغيير الأسئلة")
  const [shuffledQuestions, setShuffledQuestions] = useState<RealQuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answerRequiredWarning, setAnswerRequiredWarning] = useState(false);
  const [showQuizSolutionsReview, setShowQuizSolutionsReview] = useState(false);

  // Topics / المواضيع interactive solving state (20 questions per موضوع, reveals result & solution ONLY on completion)
  const [shuffledExercises, setShuffledExercises] = useState<PracticeExercise[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeTopicQuestions, setActiveTopicQuestions] = useState<RealQuizQuestion[]>([]);
  const [topicQuestionIndex, setTopicQuestionIndex] = useState(0);
  const [topicAnswers, setTopicAnswers] = useState<Record<string, number>>({});
  const [topicCompleted, setTopicCompleted] = useState(false);
  const [topicAnswerWarning, setTopicAnswerWarning] = useState(false);
  const [showTopicContext, setShowTopicContext] = useState(true);

  const selectedCombo = useMemo(
    () => allCombos.find((c) => c.key === selectedComboKey) || null,
    [allCombos, selectedComboKey]
  );

  const currentLevelId: TopicLevelId = selectedCombo?.levelId || '2as';
  const currentStreamId: string = selectedCombo?.streamId || 'sci';

  const currentLevelDef = useMemo(
    () => TOPIC_LEVEL_DEFINITIONS.find((l) => l.id === currentLevelId) || TOPIC_LEVEL_DEFINITIONS[0],
    [currentLevelId]
  );

  const currentStreamDef = useMemo(
    () =>
      currentLevelDef.streams.find((s) => s.id === currentStreamId) || currentLevelDef.streams[0],
    [currentLevelDef, currentStreamId]
  );

  const subjectTopics = useMemo(() => {
    const base = sortItemsByOrder(
      getTopicsForSelection(currentLevelId, currentStreamId),
      (tItem) => tItem.id,
      editor.buttonOrder
    );
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.buttonLabel.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q) ||
        item.focusSummary.toLowerCase().includes(q)
    );
  }, [currentLevelId, currentStreamId, subjectSearch, editor.buttonOrder]);

  const handleProceedToSubjects = () => {
    if (!selectedCombo) {
      setIsDropdownOpen(true);
      setSelectionHint(true);
      return;
    }
    setSelectionHint(false);
    setSubjectSearch('');
    setStep('subjects');
  };

  const handleBackNavigation = () => {
    if (step === 'topic') {
      setActiveTopic(null);
      setStep('subjects');
      return;
    }
    if (step === 'subjects') {
      setSubjectSearch('');
      setStep('select');
      return;
    }
    onBack();
  };

  const prepareExerciseAttempt = (
    ex: PracticeExercise | undefined,
    topicPool: RealQuizQuestion[],
    excludeIds: string[] = []
  ) => {
    const baseSlice =
      ex?.topicQuestions && ex.topicQuestions.length > 0 && excludeIds.length === 0
        ? shuffleQuizQuestions(ex.topicQuestions)
        : pickQuestionBatch(topicPool, excludeIds, 20);
    setActiveTopicQuestions(baseSlice);
    setTopicQuestionIndex(0);
    setTopicAnswers({});
    setTopicCompleted(false);
    setTopicAnswerWarning(false);
  };

  const openTopicDetail = (topic: AppSubjectTopic, initialTab: 'quiz' | 'exercises' = 'quiz') => {
    setActiveTopic(topic);
    setTopicTab(initialTab);
    setShuffledQuestions(pickQuestionBatch(topic.quizQuestions, [], 20));
    setQuestionIndex(0);
    setQuizCompleted(false);
    setSelectedAnswers({});
    setAnswerRequiredWarning(false);
    setShowQuizSolutionsReview(false);

    const exercisesList = [...topic.exercises];
    setShuffledExercises(exercisesList);
    setActiveExerciseIndex(0);
    prepareExerciseAttempt(exercisesList[0], topic.quizQuestions, []);
    setShowTopicContext(true);
    setStep('topic');
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (questionId in selectedAnswers) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setAnswerRequiredWarning(false);
  };

  const resetQuizWithFreshQuestions = () => {
    if (!activeTopic) return;
    const currentBatchIds = shuffledQuestions.map((q) => q.id);
    setShuffledQuestions(pickQuestionBatch(activeTopic.quizQuestions, currentBatchIds, 20));
    setSelectedAnswers({});
    setQuestionIndex(0);
    setQuizCompleted(false);
    setAnswerRequiredWarning(false);
    setShowQuizSolutionsReview(false);
  };

  const handleSelectExerciseTopic = (idx: number) => {
    if (!activeTopic) return;
    setActiveExerciseIndex(idx);
    prepareExerciseAttempt(shuffledExercises[idx], activeTopic.quizQuestions, []);
  };

  const handleRotateExerciseTopic = () => {
    if (!activeTopic || shuffledExercises.length <= 1) return;
    const nextIdx = (activeExerciseIndex + 1) % shuffledExercises.length;
    setActiveExerciseIndex(nextIdx);
    prepareExerciseAttempt(shuffledExercises[nextIdx], activeTopic.quizQuestions, []);
  };

  const handleRefreshTopicQuestions = () => {
    if (!activeTopic) return;
    const currentBatchIds = activeTopicQuestions.map((q) => q.id);
    prepareExerciseAttempt(
      shuffledExercises[activeExerciseIndex],
      activeTopic.quizQuestions,
      currentBatchIds
    );
  };

  const handleTopicAnswerSelect = (questionId: string, optionIdx: number) => {
    if (topicCompleted) return;
    setTopicAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setTopicAnswerWarning(false);
  };

  const quizStats = useMemo(() => {
    if (shuffledQuestions.length === 0) {
      return { answered: 0, correct: 0, total: 0, scoreOutOf20: '0.0', scoreNum: 0 };
    }
    const total = shuffledQuestions.length;
    let answered = 0;
    let correct = 0;
    for (const q of shuffledQuestions) {
      if (q.id in selectedAnswers) {
        answered += 1;
        if (selectedAnswers[q.id] === q.correctIndex) {
          correct += 1;
        }
      }
    }
    const scoreNum = total > 0 ? (correct / total) * 20 : 0;
    return { answered, correct, total, scoreOutOf20: scoreNum.toFixed(1), scoreNum };
  }, [shuffledQuestions, selectedAnswers]);

  const topicStats = useMemo(() => {
    if (activeTopicQuestions.length === 0) {
      return { answered: 0, correct: 0, total: 0, scoreOutOf20: '0.0', scoreNum: 0 };
    }
    const total = activeTopicQuestions.length;
    let answered = 0;
    let correct = 0;
    for (const q of activeTopicQuestions) {
      if (q.id in topicAnswers) {
        answered += 1;
        if (topicAnswers[q.id] === q.correctIndex) {
          correct += 1;
        }
      }
    }
    const scoreNum = total > 0 ? (correct / total) * 20 : 0;
    return { answered, correct, total, scoreOutOf20: scoreNum.toFixed(1), scoreNum };
  }, [activeTopicQuestions, topicAnswers]);

  const headerTitle = useMemo(() => {
    if (step === 'select') return 'بنك المواضيع والأسئلة';
    if (step === 'subjects') {
      return selectedCombo?.label || 'اختر المادة';
    }
    if (step === 'topic' && activeTopic) {
      return activeTopic.subjectName;
    }
    return t.appTopicsTitle;
  }, [step, selectedCombo, activeTopic, t.appTopicsTitle]);

  const currentQuestion =
    shuffledQuestions[questionIndex] ? shuffledQuestions[questionIndex] : null;
  const totalQuestions = shuffledQuestions.length;
  const progressPercent =
    totalQuestions > 0 ? Math.round(((questionIndex + 1) / totalQuestions) * 100) : 0;

  const currentTopicQuestion =
    activeTopicQuestions[topicQuestionIndex] ? activeTopicQuestions[topicQuestionIndex] : null;
  const totalTopicQuestions = activeTopicQuestions.length;
  const topicProgressPercent =
    totalTopicQuestions > 0 ? Math.round(((topicQuestionIndex + 1) / totalTopicQuestions) * 100) : 0;

  return (
    <div className="min-h-full pb-16 max-w-3xl mx-auto space-y-5">
      {/* Unified Academic Header Bar */}
      <div className="rounded-3xl px-4 py-3.5 sm:px-6 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-sky-600 dark:from-slate-900 dark:to-slate-800 border border-blue-500/40 dark:border-slate-700 shadow-md text-white">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
          title={t.backLabel}
          aria-label={t.backLabel}
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-black tracking-tight text-white truncate">
            {step === 'select' ? editor.sectionHeader.title || headerTitle : headerTitle}
          </h1>
          {step === 'select' && editor.sectionHeader.subtitle && (
            <p className="text-[11px] text-sky-100 truncate mt-0.5">
              {editor.sectionHeader.subtitle}
            </p>
          )}
        </div>

        <div className="w-11 shrink-0" />
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

        {editor.sectionHeader.note && (
          <div className="w-full max-w-md mb-2 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/35 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {editor.sectionHeader.note}
          </div>
        )}
      </div>

      {/* STEP 1: Dropdown Level & Stream Selector + اختيار المادة CTA */}
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
                  {allCombos.map((combo) => {
                    const isPicked = combo.key === selectedComboKey;
                    return (
                      <button
                        key={combo.key}
                        type="button"
                        onClick={() => {
                          setSelectedComboKey(combo.key);
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

      {/* STEP 2: Subjects Grid */}
      {step === 'subjects' && (
        <div className="rounded-[2rem] p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="ابحث باسم المادة (رياضيات، علوم، تاريخ، إنجليزية، فلسفة...)"
              className="w-full min-h-[46px] pr-11 pl-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          {subjectTopics.length === 0 ? (
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
              {subjectTopics.map((topic) => {
                const ov = editor.overrides[topic.id];
                if (ov?.hidden && !(editor.isAdmin && editor.isEditMode)) {
                  return null;
                }
                const displayLabel = ov?.label || topic.buttonLabel;
                const displaySub =
                  ov?.subtitle || `${topic.quizQuestions.length} سؤال · ${topic.exercises.length} مواضيع`;
                const handleTopicClick = () => {
                  if (ov?.actionType === 'text') {
                    onShowInfo?.(ov.textTitle || displayLabel, ov.textBody || topic.focusSummary);
                  } else if (ov?.actionType === 'url' && ov.url) {
                    onOpenSite?.(ov.url);
                  } else {
                    openTopicDetail(topic, 'quiz');
                  }
                };
                return (
                  <div key={topic.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={handleTopicClick}
                      className={`w-full min-h-[58px] px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-900 dark:text-white text-sm sm:text-base font-black shadow-xs flex items-center justify-between gap-2 transition-all hover:-translate-y-0.5 cursor-pointer ${
                        ov?.hidden ? 'opacity-45' : ''
                      }`}
                    >
                      <span className="truncate">{displayLabel}</span>
                      <span className="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                        {displaySub}
                      </span>
                    </button>
                    {editor.isAdmin && editor.isEditMode && (
                      <div className="flex justify-end px-1">
                        <button
                          type="button"
                          onClick={() =>
                            editor.setEditingButton({
                              id: topic.id,
                              defaultLabel: topic.buttonLabel,
                              defaultSubtitle: `${topic.quizQuestions.length} سؤال · ${topic.exercises.length} مواضيع`,
                              defaultUrl: '',
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Interactive Quiz (20 questions) + Interactive Topics (20 questions per موضوع, result + solution at end) */}
      {step === 'topic' && activeTopic && (
        <div className="space-y-4">
          {/* Segmented Mode Tabs */}
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
              <span>الأسئلة التفاعلية ({totalQuestions})</span>
            </button>

            <button
              type="button"
              onClick={() => setTopicTab('exercises')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                topicTab === 'exercises'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>المواضيع والتمارين ({shuffledExercises.length})</span>
            </button>
          </div>

          {/* TAB 1: Interactive Quiz (20 questions batch + تغيير الأسئلة + full review on finish) */}
          {topicTab === 'quiz' && (
            <div className="rounded-[2rem] p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {quizCompleted && quizStats.answered === quizStats.total && quizStats.total > 0 ? (
                <div className="space-y-5">
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 text-center space-y-4 shadow-md">
                    <Trophy className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        أنهيت الأسئلة التفاعلية في {activeTopic.subjectName}
                      </h2>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums">
                        النتيجة: {quizStats.scoreOutOf20} / 20 ({quizStats.correct} من {quizStats.total} إجابة صحيحة)
                      </p>
                      <div className="pt-1">
                        <span
                          className={`inline-block px-3.5 py-1 rounded-xl border text-xs font-black ${getScoreBadge(quizStats.scoreNum).classes}`}
                        >
                          التقدير: {getScoreBadge(quizStats.scoreNum).label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowQuizSolutionsReview((v) => !v)}
                        className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{showQuizSolutionsReview ? 'إخفاء الحلول' : 'عرض الحلول ومراجعة الإجابات'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetQuizWithFreshQuestions}
                        className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>تغيير الأسئلة وإعادة المحاولة</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBackNavigation}
                        className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black cursor-pointer"
                      >
                        اختيار مادة أخرى
                      </button>
                    </div>
                  </div>

                  {showQuizSolutionsReview && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white px-1">
                        مراجعة الأسئلة والحلول ({shuffledQuestions.length} سؤال):
                      </h3>
                      {shuffledQuestions.map((q, idx) => {
                        const chosenIdx = selectedAnswers[q.id];
                        const isRight = chosenIdx === q.correctIndex;
                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border space-y-2 ${
                              isRight
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800'
                                : 'bg-red-50/70 dark:bg-red-950/25 border-red-300 dark:border-red-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p dir="auto" className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                {idx + 1}. {q.prompt}
                              </p>
                              {isRight ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              )}
                            </div>
                            <div className="text-xs space-y-1">
                              {!isRight && chosenIdx !== undefined && (
                                <p dir="auto" className="font-bold text-red-700 dark:text-red-300">
                                  إجابتك: {q.options[chosenIdx]}
                                </p>
                              )}
                              <p dir="auto" className="font-black text-emerald-700 dark:text-emerald-300">
                                الإجابة الصحيحة: {q.options[q.correctIndex]}
                              </p>
                              <p dir="auto" className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                currentQuestion && (() => {
                  const chosenIdx = selectedAnswers[currentQuestion.id];
                  const isAnswered = chosenIdx !== undefined;
                  const isCorrect = chosenIdx === currentQuestion.correctIndex;

                  return (
                    <div className="space-y-4">
                      {/* Centered Progress Label + Change Questions CTA */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums">
                            السؤال {questionIndex + 1} من {totalQuestions}
                          </span>
                          <button
                            type="button"
                            onClick={resetQuizWithFreshQuestions}
                            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                            <span>تغيير الأسئلة</span>
                          </button>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Prominent Question Box */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 shadow-xs text-center">
                        <h2
                          dir="auto"
                          className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed"
                        >
                          {currentQuestion.prompt}
                        </h2>
                      </div>

                      {/* 4 Option Buttons */}
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
                                isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
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

                      {/* Explanation Box once answered */}
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

                      {/* Bottom CTA */}
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
                              const allAnswered = shuffledQuestions.every(
                                (q) => q.id in selectedAnswers
                              );
                              if (!allAnswered) {
                                setAnswerRequiredWarning(true);
                                return;
                              }
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

          {/* TAB 2: Topics Solving Mode (20 questions per topic; NO spoilers until finished, then shows Score + Full Model Solution & Review) */}
          {topicTab === 'exercises' && shuffledExercises.length > 0 && (() => {
            const ex = shuffledExercises[activeExerciseIndex] || shuffledExercises[0];

            return (
              <div className="space-y-4">
                {/* Topic Switcher + Rotate Topic + Refresh Questions Bar */}
                <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {shuffledExercises.map((_, eIdx) => (
                      <button
                        key={eIdx}
                        type="button"
                        onClick={() => handleSelectExerciseTopic(eIdx)}
                        className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                          activeExerciseIndex === eIdx
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        الموضوع {eIdx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleRefreshTopicQuestions}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                      <span>تغيير الأسئلة</span>
                    </button>

                    {shuffledExercises.length > 1 && (
                      <button
                        type="button"
                        onClick={handleRotateExerciseTopic}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span>تغيير الموضوع</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Topic Header + Collapsible Context Tasks */}
                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {ex.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                        {ex.pointsLabel} · {totalTopicQuestions} سؤال
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowTopicContext((v) => !v)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>معطيات الموضوع</span>
                        {showTopicContext ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {showTopicContext && (
                    <ul className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      {ex.tasks.map((task, tIdx) => (
                        <li
                          key={tIdx}
                          dir="auto"
                          className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed"
                        >
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Main Topic Solving Card OR Result + Full Solution */}
                <div className="rounded-[2rem] p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  {topicCompleted ? (
                    <div className="space-y-6">
                      {/* Final Result Banner */}
                      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 text-center space-y-4 shadow-md">
                        <Trophy className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            أتممت حل {ex.title}
                          </h3>
                          <p className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums">
                            النتيجة النهائية: {topicStats.scoreOutOf20} / 20 ({topicStats.correct} من {topicStats.total})
                          </p>
                          <div className="pt-1">
                            <span
                              className={`inline-block px-3.5 py-1 rounded-xl border text-xs font-black ${getScoreBadge(topicStats.scoreNum).classes}`}
                            >
                              التقييم: {getScoreBadge(topicStats.scoreNum).label}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                          {shuffledExercises.length > 1 && (
                            <button
                              type="button"
                              onClick={handleRotateExerciseTopic}
                              className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>حل الموضوع التالي</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleRefreshTopicQuestions}
                            className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>إعادة حل الموضوع بأسئلة متجددة</span>
                          </button>
                        </div>
                      </div>

                      {/* Revealed Model Solution Steps for the Topic */}
                      <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-2.5">
                        <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>عناصر الحل النموذجي للموضوع:</span>
                        </h3>
                        <ul className="space-y-2">
                          {ex.solutionSteps.map((st, sIdx) => (
                            <li
                              key={sIdx}
                              dir="auto"
                              className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-relaxed"
                            >
                              {st}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Full Question-by-Question Solution & Correction */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white px-1">
                          التصحيح والحل الكامل لأسئلة الموضوع ({activeTopicQuestions.length} سؤال):
                        </h3>
                        {activeTopicQuestions.map((q, idx) => {
                          const chosenIdx = topicAnswers[q.id];
                          const isRight = chosenIdx === q.correctIndex;
                          return (
                            <div
                              key={q.id}
                              className={`p-4 rounded-2xl border space-y-2 ${
                                isRight
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-red-50/70 dark:bg-red-950/25 border-red-300 dark:border-red-800'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p dir="auto" className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                  {idx + 1}. {q.prompt}
                                </p>
                                {isRight ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                )}
                              </div>
                              <div className="text-xs space-y-1">
                                {!isRight && chosenIdx !== undefined && (
                                  <p dir="auto" className="font-bold text-red-700 dark:text-red-300">
                                    إجابتك: {q.options[chosenIdx]}
                                  </p>
                                )}
                                <p dir="auto" className="font-black text-emerald-700 dark:text-emerald-300">
                                  الحل الصحيح: {q.options[q.correctIndex]}
                                </p>
                                <p dir="auto" className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    currentTopicQuestion && (() => {
                      const chosenIdx = topicAnswers[currentTopicQuestion.id];
                      const hasChosen = chosenIdx !== undefined;

                      return (
                        <div className="space-y-4">
                          {/* Progress Bar (No spoilers while solving) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums">
                                السؤال {topicQuestionIndex + 1} من {totalTopicQuestions}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                تظهر النتيجة والحل بعد إنهاء كل الأسئلة
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${topicProgressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Question Prompt */}
                          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 shadow-xs text-center">
                            <h3
                              dir="auto"
                              className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed"
                            >
                              {currentTopicQuestion.prompt}
                            </h3>
                          </div>

                          {/* 4 Selectable Options (highlight student's selection only, NO right/wrong spoilers) */}
                          <div className="space-y-3 pt-1">
                            {currentTopicQuestion.options.map((opt, oIdx) => {
                              const isSelected = chosenIdx === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleTopicAnswerSelect(currentTopicQuestion.id, oIdx)}
                                  dir="auto"
                                  className={`w-full min-h-[54px] px-5 py-3 rounded-2xl border-2 text-center text-sm sm:text-base font-black shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.99] ${
                                    isSelected
                                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-sky-200 shadow-sm'
                                      : 'bg-white hover:bg-blue-50/60 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {topicAnswerWarning && !hasChosen && (
                            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-black flex items-center justify-center gap-2 text-center">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>
                                {topicQuestionIndex + 1 < totalTopicQuestions
                                  ? 'يرجى اختيار إجابة قبل الانتقال إلى السؤال التالي.'
                                  : 'يرجى اختيار إجابة قبل إنهاء الموضوع وعرض النتيجة والحل.'}
                              </span>
                            </div>
                          )}

                          {/* Navigation Buttons */}
                          <div className="flex items-center gap-2.5 pt-2">
                            {topicQuestionIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTopicAnswerWarning(false);
                                  setTopicQuestionIndex((i) => Math.max(0, i - 1));
                                }}
                                className="min-h-[52px] px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-black text-sm cursor-pointer shrink-0"
                              >
                                السابق
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (!hasChosen) {
                                  setTopicAnswerWarning(true);
                                  return;
                                }
                                setTopicAnswerWarning(false);
                                if (topicQuestionIndex + 1 < totalTopicQuestions) {
                                  setTopicQuestionIndex((i) => i + 1);
                                } else {
                                  const allAnswered = activeTopicQuestions.every(
                                    (q) => q.id in topicAnswers
                                  );
                                  if (!allAnswered) {
                                    setTopicAnswerWarning(true);
                                    return;
                                  }
                                  setTopicCompleted(true);
                                }
                              }}
                              className={`flex-1 min-h-[52px] rounded-2xl font-black text-sm sm:text-base shadow-md transition-all ${
                                hasChosen
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              {topicQuestionIndex + 1 < totalTopicQuestions
                                ? 'التالي'
                                : 'إنهاء الموضوع وعرض النتيجة والحل'}
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>

                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 text-center">
                  {currentLevelDef.shortTitle}
                  {currentStreamDef?.label ? ` · ${currentStreamDef.label}` : ''}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Custom Websites, Texts & Images Added to App Topics Section */}
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
        defaultTitle="بنك المواضيع والأسئلة"
        defaultSubtitle=""
        onSave={(next) => customization?.onSaveSectionHeader?.(next)}
        onReset={() => customization?.onResetSectionHeader?.()}
        onClose={() => editor.setIsHeaderModalOpen(false)}
      />
    </div>
  );
};
