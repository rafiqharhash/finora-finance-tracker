import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Input — styled form input with label, error, left/right icon
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    iconLeft:  IconLeft,
    iconRight: IconRight,
    type      = 'text',
    placeholder,
    className = '',
    id,
    required,
    ...rest
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {IconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <IconLeft size={16} />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={clsx(
            'input-base',
            IconLeft  && 'pl-10',
            IconRight && 'pr-10',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30',
            className
          )}
          {...rest}
        />

        {IconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <IconRight size={16} />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-danger-500 flex items-center gap-1">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
});

export default Input;
