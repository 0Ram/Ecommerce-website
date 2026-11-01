const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const sampleProducts = require('../data/sampleProducts');

// In-memory fallback wishlist store
const memoryWishlists = new Map();

const getMemoryWishlist = (userId) => {
  const uid = userId.toString();
  if (!memoryWishlists.has(uid)) {
    memoryWishlists.set(uid, { user: uid, products: [] });
  }
  return memoryWishlists.get(uid);
};

// Get user wishlist
const getWishlist = async (req, res) => {
  const userId = req.user._id.toString();

  if (mongoose.connection.readyState === 1) {
    try {
      let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products').maxTimeMS(2000);
      if (wishlist) {
        // Ensure populated items exist
        wishlist.products = wishlist.products.map(p => {
          if (!p || !p.name) {
            return sampleProducts.find(s => s._id.toString() === p?.toString()) || p;
          }
          return p;
        }).filter(Boolean);
        return res.json(wishlist);
      }
    } catch (error) {
      console.warn('DB getWishlist failed, using fallback:', error.message);
    }
  }

  res.json(getMemoryWishlist(userId));
};

// Toggle product in wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (!wishlist) {
          wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        const productIndex = wishlist.products.findIndex(
          p => p.toString() === productId.toString()
        );

        let action;
        if (productIndex > -1) {
          wishlist.products.splice(productIndex, 1);
          action = 'removed';
        } else {
          wishlist.products.push(productId);
          action = 'added';
        }

        await wishlist.save();
        await wishlist.populate('products');

        wishlist.products = wishlist.products.map(p => {
          if (!p || !p.name) {
            return sampleProducts.find(s => s._id.toString() === p?.toString()) || p;
          }
          return p;
        }).filter(Boolean);

        return res.json({ wishlist, action });
      } catch (dbErr) {
        console.warn('DB toggleWishlist failed, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const wishlist = getMemoryWishlist(userId);
    const productIndex = wishlist.products.findIndex(
      p => (p._id || p).toString() === productId.toString()
    );

    let action;
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      action = 'removed';
    } else {
      const prod = sampleProducts.find(p => p._id.toString() === productId.toString()) || { _id: productId };
      wishlist.products.push(prod);
      action = 'added';
    }

    memoryWishlists.set(userId, wishlist);
    res.json({ wishlist, action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).maxTimeMS(2000);
        if (wishlist) {
          wishlist.products = wishlist.products.filter(
            p => p.toString() !== productId.toString()
          );
          await wishlist.save();
          await wishlist.populate('products');
          return res.json(wishlist);
        }
      } catch (dbErr) {
        console.warn('DB removeFromWishlist failed, using fallback:', dbErr.message);
      }
    }

    const wishlist = getMemoryWishlist(userId);
    wishlist.products = wishlist.products.filter(
      p => (p._id || p).toString() !== productId.toString()
    );
    memoryWishlists.set(userId, wishlist);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
