const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Helper to normalize correct answer to letter 'A', 'B', 'C', or 'D'
const normalizeAnswerLetter = (val, options) => {
  if (!val) return 'A';
  const clean = String(val).trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(clean)) {
    return clean;
  }
  // Check if val matches one of the option strings
  if (Array.isArray(options)) {
    const idx = options.findIndex((opt) => opt.trim().toLowerCase() === String(val).trim().toLowerCase());
    if (idx >= 0) {
      return ['A', 'B', 'C', 'D'][idx];
    }
  }
  return 'A';
};

// @desc    Get questions for a quiz (student gets without correctAnswer, admin gets with)
// @route   GET /api/quizzes/:quizId/questions
// @access  Public or Protected
const getQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const questions = await Question.find({ quizId }).sort({ createdAt: 1 });

    // Check if requester is an admin
    const isAdmin = req.user && req.user.role === 'admin';

    if (isAdmin) {
      return res.status(200).json({
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          difficulty: quiz.difficulty,
          description: quiz.description,
        },
        questions,
      });
    }

    // For student taking quiz: strip correctAnswer to avoid client inspection
    const sanitizedQuestions = questions.map((q, idx) => ({
      _id: q._id,
      quizId: q.quizId,
      questionNumber: idx + 1,
      question: q.question,
      options: q.options,
    }));

    return res.status(200).json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        description: quiz.description,
      },
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Failed to fetch questions.' });
  }
};

// @desc    Add a question to a quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Private / Admin
const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { question, options, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Support options as array or as separate fields optionA, optionB, etc.
    let opts = [];
    if (Array.isArray(options) && options.length === 4) {
      opts = options.map((opt) => String(opt || '').trim());
    } else {
      opts = [
        String(optionA || '').trim(),
        String(optionB || '').trim(),
        String(optionC || '').trim(),
        String(optionD || '').trim(),
      ];
    }

    // Validate inputs
    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question text is required.' });
    }

    if (opts.some((opt) => !opt)) {
      return res.status(400).json({ message: 'All four options (A, B, C, D) are required.' });
    }

    if (!correctAnswer) {
      return res.status(400).json({ message: 'Please select a correct answer.' });
    }

    const normalizedCorrect = normalizeAnswerLetter(correctAnswer, opts);

    const newQuestion = await Question.create({
      quizId,
      question: question.trim(),
      options: opts,
      correctAnswer: normalizedCorrect,
    });

    return res.status(201).json({
      message: 'Question added successfully.',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error adding question:', error);
    return res.status(500).json({ message: 'Failed to add question.' });
  }
};

// @desc    Update question by ID
// @route   PUT /api/questions/:id
// @access  Private / Admin
const updateQuestion = async (req, res) => {
  try {
    const { question, options, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    const existingQuestion = await Question.findById(req.params.id);
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    let opts = existingQuestion.options;
    if (Array.isArray(options) && options.length === 4) {
      opts = options.map((opt) => String(opt || '').trim());
    } else if (optionA || optionB || optionC || optionD) {
      opts = [
        String(optionA !== undefined ? optionA : opts[0]).trim(),
        String(optionB !== undefined ? optionB : opts[1]).trim(),
        String(optionC !== undefined ? optionC : opts[2]).trim(),
        String(optionD !== undefined ? optionD : opts[3]).trim(),
      ];
    }

    if (opts.some((opt) => !opt)) {
      return res.status(400).json({ message: 'All four options must be non-empty.' });
    }

    if (question && question.trim()) {
      existingQuestion.question = question.trim();
    }

    existingQuestion.options = opts;

    if (correctAnswer) {
      existingQuestion.correctAnswer = normalizeAnswerLetter(correctAnswer, opts);
    }

    const updated = await existingQuestion.save();

    return res.status(200).json({
      message: 'Question updated successfully.',
      question: updated,
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Failed to update question.' });
  }
};

// @desc    Delete question by ID
// @route   DELETE /api/questions/:id
// @access  Private / Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    await Question.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ message: 'Failed to delete question.' });
  }
};

module.exports = {
  getQuestionsByQuizId,
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
