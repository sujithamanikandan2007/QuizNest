const express = require('express');
const router = express.Router();
const { getStudentProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getStudentProfile);

module.exports = router;
