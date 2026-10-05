const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get student profile & stats
// @route   GET /api/users/profile
// @access  Private / Student
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const results = await Result.find({ userId: user._id })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    const quizzesAttempted = results.length;
    let averageScore = 0;
    let highestScore = 0;

    if (quizzesAttempted > 0) {
      const totalPercentage = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      averageScore = Math.round(totalPercentage / quizzesAttempted);
      highestScore = Math.max(...results.map((r) => r.percentage || 0));
    }

    return res.status(200).json({
      user,
      stats: {
        quizzesAttempted,
        averageScore, // in percentage
        highestScore, // in percentage
      },
      recentAttempts: results.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return res.status(500).json({ message: 'Failed to fetch student profile.' });
  }
};

// @desc    Get all registered students (Admin)
// @route   GET /api/admin/students
// @access  Private / Admin
const getAllStudentsAdmin = async (req, res) => {
  try {
    // Exclude password and fetch only students
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    const studentsWithAttempts = await Promise.all(
      students.map(async (student) => {
        const attemptsCount = await Result.countDocuments({ userId: student._id });
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt,
          role: student.role,
          quizzesAttempted: attemptsCount,
        };
      })
    );

    return res.status(200).json(studentsWithAttempts);
  } catch (error) {
    console.error('Error fetching students list:', error);
    return res.status(500).json({ message: 'Failed to fetch students.' });
  }
};

// @desc    Get single student details with attempts (Admin)
// @route   GET /api/admin/students/:id
// @access  Private / Admin
const getStudentByIdAdmin = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const attempts = await Result.find({ userId: student._id })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    const quizzesAttempted = attempts.length;
    let averageScore = 0;
    let highestScore = 0;

    if (quizzesAttempted > 0) {
      const totalScore = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      averageScore = Math.round(totalScore / quizzesAttempted);
      highestScore = Math.max(...attempts.map((r) => r.percentage || 0));
    }

    return res.status(200).json({
      student,
      stats: {
        quizzesAttempted,
        averageScore,
        highestScore,
      },
      attempts,
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    return res.status(500).json({ message: 'Failed to fetch student details.' });
  }
};

// @desc    Get admin dashboard aggregated statistics
// @route   GET /api/admin/stats
// @access  Private / Admin
const getAdminStats = async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAttempts = await Result.countDocuments();

    const recentAttempts = await Result.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title category')
      .sort({ completedAt: -1 })
      .limit(6);

    return res.status(200).json({
      totalQuizzes,
      totalQuestions,
      totalStudents,
      totalAttempts,
      recentAttempts,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

module.exports = {
  getStudentProfile,
  getAllStudentsAdmin,
  getStudentByIdAdmin,
  getAdminStats,
};
