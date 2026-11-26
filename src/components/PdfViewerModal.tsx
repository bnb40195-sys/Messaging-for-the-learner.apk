import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  downloadPdfDocument,
  PdfDocumentPayload,
  renderPdfAssets,
} from '../lib/pdfEngine';

interface PdfViewerModalProps {
  documentPayload: PdfDocumentPayload | null;
  externalPdfFile?: { name: string; url: string } | null;
  onClose: () => void;
  onDownloaded?: (docId: string, filename: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  documentPayload,
  externalPdfFile,
  onClose,
  onDownloaded,
}) => {
  const [includeSolutions, setIncludeSolutions] = useState(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    setIncludeSolutions(true);
    setZoomPercent(100);
    setDownloadNotice(null);
  }, [documentPayload?.id, externalPdfFile?.url]);

  useEffect(() => {
    if (!documentPayload) {
      setPageImages([]);
      return;
    }

    let cancelled = false;
    setIsRendering(true);

    renderPdfAssets(documentPayload, includeSolutions)
      .then((res) => {
        if (!cancelled) {
          setPageImages(res.pageDataUrls);
        }
      })
      .catch(() => {
        if (!cancelled) setPageImages([]);
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentPayload, includeSolutions]);

  if (!documentPayload && !externalPdfFile) return null;

  const handleDownload = async () => {
    if (externalPdfFile) {
      const a = document.createElement('a');
      a.href = externalPdfFile.url;
      a.download = externalPdfFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (!documentPayload) return;
    setIsDownloading(true);
    setDownloadNotice(null);
    try {
      const savedName = await downloadPdfDocument(documentPayload, includeSolutions);
      onDownloaded?.(documentPayload.id, savedName);
      setDownloadNotice(`تم تنزيل ملف PDF: ${savedName}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[92vh] rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top PDF Reader Toolbar */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-sky-600 dark:from-slate-800 dark:to-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black truncate">
                {externalPdfFile ? externalPdfFile.name : documentPayload?.title}
              </h3>
              <p className="text-[11px] text-white/85 truncate">
                {externalPdfFile
                  ? 'عارض ملفات PDF داخل التطبيق'
                  : `${documentPayload?.sessionLabel} · ${documentPayload?.subtitle}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {documentPayload?.solutionSections && documentPayload.solutionSections.length > 0 && (
              <button
                type="button"
                onClick={() => setIncludeSolutions((v) => !v)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {includeSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{includeSolutions ? 'إخفاء التصحيح' : 'إظهار التصحيح'}</span>
              </button>
            )}

            {!externalPdfFile && (
              <div className="hidden sm:flex items-center gap-1 bg-white/15 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setZoomPercent((z) => Math.max(70, z - 15))}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-black px-1.5 tabular-nums">{zoomPercent}%</span>
                <button
                  type="button"
                  onClick={() => setZoomPercent((z) => Math.min(150, z + 15))}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="hidden md:flex min-h-[40px] px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold items-center gap-1.5 transition-colors cursor-pointer"
              title="طباعة"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>

            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownload}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'جاري التحضير...' : 'تنزيل PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {downloadNotice && (
          <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* PDF Pages Body */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950">
          {externalPdfFile ? (
            <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden bg-white border border-slate-200 dark:border-slate-800">
              <iframe
                src={externalPdfFile.url}
                title={externalPdfFile.name}
                className="w-full h-full min-h-[65vh]"
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-5">
              {isRendering && pageImages.length === 0 ? (
                /* Immediate A4 structured sheet preview while PDF pages render */
                documentPayload && (
                  <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                      <p className="text-xs font-bold text-blue-900">
                        {documentPayload.institution}
                      </p>
                      <p className="text-sm font-black text-blue-700">
                        {documentPayload.sessionLabel}
                      </p>
                      <h2 className="text-lg font-black text-slate-900">
                        {documentPayload.title}
                      </h2>
                      <p className="text-xs font-bold text-blue-800">
                        {documentPayload.subtitle} · {documentPayload.metaLine}
                      </p>
                    </div>

                    {documentPayload.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-black text-blue-900">
                          {sec.heading}
                        </h3>
                        <ul className="space-y-1.5 px-2 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                          {sec.items.map((it, iIdx) => (
                            <li key={iIdx} dir="auto">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {includeSolutions &&
                      documentPayload.solutionSections?.map((sec, idx) => (
                        <div key={`sol-${idx}`} className="space-y-2">
                          <h3 className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-sm font-black text-emerald-900">
                            {sec.heading}
                          </h3>
                          <ul className="space-y-1.5 px-2 text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                            {sec.items.map((it, iIdx) => (
                              <li key={iIdx} dir="auto">
                                {it}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )
              ) : (
                pageImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="mx-auto transition-transform duration-150"
                    style={{ width: `${zoomPercent}%`, maxWidth: '100%' }}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white">
                      <img
                        src={src}
                        alt={`صفحة ${idx + 1}`}
                        className="w-full h-auto block"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
