const express = require('express');
const router = express.Router();
const {
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
