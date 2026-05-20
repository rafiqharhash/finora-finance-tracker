'use strict';

const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const asyncWrapper = require('../utils/asyncWrapper');

// ─── @desc    Get all transactions (paginated, filtered, sorted)
// ─── @route   GET /api/v1/transactions
// ─── @access  Private
const getTransactions = asyncWrapper(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    month,
    year,
    search,
    sortBy = 'date',
    order = 'desc',
  } = req.query;

  const filter = { user: req.user.id };

  if (type && ['income', 'expense'].includes(type)) filter.type = type;
  if (category) filter.category = category;

  if (month || year) {
    const now = new Date();
    const m = parseInt(month) || now.getMonth() + 1;
    const y = parseInt(year) || now.getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    filter.date = { $gte: start, $lt: end };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;
  const sortField = ['date', 'amount', 'title', 'createdAt'].includes(sortBy)
    ? sortBy
    : 'date';

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: transactions,
  });
});

// ─── @desc    Get single transaction
// ─── @route   GET /api/v1/transactions/:id
// ─── @access  Private
const getTransaction = asyncWrapper(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  res.status(200).json({ success: true, data: transaction });
});

// ─── @desc    Create transaction
// ─── @route   POST /api/v1/transactions
// ─── @access  Private
const createTransaction = asyncWrapper(async (req, res) => {
  const { title, amount, type, category, date, notes, isRecurring, recurringPeriod, tags } =
    req.body;

  const transaction = await Transaction.create({
    user: req.user.id,
    title,
    amount,
    type,
    category,
    date: date || new Date(),
    notes,
    isRecurring,
    recurringPeriod,
    tags,
  });

  // ── Update budget spent if it's an expense ──────────────────────────────────
  if (type === 'expense') {
    const txDate = new Date(transaction.date);
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    await Budget.findOneAndUpdate(
      { user: req.user.id, category, month, year },
      { $inc: { spent: amount } },
      { new: true }
    );
  }

  res.status(201).json({
    success: true,
    message: 'Transaction created',
    data: transaction,
  });
});

// ─── @desc    Update transaction
// ─── @route   PUT /api/v1/transactions/:id
// ─── @access  Private
const updateTransaction = asyncWrapper(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // If amount or category changed and original was expense, reverse old budget spent
  if (transaction.type === 'expense') {
    const txDate = new Date(transaction.date);
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    await Budget.findOneAndUpdate(
      { user: req.user.id, category: transaction.category, month, year },
      { $inc: { spent: -transaction.amount } }
    );
  }

  const allowedFields = ['title', 'amount', 'type', 'category', 'date', 'notes', 'isRecurring', 'recurringPeriod', 'tags'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      transaction[field] = req.body[field];
    }
  });

  await transaction.save();

  // Apply new budget impact
  if (transaction.type === 'expense') {
    const txDate = new Date(transaction.date);
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    await Budget.findOneAndUpdate(
      { user: req.user.id, category: transaction.category, month, year },
      { $inc: { spent: transaction.amount } }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Transaction updated',
    data: transaction,
  });
});

// ─── @desc    Delete transaction
// ─── @route   DELETE /api/v1/transactions/:id
// ─── @access  Private
const deleteTransaction = asyncWrapper(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Reverse budget impact if expense
  if (transaction.type === 'expense') {
    const txDate = new Date(transaction.date);
    const month = txDate.getMonth() + 1;
    const year = txDate.getFullYear();

    await Budget.findOneAndUpdate(
      { user: req.user.id, category: transaction.category, month, year },
      { $inc: { spent: -transaction.amount } }
    );
  }

  await transaction.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Transaction deleted',
  });
});

// ─── @desc    Get aggregated stats (income, expenses, balance by month)
// ─── @route   GET /api/v1/transactions/stats
// ─── @access  Private
const getStats = asyncWrapper(async (req, res) => {
  const { year } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();

  const startDate = new Date(targetYear, 0, 1);
  const endDate = new Date(targetYear + 1, 0, 1);

  const stats = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  // Build a structured monthly array
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expenses: 0,
    balance: 0,
    incomeCount: 0,
    expenseCount: 0,
  }));

  stats.forEach(({ _id: { month, type }, total, count }) => {
    const entry = months[month - 1];
    if (type === 'income') {
      entry.income = total;
      entry.incomeCount = count;
    } else {
      entry.expenses = total;
      entry.expenseCount = count;
    }
    entry.balance = entry.income - entry.expenses;
  });

  const totals = months.reduce(
    (acc, m) => ({
      income: acc.income + m.income,
      expenses: acc.expenses + m.expenses,
      balance: acc.balance + m.balance,
    }),
    { income: 0, expenses: 0, balance: 0 }
  );

  res.status(200).json({
    success: true,
    year: targetYear,
    totals,
    monthly: months,
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
};
