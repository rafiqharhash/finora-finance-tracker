import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTransactions } from '../../hooks/useTransactions';
import { useCurrency } from '../../hooks/useCurrency';
import { CATEGORIES } from '../../utils/constants';
import { format } from 'date-fns';

/**
 * QuickAddFAB — floating action button to quickly add a transaction
 */
export default function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('expense');
  const { addTransaction } = useTransactions();
  const { currency } = useCurrency();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', amount: '', category: 'Food', date: format(new Date(), 'yyyy-MM-dd'), notes: '' },
  });

  const onSubmit = (data) => {
    addTransaction({ ...data, amount: parseFloat(data.amount), type, currency });
    reset();
    setOpen(false);
  };

  const categories = type === 'expense'
    ? CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both')
    : CATEGORIES.filter(c => c.type === 'income'  || c.type === 'both');

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Quick Add Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-[var(--text-primary)]">Quick Add</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {/* Type Toggle */}
              <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
                      type === t
                        ? t === 'expense'
                          ? 'bg-danger-500 text-white shadow-sm'
                          : 'bg-success-500 text-white shadow-sm'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {t === 'expense' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Title */}
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="Transaction title"
                className="input-base"
              />
              {errors.title && <p className="text-xs text-danger-500">{errors.title.message}</p>}

              {/* Amount + Category */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  {...register('amount', { required: true, min: 0.01 })}
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  className="input-base"
                />
                <select {...register('category')} className="input-base appearance-none">
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <input {...register('date')} type="date" className="input-base" />

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all ${
                  type === 'expense'
                    ? 'bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-400 hover:to-danger-500'
                    : 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-400 hover:to-success-500'
                }`}
              >
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-violet flex items-center justify-center"
        aria-label="Quick add transaction"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} />
        </motion.div>
      </motion.button>
    </>
  );
}
