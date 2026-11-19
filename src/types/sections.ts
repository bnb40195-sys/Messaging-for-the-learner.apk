export interface AppSectionItem {
  id: string;
  label: string;
  desc: string;
  targetType: 'view' | 'url';
  targetValue: string;
  iconName: 'home' | 'book' | 'user' | 'users' | 'file' | 'laptop' | 'globe' | 'star' | 'award';
  color: string;
}

export type HomeBlockId = 'hero' | 'countdown' | 'calendar' | 'support';

export interface HomeBlockConfig {
  id: HomeBlockId;
  label: string;
  visible: boolean;
}

export const DEFAULT_OFFICIAL_SITE_URL = 'https://www.onefd.edu.dz/';

export const DEFAULT_SECTIONS: AppSectionItem[] = [
  {
    id: 'home',
    label: 'الواجهة الرئيسية',
    desc: 'البوابة العامة والرزنامة والإعلانات',
    targetType: 'view',
    targetValue: 'home',
    iconName: 'home',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'platforms',
    label: 'الأرضيات التعليمية (المعلام)',
    desc: 'روابط المتوسط والثانوي (1-2-3 ثانوي)',
    targetType: 'view',
    targetValue: 'platforms',
    iconName: 'book',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'app-topics',
    label: 'مواضيع وأسئلة التطبيق',
    desc: 'بنك المواضيع والأسئلة التفاعلية الحقيقية لجميع المستويات والشعب',
    targetType: 'view',
    targetValue: 'app-topics',
    iconName: 'star',
    color: 'from-violet-600 to-purple-600',
  },
  {
    id: 'students',
    label: 'الطلاب المسجلون',
    desc: 'قائمة الطلاب النشطين وغير النشطين مع إضافة اسم الطالب',
    targetType: 'view',
    targetValue: 'students',
    iconName: 'users',
    color: 'from-violet-600 to-indigo-600',
  },
  {
    id: 'registration',
    label: 'تسجيل الدخول (جديد / سابق)',
    desc: 'تسجيل متعلم جديد وتأكيد هوية متعلم سابق',
    targetType: 'view',
    targetValue: 'registration',
    iconName: 'user',
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 'documents',
    label: 'سحب الوثائق',
    desc: 'إعادة طبع الوثائق، رقم التسجيل، وأي استفسار',
    targetType: 'view',
    targetValue: 'documents',
    iconName: 'file',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'homework',
    label: 'الفرض الإلكتروني الرسمي',
    desc: 'اجتياز الفروض واحتساب المراقبة المستمرة',
    targetType: 'view',
    targetValue: 'homework',
    iconName: 'laptop',
    color: 'from-sky-600 to-indigo-600',
  },
];

export const DEFAULT_HOME_BLOCKS: HomeBlockConfig[] = [
  { id: 'hero', label: 'بطاقة البوابة الترحيبية', visible: true },
  { id: 'countdown', label: 'العد التنازلي للامتحان', visible: true },
  { id: 'calendar', label: 'رزنامة التقويمات التكوينية', visible: true },
  { id: 'support', label: 'إعلان المرافقة البيداغوجية والنفسية', visible: true },
];
