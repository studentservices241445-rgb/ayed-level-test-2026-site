/*
 * level-test.js
 *
 * Handles the pre‑test form, the dynamic multiple‑choice test, immediate
 * feedback to the user and saving of results to localStorage. After
 * completing the test, the user is redirected to the results page.
 */

(function () {
  'use strict';
  // Ensure questionBank is available
  if (typeof questionBank === 'undefined') {
    console.error('Question bank not loaded.');
    return;
  }
  const MAX_QUESTIONS = 50;
  let testQuestions = [];
  let currentIndex = 0;
  let answers = [];
  let userInfo = {};
  let startTime;

  // DOM Elements
  const preTestForm = document.getElementById('preTestForm');
  const infoForm = document.getElementById('infoForm');
  const testSection = document.getElementById('testSection');
  const questionContainer = document.getElementById('questionContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressInner = document.getElementById('progressInner');
  const majorGroup = document.getElementById('majorGroup');
  const stageSelect = document.getElementById('stage');
  const tookBefore = document.getElementById('tookBefore');
  const previousScoreGroup = document.getElementById('previousScoreGroup');
  // New fields
  const courseHistory = document.getElementById('courseHistory');
  const courseFeedbackGroup = document.getElementById('courseFeedbackGroup');
  const sourceSelect = document.getElementById('source');
  const programGoal = document.getElementById('programGoal');

  // Show/hide major field based on stage
  if (stageSelect) {
    stageSelect.addEventListener('change', () => {
      if (stageSelect.value === 'Other') {
        majorGroup.style.display = 'block';
      } else {
        majorGroup.style.display = 'none';
      }
    });
  }
  // Show/hide previous score fields
  if (tookBefore) {
    tookBefore.addEventListener('change', () => {
      if (tookBefore.value === 'yes') {
        previousScoreGroup.style.display = 'block';
      } else {
        previousScoreGroup.style.display = 'none';
      }
    });
  }

  // Show/hide course feedback group depending on course history
  if (courseHistory) {
    courseHistory.addEventListener('change', () => {
      if (courseHistory.value && courseHistory.value !== 'none') {
        courseFeedbackGroup.style.display = 'block';
      } else {
        courseFeedbackGroup.style.display = 'none';
      }
    });
  }

  // Random shuffle helper
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Start the test: prepare question set and initial state
  function startTest() {
    // Check if user has completed a test within the last 24 hours
    const lastAttempt = localStorage.getItem('step_last_attempt');
    if (lastAttempt) {
      const diffMs = Date.now() - parseInt(lastAttempt, 10);
      const hoursSince = diffMs / (1000 * 60 * 60);
      if (hoursSince < 24) {
        const remaining = Math.ceil(24 - hoursSince);
        alert(`لا يمكنك إعادة الاختبار الآن. الرجاء الانتظار ${remaining} ساعة قبل المحاولة مرة أخرى.`);
        return;
      }
    }
    // Shuffle question bank and select first MAX_QUESTIONS questions
    const questionsCopy = [...questionBank];
    shuffle(questionsCopy);
    testQuestions = questionsCopy.slice(0, Math.min(MAX_QUESTIONS, questionsCopy.length));
    currentIndex = 0;
    answers = new Array(testQuestions.length).fill(null);
    startTime = Date.now();
    preTestForm.style.display = 'none';
    testSection.style.display = 'block';
    renderQuestion();
    updateProgress();
  }

  // Render the current question
  function renderQuestion() {
    const questionObj = testQuestions[currentIndex];
    if (!questionObj) return;
    questionContainer.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'question-card';
    // Question text
    const qText = document.createElement('h3');
    qText.style.marginBottom = '1rem';
    qText.textContent = `${currentIndex + 1}. ${questionObj.question}`;
    card.appendChild(qText);
    // Options container
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    questionObj.options.forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option';
      optDiv.textContent = opt;
      // If this option was previously selected
      if (answers[currentIndex] !== null) {
        if (idx === answers[currentIndex].choice) {
          optDiv.classList.add(answers[currentIndex].choice === questionObj.correct ? 'correct' : 'wrong');
        } else if (idx === questionObj.correct) {
          // highlight correct answer after selection
          optDiv.classList.add('correct');
        }
      }
      optDiv.addEventListener('click', () => handleOptionSelect(idx));
      optionsDiv.appendChild(optDiv);
    });
    card.appendChild(optionsDiv);
    // Explanation area
    const expl = document.createElement('div');
    expl.style.marginTop = '0.75rem';
    expl.style.color = 'var(--muted-color)';
    expl.style.fontSize = '0.9rem';
    expl.id = 'explanation';
    if (answers[currentIndex] !== null) {
      expl.textContent = `التفسير: ${questionObj.explanation}`;
    }
    card.appendChild(expl);
    questionContainer.appendChild(card);
    // Update buttons text
    prevBtn.disabled = currentIndex === 0;
    nextBtn.textContent = currentIndex === testQuestions.length - 1 ? 'إنهاء الاختبار' : 'التالي';
  }

  // Handle answer selection
  function handleOptionSelect(choiceIdx) {
    const questionObj = testQuestions[currentIndex];
    // If already answered, ignore new selections
    if (answers[currentIndex] !== null) return;
    const isCorrect = choiceIdx === questionObj.correct;
    answers[currentIndex] = { choice: choiceIdx, correct: isCorrect };
    // Re-render to show colours and explanation
    renderQuestion();
    // Auto-advance after a short delay, except at last question
    setTimeout(() => {
      if (currentIndex < testQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
        updateProgress();
      } else {
        finishTest();
      }
    }, 800);
  }

  // Next/Previous navigation
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
      updateProgress();
    }
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    // If last question, finish test
    if (currentIndex === testQuestions.length - 1) {
      finishTest();
    } else {
      // If not answered, prevent skipping
      if (answers[currentIndex] === null) {
        alert('فضلاً اختر إجابة قبل الانتقال.');
        return;
      }
      currentIndex++;
      renderQuestion();
      updateProgress();
    }
  });

  function updateProgress() {
    const percent = ((currentIndex) / testQuestions.length) * 100;
    progressInner.style.width = percent + '%';
  }

  // Process results and store in localStorage, then redirect
  function finishTest() {
    // Compute scores by section
    const sectionTotals = {};
    const sectionCorrect = {};
    testQuestions.forEach((q, i) => {
      const section = q.section;
      sectionTotals[section] = (sectionTotals[section] || 0) + 1;
      if (answers[i] && answers[i].correct) {
        sectionCorrect[section] = (sectionCorrect[section] || 0) + 1;
      }
    });
    const scores = {};
    for (const sec in sectionTotals) {
      scores[sec] = Math.round((sectionCorrect[sec] || 0) / sectionTotals[sec] * 100);
    }
    // Save to localStorage
    const result = {
      userInfo,
      answers,
      scores,
      date: new Date().toISOString(),
      durationMinutes: Math.round((Date.now() - startTime) / 60000),
    };
    localStorage.setItem('step_result', JSON.stringify(result));
    localStorage.setItem('step_test_completed', 'true');
    localStorage.setItem('step_last_attempt', Date.now().toString());
    // Redirect to results page
    window.location.href = 'results.html';
  }

  // Collect user information from form
  if (infoForm) {
    infoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation: ensure required fields are filled
      const name = document.getElementById('name').value.trim();
      if (!name) {
        alert('يرجى إدخال اسمك.');
        return;
      }
      userInfo.name = name;
      userInfo.goal = document.getElementById('goal').value;
      userInfo.region = document.getElementById('region').value;
      userInfo.difficulty = document.getElementById('difficulty').value;
      userInfo.studyHours = document.getElementById('studyHours').value || 'غير محدد';
      userInfo.studyTime = document.getElementById('studyTime').value;
      userInfo.stage = document.getElementById('stage').value;
      userInfo.major = document.getElementById('major').value || '';
      userInfo.studyStyle = document.getElementById('studyStyle').value;
      userInfo.tookBefore = document.getElementById('tookBefore').value;
      if (userInfo.tookBefore === 'yes') {
        userInfo.previousScore = document.getElementById('previousScore').value;
        userInfo.targetScore = document.getElementById('targetScore').value;
      }
      userInfo.examDate = document.getElementById('examDate').value;
      userInfo.comments = document.getElementById('comments').value;
      // New fields
      userInfo.courseHistory = courseHistory ? courseHistory.value : '';
      if (courseFeedbackGroup && courseFeedbackGroup.style.display !== 'none') {
        const checks = courseFeedbackGroup.querySelectorAll('input[type="checkbox"]:checked');
        userInfo.courseFeedback = Array.from(checks).map(ch => ch.value);
      } else {
        userInfo.courseFeedback = [];
      }
      userInfo.source = sourceSelect ? sourceSelect.value : '';
      userInfo.programGoal = programGoal ? programGoal.value : '';
      // Save userInfo to localStorage in case of accidental refresh
      localStorage.setItem('step_user_info', JSON.stringify(userInfo));
      startTest();
    });
  }
})();