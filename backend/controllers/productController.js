const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

// Check if database is ready
const isDbReady = () => mongoose.connection.readyState === 1;

// Helper to filter and paginate in-memory sample products
const filterAndPaginateSamples = ({ category, minPrice, maxPrice, search, page = 1, limit = 50 }) => {
  let list = [...sampleProducts];

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (minPrice) {
    list = list.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    list = list.filter(p => p.price <= Number(maxPrice));
  }

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(s) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  }

  const total = list.length;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 50;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return {
    products: paginated,
    totalPages: Math.ceil(total / limitNum) || 1,
    currentPage: pageNum,
    total
  };
};

// Get all products with filters
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 50 } = req.query;

    if (isDbReady()) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .maxTimeMS(3000);

      const total = await Product.countDocuments(query).maxTimeMS(3000);

      // If DB has products, return them
      if (total > 0 || search || (category && category !== 'All') || minPrice || maxPrice) {
        return res.json({
          products,
          totalPages: Math.ceil(total / limit) || 1,
          currentPage: Number(page) || 1,
          total
        });
      }
    }

    // Fallback to sample products if DB is offline or empty
    const result = filterAndPaginateSamples(req.query);
    res.json(result);
  } catch (error) {
    console.warn('Product find fallback triggered:', error.message);
    const result = filterAndPaginateSamples(req.query);
    res.json(result);
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    if (isDbReady()) {
      const product = await Product.findById(req.params.id).maxTimeMS(3000);
      if (product) {
        return res.json(product);
      }
    }

    // Fallback: check sample products
    const sample = sampleProducts.find(p => p._id.toString() === req.params.id.toString());
    if (sample) {
      return res.json(sample);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const sample = sampleProducts.find(p => p._id.toString() === req.params.id.toString());
    if (sample) {
      return res.json(sample);
    }
    res.status(404).json({ message: 'Product not found' });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ message: 'Database is currently offline. Cannot create product.' });
    }
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ message: 'Database is currently offline. Cannot update product.' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ message: 'Database is currently offline. Cannot delete product.' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
