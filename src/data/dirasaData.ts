export interface OnefdWebsite {
  id: string;
  title: string;
  category: 'registration' | 'scolarium' | 'exams' | 'results' | 'official';
  url: string;
  description: string;
  badge: string;
  iconType: 'link' | 'book' | 'laptop' | 'file' | 'check' | 'award';
  isOfficial: boolean;
  statusText: string;
  guidelines: string[];
}

export interface LevelInfo {
  id: string;
  level: 'middle' | 'secondary';
  name: string;
  badgeNumber: number;
  scolariumUrl: string;
  eDevoirUrl: string;
  subjectsCount: number;
  branches?: string[];
  description: string;
}

export interface EDevoirLevel {
  id: string;
  level: 'middle' | 'secondary';
  name: string;
  badgeNumber: number;
  url: string;
  fullDomain: string;
}

export const E_DEVOIR_SECONDARY: EDevoirLevel[] = [
  {
    id: '1as',
    level: 'secondary',
    name: 'سنة أولى ثانوي',
    badgeNumber: 1,
    url: 'https://e-devoir-1as.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-1as.onefd.edu.dz'
  },
  {
    id: '2as',
    level: 'secondary',
    name: 'سنة ثانية ثانوي',
    badgeNumber: 2,
    url: 'https://e-devoir-2as.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-2as.onefd.edu.dz'
  },
  {
    id: '3as',
    level: 'secondary',
    name: 'سنة ثالثة ثانوي',
    badgeNumber: 3,
    url: 'https://e-devoir-3as.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-3as.onefd.edu.dz'
  }
];

export const E_DEVOIR_MIDDLE: EDevoirLevel[] = [
  {
    id: '1am',
    level: 'middle',
    name: 'سنة أولى متوسط',
    badgeNumber: 1,
    url: 'https://e-devoir-1am.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-1am.onefd.edu.dz'
  },
  {
    id: '2am',
    level: 'middle',
    name: 'سنة ثانية متوسط',
    badgeNumber: 2,
    url: 'https://e-devoir-2am.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-2am.onefd.edu.dz'
  },
  {
    id: '3am',
    level: 'middle',
    name: 'سنة ثالثة متوسط',
    badgeNumber: 3,
    url: 'https://e-devoir-3am.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-3am.onefd.edu.dz'
  },
  {
    id: '4am',
    level: 'middle',
    name: 'سنة رابعة متوسط',
    badgeNumber: 4,
    url: 'https://e-devoir-4am.onefd.edu.dz/index.php/welcome',
    fullDomain: 'e-devoir-4am.onefd.edu.dz'
  }
];

export interface DocumentAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  externalUrl?: string;
  requiresId: boolean;
}

export const ONEFD_WEBSITES: OnefdWebsite[] = [
  {
    id: 'inscriptic-new',
    title: 'موقع تسجيل متعلم جديد (حساب جديد)',
    category: 'registration',
    url: 'https://inscriptic.onefd.edu.dz/new-student/create-account',
    description: 'الموقع الرسمي لإنشاء حساب جديد وتسجيل المتعلمين الجدد بالديوان الوطني ONEFD.',
    badge: 'تسجيل جديد',
    iconType: 'link',
    isOfficial: true,
    statusText: 'مفتوح للعام 2026/2027',
    guidelines: [
      'اختيار المركز الولائي التابع لمقر إقامتك',
      'إدخال المعلومات الشخصية والدراسية بدقة',
      'دفع حقوق التسجيل وتأكيد الحساب'
    ]
  },
  {
    id: 'inscriptic-old',
    title: 'موقع تسجيل متعلم سابق (تأكيد الهوية)',
    category: 'registration',
    url: 'https://inscriptic.onefd.edu.dz/old-student/verify-identity',
    description: 'الموقع الرسمي للتحقق من هوية وتجديد تسجيل المتعلمين السابقين وإعادة التسجيل.',
    badge: 'تجديد التسجيل',
    iconType: 'link',
    isOfficial: true,
    statusText: 'مفتوح للعام 2026/2027',
    guidelines: [
      'إدخال رقم التسجيل وتاريخ الميلاد',
      'تأكيد الانتقال للمستوى الأعلى',
      'تسديد حقوق إعادة التسجيل السنوي'
    ]
  },
  {
    id: 'scolarium-3as',
    title: 'أرضية المعلام - السنة الثالثة ثانوي (BAC)',
    category: 'scolarium',
    url: 'https://scolarium-3as.onefd.edu.dz/',
    description: 'منصة التعليم الإلكتروني الرسمية لطلبة السنة الثالثة ثانوي بكالوريا، تحميل الدروس والمحاور والتحضير للبكالوريا.',
    badge: 'معلام 3 ثانوي',
    iconType: 'laptop',
    isOfficial: true,
    statusText: 'يعمل 24/7',
    guidelines: [
      'تسجيل الدخول باسم المستخدم (رقم التسجيل) والرقم السري',
      'متابعة دروس البكالوريا لجميع الشعب'
    ]
  },
  {
    id: 'scolarium-2as',
    title: 'أرضية المعلام - السنة الثانية ثانوي',
    category: 'scolarium',
    url: 'https://scolarium-2as.onefd.edu.dz/',
    description: 'منصة التعليم الإلكتروني الرسمية لسنوات الثانية ثانوي لجميع الشعب والتخصصات.',
    badge: 'معلام 2 ثانوي',
    iconType: 'laptop',
    isOfficial: true,
    statusText: 'يعمل 24/7',
    guidelines: [
      'تحميل ملخصات الدروس والتمارين المحلولة',
      'التواصل مع الأساتذة عبر المنتديات'
    ]
  },
  {
    id: 'scolarium-1as',
    title: 'أرضية المعلام - السنة الأولى ثانوي',
    category: 'scolarium',
    url: 'https://scolarium-1as.onefd.edu.dz/',
    description: 'منصة التعليم الإلكتروني الرسمية للسنة الأولى ثانوي جذع مشترك علوم وتكنولوجيا وجذع مشترك آداب.',
    badge: 'معلام 1 ثانوي',
    iconType: 'laptop',
    isOfficial: true,
    statusText: 'يعمل 24/7',
    guidelines: [
      'المقررات الرسمية للجذع المشترك',
      'بنك التمارين المحلولة والفروض الدورية'
    ]
  },
  {
    id: 'scolarium-moyen',
    title: 'أرضية المعلام - مرحلة التعليم المتوسط (1-2-3-4 متوسط)',
    category: 'scolarium',
    url: 'https://scolarium-moyen.onefd.edu.dz/',
    description: 'منصة التعليم الإلكتروني الرسمية لسنوات التعليم المتوسط وشهادة BEM.',
    badge: 'معلام المتوسط',
    iconType: 'book',
    isOfficial: true,
    statusText: 'يعمل 24/7',
    guidelines: [
      'الدخول برقم التسجيل الممنوح في الاستمارة',
      'تحميل الدروس والواجبات الدورية'
    ]
  },
  {
    id: 'devoir-online',
    title: 'موقع الفرض الإلكتروني الرسمي',
    category: 'exams',
    url: 'https://devoir.onefd.edu.dz/',
    description: 'بوابة اجتياز الفروض الإلكترونية وحساب نقطة المراقبة المستمرة لمعدل الانتقال.',
    badge: 'الفرض الإلكتروني',
    iconType: 'laptop',
    isOfficial: true,
    statusText: 'متاح حسب الرزنامة',
    guidelines: [
      'تجهيز اتصال إنترنت مستقر قبل بدء الفرض',
      'الفرض محدد بزمن تنازلي إلكتروني دقيق'
    ]
  },
  {
    id: 'convocation',
    title: 'موقع سحب استدعاء امتحان المستوى (Convocation)',
    category: 'exams',
    url: 'https://convocation.onefd.edu.dz/',
    description: 'سحب وطباعة استدعاء امتحان إثبات المستوى السنوي مع معرفة مركز الإجراء.',
    badge: 'استدعاء الامتحان',
    iconType: 'file',
    isOfficial: true,
    statusText: 'يفتح قبل الامتحان',
    guidelines: [
      'إدخال رقم التسجيل والولاية وتاريخ الميلاد',
      'طباعة الاستدعاء الرسمي الملون أو الأبيض والأسود'
    ]
  },
  {
    id: 'results',
    title: 'موقع كشف النقاط ونتائج امتحان المستوى',
    category: 'results',
    url: 'https://resultat.onefd.edu.dz/',
    description: 'الاطلاع على نتائج امتحان إثبات المستوى السنوي وسحب كشف النقاط وشهادة النجاح.',
    badge: 'كشف النقاط',
    iconType: 'award',
    isOfficial: true,
    statusText: 'تحديثات دورة 2026/2027',
    guidelines: [
      'إدخال رقم التسجيل وتاريخ الميلاد',
      'الاطلاع على المعدل السنوي وقرار الانتقال'
    ]
  },
  {
    id: 'onefd-portal',
    title: 'الموقع الرسمي للديوان الوطني ONEFD',
    category: 'official',
    url: 'https://www.onefd.edu.dz/',
    description: 'البوابة العامة للديوان الوطني للتعليم والتكوين عن بعد والقرارات الوزارية.',
    badge: 'بوابة الديوان',
    iconType: 'link',
    isOfficial: true,
    statusText: 'البوابة العامة',
    guidelines: [
      'أخبار ومناشير وزارة التربية الوطنية',
      'دليل وإرشادات المتعلمين لجميع الأطوار'
    ]
  }
];

export const MIDDLE_LEVELS: LevelInfo[] = [
  {
    id: '1am',
    level: 'middle',
    name: 'سنة أولى متوسط',
    badgeNumber: 1,
    scolariumUrl: 'https://scolarium-moyen.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-1am.onefd.edu.dz/index.php/welcome',
    subjectsCount: 11,
    description: 'الطور المتوسط - السنة الأولى: لغة عربية، رياضيات، فرنسية، إنجليزية، علوم الطبيعة والحياة، علوم فيزيائية، تاريخ وجغرافيا، تربية إسلامية، تربية مدنية.'
  },
  {
    id: '2am',
    level: 'middle',
    name: 'سنة ثانية متوسط',
    badgeNumber: 2,
    scolariumUrl: 'https://scolarium-moyen.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-2am.onefd.edu.dz/index.php/welcome',
    subjectsCount: 11,
    description: 'الطور المتوسط - السنة الثانية: الدروس المقررة، تمارين المعلام، ونماذج الفروض الدورية مع الحلول.'
  },
  {
    id: '3am',
    level: 'middle',
    name: 'سنة ثالثة متوسط',
    badgeNumber: 3,
    scolariumUrl: 'https://scolarium-moyen.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-3am.onefd.edu.dz/index.php/welcome',
    subjectsCount: 11,
    description: 'الطور المتوسط - السنة الثالثة: تعميق المعارف وتطوير المهارات العلمية واللغوية عبر منصة المعلام.'
  },
  {
    id: '4am',
    level: 'middle',
    name: 'سنة رابعة متوسط',
    badgeNumber: 4,
    scolariumUrl: 'https://scolarium-moyen.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-4am.onefd.edu.dz/index.php/welcome',
    subjectsCount: 11,
    description: 'سنة شهادة التعليم المتوسط (BEM): تحضير شامل لامتحان إثبات المستوى وامتحان شهادة التعليم المتوسط كأحرار.'
  }
];

export const SECONDARY_LEVELS: LevelInfo[] = [
  {
    id: '1as',
    level: 'secondary',
    name: 'سنة أولى ثانوي',
    badgeNumber: 1,
    scolariumUrl: 'https://scolarium-1as.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-1as.onefd.edu.dz/index.php/welcome',
    subjectsCount: 12,
    branches: ['جذع مشترك علوم وتكنولوجيا', 'جذع مشترك آداب'],
    description: 'المرحلة الثانوية - الجذوع المشتركة: تأسيس علمي وأدبي متين مع بنك الفروض المحلولة عبر معلام 1 ثانوي.'
  },
  {
    id: '2as',
    level: 'secondary',
    name: 'سنة ثانية ثانوي',
    badgeNumber: 2,
    scolariumUrl: 'https://scolarium-2as.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-2as.onefd.edu.dz/index.php/welcome',
    subjectsCount: 13,
    branches: ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد', 'آداب وفلسفة', 'لغات أجنبية'],
    description: 'المرحلة الثانوية - التخصص والشعب: مناهج معمقة ومتابعة مستمرة لجميع التخصصات عبر معلام 2 ثانوي.'
  },
  {
    id: '3as',
    level: 'secondary',
    name: 'سنة ثالثة ثانوي',
    badgeNumber: 3,
    scolariumUrl: 'https://scolarium-3as.onefd.edu.dz/',
    eDevoirUrl: 'https://e-devoir-3as.onefd.edu.dz/index.php/welcome',
    subjectsCount: 14,
    branches: ['شعبة علوم تجريبية (BAC)', 'شعبة رياضيات (BAC)', 'شعبة تقني رياضي (BAC)', 'شعبة تسيير واقتصاد (BAC)', 'شعبة آداب وفلسفة (BAC)', 'شعبة لغات أجنبية (BAC)'],
    description: 'سنة البكالوريا (BAC): تحضير مكثف لامتحان إثبات المستوى وامتحان شهادة البكالوريا الوطني أحرار، عبر معلام 3 ثانوي.'
  }
];

export const DOCUMENT_ACTIONS: DocumentAction[] = [
  {
    id: 'reprint',
    title: 'إعادة طبع الوثائق',
    description: 'استخراج وطباعة استمارة التسجيل الأولية، وصل دفع الرسوم البريدية، ووصل تأكيد التسجيل.',
    iconName: 'check',
    externalUrl: 'https://inscriptic.onefd.edu.dz/reimprime.php',
    requiresId: true
  },
  {
    id: 'registration-number',
    title: 'رقم التسجيل',
    description: 'خدمة استرجاع رقم التسجيل الرسمي للطلبة الذين فقدوا وثائقهم بواسطة الاسم، اللقب، وتاريخ الميلاد.',
    iconName: 'id',
    externalUrl: 'https://inscriptic.onefd.edu.dz/num_ins.php',
    requiresId: false
  },
  {
    id: 'inquiry',
    title: 'أي استفسار',
    description: 'البوابة الرسمية للديوان الوطني للتعليم والتكوين عن بعد للاستفسارات، المساعدة، والتوجيه.',
    iconName: 'help',
    externalUrl: 'https://www.onefd.edu.dz/#',
    requiresId: false
  }
];

export const SAMPLE_EXAMS = [
  {
    id: 'exam-1',
    subject: 'اللغة العربية وآدابها',
    level: '3 ثانوي - علوم تجريبية',
    year: 'دورة إثبات المستوى 2025/2026',
    duration: '3 ساعات',
    hasSolution: true,
    topic: 'النص الشعري التحرري وأثره في الأدب العربي الحديث'
  },
  {
    id: 'exam-2',
    subject: 'العلوم الفيزيائية والتكنولوجيا',
    level: '3 ثانوي - علوم تجريبية',
    year: 'دورة إثبات المستوى 2025/2026',
    duration: '3 ساعات ونصف',
    hasSolution: true,
    topic: 'المتابعة الزمنية لتحول كيميائي وحركة الأقمار الاصطناعية'
  },
  {
    id: 'exam-3',
    subject: 'الرياضيات',
    level: '4 متوسط - شهادة التعليم المتوسط',
    year: 'دورة إثبات المستوى 2025/2026',
    duration: 'ساعتان',
    hasSolution: true,
    topic: 'الأعداد الطبيعية والناطقة، الحساب الشعاعي والهندسة المستوية'
  },
  {
    id: 'exam-4',
    subject: 'علوم الطبيعة والحياة',
    level: '1 ثانوي - علوم وتكنولوجيا',
    year: 'دورة إثبات المستوى 2025/2026',
    duration: 'ساعتان',
    hasSolution: true,
    topic: 'آليات النمو والتجديد الخلوي والتركيب الضوئي'
  }
];

export interface OfficialExamPortal {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge: string;
}

export const OFFICIAL_EXAM_ARCHIVE_PORTALS: OfficialExamPortal[] = [
  {
    id: 'portal-onefd',
    title: 'الموقع الرسمي للديوان الوطني ONEFD',
    subtitle: 'المناشير، رزنامة الامتحانات، وبوابة المتعلم الرسمية',
    url: 'https://www.onefd.edu.dz/',
    badge: 'ONEFD الرسمي',
  },
  {
    id: 'portal-onec',
    title: 'الديوان الوطني للامتحانات والمسابقات ONEC',
    subtitle: 'المواضيع الرسمية لشهادتي التعليم المتوسط BEM والبكالوريا BAC',
    url: 'https://www.onec.dz/',
    badge: 'ONEC الرسمي',
  },
  {
    id: 'portal-scolarium-3as',
    title: 'أرضية المعلام 3 ثانوي (مواضيع وفروض)',
    subtitle: 'أرشيف الفروض والاختبارات الرسمية للسنة الثالثة ثانوي',
    url: 'https://scolarium-3as.onefd.edu.dz/',
    badge: '3 ثانوي BAC',
  },
  {
    id: 'portal-scolarium-2as',
    title: 'أرضية المعلام 2 ثانوي (مواضيع وفروض)',
    subtitle: 'أرشيف الفروض والاختبارات الرسمية للسنة الثانية ثانوي',
    url: 'https://scolarium-2as.onefd.edu.dz/',
    badge: '2 ثانوي',
  },
  {
    id: 'portal-scolarium-1as',
    title: 'أرضية المعلام 1 ثانوي (مواضيع وفروض)',
    subtitle: 'أرشيف الفروض والاختبارات الرسمية للسنة الأولى ثانوي',
    url: 'https://scolarium-1as.onefd.edu.dz/',
    badge: '1 ثانوي',
  },
  {
    id: 'portal-scolarium-moyen',
    title: 'أرضية المعلام المتوسط (1-2-3-4 متوسط)',
    subtitle: 'أرشيف الفروض والاختبارات الرسمية للطور المتوسط وشهادة BEM',
    url: 'https://scolarium-moyen.onefd.edu.dz/',
    badge: 'المتوسط',
  },
];

export interface PastExamArchiveItem {
  id: string;
  subject: string;
  levelCategory: 'middle' | '1as' | '2as' | '3as';
  levelLabel: string;
  session: 'دورة ماي 2025' | 'دورة ماي 2024' | 'دورة ماي 2023' | 'دورة ماي 2022';
  examType: 'امتحان إثبات المستوى' | 'شهادة البكالوريا' | 'شهادة التعليم المتوسط';
  duration: string;
  coefficient: string;
  topic: string;
  axes: string[];
  markingGuidelines: string[];
  officialPortalUrl: string;
}

export const OFFICIAL_PAST_EXAMS: PastExamArchiveItem[] = [
  {
    id: 'past-3as-arabic-2025',
    subject: 'اللغة العربية وآدابها',
    levelCategory: '3as',
    levelLabel: '3 ثانوي - علوم تجريبية وتقنية',
    session: 'دورة ماي 2025',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعتان و 30 د',
    coefficient: 'معامل 3',
    topic: 'البناء الفكري والبناء اللغوي (الشعر الاجتماعي والقضية الفلسطينية + النثر العلمي)',
    axes: [
      'دراسة نص شعري حديث وتحديد النزعة الوطنية والإنسانية',
      'إعراب المفردات وإعراب الجمل التي لها محل من الإعراب',
      'تحديد الصور البيانية (الاستعارة المكنية والكناية) وبلاغتها',
      'وضعية إدماجية نقدية حول التزام الأدباء بقضايا الأمة',
    ],
    markingGuidelines: [
      'البناء الفكري: 10 نقاط (الالتزام باستخراج القرائن النصية والتلخيص)',
      'البناء اللغوي: 06 نقاط (دقة الإعراب وبيان نوع الأسلوب)',
      'التقييم النقدي / الوضعية: 04 نقاط (سلامة اللغة وتوظيف الشواهد)',
    ],
    officialPortalUrl: 'https://scolarium-3as.onefd.edu.dz/',
  },
  {
    id: 'past-3as-physics-2025',
    subject: 'العلوم الفيزيائية',
    levelCategory: '3as',
    levelLabel: '3 ثانوي - علوم تجريبية / رياضيات',
    session: 'دورة ماي 2025',
    examType: 'شهادة البكالوريا',
    duration: '3 ساعات و 30 د',
    coefficient: 'معامل 5 / 6',
    topic: 'المتابعة الزمنية لتحول كيميائي، الظواهر الكهربائية، وميكانيك نيوتن',
    axes: [
      'دراسة تفاعل أكسدة-إرجاع بالمعايرة اللونية وحساب زمن نصف التفاعل',
      'شحن وتفريغ مكثفة في ثنائي القطب RC وإيجاد ثابت الزمن τ',
      'حركة الكواكب والأقمار الاصطناعية وتطبيق قانون كيبلر الثالث',
      'التفاعلات الحمضية القاعدية ومعايرة محلول حمضي',
    ],
    markingGuidelines: [
      'كتابة المعادلة النصفيتين ومعادلة التفاعل الإجمالية بشكل موزون',
      'رسم الدارة الكهربائية مع توضيح جهة التيار والتوترات',
      'كتابة الوحدات الدولية بدقة في كل نتيجة حسابية نهائية',
    ],
    officialPortalUrl: 'https://www.onec.dz/',
  },
  {
    id: 'past-3as-philo-2024',
    subject: 'الفلسفة',
    levelCategory: '3as',
    levelLabel: '3 ثانوي - آداب وفلسفة',
    session: 'دورة ماي 2024',
    examType: 'شهادة البكالوريا',
    duration: '4 ساعات',
    coefficient: 'معامل 6',
    topic: 'المقالة الجدلية والاستقصاء بالوضع وتحليل النص الفلسفي (الشعور واللاشعور / الأخلاق)',
    axes: [
      'الموضوع الأول (جدل): هل الحياة النفسية قائمة على الشعور وحده أم تمتد إلى اللاشعور؟',
      'الموضوع الثاني (استقصاء بالوضع): دافع عن الأطروحة القائلة إن العادة تمنح السلوك مرونة وإبداعاً',
      'الموضوع الثالث (تحليل نص): نص حول العلاقة بين العدالة والمساواة وتفاوت الحقوق',
    ],
    markingGuidelines: [
      'طرح المشكلة: تمهيد وظيفي + إبراز العناد الفلسفي + صياغة السؤال (04 نقاط)',
      'محاولة حل المشكلة: عرض الأطروحة ونقيضها مع الحجج والأمثلة + التركيب (12 نقطة)',
      'حل المشكلة: استنتاج متسق مع التحليل يجيب بوضوح عن الإشكال (04 نقاط)',
    ],
    officialPortalUrl: 'https://www.onec.dz/',
  },
  {
    id: 'past-3as-math-2024',
    subject: 'الرياضيات',
    levelCategory: '3as',
    levelLabel: '3 ثانوي - علوم تجريبية وتسيير',
    session: 'دورة ماي 2024',
    examType: 'امتحان إثبات المستوى',
    duration: '3 ساعات',
    coefficient: 'معامل 5',
    topic: 'المتتاليات العددية، الاحتمالات، والدوال الأسية واللوغاريتمية',
    axes: [
      'إثبات رتابة متتالية بالبرهان بالتراجع وحساب نهايتها',
      'مسألة شاملة في دراسة الدالة الأسية وحساب المساحة بالتكامل',
      'تمارين في الاحتمالات الشرطية والمتغير العشوائي',
    ],
    markingGuidelines: [
      'التأكد من شروط البرهان بالتراجع (التحقق الابتدائي وفرضية التراجع)',
      'حساب النهايات عند أطراف مجموعة التعريف وتعيين المستقيمات المقاربة',
      'تنظيم جدول التغيرات بدقة قبل الرسم البياني للمنحنى',
    ],
    officialPortalUrl: 'https://scolarium-3as.onefd.edu.dz/',
  },
  {
    id: 'past-2as-sciences-2025',
    subject: 'علوم الطبيعة والحياة',
    levelCategory: '2as',
    levelLabel: '2 ثانوي - علوم تجريبية',
    session: 'دورة ماي 2025',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعتان',
    coefficient: 'معامل 6',
    topic: 'آليات التنظيم العصبي والهرموني والانقسام المنصف والتنوع البيولوجي',
    axes: [
      'دور المشبك في نقل السيالة العصبية والمنعكس العضلي',
      'تنظيم التحلون في الدم ودور الأنسولين والغلوكاغون',
      'مراحل الانقسام المنصف والاختلاط بين الصبغي وداخل الصبغي',
    ],
    markingGuidelines: [
      'استغلال الوثائق بمنهجية التحليل، التفسير، والاستنتاج العلمي',
      'دقة المصطلحات العلمية والرسومات التخطيطية الوظيفية',
    ],
    officialPortalUrl: 'https://scolarium-2as.onefd.edu.dz/',
  },
  {
    id: 'past-2as-history-2024',
    subject: 'التاريخ والجغرافيا',
    levelCategory: '2as',
    levelLabel: '2 ثانوي - جميع الشعب',
    session: 'دورة ماي 2024',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعتان',
    coefficient: 'معامل 2 / 4',
    topic: 'الحركة الاستعمارية الأوروبية في الجزائر والمقاومات الشعبية + الموارد الاقتصادية',
    axes: [
      'شرح المصطلحات التاريخية وتحديد التواريخ والشخصيات الوطنية',
      'أسباب ومراحل المقاومة الشعبية المنظمة بقيادة الأمير عبد القادر',
      'تحليل معطيات جغرافية حول الثروات الطاقوية والزراعية في الجزائر',
    ],
    markingGuidelines: [
      'الالتزام بالمنهجية التاريخية (مقدمة، عرض في نقاط واضحة، خاتمة)',
      'توقيع المعالم الجغرافية بدقة في حالة وجود خريطة مرفقة',
    ],
    officialPortalUrl: 'https://scolarium-2as.onefd.edu.dz/',
  },
  {
    id: 'past-1as-math-2025',
    subject: 'الرياضيات',
    levelCategory: '1as',
    levelLabel: '1 ثانوي - جذع مشترك علوم وتكنولوجيا',
    session: 'دورة ماي 2025',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعتان',
    coefficient: 'معامل 5',
    topic: 'المجموعات الأساسية، الدوال المرجعية، والهندسة المستوية والحساب الشعاعي',
    axes: [
      'حل المعادلات والمتراجحات من الدرجة الأولى والثانية جبرياً وبيانياً',
      'دراسة الدالة المربع ودالة المقلوب وتعيين جدول التغيرات',
      'تعيين معادلة مستقيم والتحقق من الارتباط الخطي للأشعة',
    ],
    markingGuidelines: [
      'كتابة مجموعة الحلول باستخدام رموز المجالات بدقة',
      'التعليل الهندسي الكامل في تمرين الأشعة ومعلم المستوي',
    ],
    officialPortalUrl: 'https://scolarium-1as.onefd.edu.dz/',
  },
  {
    id: 'past-1as-english-2023',
    subject: 'اللغة الإنجليزية',
    levelCategory: '1as',
    levelLabel: '1 ثانوي - علوم وتكنولوجيا / آداب',
    session: 'دورة ماي 2023',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعتان',
    coefficient: 'معامل 2 / 3',
    topic: 'Comprehension & Text Exploration (Communication, Environment & Innovation)',
    axes: [
      'أسئلة الفهم والاستيعاب (True/False + أسئلة مباشرة + الضمائر العائدة)',
      'القواعد: Reported Speech, Passive Voice, Conditionals Type 0 & 1',
      'الوضعية الإدماجية: كتابة فقرة أو رسالة قصيرة حول حماية البيئة أو التكنولوجيا',
    ],
    markingGuidelines: [
      'Reading Comprehension: 07 نقاط',
      'Text Exploration: 07 نقاط (تطبيق القواعد وصرف الأفعال وتكوين الكلمات)',
      'Written Expression: 06 نقاط (تنظيم الأفكار وسلامة القواعد والربط)',
    ],
    officialPortalUrl: 'https://scolarium-1as.onefd.edu.dz/',
  },
  {
    id: 'past-bem-math-2025',
    subject: 'الرياضيات',
    levelCategory: 'middle',
    levelLabel: '4 متوسط - شهادة التعليم المتوسط (BEM)',
    session: 'دورة ماي 2025',
    examType: 'شهادة التعليم المتوسط',
    duration: 'ساعتان',
    coefficient: 'معامل 4',
    topic: 'القاسم المشترك الأكبر PGCD، الحساب الحرفي، نظرية طالس وفيثاغورس، والدوال الخطية والتآلفية',
    axes: [
      'حساب PGCD لعددين وكتابة كسر على شكل غير قابل للاختزال',
      'نشر وتبسيط وتحليل عبارة جبرية وحل متراجحة وتمثيل حلولها بيانياً',
      'حساب أطوال وأقياس زوايا باستعمال طالس والنسب المثلثية',
      'مسألة إدماجية لترييض وضعية بالدالة التآلفية والمقارنة بين تسعيرتين',
    ],
    markingGuidelines: [
      'التحقق من خطوات التبسيط والتحليل خطوة بخطوة',
      'ذكر شروط تطبيق خاصية طالس أو فيثاغورس بوضوح (الاستقامية والتوازي / المثلث القائم)',
    ],
    officialPortalUrl: 'https://www.onec.dz/',
  },
  {
    id: 'past-bem-arabic-2024',
    subject: 'اللغة العربية',
    levelCategory: 'middle',
    levelLabel: '4 متوسط - شهادة التعليم المتوسط (BEM)',
    session: 'دورة ماي 2024',
    examType: 'شهادة التعليم المتوسط',
    duration: 'ساعتان',
    coefficient: 'معامل 5',
    topic: 'فهم المقروء، قواعد اللغة (الجملة البسيطة والمركبة، البديل والعطف)، والوضعية الإدماجية',
    axes: [
      'تحديد الفكرة العامة وشرح المفردات واستنباط القيم التربوية والاجتماعية',
      'إعراب المفردات (البدل، التوكيد، التمييز، الممنوع من الصرف) وإعراب الجمل',
      'إنتاج نص حجاجي وتوجيهي حول دور العلم والتكافل في بناء المجتمع',
    ],
    markingGuidelines: [
      'الوضعية الأولى (الفهم والبناء الفكري): 06 نقاط',
      'الوضعية الثانية (البناء اللغوي والفني): 06 نقاط',
      'الوضعية الإدماجية: 08 نقاط (الملاءمة، الانسجام، سلامة اللغة، الإبداع)',
    ],
    officialPortalUrl: 'https://scolarium-moyen.onefd.edu.dz/',
  },
  {
    id: 'past-middle-physics-2023',
    subject: 'العلوم الفيزيائية والتكنولوجيا',
    levelCategory: 'middle',
    levelLabel: '3 و 4 متوسط - إثبات المستوى',
    session: 'دورة ماي 2023',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعة و 30 د',
    coefficient: 'معامل 2',
    topic: 'الظواهر الكهربائية والميكانيكية والمادة وتحولاتها (الشوارد والمعادلات)',
    axes: [
      'التكهرب ونموذج الذرة وتوازن جسم صلب خاضع لقوتين',
      'الأمن الكهربائي: تحديد الأخطاء في مخطط الدارة وتقديم الحلول التقنية',
      'معادلة تفاعل حمض كلور الماء مع معدن وتسمية الشوارد الناتجة',
    ],
    markingGuidelines: [
      'رسم شعاعي القوتين بنفس الطول ومتعاكستين في الاتجاه عند التوازن',
      'كتابة الصيغ الشاردية وموازنة المعادلات الكيميائية بالرموز والحالات الفيزيائية',
    ],
    officialPortalUrl: 'https://scolarium-moyen.onefd.edu.dz/',
  },
  {
    id: 'past-middle-islamic-2022',
    subject: 'التربية الإسلامية والمدنية',
    levelCategory: 'middle',
    levelLabel: '1 و 2 و 3 و 4 متوسط',
    session: 'دورة ماي 2022',
    examType: 'امتحان إثبات المستوى',
    duration: 'ساعة',
    coefficient: 'معامل 1 / 2',
    topic: 'استظهار النصوص الشرعية، العقيدة والأخلاق، ومؤسسات الدولة وحقوق المواطن',
    axes: [
      'إتمام الآيات أو الأحاديث المقررة وضبطها بالشكل التام واستخراج الأحكام',
      'أركان الإيمان والإحسان وبر الوالدين وآداب التواصل في الإسلام',
      'توضيح مهام السلطات الدستورية ودور المجتمع المدني في حماية البيئة',
    ],
    markingGuidelines: [
      'سلامة الآيات والأحاديث من الأخطاء الإملائية',
      'ربط الإجابات بالأمثلة الواقعية والأدلة الشرعية الصحيحة',
    ],
    officialPortalUrl: 'https://scolarium-moyen.onefd.edu.dz/',
  },
];

