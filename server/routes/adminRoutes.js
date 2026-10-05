const express = require('express');
const router = express.Router();
const {
  getAllStudentsAdmin,
  getStudentByIdAdmin,
  getAdminStats,
} = require('../controllers/userController');
const { getAllResultsAdmin } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require protect and adminOnly
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/students', getAllStudentsAdmin);
router.get('/students/:id', getStudentByIdAdmin);
router.get('/results', getAllResultsAdmin);

module.exports = router;
