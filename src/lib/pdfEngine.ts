export interface PdfTextSection {
  heading: string;
  items: string[];
  accent?: 'primary' | 'solution' | 'neutral';
}

export interface PdfDocumentPayload {
  id: string;
  filename: string;
  institution: string;
  sessionLabel: string;
  title: string;
  subtitle: string;
  metaLine: string;
  sections: PdfTextSection[];
  solutionSections?: PdfTextSection[];
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [''];
  const words = normalized.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (ctx.measureText(word).width > maxWidth) {
        let chunk = '';
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeAscii(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  return bytes;
}

function buildPdfFromJpegs(
  pages: { bytes: Uint8Array; width: number; height: number }[]
): Blob {
  // Standard A4 point dimensions: 595.28 x 841.89 pt
  const pagePtW = 595.28;
  const pagePtH = 841.89;

  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let bytePos = 0;

  const pushBytes = (b: Uint8Array) => {
    chunks.push(b);
    bytePos += b.length;
  };
  const pushText = (s: string) => {
    pushBytes(encodeAscii(s));
  };

  pushText('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  const pageObjNums: number[] = [];
  // Obj 1 = Catalog, Obj 2 = Pages, then per page: PageObj, ContentObj, ImageObj
  let nextObj = 3;
  const pageDefs = pages.map((p) => {
    const pageObj = nextObj++;
    const contentObj = nextObj++;
    const imgObj = nextObj++;
    pageObjNums.push(pageObj);
    return { ...p, pageObj, contentObj, imgObj };
  });

  // Obj 1: Catalog
  offsets[1] = bytePos;
  pushText('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Obj 2: Pages
  offsets[2] = bytePos;
  pushText(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageDefs.length} >>\nendobj\n`
  );

  for (const p of pageDefs) {
    const streamCmd = `q\n${pagePtW.toFixed(2)} 0 0 ${pagePtH.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;

    // Page object
    offsets[p.pageObj] = bytePos;
    pushText(
      `${p.pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pagePtW.toFixed(2)} ${pagePtH.toFixed(2)}] /Resources << /XObject << /Im0 ${p.imgObj} 0 R >> >> /Contents ${p.contentObj} 0 R >>\nendobj\n`
    );

    // Content stream
    offsets[p.contentObj] = bytePos;
    pushText(
      `${p.contentObj} 0 obj\n<< /Length ${streamCmd.length} >>\nstream\n${streamCmd}endstream\nendobj\n`
    );

    // JPEG XObject
    offsets[p.imgObj] = bytePos;
    pushText(
      `${p.imgObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`
    );
    pushBytes(p.bytes);
    pushText('\nendstream\nendobj\n');
  }

  const xrefOffset = bytePos;
  const totalObjs = nextObj;
  pushText(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let i = 1; i < totalObjs; i += 1) {
    const off = offsets[i] ?? 0;
    pushText(`${String(off).padStart(10, '0')} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const mergedParts: BlobPart[] = chunks.map(
    (c) => c.buffer.slice(c.byteOffset, c.byteOffset + c.byteLength) as ArrayBuffer
  );
  return new Blob(mergedParts, { type: 'application/pdf' });
}

export async function renderPdfAssets(
  payload: PdfDocumentPayload,
  includeSolutions: boolean
): Promise<{
  blob: Blob;
  pageDataUrls: string[];
  filename: string;
}> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font check errors
    }
  }

  const pageW = 1240;
  const pageH = 1754;
  const marginX = 88;
  const contentW = pageW - marginX * 2;
  const footerY = pageH - 64;
  const maxContentY = pageH - 120;

  const canvases: HTMLCanvasElement[] = [];

  const createPageCanvas = (pageIndex: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = pageW;
    canvas.height = pageH;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageW, pageH);

    // Subtle outer A4 blue frame
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, pageW - 72, pageH - 72);

    if (pageIndex === 0) {
      // Official Page 1 Header Box
      ctx.fillStyle = '#eff6ff';
      ctx.fillRect(marginX, 64, contentW, 194);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(marginX, 64, contentW, 194);

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1e3a8a';
      ctx.font = '700 22px Cairo, sans-serif';
      ctx.fillText(payload.institution, pageW / 2, 102);

      ctx.fillStyle = '#1d4ed8';
      ctx.font = '800 24px Cairo, sans-serif';
      ctx.fillText(payload.sessionLabel, pageW / 2, 138);

      ctx.fillStyle = '#0f172a';
      ctx.font = '800 32px Cairo, sans-serif';
      ctx.fillText(payload.title, pageW / 2, 184);

      ctx.fillStyle = '#1e40af';
      ctx.font = '600 20px Cairo, sans-serif';
      ctx.fillText(`${payload.subtitle}  ·  ${payload.metaLine}`, pageW / 2, 228);
    } else {
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1d4ed8';
      ctx.font = '600 18px Cairo, sans-serif';
      ctx.fillText(`${payload.title} · ${payload.sessionLabel}`, pageW - marginX, 78);

      ctx.strokeStyle = '#dbeafe';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginX, 94);
      ctx.lineTo(pageW - marginX, 94);
      ctx.stroke();
    }

    canvases.push(canvas);
    return { canvas, ctx, cursorY: pageIndex === 0 ? 298 : 132 };
  };

  let page = createPageCanvas(0);

  const ensureSpace = (needed: number) => {
    if (page.cursorY + needed > maxContentY) {
      page = createPageCanvas(canvases.length);
    }
  };

  const allSections: PdfTextSection[] = [
    ...payload.sections,
    ...(includeSolutions && payload.solutionSections ? payload.solutionSections : []),
  ];

  for (const sec of allSections) {
    ensureSpace(86);

    const ctx = page.ctx;
    const isSolution = sec.accent === 'solution';
    ctx.fillStyle = isSolution ? '#ecfdf5' : '#eff6ff';
    ctx.fillRect(marginX, page.cursorY, contentW, 48);
    ctx.strokeStyle = isSolution ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(marginX, page.cursorY, contentW, 48);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = isSolution ? '#065f46' : '#1e3a8a';
    ctx.font = '800 24px Cairo, sans-serif';
    ctx.fillText(sec.heading, pageW - marginX - 18, page.cursorY + 32);

    page.cursorY += 68;

    for (const item of sec.items) {
      page.ctx.font = '500 21px Cairo, sans-serif';
      const lines = wrapTextLines(page.ctx, item, contentW - 28);
      const blockHeight = lines.length * 34 + 12;
      ensureSpace(blockHeight);

      page.ctx.direction = 'rtl';
      page.ctx.textAlign = 'right';
      page.ctx.fillStyle = isSolution ? '#064e3b' : '#0f172a';
      page.ctx.font = '500 21px Cairo, sans-serif';

      for (const line of lines) {
        page.ctx.fillText(line, pageW - marginX - 12, page.cursorY);
        page.cursorY += 34;
      }
      page.cursorY += 10;
    }

    page.cursorY += 14;
  }

  // Stamp page numbers on all pages
  const totalPages = canvases.length;
  const pageDataUrls: string[] = [];
  const jpegPages: { bytes: Uint8Array; width: number; height: number }[] = [];

  for (let i = 0; i < totalPages; i += 1) {
    const canvas = canvases[i];
    const ctx = canvas.getContext('2d')!;
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1d4ed8';
    ctx.font = '600 18px Cairo, sans-serif';
    ctx.fillText(`صفحة ${i + 1} من ${totalPages}  ·  بوابة المتعلم الرقمية ONEFD`, pageW / 2, footerY);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    pageDataUrls.push(dataUrl);
    jpegPages.push({
      bytes: dataUrlToUint8Array(dataUrl),
      width: pageW,
      height: pageH,
    });
  }

  const blob = buildPdfFromJpegs(jpegPages);
  const safeName = payload.filename.endsWith('.pdf') ? payload.filename : `${payload.filename}.pdf`;
  return { blob, pageDataUrls, filename: safeName };
}

export async function downloadPdfDocument(
  payload: PdfDocumentPayload,
  includeSolutions = true
): Promise<string> {
  const { blob, filename } = await renderPdfAssets(payload, includeSolutions);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 15000);
  return filename;
}
