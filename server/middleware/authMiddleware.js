const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'quiznest_jwt_secret_key_2026_super_secure'
      );

      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or account deactivated' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

// Optional auth: populate req.user if valid token exists, otherwise proceed
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'quiznest_jwt_secret_key_2026_super_secure'
      );
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Ignore token decode failure on optional routes
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
