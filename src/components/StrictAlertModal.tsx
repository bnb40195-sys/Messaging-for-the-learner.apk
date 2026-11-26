import React from 'react';
import { ShieldAlert, ExternalLink, CheckCircle2, Calendar } from 'lucide-react';
import type { LiveAnnouncement } from '../lib/firebase';

interface StrictAlertModalProps {
  announcement: LiveAnnouncement | null;
  onAcknowledge: (id: string) => void;
  onOpenSite: (url: string) => void;
}

export const StrictAlertModal: React.FC<StrictAlertModalProps> = ({
  announcement,
  onAcknowledge,
  onOpenSite,
}) => {
  if (!announcement) return null;

  const formatDate = (ts: LiveAnnouncement['createdAt']) => {
    if (!ts) return 'الآن';
    try {
      return ts.toDate().toLocaleDateString('ar-DZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'عاجل';
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-500 shadow-2xl shadow-red-950/50 overflow-hidden">
        {/* Top Critical Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 px-5 py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-100 block">
                تنبيه إلزامي من إدارة التطبيق
              </span>
              <h3 className="text-sm sm:text-base font-black leading-tight">
                إشعار صارم وعاجل
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-black shrink-0">
            {announcement.tag}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span>{formatDate(announcement.createdAt)}</span>
          </div>

          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
            {announcement.title}
          </h4>

          <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/35 border border-red-200 dark:border-red-900/60">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-semibold">
              {announcement.body}
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {announcement.targetUrl && (
              <button
                onClick={() => onOpenSite(announcement.targetUrl!)}
                className="w-full py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>فتح الرابط الرسمي المرفق</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onAcknowledge(announcement.id)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تم الاطلاع على التنبيه الصارم</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
