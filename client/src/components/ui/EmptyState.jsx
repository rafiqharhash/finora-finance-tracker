import { motion } from 'framer-motion';
import Button from './Button';

/**
 * EmptyState — centered empty state with icon, title, description and CTA
 */
export default function EmptyState({
  icon      = '📭',
  title     = 'Nothing here yet',
  description,
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <div className="text-6xl mb-5 select-none leading-none">{icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* CTA */}
      {action && (
        <Button
          variant="primary"
          size="md"
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
