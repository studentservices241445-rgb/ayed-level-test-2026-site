/*
 * results.js
 *
 * Reads the test result from localStorage, displays the scores
 * by section, generates a personalised study plan based on the
 * user's inputs and performance, and provides a call‑to‑action
 * recommending a suitable course.
 */

(function () {
  'use strict';
  const resultSummary = document.getElementById('resultSummary');
  const planSection = document.getElementById('planSection');
  const ctaSection = document.getElementById('ctaSection');
  const downloadShare = document.getElementById('downloadShare');
  const storedResult = localStorage.getItem('step_result');
  if (!storedResult) {
    resultSummary.innerHTML = '<p style="color: var(--muted-color);">لا توجد نتيجة مخزنة. يرجى إجراء الاختبار أولاً.</p>';
    return;
  }
  const { userInfo, scores, durationMinutes, date } = JSON.parse(storedResult);

  // Display scores summary
  function renderScores() {
    const table = document.createElement('table');
    table.className = 'plan-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>القسم</th>
          <th>النتيجة (٪)</th>
          <th>الوصف</th>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(scores).map(sec => {
          const score = scores[sec];
          let desc;
          if (score >= 85) desc = 'ممتاز';
          else if (score >= 70) desc = 'جيد جداً';
          else if (score >= 50) desc = 'متوسط';
          else desc = 'يحتاج تحسين';
          return `<tr><td>${translateSection(sec)}</td><td>${score}%</td><td>${desc}</td></tr>`;
        }).join('')}
      </tbody>
    `;
    const heading = document.createElement('h2');
    heading.style.color = 'var(--primary-color)';
    heading.style.marginBottom = '1rem';
    heading.textContent = `أهلاً ${userInfo.name}!`;
    const sub = document.createElement('p');
    sub.style.color = 'var(--muted-color)';
    sub.style.marginBottom = '1.5rem';
    sub.textContent = `هذه نتائجك حسب الأقسام مع مدة الاختبار ${durationMinutes} دقيقة.`;
    resultSummary.appendChild(heading);
    resultSummary.appendChild(sub);
    resultSummary.appendChild(table);
  }

  function translateSection(sec) {
    switch (sec) {
      case 'Reading': return 'القراءة';
      case 'Listening': return 'الاستماع';
      case 'Grammar': return 'القواعد';
      case 'Vocabulary': return 'المفردات';
      default: return sec;
    }
  }

  // Determine weakest sections
  function getWeakSections() {
    const entries = Object.entries(scores);
    entries.sort((a, b) => a[1] - b[1]);
    // Return top 2 weakest
    return entries.slice(0, 2).map(item => item[0]);
  }

  // Generate study plan
  function generatePlan() {
    const weakSections = getWeakSections();
    const daysCount = determineDaysCount(userInfo.examDate);
    const plan = [];
    // Create tasks for each day
    for (let day = 1; day <= daysCount; day++) {
      const tasks = [];
      // Always include general revision
      tasks.push('حل اختبار تجريبي قصير (10 أسئلة)');
      // For each weak section, add specific tasks
      weakSections.forEach(sec => {
        if (sec === 'Grammar') tasks.push('مراجعة قاعدة لغوية مع أمثلة وتطبيق عليها');
        if (sec === 'Reading') tasks.push('قراءة مقال قصير وتحليل الفكرة الرئيسية');
        if (sec === 'Vocabulary') tasks.push('حفظ 10 مفردات جديدة واستخدامها في جملة');
        if (sec === 'Listening') tasks.push('الاستماع إلى مقطع صوتي وتلخيصه');
      });
      tasks.push('كتابة ملاحظات على ما تعلمته اليوم');
      plan.push({ day, tasks });
    }
    return plan;
  }

  function determineDaysCount(examDate) {
    switch (examDate) {
      case 'within24': return 1;
      case 'within3': return 3;
      case 'within7': return 7;
      case 'within30': return 30;
      default: return 14;
    }
  }

  function renderPlan() {
    const plan = generatePlan();
    const heading = document.createElement('h2');
    heading.style.color = 'var(--primary-color)';
    heading.textContent = 'خطة المذاكرة';
    planSection.appendChild(heading);
    const table = document.createElement('table');
    table.className = 'plan-table';
    let html = '<thead><tr><th>اليوم</th><th>المهام</th></tr></thead><tbody>';
    plan.forEach(item => {
      html += `<tr><td>اليوم ${item.day}</td><td>${item.tasks.join('<br>')}</td></tr>`;
    });
    html += '</tbody>';
    table.innerHTML = html;
    planSection.appendChild(table);
    // Provide shareable text and copy button
    // Show share/download buttons after plan is generated
    if (downloadShare) {
      downloadShare.hidden = false;
      const downloadBtn = document.getElementById('downloadPlan');
      const shareBtn = document.getElementById('sharePlan');
      downloadBtn.addEventListener('click', () => {
        window.print();
      });
      shareBtn.addEventListener('click', () => {
        const text = generateShareableText(plan);
        navigator.clipboard.writeText(text).then(() => {
          shareBtn.textContent = 'تم نسخ الخطة!';
          setTimeout(() => shareBtn.textContent = 'مشاركة خطتي', 3000);
        });
      });
    }
  }

  function generateShareableText(plan) {
    // Compose a shareable message that begins with a verse and hadith
    let text = '﴿وَقُلْ رَّبِّ زِدْنِي عِلْمًا﴾\n';
    text += 'قال رسول الله ﷺ: «من سلك طريقًا يلتمس فيه علمًا، سهَّل الله له به طريقًا إلى الجنة»\n\n';
    text += 'هذه خطتي الشخصية التي حصلت عليها من برنامج تحديد المستوى:\n';
    plan.forEach(item => {
      text += `اليوم ${item.day}: ${item.tasks.join(' • ')}\n`;
    });
    text += '\nيمكنك الحصول على خطة مشابهة وتنظيم مذاكرتك مجانًا عبر الرابط:\n';
    text += window.location.origin + '/index.html';
    return text;
  }

  function recommendCourse() {
    // Basic recommendation logic: choose express for near exams, intensive for within 30 days,
    // comprehensive if exam not scheduled or far away, grammar/vocabulary courses if those are
    // weakest sections exclusively.
    const weakSections = getWeakSections();
    let courseId;
    if (userInfo.examDate === 'within24' || userInfo.examDate === 'within3') {
      courseId = 'express';
    } else if (userInfo.examDate === 'within7') {
      courseId = 'intensive';
    } else if (userInfo.examDate === 'within30') {
      courseId = 'intensive';
    } else {
      courseId = 'comprehensive';
    }
    // If both weak sections are grammar or vocabulary, suggest those specialised courses
    if (weakSections.includes('Grammar') && weakSections.includes('Vocabulary')) {
      courseId = 'grammar';
    } else if (weakSections[0] === 'Grammar') {
      courseId = 'grammar';
    } else if (weakSections[0] === 'Vocabulary') {
      courseId = 'vocabulary';
    }
    return courseId;
  }

  function renderCTA() {
    const recommended = recommendCourse();
    const titles = {
      intensive: 'الدورة المكثفة',
      comprehensive: 'الدورة الشاملة',
      express: 'دورة المسار السريع',
      vocabulary: 'دورة المفردات',
      grammar: 'دورة القواعد'
    };
    const heading = document.createElement('h2');
    heading.style.color = 'var(--primary-color)';
    heading.textContent = 'الدورة المقترحة لك';
    const desc = document.createElement('p');
    desc.style.color = 'var(--muted-color)';
    desc.style.margin = '0.5rem 0 1rem';
    desc.textContent = `نوصي بأن تشترك في ${titles[recommended]} لأنها الأنسب لاحتياجاتك وموعد اختبارك.`;
    const btn = document.createElement('a');
    btn.className = 'btn btn-primary';
    btn.href = `register.html?course=${recommended}`;
    btn.textContent = 'سجل الآن';
    ctaSection.appendChild(heading);
    ctaSection.appendChild(desc);
    ctaSection.appendChild(btn);
  }

  // Render all sections
  renderScores();
  renderPlan();
  // لإصدار البرنامج المجاني لا نقترح دورة، لذلك لا نستدعي renderCTA.
  // renderCTA();
})();