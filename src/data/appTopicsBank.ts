import {
  ARABIC_EXTRA,
  CIVIC_EXTRA,
  HISTORY_3AS_EXTRA,
  HISTORY_MIDDLE_EXTRA,
  HISTORY_SEC12_EXTRA,
  ISLAMIC_EXTRA,
  MATH_LIT_EXTRA,
  MATH_MIDDLE_EXTRA,
  MATH_SCI_EXTRA,
  PHILO_EXTRA,
  PHYSICS_MIDDLE_EXTRA,
  PHYSICS_SEC_EXTRA,
  SCIENCES_EXTRA,
} from './quizQuestionsCore';
import {
  ACCOUNTING_EXTRA,
  CIVIL_ENG_EXTRA,
  ECONOMICS_EXTRA,
  ELEC_ENG_EXTRA,
  ENGLISH_EXTRA,
  FRENCH_EXTRA,
  GERMAN_EXTRA,
  ITALIAN_EXTRA,
  LAW_EXTRA,
  MECH_ENG_EXTRA,
  PROCESS_ENG_EXTRA,
  SPANISH_EXTRA,
  TECH_ENG_EXTRA,
} from './quizQuestionsLangTech';
import { EXTRA_SUBJECT_EXERCISES } from './extraTopicsExercises';
import { ONEFD_SUBJECT_BONUS_QUESTIONS } from './onefdCorrespondenceBank';

export type TopicLevelId = '1am' | '2am' | '3am' | '4am' | '1as' | '2as' | '3as';

export interface TopicStreamOption {
  id: string;
  label: string;
  shortHeaderLabel: string;
}

export interface TopicLevelDefinition {
  id: TopicLevelId;
  cardLabel: string;
  shortTitle: string;
  fullLabel: string;
  stage: 'middle' | 'secondary';
  streams: TopicStreamOption[];
}

export const TOPIC_LEVEL_DEFINITIONS: TopicLevelDefinition[] = [
  {
    id: '1am',
    cardLabel: 'سنة أولى متوسط',
    shortTitle: 'أولى متوسط',
    fullLabel: 'السنة أولى متوسط',
    stage: 'middle',
    streams: [{ id: 'general', label: '', shortHeaderLabel: '' }],
  },
  {
    id: '2am',
    cardLabel: 'سنة ثانية متوسط',
    shortTitle: 'ثانية متوسط',
    fullLabel: 'السنة ثانية متوسط',
    stage: 'middle',
    streams: [{ id: 'general', label: '', shortHeaderLabel: '' }],
  },
  {
    id: '3am',
    cardLabel: 'سنة ثالثة متوسط',
    shortTitle: 'ثالثة متوسط',
    fullLabel: 'السنة ثالثة متوسط',
    stage: 'middle',
    streams: [{ id: 'general', label: '', shortHeaderLabel: '' }],
  },
  {
    id: '4am',
    cardLabel: 'سنة رابعة متوسط',
    shortTitle: 'رابعة متوسط',
    fullLabel: 'السنة رابعة متوسط',
    stage: 'middle',
    streams: [{ id: 'general', label: '', shortHeaderLabel: '' }],
  },
  {
    id: '1as',
    cardLabel: 'سنة أولى ثانوي',
    shortTitle: 'أولى ثانوي',
    fullLabel: 'السنة أولى ثانوي',
    stage: 'secondary',
    streams: [
      { id: 'sci', label: 'شعبة علوم', shortHeaderLabel: 'علوم وتكنولوجيا' },
      { id: 'lit', label: 'شعبة آداب', shortHeaderLabel: 'آداب' },
    ],
  },
  {
    id: '2as',
    cardLabel: 'سنة ثانية ثانوي',
    shortTitle: 'ثانية ثانوي',
    fullLabel: 'السنة ثانية ثانوي',
    stage: 'secondary',
    streams: [
      { id: 'sci', label: 'شعبة علوم', shortHeaderLabel: 'علوم' },
      { id: 'philo', label: 'شعبة آداب', shortHeaderLabel: 'آداب' },
      { id: 'lang', label: 'شعبة لغات أجنبية', shortHeaderLabel: 'لغات أجنبية' },
      { id: 'tech', label: 'شعبة تقني رياضي', shortHeaderLabel: 'تقني رياضي' },
      { id: 'math', label: 'شعبة رياضيات', shortHeaderLabel: 'رياضيات' },
      { id: 'gest', label: 'شعبة تسيير وإقتصاد', shortHeaderLabel: 'تسيير وإقتصاد' },
    ],
  },
  {
    id: '3as',
    cardLabel: 'سنة ثالثة ثانوي',
    shortTitle: 'ثالثة ثانوي',
    fullLabel: 'السنة ثالثة ثانوي',
    stage: 'secondary',
    streams: [
      { id: 'sci', label: 'شعبة علوم', shortHeaderLabel: 'علوم' },
      { id: 'philo', label: 'شعبة آداب', shortHeaderLabel: 'آداب' },
      { id: 'lang', label: 'شعبة لغات أجنبية', shortHeaderLabel: 'لغات أجنبية' },
      { id: 'tech', label: 'شعبة تقني رياضي', shortHeaderLabel: 'تقني رياضي' },
      { id: 'math', label: 'شعبة رياضيات', shortHeaderLabel: 'رياضيات' },
      { id: 'gest', label: 'شعبة تسيير وإقتصاد', shortHeaderLabel: 'تسيير وإقتصاد' },
    ],
  },
];

export interface PracticeExercise {
  title: string;
  pointsLabel: string;
  tasks: string[];
  solutionSteps: string[];
}

export interface RealQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AppSubjectTopic {
  id: string;
  subjectKey: string;
  subjectName: string;
  buttonLabel: string;
  levelId: TopicLevelId;
  streamId: string;
  focusSummary: string;
  exercises: PracticeExercise[];
  quizQuestions: RealQuizQuestion[];
}

interface SubjectDataBuilder {
  key: string;
  name: string;
  buttonLabel: string;
  buildSummary: (level: TopicLevelId, streamId: string) => string;
  buildExercises: (level: TopicLevelId, streamId: string) => PracticeExercise[];
  buildQuiz: (level: TopicLevelId, streamId: string) => RealQuizQuestion[];
}

const SUBJECT_BANK: SubjectDataBuilder[] = [
  {
    key: 'history',
    name: 'التاريخ والجغرافيا',
    buttonLabel: 'مادة التاريخ والجغرافيا',
    buildSummary: (level) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return level === '4am'
          ? 'الحركة الوطنية الجزائرية، الثورة التحريرية 1954-1962، والإقليم والموارد في الجزائر'
          : 'التحولات التاريخية الكبرى، الخرائط الجغرافية، والموارد الطبيعية والبشرية';
      }
      if (level === '1as') return 'العالم الإسلامي في العهد العثماني + المجالات الجغرافية الكبرى';
      if (level === '2as') return 'الاستعمار الأوروبي والمقاومات الشعبية + السكان والتنمية في العالم';
      return 'العالم بين القطبين 1945-1989 + الثورة التحريرية الكبرى + القوى الاقتصادية العالمية';
    },
    buildExercises: (level) => {
      const is3AS = level === '3as';
      const isMiddle = ['1am', '2am', '3am', '4am'].includes(level);
      return [
        {
          title: 'الموضوع التطبيقي الأول: التاريخ',
          pointsLabel: '10 نقاط',
          tasks: is3AS
            ? [
                '1- اشرح المصطلحات التالية: الحرب الباردة، سياسة الاحتواء، هجومات الشمال القسنطيني 20 أوت 1955.',
                '2- أكمل التواريخ المعلمية: 08 ماي 1945 · 23 مارس 1954 · 20 أوت 1956 · 19 مارس 1962.',
                '3- بيّن الظروف الدولية والإقليمية التي ساعدت على تدويل القضية الجزائرية.',
              ]
            : isMiddle
            ? [
                '1- اذكر دوافع وأسباب اندلاع ثورة الفاتح نوفمبر 1954 في الجزائر.',
                '2- عرّف الشخصيات والتواريخ: الأمير عبد القادر، 05 جويلية 1830، مؤتمر الصومام 1956.',
                '3- حدّد نتائج معركة سطاوالي وموقف الشعب الجزائري من الاستعمار.',
              ]
            : [
                '1- بيّن أسباب التنافس الاستعماري الأوروبي على العالم الإسلامي وشمال إفريقيا في القرن 19.',
                '2- قارن بين المقاومة المسلحة الشعبية والمقاومة السياسية من حيث الوسائل والأهداف.',
              ],
          solutionSteps: is3AS
            ? [
                'الحرب الباردة: صراع إيديولوجي بين المعسكر الشرقي والغربي دون مواجهة عسكرية مباشرة (1947-1989).',
                '08 ماي 1945: مجازر الاستعمار الفرنسي · 23 مارس 1954: تأسيس اللجنة الثورية للوحدة والعمل · 20 أوت 1956: مؤتمر الصومام · 19 مارس 1962: وقف إطلاق النار.',
              ]
            : [
                'انطلقت الثورة لتحرير البلاد واسترجاع السيادة الوطنية وتوحيد الشعب حول جبهة التحرير.',
                'مؤتمر الصومام 20 أوت 1956 نظّم الثورة هيكلياً وعسكرياً وقسّم التراب الوطني إلى ست ولايات.',
              ],
        },
        {
          title: 'الموضوع التطبيقي الثاني: الجغرافيا',
          pointsLabel: '10 نقاط',
          tasks: [
            is3AS
              ? '1- حدّد مفهوم التنمية الاقتصادية ومؤشر التنمية البشرية IDH مع ذكر عناصره الثلاثة.'
              : '1- اذكر خصائص التضاريس والمناخ في الجزائر وتأثيرهما على توزع السكان.',
            '2- اشرح التباين في الكثافة السكانية بين الشريط الساحلي والجنوب، واقترح حلولاً لتحقيق التوازن الجهوي.',
          ],
          solutionSteps: [
            'عناصر IDH الثلاثة: الدخل الفردي، المستوى التعليمي، وأمد الحياة.',
            'يرجع تركز السكان بالشمال إلى اعتدال المناخ، توفر الأراضي الخصبة، والنشاط الاقتصادي، ويعالج التباين بالاستثمار في الهضاب والجنوب.',
          ],
        },
      ];
    },
    buildQuiz: (level) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return [
          {
            id: 'hist-m-1',
            prompt: 'في أي تاريخ انعقد مؤتمر الصومام الذي أعاد هيكلة الثورة التحريرية وقسّم الجزائر إلى 6 ولايات تاريخية؟',
            options: ['20 أوت 1955', '20 أوت 1956', '01 نوفمبر 1954', '19 مارس 1962'],
            correctIndex: 1,
            explanation: 'انعقد مؤتمر الصومام يوم 20 أوت 1956 في وادي الصومام بالولاية الثالثة التاريخية، وأرسى مبدأ أولوية الداخل والسياسي على العسكري.',
          },
          {
            id: 'hist-m-2',
            prompt: 'ما هو اليوم الوطني الذي يُعرف في الذاكرة الجزائرية بذكرى مجازر قسنطينة وسطيف وخراطة؟',
            options: ['08 ماي 1945', '05 جويلية 1830', '17 أكتوبر 1961', '11 ديسمبر 1960'],
            correctIndex: 0,
            explanation: 'وقعت مجازر 08 ماي 1945 عقب خروج الجزائريين في مسيرات سلمية للمطالبة بالاستقلال، وكانت نقطة تحول نحو الكفاح المسلح.',
          },
          {
            id: 'hist-m-3',
            prompt: 'ما هي السلسلة الجبلية التي تفصل بين إقليم التل وإقليم الهضاب العليا في الجزائر؟',
            options: ['الأطلس الصحراوي', 'الأطلس التلي', 'سلسلة الهقار', 'الطاسيلي ناجر'],
            correctIndex: 1,
            explanation: 'يمتد الأطلس التلي شمالاً بمحاذاة الساحل، بينما يمتد الأطلس الصحراوي جنوب الهضاب العليا.',
          },
          {
            id: 'hist-m-4',
            prompt: 'في أي سنة دخلت الجزائر مرحلة التفاوض الرسمي الأول في اتفاقيات إيفيان الأولى؟',
            options: ['1958', '1960', '1961', '1962'],
            correctIndex: 2,
            explanation: 'بدأت مفاوضات إيفيان الأولى في ماي 1961 وتوّجت باتفاقيات إيفيان الثانية في 18 مارس 1962.',
          },
          ...HISTORY_MIDDLE_EXTRA,
        ];
      }
      if (level === '1as' || level === '2as') {
        return [
          {
            id: 'hist-sec12-1',
            prompt: 'أي تنظيم سياسي أسّسه مصالي الحاج سنة 1926 في باريس للمطالبة باستقلال شمال إفريقيا؟',
            options: ['حركة انتصار الحريات الديمقراطية', 'جمعية العلماء المسلمين', 'نجم شمال إفريقيا', 'الاتحاد الديمقراطي للبيان'],
            correctIndex: 2,
            explanation: 'تأسس نجم شمال إفريقيا في جوان 1926 وكان أول حزب يطالب صراحة باستقلال الجزائر.',
          },
          {
            id: 'hist-sec12-2',
            prompt: 'من قائد المقاومة الشعبية المنظمة في الشرق الجزائري (قسنطينة) بين سنتي 1830 و 1848؟',
            options: ['أحمد باي', 'المقراني', 'الشيخ بوعمامة', 'لالا فاطمة نسومر'],
            correctIndex: 0,
            explanation: 'قاد الحاج أحمد باي مقاومة الشرق الجزائري ودافع عن قسنطينة ببسالة في معركة 1836 و 1837.',
          },
          {
            id: 'hist-sec12-3',
            prompt: 'أي عامل رئيسي أدى إلى الانفجار الديموغرافي في الدول النامية بعد سنة 1950؟',
            options: ['هجرة الأدمغة', 'تحسن الرعاية الصحية وتراجع الوفيات', 'تراجع الزراعة', 'ارتفاع سن الزواج'],
            correctIndex: 1,
            explanation: 'تحسن الخدمات الطبية وتوفر اللقاحات أدى إلى انخفاض معدل الوفيات مع استمرار ارتفاع الولادات.',
          },
          {
            id: 'hist-sec12-4',
            prompt: 'ماذا يُقصد بالبيان الجزائري المؤرخ في 10 فيفري 1943؟',
            options: ['إعلان الحرب العالمية', 'وثيقة وطنية تطالب بحق تقرير المصير وإلغاء الاستعمار', 'قانون التجنيد الإجباري', 'اتفاقية وقف القتال'],
            correctIndex: 1,
            explanation: 'صاغه فرحات عباس بمشاركة مختلف التيارات الوطنية ليقدم للحلفاء وفرنسا مطالب الشعب الجزائري.',
          },
          ...HISTORY_SEC12_EXTRA,
        ];
      }
      return [
        {
          id: 'hist-3as-1',
          prompt: 'في أي تاريخ أعلن الرئيس الأمريكي ترومان مبدأه الشهير لاحتواء المد الشيوعي؟',
          options: ['05 جوان 1947', '12 مارس 1947', '04 أفريل 1949', '14 ماي 1955'],
          correctIndex: 1,
          explanation: 'أُعلن مبدأ ترومان يوم 12 مارس 1947 بتقديم مساعدات مالية وعسكرية لتركيا واليونان، تلاه مشروع مارشال في 05 جوان 1947.',
        },
        {
          id: 'hist-3as-2',
          prompt: 'ما اسم العملية العسكرية التي قادها زيغود يوسف في 20 أوت 1955 لفك الحصار عن الأوراس؟',
          options: ['العملية الشاملة', 'هجومات الشمال القسنطيني', 'معركة الجزائر', 'معركة الجرف'],
          correctIndex: 1,
          explanation: 'نفّذ المجاهدون هجومات الشمال القسنطيني يوم 20 أوت 1955 فأكّدوا شمولية الثورة ونجحوا في تدويل القضية بالأمم المتحدة.',
        },
        {
          id: 'hist-3as-3',
          prompt: 'متى تم تأسيس منظمة الدول المصدرة للنفط (أوبك OPEC) ببغداد؟',
          options: ['10-14 سبتمبر 1960', '24 أكتوبر 1945', '18 أفريل 1955', '25 مارس 1957'],
          correctIndex: 0,
          explanation: 'تأسست منظمة أوبك في 10–14 سبتمبر 1960 للدفاع عن مصالح الدول المنتجة والمصدرة للبترول ومواجهة احتكار الشركات.',
        },
        {
          id: 'hist-3as-4',
          prompt: 'أي تكتل اقتصادي أوروبي أُنشئ بموجب معاهدة روما في 25 مارس 1957؟',
          options: ['حلف وارسو', 'السوق الأوروبية المشتركة (المجموعة الاقتصادية الأوروبية)', 'منظمة الألينا', 'مجموعة البريكس'],
          correctIndex: 1,
          explanation: 'وقّعت 6 دول أوروبية معاهدة روما لتأسيس السوق الأوروبية المشتركة التي تطورت لاحقاً إلى الاتحاد الأوروبي.',
        },
        ...HISTORY_3AS_EXTRA,
      ];
    },
  },
  {
    key: 'math',
    name: 'الرياضيات',
    buttonLabel: 'مادة الرياضيات',
    buildSummary: (level, streamId) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return 'القاسم المشترك الأكبر، النشر والتحليل، المعادلات، فيثاغورس وطالس، والدوال الخطية والتآلفية';
      }
      if (level === '1as') return 'المجالات والقيمة المطلقة + الدوال المرجعية + الأشعة ومعادلة مستقيم';
      if (level === '2as') {
        return streamId === 'philo' || streamId === 'lang'
          ? 'النسب المئوية والمتتاليات العددية + الإحصاء والاحتمالات'
          : 'الزوايا الموجهة وحساب المثلثات + النهايات والاشتقاق واتجاه تغير دالة';
      }
      if (streamId === 'philo' || streamId === 'lang') {
        return 'الموافقات في Z + المتتاليات الحسابية والهندسية + الدوال كثيرات الحدود';
      }
      return 'المتتاليات العددية + الاحتمالات + الأعداد المركبة + الدالة الأسية واللوغاريتمية والتكامل';
    },
    buildExercises: (level, streamId) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return [
          {
            title: 'التمرين الأول: الحساب العددي والحرفي',
            pointsLabel: '08 نقاط',
            tasks: [
              '1- احسب القاسم المشترك الأكبر PGCD(420, 252) باستعمال خوارزمية إقليدس، ثم اختزل الكسر 252/420.',
              '2- لتكن العبارة E = (3x - 2)² - 25. انشر ثم بسّط العبارة E، ثم حلّلها إلى جداء عاملين.',
              '3- حل المعادلة: (3x + 3)(3x - 7) = 0.',
            ],
            solutionSteps: [
              '420 = 252 × 1 + 168 · 252 = 168 × 1 + 84 · 168 = 84 × 2 + 0 => PGCD = 84، والكسر المختزل هو 3/5.',
              'النشر: E = 9x² - 12x + 4 - 25 = 9x² - 12x - 21.',
              'التحليل: E = (3x - 2 - 5)(3x - 2 + 5) = (3x - 7)(3x + 3) => الحلول x = 7/3 أو x = -1.',
            ],
          },
          {
            title: 'التمرين الثاني: الهندسة والدوال',
            pointsLabel: '12 نقطة',
            tasks: [
              '1- ABC مثلث قائم في A حيث AB = 6 cm و AC = 8 cm. احسب الطول BC واحسب cos(B).',
              '2- عيّن العبارة الجبرية للدالة التآلفية f بحيث f(0) = 3 و f(2) = 7.',
            ],
            solutionSteps: [
              'حسب فيثاغورس: BC² = 6² + 8² = 100 => BC = 10 cm، و cos(B) = AB/BC = 0.6.',
              'معامل التوجيه a = (7 - 3)/(2 - 0) = 2 و b = f(0) = 3، إذن f(x) = 2x + 3.',
            ],
          },
        ];
      }
      if (level === '2as' && ['sci', 'math', 'tech'].includes(streamId)) {
        return [
          {
            title: 'التمرين الأول: الزوايا الموجهة وحساب المثلثات',
            pointsLabel: '10 نقاط',
            tasks: [
              '1- أوجد القيس الرئيسي للزاويتين الموجهتين (2024π / 3) و (2020π / 6).',
              '2- أثبت صحة المساواة: sin(5π/2 + x) - 2cos(21π/2 - x) - 3sin(x - 3π) + sin(3π/2 + x) = sin x.',
              '3- حل في المجال [0 ; 2π] المعادلة: 2cos²(x) = 3sin(x).',
            ],
            solutionSteps: [
              'القيس الرئيسي لـ 2024π/3 هو 2π/3 ولـ 2020π/6 هو 2π/3 (لأن 2024 = 337×6 + 2، نطرح مضاعفات 2π).',
              'بالتبسيط المثلثي: cos(x) - 2sin(x) + 3sin(x) - cos(x) = sin(x).',
              'نعوّض cos²x = 1 - sin²x فنجد 2sin²x + 3sinx - 2 = 0 ومنه sin x = 1/2 => x ∈ {π/6 , 5π/6}.',
            ],
          },
          {
            title: 'التمرين الثاني: النهايات والاشتقاق',
            pointsLabel: '10 نقاط',
            tasks: [
              'لتكن f(x) = (x² - 3x + 3) / (x - 1) على R - {1}.',
              '1- احسب النهايات عند ±∞ وعند 1 بقيم كبرى وصغرى وفسر النتيجة بيانياً.',
              "2- بيّن أن f'(x) = (x² - 2x)/(x - 1)² ثم استنتج اتجاه تغير الدالة f.",
            ],
            solutionSteps: [
              'عند +∞ الناتج +∞ وعند -∞ الناتج -∞؛ وعند 1⁻ الناتج -∞ وعند 1⁺ الناتج +∞، إذن x = 1 مقارب عمودي.',
              "المشتقة تنعدم عند 0 و 2؛ الدالة متزايدة على ]-∞ ; 0] ∪ [2 ; +∞[ ومتناقصة على [0 ; 1[ ∪ ]1 ; 2].",
            ],
          },
        ];
      }
      return [
        {
          title: 'التمرين التطبيقي الشامل: المتتاليات والدوال',
          pointsLabel: '20 نقطة',
          tasks: [
            streamId === 'philo' || streamId === 'lang'
              ? '1- عيّن باقي القسمة الإقليدية للعدد 2026 على 5 ثم باقي قسمة 2026^4 على 5.'
              : '1- نعتبر المتتالية (Un) المعرفة بـ U0 = 1 و Un+1 = (2/3)Un + 2. برهن بالتراجع أن Un < 6.',
            streamId === 'philo' || streamId === 'lang'
              ? '2- متتالية حسابية حدها الأول U0 = 2 وأساسها r = 4. احسب U10 ومجموع الـ 11 حداً الأولى.'
              : '2- لتكن Vn = Un - 6. أثبت أن (Vn) متتالية هندسية يطلب أساسها وحسب نهايتها.',
          ],
          solutionSteps: [
            streamId === 'philo' || streamId === 'lang'
              ? '2026 ≡ 1 [5] ومنه 2026^4 ≡ 1^4 ≡ 1 [5]؛ أما U10 = 2 + 40 = 42 والمجموع S = (11/2)(2+42) = 242.'
              : 'Vn+1 = (2/3)Un + 2 - 6 = (2/3)(Un - 6) = (2/3)Vn هندسية أساسها 2/3، ومنه lim Un = 6.',
          ],
        },
      ];
    },
    buildQuiz: (level, streamId) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return [
          {
            id: 'math-m-1',
            prompt: 'ما هو القاسم المشترك الأكبر للعددين 60 و 48 — PGCD(60, 48)؟',
            options: ['6', '12', '15', '24'],
            correctIndex: 1,
            explanation: '60 = 48 × 1 + 12 ثم 48 = 12 × 4 + 0؛ آخر باقٍ غير معدوم هو 12.',
          },
          {
            id: 'math-m-2',
            prompt: 'ما هو تحليل العبارة الجبرية E = x² - 9 إلى جداء عاملين؟',
            options: ['(x - 3)²', '(x + 3)²', '(x - 3)(x + 3)', '(x - 9)(x + 1)'],
            correctIndex: 2,
            explanation: 'نطبق المتطابقة الشهيرة الثالثة: a² - b² = (a - b)(a + b)، أي (x - 3)(x + 3).',
          },
          {
            id: 'math-m-3',
            prompt: 'في مثلث ABC قائم في A، إذا كان AB = 3 cm و AC = 4 cm، فكم يساوي طول الوتر BC؟',
            options: ['5 cm', '6 cm', '7 cm', '12 cm'],
            correctIndex: 0,
            explanation: 'حسب خاصية فيثاغورس: BC² = AB² + AC² = 9 + 16 = 25 ومنه BC = √25 = 5 cm.',
          },
          {
            id: 'math-m-4',
            prompt: 'إذا كانت الدالة الخطية f(x) = 3x، فما هي صورة العدد (-2)؟',
            options: ['6', '-6', '1', '-5'],
            correctIndex: 1,
            explanation: 'نعوض x بـ (-2): f(-2) = 3 × (-2) = -6.',
          },
          ...MATH_MIDDLE_EXTRA,
        ];
      }
      if (streamId === 'philo' || streamId === 'lang') {
        return [
          {
            id: 'math-lit-1',
            prompt: 'ما هو باقي القسمة الإقليدية للعدد 2026 على 5؟',
            options: ['0', '1', '2', '4'],
            correctIndex: 1,
            explanation: '2026 = 5 × 405 + 1، إذن الباقي هو 1، ومنه 2026 ≡ 1 [5].',
          },
          {
            id: 'math-lit-2',
            prompt: 'متتالية حسابية (Un) حدها الأول U0 = 5 وأساسها r = 3. كم تساوي قيمة U4؟',
            options: ['14', '17', '20', '15'],
            correctIndex: 1,
            explanation: 'U4 = U0 + 4r = 5 + 4×3 = 17.',
          },
          {
            id: 'math-lit-3',
            prompt: 'ما هي الدالة المشتقة للدالة f(x) = x³ - 6x + 4 على R؟',
            options: ["f'(x) = 3x² - 6", "f'(x) = x² - 6", "f'(x) = 3x - 6", "f'(x) = 3x² + 4"],
            correctIndex: 0,
            explanation: 'مشتقة x³ هي 3x²، ومشتقة -6x هي -6، ومشتقة الثابت 4 هي 0.',
          },
          {
            id: 'math-lit-4',
            prompt: 'ما هو عدد حدود المجموع S = U0 + U1 + ... + U10؟',
            options: ['10 حدود', '11 حداً', '9 حدود', '12 حداً'],
            correctIndex: 1,
            explanation: 'عدد الحدود يساوي (دليل الأخير - دليل الأول + 1) = 10 - 0 + 1 = 11 حداً.',
          },
          ...MATH_LIT_EXTRA,
        ];
      }
      return [
        {
          id: 'math-s-1',
          prompt: 'في الأعداد المركبة C، ما هي القيمة الدقيقة لطويلة العدد المركب z = 3 + 4i؟',
          options: ['7', '5', '25', '√7'],
          correctIndex: 1,
          explanation: '|z| = √(3² + 4²) = √(9 + 16) = √25 = 5.',
        },
        {
          id: 'math-s-2',
          prompt: 'ما هي قيمة النهاية الشهيرة: lim (e^x - 1) / x لما يؤول x إلى 0؟',
          options: ['0', '+∞', '1', 'e'],
          correctIndex: 2,
          explanation: 'هي مشتقة الدالة الأسية عند الصفر وتساوي e^0 = 1.',
        },
        {
          id: 'math-s-3',
          prompt: 'أي علاقة صحيحة بالنسبة للمتتالية الهندسية (Vn) التي حدها الأول V0 وأساسها q؟',
          options: ['Vn = V0 + nq', 'Vn = V0 × q^n', 'Vn = q × V0^n', 'Vn = V0 / q^n'],
          correctIndex: 1,
          explanation: 'الحد العام لمتتالية هندسية انطلاقاً من V0 يُعطى بالعلاقة Vn = V0 × q^n.',
        },
        {
          id: 'math-s-4',
          prompt: 'ما هي مجموعة حلول المعادلة ln(x - 1) = 0 في المجال ]1 ; +∞[؟',
          options: ['{1}', '{2}', '{e}', '{0}'],
          correctIndex: 1,
          explanation: 'ln(x - 1) = 0 يكافئ x - 1 = e^0 = 1 ومنه x = 2.',
        },
        ...MATH_SCI_EXTRA,
      ];
    },
  },
  {
    key: 'arabic',
    name: 'اللغة العربية',
    buttonLabel: 'مادة اللغة العربية',
    buildSummary: (level) => {
      if (['1am', '2am', '3am', '4am'].includes(level)) {
        return 'البناء الفكري، الإعراب (مفردات وجمل)، الصور البيانية، والوضعية الإدماجية';
      }
      if (level === '1as') return 'الشعر الجاهلي وصدر الإسلام + قواعد النحو والبلاغة';
      if (level === '2as') return 'الأدب العباسي والأندلسي + الحجاج والنقد الأدبي';
      return 'أدب المنفى والالتزام، المقال، الرمز، والإعراب التطبيقي';
    },
    buildExercises: (level) => {
      const isMiddle = ['1am', '2am', '3am', '4am'].includes(level);
      return [
        {
          title: 'الموضوع التطبيقي: نص أدبي وبناء لغوي',
          pointsLabel: '20 نقطة',
          tasks: [
            'النص السند: «إن العلم والعمل ركيزتان تبنى بهما الأوطان، فالمجتهد الذي يصبر على طلب المعرفة يحصد ثمار النجاح...»',
            '1- استخرج الفكرة العامة للسند واذكر أثرين للعلم في بناء المجتمع.',
            '2- أعرب ما يلي إعراباً تاماً: (ركيزتان) في الجملة الأولى، و(يصبرُ) في الجملة الثانية.',
            isMiddle
              ? '3- حدّد نوع الصورة البيانية في عبارة «يحصد ثمار النجاح» واشرحها.'
              : '3- بيّن المحل الإعرابي لجملة (تبنى بهما الأوطان) وجملة (يصبر على طلب المعرفة).',
          ],
          solutionSteps: [
            'ركيزتان: خبر إنّ مرفوع وعلامة رفعه الألف لأنه مثنى · يصبرُ: فعل مضارع مرفوع وعلامة رفعه الضمة الظاهرة.',
            isMiddle
              ? 'الصورة البيانية: استعارة مكنية، شبّه النجاح بشجرة تُحصد ثمارها، وذكر اللازم (يحصد، ثمار).'
              : '(تبنى بهما الأوطان): جملة فعلية في محل رفع نعت لـ ركيزتان · (يصبر...): جملة صلة الموصول لا محل لها من الإعراب.',
          ],
        },
      ];
    },
    buildQuiz: (level) => {
      const isMiddle = ['1am', '2am', '3am', '4am'].includes(level);
      return [
        {
          id: 'ar-q-1',
          prompt: 'ما المحل الإعرابي للجملة الواقعة بعد الاسم الموصول مباشرة (مثل: الذي يجتهدُ)؟',
          options: ['في محل جر مضاف إليه', 'لا محل لها من الإعراب لأنها صلة الموصول', 'في محل نصب حال', 'في محل رفع خبر'],
          correctIndex: 1,
          explanation: 'جملة صلة الموصول تُعدّ من الجمل التي لا محل لها من الإعراب دائماً في النحو العربي.',
        },
        {
          id: 'ar-q-2',
          prompt: 'في قولنا: «ابتسمَ الصباحُ في وجوه المتعلمين»، ما نوع الصورة البيانية؟',
          options: ['تشبيه بليغ', 'جناس تام', 'استعارة مكنية', 'طباق إيجاب'],
          correctIndex: 2,
          explanation: 'شُبّه الصباح بالإنسان، وحُذف المشبه به (الإنسان) وتُركت قرينة دالة عليه وهي (ابتسمَ)، فهي استعارة مكنية.',
        },
        {
          id: 'ar-q-3',
          prompt: isMiddle
            ? 'أي كلمة مما يلي تُعرب مفعولاً لأجله منصوباً في جملة: «نجتهدُ رغبةً في التفوق»؟'
            : 'إلى أي مدرسة أدبية ينتمي كل من محمود سامي البارودي وأحمد شوقي؟',
          options: isMiddle
            ? ['نجتهدُ', 'رغبةً', 'في', 'التفوق']
            : ['المدرسة الرومانسية', 'مدرسة الإحياء والبعث (الكلاسيكية)', 'الشعر الحر', 'المدرسة الرمزية'],
          correctIndex: 1,
          explanation: isMiddle
            ? '«رغبةً» مصدر قلبي منصوب يبيّن سبب وقوع الفعل، ويُجيب عن سؤال: لماذا نجتهد؟'
            : 'أحيا رواد الإحياء والبعث (البارودي وشوقي وحافظ إبراهيم) القصيدة العربية العمودية بأسلوبها الرصين.',
        },
        {
          id: 'ar-q-4',
          prompt: 'ما علاقة التضاد بين لفظي «العلم» و«الجهل» في علم البديع؟',
          options: ['سجع', 'مقابلة', 'طباق إيجاب', 'تضمين'],
          correctIndex: 2,
          explanation: 'الجمع بين اللفظ وضده مباشرة (دون أداة نفي) يسمى طباق إيجاب ويزيد المعنى وضوحاً وتأكيداً.',
        },
        ...ARABIC_EXTRA,
      ];
    },
  },
  {
    key: 'physics',
    name: 'العلوم الفيزيائية',
    buttonLabel: 'مادة العلوم الفيزيائية',
    buildSummary: (level) =>
      ['1am', '2am', '3am', '4am'].includes(level)
        ? 'الدارات الكهربائية، التكهرب، القوى وتوازن جسم صلب، والمحاليل الشاردية'
        : 'بنية المادة، جدول تقدم التفاعل، المعايرة، RC و RL وميكانيك نيوتن',
    buildExercises: (level) => {
      const isMiddle = ['1am', '2am', '3am', '4am'].includes(level);
      return [
        {
          title: isMiddle ? 'التمرين الأول: المحاليل والكهرباء' : 'التمرين الأول: الكيمياء والميكانيك',
          pointsLabel: '20 نقطة',
          tasks: isMiddle
            ? [
                '1- نغمر صفيحة حديد Fe في محلول كبريتات النحاس (Cu²⁺ + SO4²⁻). صِف الملاحظات واكتب المعادلة الشاردية.',
                '2- جسم صلب كتلته m = 500 g في حالة سكون فوق طاولة أفقية (g = 10 N/kg). احسب ثقله P ومثّل القوتين المؤثرتين.',
              ]
            : [
                '1- نعاير حجماً Vb = 20 mL من محلول هيدروكسيد الصوديوم بواسطة حمض كلور الماء تركيزه Ca = 0.1 mol/L. عند التكافؤ VaE = 15 mL. احسب Cb.',
                '2- دارة RC تضم مكثفة سعتها C = 100 µF ومقاومة R = 200 Ω. احسب ثابت الزمن τ.',
              ],
          solutionSteps: isMiddle
            ? [
                'يتشكل راسب أحمر من النحاس ويزول اللون الأزرق: Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s).',
                'P = m × g = 0.5 kg × 10 = 5 N؛ يخضع الجسم لقوة ثقله نحو الأسفل ورد فعل الطاولة نحو الأعلى متساويين في الشدة ومتعاكسين في الاتجاه.',
              ]
            : [
                'عند التكافؤ: Ca × VaE = Cb × Vb => Cb = (0.1 × 15) / 20 = 0.075 mol/L.',
                'ثابت الزمن: τ = R × C = 200 × 100×10⁻⁶ = 0.02 s = 20 ms.',
              ],
        },
      ];
    },
    buildQuiz: (level) => {
      const isMiddle = ['1am', '2am', '3am', '4am'].includes(level);
      return [
        {
          id: 'phys-1',
          prompt: isMiddle
            ? 'ما وحدة قياس شدة القوة في النظام الدولي للوحدات SI؟'
            : 'ما هي عبارة ثابت الزمن τ لدارة كهربائية ثنائية القطب RC؟',
          options: isMiddle
            ? ['الجول (J)', 'النيوتن (N)', 'الواط (W)', 'الباسكال (Pa)']
            : ['τ = R / C', 'τ = R × C', 'τ = L × R', 'τ = √(LC)'],
          correctIndex: 1,
          explanation: isMiddle
            ? 'تُقاس القوة بوحدة النيوتن (N) باستعمال جهاز الدينامومتر (الربيعة).'
            : 'ثابت الزمن لدارة RC هو τ = R × C ويقاس بالثانية (s) ويمثل 63% من شحن المكثفة.',
        },
        {
          id: 'phys-2',
          prompt: 'عند تفاعل معدن الزنك Zn مع محلول حمض كلور الماء (H⁺ + Cl⁻)، ما الغاز المنطلق الذي يحدث فرقعة مع عود ثقاب؟',
          options: ['غاز ثنائي الأكسجين O2', 'غاز ثنائي الهيدروجين H2', 'غاز ثنائي أكسيد الكربون CO2', 'غاز الكلور Cl2'],
          correctIndex: 1,
          explanation: 'تفاعل المعدن مع الحمض يحرر غاز الهيدروجين H2 الذي يُكشف عنه بفرقعة خفيفة عند تقريب لهب.',
        },
        {
          id: 'phys-3',
          prompt: 'حسب قانون أوم، ما العلاقة الصحيحة بين التوتر U والمقاومة R وشدة التيار I؟',
          options: ['U = R / I', 'U = R × I', 'I = R × U', 'R = I × U'],
          correctIndex: 1,
          explanation: 'قانون أوم يعبر عنه بالعلاقة U = R × I حيث U بالفولط، R بالأوم، و I بالأمبير.',
        },
        {
          id: 'phys-4',
          prompt: 'بأي لون يتلون كاشف أزرق البروموثيمول (BBT) في وسط حمضي؟',
          options: ['الأزرق', 'الأخضر', 'الأصفر', 'الوردي'],
          correctIndex: 2,
          explanation: 'أزرق البروموثيمول يكون أصفراً في الوسط الحمضي، وأخضراً في الوسط المعتدل، وأزرقاً في الوسط القاعدي.',
        },
        ...(isMiddle ? PHYSICS_MIDDLE_EXTRA : PHYSICS_SEC_EXTRA),
      ];
    },
  },
  {
    key: 'sciences',
    name: 'العلوم الطبيعية',
    buttonLabel: 'مادة العلوم الطبيعية',
    buildSummary: (level) =>
      ['1am', '2am', '3am', '4am'].includes(level)
        ? 'التغذية والإنزيمات، التنسيق العصبي والمناعي، والزلازل والتكتونية'
        : 'الانقسام الخيطي والتركيب الضوئي + تركيب البروتين والإنزيمات والمناعة',
    buildExercises: () => [
      {
        title: 'التمرين التطبيقي: استرجاع المعارف والاستدلال العلمي',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- اشرح دور كل من الأنزيمات الهاضمة والزغابات المعوية في عملية الهضم والامتصاص.',
          '2- قارن بين الاستجابة المناعية الخلطية (اللمفاويات LB) والاستجابة الخلوية (LTc).',
        ],
        solutionSteps: [
          'تعمل الإنزيمات على تبسيط الأغذية المعقدة إلى مغذيات قابلة للامتصاص عبر الزغابات المعوية الغنية بالشعيرات.',
          'الخلطية تتدخل فيها أجسام مضادة تفرزها البلاسموسيت ضد مولد الضد الحر، بينما الخلوية تدمر الخلايا المصابة مباشرة عبر اللمفاويات التائية السامة.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'bio-1',
        prompt: 'أين تتم مرحلة النسخ (الاستنساخ) لتشكيل جزيء ARNm انطلاقاً من الـ ADN عند حقيقيات النوى؟',
        options: ['في الهيولى (السيتوبلازم)', 'في النواة', 'في الميتوكوندري', 'على مستوى الغشاء الهيولي'],
        correctIndex: 1,
        explanation: 'النسخ يتم داخل النواة بتدخل إنزيم ARN بوليميراز، ثم يخرج الـ ARNm عبر الثقوب النووية للترجمة في الهيولى.',
      },
      {
        id: 'bio-2',
        prompt: 'ما هي القاعدة الآزوتية المميزة لـ ARN التي تحل محل التايمين (T) الموجود في الـ ADN؟',
        options: ['الأدينين A', 'الغوانين G', 'اليوراسيل U', 'السيتوزين C'],
        correctIndex: 2,
        explanation: 'يتكون الـ ARN من القواعد الآزوتية: A و U و C و G بدلاً من T الموجودة في ADN.',
      },
      {
        id: 'bio-3',
        prompt: 'ما اسم الإنزيم المسؤول عن تفكيك النشاء إلى سكر مالتوز في الفم؟',
        options: ['الليباز', 'الأميلاز اللعابي', 'البروتياز 1', 'اللاكتاز'],
        correctIndex: 1,
        explanation: 'الأميلاز اللعابي يفكك النشاء (سكر معقد) في الفم إلى مالتوز (سكر ثنائي).',
      },
      {
        id: 'bio-4',
        prompt: 'ما نوع الخلايا المناعية التي تنتج الأجسام المضادة السارية في المصل؟',
        options: ['الخلايا البلازمية الناتجة عن تمايز LB', 'الكريات الحمراء', 'الخلايا العصبية', 'البالعات الكبيرة فقط'],
        correctIndex: 0,
        explanation: 'تتكاثر وتتمايز اللمفاويات البائية LB إلى خلايا بلازمية مفرزة للأجسام المضادة النوعية.',
      },
      ...SCIENCES_EXTRA,
    ],
  },
  {
    key: 'philo',
    name: 'الفلسفة',
    buttonLabel: 'مادة الفلسفة',
    buildSummary: (level) =>
      level === '2as'
        ? 'المشكلة والإشكالية، المذاهب الفلسفية (العقلانية والتجريبية)، والمنطق الصوري'
        : 'المقالات الجدلية والاستقصائية: الأخلاق، العدالة، الحرية، اللغة والفكر، والعلوم',
    buildExercises: () => [
      {
        title: 'موضوع منهجي تطبيقي (الطريقة الجدلية)',
        pointsLabel: '20 نقطة',
        tasks: [
          'السؤال التطبيقي: «هل اللغة أداة تواصل وتعبير تامة، أم أنها قاصرة عن احتواء كل معاني الفكر؟»',
          '1- حرر طرح المشكلة مبيناً العناد الفلسفي حول علاقة اللغة بالفكر.',
          '2- اعرض الأطروحة الأولى (التطابق والاكتمال) والأطروحة الثانية (القصور والتمايز) مع الأمثلة الفلسفية ثم التركيب.',
        ],
        solutionSteps: [
          'الأطروحة الأحادية: يرى هيغل وميرلوبونتي أن الفكر واللغة وجهان لعملة واحدة ولا وجود لفكرة خارج الكلمات.',
          'الأطروحة الثنائية: يرى هنري برغسون أن الفكر أوسع من اللغة لأنها عاجزة عن ترجمة المشاعر الروحية العميقة بدقة.',
          'التركيب: العلاقة تكاملية جدلية؛ اللغة تجسد الفكر وتطوّره رغم حاجته أحياناً للرمز والفن.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'philo-1',
        prompt: 'من هو الفيلسوف صاحب المقولة الشهيرة: «أنا أفكر، إذن أنا موجود» الذي أسس المذهب العقلاني الحديث؟',
        options: ['جون لوك', 'رينيه ديكارت', 'ديفيد هيوم', 'أوغست كونت'],
        correctIndex: 1,
        explanation: 'الكوجيتو الديكارتي يرى أن العقل هو مصدر المعرفة اليقينية والفطرية.',
      },
      {
        id: 'philo-2',
        prompt: 'أي طريقة فلسفية تُستعمل عندما يكون السؤال بصيغة: «دافع عن الأطروحة القائلة...»؟',
        options: ['الطريقة الجدلية', 'تحليل النص', 'الاستقصاء بالوضع', 'الاستقصاء بالرفع'],
        correctIndex: 2,
        explanation: 'تُستعمل طريقة الاستقصاء بالوضع لإثبات أطروحة يُراد الدفاع عن صحتها مع نقد خصومها.',
      },
      {
        id: 'philo-3',
        prompt: 'بماذا شبّه الفيلسوف التجريبي «جون لوك» عقل الإنسان عند الولادة؟',
        options: ['مرآة مكتملة', 'صفحة بيضاء تكتب عليها التجربة', 'شمس ساطعة', 'آلة رياضية'],
        correctIndex: 1,
        explanation: 'ينفي المذهب التجريبي وجود أفكار فطرية، ويرى جون لوك أن الحواس والتجربة هما مصدر كل معرفة.',
      },
      {
        id: 'philo-4',
        prompt: 'من هو الفيلسوف الألماني الذي أسّس الأخلاق على مبدأ «الواجب الأخلاقي المطلق» لذاته لا لغرض منفعي؟',
        options: ['جيريمي بنثام', 'إيمانويل كانط', 'أبيقور', 'توماس هوبز'],
        correctIndex: 1,
        explanation: 'أخلاق الواجب عند كانط تنطلق من الإرادة الخيرة والواجب المطلق غير المشروط بنتائج مادية.',
      },
      ...PHILO_EXTRA,
    ],
  },
  {
    key: 'english',
    name: 'اللغة الإنجليزية',
    buttonLabel: 'مادة اللغة الإنجليزية',
    buildSummary: () => 'Reading Comprehension, Grammar (Tenses, Conditionals, Passive Voice) & Writing',
    buildExercises: () => [
      {
        title: 'Part One: Reading & Grammar Practice',
        pointsLabel: '20 pts',
        tasks: [
          '1- Complete the sentence with the correct form: "If students (revise) ______ regularly, they will succeed."',
          '2- Rewrite into Passive Voice: "ONEFD provides digital lessons for distance learners."',
          '3- Write a short paragraph (60-80 words) about how technology helps distance education.',
        ],
        solutionSteps: [
          '1- Conditional Type 1: "revise" (Present Simple) + "will succeed" (Future Simple).',
          '2- Passive Voice: "Digital lessons are provided by ONEFD for distance learners."',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'eng-1',
        prompt: 'Choose the correct verb tense: "Unless you ______ hard, you will not pass the final exam."',
        options: ['study', 'studied', 'will study', 'studying'],
        correctIndex: 0,
        explanation: '"Unless" means "if not" in Type 1 Conditional and is followed by the Present Simple ("study").',
      },
      {
        id: 'eng-2',
        prompt: 'Select the accurate passive transformation of: "Algerian students built this project."',
        options: [
          'This project is built by Algerian students.',
          'This project was built by Algerian students.',
          'This project has built by Algerian students.',
          'This project will be built by Algerian students.',
        ],
        correctIndex: 1,
        explanation: 'The active verb "built" is Past Simple, so the passive uses "was + past participle" ("was built").',
      },
      {
        id: 'eng-3',
        prompt: 'Which suffix turns the adjective "honest" into a noun?',
        options: ['-ment', '-y', '-tion', '-able'],
        correctIndex: 1,
        explanation: 'Adding "-y" forms the noun "honesty" (opposite: dishonesty).',
      },
      {
        id: 'eng-4',
        prompt: 'Choose the right modal for strong moral obligation: "Citizens ______ respect the law."',
        options: ['must', 'might', 'may', 'could'],
        correctIndex: 0,
        explanation: '"Must" expresses strong obligation and duty.',
      },
      ...ENGLISH_EXTRA,
    ],
  },
  {
    key: 'french',
    name: 'اللغة الفرنسية',
    buttonLabel: 'مادة اللغة الفرنسية',
    buildSummary: () => 'Compréhension de l’écrit, Syntaxe (Cause/But/Discours) & Expression écrite',
    buildExercises: () => [
      {
        title: 'Atelier de langue et compréhension',
        pointsLabel: '20 pts',
        tasks: [
          '1- Identifiez le rapport logique exprimé dans: « Il travaille sérieusement afin de réussir son examen. »',
          '2- Transformez au discours indirect: Le professeur conseille aux élèves : « Relisez vos cours chaque soir. »',
        ],
        solutionSteps: [
          '1- « afin de » exprime un rapport de but (suivi de l’infinitif).',
          '2- Le professeur conseille aux élèves de relire leurs cours chaque soir.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'fr-1',
        prompt: 'Dans la phrase « Bien qu’il soit fatigué, il continue ses révisions », quel rapport logique est exprimé ?',
        options: ['La cause', 'La conséquence', 'La concession / opposition', 'Le but'],
        correctIndex: 2,
        explanation: 'La locution conjonctive « bien que » (+ subjonctif) exprime la concession.',
      },
      {
        id: 'fr-2',
        prompt: 'Quelle préposition introduit un groupe nominal exprimant la cause positive ?',
        options: ['à cause de', 'grâce à', 'malgré', 'pour que'],
        correctIndex: 1,
        explanation: '« Grâce à » s’emploie toujours pour une cause favorable, contrairement à « à cause de ».',
      },
      {
        id: 'fr-3',
        prompt: 'Quel temps verbal utilise-t-on pour décrire une action achevée au passé dans un récit historique ?',
        options: ['Le présent de narration', 'Le passé simple ou passé composé', 'Le futur proche', 'Le conditionnel'],
        correctIndex: 1,
        explanation: 'Le passé simple / passé composé exprime des faits historiques accomplis.',
      },
      {
        id: 'fr-4',
        prompt: 'Transformez au discours indirect : Il dit : « Je viendrai demain. » -> Il dit qu’il ...',
        options: ['viendra demain', 'venait hier', 'viendrait la veille', 'est venu'],
        correctIndex: 0,
        explanation: 'Lorsque le verbe introducteur est au présent (« dit »), le temps et l’indicateur ne changent pas.',
      },
      ...FRENCH_EXTRA,
    ],
  },
  {
    key: 'spanish',
    name: 'اللغة الإسبانية',
    buttonLabel: 'مادة اللغة الإسبانية',
    buildSummary: () => 'Comprensión lectora, Gramática (Subjuntivo / Pretérito) & Expresión escrita',
    buildExercises: () => [
      {
        title: 'Ejercicios prácticos de español',
        pointsLabel: '20 pts',
        tasks: [
          '1- Conjuga el verbo en presente de subjuntivo: "Espero que tú (estudiar) ______ mucho este año."',
          '2- Pasa al estilo indirecto: El profesor dice: "Leed el texto con atención."',
        ],
        solutionSteps: [
          '1- "estudiar" en 2ª persona de subjuntivo -> "estudies".',
          '2- El profesor nos pide que leamos el texto con atención.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'esp-1',
        prompt: 'Elige la forma correcta en presente de subjuntivo: "Quiero que vosotros ______ la verdad." (decir)',
        options: ['decís', 'digáis', 'dijisteis', 'diréis'],
        correctIndex: 1,
        explanation: 'El presente de subjuntivo de "decir" para vosotros es "digáis".',
      },
      {
        id: 'esp-2',
        prompt: '¿Qué preposición se usa siempre para indicar la fecha exacta o un día concreto? "______ lunes tengo examen."',
        options: ['En', 'El', 'A', 'Por'],
        correctIndex: 1,
        explanation: 'En español se usa el artículo definido ("el lunes") y no la preposición "en".',
      },
      {
        id: 'esp-3',
        prompt: '¿Cuál es el antónimo directo de la palabra "desarrollo" (تطور)?',
        options: ['progreso', 'subdesarrollo / retroceso', 'libertad', 'enseñanza'],
        correctIndex: 1,
        explanation: '"Subdesarrollo" o "retroceso" expresan lo contrario de desarrollo.',
      },
      {
        id: 'esp-4',
        prompt: 'Completa con el pretérito indefinido regular: "Ayer María ______ (escribir) una carta."',
        options: ['escribe', 'escribió', 'escribía', 'escribirá'],
        correctIndex: 1,
        explanation: '"Ayer" indica pretérito indefinido: "escribió".',
      },
      ...SPANISH_EXTRA,
    ],
  },
  {
    key: 'german',
    name: 'اللغة الألمانية',
    buttonLabel: 'مادة اللغة الألمانية',
    buildSummary: () => 'Leseverstehen, Grammatik (Nebensätze, Passiv, Kasus) & Schriftlicher Ausdruck',
    buildExercises: () => [
      {
        title: 'Übungen zur deutschen Grammatik',
        pointsLabel: '20 Punkte',
        tasks: [
          '1- Verbinden Sie mit „weil“: Ich lerne Deutsch. Ich möchte an der Universität studieren.',
          '2- Setzen Sie ins Passiv: Die Schüler lösen die Übungen.',
        ],
        solutionSteps: [
          '1- Ich lerne Deutsch, weil ich an der Universität studieren möchte. (Das konjugierte Verb steht am Ende).',
          '2- Die Übungen werden von den Schülern gelöst.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'de-1',
        prompt: 'Wo steht das konjugierte Verb in einem Nebensatz mit „weil“ oder „obwohl“?',
        options: ['Auf Position 1', 'Auf Position 2', 'Am Ende des Nebensatzes', 'Direkt nach dem Subjekt'],
        correctIndex: 2,
        explanation: 'Subjunktionen wie „weil“ und „obwohl“ leiten einen Nebensatz ein: das konjugierte Verb geht ans Satzende.',
      },
      {
        id: 'de-2',
        prompt: 'Welcher Kasus folgt immer nach der Präposition „mit“?',
        options: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
        correctIndex: 2,
        explanation: 'Die Präposition „mit“ verlangt immer den Dativ (z. B. mit dem Bus).',
      },
      {
        id: 'de-3',
        prompt: 'Wählen Sie das richtige Perfekt-Hilfsverb: „Gestern ______ er nach Algier gefahren.“',
        options: ['hat', 'ist', 'wird', 'war'],
        correctIndex: 1,
        explanation: 'Bewegungsverben wie „fahren“ bilden das Perfekt mit „sein“ (ist gefahren).',
      },
      {
        id: 'de-4',
        prompt: 'Wie lautet der Artikel im Akkusativ maskulin? „Ich lese ______ Roman.“ (der Roman)',
        options: ['der', 'den', 'dem', 'des'],
        correctIndex: 1,
        explanation: 'Maskulinum ändert sich im Akkusativ von „der/ein“ zu „den/einen“.',
      },
      ...GERMAN_EXTRA,
    ],
  },
  {
    key: 'italian',
    name: 'اللغة الإيطالية',
    buttonLabel: 'مادة اللغة الإيطالية',
    buildSummary: () => 'Comprensione del testo, Grammatica (Passato prossimo, Congiuntivo) & Scrittura',
    buildExercises: () => [
      {
        title: 'Esercizi di lingua italiana',
        pointsLabel: '20 punti',
        tasks: [
          '1- Completa al passato prossimo: "Ieri noi (andare) ______ a visitare il museo nazionale."',
          '2- Scegli il pronome corretto: "Conosci la storia? Sì, ______ conosco bene."',
        ],
        solutionSteps: [
          '1- "siamo andati" (verbo di movimento con ausiliare essere e accordo).',
          '2- "la" (pronome diretto femminile singolare riferito a "la storia").',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'it-1',
        prompt: 'Quale ausiliare si usa con il verbo riflessivo "svegliarsi" al passato prossimo?',
        options: ['Avere', 'Essere', 'Fare', 'Stare'],
        correctIndex: 1,
        explanation: 'Tutti i verbi riflessivi usano sempre l’ausiliare "essere" (es. mi sono svegliato/a).',
      },
      {
        id: 'it-2',
        prompt: 'Completa correttamente: "Penso che Marco ______ un bravo studente." (essere - congiuntivo)',
        options: ['è', 'sia', 'era', 'sarà'],
        correctIndex: 1,
        explanation: 'Dopo espressioni di opinione come "penso che", in italiano si usa il congiuntivo ("sia").',
      },
      {
        id: 'it-3',
        prompt: 'Qual è il plurale di "l’amico"?',
        options: ['gli amichi', 'i amici', 'gli amici', 'le amici'],
        correctIndex: 2,
        explanation: 'Il plurale regolare di "amico" con articolo maschile è "gli amici".',
      },
      {
        id: 'it-4',
        prompt: 'Che cosa significa l’espressione "in bocca al lupo"?',
        options: ['Attenzione al pericolo', 'Buona fortuna', 'Arrivederci', 'Grazie mille'],
        correctIndex: 1,
        explanation: '"In bocca al lupo" è un modo di dire molto usato in italiano per augurare buona fortuna.',
      },
      ...ITALIAN_EXTRA,
    ],
  },
  {
    key: 'islamic',
    name: 'العلوم الإسلامية',
    buttonLabel: 'مادة العلوم الإسلامية',
    buildSummary: () => 'العقيدة، مقاصد الشريعة، المساواة وأحكام المعاملات والربا والميراث',
    buildExercises: () => [
      {
        title: 'الموضوع التطبيقي في العلوم الإسلامية',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- عرّف مقاصد الشريعة الإسلامية واذكر مراتبها الثلاث (الضروريات، الحاجيات، التحسينيات).',
          '2- بيّن الحكمة من تحريم الربا وأثر المعاملات المالية الجائزة في استقرار المجتمع.',
        ],
        solutionSteps: [
          'الضروريات الخمس هي: حفظ الدين، النفس، العقل، النسل، والمال.',
          'حُرّم الربا لما فيه من ظلم واستغلال لحاجة المحتاج وتعطيل للعمل المنتج.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'isl-1',
        prompt: 'كم عدد الضروريات الخمس التي اتفقت الشرائع على حفظها؟',
        options: ['ثلاث ضروريات', 'خمس ضروريات (الدين، النفس، العقل، النسل، المال)', 'سبع ضروريات', 'عشر ضروريات'],
        correctIndex: 1,
        explanation: 'الكليات الخمس هي: حفظ الدين، حفظ النفس، حفظ العقل، حفظ النسل (العرض)، وحفظ المال.',
      },
      {
        id: 'isl-2',
        prompt: 'ما نوع الربا الذي يكون في مبادلة الذهب بالذهب أو القمح بالقمح مع التفاضل في القدر؟',
        options: ['ربا النسيئة', 'ربا الفضل', 'بيع الصرف الجائز', 'المرابحة'],
        correctIndex: 1,
        explanation: 'ربا الفضل هو الزيادة في أحد البدلين عند تبادل مالين ربويين من نفس الجنس.',
      },
      {
        id: 'isl-3',
        prompt: 'أي أسلوب قرآني يعتمد على لفت نظر الإنسان إلى نظام الكون وإتقان خلقه لتثبيت العقيدة؟',
        options: ['إثارة العقل والوجدان', 'التنفير من الانحراف', 'مناقشة المواريث', 'أحكام المداينة'],
        correctIndex: 0,
        explanation: 'يخاطب القرآن العقل والوجدان بالتدبر في آيات الكون والنفس لإيقاظ الإيمان.',
      },
      {
        id: 'isl-4',
        prompt: 'ما المقصود بالوقف في الفقه الإسلامي؟',
        options: ['بيع العقار بالتقسيط', 'حبس الأصل وتسبيل المنفعة في وجوه الخير', 'قرض بفائدة', 'زكاة الفطر'],
        correctIndex: 1,
        explanation: 'الوقف هو حبس العين (مثل أرض أو بناء) عن التملك والتصرف وتوجيه ريعها للمنفعة العامة.',
      },
      ...ISLAMIC_EXTRA,
    ],
  },
  {
    key: 'civic',
    name: 'التربية المدنية',
    buttonLabel: 'مادة التربية المدنية',
    buildSummary: () => 'المواطنة، الدستور، مؤسسات الدولة، حقوق الإنسان والحوار المجتمعي',
    buildExercises: () => [
      {
        title: 'موضوع تطبيقي في التربية المدنية',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- عرّف الدستور وبيّن دور السلطة التشريعية والسلطة القضائية في حماية الحقوق.',
          '2- اذكر ثلاث آليات لحل النزاعات بطرق سلمية داخل الأسرة والمدرسة والمجتمع.',
        ],
        solutionSteps: [
          'الدستور هو القانون الأعلى للدولة؛ يحدد نظام الحكم والحقوق والواجبات.',
          'حل النزاعات يتم بالحوار البنّاء، الوساطة، والتقاضي واحترام القانون.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'civ-1',
        prompt: 'ما هي الهيئة التي تتولى سنّ القوانين ومراقبة عمل الحكومة في الجزائر؟',
        options: ['السلطة التنفيذية', 'السلطة التشريعية (البرلمان بغرفتيه)', 'المجلس الشعبي البلدي فقط', 'الولاية'],
        correctIndex: 1,
        explanation: 'يمارس البرلمان بغرفتيه (المجلس الشعبي الوطني ومجلس الأمة) السلطة التشريعية.',
      },
      {
        id: 'civ-2',
        prompt: 'أي وثيقة تُعدّ أسمى قانون في الدولة وتخضع له جميع القوانين الأخرى؟',
        options: ['القانون الداخلي للمدرسة', 'الدستور', 'المرسوم البلدي', 'العقد التجاري'],
        correctIndex: 1,
        explanation: 'الدستور هو القانون الأعلى والأساسي في الدولة.',
      },
      {
        id: 'civ-3',
        prompt: 'ما هي أول خطوة حضارية ومبدئية لحل أي خلاف دون اللجوء إلى العنف؟',
        options: ['المقاطعة', 'الحوار الهادئ وتقبل الرأي الآخر', 'التسرع في الحكم', 'تجاهل القوانين'],
        correctIndex: 1,
        explanation: 'الحوار هو الأسلوب الأرقى لتقريب وجهات النظر وحفظ السلم الاجتماعي.',
      },
      {
        id: 'civ-4',
        prompt: 'من يتولى رئاسة المجلس الشعبي البلدي؟',
        options: ['الوالي', 'رئيس المجلس المنتخب (المير)', 'الوزير الأول', 'القاضي'],
        correctIndex: 1,
        explanation: 'يُنتخب أعضاء المجلس الشعبي البلدي بالاقتراع العام المباشر ثم يرأس المجلسَ رئيسُه المنتخب.',
      },
      ...CIVIC_EXTRA,
    ],
  },
  {
    key: 'civil_eng',
    name: 'هندسة مدنية',
    buttonLabel: 'مادة هندسة مدنية',
    buildSummary: () => 'الميكانيك المطبقة (التوازن والانحناء البسيط)، الخرسانة المسلحة، والطبوغرافيا',
    buildExercises: () => [
      {
        title: 'التمرين التطبيقي: الميكانيك والطبوغرافيا',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- رافدة أفقية مسندة على مسند مضاعف A ومسند بسيط B وتتحمل حمولة موزعة بانتظام q = 10 kN/m على طول L = 4 m. احسب ردّي الفعل RA و RB.',
          '2- احسب الفرق في الارتفاع ΔH انطلاقاً من قراءة خلفية LR = 2.45 m وقراءة أمامية LV = 1.15 m.',
        ],
        solutionSteps: [
          'الحمولة الكلية Q = 10 × 4 = 40 kN، وبالتناظر RA = RB = 20 kN.',
          'ΔH = LR - LV = 2.45 - 1.15 = +1.30 m (صعود).',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'civeng-1',
        prompt: 'كم عدد معادلات التوازن السكوني في المستوي لجسم صلب؟',
        options: ['معادلتان', 'ثلاث معادلات (ΣFx=0, ΣFy=0, ΣM=0)', 'أربع معادلات', 'معادلة واحدة'],
        correctIndex: 1,
        explanation: 'يتحقق التوازن السكوني المستوي بثلاث معادلات: مجموع القوى على المحورين يساوي صفراً ومجموع العزوم يساوي صفراً.',
      },
      {
        id: 'civeng-2',
        prompt: 'لماذا يُضاف الفولاذ (التسليح) إلى الخرسانة في العناصر المعرضة للانحناء؟',
        options: ['لتقليل الوزن', 'لأن الخرسانة ضعيفة المقاومة للشد بينما الفولاذ مقاوم ممتاز للشد', 'لتغيير اللون', 'لتسريع الجفاف'],
        correctIndex: 1,
        explanation: 'تقاوم الخرسانة الانضغاط بشكل ممتاز لكن مقاومتها للشد ضعيفة، فيعوّضها الفولاذ.',
      },
      {
        id: 'civeng-3',
        prompt: 'في التسوية الهندسية المباشرة، كيف يُحسب فرق الارتفاع ΔH بين نقطتين؟',
        options: ['القراءة الأمامية - القراءة الخلفية', 'القراءة الخلفية LR - القراءة الأمامية LV', 'مجموع القراءتين', 'جداء القراءتين'],
        correctIndex: 1,
        explanation: 'ΔH = LR - LV؛ وإذا كانت موجبة فالنقطة الثانية أعلى من الأولى.',
      },
      {
        id: 'civeng-4',
        prompt: 'أين يقع العزم الأعظمي للانحناء Mf max في رافدة أفقية بسيطة التناظر محملة بانتظام؟',
        options: ['عند المسند فقط', 'في منتصف المجاز (عند انعدام القاطع T=0)', 'خارج الرافدة', 'يكون دوماً معدوماً'],
        correctIndex: 1,
        explanation: 'العزم الأعظمي يتحقق في المقطع الذي ينعدم فيه جهد القاطع، أي في منتصف الرافدة.',
      },
      ...CIVIL_ENG_EXTRA,
    ],
  },
  {
    key: 'process_eng',
    name: 'هندسة طرائق',
    buttonLabel: 'مادة هندسة طرائق',
    buildSummary: () => 'الكيمياء العضوية، الكيمياء الحيوية (الأحماض الأمينية والليبيدات)، والديناميكا الحرارية',
    buildExercises: () => [
      {
        title: 'تطبيق في الكيمياء العضوية والديناميكا الحرارية',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- اكتب معادلة تفاعل الأسترة بين حمض الإيثانويك CH3COOH والإيثانول C2H5OH واذكر خصائص التفاعل.',
          '2- احسب أنتالبي التفاعل القياسي ΔrH° انطلاقاً من أنتالبيات التشكل القياسية للمتفاعلات والنواتج.',
        ],
        solutionSteps: [
          'CH3COOH + C2H5OH ⇌ CH3COOC2H5 + H2O؛ تفاعل بطيء، عكوس (محدود)، ولا حراري.',
          'حسب قانون هس: ΔrH° = Σ ΔfH°(النواتج) - Σ ΔfH°(المتفاعلات).',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'proc-1',
        prompt: 'بماذا يتميز تفاعل الأسترة انطلاقاً من حمض كربوكسيلي وكحول أولي؟',
        options: ['سريع وتام وناشر للحرارة', 'بطيء ومحدود (عكوس) ولا حراري', 'سريع ومحدود', 'لا يحدث إلا بالضوء'],
        correctIndex: 1,
        explanation: 'تفاعل الأسترة بطيء ومحدود بمردود 67% عند استخدام كحول أولي بكميات متساوية المولات.',
      },
      {
        id: 'proc-2',
        prompt: 'إلى أي عائلة كيميائية تنتمي الرابطة الببتيدية -CO-NH-؟',
        options: ['الإسترات', 'الأميدات / البروتينات', 'الألكانات', 'الكيتونات'],
        correctIndex: 1,
        explanation: 'تتشكل الرابطة الببتيدية (وظيفة أميدية) بتكثف حمضين أمينيين مع طرح جزيء ماء.',
      },
      {
        id: 'proc-3',
        prompt: 'إذا كان تغير الأنتالبي لتفاعل كيميائي ΔH < 0، فما طبيعة هذا التفاعل؟',
        options: ['ماص للحرارة', 'ناشر للحرارة', 'لا حراري', 'مستحيل حرارياً'],
        correctIndex: 1,
        explanation: 'عندما يكون ΔH سالباً فالجملة تفقد طاقة حرارية للوسط الخارجي، أي أن التفاعل ناشر للحرارة.',
      },
      {
        id: 'proc-4',
        prompt: 'ماذا نسمي الجزيئات المكونة للغليسيريدات الثلاثية (الدهون) بعد تفاعل التصبن بالصودا NaOH؟',
        options: ['الأحماض الأمينية والغلوكوز', 'الغليسيرول وأملاح الأحماض الدسمة (الصابون)', 'الألكينات', 'الألدهيدات'],
        correctIndex: 1,
        explanation: 'التصبن يحرر الغليسيرول وصابون كربوكسيلات الصوديوم.',
      },
      ...PROCESS_ENG_EXTRA,
    ],
  },
  {
    key: 'mech_eng',
    name: 'هندسة ميكانيكية',
    buttonLabel: 'مادة هندسة ميكانيكية',
    buildSummary: () => 'التحليل الوظيفي والإنشائي، الوصلات الميكانيكية، مقاومة المواد، والتحكم GRAFCET',
    buildExercises: () => [
      {
        title: 'دراسة الإنشائي والتقني',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- حدّد نوع الوصلة بين العمود والعجلة المسننة عند استخدام خابور متوازي وسدادة ارتكاز.',
          '2- عمود أسطواني قطره d = 20 mm خاضع لقوة شد محورية N = 31.4 kN. احسب الإجهاد الناظمي σ.',
        ],
        solutionSteps: [
          'الوصلة عبارة عن وصلة اندماجية قابلة للفك تمنع الدوران (بالخابور) والانتقال المحوري.',
          'المساحة S = π d² / 4 = 314 mm²، ومنه σ = N / S = 31400 / 314 = 100 MPa.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'mech-1',
        prompt: 'ما الوظيفة الأساسية للمدحرجات ذات كريات مائلة (أو أسطوانية) على عمود دوار؟',
        options: ['تحقيق التوجيه في الدوران وتقليل الاحتكاك', 'تحقيق وصلة اندماجية ثابتة', 'عزل التيار الكهربائي', 'زيادة التآكل'],
        correctIndex: 0,
        explanation: 'المدحرجات تحقق التوجيه في الدوران (Guidage en rotation) وتخفض معامل الاحتكاك بشكل كبير.',
      },
      {
        id: 'mech-2',
        prompt: 'ما هي وحدة قياس الإجهاد الناظمي σ = N / S في مقاومة المواد؟',
        options: ['النيوتن N', 'الميغاباسكال MPa (أي N/mm²)', 'الواط W', 'المتر m'],
        correctIndex: 1,
        explanation: '1 N/mm² يساوي تماماً 1 MPa وهي الوحدة المعتمدة في حسابات RDM.',
      },
      {
        id: 'mech-3',
        prompt: 'ما العنصر المستعمل في الوصلة المحورية لمنع الانزلاق الدوراني بين العمود والعجلة المسننة؟',
        options: ['الحلقة المرنة Circlips', 'الخابور Clavette', 'الوسادة', 'النابض الحلزوني'],
        correctIndex: 1,
        explanation: 'الخابور يربط العمود بالعجلة لنقل عزم الدوران ويمنع الحركة الدورانية النسبية.',
      },
      {
        id: 'mech-4',
        prompt: 'ماذا يمثل الرمز الحرفي «H7/g6» في الرسم التقني الميكانيكي؟',
        options: ['خشونة السطح', 'توافق خلوصي (Ajustement avec jeu)', 'نوع المادة المعدنية', 'تسامح هندسي للتعامد'],
        correctIndex: 1,
        explanation: 'التوافق H7/g6 هو توافق خلوصي دقيق يُستعمل للتوجيه بالانزلاق.',
      },
      ...MECH_ENG_EXTRA,
    ],
  },
  {
    key: 'elec_eng',
    name: 'هندسة كهربائية',
    buttonLabel: 'مادة هندسة كهربائية',
    buildSummary: () => 'المنطق التوافقي والتعاقبي GRAFCET، المحركات اللاتزامنية ثلاثية الطور، والمحولات',
    buildExercises: () => [
      {
        title: 'دراسة الدارات والمحركات الثلاثية الطور',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- محرك ثلاثي الطور لا تزامني ذو 4 أقطاب متصل بشبكة ترددها f = 50 Hz. احسب سرعة التزامن ns.',
          '2- إذا كانت سرعة الدوار الفعلية n = 1440 tr/min، احسب الانزلاق g%.',
        ],
        solutionSteps: [
          'عدد أزواج الأقطاب p = 2، ومنه ns = (60 × f) / p = 3000 / 2 = 1500 tr/min.',
          'الانزلاق g = (ns - n) / ns = (1500 - 1440) / 1500 = 0.04 = 4%.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'elec-1',
        prompt: 'في المنطق الرقمي، متى يكون مخرج بوابة «AND» (و) مساوياً لـ 1؟',
        options: ['عندما يكون أحد المداخل 1', 'فقط عندما تكون جميع المداخل 1', 'عندما تكون جميع المداخل 0', 'دائماً يساوي 1'],
        correctIndex: 1,
        explanation: 'البوابة المنطقية AND تحقق الجداء المنطقي (S = A · B) فلا تعطي 1 إلا إذا تحقق الشرط في كل المداخل.',
      },
      {
        id: 'elec-2',
        prompt: 'ما هي سرعة التزامن لمحرك ثلاثي الطور بأربعة أقطاب (p = 2) عند تردد f = 50 Hz؟',
        options: ['3000 tr/min', '1500 tr/min', '1000 tr/min', '750 tr/min'],
        correctIndex: 1,
        explanation: 'ns = 60 × 50 / 2 = 1500 دورة في الدقيقة.',
      },
      {
        id: 'elec-3',
        prompt: 'كيف يُقرن محرك ثلاثي الطور مكتوب عليه (230V / 400V) على شبكة كهربائية توترها المركب 400V؟',
        options: ['إقران مثلثي Δ', 'إقران نجمي Y', 'إقران على التسلسل', 'لا يمكن توصيله'],
        correctIndex: 1,
        explanation: 'تتحمل كل وشيعة 230V (التوتر الأصغر)، ولربطه بشبكة 400V نختار الإقران النجمي Y.',
      },
      {
        id: 'elec-4',
        prompt: 'ما القلاب المستعمل بكثرة في العدّادات المتزامنة وغير المتزامنة عند تقسيم التردد على 2؟',
        options: ['القلاب JK أو D', 'بوابة NOT فقط', 'مقاوم متغير', 'صمام ثنائي'],
        correctIndex: 0,
        explanation: 'القلاب JK (عندما J=K=1) يبدل حالته عند كل جبهة نبضة ساعة فيقسم التردد على 2.',
      },
      ...ELEC_ENG_EXTRA,
    ],
  },
  {
    key: 'tech_eng',
    name: 'التكنولوجيا',
    buttonLabel: 'مادة التكنولوجيا',
    buildSummary: () => 'التحليل الوظيفي، الدارات الكهربائية والمنطقية، والرسم التقني',
    buildExercises: () => [
      {
        title: 'تطبيق تكنولوجي: التحليل الوظيفي والمنطقي',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- ارسم مخطط «العلبة البيانية A-0» لآلة غسيل أوتوماتيكية محدداً المادة الأولية، القيمة المضافة، ومعطيات الضبط.',
          '2- استخرج جدول الحقيقة للمعادلة المنطقية S = a · b + c.',
        ],
        solutionSteps: [
          'المادة الأولية: ملابس متسخة + ماء + مسحوق · القيمة المضافة: ملابس نظيفة · الضبط: برنامج الغسل ودرجة الحرارة.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'tech-1',
        prompt: 'ماذا تمثل الخطوط المتقطعة الدقيقة في الرسم التقني الصناعي؟',
        options: ['الحواف الظاهرة', 'الحواف والخطوط المخفية', 'محاور التناظر', 'خطوط التهشير'],
        correctIndex: 1,
        explanation: 'الخطوط المتقطعة الرفيعة تُستعمل لإبراز الأجزاء المخفية داخل القطعة الميكانيكية.',
      },
      {
        id: 'tech-2',
        prompt: 'كم يساوي المخرج S = A + B عندما يكون A = 1 و B = 0 في بوابة OR؟',
        options: ['0', '1', '2', 'لا يتحدد'],
        correctIndex: 1,
        explanation: 'في بوابة الجمع المنطقي OR، يكفي وجود مدخل واحد بقيمة 1 ليكون المخرج 1.',
      },
      {
        id: 'tech-3',
        prompt: 'ما هي الأداة المستعملة لقياس التوتر الكهربائي على التفرع في دارة؟',
        options: ['الأمبيرمتر', 'الفولطمتر', 'الأوممتر', 'الميكرومتر'],
        correctIndex: 1,
        explanation: 'يُركّب الفولطمتر على التفرع بين طرفي العنصر لقياس فرق الكمون (التوتر).',
      },
      {
        id: 'tech-4',
        prompt: 'ما الوظيفة الأساسية لعلبة المخفّض في أنظمة نقل الحركة الميكانيكية؟',
        options: ['زيادة السرعة وخفض العزم', 'تخفيض سرعة الدوران والرفع من العزم', 'قطع التيار', 'التبريد فقط'],
        correctIndex: 1,
        explanation: 'مخفض السرعة يُنقص سرعة الدوران الناتجة عن المحرك ويزيد العزم المنقول للآلة.',
      },
      ...TECH_ENG_EXTRA,
    ],
  },
  {
    key: 'accounting',
    name: 'تسيير محاسبي ومالي',
    buttonLabel: 'مادة تسيير محاسبي ومالي',
    buildSummary: () => 'أعمال نهاية السنة (الاهتلاكات والمؤونات)، حساب النتائج، والميزانية الوظيفية',
    buildExercises: () => [
      {
        title: 'تطبيق في الاهتلاك الخطي وتسوية المخزونات',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- حازت مؤسسة آلة صناعية بقيمة 600,000 دج مدتها النفعية 5 سنوات. احسب معدل وقسط الاهتلاك الخطي السنوي.',
          '2- سجّل قيد مخصص الاهتلاك في نهاية الدورة 31/12 باستخدام الحسابين 681 و 2815.',
        ],
        solutionSteps: [
          'المعدل t = 100 / 5 = 20% سنوياً · القسط السنوي A = 600,000 × 0.20 = 120,000 دج.',
          'القيد: من حـ/ 681 (مخصصات الاهتلاكات) 120,000 إلى حـ/ 2815 (اهتلاك المنشآت التقنية) 120,000.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'acc-1',
        prompt: 'أي حساب يُستعمل في جانب المدين لتسجيل مخصصات الاهتلاكات والمؤونات وخسائر القيمة للأصول غير الجارية؟',
        options: ['الحساب 60', 'الحساب 681', 'الحساب 70', 'الحساب 411'],
        correctIndex: 1,
        explanation: 'الحساب 681 مخصص لتسجيل أعباء الاهتلاكات والمؤونات المتعلقة بالأصول غير الجارية.',
      },
      {
        id: 'acc-2',
        prompt: 'ما هي علاقة حساب رأس المال العامل الصافي الإجمالي FRNG في الميزانية الوظيفية؟',
        options: [
          'الموارد الثابتة - الاستخدامات الثابتة',
          'الأصول الجارية - الموارد الثابتة',
          'خزينة الأصول + خزينة الخصوم',
          'رأس المال × 2',
        ],
        correctIndex: 0,
        explanation: 'FRNG = الموارد الثابتة - الاستخدامات الثابتة، ويدل عندما يكون موجباً على هامش أمان مالي.',
      },
      {
        id: 'acc-3',
        prompt: 'عند بيع تثبيت عيني بأكثر من قيمته المحاسبية الصافية VNC، يسجّل الفارق في أي حساب؟',
        options: ['حـ/ 652 نواقص القيمة', 'حـ/ 752 فوائض القيمة عن خروج أصول مثبتة غير مالية', 'حـ/ 401 الموردون', 'حـ/ 512 البنك'],
        correctIndex: 1,
        explanation: 'عندما يكون سعر التنازل أكبر من القيمة المحاسبية الصافية VNC، يسجّل فائض قيمة في الجانب الدائن للحساب 752.',
      },
      {
        id: 'acc-4',
        prompt: 'في حساب النتائج، كيف يُحسب إجمالي فائض الاستغلال EBE؟',
        options: [
          'القيمة المضافة للاستغلال VA - أعباء المستخدمين 63 - الضرائب والرسوم 64',
          'إنتاج السنة المالية - استهلاك السنة المالية',
          'المبيعات - المشتريات فقط',
          'الأرباح المالية - الأعباء المالية',
        ],
        correctIndex: 0,
        explanation: 'EBE = VA - (63 + 64) ويقيس المردودية الاقتصادية الصافية لنشاط المؤسسة الأساسي.',
      },
      ...ACCOUNTING_EXTRA,
    ],
  },
  {
    key: 'economics',
    name: 'إقتصاد ومناجمنت',
    buttonLabel: 'مادة إقتصاد ومناجمنت',
    buildSummary: () => 'النقود والبنوك، التضخم والبطالة، التجارة الخارجية، والقيادة والرقابة الإدارية',
    buildExercises: () => [
      {
        title: 'دراسة وضعية اقتصادية ومناجمنت',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- عرّف التضخم واذكر ثلاثة آثار سلبية له على القدرة الشرائية والاستثمار.',
          '2- حدّد وظائف التسيير الإداري الأربع ومراحل عملية الرقابة داخل المؤسسة.',
        ],
        solutionSteps: [
          'التضخم: ارتفاع مستمر وملموس في المستوى العام للأسعار، يؤدي لتآكل قيمة النقود وانخفاض الادخار.',
          'الوظائف الأربع: التخطيط، التنظيم، القيادة/التوجيه، والرقابة.',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'eco-1',
        prompt: 'ما هي الظاهرة الاقتصادية التي تعبر عن ارتفاع عام ومستمر في الأسعار وتراجع قيمة العملة؟',
        options: ['الكساد', 'التضخم', 'الاحتكار', 'الاكتتاب'],
        correctIndex: 1,
        explanation: 'التضخم هو الارتفاع المستمر في المستوى العام للأسعار نتيجة اختلال التوازن بين الكتلة النقدية وحجم السلع.',
      },
      {
        id: 'eco-2',
        prompt: 'أي بنك يُطلق عليه لقب «بنك البنوك» ويملك حق إصدار العملة الوطنية؟',
        options: ['البنك التجاري', 'البنك المركزي', 'الصندوق التعاوني', 'البنك العقاري'],
        correctIndex: 1,
        explanation: 'البنك المركزي (بنك الجزائر) يشرف على السياسة النقدية وإصدار النقود والرقابة على البنوك التجارية.',
      },
      {
        id: 'eco-3',
        prompt: 'عندما تتجاوز صادرات البلد من السلع قيمة وارداته من السلع، تكون حالة الميزان التجاري:',
        options: ['عجز تجاري', 'فائض تجاري', 'توازن منعدم', 'ركود مالي'],
        correctIndex: 1,
        explanation: 'الصادرات > الواردات تعني تحقيق فائض في الميزان التجاري.',
      },
      {
        id: 'eco-4',
        prompt: 'في المناجمنت، أي أسلوب قيادة يشرك المرؤوسين في اتخاذ القرارات ويعتمد على التحفيز المعنوي؟',
        options: ['القيادة الفردية التسلطية', 'القيادة الديمقراطية', 'القيادة الفوضوية', 'الرقابة العقابية'],
        correctIndex: 1,
        explanation: 'القيادة الديمقراطية تتيح استشارة الفريق وتحفز الأداء والالتزام.',
      },
      ...ECONOMICS_EXTRA,
    ],
  },
  {
    key: 'law',
    name: 'القانون',
    buttonLabel: 'مادة القانون',
    buildSummary: () => 'عقود العمل الفردية والجماعية، الشركات التجارية، والميزانية العامة للدولة',
    buildExercises: () => [
      {
        title: 'حالة عملية في قانون العمل والشركات',
        pointsLabel: '20 نقطة',
        tasks: [
          '1- قارن بين عقد العمل محدد المدة CDD وعقد العمل غير محدد المدة CDI في التشريع الجزائري.',
          '2- اذكر شروط تأسيس شركة المساهمة SPA وعدد الشركاء الأدنى فيها.',
        ],
        solutionSteps: [
          'عقد العمل CDI هو الأصل العام، أما CDD فيُبرم لحالات استثنائية مثل زيادة مؤقتة في العمل أو استخلاف عامل غائب.',
          'شركة المساهمة تتطلب 7 مساهمين على الأقل في الأنظمة الكلاسيكية (مع استثناء الشركات البسيطة الحديثة).',
        ],
      },
    ],
    buildQuiz: () => [
      {
        id: 'law-1',
        prompt: 'ما هما العنصران الأساسيان اللذان يميزان عقد العمل عن بقية العقود المدنية؟',
        options: ['الربح والخسارة', 'علاقة التبعية القانونية والأجر', 'الملكية العقارية', 'الوكالة التجارية'],
        correctIndex: 1,
        explanation: 'يقوم عقد العمل على أداء عمل مأجور تحت إشراف وإدارة صاحب العمل (رابطة التبعية).',
      },
      {
        id: 'law-2',
        prompt: 'في أي حالة يُعفى الشركاء في شركة ذات مسؤولية محدودة (SARL) من الخسائر التي تفوق حصصهم؟',
        options: ['دائماً، لأن مسؤوليتهم محدودة بمقدار حصصهم في رأس المال', 'فقط بعد 10 سنوات', 'لا يُعفون أبداً', 'عند التصدير فقط'],
        correctIndex: 0,
        explanation: 'تُحدّد مسؤولية الشركاء في SARL بقيمة حصصهم المقدمة في رأس مال الشركة.',
      },
      {
        id: 'law-3',
        prompt: 'ما القاعدتان الأساسيتان للميزانية العامة للدولة في بداية كل سنة؟',
        options: ['السرية والفردية', 'السنوية، الوحدة، والشمولية وتوازن الإيرادات والنفقات', 'الربح التجاري', 'التحكيم الدولي'],
        correctIndex: 1,
        explanation: 'تقوم الميزانية العامة على مبادئ السنوية والوحدة والشمولية وتُصادق بقانون المالية.',
      },
      {
        id: 'law-4',
        prompt: 'أي نوع من الشركات يضطلع فيها كل الشركاء بصفة التاجر وتكون مسؤوليتهم شخصية وتضامنية غير محدودة؟',
        options: ['شركة المساهمة', 'شركة التضامن (SNC)', 'الشركة التعاونية', 'الجمعية الثقافية'],
        correctIndex: 1,
        explanation: 'شركة التضامن SNC هي شركة أشخاص يسأل فيها جميع الشركاء تضامنياً وبصفة غير محدودة عن ديون الشركة.',
      },
      ...LAW_EXTRA,
    ],
  },
];

export function getSubjectsForTopicSelection(level: TopicLevelId, streamId: string): string[] {
  if (['1am', '2am', '3am', '4am'].includes(level)) {
    return ['arabic', 'math', 'physics', 'sciences', 'history', 'french', 'english', 'islamic', 'civic'];
  }
  if (level === '1as') {
    if (streamId === 'sci') {
      return ['math', 'physics', 'sciences', 'tech_eng', 'arabic', 'french', 'english', 'history', 'islamic'];
    }
    return ['arabic', 'history', 'islamic', 'french', 'english', 'math', 'physics', 'sciences'];
  }
  if (streamId === 'lang') {
    return [
      'history',
      'english',
      'spanish',
      'german',
      'italian',
      'arabic',
      'french',
      ...(level === '3as' ? ['philo'] : []),
      'islamic',
    ];
  }
  if (streamId === 'philo') {
    return ['history', 'english', 'philo', 'arabic', 'french', 'islamic', 'math'];
  }
  if (streamId === 'tech') {
    return [
      'math',
      'physics',
      'civil_eng',
      'process_eng',
      'mech_eng',
      'elec_eng',
      'arabic',
      ...(level === '3as' ? ['philo'] : []),
      'history',
      'french',
      'english',
      'islamic',
    ];
  }
  if (streamId === 'gest') {
    return [
      'math',
      'history',
      'accounting',
      'economics',
      'law',
      'arabic',
      ...(level === '3as' ? ['philo'] : []),
      'french',
      'english',
      'islamic',
    ];
  }
  // sci and math streams
  return [
    'math',
    'physics',
    'sciences',
    'arabic',
    ...(level === '3as' ? ['philo'] : []),
    'history',
    'french',
    'english',
    'islamic',
  ];
}

export function getTopicsForSelection(levelId: TopicLevelId, streamId: string): AppSubjectTopic[] {
  const keys = getSubjectsForTopicSelection(levelId, streamId);
  const topics: AppSubjectTopic[] = [];

  for (const key of keys) {
    const builder = SUBJECT_BANK.find((b) => b.key === key);
    if (!builder) continue;
    const baseExercises = builder.buildExercises(levelId, streamId);
    const extraExercises = EXTRA_SUBJECT_EXERCISES[key] || [];
    const mergedExercises = [
      ...baseExercises,
      ...extraExercises.filter((ex) => !baseExercises.some((bEx) => bEx.title === ex.title)),
    ];
    const baseQuiz = builder.buildQuiz(levelId, streamId);
    const bonusQuiz = ONEFD_SUBJECT_BONUS_QUESTIONS[key] || [];
    const mergedQuiz = [
      ...baseQuiz,
      ...bonusQuiz.filter((bq) => !baseQuiz.some((q) => q.id === bq.id)),
    ];
    topics.push({
      id: `${levelId}-${streamId}-${key}`,
      subjectKey: key,
      subjectName: builder.name,
      buttonLabel: builder.buttonLabel,
      levelId,
      streamId,
      focusSummary: builder.buildSummary(levelId, streamId),
      exercises: mergedExercises,
      quizQuestions: mergedQuiz,
    });
  }

  return topics;
}
