const express = require('express');
const cors = require('cors');
const path = require('path');
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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Seed sample products (force reseed with HD products)
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count >= 30) {
      console.log(`✅ ${count} products already in database, skipping seed`);
      return;
    }
    // Clear and reseed if less than 30 products
    await Product.deleteMany({});
    console.log('🗑️  Cleared old products...');

    const sampleProducts = [
      // ─── ELECTRONICS ──────────────────────────────
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer, crystal-clear hands-free calling, and up to 30-hour battery life. Premium comfort with ultralight design.',
        price: 349.99,
        category: 'Electronics',
        stock: 45,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'iPhone 15 Pro Max',
        description: 'A17 Pro chip, 48MP camera system, titanium design. The most powerful iPhone ever with USB-C connector and customizable Action button.',
        price: 1199.99,
        category: 'Electronics',
        stock: 25,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'MacBook Pro 16" M3 Max',
        description: '16.2-inch Liquid Retina XDR display, M3 Max chip with 14-core CPU. Up to 22 hours battery life. The ultimate pro notebook.',
        price: 2499.99,
        category: 'Electronics',
        stock: 15,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Samsung 65" 4K QLED Smart TV',
        description: 'Quantum HDR display with Dolby Atmos, AI-powered 4K upscaling, built-in gaming hub, and sleek Infinity One Design.',
        price: 1299.99,
        category: 'Electronics',
        stock: 12,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'iPad Air M2',
        description: '11-inch Liquid Retina display, M2 chip, 12MP camera, Touch ID, all-day battery life. Works with Apple Pencil Pro and Magic Keyboard.',
        price: 599.99,
        category: 'Electronics',
        stock: 35,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Bose QuietComfort Ultra Earbuds',
        description: 'World-class noise cancellation in a truly wireless earbud. Immersive Audio with CustomTune technology and 6 hours of battery.',
        price: 299.99,
        category: 'Electronics',
        stock: 50,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop&q=80'
      },

      // ─── CLOTHING ──────────────────────────────
      {
        name: 'Premium Cotton Crew Neck Tee',
        description: 'Ultra-soft 100% organic cotton t-shirt with a modern relaxed fit. Pre-shrunk fabric with reinforced stitching. Available in 12 curated colors.',
        price: 39.99,
        category: 'Clothing',
        stock: 150,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless indigo wash denim jacket with minimal branding, antique brass hardware, and a tailored modern silhouette.',
        price: 89.99,
        category: 'Clothing',
        stock: 75,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Nike Air Max 270 Sneakers',
        description: 'Lightweight mesh upper with largest-ever Max Air unit for cushioning. Engineered for maximum comfort during workouts and daily wear.',
        price: 149.99,
        category: 'Clothing',
        stock: 90,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Merino Wool Pullover Sweater',
        description: 'Luxuriously soft Australian merino wool sweater with ribbed cuffs and hem. Temperature-regulating, breathable, and naturally wrinkle-resistant.',
        price: 119.99,
        category: 'Clothing',
        stock: 40,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Slim Fit Chino Pants',
        description: 'Premium stretch cotton chinos with a tailored slim fit. Wrinkle-resistant finish with hidden flex waistband for all-day comfort.',
        price: 69.99,
        category: 'Clothing',
        stock: 100,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Handcrafted full-grain Italian leather crossbody bag with adjustable strap, brass zipper, and multiple interior pockets.',
        price: 159.99,
        category: 'Clothing',
        stock: 30,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&q=80'
      },

      // ─── BOOKS ──────────────────────────────
      {
        name: 'Clean Code by Robert C. Martin',
        description: 'A handbook of agile software craftsmanship. Learn to write code that is clean, readable, and maintainable. The programmer\'s bible.',
        price: 34.99,
        category: 'Books',
        stock: 60,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Atomic Habits by James Clear',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. The #1 New York Times bestseller with over 15 million copies sold.',
        price: 16.99,
        category: 'Books',
        stock: 120,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'The Psychology of Money',
        description: 'Morgan Housel explores the unique ways people think about money. Timeless lessons on wealth, greed, and happiness.',
        price: 19.99,
        category: 'Books',
        stock: 80,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Sapiens: A Brief History of Humankind',
        description: 'Yuval Noah Harari\'s groundbreaking narrative of humanity\'s creation and evolution. A New York Times bestseller.',
        price: 22.99,
        category: 'Books',
        stock: 70,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Deep Work by Cal Newport',
        description: 'Rules for focused success in a distracted world. Learn the superpower of deep concentration in the age of social media.',
        price: 18.99,
        category: 'Books',
        stock: 55,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop&q=80'
      },

      // ─── HOME & LIVING ──────────────────────────────
      {
        name: 'Handcrafted Ceramic Mug Set',
        description: 'Set of 4 artisan-made ceramic mugs with unique glazed finishes. Microwave and dishwasher safe. Each mug holds 14oz.',
        price: 49.99,
        category: 'Home',
        stock: 85,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Minimalist LED Desk Lamp',
        description: 'Adjustable LED desk lamp with 5 brightness levels and 3 color temperatures. Built-in USB charging port. Touch controls.',
        price: 59.99,
        category: 'Home',
        stock: 40,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Luxury Scented Candle Collection',
        description: '100% soy wax candles with premium essential oil blends. Set of 3: Vanilla Oak, Sea Breeze, and Midnight Garden. 50-hour burn time each.',
        price: 44.99,
        category: 'Home',
        stock: 65,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Velvet Throw Pillow Set',
        description: 'Set of 2 premium velvet throw pillows with hidden zipper closure. Hypoallergenic fill with removable, machine-washable covers.',
        price: 39.99,
        category: 'Home',
        stock: 55,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Modern Wall Clock',
        description: '12-inch silent non-ticking wall clock with minimalist Scandinavian design. Quartz movement for precise timekeeping.',
        price: 34.99,
        category: 'Home',
        stock: 45,
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&h=600&fit=crop&q=80'
      },

      // ─── SPORTS & FITNESS ──────────────────────────────
      {
        name: 'Premium Non-Slip Yoga Mat',
        description: 'Extra-thick 6mm non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carrying strap.',
        price: 39.99,
        category: 'Sports',
        stock: 70,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Adjustable Dumbbell Set (5-50 lbs)',
        description: 'Quick-change weight system replaces 15 sets of weights. Space-saving design with durable steel construction and comfort grip.',
        price: 299.99,
        category: 'Sports',
        stock: 20,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Apple Watch Ultra 2',
        description: 'The most rugged Apple Watch with 49mm titanium case, precision dual-frequency GPS, up to 36-hour battery, and 100m depth rating.',
        price: 799.99,
        category: 'Sports',
        stock: 30,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Resistance Band Set (5 Levels)',
        description: 'Professional-grade latex resistance bands with door anchor, ankle straps, and carrying bag. Perfect for home workouts and physical therapy.',
        price: 29.99,
        category: 'Sports',
        stock: 100,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Insulated Water Bottle (32oz)',
        description: 'Triple-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24hrs or hot 12hrs. BPA-free with leak-proof lid.',
        price: 34.99,
        category: 'Sports',
        stock: 80,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=80'
      },

      // ─── BEAUTY & PERSONAL CARE ──────────────────────────────
      {
        name: 'Vitamin C Brightening Serum',
        description: 'Clinical-strength 20% vitamin C serum with hyaluronic acid and vitamin E. Visible brightening and anti-aging results in 2 weeks.',
        price: 28.99,
        category: 'Beauty',
        stock: 80,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Luxury Perfume — Midnight Rose',
        description: 'An enchanting blend of damask rose, black pepper, and warm vanilla. Long-lasting eau de parfum in a hand-crafted bottle.',
        price: 89.99,
        category: 'Beauty',
        stock: 45,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Professional Makeup Brush Set',
        description: '15-piece professional brush set with ultra-soft synthetic fibers and elegant rose gold handles. Includes premium leather case.',
        price: 49.99,
        category: 'Beauty',
        stock: 55,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Retinol Anti-Aging Night Cream',
        description: 'Advanced retinol formula with peptides and ceramides. Reduces fine lines, improves skin texture, and boosts collagen overnight.',
        price: 54.99,
        category: 'Beauty',
        stock: 60,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&q=80'
      },
      {
        name: 'Jade Facial Roller & Gua Sha Set',
        description: 'Authentic jade stone facial roller with gua sha tool. Reduces puffiness, improves circulation, and promotes lymphatic drainage.',
        price: 24.99,
        category: 'Beauty',
        stock: 70,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop&q=80'
      }
    ];
    
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} HD products seeded successfully`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed products after DB connection
setTimeout(seedProducts, 2000);
