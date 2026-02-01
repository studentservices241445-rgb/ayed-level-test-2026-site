/*
 * quiz.js
 *
 * Enables users to generate custom quizzes based on a selected section
 * and desired number of questions. Provides immediate feedback and
 * calculates a simple score at the end. Users can also share their
 * result as a text message.
 */

(function () {
  'use strict';
  if (typeof questionBank === 'undefined') {
    console.error('Question bank not loaded for quiz.');
    return;
  }
  // DOM elements
  const quizForm = document.getElementById('quizForm');
  const quizSectionContainer = document.getElementById('quizSectionContainer');
  const quizQuestionContainer = document.getElementById('quizQuestionContainer');
  const quizPrevBtn = document.getElementById('quizPrevBtn');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizProgress = document.getElementById('quizProgress');
  const quizScoreDiv = document.getElementById('quizScore');
  const quizShareContainer = document.getElementById('quizShareContainer');
  const quizShareBtn = document.getElementById('quizShareBtn');
  // State
  let quizQuestions = [];
  let quizAnswers = [];
  let quizIndex = 0;
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  function filterBySection(section) {
    if (section === 'Mixed') {
      return [...questionBank];
    }
    return questionBank.filter(q => q.section === section);
  }
  function startQuiz(section, count) {
    const pool = filterBySection(section);
    shuffle(pool);
    quizQuestions = pool.slice(0, Math.min(count, pool.length));
    quizAnswers = new Array(quizQuestions.length).fill(null);
    quizIndex = 0;
    document.getElementById('quizFormSection').style.display = 'none';
    quizSectionContainer.style.display = 'block';
    quizScoreDiv.textContent = '';
    quizShareContainer.hidden = true;
    renderQuizQuestion();
    updateQuizProgress();
  }
  function renderQuizQuestion() {
    const qObj = quizQuestions[quizIndex];
    if (!qObj) return;
    quizQuestionContainer.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'question-card';
    const qText = document.createElement('h3');
    qText.style.marginBottom = '1rem';
    qText.textContent = `${quizIndex + 1}. ${qObj.question}`;
    card.appendChild(qText);
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    qObj.options.forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option';
      optDiv.textContent = opt;
      if (quizAnswers[quizIndex] !== null) {
        if (idx === quizAnswers[quizIndex].choice) {
          optDiv.classList.add(quizAnswers[quizIndex].choice === qObj.correct ? 'correct' : 'wrong');
        } else if (idx === qObj.correct) {
          optDiv.classList.add('correct');
        }
      }
      optDiv.addEventListener('click', () => handleQuizSelect(idx));
      optionsDiv.appendChild(optDiv);
    });
    card.appendChild(optionsDiv);
    const expl = document.createElement('div');
    expl.style.marginTop = '0.75rem';
    expl.style.color = 'var(--muted-color)';
    expl.style.fontSize = '0.9rem';
    if (quizAnswers[quizIndex] !== null) {
      expl.textContent = `التفسير: ${qObj.explanation}`;
    }
    card.appendChild(expl);
    quizQuestionContainer.appendChild(card);
    quizPrevBtn.disabled = quizIndex === 0;
    quizNextBtn.textContent = quizIndex === quizQuestions.length - 1 ? 'إنهاء' : 'التالي';
  }
  function handleQuizSelect(choiceIdx) {
    const qObj = quizQuestions[quizIndex];
    if (quizAnswers[quizIndex] !== null) return;
    const isCorrect = choiceIdx === qObj.correct;
    quizAnswers[quizIndex] = { choice: choiceIdx, correct: isCorrect };
    renderQuizQuestion();
    setTimeout(() => {
      if (quizIndex < quizQuestions.length - 1) {
        quizIndex++;
        renderQuizQuestion();
        updateQuizProgress();
      } else {
        finishQuiz();
      }
    }, 800);
  }
  function finishQuiz() {
    // Calculate score percentage
    const correctCount = quizAnswers.filter(ans => ans && ans.correct).length;
    const percent = Math.round((correctCount / quizQuestions.length) * 100);
    quizScoreDiv.textContent = `نتيجتك: ${correctCount} من ${quizQuestions.length} (${percent}٪)`;
    quizShareContainer.hidden = false;
    quizShareBtn.addEventListener('click', () => {
      // Include verse and hadith in the quiz share message
      const verse = '﴿وَقُلْ رَّبِّ زِدْنِي عِلْمًا﴾';
      const hadith = 'قال رسول الله ﷺ: «من سلك طريقًا يلتمس فيه علمًا، سهَّل الله له به طريقًا إلى الجنة»';
      const shareText = `${verse}\n${hadith}\n\nلقد أجريت كويزًا مخصصًا في برنامج تحديد المستوى وأحرزت ${correctCount}/${quizQuestions.length} (${percent}٪). البرنامج يساعدك على تقييم مهاراتك وتنظيم خطة مذاكرة.\n\nجربه الآن:\n${window.location.origin + '/index.html'}`;
      navigator.clipboard.writeText(shareText).then(() => {
        quizShareBtn.textContent = 'تم النسخ!';
        setTimeout(() => quizShareBtn.textContent = 'مشاركة نتيجتي', 3000);
      });
    }, { once: true });
  }
  function updateQuizProgress() {
    const pct = (quizIndex / quizQuestions.length) * 100;
    quizProgress.style.width = pct + '%';
  }
  // Navigation buttons
  if (quizPrevBtn) quizPrevBtn.addEventListener('click', () => {
    if (quizIndex > 0) {
      quizIndex--;
      renderQuizQuestion();
      updateQuizProgress();
    }
  });
  if (quizNextBtn) quizNextBtn.addEventListener('click', () => {
    if (quizIndex === quizQuestions.length - 1) {
      finishQuiz();
    } else {
      if (quizAnswers[quizIndex] === null) {
        alert('اختر إجابة قبل المتابعة');
        return;
      }
      quizIndex++;
      renderQuizQuestion();
      updateQuizProgress();
    }
  });
  // Form submission
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const section = document.getElementById('quizSection').value;
      const count = parseInt(document.getElementById('quizCount').value, 10);
      if (!section) {
        alert('يرجى اختيار القسم');
        return;
      }
      startQuiz(section, count);
    });
  }
})();