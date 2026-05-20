import { motion } from 'framer-motion';
import { Target, CheckCircle } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { formatDate } from '../../utils/formatters';
import { clsx } from 'clsx';

function GoalItem({ goal, formatAmount }) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2.5 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{goal.icon || '🎯'}</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              {goal.title}
              {isComplete && <CheckCircle size={14} className="text-success-500" />}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {goal.deadline ? `Due ${formatDate(goal.deadline, 'MMM yyyy')}` : 'No deadline'}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold" style={{ color: goal.color }}>
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ backgroundColor: goal.color || '#7C3AED' }}
        />
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{formatAmount(goal.currentAmount)} saved</span>
        <span>Goal: {formatAmount(goal.targetAmount)}</span>
      </div>
    </motion.div>
  );
}

export default function SavingsGoalCard({ goals = [] }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Target size={16} className="text-primary-500" />
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Savings Goals</h3>
      </div>

      {goals.length === 0 ? (
        <div className="p-6 text-center text-[var(--text-muted)] text-sm">
          No goals set yet. Create your first goal!
        </div>
      ) : (
        goals.slice(0, 3).map((goal) => (
          <GoalItem key={goal.id || goal._id} goal={goal} formatAmount={formatAmount} />
        ))
      )}
    </div>
  );
}
