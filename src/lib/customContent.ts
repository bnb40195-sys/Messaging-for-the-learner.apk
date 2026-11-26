export type SectionKey =
  | 'platforms'
  | 'registration'
  | 'documents'
  | 'homework'
  | 'middle'
  | 'secondary'
  | 'app-topics'
  | 'students'
  | 'level-detail'
  | (string & {});

export interface ButtonOverride {
  label?: string;
  subtitle?: string;
  actionType?: 'default' | 'url' | 'text';
  url?: string;
  textTitle?: string;
  textBody?: string;
  hidden?: boolean;
}

export type ButtonOverridesMap = Record<string, Record<string, ButtonOverride>>;
export type ButtonOrdersMap = Record<string, string[]>;

export interface CustomSectionEntry {
  id: string;
  type: 'url' | 'text' | 'image';
  title: string;
  subtitle?: string;
  url?: string;
  textBody?: string;
  imageUrl?: string;
  displayMode?: 'card' | 'button';
}

export type SectionEntriesMap = Record<string, CustomSectionEntry[]>;

export interface SectionHeaderOverride {
  title?: string;
  subtitle?: string;
  note?: string;
}

export type SectionHeadersMap = Record<string, SectionHeaderOverride>;

export interface HomeCustomWidget {
  id: string;
  type: 'text' | 'image' | 'url';
  title?: string;
  body?: string;
  imageUrl?: string;
  url?: string;
  accent?: 'blue' | 'emerald' | 'amber' | 'slate';
}

export interface HeroOverride {
  badge?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface HomeCountdownOverride {
  title?: string;
  desc?: string;
  daysLabel?: string;
  targetDateIso?: string;
}

export interface HomeCalendarMilestone {
  num: string;
  title: string;
  dateText: string;
  durationText: string;
  isPrimary?: boolean;
  badgeText?: string;
}

export interface HomeCalendarOverride {
  badge?: string;
  title?: string;
  subtitle?: string;
  sectionLabel?: string;
  milestones?: HomeCalendarMilestone[];
  noteTitle?: string;
  noteBody?: string;
}

export interface HomeSupportOverride {
  badge?: string;
  title?: string;
  subtitle?: string;
  card1Title?: string;
  card1Desc?: string;
  card2Title?: string;
  card2Desc?: string;
}

export interface HomeBlocksContentOverride {
  countdown?: HomeCountdownOverride;
  calendar?: HomeCalendarOverride;
  support?: HomeSupportOverride;
}

export const DEFAULT_CALENDAR_MILESTONES: HomeCalendarMilestone[] = [
  {
    num: '01',
    title: 'فرض المراقبة الذاتية رقم 01',
    dateText: 'من 22 ديسمبر 2026 إلى 21 جانفي 2027',
    durationText: 'المدة: 31 يوماً',
  },
  {
    num: '02',
    title: 'نشر إجابات فرض المراقبة الذاتية رقم 01',
    dateText: 'من 11 جانفي 2027 إلى 11 فيفري 2027',
    durationText: 'المدة: 32 يوماً',
  },
  {
    num: '03',
    title: 'الفرض الإلكتروني الرسمي',
    dateText: 'من 22 فيفري 2027 إلى 25 مارس 2027',
    durationText: 'المدة: 32 يوماً',
    isPrimary: true,
    badgeText: 'إجباري',
  },
  {
    num: '04',
    title: 'فرض المراقبة الذاتية رقم 02',
    dateText: 'من 15 مارس 2027 إلى 15 أفريل 2027',
    durationText: 'المدة: 32 يوماً',
  },
  {
    num: '05',
    title: 'نشر إجابات فرض المراقبة الذاتية رقم 02',
    dateText: 'من 12 أفريل 2027 إلى 29 أفريل 2027',
    durationText: 'المدة: 18 يوماً',
  },
];

const STORAGE_KEYS = {
  buttonOverrides: 'onefd_button_overrides_v1',
  buttonOrders: 'onefd_button_orders_v1',
  sectionEntries: 'onefd_section_entries_v1',
  sectionHeaders: 'onefd_section_headers_v1',
  homeWidgets: 'onefd_home_widgets_v1',
  heroOverride: 'onefd_hero_override_v1',
  homeBlocksContent: 'onefd_home_blocks_content_v1',
  showInlineAdminTools: 'onefd_show_inline_admin_tools_v1',
};

export function sortItemsByOrder<T>(
  items: T[],
  getId: (item: T) => string,
  order?: string[]
): T[] {
  if (!order || order.length === 0) return items;
  const rank = new Map<string, number>();
  order.forEach((id, idx) => rank.set(id, idx));
  return [...items].sort((a, b) => {
    const rA = rank.has(getId(a)) ? rank.get(getId(a))! : Number.MAX_SAFE_INTEGER;
    const rB = rank.has(getId(b)) ? rank.get(getId(b))! : Number.MAX_SAFE_INTEGER;
    if (rA !== rB) return rA - rB;
    return 0;
  });
}

export function normalizeExternalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function loadButtonOverrides(): ButtonOverridesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.buttonOverrides);
    const parsed = raw ? (JSON.parse(raw) as ButtonOverridesMap) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveButtonOverrides(data: ButtonOverridesMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.buttonOverrides, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSectionEntries(): SectionEntriesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sectionEntries);
    const parsed = raw ? (JSON.parse(raw) as SectionEntriesMap) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSectionEntries(data: SectionEntriesMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.sectionEntries, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSectionHeaders(): SectionHeadersMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sectionHeaders);
    const parsed = raw ? (JSON.parse(raw) as SectionHeadersMap) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSectionHeaders(data: SectionHeadersMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.sectionHeaders, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadHomeWidgets(): HomeCustomWidget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.homeWidgets);
    const parsed = raw ? (JSON.parse(raw) as HomeCustomWidget[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHomeWidgets(data: HomeCustomWidget[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.homeWidgets, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadHeroOverride(): HeroOverride {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.heroOverride);
    const parsed = raw ? (JSON.parse(raw) as HeroOverride) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveHeroOverride(data: HeroOverride): void {
  try {
    localStorage.setItem(STORAGE_KEYS.heroOverride, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadHomeBlocksContent(): HomeBlocksContentOverride {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.homeBlocksContent);
    const parsed = raw ? (JSON.parse(raw) as HomeBlocksContentOverride) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveHomeBlocksContent(data: HomeBlocksContentOverride): void {
  try {
    localStorage.setItem(STORAGE_KEYS.homeBlocksContent, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadButtonOrders(): ButtonOrdersMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.buttonOrders);
    const parsed = raw ? (JSON.parse(raw) as ButtonOrdersMap) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveButtonOrders(data: ButtonOrdersMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.buttonOrders, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadShowInlineAdminTools(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.showInlineAdminTools) === '1';
  } catch {
    return false;
  }
}

export function saveShowInlineAdminTools(show: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.showInlineAdminTools, show ? '1' : '0');
  } catch {
    // Ignore storage errors
  }
}

export async function compressImageToDataUrl(file: File, maxWidth = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة ملف الصورة.'));
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('ملف الصورة فارغ.'));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error('صيغة الصورة غير مدعومة.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        try {
          const isPng = file.type === 'image/png' && file.size < 250 * 1024;
          const out = isPng
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.82);
          resolve(out);
        } catch {
          resolve(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
