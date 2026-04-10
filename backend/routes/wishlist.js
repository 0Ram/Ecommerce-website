const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWishlist, toggleWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
