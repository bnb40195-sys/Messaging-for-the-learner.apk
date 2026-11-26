import React, { useState } from 'react';
import {
  X, Check, Plus, Trash2,
} from 'lucide-react';
import { SAMPLE_EXAMS } from '../data/dirasaData';
import { sampleExamToPdfPayload } from '../data/levelExamsCatalog';
import { PdfDocumentPayload } from '../lib/pdfEngine';

interface EducationalModalProps {
  type: string | null;
  onClose: () => void;
  onOpenSite: (url: string) => void;
  onOpenPdf?: (payload: PdfDocumentPayload) => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({
  type,
  onClose,
  onOpenSite,
  onOpenPdf,
}) => {
  // Task / Notes State
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'تحميل دروس الفصل الأول في مادة اللغة العربية من المعلام', done: true },
    { id: '2', text: 'حل الفرض التجريبي في الرياضيات والفيزياء', done: false },
    { id: '3', text: 'مراجعة موعد إجراء الفرض الإلكتروني 2026/2027', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // GPA Calculator State for ONEFD
  const [examMark, setExamMark] = useState<number>(12);
  const [homeworkMark, setHomeworkMark] = useState<number>(14);
  const [scolariumMark, setScolariumMark] = useState<number>(15);

  const continuousAssessment = (homeworkMark + scolariumMark) / 2;
  const finalGPA = ((examMark * 2) + continuousAssessment) / 3;

  if (!type) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), done: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {type === 'bank' && 'بنك المواضيع والفروض النموذجية'}
            {type === 'official-exams' && 'الامتحانات الرسمية السابقة'}
            {type === 'mock-exam' && 'حاسبة معدل الانتقال وإثبات المستوى 2026/2027'}
            {type === 'notes-tasks' && 'مفكرة المهام والملاحظات الدراسية'}
            {type === 'acceptance' && 'تأكيد قبول المستوى الأعلى والانتقال'}
            {type === 'schedule' && 'برنامج المراجعة الأسبوعي المقترح'}
            {type === 'guidance' && 'دليل التوجيه واختيار الشعب الثانوية'}
            {type === 'about' && 'عن الديوان الوطني للتعليم والتكوين عن بعد (ONEFD)'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* 1. Subject Bank */}
          {type === 'bank' && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-300">
                مجموعة مختارة من بنك مواضيع الديوان الوطني لجميع الأطوار المتوسط والثانوي مع الحلول:
              </p>
              {SAMPLE_EXAMS.map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.subject}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.level} · {item.topic}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPdf?.(sampleExamToPdfPayload(item))}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 cursor-pointer shrink-0"
                  >
                    فتح PDF
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 2. Official Exams */}
          {type === 'official-exams' && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-300">
                مواضيع امتحانات شهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC) ودورات إثبات المستوى الرسمية السابقة:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-blue-700 dark:text-sky-300 mb-1">شهادة التعليم المتوسط (BEM)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">مواضيع كافة دورات 2020-2026 مع سلم التنقيط الوزاري</p>
                  <button
                    type="button"
                    onClick={() => onOpenSite('https://scolarium-moyen.onefd.edu.dz/')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                  >
                    تصفح في المعلام
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-blue-700 dark:text-sky-300 mb-1">شهادة البكالوريا (BAC)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">حوليات البكالوريا لجميع الشعب العلمية والأدبية</p>
                  <button
                    type="button"
                    onClick={() => onOpenSite('https://scolarium-sec.onefd.edu.dz/')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                  >
                    تصفح في المعلام
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. GPA & Pass Score Calculator */}
          {type === 'mock-exam' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800">
                <span className="font-bold text-blue-700 dark:text-sky-300 block mb-1">طريقة حساب المعدل في المراسلة (ONEFD):</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  المعدل العام = ((نقطة امتحان إثبات المستوى × 2) + معدل المراقبة المستمرة) ÷ 3.
                  <br />
                  معدل المراقبة المستمرة = (نقطة الفرض الإلكتروني + نقطة المعلام) ÷ 2.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-900 dark:text-white">نقطة امتحان إثبات المستوى المتوقعة (/20):</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    value={examMark}
                    onChange={(e) => setExamMark(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-900 dark:text-white">نقطة الفرض الإلكتروني (/20):</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={homeworkMark}
                      onChange={(e) => setHomeworkMark(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-900 dark:text-white">نقطة أرضية المعلام (/20):</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={scolariumMark}
                      onChange={(e) => setScolariumMark(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-center shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-white/85 block">المعدل العام التقديري للنجاح:</span>
                <span className="text-3xl font-extrabold my-1 block">{finalGPA.toFixed(2)} / 20</span>
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                  finalGPA >= 10 ? 'bg-emerald-500/35 text-emerald-50' : 'bg-red-500/35 text-red-50'
                }`}>
                  {finalGPA >= 10 ? 'مؤهل للنجاح والانتقال للمستوى الأعلى' : 'دون عتبة النجاح (المعدل المطلوب 10.00)'}
                </span>
              </div>
            </div>
          )}

          {/* 4. Notes & Tasks */}
          {type === 'notes-tasks' && (
            <div className="space-y-4">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="أضف مهمة دراسية جديدة (مثال: تلخيص درس الفيزياء)..."
                  className="flex-1 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </form>

              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-blue-50/70 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {task.done && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs ${task.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-200'}`}>
                        {task.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Acceptance confirmation */}
          {type === 'acceptance' && (
            <div className="space-y-3 leading-relaxed">
              <p>
                الطلبة الناجحون في امتحان إثبات المستوى ينتقلون تلقائيًا إلى المستوى الأعلى في الموسم القادم 2026/2027 عبر اتباع الخطوات التالية:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <li>استخراج كشف النقاط الرسمي الذي يحمل ملاحظة «ينتقل».</li>
                <li>الدخول لموقع inscriptic لاختيار «تسجيل متعلم سابق».</li>
                <li>تأكيد الشعبة أو المستوى الدراسي الجديد وإعادة إيداع وصل الدفع.</li>
              </ol>
            </div>
          )}

          {/* 6. Revision Schedule */}
          {type === 'schedule' && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-300">
                جدول مقترح لتنظيم أوقات المذاكرة والتحضير للامتحانات (ساعتان يوميًا):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { day: 'السبت والأحد', subject: 'المواد الأساسية (رياضيات / فيزياء / علوم)' },
                  { day: 'الإثنين', subject: 'اللغة العربية وآدابها + الفلسفة' },
                  { day: 'الثلاثاء والأربعاء', subject: 'اللغات الأجنبية (فرنسية وإنجليزية)' },
                  { day: 'الخميس والجمعة', subject: 'التربية الإسلامية، التاريخ والجغرافيا، وحل الفروض' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-blue-700 dark:text-sky-300 block text-[11px] mb-1">{s.day}</span>
                    <span className="text-xs text-slate-900 dark:text-slate-200">{s.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Guidance */}
          {type === 'guidance' && (
            <div className="space-y-3 leading-relaxed">
              <p>
                شعب التعليم الثانوي المعتمدة في الديوان الوطني للتعليم والتكوين عن بعد:
              </p>
              <ul className="list-disc list-inside space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <li><strong>شعبة العلوم التجريبية:</strong> معامل العلوم 6، الفيزياء 5، الرياضيات 5.</li>
                <li><strong>شعبة الآداب والفلسفة:</strong> معامل الفلسفة 6، اللغة العربية 6.</li>
                <li><strong>شعبة اللغات الأجنبية:</strong> الفرنسية، الإنجليزية، مع الإسبانية أو الألمانية.</li>
                <li><strong>شعبة التسيير والاقتصاد:</strong> المحاسبة، الاقتصاد، القانون.</li>
              </ul>
            </div>
          )}

          {/* 8. About ONEFD */}
          {type === 'about' && (
            <div className="space-y-3 leading-relaxed">
              <p>
                الديوان الوطني للتعليم والتكوين عن بعد (ONEFD) مؤسسة عمومية ذات طابع إداري تحت وصاية وزارة التربية الوطنية الجزائرية، يتيح التعليم للجميع عبر نظام المراسلة والمنصات الرقمية المعلام.
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-700 dark:text-sky-300 block mb-1">الموقع الرسمي للديوان:</span>
                <span className="font-mono text-xs" dir="ltr">https://www.onefd.edu.dz</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
