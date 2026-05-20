import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, CheckCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

const TYPE_CONFIG = {
  success: { icon: CheckCircle,  bg: 'bg-success-500/10 border-success-500/20', text: 'text-success-500',  label: 'bg-success-500' },
  warning: { icon: AlertTriangle,bg: 'bg-warning-500/10 border-warning-500/20', text: 'text-warning-500',  label: 'bg-warning-500' },
  alert:   { icon: TrendingDown, bg: 'bg-danger-500/10 border-danger-500/20',   text: 'text-danger-500',   label: 'bg-danger-500' },
  info:    { icon: Info,         bg: 'bg-primary-500/10 border-primary-500/20', text: 'text-primary-500',  label: 'bg-primary-500' },
  tip:     { icon: Lightbulb,    bg: 'bg-cyan-500/10 border-cyan-500/20',       text: 'text-cyan-500',     label: 'bg-cyan-500' },
};

export default function InsightCard({ insight, index = 0 }) {
  const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
  const Icon   = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01]',
        config.bg
      )}
    >
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', config.text, 'bg-current/10')}>
        <Icon size={16} className={config.text} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-semibold mb-0.5', config.text)}>{insight.title}</p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{insight.message}</p>
      </div>
    </motion.div>
  );
}

export function InsightsList({ insights = [] }) {
  if (insights.length === 0) {
    return (
      <div className="p-6 text-center text-[var(--text-muted)] text-sm">
        Add more transactions to generate AI insights 💡
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <InsightCard key={insight.id} insight={insight} index={idx} />
      ))}
    </div>
  );
}
