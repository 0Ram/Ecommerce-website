const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, getAdminStats } = require('../controllers/authController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], loginUser);

router.get('/profile', auth, getUserProfile);
router.get('/admin/stats', auth, adminAuth, getAdminStats);

module.exports = router;
