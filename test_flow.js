// Comprehensive End-to-End Test Suite for QuizNest
const baseUrl = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get('content-type');
  const data = contentType && contentType.includes('application/json') ? await res.json() : null;
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('========================================');
  console.log('   QuizNest Complete Full-Stack Test   ');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('--- 1. Health Check ---');
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'ok', 'API Health check passed');

    // 2. Fetch Quizzes (Public)
    console.log('\n--- 2. Public Quizzes Endpoint ---');
    const quizzesRes = await request('/quizzes');
    assert(quizzesRes.status === 200, 'Fetched quizzes successfully');
    assert(quizzesRes.data.length >= 5, `Found ${quizzesRes.data.length} quizzes in catalogue`);
    const firstQuiz = quizzesRes.data[0];
    assert(firstQuiz.questionCount >= 10, `First quiz "${firstQuiz.title}" has ${firstQuiz.questionCount} questions`);

    // 3. Student Registration Flow
    console.log('\n--- 3. Student Registration Flow ---');
    const testEmail = `student_${Date.now()}@test.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Automated Test Student',
        email: testEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      },
    });
    assert(regRes.status === 201, 'Student account registered successfully');
    assert(regRes.data.user.role === 'student', 'User role defaulted strictly to student');
    assert(!!regRes.data.token, 'Registration issued valid JWT token');
    const studentToken = regRes.data.token;

    // Duplicate email registration should fail
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Another User',
        email: testEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      },
    });
    assert(dupRes.status === 400, 'Duplicate email correctly rejected with 400 error');

    // 4. Student Login Flow
    console.log('\n--- 4. Student Login Flow ---');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'Password@123',
      },
    });
    assert(loginRes.status === 200, 'Student login successful');
    assert(loginRes.data.user.name === 'Automated Test Student', 'User profile returned in login payload');

    // Invalid login check
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'WrongPassword' },
    });
    assert(badLogin.status === 401, 'Incorrect password rejected with 401');

    // 5. Fetch Quiz Questions for Taking Quiz (sanitized - no correctAnswer)
    console.log('\n--- 5. Quiz Taking & Sanitization Check ---');
    const quizTakeRes = await request(`/quizzes/${firstQuiz._id}/questions`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(quizTakeRes.status === 200, 'Quiz questions retrieved for student');
    const q1 = quizTakeRes.data.questions[0];
    assert(q1.correctAnswer === undefined, 'Security: Correct answer is NOT exposed to student taking quiz');
    assert(q1.options.length === 4, 'Question provides exactly 4 multiple choice options');

    // 6. Submit Quiz Result
    console.log('\n--- 6. Quiz Submission & Automatic Evaluation ---');
    // Prepare answers: answer option 'B' for all questions
    const answers = {};
    quizTakeRes.data.questions.forEach((q) => {
      answers[q._id] = 'B';
    });

    const submitRes = await request('/results', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        quizId: firstQuiz._id,
        answers,
      },
    });
    assert(submitRes.status === 201, 'Quiz successfully submitted and scored');
    const resultDoc = submitRes.data.result;
    assert(typeof resultDoc.score === 'number', `Computed score: ${resultDoc.score}/${resultDoc.totalQuestions}`);
    assert(typeof resultDoc.percentage === 'number', `Computed percentage: ${resultDoc.percentage}%`);
    assert(resultDoc.answers.length === resultDoc.totalQuestions, 'Evaluated all questions in answer breakdown');

    // 7. Student My Attempts
    console.log('\n--- 7. Student My Attempts ---');
    const myAttemptsRes = await request('/results/my-results', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(myAttemptsRes.status === 200, 'Fetched student attempts');
    assert(myAttemptsRes.data.length >= 1, `Found ${myAttemptsRes.data.length} recorded attempt(s)`);

    // 8. Result by ID with Answer Review
    console.log('\n--- 8. Result Details & Answer Review ---');
    const singleResultRes = await request(`/results/${resultDoc._id}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(singleResultRes.status === 200, 'Fetched single result by ID');
    assert(singleResultRes.data.answers[0].correctAnswer !== undefined, 'Review exposes correctAnswer for post-submission learning');

    // 9. Student Profile & Dashboard Stats
    console.log('\n--- 9. Student Profile & Statistics ---');
    const profileRes = await request('/users/profile', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(profileRes.status === 200, 'Fetched student profile');
    assert(profileRes.data.stats.quizzesAttempted >= 1, `quizzesAttempted is ${profileRes.data.stats.quizzesAttempted}`);

    // 10. Student Access to Admin Route Blocked
    console.log('\n--- 10. Authorization Guard Check ---');
    const blockedAdminRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(blockedAdminRes.status === 403, 'Student blocked from admin route with 403 Forbidden');

    // 11. Admin Login Flow
    console.log('\n--- 11. Admin Authentication ---');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@quiznest.com',
        password: 'Admin@123',
      },
    });
    assert(adminLoginRes.status === 200, 'Admin login successful');
    assert(adminLoginRes.data.user.role === 'admin', 'Admin role verified in token/payload');
    const adminToken = adminLoginRes.data.token;

    // 12. Admin Stats
    console.log('\n--- 12. Admin Dashboard Stats ---');
    const adminStatsRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminStatsRes.status === 200, 'Admin stats retrieved');
    assert(adminStatsRes.data.totalQuizzes >= 5, `Total Quizzes: ${adminStatsRes.data.totalQuizzes}`);
    assert(adminStatsRes.data.totalStudents >= 2, `Total Students: ${adminStatsRes.data.totalStudents}`);

    // 13. Admin Quiz Management (Create, Edit, Delete)
    console.log('\n--- 13. Admin Quiz CRUD ---');
    const newQuizRes = await request('/quizzes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Python Essentials Test',
        category: 'Programming',
        difficulty: 'Easy',
        description: 'Core concepts of Python 3 programming language.',
      },
    });
    assert(newQuizRes.status === 201, 'Admin created new quiz');
    const createdQuizId = newQuizRes.data.quiz._id;

    const editQuizRes = await request(`/quizzes/${createdQuizId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Python Essentials (Updated)',
        category: 'Programming',
        difficulty: 'Medium',
        description: 'Updated description for Python 3.',
      },
    });
    assert(editQuizRes.status === 200, 'Admin updated quiz metadata');

    // 14. Admin Question Management (Add, Edit, Delete)
    console.log('\n--- 14. Admin Question Management ---');
    const addQRes = await request(`/quizzes/${createdQuizId}/questions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        question: 'Which keyword defines a function in Python?',
        options: ['func', 'def', 'function', 'lambda'],
        correctAnswer: 'B',
      },
    });
    assert(addQRes.status === 201, 'Admin added question to quiz');
    const createdQId = addQRes.data.question._id;

    // Admin view questions includes correctAnswer
    const adminQList = await request(`/quizzes/${createdQuizId}/questions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminQList.status === 200, 'Admin fetched questions list');
    assert(adminQList.data.questions[0].correctAnswer === 'B', 'Admin view includes correct answer');

    // Edit Question
    const editQRes = await request(`/questions/${createdQId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        question: 'Which keyword defines a standard function in Python?',
        options: ['def', 'func', 'function', 'lambda'],
        correctAnswer: 'A',
      },
    });
    assert(editQRes.status === 200, 'Admin updated question');

    // Delete Question
    const delQRes = await request(`/questions/${createdQId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delQRes.status === 200, 'Admin deleted question');

    // Delete Quiz
    const delQuizRes = await request(`/quizzes/${createdQuizId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delQuizRes.status === 200, 'Admin deleted quiz');

    // 15. Admin Student Management
    console.log('\n--- 15. Admin Student Management ---');
    const studentsRes = await request('/admin/students', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(studentsRes.status === 200, 'Admin fetched student list');
    assert(studentsRes.data.length >= 1, `Found ${studentsRes.data.length} registered students`);
    // Security check: ensure passwords are never exposed
    assert(studentsRes.data[0].password === undefined, 'Security: Student passwords omitted from admin response');

    // 16. Admin Results Management
    console.log('\n--- 16. Admin Results Management ---');
    const allResultsRes = await request('/admin/results', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(allResultsRes.status === 200, 'Admin fetched all submissions');
    assert(allResultsRes.data.length >= 1, `Found ${allResultsRes.data.length} total quiz attempts`);

    // Filter results by quiz
    const filteredResults = await request(`/admin/results?quizId=${firstQuiz._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(filteredResults.status === 200, 'Admin filtered results by quiz');

    console.log('\n========================================');
    console.log(`Test Execution Completed: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================');

    if (failed === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test suite uncaught error:', err);
    process.exit(1);
  }
}

runTests();
