const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, getUserOrders, getOrderById, cancelOrder } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
