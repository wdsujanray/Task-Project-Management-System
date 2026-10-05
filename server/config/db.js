const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const databaseName = process.env.MONGODB_DB || 'users';

  await mongoose.connect(mongoUri, {
    dbName: databaseName,
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected to ${mongoose.connection.name}`);
  return mongoose.connection;
}

module.exports = connectDB;
