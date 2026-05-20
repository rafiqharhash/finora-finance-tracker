import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const PADDING = { sm: 'p-4', md: 'p-6', lg: 'p-8', none: '' };

/**
 * Card — glass or regular card container
 */
export default function Card({
  children,
  className = '',
  glass     = false,
  hover     = false,
  padding   = 'md',
  onClick,
  as: Tag   = 'div',
}) {
  const Comp = onClick ? motion.div : Tag;

  return (
    <Comp
      onClick={onClick}
      whileHover={hover && onClick ? { scale: 1.01, y: -2 } : undefined}
      className={clsx(
        'rounded-card transition-all duration-200',
        glass
          ? 'glass-card'
          : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-card',
        PADDING[padding] ?? PADDING.md,
        hover && 'hover:shadow-glass cursor-pointer',
        className
      )}
    >
      {children}
    </Comp>
  );
}
