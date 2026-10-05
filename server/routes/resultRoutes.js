const express = require('express');
const router = express.Router();
const {
  submitQuizResult,
  getMyResults,
  getResultById,
  getAllResultsAdmin,
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Student endpoints
router.post('/', protect, submitQuizResult);
router.get('/my-results', protect, getMyResults);
router.get('/:id', protect, getResultById);

module.exports = router;
