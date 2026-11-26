export type ColorMode = 'light' | 'dark';

export type AppTheme =
  | 'academic-blue'
  | 'emerald-study'
  | 'ocean-teal'
  | 'royal-purple'
  | 'warm-amber'
  | 'crimson-rose'
  | 'deep-indigo'
  | 'sunset-orange'
  | 'slate-classic';

export interface ThemeConfig {
  id: AppTheme;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  swatchPrimaryClass: string;
  swatchSecondaryClass: string;
  bgGradient: string;
  cardBg: string;
  headerBg: string;
  primaryButton: string;
  accentText: string;
  accentBorder: string;
  badgeBg: string;
  glowEffect: string;
}

export const APP_THEMES: Record<AppTheme, ThemeConfig> = {
  'academic-blue': {
    id: 'academic-blue',
    nameAr: 'الأزرق الأكاديمي (الافتراضي)',
    nameFr: 'Bleu académique',
    nameEn: 'Academic Blue',
    swatchPrimaryClass: 'bg-[#2563eb]',
    swatchSecondaryClass: 'bg-[#38bdf8]',
    bgGradient:
      'bg-gradient-to-b from-slate-100 via-blue-50/60 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-md shadow-slate-900/5',
    headerBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600',
    primaryButton:
      'bg-blue-600 hover:bg-blue-700 text-white border-blue-500/40 dark:border-blue-500/30',
    accentText: 'text-blue-700 dark:text-sky-300',
    accentBorder: 'border-blue-300 dark:border-blue-700',
    badgeBg: 'bg-blue-600 text-white',
    glowEffect: 'shadow-blue-600/15',
  },
  'emerald-study': {
    id: 'emerald-study',
    nameAr: 'الأخضر الزمردي',
    nameFr: 'Vert émeraude',
    nameEn: 'Emerald Green',
    swatchPrimaryClass: 'bg-[#059669]',
    swatchSecondaryClass: 'bg-[#34d399]',
    bgGradient:
      'bg-gradient-to-b from-emerald-50/80 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-emerald-200/80 dark:border-emerald-900/40 shadow-md shadow-emerald-900/5',
    headerBg: 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600',
    primaryButton:
      'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/40 dark:border-emerald-500/30',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-600 text-white',
    glowEffect: 'shadow-emerald-600/15',
  },
  'ocean-teal': {
    id: 'ocean-teal',
    nameAr: 'الأزرق الفيروزي',
    nameFr: 'Turquoise océan',
    nameEn: 'Ocean Teal',
    swatchPrimaryClass: 'bg-[#0d9488]',
    swatchSecondaryClass: 'bg-[#2dd4bf]',
    bgGradient:
      'bg-gradient-to-b from-teal-50/80 via-cyan-50/50 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-teal-950/25 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-teal-200/80 dark:border-teal-900/40 shadow-md shadow-teal-900/5',
    headerBg: 'bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600',
    primaryButton:
      'bg-teal-600 hover:bg-teal-700 text-white border-teal-500/40 dark:border-teal-500/30',
    accentText: 'text-teal-700 dark:text-teal-300',
    accentBorder: 'border-teal-300 dark:border-teal-700',
    badgeBg: 'bg-teal-600 text-white',
    glowEffect: 'shadow-teal-600/15',
  },
  'royal-purple': {
    id: 'royal-purple',
    nameAr: 'البنفسجي الملكي',
    nameFr: 'Violet royal',
    nameEn: 'Royal Purple',
    swatchPrimaryClass: 'bg-[#7c3aed]',
    swatchSecondaryClass: 'bg-[#c084fc]',
    bgGradient:
      'bg-gradient-to-b from-violet-50/80 via-purple-50/40 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-violet-950/25 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-violet-200/80 dark:border-violet-900/40 shadow-md shadow-violet-900/5',
    headerBg: 'bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600',
    primaryButton:
      'bg-violet-600 hover:bg-violet-700 text-white border-violet-500/40 dark:border-violet-500/30',
    accentText: 'text-violet-700 dark:text-violet-300',
    accentBorder: 'border-violet-300 dark:border-violet-700',
    badgeBg: 'bg-violet-600 text-white',
    glowEffect: 'shadow-violet-600/15',
  },
  'deep-indigo': {
    id: 'deep-indigo',
    nameAr: 'النيلي العميق',
    nameFr: 'Indigo profond',
    nameEn: 'Deep Indigo',
    swatchPrimaryClass: 'bg-[#4f46e5]',
    swatchSecondaryClass: 'bg-[#818cf8]',
    bgGradient:
      'bg-gradient-to-b from-indigo-50/80 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-indigo-950/25 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-indigo-200/80 dark:border-indigo-900/40 shadow-md shadow-indigo-900/5',
    headerBg: 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600',
    primaryButton:
      'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500/40 dark:border-indigo-500/30',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    accentBorder: 'border-indigo-300 dark:border-indigo-700',
    badgeBg: 'bg-indigo-600 text-white',
    glowEffect: 'shadow-indigo-600/15',
  },
  'crimson-rose': {
    id: 'crimson-rose',
    nameAr: 'الأحمر القرمزي',
    nameFr: 'Rose cramoisi',
    nameEn: 'Crimson Rose',
    swatchPrimaryClass: 'bg-[#e11d48]',
    swatchSecondaryClass: 'bg-[#fb7185]',
    bgGradient:
      'bg-gradient-to-b from-rose-50/80 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-rose-950/20 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-rose-200/80 dark:border-rose-900/40 shadow-md shadow-rose-900/5',
    headerBg: 'bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600',
    primaryButton:
      'bg-rose-600 hover:bg-rose-700 text-white border-rose-500/40 dark:border-rose-500/30',
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBorder: 'border-rose-300 dark:border-rose-700',
    badgeBg: 'bg-rose-600 text-white',
    glowEffect: 'shadow-rose-600/15',
  },
  'warm-amber': {
    id: 'warm-amber',
    nameAr: 'الذهبي الكهرماني',
    nameFr: 'Ambre doré',
    nameEn: 'Warm Amber',
    swatchPrimaryClass: 'bg-[#d97706]',
    swatchSecondaryClass: 'bg-[#fbbf24]',
    bgGradient:
      'bg-gradient-to-b from-amber-50/80 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-amber-200/80 dark:border-amber-900/40 shadow-md shadow-amber-900/5',
    headerBg: 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600',
    primaryButton:
      'bg-amber-700 hover:bg-amber-800 text-white border-amber-600/40 dark:border-amber-500/30',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-300 dark:border-amber-700',
    badgeBg: 'bg-amber-700 text-white',
    glowEffect: 'shadow-amber-600/15',
  },
  'sunset-orange': {
    id: 'sunset-orange',
    nameAr: 'البرتقالي المشرق',
    nameFr: 'Orange couchant',
    nameEn: 'Sunset Orange',
    swatchPrimaryClass: 'bg-[#ea580c]',
    swatchSecondaryClass: 'bg-[#fb923c]',
    bgGradient:
      'bg-gradient-to-b from-orange-50/80 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-orange-950/20 dark:to-slate-950 dark:text-slate-100',
    cardBg:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-orange-200/80 dark:border-orange-900/40 shadow-md shadow-orange-900/5',
    headerBg: 'bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600',
    primaryButton:
      'bg-orange-600 hover:bg-orange-700 text-white border-orange-500/40 dark:border-orange-500/30',
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBorder: 'border-orange-300 dark:border-orange-700',
    badgeBg: 'bg-orange-600 text-white',
    glowEffect: 'shadow-orange-600/15',
  },
  'slate-classic': {
    id: 'slate-classic',
    nameAr: 'الرمادي الكلاسيكي',
    nameFr: 'Ardoise classique',
    nameEn: 'Slate Classic',
    swatchPrimaryClass: 'bg-[#334155]',
    swatchSecondaryClass: 'bg-[#94a3b8]',
    bgGradient:
      'bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-black dark:text-slate-100',
    cardBg:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm',
    headerBg: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900',
    primaryButton:
      'bg-slate-800 hover:bg-slate-900 text-white border-slate-700',
    accentText: 'text-slate-700 dark:text-slate-300',
    accentBorder: 'border-slate-300 dark:border-slate-700',
    badgeBg: 'bg-slate-800 text-white',
    glowEffect: 'shadow-slate-800/15',
  },
};
