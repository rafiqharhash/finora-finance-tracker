'use strict';

const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');

const protect = asyncWrapper(async (req, res, next) => {
  let token;

  // Extract Bearer token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorised — no token provided',
    });
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired — please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token — please log in again',
    });
  }

  // Attach user to request
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User belonging to this token no longer exists',
    });
  }

  req.user = user;
  next();
});

// ─── Role-based access guard ──────────────────────────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
