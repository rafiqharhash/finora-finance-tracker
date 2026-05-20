'use strict';

const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const asyncWrapper = require('../utils/asyncWrapper');
const validate = require('../middleware/validate');

// ─── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const userObj = {
    id: user._id,
    name: user.name,
    email: user.email,
    currency: user.currency,
    theme: user.theme,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj,
  });
};

// ─── Validation Rules ──────────────────────────────────────────────────────────
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── @desc    Register new user
// ─── @route   POST /api/v1/auth/register
// ─── @access  Public
const register = [
  ...registerValidation,
  validate,
  asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  }),
];

// ─── @desc    Login user
// ─── @route   POST /api/v1/auth/login
// ─── @access  Public
const login = [
  ...loginValidation,
  validate,
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    // Select password explicitly (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);
  }),
];

// ─── @desc    Get current user
// ─── @route   GET /api/v1/auth/me
// ─── @access  Private
const getMe = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: user.fullProfile,
  });
});

// ─── @desc    Update profile (name, currency, theme, avatar)
// ─── @route   PUT /api/v1/auth/profile
// ─── @access  Private
const updateProfile = asyncWrapper(async (req, res) => {
  const allowedUpdates = ['name', 'currency', 'theme', 'avatar'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields provided for update',
    });
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.fullProfile,
  });
});

// ─── @desc    Change password
// ─── @route   PUT /api/v1/auth/change-password
// ─── @access  Private
const changePassword = asyncWrapper(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'currentPassword and newPassword are required',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters',
    });
  }

  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save(); // triggers pre-save hash hook

  sendTokenResponse(user, 200, res);
});

// ─── @desc    Logout (client-side token removal; server confirms)
// ─── @route   POST /api/v1/auth/logout
// ─── @access  Private
const logout = asyncWrapper(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully — please remove the token client-side',
  });
});

module.exports = { register, login, getMe, updateProfile, changePassword, logout };
