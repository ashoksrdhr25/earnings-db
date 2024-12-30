// database/setup.js
require('dotenv').config();
const mongoose = require('mongoose');

async function setupDatabase() {
  const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/earningsdb';
  
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Connected to MongoDB:', dbUri);
}

module.exports = { setupDatabase };
