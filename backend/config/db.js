const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    console.log('Attempting connection fallback to local MongoDB (mongodb://127.0.0.1:27017/personalized-learning-game)...');
    
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/personalized-learning-game', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB Connection Error: ${localError.message}`);
      console.error('CRITICAL: Could not connect to either MongoDB Atlas or Local MongoDB. Please check connection strings and ensure services are running.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
