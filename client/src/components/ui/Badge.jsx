import { clsx } from 'clsx';

const VARIANTS = {
  default:  'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
  primary:  'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success:  'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  danger:   'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
  warning:  'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  info:     'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  income:   'badge-income',
  expense:  'badge-expense',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

/**
 * Badge — status/type indicator pill
 */
export default function Badge({
  children,
  variant   = 'default',
  size      = 'md',
  dot       = false,
  className = '',
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        VARIANTS[variant] || VARIANTS.default,
        SIZES[size]       || SIZES.md,
        className
      )}
    >
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'success' ? 'bg-success-500' :
          variant === 'danger'  ? 'bg-danger-500'  :
          variant === 'warning' ? 'bg-warning-500' :
          variant === 'primary' ? 'bg-primary-500' :
          'bg-current'
        )} />
      )}
      {children}
    </span>
  );
}
