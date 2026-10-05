const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Result = require('../models/Result');

async function removeTestUsers() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiznest';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('\nSearching for non-admin test users...');

    // Find all users except admin
    const nonAdminUsers = await User.find({ role: { $ne: 'admin' } });
    console.log(`Found ${nonAdminUsers.length} test user(s) to remove:`);
    nonAdminUsers.forEach((u, i) => {
      console.log(`  [${i + 1}] ID: ${u._id} | Name: "${u.name}" | Email: ${u.email} | Role: ${u.role}`);
    });

    const nonAdminUserIds = nonAdminUsers.map((u) => u._id);

    // Delete results associated with these test users
    const deletedResults = await Result.deleteMany({ userId: { $in: nonAdminUserIds } });
    console.log(`\nDeleted ${deletedResults.deletedCount} associated test quiz result(s).`);

    // Delete the test users
    const deletedUsers = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${deletedUsers.deletedCount} test user(s).`);

    // Verify remaining users
    const remainingUsers = await User.find().select('-password');
    console.log(`\nRemaining User(s) in Database (${remainingUsers.length}):`);
    remainingUsers.forEach((u, i) => {
      console.log(`  [${i + 1}] ID: ${u._id} | Name: "${u.name}" | Email: ${u.email} | Role: ${u.role}`);
    });

    console.log('\nCleanup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error removing test users:', err);
    process.exit(1);
  }
}

removeTestUsers();
