import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Dropdown — animated dropdown menu that closes on outside click
 */
export default function Dropdown({
  trigger,
  items  = [],
  align  = 'right',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className={clsx('relative inline-block', className)}>
      {/* Trigger */}
      <div onClick={() => setOpen((p) => !p)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={clsx(
              'absolute z-50 mt-2 min-w-[180px] rounded-xl overflow-hidden',
              'bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-glass',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="py-1">
              {items.map((item, idx) => {
                if (item.divider) {
                  return <div key={idx} className="my-1 border-t border-[var(--border-color)]" />;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => { item.onClick?.(); setOpen(false); }}
                    disabled={item.disabled}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left',
                      item.danger
                        ? 'text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                      item.disabled && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    {item.icon && <item.icon size={16} className="flex-shrink-0" />}
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
