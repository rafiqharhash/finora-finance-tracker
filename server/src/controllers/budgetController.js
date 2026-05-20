'use strict';

const Budget = require('../models/Budget');
const asyncWrapper = require('../utils/asyncWrapper');

// ─── @desc    Get all budgets for current user (optionally filtered by month/year)
// ─── @route   GET /api/v1/budgets
// ─── @access  Private
const getBudgets = asyncWrapper(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const budgets = await Budget.find({
    user: req.user.id,
    month,
    year,
  }).sort({ category: 1 });

  res.status(200).json({
    success: true,
    count: budgets.length,
    month,
    year,
    data: budgets,
  });
});

// ─── @desc    Create a budget
// ─── @route   POST /api/v1/budgets
// ─── @access  Private
const createBudget = asyncWrapper(async (req, res) => {
  const { category, limit, month, year, alertThreshold } = req.body;

  if (!category || !limit) {
    return res.status(400).json({
      success: false,
      message: 'category and limit are required',
    });
  }

  const now = new Date();

  const budget = await Budget.create({
    user: req.user.id,
    category,
    limit,
    month: month || now.getMonth() + 1,
    year: year || now.getFullYear(),
    alertThreshold: alertThreshold || 80,
  });

  res.status(201).json({
    success: true,
    message: 'Budget created',
    data: budget,
  });
});

// ─── @desc    Update a budget
// ─── @route   PUT /api/v1/budgets/:id
// ─── @access  Private
const updateBudget = asyncWrapper(async (req, res) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: 'Budget not found',
    });
  }

  const allowedFields = ['limit', 'alertThreshold', 'spent', 'isAlerted'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      budget[field] = req.body[field];
    }
  });

  await budget.save();

  res.status(200).json({
    success: true,
    message: 'Budget updated',
    data: budget,
  });
});

// ─── @desc    Delete a budget
// ─── @route   DELETE /api/v1/budgets/:id
// ─── @access  Private
const deleteBudget = asyncWrapper(async (req, res) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: 'Budget not found',
    });
  }

  await budget.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Budget deleted',
  });
});

// ─── @desc    Get budgets that have crossed their alert threshold
// ─── @route   GET /api/v1/budgets/alerts
// ─── @access  Private
const checkAlerts = asyncWrapper(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const budgets = await Budget.find({
    user: req.user.id,
    month,
    year,
  });

  const alerts = budgets
    .filter((b) => b.limit > 0 && (b.spent / b.limit) * 100 >= b.alertThreshold)
    .map((b) => ({
      id: b._id,
      category: b.category,
      limit: b.limit,
      spent: b.spent,
      percentUsed: Math.round((b.spent / b.limit) * 100 * 100) / 100,
      alertThreshold: b.alertThreshold,
      remaining: Math.max(0, b.limit - b.spent),
      isOverBudget: b.spent > b.limit,
    }));

  // Mark alerted budgets
  const alertIds = alerts.map((a) => a.id);
  if (alertIds.length > 0) {
    await Budget.updateMany(
      { _id: { $in: alertIds } },
      { $set: { isAlerted: true } }
    );
  }

  res.status(200).json({
    success: true,
    count: alerts.length,
    month,
    year,
    data: alerts,
  });
});

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget, checkAlerts };
