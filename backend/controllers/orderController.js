const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      subtotal,
      shippingCost,
      tax,
      totalAmount
    });

    // Clear the cart after order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }
    order.orderStatus = 'Cancelled';
    order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder };
