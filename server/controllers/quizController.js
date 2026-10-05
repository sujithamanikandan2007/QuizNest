const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get all quizzes with question count
// @route   GET /api/quizzes
// @access  Public or Protected
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    // Calculate question count for each quiz dynamically
    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.countDocuments({ quizId: quiz._id });
        return {
          _id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          description: quiz.description,
          difficulty: quiz.difficulty,
          createdAt: quiz.createdAt,
          questionCount,
        };
      })
    );

    return res.status(200).json(quizzesWithCounts);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
};

// @desc    Get single quiz by ID with question count
// @route   GET /api/quizzes/:id
// @access  Public or Protected
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const questionCount = await Question.countDocuments({ quizId: quiz._id });

    return res.status(200).json({
      _id: quiz._id,
      title: quiz.title,
      category: quiz.category,
      description: quiz.description,
      difficulty: quiz.difficulty,
      createdAt: quiz.createdAt,
      questionCount,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ message: 'Failed to fetch quiz details.' });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private / Admin
const createQuiz = async (req, res) => {
  try {
    const { title, category, description, difficulty } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        message: 'Please provide title, category, and description for the quiz.',
      });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      difficulty: difficulty || 'Medium',
    });

    return res.status(201).json({
      message: 'Quiz created successfully.',
      quiz: {
        ...quiz.toObject(),
        questionCount: 0,
      },
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res.status(500).json({ message: 'Failed to create quiz.' });
  }
};

// @desc    Update existing quiz
// @route   PUT /api/quizzes/:id
// @access  Private / Admin
const updateQuiz = async (req, res) => {
  try {
    const { title, category, description, difficulty } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (title) quiz.title = title.trim();
    if (category) quiz.category = category.trim();
    if (description) quiz.description = description.trim();
    if (difficulty) quiz.difficulty = difficulty;

    const updatedQuiz = await quiz.save();
    const questionCount = await Question.countDocuments({ quizId: updatedQuiz._id });

    return res.status(200).json({
      message: 'Quiz updated successfully.',
      quiz: {
        ...updatedQuiz.toObject(),
        questionCount,
      },
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return res.status(500).json({ message: 'Failed to update quiz.' });
  }
};

// @desc    Delete quiz and its questions
// @route   DELETE /api/quizzes/:id
// @access  Private / Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Delete associated questions and results
    await Question.deleteMany({ quizId: quiz._id });
    await Result.deleteMany({ quizId: quiz._id });
    await Quiz.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Quiz and all associated questions deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return res.status(500).json({ message: 'Failed to delete quiz.' });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
