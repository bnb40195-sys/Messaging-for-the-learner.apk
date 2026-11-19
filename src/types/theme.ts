export type AppTheme = 'futuristic-lavender' | 'cyber-dark' | 'academic-blue' | 'emerald-study';

export interface ThemeConfig {
  id: AppTheme;
  nameAr: string;
  nameEn: string;
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
  'futuristic-lavender': {
    id: 'futuristic-lavender',
    nameAr: 'أرجواني مستقبلي 2027 (نيومورفيك)',
    nameEn: 'Futuristic Lavender',
    bgGradient: 'bg-gradient-to-b from-[#f1ecfe] via-[#f7f5ff] to-[#fbfaff] dark:from-[#0f0b1f] dark:via-[#15102a] dark:to-[#0a0714]',
    cardBg: 'bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-indigo-100/90 dark:border-indigo-900/40 shadow-lg shadow-indigo-500/5',
    headerBg: 'bg-gradient-to-r from-[#7c6bee] via-[#6a57e7] to-[#5542db]',
    primaryButton: 'bg-gradient-to-r from-[#dcd7fe] via-[#c6bffe] to-[#a499fe] hover:from-[#cfc7fe] hover:to-[#9385fd] text-[#312579] border-white/60 dark:border-indigo-400/30',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    accentBorder: 'border-indigo-300 dark:border-indigo-700',
    badgeBg: 'bg-[#7564eb] text-white',
    glowEffect: 'shadow-indigo-500/20'
  },
  'cyber-dark': {
    id: 'cyber-dark',
    nameAr: 'الوضع الداكن السيبراني (OLED Cyber)',
    nameEn: 'Cyber Dark',
    bgGradient: 'bg-gradient-to-b from-[#090a12] via-[#0d101d] to-[#05060b] text-slate-100',
    cardBg: 'bg-[#121629]/90 backdrop-blur-md border-cyan-500/20 shadow-xl shadow-cyan-500/5 text-slate-100',
    headerBg: 'bg-gradient-to-r from-[#111827] via-[#1e1b4b] to-[#0f172a] border-b border-cyan-500/20',
    primaryButton: 'bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 text-cyan-300 border-cyan-500/30',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500 text-slate-950',
    glowEffect: 'shadow-cyan-500/20'
  },
  'academic-blue': {
    id: 'academic-blue',
    nameAr: 'أزرق أكاديمي هادئ (Oxford Blue)',
    nameEn: 'Academic Blue',
    bgGradient: 'bg-gradient-to-b from-[#e8f1fc] via-[#f1f6fd] to-[#fafdff] dark:from-[#071324] dark:via-[#0c1e38] dark:to-[#040b15]',
    cardBg: 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-blue-200 dark:border-blue-900/40 shadow-lg shadow-blue-500/5',
    headerBg: 'bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]',
    primaryButton: 'bg-gradient-to-r from-[#bfdbfe] via-[#93c5fd] to-[#60a5fa] hover:from-[#93c5fd] hover:to-[#3b82f6] text-[#1e3a8a] border-white/60 dark:border-blue-400/30',
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-300 dark:border-blue-700',
    badgeBg: 'bg-blue-600 text-white',
    glowEffect: 'shadow-blue-500/20'
  },
  'emerald-study': {
    id: 'emerald-study',
    nameAr: 'أخضر زمردي للتركيز (Emerald Focus)',
    nameEn: 'Emerald Focus',
    bgGradient: 'bg-gradient-to-b from-[#eaf7f1] via-[#f2faf6] to-[#fcfffd] dark:from-[#061912] dark:via-[#0b281d] dark:to-[#030e0a]',
    cardBg: 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-emerald-200 dark:border-emerald-900/40 shadow-lg shadow-emerald-500/5',
    headerBg: 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#10b981]',
    primaryButton: 'bg-gradient-to-r from-[#a7f3d0] via-[#6ee7b7] to-[#34d399] hover:from-[#6ee7b7] hover:to-[#10b981] text-[#064e3b] border-white/60 dark:border-emerald-400/30',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-300 dark:border-emerald-700',
    badgeBg: 'bg-emerald-600 text-white',
    glowEffect: 'shadow-emerald-500/20'
  }
};

export type AppBackground =
  | 'theme-default'
  | 'night-aurora'
  | 'ocean-breeze'
  | 'royal-sunset'
  | 'pure-dark'
  | 'clean-light';

export interface BackgroundPreset {
  id: AppBackground;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  className: string;
  previewSwatch: string;
  isDarkSurface?: boolean;
}

export const APP_BACKGROUNDS: Record<AppBackground, BackgroundPreset> = {
  'theme-default': {
    id: 'theme-default',
    nameAr: 'خلفية السمة الافتراضية',
    nameFr: 'Fond du thème par défaut',
    nameEn: 'Default Theme Backdrop',
    className: '',
    previewSwatch: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700',
  },
  'night-aurora': {
    id: 'night-aurora',
    nameAr: 'شفق ليلي بنفسجي',
    nameFr: 'Aurore nocturne',
    nameEn: 'Night Aurora',
    className: 'bg-gradient-to-br from-[#0b091c] via-[#1c113a] to-[#081b2e] text-slate-100',
    previewSwatch: 'bg-gradient-to-br from-[#0b091c] via-[#4c1d95] to-[#0e7490]',
    isDarkSurface: true,
  },
  'ocean-breeze': {
    id: 'ocean-breeze',
    nameAr: 'نسيم المحيط الأزرق',
    nameFr: 'Brise océanique',
    nameEn: 'Ocean Breeze',
    className: 'bg-gradient-to-br from-[#e0f2fe] via-[#ecfeff] to-[#f0fdf4] dark:from-[#041524] dark:via-[#082438] dark:to-[#041b1a]',
    previewSwatch: 'bg-gradient-to-br from-sky-400 via-cyan-300 to-teal-400',
  },
  'royal-sunset': {
    id: 'royal-sunset',
    nameAr: 'غروب دافئ ناعم',
    nameFr: 'Coucher de soleil doux',
    nameEn: 'Warm Sunset',
    className: 'bg-gradient-to-br from-[#fff7ed] via-[#fdf2f8] to-[#eef2ff] dark:from-[#1f1018] dark:via-[#1b122b] dark:to-[#0f172a]',
    previewSwatch: 'bg-gradient-to-br from-amber-300 via-rose-300 to-indigo-400',
  },
  'pure-dark': {
    id: 'pure-dark',
    nameAr: 'خلفية داكنة نقية (OLED)',
    nameFr: 'Noir pur (OLED)',
    nameEn: 'Pure Dark (OLED)',
    className: 'bg-[#05060a] text-slate-100',
    previewSwatch: 'bg-slate-950 border border-slate-700',
    isDarkSurface: true,
  },
  'clean-light': {
    id: 'clean-light',
    nameAr: 'خلفية بيضاء صافية',
    nameFr: 'Blanc épuré',
    nameEn: 'Crisp White',
    className: 'bg-slate-50 text-slate-900',
    previewSwatch: 'bg-white border border-slate-300',
  },
};

