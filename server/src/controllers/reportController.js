'use strict';

const Transaction = require('../models/Transaction');
const asyncWrapper = require('../utils/asyncWrapper');

// ─── @desc    Monthly summary — income vs expenses for a given month
// ─── @route   GET /api/v1/reports/monthly
// ─── @access  Private
const getMonthlySummary = asyncWrapper(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avg: { $avg: '$amount' },
      },
    },
  ]);

  const summary = { income: 0, expenses: 0, incomeCount: 0, expenseCount: 0, incomeAvg: 0, expenseAvg: 0 };

  result.forEach(({ _id, total, count, avg }) => {
    if (_id === 'income') {
      summary.income = total;
      summary.incomeCount = count;
      summary.incomeAvg = Math.round(avg * 100) / 100;
    } else {
      summary.expenses = total;
      summary.expenseCount = count;
      summary.expenseAvg = Math.round(avg * 100) / 100;
    }
  });

  summary.balance = summary.income - summary.expenses;
  summary.savingsRate =
    summary.income > 0
      ? Math.round((summary.balance / summary.income) * 100 * 100) / 100
      : 0;

  res.status(200).json({
    success: true,
    month,
    year,
    data: summary,
  });
});

// ─── @desc    Category breakdown for a given month
// ─── @route   GET /api/v1/reports/categories
// ─── @access  Private
const getCategoryBreakdown = asyncWrapper(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1;
  const year = parseInt(req.query.year) || now.getFullYear();
  const type = req.query.type || 'expense';

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: start, $lt: end },
        type,
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avg: { $avg: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = result.reduce((sum, r) => sum + r.total, 0);

  const categories = result.map((r) => ({
    category: r._id,
    total: r.total,
    count: r.count,
    avg: Math.round(r.avg * 100) / 100,
    percentage:
      grandTotal > 0 ? Math.round((r.total / grandTotal) * 100 * 100) / 100 : 0,
  }));

  res.status(200).json({
    success: true,
    month,
    year,
    type,
    grandTotal,
    data: categories,
  });
});

// ─── @desc    Yearly summary — all 12 months with income/expenses/balance
// ─── @route   GET /api/v1/reports/yearly
// ─── @access  Private
const getYearlySummary = asyncWrapper(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: start, $lt: end },
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
    { $sort: { '_id.month': 1 } },
  ]);

  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    name: MONTH_NAMES[i],
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: 0,
  }));

  result.forEach(({ _id: { month, type }, total, count }) => {
    const entry = months[month - 1];
    entry.transactions += count;
    if (type === 'income') {
      entry.income = total;
    } else {
      entry.expenses = total;
    }
    entry.balance = entry.income - entry.expenses;
  });

  const totals = months.reduce(
    (acc, m) => ({
      income: acc.income + m.income,
      expenses: acc.expenses + m.expenses,
      balance: acc.balance + m.balance,
      transactions: acc.transactions + m.transactions,
    }),
    { income: 0, expenses: 0, balance: 0, transactions: 0 }
  );

  res.status(200).json({
    success: true,
    year,
    totals,
    data: months,
  });
});

// ─── @desc    Deterministic insights based on spending patterns
// ─── @route   GET /api/v1/reports/insights
// ─── @access  Private
const getInsights = asyncWrapper(async (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Fetch current and previous month data
  const [currentData, prevData] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(prevYear, prevMonth - 1, 1),
            $lt: new Date(prevYear, prevMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Aggregate helpers
  const aggregate = (data, type) => {
    const result = { total: 0, byCategory: {} };
    data
      .filter((d) => d._id.type === type)
      .forEach(({ _id: { category }, total }) => {
        result.total += total;
        result.byCategory[category] = (result.byCategory[category] || 0) + total;
      });
    return result;
  };

  const current = {
    income: aggregate(currentData, 'income'),
    expense: aggregate(currentData, 'expense'),
  };

  const prev = {
    income: aggregate(prevData, 'income'),
    expense: aggregate(prevData, 'expense'),
  };

  const insights = [];

  // ── Insight 1: Savings rate ───────────────────────────────────────────────
  const balance = current.income.total - current.expense.total;
  const savingsRate =
    current.income.total > 0
      ? (balance / current.income.total) * 100
      : 0;

  if (savingsRate >= 20) {
    insights.push({
      type: 'positive',
      icon: '🌟',
      title: 'Excellent Savings Rate',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep it up!`,
    });
  } else if (savingsRate > 0 && savingsRate < 10) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Low Savings Rate',
      message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build financial security.`,
    });
  } else if (savingsRate <= 0) {
    insights.push({
      type: 'danger',
      icon: '🚨',
      title: 'Spending Exceeds Income',
      message: `You've spent more than you earned this month. Review your largest expense categories.`,
    });
  }

  // ── Insight 2: Month-over-month expense change ────────────────────────────
  if (prev.expense.total > 0 && current.expense.total > 0) {
    const expenseChange =
      ((current.expense.total - prev.expense.total) / prev.expense.total) * 100;

    if (expenseChange > 20) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: 'Expenses Increased Significantly',
        message: `Your expenses are up ${expenseChange.toFixed(1)}% compared to last month.`,
      });
    } else if (expenseChange < -10) {
      insights.push({
        type: 'positive',
        icon: '📉',
        title: 'Expenses Reduced',
        message: `Great job! Your spending dropped by ${Math.abs(expenseChange).toFixed(1)}% from last month.`,
      });
    }
  }

  // ── Insight 3: Top spending category ─────────────────────────────────────
  const topCategory = Object.entries(current.expense.byCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (topCategory) {
    const [cat, amount] = topCategory;
    const pct =
      current.expense.total > 0
        ? ((amount / current.expense.total) * 100).toFixed(1)
        : 0;
    insights.push({
      type: 'info',
      icon: '🔍',
      title: `Top Spending: ${cat}`,
      message: `${cat} accounts for ${pct}% of your total expenses this month ($${amount.toFixed(2)}).`,
    });
  }

  // ── Insight 4: Income change ──────────────────────────────────────────────
  if (prev.income.total > 0 && current.income.total > 0) {
    const incomeChange =
      ((current.income.total - prev.income.total) / prev.income.total) * 100;

    if (incomeChange > 10) {
      insights.push({
        type: 'positive',
        icon: '💰',
        title: 'Income Grew',
        message: `Your income increased by ${incomeChange.toFixed(1)}% compared to last month. Well done!`,
      });
    } else if (incomeChange < -10) {
      insights.push({
        type: 'warning',
        icon: '💸',
        title: 'Income Declined',
        message: `Your income dropped by ${Math.abs(incomeChange).toFixed(1)}% from last month. Consider reviewing your income sources.`,
      });
    }
  }

  // ── Insight 5: Food spending health check ─────────────────────────────────
  const foodSpend = current.expense.byCategory['Food'] || 0;
  if (current.income.total > 0) {
    const foodPct = (foodSpend / current.income.total) * 100;
    if (foodPct > 30) {
      insights.push({
        type: 'warning',
        icon: '🍔',
        title: 'High Food Spending',
        message: `Food costs represent ${foodPct.toFixed(1)}% of your income. Consider meal planning to reduce this.`,
      });
    }
  }

  // Default insight if no others generated
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Keep Tracking',
      message: 'Add more transactions to unlock personalised financial insights.',
    });
  }

  res.status(200).json({
    success: true,
    month: currentMonth,
    year: currentYear,
    summary: {
      currentMonthIncome: current.income.total,
      currentMonthExpenses: current.expense.total,
      currentMonthBalance: balance,
      savingsRate: Math.round(savingsRate * 100) / 100,
      prevMonthIncome: prev.income.total,
      prevMonthExpenses: prev.expense.total,
    },
    insights,
  });
});

module.exports = { getMonthlySummary, getCategoryBreakdown, getYearlySummary, getInsights };
