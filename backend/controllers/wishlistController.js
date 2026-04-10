const Wishlist = require('../models/Wishlist');

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = { products: [] };
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle product in wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const productIndex = wishlist.products.indexOf(productId);
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
    res.json({ wishlist, action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
