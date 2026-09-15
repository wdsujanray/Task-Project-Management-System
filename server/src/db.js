const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const databaseName = process.env.MONGODB_DB || 'users';
const client = new MongoClient(mongoUri);

let database;

async function connectDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    console.log(`MongoDB connected to ${databaseName}`);
  }

  return database;
}

function getDatabase() {
  if (!database) {
    throw new Error('MongoDB is not connected');
  }

  return database;
}

module.exports = { connectDatabase, getDatabase };