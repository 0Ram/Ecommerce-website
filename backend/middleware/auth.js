const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_shopnow_2026');

    if (decoded.demoUser) {
      req.user = decoded.demoUser;
      return next();
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(decoded.id).select('-password').maxTimeMS(3000);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (dbErr) {
        console.warn('DB lookup failed in auth middleware, using token claims:', dbErr.message);
      }
    }

    // Fallback user object from token payload
    req.user = {
      _id: decoded.id || '66175e111111111111111999',
      name: decoded.name || 'User',
      email: decoded.email || 'user@shopnow.com',
      role: decoded.role || 'user'
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
module.exports.protect = auth;
