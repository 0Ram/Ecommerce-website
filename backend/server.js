const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const sampleProducts = require('./data/sampleProducts');
const Product = require('./models/Product');

// Load env vars
dotenv.config();

// Connect to database (runs in background with auto-reconnect)
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3456",
    "https://ecommerce-website-12r2.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API is running',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  server.close(() => {
    process.exit(1);
  });
  setTimeout(() => process.exit(1), 10000);
});

// Seed sample products when DB connects
const seedProducts = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const count = await Product.countDocuments();
    if (count >= 30) {
      console.log(`✅ ${count} products already in database, skipping seed`);
      return;
    }
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} HD products seeded successfully`);
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

mongoose.connection.on('connected', () => {
  seedProducts();
});
