import React from 'react';
import {
  ChevronLeft, BookOpen, CheckCircle2, CreditCard,
  HelpCircle, ArrowUpRight
} from 'lucide-react';
import { DocumentsIllustration } from './Illustrations';
import { DOCUMENT_ACTIONS, DocumentAction } from '../data/dirasaData';

interface DocumentsPageProps {
  onBack: () => void;
  onOpenSite: (url: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onBack, onOpenSite }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'check': return <CheckCircle2 className="w-5 h-5" />;
      case 'id': return <CreditCard className="w-5 h-5" />;
      case 'help': return <HelpCircle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleDirectOpen = (action: DocumentAction) => {
    if (action.externalUrl) {
      onOpenSite(action.externalUrl);
    }
  };

  return (
    <div className="min-h-full pb-16 flex flex-col items-center">
      {/* Top App Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>سحب الوثائق</span>
          <span className="text-lg">📑</span>
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Main Vector Illustration */}
      <div className="my-2 transform hover:scale-105 transition-transform duration-300">
        <DocumentsIllustration className="w-72 h-48 sm:w-80 sm:h-56" />
      </div>

      {/* Direct Official Links Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3 mt-4">
        {DOCUMENT_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleDirectOpen(action)}
            className="w-full min-h-[60px] px-5 py-3 rounded-full bg-gradient-to-r from-[#dcd7fe] via-[#c6bffe] to-[#a499fe] hover:from-[#cfc7fe] hover:to-[#9385fd] text-[#312579] font-bold text-base shadow-md shadow-indigo-500/10 flex items-center justify-between transition-all transform active:scale-[0.98] border border-white/60 dark:border-indigo-400/30 cursor-pointer"
            title={action.description}
          >
            <div className="w-8 h-8 rounded-full bg-white/60 text-[#4f3acb] flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-base tracking-wide text-center px-2">{action.title}</span>
            <div className="w-10 h-10 rounded-full bg-[#7564eb] text-white flex items-center justify-center shadow-sm shrink-0">
              {getIcon(action.iconName)}
            </div>
          </button>
        ))}
      </div>

      {/* Footer Notice */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-slate-400">
          بالضغط على أي خدمة يتم فتح الموقع الرسمي للديوان الوطني مباشرة في المتصفح
        </p>
      </div>
    </div>
  );
};
