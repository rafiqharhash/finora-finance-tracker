'use strict';

const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Goal must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be at least 1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    deadline: {
      type: Date,
      default: null,
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([0-9A-Fa-f]{3}){1,2}$/, 'Color must be a valid hex code'],
    },
    icon: {
      type: String,
      default: '🎯',
      maxlength: [10, 'Icon cannot exceed 10 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'paused'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: progressPercentage ──────────────────────────────────────────────
savingGoalSchema.virtual('progressPercentage').get(function () {
  if (this.targetAmount <= 0) return 0;
  const pct = (this.currentAmount / this.targetAmount) * 100;
  return Math.min(Math.round(pct * 100) / 100, 100);
});

// ─── Virtual: daysLeft ────────────────────────────────────────────────────────
savingGoalSchema.virtual('daysLeft').get(function () {
  if (!this.deadline) return null;
  const diff = new Date(this.deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// ─── Auto-complete when target reached ───────────────────────────────────────
savingGoalSchema.pre('save', function (next) {
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  next();
});

savingGoalSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('SavingGoal', savingGoalSchema);
