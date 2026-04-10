const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin-only routes
router.post('/', auth, adminAuth, createProduct);
router.put('/:id', auth, adminAuth, updateProduct);
router.delete('/:id', auth, adminAuth, deleteProduct);

module.exports = router;
