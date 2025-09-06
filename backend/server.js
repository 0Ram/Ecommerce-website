const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'your-frontend-domain.com' : 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Seed some sample products (run once)
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const sampleProducts = [
        {
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 99.99,
          category: 'Electronics',
          stock: 50,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
        },
        {
          name: 'Smartphone',
          description: 'Latest smartphone with advanced features',
          price: 599.99,
          category: 'Electronics',
          stock: 30,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop'
        },
        {
          name: 'Designer T-Shirt',
          description: 'Comfortable cotton t-shirt with modern design',
          price: 29.99,
          category: 'Clothing',
          stock: 100,
          rating: 4.2,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop'
        },
        {
          name: 'Programming Book',
          description: 'Learn modern web development techniques',
          price: 39.99,
          category: 'Books',
          stock: 25,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop'
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('Sample products added');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed products after server starts
setTimeout(seedProducts, 2000);
