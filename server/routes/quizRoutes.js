const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const {
  getQuestionsByQuizId,
  addQuestion,
} = require('../controllers/questionController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Quiz CRUD
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

// Questions under Quiz
router.get('/:quizId/questions', optionalAuth, getQuestionsByQuizId);
router.post('/:quizId/questions', protect, adminOnly, addQuestion);

module.exports = router;
