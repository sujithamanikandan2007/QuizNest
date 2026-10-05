const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Submit a completed quiz and evaluate score
// @route   POST /api/results
// @access  Private / Student
const submitQuizResult = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user._id;

    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required.' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Retrieve all questions for this quiz from DB
    const questions = await Question.find({ quizId }).sort({ createdAt: 1 });
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'This quiz has no questions available.' });
    }

    let score = 0;
    const evaluatedAnswers = [];

    questions.forEach((q) => {
      // Find selected answer for this question
      let selected = '';
      if (answers && typeof answers === 'object') {
        if (answers[q._id.toString()] !== undefined) {
          selected = answers[q._id.toString()];
        } else if (Array.isArray(answers)) {
          const item = answers.find(
            (a) => a.questionId && a.questionId.toString() === q._id.toString()
          );
          if (item) selected = item.selectedAnswer;
        }
      }

      // Format answers: check if selected matches letter ('A', 'B', 'C', 'D') or option text
      const cleanSelected = String(selected || '').trim();
      const correctLetter = q.correctAnswer; // 'A', 'B', 'C', or 'D'
      const letterIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
      const correctText = letterIndex >= 0 ? q.options[letterIndex] : '';

      let isCorrect = false;
      if (cleanSelected) {
        if (cleanSelected.toUpperCase() === correctLetter.toUpperCase()) {
          isCorrect = true;
        } else if (
          correctText &&
          cleanSelected.toLowerCase() === correctText.toLowerCase()
        ) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        score += 1;
      }

      evaluatedAnswers.push({
        questionId: q._id,
        questionText: q.question,
        options: q.options,
        selectedAnswer: cleanSelected,
        correctAnswer: correctLetter,
        isCorrect,
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const result = await Result.create({
      userId,
      quizId,
      score,
      totalQuestions,
      percentage,
      answers: evaluatedAnswers,
      completedAt: new Date(),
    });

    const populatedResult = await Result.findById(result._id)
      .populate('quizId', 'title category difficulty')
      .populate('userId', 'name email');

    return res.status(201).json({
      message: 'Quiz evaluated and submitted successfully.',
      result: populatedResult,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return res.status(500).json({ message: 'Failed to evaluate quiz submission.' });
  }
};

// @desc    Get current user's past quiz attempts
// @route   GET /api/results/my-results
// @access  Private / Student
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching student attempts:', error);
    return res.status(500).json({ message: 'Failed to fetch your quiz attempts.' });
  }
};

// @desc    Get single quiz result by ID
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title category difficulty description')
      .populate('userId', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'Quiz attempt result not found.' });
    }

    // Security check: only allow student who took the quiz OR admin
    const isOwner = result.userId && result.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied to this quiz result.' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    return res.status(500).json({ message: 'Failed to fetch result details.' });
  }
};

// @desc    Get all quiz attempts with filtering (Admin)
// @route   GET /api/admin/results
// @access  Private / Admin
const getAllResultsAdmin = async (req, res) => {
  try {
    const { quizId, studentName, date } = req.query;
    const filter = {};

    if (quizId) {
      filter.quizId = quizId;
    }

    if (date) {
      // Filter by specified date (entire day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.completedAt = { $gte: startDate, $lte: endDate };
    }

    let results = await Result.find(filter)
      .populate('userId', 'name email')
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    // Filter by student name or email if provided
    if (studentName && studentName.trim()) {
      const search = studentName.trim().toLowerCase();
      results = results.filter(
        (r) =>
          r.userId &&
          (r.userId.name.toLowerCase().includes(search) ||
            r.userId.email.toLowerCase().includes(search))
      );
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching admin results:', error);
    return res.status(500).json({ message: 'Failed to fetch quiz attempts.' });
  }
};

module.exports = {
  submitQuizResult,
  getMyResults,
  getResultById,
  getAllResultsAdmin,
};
