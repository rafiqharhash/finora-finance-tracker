'use strict';

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Budget must belong to a user'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food',
          'Transport',
          'Bills',
          'Shopping',
          'Entertainment',
          'Health',
          'Investments',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [1, 'Budget limit must be at least 1'],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
    },
    alertThreshold: {
      type: Number,
      default: 80,
      min: [1, 'Alert threshold must be at least 1%'],
      max: [100, 'Alert threshold cannot exceed 100%'],
    },
    isAlerted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Compound Unique Index ────────────────────────────────────────────────────
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

// ─── Virtual: percentUsed ─────────────────────────────────────────────────────
budgetSchema.virtual('percentUsed').get(function () {
  if (this.limit <= 0) return 0;
  return Math.round((this.spent / this.limit) * 100 * 100) / 100;
});

// ─── Virtual: remaining ───────────────────────────────────────────────────────
budgetSchema.virtual('remaining').get(function () {
  return Math.max(0, this.limit - this.spent);
});

budgetSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Budget', budgetSchema);
