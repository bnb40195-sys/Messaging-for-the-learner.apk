import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  HelpCircle,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import {
  AppSubjectTopic,
  getTopicsForSelection,
  TOPIC_LEVEL_DEFINITIONS,
  TopicLevelId,
} from '../data/appTopicsBank';
import { AppLanguage, TRANSLATIONS } from '../lib/i18n';

interface AppTopicsPageProps {
  language?: AppLanguage;
  onBack: () => void;
}

type TopicsStep = 'cycle' | 'level' | 'stream' | 'subjects' | 'topic';

export const AppTopicsPage: React.FC<AppTopicsPageProps> = ({ language = 'ar', onBack }) => {
  const t = TRANSLATIONS[language];

  const [step, setStep] = useState<TopicsStep>('cycle');
  const [selectedCycle, setSelectedCycle] = useState<'middle' | 'secondary'>('secondary');
  const [selectedLevelId, setSelectedLevelId] = useState<TopicLevelId>('2as');
  const [selectedStreamId, setSelectedStreamId] = useState<string>('sci');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState<AppSubjectTopic | null>(null);
  const [topicTab, setTopicTab] = useState<'exercises' | 'quiz'>('exercises');

  // Revealed solutions state (exercise index -> boolean)
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  // Interactive quiz answers (question id -> selected option index)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const currentLevelDef = useMemo(
    () => TOPIC_LEVEL_DEFINITIONS.find((l) => l.id === selectedLevelId) || TOPIC_LEVEL_DEFINITIONS[0],
    [selectedLevelId]
  );

  const currentStreamDef = useMemo(
    () =>
      currentLevelDef.streams.find((s) => s.id === selectedStreamId) || currentLevelDef.streams[0],
    [currentLevelDef, selectedStreamId]
  );

  const levelsInCycle = useMemo(
    () => TOPIC_LEVEL_DEFINITIONS.filter((l) => l.stage === selectedCycle),
    [selectedCycle]
  );

  const subjectTopics = useMemo(() => {
    const base = getTopicsForSelection(selectedLevelId, selectedStreamId);
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.buttonLabel.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q) ||
        item.focusSummary.toLowerCase().includes(q)
    );
  }, [selectedLevelId, selectedStreamId, subjectSearch]);

  const handleBackNavigation = () => {
    if (step === 'topic') {
      setActiveTopic(null);
      setStep('subjects');
      return;
    }
    if (step === 'subjects') {
      setSubjectSearch('');
      setStep(currentLevelDef.stage === 'middle' ? 'level' : 'stream');
      return;
    }
    if (step === 'stream') {
      setStep('level');
      return;
    }
    if (step === 'level') {
      setStep('cycle');
      return;
    }
    onBack();
  };

  const openTopicDetail = (topic: AppSubjectTopic, initialTab: 'exercises' | 'quiz' = 'quiz') => {
    setActiveTopic(topic);
    setTopicTab(initialTab);
    setRevealedSolutions({});
    setSelectedAnswers({});
    setStep('topic');
  };

  const toggleExerciseSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (questionId in selectedAnswers) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
  };

  const quizStats = useMemo(() => {
    if (!activeTopic) return { answered: 0, correct: 0, total: 0, scoreOutOf20: '0.0' };
    const total = activeTopic.quizQuestions.length;
    let answered = 0;
    let correct = 0;
    for (const q of activeTopic.quizQuestions) {
      if (q.id in selectedAnswers) {
        answered += 1;
        if (selectedAnswers[q.id] === q.correctIndex) {
          correct += 1;
        }
      }
    }
    const scoreOutOf20 = total > 0 ? ((correct / total) * 20).toFixed(1) : '0.0';
    return { answered, correct, total, scoreOutOf20 };
  }, [activeTopic, selectedAnswers]);

  const headerTitle = useMemo(() => {
    if (step === 'cycle') return 'بنك المواضيع';
    if (step === 'level') {
      return selectedCycle === 'middle' ? 'المستوى المتوسط' : 'المستوى الثانوي';
    }
    if (step === 'stream') return currentLevelDef.fullLabel;
    if (step === 'subjects') {
      if (currentLevelDef.stage === 'middle') {
        return currentLevelDef.cardLabel;
      }
      return `${currentLevelDef.shortTitle} ${currentStreamDef?.label || ''}`.trim();
    }
    if (step === 'topic' && activeTopic) {
      return activeTopic.buttonLabel;
    }
    return t.appTopicsTitle;
  }, [step, selectedCycle, currentLevelDef, currentStreamDef, activeTopic, t.appTopicsTitle]);

  const capsuleButtonClasses =
    'group w-full min-h-[60px] rounded-full px-5 py-3 flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer border ' +
    'bg-gradient-to-l from-[#8979df]/70 via-[#c4baf2]/85 to-white/95 border-[#8f7fe3]/60 text-[#3e3184] ' +
    'shadow-[0_10px_24px_-10px_rgba(92,76,174,0.45)] hover:shadow-[0_12px_28px_-8px_rgba(92,76,174,0.65)] hover:-translate-y-0.5 ' +
    'dark:from-indigo-700/45 dark:via-indigo-950/80 dark:to-slate-900/95 dark:border-indigo-500/40 dark:text-indigo-100 dark:hover:border-indigo-400/70';

  const centeredCapsuleClasses =
    'group w-full min-h-[60px] rounded-full px-6 py-3 flex items-center justify-center transition-all duration-200 cursor-pointer border ' +
    'bg-gradient-to-l from-[#8979df]/70 via-[#c4baf2]/85 to-white/95 border-[#8f7fe3]/60 text-[#3e3184] ' +
    'shadow-[0_10px_24px_-10px_rgba(92,76,174,0.45)] hover:shadow-[0_12px_28px_-8px_rgba(92,76,174,0.65)] hover:-translate-y-0.5 ' +
    'dark:from-indigo-700/45 dark:via-indigo-950/80 dark:to-slate-900/95 dark:border-indigo-500/40 dark:text-indigo-100 dark:hover:border-indigo-400/70';

  const capsuleIconBadgeClasses =
    'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ' +
    'bg-white/85 text-[#5b49b8] shadow-xs dark:bg-indigo-900/80 dark:text-indigo-200';

  return (
    <div className="min-h-full pb-16 max-w-4xl mx-auto space-y-5">
      {/* Top Bar matching reference screenshots */}
      <div className="rounded-3xl px-4 py-3.5 sm:px-6 flex items-center justify-between gap-3 bg-gradient-to-r from-[#9e8ce2] via-[#b0a2eb] to-[#c6bcf2] dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 border border-indigo-300/60 dark:border-indigo-800/60 shadow-md text-white">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-white transition-colors cursor-pointer shrink-0"
          title={t.backLabel}
          aria-label={t.backLabel}
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="text-center min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-black tracking-tight text-white truncate">
            {headerTitle}
          </h1>
        </div>

        <div className="w-11 shrink-0" />
      </div>

      {/* Selection Screens matching screenshots */}
      {step !== 'topic' && (
        <div className="rounded-[2rem] p-5 sm:p-8 bg-gradient-to-b from-[#d8d0f7]/90 via-[#e8e3fb]/90 to-[#cfc5f4]/85 dark:from-slate-900/95 dark:via-indigo-950/35 dark:to-slate-900/95 border border-indigo-200/70 dark:border-indigo-900/50 shadow-sm space-y-5">
          {/* STEP 1: Cycle Selection (المتوسط / الثانوي) */}
          {step === 'cycle' && (
            <div className="space-y-3.5 max-w-lg mx-auto">
              <div className="space-y-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCycle('middle');
                    setStep('level');
                  }}
                  className={capsuleButtonClasses}
                >
                  <span className={capsuleIconBadgeClasses}>
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="flex-1 text-center text-base sm:text-lg font-black">
                    المستوى المتوسط
                  </span>
                  <span className="w-10 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCycle('secondary');
                    setStep('level');
                  }}
                  className={capsuleButtonClasses}
                >
                  <span className={capsuleIconBadgeClasses}>
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="flex-1 text-center text-base sm:text-lg font-black">
                    المستوى الثانوي
                  </span>
                  <span className="w-10 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Grade Selection inside Cycle */}
          {step === 'level' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
              {levelsInCycle.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setSelectedLevelId(lvl.id);
                    if (lvl.stage === 'middle') {
                      setSelectedStreamId('general');
                      setSubjectSearch('');
                      setStep('subjects');
                    } else {
                      setSelectedStreamId(lvl.streams[0]?.id || 'sci');
                      setStep('stream');
                    }
                  }}
                  className={capsuleButtonClasses}
                >
                  <span className={capsuleIconBadgeClasses}>
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="flex-1 text-center text-base sm:text-lg font-black">
                    {lvl.cardLabel}
                  </span>
                  <span className="w-10 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Stream Selection for Secondary */}
          {step === 'stream' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
              {currentLevelDef.streams.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSelectedStreamId(st.id);
                    setSubjectSearch('');
                    setStep('subjects');
                  }}
                  className={centeredCapsuleClasses}
                >
                  <span className="text-center text-base sm:text-lg font-black">{st.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: Subject Capsules for Selected Grade & Stream */}
          {step === 'subjects' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-[#5b49b8] dark:text-indigo-300 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  placeholder="ابحث باسم المادة (رياضيات، تاريخ، إنجليزية، إسبانية، فلسفة...)"
                  className="w-full min-h-[46px] pr-11 pl-4 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-indigo-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {subjectTopics.length === 0 ? (
                <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 text-center space-y-3 border border-indigo-200/70 dark:border-slate-800">
                  <HelpCircle className="w-7 h-7 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    لا توجد مادة مطابقة لبحثك
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubjectSearch('')}
                    className="min-h-[44px] px-4 py-2 rounded-full bg-[#5b49b8] text-white text-xs font-black cursor-pointer"
                  >
                    عرض كل المواد
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {subjectTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => openTopicDetail(topic, 'quiz')}
                      className={centeredCapsuleClasses}
                    >
                      <span className="text-center text-base font-black">{topic.buttonLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Topic Exercises & Real Interactive Quiz */}
      {step === 'topic' && activeTopic && (
        <div className="space-y-4">
          {/* Segmented Mode Tabs */}
          <div className="rounded-2xl p-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setTopicTab('quiz')}
              className={`min-h-[46px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                topicTab === 'quiz'
                  ? 'bg-[#5b49b8] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>أسئلة حقيقية تفاعلية</span>
            </button>

            <button
              type="button"
              onClick={() => setTopicTab('exercises')}
              className={`min-h-[46px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                topicTab === 'exercises'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>مواضيع وتمارين محلولة</span>
            </button>
          </div>

          {/* Focus Metadata Line (Unboxed typography per design discipline) */}
          <div className="px-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{activeTopic.focusSummary}</span>
            <span className="tabular-nums text-slate-500 dark:text-slate-400">
              {currentLevelDef.shortTitle}
              {currentStreamDef?.label ? ` · ${currentStreamDef.label}` : ''}
            </span>
          </div>

          {/* Interactive Real Questions View */}
          {topicTab === 'quiz' && (
            <div className="space-y-4">
              {/* Live Score Summary Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    اختبار الفهم السريع · {activeTopic.subjectName}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                    أجبت عن {quizStats.answered} من {quizStats.total} أسئلة · الإجابات الصحيحة:{' '}
                    {quizStats.correct}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      النقطة التقديرية
                    </span>
                    <span className="text-lg font-black text-[#5b49b8] dark:text-indigo-300 tabular-nums">
                      {quizStats.scoreOutOf20} / 20
                    </span>
                  </div>

                  {quizStats.answered > 0 && (
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة المحاولة</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Questions List */}
              {activeTopic.quizQuestions.map((question, qIdx) => {
                const chosenIdx = selectedAnswers[question.id];
                const isAnswered = chosenIdx !== undefined;
                const isCorrect = chosenIdx === question.correctIndex;

                return (
                  <div
                    key={question.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                        السؤال {qIdx + 1} من {activeTopic.quizQuestions.length}
                      </span>
                      <h2
                        dir="auto"
                        className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-relaxed"
                      >
                        {question.prompt}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {question.options.map((opt, oIdx) => {
                        const isThisSelected = chosenIdx === oIdx;
                        const isThisCorrect = oIdx === question.correctIndex;

                        let optionStyle =
                          'bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-950/70 dark:hover:bg-indigo-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            optionStyle =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                          } else if (isThisSelected) {
                            optionStyle =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                          } else {
                            optionStyle =
                              'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800/70 text-slate-400 dark:text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleAnswerSelect(question.id, oIdx)}
                            dir="auto"
                            className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-start text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-colors ${
                              isAnswered ? 'cursor-default' : 'cursor-pointer'
                            } ${optionStyle}`}
                          >
                            <span className="flex-1">{opt}</span>
                            {isAnswered && isThisCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && isThisSelected && !isThisCorrect && (
                              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                          isCorrect
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70 text-emerald-950 dark:text-emerald-200'
                            : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200'
                        }`}
                      >
                        <div className="font-black flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>إجابة صحيحة</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                              <span>إجابة خاطئة — الإجابة الصحيحة موضحة باللون الأخضر</span>
                            </>
                          )}
                        </div>
                        <p dir="auto" className="font-semibold">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Practice Written Topics & Solutions View */}
          {topicTab === 'exercises' && (
            <div className="space-y-4">
              {activeTopic.exercises.map((ex, idx) => {
                const isSolutionOpen = Boolean(revealedSolutions[idx]);
                return (
                  <article
                    key={idx}
                    className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {ex.title}
                      </h2>
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {ex.pointsLabel}
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {ex.tasks.map((task, tIdx) => (
                        <li
                          key={tIdx}
                          dir="auto"
                          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed"
                        >
                          {task}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => toggleExerciseSolution(idx)}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        {isSolutionOpen ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>إخفاء الحل التفصيلي</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>عرض الحل والشرح التطبيقي</span>
                          </>
                        )}
                      </button>

                      {isSolutionOpen && (
                        <div className="mt-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                          <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                            عناصر الحل والشرح:
                          </h3>
                          <ul className="space-y-1.5">
                            {ex.solutionSteps.map((st, sIdx) => (
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
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Back to Subjects Button */}
          <div className="flex justify-start pt-2">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="min-h-[46px] px-5 py-2.5 rounded-full bg-[#5b49b8] hover:bg-[#4b3aa6] text-white text-xs sm:text-sm font-black shadow-sm transition-colors cursor-pointer"
            >
              العودة إلى قائمة المواد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
