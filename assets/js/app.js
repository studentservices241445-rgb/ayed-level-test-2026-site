/*
 * Core JavaScript for the STEP level‑test site.
 *
 * This file handles global interactions such as the mobile navigation
 * toggler, injecting dynamic course cards and reviews, managing the
 * notification pop‑ups, copying the site link to the clipboard, and
 * implementing a simple chat assistant. If you wish to adjust the
 * behaviour of the site (e.g. notification frequency, chat replies),
 * modify the constants defined at the top of this file.
 */

(function () {
  'use strict';

  // ---- Data Sources ----
  // Course definitions. Each course includes a title, short description,
  // price, discounted price, discount deadline (as days from now) and image.
  const courses = [
    {
      id: 'intensive',
      title: 'الدورة المكثفة',
      description: 'برنامج مركز لمدة شهر يغطى كافة مهارات اللغة مع تدريبات يومية مكثفة.',
      price: 1200,
      discount: 900,
      image: 'assets/img/course1.jpg',
      duration: '30 يوم',
      includes: ['محاضرات مسجلة', 'ملفات PDF وملخصات', 'تمارين تفاعلية'],
    },
    {
      id: 'comprehensive',
      title: 'الدورة الشاملة',
      description: 'برنامج شامل يغطي جميع الأقسام على مدى ثمانية أسابيع بعمق وتفصيل.',
      price: 2200,
      discount: 1700,
      image: 'assets/img/course2.jpg',
      duration: '8 أسابيع',
      includes: ['دروس مباشرة', 'جلسات تفاعل أسبوعية', 'بنك أسئلة موسع'],
    },
    {
      id: 'express',
      title: 'دورة المسار السريع',
      description: 'مسار سريع للطلاب القريبين من اختبارهم ويركز على رفع الدرجة بسرعة.',
      price: 800,
      discount: 650,
      image: 'assets/img/course3.jpg',
      duration: '14 يوم',
      includes: ['تقييم شخصي', 'اختبارات تجريبية', 'توجيه يومي'],
    },
    {
      id: 'vocabulary',
      title: 'دورة المفردات',
      description: 'تعمق في المفردات الأكثر شيوعاً في اختبارات STEP مع تدريبات عملية.',
      price: 600,
      discount: 450,
      image: 'assets/img/course4.jpg',
      duration: '3 أسابيع',
      includes: ['قوائم الكلمات', 'بطاقات معاني', 'تطبيقات عملية'],
    },
    {
      id: 'grammar',
      title: 'دورة القواعد',
      description: 'تأسيس قوي في قواعد اللغة الإنجليزية مع أمثلة وتمارين متنوعة.',
      price: 500,
      discount: 400,
      image: 'assets/img/course5.jpg',
      duration: '3 أسابيع',
      includes: ['شروحات مبسطة', 'تدريبات تفاعلية', 'استراتيجية الحل'],
    },
  ];

  // Review/testimonial examples. Feel free to expand this list.
  const reviews = [
    {
      name: 'شهد المالكي',
      quote: 'الخطة خلتني ألتزم وصرت أعرف وش أراجع كل يوم. النصائح اليومية كانت ذهبية!'
    },
    {
      name: 'تركي القحطاني',
      quote: 'فكرة مشاركة الخطة تخلّي الالتزام أسهل. كنت أتردد، لكن يوم شفت الخطة عرفت وين الغلط.'
    },
    {
      name: 'منال التويجري',
      quote: 'التحديد عطاني مسار واضح، والأسئلة القوية مع شرح الإجابات كانت سبب في فهمي.'
    },
    {
      name: 'فهد السبيعي',
      quote: 'الواجهة مريحة، ما فيها زحمة. عطاني القرار الصحيح بسرعة: مكثفة ولا شاملة.'
    },
    {
      name: 'مي القحطاني',
      quote: 'الخطة يوم بيوم خلتني ما أضيع. حتى 15 دقيقة يومياً فرقت معي بشكل كبير.'
    }
  ];

  // Notification messages. Each entry must include a message; the name is
  // optional and will be chosen randomly from the names list below if omitted.
  const notificationMessages = [
    'أنهت خطة 7 أيام ✅ وتقول: “التحاسب اليومي فرق معي كثير.”',
    'شارك خطته مع صديقه 📤 — “إذا ما شاركتها ما ألتزم!”',
    'رفع مستواه في القراءة خلال أسبوع 📈 — “صرت أفهم أسرع.”',
    'تقول: “الخطة مرتبة وواضحة.”',
    'تنصح البنات: “شاركي خطتك مع صديقة… الالتزام يزيد.”',
    'يقول: “أفضل شي إن الخطة جاهزة للمشاركة كنص.”',
    'جرب الاختبار وخذ الخطة… بعدين قرر كيف تشترك.',
    'يشيد بالواجهة المريحة ويقول: “ما تحس بضغط.”',
    'تعلم أسلوب الإجابة — مو بس حفظ.',
    'النتيجة مع التحليل تعطيك اتجاه واضح.'
  ];

  // Names pool for notifications.
  const namesPool = [
    'تركي القحطاني', 'لمى عبدالله الحربي', 'الهنوف محمد', 'خالد عبدالرحمن', 'شهد المالكي',
    'سهام', 'رياض العنزي', 'هند العنزي', 'شهد الشهري', 'محمد الدوسري', 'تالا العصيمي',
    'حامد مسفر', 'ابراهيم العنزي', 'ريم الحربي', 'نواف الحربي', 'بدر', 'عائشة', 'عمار السلمي',
    'صالحه مجرشي', 'عبدالعزيز الغامدي', 'اسماء العميري', 'لميس محمد', 'انفال الراشد',
    'فيصل عسيري', 'خلود القرني', 'رسيل', 'عبدالله الثقفي', 'عبدالملك', 'محمد آل مرهون',
    'العنود الشهري', 'علي الشهراني', 'أحلام', 'أريام', 'احمد الشمري', 'راما الزهراني',
    'عاد الحربي', 'لمار آل رشيد', 'جوري الغامدي', 'أصيل حكمي', 'مرام المقرن', 'يزيد الرويلي',
    'خلود حسن', 'سكينه الجعفر', 'منى المطيري', 'فاطمه العسيري', 'يوسف', 'سلطان البقمي',
    'سعود البشري', 'عمر', 'بتول الحربي', 'أمجاد المالكي', 'بسام البشري', 'ليلة العنزي',
    'عبدالكريم العدواني', 'سيف هاشم', 'لينا القحطاني', 'رانيا يوسف القرني', 'منيره عبدالله',
    'ياسر ابراهيم', 'شوق جبريل', 'رنيم آل ثابت', 'مشاعل القحطاني', 'مالك', 'لمار العلوي',
    'هاجر العصيمي', 'انور الجهني', 'عبدالرحمن القحطاني', 'حنين', 'جنى', 'فاطمة', 'منيره',
    'أفراح', 'لمى الجهني', 'عبدالملك العتيبي', 'خالد العتيبي', 'سمية راشد'
  ];

  // Chat responses. Map of keywords to possible responses.
  const chatResponses = {
    'دورة': 'لدينا عدة دورات تناسب جميع المستويات. اطلع على صفحة الدورات أو اكتب اسم الدورة التي تناسبك.',
    'الخطة': 'بعد الانتهاء من الاختبار ستحصل على خطة مفصلة لنقاط ضعفك. يمكنك تحميلها أو مشاركتها.',
    'التسجيل': 'للتسجيل في الدورة المناسبة، انتقل إلى صفحة التسجيل واملأ النموذج مع إرفاق الإيصال.',
    'السلام': 'وعليكم السلام! كيف يمكنني مساعدتك اليوم؟',
    'مرحبا': 'أهلاً وسهلاً! أنا هنا للإجابة على استفساراتك حول الاختبار والدورات.',
    'شكرا': 'العفو! بالتوفيق في رحلتك التعليمية.',
    'help': 'يمكنك الاستفسار عن الاختبار، الخطط، الدورات، أو التسجيل وسأحاول مساعدتك.',
  };

  // Notification interval in milliseconds (45 seconds). Change as needed.
  const NOTIF_INTERVAL = 45000;

  // Predefined share message for the entire programme. This text will be
  // copied to the clipboard when the user clicks the “نسخ رابط البرنامج” button.
  // It includes a Qur’anic verse and a hadith to inspire students, followed
  // by a brief explanation of the programme and a link back to the site.
  function getProgrammeShareMessage() {
    const verse = '﴿وَقُلْ رَّبِّ زِدْنِي عِلْمًا﴾';
    const hadith = 'قال رسول الله ﷺ: «من سلك طريقًا يلتمس فيه علمًا، سهَّل الله له به طريقًا إلى الجنة»';
    let message = `${verse}\n${hadith}\n\n`;
    message += 'برنامج تحديد المستوى هذا يساعدك على قياس مستواك في اللغة الإنجليزية وتنظيم خطة مذاكرة شخصية تعتمد على نقاط قوتك وضعفك، ويوفر اختبارات محاكية وخططًا يومية مفصلة.\n\n';
    message += 'جرِّبه الآن مجانًا عبر الرابط:\n';
    message += window.location.origin + '/index.html';
    return message;
  }

  // DOM Elements
  const navMenu = document.getElementById('navMenu');
  const menuToggle = document.getElementById('menuToggle');
  const shareBtn = document.getElementById('shareBtn');
  const courseList = document.getElementById('courseList');
  const reviewList = document.getElementById('reviewList');
  const notificationContainer = document.getElementById('notificationContainer');
  const assistantBtn = document.getElementById('assistantBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  /* Utility functions */

  // Format price to Arabic with currency SAR
  function formatPrice(value) {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value);
  }

  // Toggle mobile navigation
  function toggleNav() {
    navMenu.classList.toggle('active');
  }

  // Inject course cards into DOM
  function renderCourses() {
    // في الإصدار المجاني لا يتم عرض الدورات، لذا نتخطى إنشاء بطاقات الدورات
    if (!courseList) return;
    courseList.innerHTML = '';
  }

  // Inject reviews into DOM
  function renderReviews() {
    if (!reviewList) return;
    reviewList.innerHTML = '';
    reviews.forEach(item => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="name">${item.name}</div>
        <div class="quote">${item.quote}</div>
      `;
      reviewList.appendChild(card);
    });
  }

  // Copy programme link to clipboard
  function copyProgrammeLink() {
    // Build share message dynamically including a verse, hadith and the site link
    const message = getProgrammeShareMessage();
    navigator.clipboard.writeText(message).then(() => {
      if (shareBtn) {
        shareBtn.textContent = 'تم نسخ الرسالة!';
        setTimeout(() => {
          shareBtn.textContent = 'نسخ رابط البرنامج';
        }, 3000);
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  // Create a notification message and display it
  function showNotification() {
    if (!notificationContainer) return;
    const notification = document.createElement('div');
    notification.className = 'notification';
    const name = namesPool[Math.floor(Math.random() * namesPool.length)];
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    notification.textContent = `${name}: ${message}`;
    notificationContainer.appendChild(notification);
    // Trigger animation after slight delay to allow CSS transitions
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    // Remove notification after 6 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 6000);
  }

  // Cycle notifications automatically
  function startNotifications() {
    // Immediately show one notification on load
    showNotification();
    setInterval(showNotification, NOTIF_INTERVAL);
  }

  // Chat assistant functions
  function addMessage(text, fromUser) {
    const messageEl = document.createElement('div');
    messageEl.style.marginBottom = '0.5rem';
    messageEl.style.display = 'flex';
    messageEl.style.justifyContent = fromUser ? 'flex-end' : 'flex-start';
    const bubble = document.createElement('div');
    bubble.style.maxWidth = '70%';
    bubble.style.padding = '0.5rem 0.75rem';
    bubble.style.borderRadius = '12px';
    bubble.style.background = fromUser ? '#2d3748' : '#ffd700';
    bubble.style.color = fromUser ? '#fff' : '#1a202c';
    bubble.style.fontSize = '0.85rem';
    bubble.textContent = text;
    messageEl.appendChild(bubble);
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage(msg, true);
    chatInput.value = '';
    // Simulate typing status
    const status = document.getElementById('chatStatus');
    status.textContent = 'جاري الكتابة…';
    setTimeout(() => {
      // Determine response
      let response = null;
      const lower = msg.toLowerCase();
      for (const key in chatResponses) {
        if (lower.includes(key)) {
          response = chatResponses[key];
          break;
        }
      }
      if (!response) {
        response = 'عذراً، لم أفهم طلبك تماماً. يمكنك الاطلاع على صفحات الموقع أو طرح سؤال آخر.';
      }
      addMessage(response, false);
      status.textContent = 'متصل';
    }, 1000);
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Render dynamic content
    renderCourses();
    renderReviews();
    startNotifications();

    // Register the service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(err => {
        console.error('Service worker registration failed:', err);
      });
    }
  });
  if (menuToggle) menuToggle.addEventListener('click', toggleNav);
  if (shareBtn) shareBtn.addEventListener('click', copyProgrammeLink);
  if (assistantBtn) assistantBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
  });
  if (sendBtn) sendBtn.addEventListener('click', handleUserMessage);
  if (chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserMessage();
    }
  });

  // PWA installation handling
  let deferredInstallPrompt;
  const installBtn = document.getElementById('installBtn');
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredInstallPrompt = e;
    // Show the install button if available
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.addEventListener('click', () => {
        // Hide the button to avoid double clicks
        installBtn.disabled = true;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choiceResult) => {
          deferredInstallPrompt = null;
          installBtn.style.display = 'none';
        });
      });
    }
  });

  // Expose courses array globally so that other scripts (e.g. register.js) can
  // reference it for course details. Without this line, courses would be
  // scoped to this closure only.
  window.courses = courses;
})();