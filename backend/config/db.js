const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not set. Running in fallback mode with sample products.');
    return;
  }

  isConnecting = true;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;
  } catch (error) {
    console.error(`⚠️ MongoDB connection attempt failed: ${error.message}`);
    console.log('ℹ️ Server will continue running and serve sample products. Reconnecting in 30s...');
    isConnecting = false;
    setTimeout(connectDB, 30000);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Retrying connection in 15s...');
  setTimeout(connectDB, 15000);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

module.exports = connectDB;
