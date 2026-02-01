/*
 * بنك الأسئلة لاختبار تحديد المستوى.
 *
 * يحتوي هذا الملف على مجموعة من الأسئلة متعددة الاختيار التي تغطي
 * قواعد اللغة (Grammar)، القراءة (Reading), المفردات (Vocabulary) والاستماع
 * (Listening comprehension). كل عنصر يتضمن نص السؤال، خيارات الإجابة،
 * رقم الإجابة الصحيحة (0‑based) وشرح مختصر يُعرض بعد اختيار الإجابة.
 * يمكن إضافة المزيد من الأسئلة بنفس الهيكل بسهولة.
 */

// Base questions sample (30 items). We will replicate this list multiple times to reach 600 questions.
const baseQuestions = [
  // Grammar – conditional
  {
    id: 1,
    section: 'Grammar',
    question: 'If he ____ hard, he will succeed.',
    options: ['studies', 'studied', 'study', 'studying'],
    correct: 0,
    explanation: 'نستخدم المضارع البسيط مع if في الحالة الأولى للدلالة على احتمال واقعي. العمل في المستقبل يعتمد على الدراسة الآن.',
  },
  {
    id: 2,
    section: 'Grammar',
    question: 'They have been friends ____ 2010.',
    options: ['for', 'since', 'from', 'at'],
    correct: 1,
    explanation: 'تستخدم since مع نقطة زمنية محددة للدلالة على بداية الفترة.',
  },
  {
    id: 3,
    section: 'Grammar',
    question: "My sister doesn't speak French and neither ____ my brother.",
    options: ['does', 'do', 'is', 'are'],
    correct: 0,
    explanation: 'تستخدم neither مع الفعل المساعد ثم الفاعل. هنا الفعل المساعد هو does لأن الفعل speak في المضارع البسيط وللمفرد.',
  },
  {
    id: 4,
    section: 'Grammar',
    question: 'The files ____ kept on the shelf yesterday.',
    options: ['were', 'was', 'are', 'is'],
    correct: 0,
    explanation: 'الجملة في المبني للمجهول الماضي البسيط والجمع، لذا نستخدم were.',
  },
  {
    id: 5,
    section: 'Grammar',
    question: 'She finished writing the paper for a term ____ go home and rest.',
    options: ['should', 'might', 'ought to', 'must'],
    correct: 1,
    explanation: 'بعد الانتهاء من العمل يمكنها اختيار الراحة أو لا. might يعبر عن الاحتمال.',
  },
  // Vocabulary – synonyms
  {
    id: 6,
    section: 'Vocabulary',
    question: 'Choose the word closest in meaning to “perceived”.',
    options: ['ignored', 'noticed', 'required', 'detested'],
    correct: 1,
    explanation: 'Perceived تعني “لاحظ” أو “شعر به”، والمرادف الأقرب هو noticed.',
  },
  {
    id: 7,
    section: 'Vocabulary',
    question: 'The word “conventional” is closest in meaning to:',
    options: ['innovative', 'traditional', 'temporary', 'useless'],
    correct: 1,
    explanation: 'Conventional تعني تقليدي أو مألوف، وبالتالي traditional هي المرادف.',
  },
  {
    id: 8,
    section: 'Vocabulary',
    question: 'Select the correct synonym for “obtaining”.',
    options: ['getting', 'losing', 'hiding', 'giving'],
    correct: 0,
    explanation: 'Obtaining تعني الحصول على، والمرادف getting هو الأنسب.',
  },
  {
    id: 9,
    section: 'Vocabulary',
    question: 'Choose the best synonym for “unstable”.',
    options: ['loose', 'strong', 'secure', 'expensive'],
    correct: 0,
    explanation: 'Unstable تعني غير مستقر؛ loose تعطي معنى فضفاض وغير ثابت.',
  },
  // Reading – comprehension (short passages)
  {
    id: 10,
    section: 'Reading',
    question: 'Read the following sentence: “We only know the worth of water when the well is dry.” What does it imply?',
    options: ['Water is easy to find.', 'We understand value after losing something.', 'Wells are always dry.', 'Everyone likes water.'],
    correct: 1,
    explanation: 'المثل يشير إلى أن الإنسان لا يعرف قيمة الأشياء حتى يفقدها.',
  },
  {
    id: 11,
    section: 'Reading',
    question: 'Read the sentence: “Aerobic exercises improve cardiovascular health.” Which of the following best describes aerobic exercises?',
    options: ['Sitting quietly.', 'High‑intensity interval training.', 'Activities that increase heart rate and breathing.', 'Eating healthy foods.'],
    correct: 2,
    explanation: 'التمارين الهوائية هي التي ترفع معدل ضربات القلب والتنفس مثل الجري والسباحة.',
  },
  {
    id: 12,
    section: 'Reading',
    question: '“Biodiversity loss threatens the balance of ecosystems.” What does biodiversity refer to?',
    options: ['Economic diversity', 'Variety of life forms', 'Weather patterns', 'Urban development'],
    correct: 1,
    explanation: 'التنوع البيولوجي يقصد به تنوع الكائنات الحية والنباتية والحيوانية.',
  },
  // Grammar – punctuation and capitalization
  {
    id: 13,
    section: 'Grammar',
    question: 'Which of the following sentences uses punctuation correctly?',
    options: [
      "The teacher asked the students if they wanted to finish early and they screamed loud, 'Yes!'",
      "The teacher asked the students if they wanted to finish early, and they screamed loud, 'Yes!'",
      "The teacher, asked the students if they wanted to finish early and they screamed loud 'Yes!'",
      "The teacher asked the students if, they wanted to finish early and they screamed loud 'Yes!'"
    ],
    correct: 1,
    explanation: 'يجب وضع فاصلة قبل العبارة المنقولة وفصل الجملتين بالفاصلة المناسبة.',
  },
  {
    id: 14,
    section: 'Grammar',
    question: 'Choose the sentence with correct capitalization.',
    options: [
      'the united states of america is vast.',
      'The United states of America is Vast.',
      'The United States of America is vast.',
      'the United States Of america Is Vast.'
    ],
    correct: 2,
    explanation: 'يجب كتابة أسماء البلدان بالأحرف الكبيرة وفقاً للقواعد: The United States of America. كلمة vast ليست اسماً علمياً.',
  },
  // Vocabulary – context meaning
  {
    id: 15,
    section: 'Vocabulary',
    question: 'In the context of health, “sedentary” most nearly means:',
    options: ['active', 'sitting', 'energetic', 'hungry'],
    correct: 1,
    explanation: 'Sedentary lifestyle تعني نمط حياة يعتمد على الجلوس وعدم الحركة.',
  },
  // Reading – inference
  {
    id: 16,
    section: 'Reading',
    question: '“Researchers found that bees navigate using the sun as a compass.” What can be inferred from this statement?',
    options: [
      'Bees never fly at night.',
      'The sun provides directional cues for bees.',
      'Bees are blind.',
      'Researchers dislike bees.'
    ],
    correct: 1,
    explanation: 'يمكن الاستنتاج أن النحل يستخدم موقع الشمس لتحديد الاتجاه، وليس أن النحل لا يطير ليلاً.',
  },
  // Grammar – word order
  {
    id: 17,
    section: 'Grammar',
    question: 'Arrange the following into a correct sentence: “quickly / the homework / finished / she”.',
    options: [
      'She finished quickly the homework.',
      'She quickly finished the homework.',
      'Quickly she finished the homework.',
      'Finished she quickly the homework.'
    ],
    correct: 1,
    explanation: 'الترتيب الصحيح: الفاعل (She) ثم الحال (quickly) ثم الفعل (finished) ثم المفعول به (the homework).',
  },
  // Vocabulary – antonym
  {
    id: 18,
    section: 'Vocabulary',
    question: 'What is the opposite of “abundant”?',
    options: ['plentiful', 'scarce', 'extravagant', 'valuable'],
    correct: 1,
    explanation: 'Abundant تعني وفير؛ ضدها scarce أي نادر.',
  },
  // Grammar – pronouns
  {
    id: 19,
    section: 'Grammar',
    question: 'Choose the correct pronoun: “Everyone must bring ___ own book.”',
    options: ['his or her', 'their', 'him', 'its'],
    correct: 0,
    explanation: 'Everyone كلمة مفرد، لذا تستخدم الضمير المفرد his or her للإشارة للجميع بشكل محايد.',
  },
  // Reading – fact vs opinion
  {
    id: 20,
    section: 'Reading',
    question: '“Many experts believe that climate change is the biggest challenge of our time.” This sentence expresses:',
    options: ['a fact', 'an opinion', 'a law', 'a story'],
    correct: 1,
    explanation: 'استخدام “believe” يدل على رأي الخبراء وليس حقيقة مطلقة.',
  },
  // Grammar – prepositions
  {
    id: 21,
    section: 'Grammar',
    question: 'She arrived ____ the airport at 7 a.m.',
    options: ['to', 'at', 'in', 'on'],
    correct: 1,
    explanation: 'نستخدم at مع الأماكن المحددة مثل المطارات ومحطات القطار.',
  },
  // Vocabulary – phrasal verbs
  {
    id: 22,
    section: 'Vocabulary',
    question: 'Which phrasal verb means “to cancel”?',
    options: ['call off', 'take up', 'bring about', 'go on'],
    correct: 0,
    explanation: 'Call off تعني إلغاء أو إيقاف.',
  },
  // Reading – main idea
  {
    id: 23,
    section: 'Reading',
    question: 'Read the sentence: “The main function of the heart is to pump blood throughout the body.” What is the main idea?',
    options: [
      'The body needs blood.',
      'The heart pumps blood around the body.',
      'The heart is a muscle.',
      'Blood is red.'
    ],
    correct: 1,
    explanation: 'الجملة تركز على وظيفة القلب وهي ضخ الدم في أنحاء الجسم.',
  },
  // Grammar – articles
  {
    id: 24,
    section: 'Grammar',
    question: 'Choose the correct article: “____ University of Oxford is one of the oldest universities.”',
    options: ['A', 'An', 'The', 'No article'],
    correct: 2,
    explanation: 'نستخدم The مع أسماء الجامعات المعروفة لتعريفها.',
  },
  // Vocabulary – context meaning
  {
    id: 25,
    section: 'Vocabulary',
    question: 'In the sentence “The scientist proposed a hypothesis.”, the word “hypothesis” means:',
    options: ['conclusion', 'prediction', 'explanation', 'guess to be tested'],
    correct: 3,
    explanation: 'Hypothesis تعني فرضية تُختبر للتحقق من صحتها.',
  },
  // Grammar – tense
  {
    id: 26,
    section: 'Grammar',
    question: 'By next year, I ____ at this company for five years.',
    options: ['work', 'will have worked', 'have worked', 'will work'],
    correct: 1,
    explanation: 'الجملة تعبر عن مدة مستقبلية منذ الماضي، لذا نستخدم المستقبل التام (will have worked).',
  },
  // Vocabulary – collocations
  {
    id: 27,
    section: 'Vocabulary',
    question: 'Which of the following correctly completes the phrase? “Make ___ decision.”',
    options: ['a', 'an', 'the', 'to'],
    correct: 1,
    explanation: 'تستخدم an مع كلمة decision لأنها تبدأ بحرف ساكن لكن بالصوت المتحرك dɪˈsɪʒn.',
  },
  // Grammar – linking words
  {
    id: 28,
    section: 'Grammar',
    question: 'Which connector best fits the sentence? “She couldn’t attend, ___ she was ill.”',
    options: ['because', 'however', 'therefore', 'although'],
    correct: 0,
    explanation: 'Because تربط السبب بالنتيجة: لأنها كانت مريضة.',
  },
  // Reading – detail
  {
    id: 29,
    section: 'Reading',
    question: '“The Amazon rainforest is sometimes referred to as the lungs of the Earth.” Why?',
    options: [
      'Because it is full of animals.',
      'Because it produces a significant amount of oxygen.',
      'Because it is located near the equator.',
      'Because it rains a lot there.'
    ],
    correct: 1,
    explanation: 'يُطلق على الأمازون رئتا الأرض لأنه ينتج كمية كبيرة من الأكسجين.',
  },
  // Vocabulary – connotation
  {
    id: 30,
    section: 'Vocabulary',
    question: 'Which of the following words carries a negative connotation?',
    options: ['slender', 'skinny', 'slim', 'lean'],
    correct: 1,
    explanation: 'كلمة skinny تُستخدم غالباً بشكل سلبي للدلالة على النحافة الزائدة.',
  }
];

// Generate a bank of 600 questions by repeating the base questions 20 times with unique IDs.
const questionBank = [];
for (let i = 0; i < 20; i++) {
  baseQuestions.forEach((q, index) => {
    questionBank.push({
      ...q,
      id: q.id + i * baseQuestions.length,
    });
  });
}