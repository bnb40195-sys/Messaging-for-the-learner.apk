export type AppLanguage = 'ar' | 'fr' | 'en';

export interface AppTranslations {
  appName: string;
  seasonTag: string;
  menuTitle: string;
  closeMenu: string;
  settings: string;
  languageTitle: string;
  languageDesc: string;
  backgroundTitle: string;
  backgroundDesc: string;
  themeTitle: string;
  applyAndClose: string;
  notifications: string;
  adminBadge: string;
  loginBtn: string;
  heroCountry: string;
  heroTitle: string;
  heroSubtitle: string;
  countdownTitle: string;
  countdownDesc: string;
  daysRemaining: string;
  sectionsHeading: string;
  appTopicsTitle: string;
  appTopicsSubtitle: string;
  studentsTitle: string;
  studentsSubtitle: string;
  activeNowLabel: string;
  addStudentNameTitle: string;
  saveMyNameBtn: string;
  addStudentBtn: string;
  searchPlaceholder: string;
  backLabel: string;
}

export const TRANSLATIONS: Record<AppLanguage, AppTranslations> = {
  ar: {
    appName: 'بوابة المتعلم الرقمية',
    seasonTag: 'الموسم الدراسي 2026/2027 · ONEFD',
    menuTitle: 'القائمة الرئيسية',
    closeMenu: 'إغلاق القائمة',
    settings: 'الإعدادات',
    languageTitle: 'لغة التطبيق',
    languageDesc: 'اختر لغة العرض واتجاه الواجهة',
    backgroundTitle: 'خلفية التطبيق',
    backgroundDesc: 'اختر خلفية الشاشة الرئيسية والصفحات',
    themeTitle: 'نمط الألوان والسمة',
    applyAndClose: 'حفظ وتطبيق الإعدادات',
    notifications: 'الإشعارات',
    adminBadge: 'المشرف',
    loginBtn: 'دخول',
    heroCountry: 'الجمهورية الجزائرية الديمقراطية الشعبية · الديوان الوطني ONEFD',
    heroTitle: 'بوابة التعليم الرقمي والتقويمات الرسمية 2026/2027',
    heroSubtitle:
      'المنصة الرسمية المعتمدة لمتابعة رزنامة التقويمات التكوينية، الفروض الإلكترونية، والأرضيات التعليمية داخل التطبيق.',
    countdownTitle: 'العد التنازلي لامتحان إثبات المستوى دورة ماي 2027',
    countdownDesc: 'يتحدث العد التنازلي تلقائياً كل يوم حتى موعد الامتحان الرسمي',
    daysRemaining: 'يوماً متبقياً',
    sectionsHeading: 'الأقسام والأزرار الرئيسية',
    appTopicsTitle: 'بنك المواضيع والأسئلة التفاعلية',
    appTopicsSubtitle: 'مواضيع وتطبيقات وأسئلة حقيقية لجميع المستويات والشعب',
    studentsTitle: 'الطلاب النشطون الآن',
    studentsSubtitle: 'قائمة حسابات الطلاب النشطة حالياً في التطبيق',
    activeNowLabel: 'نشط الآن',
    addStudentNameTitle: 'إضافة اسم الطالب',
    saveMyNameBtn: 'حفظ اسمي',
    addStudentBtn: 'إضافة اسم الطالب',
    searchPlaceholder: 'ابحث باسم الطالب أو المستوى...',
    backLabel: 'رجوع',
  },
  fr: {
    appName: 'Portail Numérique ONEFD',
    seasonTag: 'Année Scolaire 2026/2027 · ONEFD',
    menuTitle: 'Menu Principal',
    closeMenu: 'Fermer le menu',
    settings: 'Paramètres',
    languageTitle: "Langue de l'application",
    languageDesc: "Choisissez la langue d'affichage",
    backgroundTitle: "Arrière-plan de l'application",
    backgroundDesc: "Personnalisez le fond d'écran",
    themeTitle: 'Thème et couleurs',
    applyAndClose: 'Enregistrer et appliquer',
    notifications: 'Notifications',
    adminBadge: 'Admin',
    loginBtn: 'Connexion',
    heroCountry: 'République Algérienne · Office National ONEFD',
    heroTitle: "Portail d'Enseignement Numérique & Évaluations 2026/2027",
    heroSubtitle:
      'Consultez le calendrier officiel, les devoirs et les plateformes pédagogiques directement dans application.',
    countdownTitle: "Compte à rebours de l'examen de niveau Mai 2027",
    countdownDesc: "Mis à jour automatiquement chaque jour jusqu'à l'examen officiel",
    daysRemaining: 'jours restants',
    sectionsHeading: 'Sections et services principaux',
    appTopicsTitle: 'Banque de Sujets & Quiz',
    appTopicsSubtitle: 'Exercices pratiques et questions interactives par niveau',
    studentsTitle: 'Étudiants Actifs',
    studentsSubtitle: 'Liste en temps réel des étudiants actuellement actifs',
    activeNowLabel: 'Actif',
    addStudentNameTitle: "Ajouter le nom de l'étudiant",
    saveMyNameBtn: 'Enregistrer mon nom',
    addStudentBtn: 'Ajouter étudiant',
    searchPlaceholder: 'Rechercher par nom ou niveau...',
    backLabel: 'Retour',
  },
  en: {
    appName: 'ONEFD Digital Portal',
    seasonTag: 'Academic Year 2026/2027 · ONEFD',
    menuTitle: 'Main Menu',
    closeMenu: 'Close menu',
    settings: 'Settings',
    languageTitle: 'App Language',
    languageDesc: 'Choose display language and layout direction',
    backgroundTitle: 'App Background',
    backgroundDesc: 'Choose your preferred backdrop style',
    themeTitle: 'Color Theme',
    applyAndClose: 'Save & Apply',
    notifications: 'Notifications',
    adminBadge: 'Admin',
    loginBtn: 'Sign in',
    heroCountry: 'People’s Democratic Republic of Algeria · ONEFD',
    heroTitle: 'Digital Learning Portal & Official Assessments 2026/2027',
    heroSubtitle:
      'Access assessment calendars, coursework, and digital learning platforms directly inside the app.',
    countdownTitle: 'Countdown to May 2027 Level Exam',
    countdownDesc: 'Automatically updated daily until the official exam date',
    daysRemaining: 'days left',
    sectionsHeading: 'Main Sections',
    appTopicsTitle: 'App Topics & Quiz Bank',
    appTopicsSubtitle: 'Practice exercises and interactive real questions by grade & stream',
    studentsTitle: 'Active Students',
    studentsSubtitle: 'Real-time list of currently active students in the app',
    activeNowLabel: 'Active now',
    addStudentNameTitle: 'Add Student Name',
    saveMyNameBtn: 'Save My Name',
    addStudentBtn: 'Add Student',
    searchPlaceholder: 'Search by name or level...',
    backLabel: 'Back',
  },
};
