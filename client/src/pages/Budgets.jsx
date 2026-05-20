import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Wallet, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { CATEGORIES } from '../utils/constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useForm } from 'react-hook-form';

function BudgetModal({ isOpen, onClose, editItem, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editItem || { category: 'Food', limit: '', alertThreshold: 80 },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      limit: parseFloat(data.limit),
      alertThreshold: parseFloat(data.alertThreshold),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? 'Edit Budget' : 'Add Budget'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="budget-form">
            {editItem ? 'Update' : 'Save Budget'}
          </Button>
        </>
      }
    >
      <form id="budget-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Category</label>
          <select {...register('category')} className="input-base appearance-none" disabled={!!editItem}>
            {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Monthly Limit</label>
          <input {...register('limit', { required: true, min: 1 })} type="number" step="1" className="input-base" />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Alert Threshold (%)</label>
          <input {...register('alertThreshold', { required: true, min: 1, max: 100 })} type="number" step="1" className="input-base" />
        </div>
      </form>
    </Modal>
  );
}

export default function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget, transactions } = useFinanceStore();
  const { formatAmount } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  // Compute spent amounts dynamically from current month's transactions
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear  = now.getFullYear();
  
  const currentMonthExpenses = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() + 1 === curMonth && d.getFullYear() === curYear;
    });
  }, [transactions, curMonth, curYear]);

  const computedBudgets = useMemo(() => {
    return budgets.map((b) => {
      const spent = currentMonthExpenses
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }, [budgets, currentMonthExpenses]);

  const handleSubmit = (data) => {
    if (editItem) {
      updateBudget(editItem.id || editItem._id, data);
    } else {
      addBudget({ ...data, id: `budget-${Date.now()}`, month: curMonth, year: curYear, spent: 0 });
    }
    setEditItem(null);
  };

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setModalOpen(true); };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Budgets</h1>
          <p className="section-subtitle">Manage your monthly spending limits</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={openAdd}>
          Create Budget
        </Button>
      </div>

      {computedBudgets.length === 0 ? (
        <Card>
          <EmptyState icon="💼" title="No budgets set" description="Create a budget to track your spending limits." action={{ label: 'Create Budget', onClick: openAdd }} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {computedBudgets.map((b, idx) => {
            const cat = CATEGORIES.find((c) => c.name === b.category) || CATEGORIES[0];
            const pct = Math.min((b.spent / b.limit) * 100, 100);
            const isOver = b.spent > b.limit;
            const isWarning = pct >= (b.alertThreshold || 80);

            return (
              <motion.div key={b.id || b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="flex flex-col h-full relative overflow-hidden group">
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteId(b.id || b._id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-[var(--text-muted)] hover:text-danger-500"><Trash2 size={14} /></button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${cat.color}18` }}>{cat.icon}</div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{b.category}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{formatAmount(b.limit)} limit</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-end justify-between mb-2">
                      <p className={`text-2xl font-bold tabular-nums ${isOver ? 'text-danger-500' : 'text-[var(--text-primary)]'}`}>
                        {formatAmount(b.spent)}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">{Math.round(pct)}%</p>
                    </div>
                    
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ backgroundColor: isOver ? 'var(--color-danger-500)' : isWarning ? 'var(--color-warning-500)' : cat.color }}
                      />
                    </div>
                    
                    {isOver && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-danger-500 bg-danger-500/10 px-2 py-1.5 rounded-lg">
                        <AlertTriangle size={14} /> Over budget by {formatAmount(b.spent - b.limit)}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <BudgetModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} editItem={editItem} onSubmit={handleSubmit} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteBudget(deleteId); setDeleteId(null); }} title="Delete Budget" message="Are you sure you want to remove this budget?" danger />
    </div>
  );
}
