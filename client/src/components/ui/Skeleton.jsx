import { clsx } from 'clsx';

/**
 * Skeleton — shimmer loading placeholder
 * variants: text | card | avatar | chart | table-row
 */
export default function Skeleton({
  variant   = 'text',
  lines     = 1,
  className = '',
  height,
  width,
}) {
  const base = 'shimmer rounded animate-shimmer';

  if (variant === 'avatar') {
    return (
      <div className={clsx('rounded-full shimmer', className)}
        style={{ width: width || 40, height: height || 40 }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('rounded-card p-6 space-y-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]', className)}>
        <div className="flex items-center gap-3">
          <div className={clsx(base, 'w-10 h-10 rounded-xl flex-shrink-0')} />
          <div className="flex-1 space-y-2">
            <div className={clsx(base, 'h-4 rounded w-3/4')} />
            <div className={clsx(base, 'h-3 rounded w-1/2')} />
          </div>
        </div>
        <div className={clsx(base, 'h-8 rounded w-1/2')} />
        <div className={clsx(base, 'h-3 rounded w-full')} />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={clsx('rounded-card p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]', className)}>
        <div className={clsx(base, 'h-5 rounded w-1/3 mb-6')} />
        <div className={clsx(base, 'rounded', className)} style={{ height: height || 200 }} />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="flex items-center gap-4 px-4 py-3.5">
        <div className={clsx(base, 'w-8 h-8 rounded-full flex-shrink-0')} />
        <div className="flex-1 space-y-1.5">
          <div className={clsx(base, 'h-4 rounded w-1/3')} />
          <div className={clsx(base, 'h-3 rounded w-1/5')} />
        </div>
        <div className={clsx(base, 'h-4 rounded w-20')} />
      </div>
    );
  }

  // text (default)
  return (
    <div className={clsx('space-y-2', className)}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={clsx(base, 'h-4 rounded')}
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : (width || '100%') }}
        />
      ))}
    </div>
  );
}

/** Grid of card skeletons */
export function SkeletonGrid({ count = 4, className = '' }) {
  return (
    <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}
