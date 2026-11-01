const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const sampleProducts = require('../data/sampleProducts');
const cartController = require('./cartController');

// In-memory fallback orders store
const memoryOrders = new Map();

const getMemoryOrders = (userId) => {
  const uid = userId.toString();
  if (!memoryOrders.has(uid)) {
    memoryOrders.set(uid, []);
  }
  return memoryOrders.get(uid);
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id.toString();

    // Check if DB is ready
    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').maxTimeMS(2000);
        if (cart && cart.items.length > 0) {
          const items = cart.items.map(item => {
            const prod = item.product || sampleProducts.find(p => p._id.toString() === item.product?.toString()) || {};
            return {
              product: prod._id || item.product,
              name: prod.name || 'Product',
              image: prod.image || '',
              price: prod.price || 0,
              quantity: item.quantity
            };
          });

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

          // Clear cart
          cart.items = [];
          cart.totalAmount = 0;
          await cart.save();

          return res.status(201).json(order);
        }
      } catch (dbErr) {
        console.warn('DB createOrder failed, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const userOrders = getMemoryOrders(userId);

    // Let's create an order from body or sample
    const items = req.body.items || [
      {
        product: sampleProducts[0]._id,
        name: sampleProducts[0].name,
        image: sampleProducts[0].image,
        price: sampleProducts[0].price,
        quantity: 1
      }
    ];

    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const shippingCost = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    const fakeOrderId = '66175e' + Math.floor(Math.random() * 100000000000000000).toString(16).padStart(18, '0');

    const newOrder = {
      _id: fakeOrderId,
      user: userId,
      items,
      shippingAddress: shippingAddress || {
        fullName: req.user.name || 'Valued Customer',
        address: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '10001',
        country: 'India',
        phone: '9999999999'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    userOrders.unshift(newOrder);
    memoryOrders.set(userId, userOrders);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  const userId = req.user._id.toString();

  if (mongoose.connection.readyState === 1) {
    try {
      const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product')
        .maxTimeMS(2000);
      return res.json(orders);
    } catch (error) {
      console.warn('DB getUserOrders failed, using fallback:', error.message);
    }
  }

  res.json(getMemoryOrders(userId));
};

// Get single order
const getOrderById = async (req, res) => {
  const userId = req.user._id.toString();

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findById(req.params.id).populate('items.product').maxTimeMS(2000);
      if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        return res.json(order);
      }
    } catch (error) {
      console.warn('DB getOrderById failed, using fallback:', error.message);
    }
  }

  const userOrders = getMemoryOrders(userId);
  const order = userOrders.find(o => o._id.toString() === req.params.id.toString());
  if (order) {
    return res.json(order);
  }

  res.status(404).json({ message: 'Order not found' });
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.findById(req.params.id).maxTimeMS(2000);
        if (order) {
          if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
          }
          if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
          }
          order.orderStatus = 'Cancelled';
          order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';
          await order.save();
          return res.json(order);
        }
      } catch (dbErr) {
        console.warn('DB cancelOrder failed, using fallback:', dbErr.message);
      }
    }

    const userOrders = getMemoryOrders(userId);
    const order = userOrders.find(o => o._id.toString() === req.params.id.toString());
    if (order) {
      order.orderStatus = 'Cancelled';
      order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';
      return res.json(order);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder };
