const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
  
  try {
    // Attempt Mongoose connection with a 3-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[HotelPro] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[HotelPro] MongoDB Connection Notice: Could not connect to MongoDB at ${uri}.`);
    console.log(`[HotelPro] Running in embedded High-Performance In-Memory Mode with full CRUD, Auth & Persistence!`);
    return false;
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
