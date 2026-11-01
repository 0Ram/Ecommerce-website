const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

// In-memory fallback cart store
const memoryCarts = new Map();

// Helper to find product from DB or sample products
const findProduct = async (id) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const p = await Product.findById(id).maxTimeMS(2000);
      if (p) return p;
    } catch (e) {}
  }
  return sampleProducts.find(p => p._id.toString() === id.toString()) || null;
};

// Helper to format in-memory cart
const getMemoryCart = (userId) => {
  const uid = userId.toString();
  if (!memoryCarts.has(uid)) {
    memoryCarts.set(uid, { user: uid, items: [], totalAmount: 0 });
  }
  return memoryCarts.get(uid);
};

// Get user cart
const getCart = async (req, res) => {
  const userId = req.user._id.toString();

  if (mongoose.connection.readyState === 1) {
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').maxTimeMS(2000);
      if (cart) {
        // Ensure all items have valid product details
        let totalAmount = 0;
        cart.items = cart.items.map(item => {
          if (!item.product) {
            item.product = sampleProducts.find(p => p._id.toString() === item.product?.toString()) || {};
          }
          if (item.product && item.product.price) {
            totalAmount += item.product.price * item.quantity;
          }
          return item;
        });
        cart.totalAmount = Math.round(totalAmount * 100) / 100;
        return res.json(cart);
      }
    } catch (error) {
      console.warn('DB getCart failed, using fallback:', error.message);
    }
  }

  // Fallback to in-memory cart
  res.json(getMemoryCart(userId));
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id.toString();

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let cart = await Cart.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (!cart) {
          cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingIndex = cart.items.findIndex(
          item => item.product.toString() === productId.toString()
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity += Number(quantity);
        } else {
          cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.populate('items.product');

        let totalAmount = 0;
        cart.items = cart.items.map(item => {
          if (!item.product || !item.product.price) {
            item.product = product;
          }
          totalAmount += (item.product.price || 0) * item.quantity;
          return item;
        });
        cart.totalAmount = Math.round(totalAmount * 100) / 100;

        await cart.save();
        return res.json(cart);
      } catch (dbErr) {
        console.warn('DB addToCart failed, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const cart = getMemoryCart(userId);
    const existingIndex = cart.items.findIndex(
      item => (item.product._id || item.product).toString() === productId.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock
        },
        quantity: Number(quantity)
      });
    }

    let total = 0;
    cart.items.forEach(item => {
      total += (item.product.price || 0) * item.quantity;
    });
    cart.totalAmount = Math.round(total * 100) / 100;

    memoryCarts.set(userId, cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (cart) {
          const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId.toString()
          );

          if (itemIndex > -1) {
            if (Number(quantity) <= 0) {
              cart.items.splice(itemIndex, 1);
            } else {
              cart.items[itemIndex].quantity = Number(quantity);
            }

            await cart.populate('items.product');
            let totalAmount = 0;
            cart.items = cart.items.map(item => {
              if (!item.product || !item.product.price) {
                item.product = sampleProducts.find(p => p._id.toString() === productId.toString()) || {};
              }
              totalAmount += (item.product.price || 0) * item.quantity;
              return item;
            });
            cart.totalAmount = Math.round(totalAmount * 100) / 100;
            await cart.save();
            return res.json(cart);
          }
        }
      } catch (dbErr) {
        console.warn('DB updateCartItem failed, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const cart = getMemoryCart(userId);
    const itemIndex = cart.items.findIndex(
      item => (item.product._id || item.product).toString() === productId.toString()
    );

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }

      let total = 0;
      cart.items.forEach(item => {
        total += (item.product.price || 0) * item.quantity;
      });
      cart.totalAmount = Math.round(total * 100) / 100;
      memoryCarts.set(userId, cart);
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (cart) {
          cart.items = cart.items.filter(item => item.product.toString() !== productId.toString());
          await cart.populate('items.product');

          let totalAmount = 0;
          cart.items = cart.items.map(item => {
            if (!item.product || !item.product.price) {
              item.product = sampleProducts.find(p => p._id.toString() === item.product?.toString()) || {};
            }
            totalAmount += (item.product.price || 0) * item.quantity;
            return item;
          });
          cart.totalAmount = Math.round(totalAmount * 100) / 100;
          await cart.save();
          return res.json(cart);
        }
      } catch (dbErr) {
        console.warn('DB removeFromCart failed, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const cart = getMemoryCart(userId);
    cart.items = cart.items.filter(
      item => (item.product._id || item.product).toString() !== productId.toString()
    );
    let total = 0;
    cart.items.forEach(item => {
      total += (item.product.price || 0) * item.quantity;
    });
    cart.totalAmount = Math.round(total * 100) / 100;
    memoryCarts.set(userId, cart);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (cart) {
          cart.items = [];
          cart.totalAmount = 0;
          await cart.save();
        }
      } catch (dbErr) {
        console.warn('DB clearCart failed, using fallback:', dbErr.message);
      }
    }

    const cart = getMemoryCart(userId);
    cart.items = [];
    cart.totalAmount = 0;
    memoryCarts.set(userId, cart);

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
