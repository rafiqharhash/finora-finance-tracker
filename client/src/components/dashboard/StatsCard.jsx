import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { clsx } from 'clsx';

function useCountUp(target, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!enabled) { setValue(target); return; }
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(target * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, enabled]);

  return value;
}

const CARD_CONFIGS = {
  balance:  { icon: DollarSign, label: 'Total Balance',     gradient: 'from-primary-600 to-primary-800',   glow: 'shadow-violet' },
  income:   { icon: TrendingUp, label: 'Total Income',      gradient: 'from-success-600 to-success-700',   glow: 'shadow-emerald' },
  expenses: { icon: TrendingDown,label: 'Total Expenses',   gradient: 'from-danger-500 to-danger-700',     glow: 'shadow-rose' },
  savings:  { icon: PiggyBank,  label: 'Savings Rate',      gradient: 'from-amber-500 to-orange-600',      glow: 'shadow-[0_8px_32px_rgba(245,158,11,0.25)]' },
};

/**
 * StatsCard — animated counter with trend indicator
 */
export default function StatsCard({
  type    = 'balance',
  amount  = 0,
  change,        // { value: number, label: string, positive: bool }
  isSavings = false,
  animate = true,
  index   = 0,
}) {
  const { formatAmount } = useCurrency();
  const config = CARD_CONFIGS[type] || CARD_CONFIGS.balance;
  const Icon   = config.icon;

  const displayValue  = isSavings ? amount : amount;
  const animatedValue = useCountUp(Math.abs(displayValue), 1200, animate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="stat-card group"
    >
      {/* Background glow */}
      <div className={clsx('absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-br', config.gradient)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-[var(--text-muted)]">{config.label}</p>
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', config.gradient, config.glow)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        {isSavings ? (
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {animatedValue}%
          </p>
        ) : (
          <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            {type === 'balance' && displayValue < 0 ? '-' : ''}
            {formatAmount(animatedValue)}
          </p>
        )}
      </div>

      {/* Change indicator */}
      {change && (
        <div className={clsx(
          'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full',
          change.positive
            ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
            : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
        )}>
          {change.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change.value}% {change.label || 'vs last month'}
        </div>
      )}
    </motion.div>
  );
}
