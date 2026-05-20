'use strict';

const SavingGoal = require('../models/SavingGoal');
const asyncWrapper = require('../utils/asyncWrapper');

// ─── @desc    Get all saving goals for current user
// ─── @route   GET /api/v1/goals
// ─── @access  Private
const getGoals = asyncWrapper(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user.id };

  if (status && ['active', 'completed', 'paused'].includes(status)) {
    filter.status = status;
  }

  const goals = await SavingGoal.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: goals.length,
    data: goals,
  });
});

// ─── @desc    Create a saving goal
// ─── @route   POST /api/v1/goals
// ─── @access  Private
const createGoal = asyncWrapper(async (req, res) => {
  const { title, targetAmount, currentAmount, deadline, color, icon, status } = req.body;

  if (!title || !targetAmount) {
    return res.status(400).json({
      success: false,
      message: 'title and targetAmount are required',
    });
  }

  const goal = await SavingGoal.create({
    user: req.user.id,
    title,
    targetAmount,
    currentAmount: currentAmount || 0,
    deadline,
    color,
    icon,
    status,
  });

  res.status(201).json({
    success: true,
    message: 'Saving goal created',
    data: goal,
  });
});

// ─── @desc    Update a saving goal
// ─── @route   PUT /api/v1/goals/:id
// ─── @access  Private
const updateGoal = asyncWrapper(async (req, res) => {
  const goal = await SavingGoal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: 'Saving goal not found',
    });
  }

  const allowedFields = ['title', 'targetAmount', 'currentAmount', 'deadline', 'color', 'icon', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      goal[field] = req.body[field];
    }
  });

  await goal.save();

  res.status(200).json({
    success: true,
    message: 'Saving goal updated',
    data: goal,
  });
});

// ─── @desc    Delete a saving goal
// ─── @route   DELETE /api/v1/goals/:id
// ─── @access  Private
const deleteGoal = asyncWrapper(async (req, res) => {
  const goal = await SavingGoal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: 'Saving goal not found',
    });
  }

  await goal.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Saving goal deleted',
  });
});

// ─── @desc    Add a contribution to a saving goal
// ─── @route   POST /api/v1/goals/:id/contribute
// ─── @access  Private
const addContribution = asyncWrapper(async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'amount must be a positive number',
    });
  }

  const goal = await SavingGoal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: 'Saving goal not found',
    });
  }

  if (goal.status === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'This goal is already completed',
    });
  }

  goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);

  // Auto-complete if target reached (also handled in pre-save but explicit here)
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed';
  }

  await goal.save();

  res.status(200).json({
    success: true,
    message: goal.status === 'completed'
      ? '🎉 Goal reached! Saving goal marked as completed.'
      : 'Contribution added successfully',
    data: goal,
  });
});

module.exports = { getGoals, createGoal, updateGoal, deleteGoal, addContribution };
