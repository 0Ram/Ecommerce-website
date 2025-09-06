const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(auth, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(auth, updateProduct)
  .delete(auth, deleteProduct);

module.exports = router;
