const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required'],
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length === 4 && val.every(opt => typeof opt === 'string' && opt.trim().length > 0);
      },
      message: 'A question must provide exactly 4 non-empty options.',
    },
    required: [true, 'Four options are required'],
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);
