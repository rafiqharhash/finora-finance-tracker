'use strict';

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingGoal = require('../models/SavingGoal');
const asyncWrapper = require('../utils/asyncWrapper');

// ─── @desc    Get current user profile
// ─── @route   GET /api/v1/users/profile
// ─── @access  Private
const getProfile = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user.fullProfile,
  });
});

// ─── @desc    Update current user profile
// ─── @route   PUT /api/v1/users/profile
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

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user.fullProfile,
  });
});

// ─── @desc    Delete current user account and all associated data
// ─── @route   DELETE /api/v1/users/account
// ─── @access  Private
const deleteAccount = asyncWrapper(async (req, res) => {
  const userId = req.user.id;

  // Delete all associated data in parallel
  await Promise.all([
    Transaction.deleteMany({ user: userId }),
    Budget.deleteMany({ user: userId }),
    SavingGoal.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.status(200).json({
    success: true,
    message: 'Account and all associated data have been permanently deleted',
  });
});

module.exports = { getProfile, updateProfile, deleteAccount };
