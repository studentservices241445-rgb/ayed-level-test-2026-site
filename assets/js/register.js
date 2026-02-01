/*
 * register.js
 *
 * Fills the course information based on the URL parameter, manages
 * conditional fields in the registration form and handles basic
 * submission behaviour (no actual backend). Users are encouraged to
 * complete the level test first and include their plan when registering.
 */

(function () {
  'use strict';
  // Courses data should be in sync with app.js definitions. If app.js has
  // defined window.courses, we can reuse it; otherwise, define a local copy.
  const coursesData = window.courses || [
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

  const courseInfoDiv = document.getElementById('courseInfo');
  const registerForm = document.getElementById('registerForm');
  const didLevelTest = document.getElementById('didLevelTest');
  const planField = document.getElementById('planField');
  const noPlanNotice = document.getElementById('noPlanNotice');
  const paymentMethod = document.getElementById('paymentMethod');
  const bankDetails = document.getElementById('bankDetails');
  const telegramDetails = document.getElementById('telegramDetails');
  const successMsg = document.getElementById('successMsg');

  // Parse query param
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  function showCourseInfo() {
    const selectedId = getQueryParam('course');
    const course = coursesData.find(c => c.id === selectedId) || coursesData[0];
    courseInfoDiv.innerHTML = `
      <h2 style="color: var(--primary-color); margin-bottom:0.5rem;">${course.title}</h2>
      <p style="color: var(--muted-color); margin-bottom:0.5rem;">${course.description}</p>
      <ul style="color: var(--muted-color); margin-bottom:0.5rem; list-style:inside circle;">
        ${course.includes.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <p style="color: var(--primary-color); font-weight:bold;">السعر الحالي: ${new Intl.NumberFormat('ar-SA', { style:'currency', currency:'SAR', minimumFractionDigits:0 }).format(course.discount)}
        <span style="text-decoration:line-through; color:#888; font-size:0.9rem;">${new Intl.NumberFormat('ar-SA', { style:'currency', currency:'SAR', minimumFractionDigits:0 }).format(course.price)}</span></p>
    `;
  }
  // Show/hide plan field
  didLevelTest.addEventListener('change', () => {
    if (didLevelTest.value === 'yes') {
      planField.style.display = 'block';
      noPlanNotice.style.display = 'none';
    } else if (didLevelTest.value === 'no') {
      planField.style.display = 'none';
      noPlanNotice.style.display = 'block';
    } else {
      planField.style.display = 'none';
      noPlanNotice.style.display = 'none';
    }
  });
  // Show/hide payment details
  paymentMethod.addEventListener('change', () => {
    if (paymentMethod.value === 'bank') {
      bankDetails.style.display = 'block';
      telegramDetails.style.display = 'none';
      document.getElementById('receipt').required = true;
    } else if (paymentMethod.value === 'telegram') {
      bankDetails.style.display = 'none';
      telegramDetails.style.display = 'block';
      document.getElementById('receipt').required = false;
    } else {
      bankDetails.style.display = 'none';
      telegramDetails.style.display = 'none';
      document.getElementById('receipt').required = false;
    }
  });
  // Form submission
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Basic validation for plan if required
    if (didLevelTest.value === 'yes' && !document.getElementById('planText').value.trim()) {
      alert('يرجى إرفاق خطتك أو نسخها في الحقل المخصص.');
      return;
    }
    if (paymentMethod.value === 'bank') {
      const receipt = document.getElementById('receipt');
      if (!receipt.files || receipt.files.length === 0) {
        alert('يرجى إرفاق صورة إيصال التحويل البنكي.');
        return;
      }
    }
    // Simulate sending request
    successMsg.style.display = 'block';
    registerForm.reset();
    bankDetails.style.display = 'none';
    telegramDetails.style.display = 'none';
    planField.style.display = 'none';
    noPlanNotice.style.display = 'none';
  });
  // Run on load
  document.addEventListener('DOMContentLoaded', () => {
    showCourseInfo();
  });
})();