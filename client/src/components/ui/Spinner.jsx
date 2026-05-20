import { clsx } from 'clsx';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const COLORS = {
  primary: 'border-primary-600 border-t-transparent',
  white:   'border-white border-t-transparent',
  gray:    'border-[var(--text-muted)] border-t-transparent',
  success: 'border-success-500 border-t-transparent',
};

/**
 * Spinner — animated loading indicator
 */
export default function Spinner({
  size      = 'md',
  color     = 'primary',
  className = '',
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        'rounded-full animate-spin',
        SIZES[size]  || SIZES.md,
        COLORS[color] || COLORS.primary,
        className
      )}
    />
  );
}

/** Full-page centered spinner */
export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-sm text-[var(--text-muted)] animate-pulse">Loading Finora...</p>
      </div>
    </div>
  );
}
