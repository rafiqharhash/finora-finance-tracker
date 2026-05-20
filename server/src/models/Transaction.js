'use strict';

const mongoose = require('mongoose');

const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Salary',
  'Freelance',
  'Entertainment',
  'Investments',
  'Health',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: TRANSACTION_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPeriod: {
      type: String,
      enum: {
        values: ['weekly', 'monthly', 'yearly'],
        message: '{VALUE} is not a valid recurring period',
      },
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Indexes ─────────────────────────────────────────────────────────
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1, date: -1 });

// ─── Validation: recurringPeriod required when isRecurring ───────────────────
transactionSchema.pre('save', function (next) {
  if (this.isRecurring && !this.recurringPeriod) {
    return next(
      new Error('recurringPeriod is required when isRecurring is true')
    );
  }
  if (!this.isRecurring) {
    this.recurringPeriod = null;
  }
  next();
});

transactionSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
