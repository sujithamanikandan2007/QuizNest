const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

async function viewDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiznest';
    console.log(`Connecting to MongoDB at: ${mongoUri}\n`);
    await mongoose.connect(mongoUri);

    console.log('====================================================');
    console.log('              QUIZNEST DATABASE VIEWER              ');
    console.log('====================================================\n');

    // 1. Collections Count
    const userCount = await User.countDocuments();
    const quizCount = await Quiz.countDocuments();
    const questionCount = await Question.countDocuments();
    const resultCount = await Result.countDocuments();

    console.log('📊 DATABASE SUMMARY:');
    console.log(`- Database Name : quiznest`);
    console.log(`- Users         : ${userCount}`);
    console.log(`- Quizzes       : ${quizCount}`);
    console.log(`- Questions     : ${questionCount}`);
    console.log(`- Quiz Results  : ${resultCount}\n`);

    // 2. Users Collection
    console.log('----------------------------------------------------');
    console.log('👤 USERS COLLECTION (db.users):');
    const users = await User.find().select('-password');
    users.forEach((u, i) => {
      console.log(`  [${i + 1}] ID: ${u._id} | Name: "${u.name}" | Email: ${u.email} | Role: <${u.role}>`);
    });

    // 3. Quizzes Collection
    console.log('\n----------------------------------------------------');
    console.log('📝 QUIZZES COLLECTION (db.quizzes):');
    const quizzes = await Quiz.find();
    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      const qCount = await Question.countDocuments({ quizId: q._id });
      console.log(`  [${i + 1}] ID: ${q._id} | Title: "${q.title}" | Category: ${q.category} | Difficulty: ${q.difficulty} | Questions: ${qCount}`);
    }

    // 4. Sample Question
    console.log('\n----------------------------------------------------');
    console.log('❓ SAMPLE QUESTION (db.questions):');
    const sampleQ = await Question.findOne().populate('quizId', 'title');
    if (sampleQ) {
      console.log(`  Quiz           : ${sampleQ.quizId?.title}`);
      console.log(`  Question ID    : ${sampleQ._id}`);
      console.log(`  Question Text  : ${sampleQ.question}`);
      console.log(`  Options        : A: "${sampleQ.options[0]}", B: "${sampleQ.options[1]}", C: "${sampleQ.options[2]}", D: "${sampleQ.options[3]}"`);
      console.log(`  Correct Answer : Option ${sampleQ.correctAnswer}`);
    }

    // 5. Results Collection
    console.log('\n----------------------------------------------------');
    console.log('🏆 RESULTS COLLECTION (db.results):');
    const results = await Result.find().populate('userId', 'name email').populate('quizId', 'title');
    if (results.length === 0) {
      console.log('  No results recorded yet.');
    } else {
      results.forEach((r, i) => {
        console.log(`  [${i + 1}] Student: ${r.userId?.name || 'Unknown'} | Quiz: "${r.quizId?.title || 'Unknown'}" | Score: ${r.score}/${r.totalQuestions} (${r.percentage}%) | Date: ${new Date(r.completedAt).toLocaleString()}`);
      });
    }

    console.log('\n====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Error viewing database:', err);
    process.exit(1);
  }
}

viewDatabase();
