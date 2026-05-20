import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
  success:   'bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-500 hover:to-success-600 shadow-emerald active:scale-[0.98]',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-button',
  lg: 'px-6 py-3.5 text-base gap-2.5 rounded-button',
};

/**
 * Button — reusable button with variants, sizes, loading, icons
 */
export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  icon:     Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  type      = 'button',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={clsx(
        'btn font-semibold transition-all duration-200 select-none',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size]       || SIZES.md,
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={size === 'lg' ? 18 : 15} className="animate-spin flex-shrink-0" />
      ) : (
        Icon && <Icon size={size === 'lg' ? 18 : 15} className="flex-shrink-0" />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight size={size === 'lg' ? 18 : 15} className="flex-shrink-0" />
      )}
    </motion.button>
  );
}
