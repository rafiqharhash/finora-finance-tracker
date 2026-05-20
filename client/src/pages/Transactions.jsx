import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Download, Search, SlidersHorizontal } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { useFinanceStore } from '../store/useFinanceStore';
import { CATEGORIES, MONTHS, TRANSACTION_TYPES } from '../utils/constants';
import { formatDate, formatRelativeDate } from '../utils/formatters';
import { getCategoryByName as getCat } from '../utils/constants';
import { exportTransactionsToCSV } from '../utils/csvExport';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2 } from 'lucide-react';

// ─── Transaction Form Modal ────────────────────────────────────────────────────
function TransactionModal({ isOpen, onClose, editItem, onSubmit }) {
  const [type, setType] = useState(editItem?.type || 'expense');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editItem
      ? { ...editItem, date: format(new Date(editItem.date), 'yyyy-MM-dd') }
      : { title: '', amount: '', category: 'Food', date: format(new Date(), 'yyyy-MM-dd'), notes: '' },
  });

  const categories = type === 'expense'
    ? CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both')
    : CATEGORIES.filter(c => c.type === 'income'  || c.type === 'both');

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, amount: parseFloat(data.amount), type });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="txn-form">
            {editItem ? 'Update' : 'Add Transaction'}
          </Button>
        </>
      }
    >
      <form id="txn-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
          {['expense', 'income'].map((t) => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
                type === t
                  ? t === 'expense' ? 'bg-danger-500 text-white' : 'bg-success-500 text-white'
                  : 'text-[var(--text-muted)]'
              }`}>
              {t === 'expense' ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Title *</label>
          <input {...register('title', { required: 'Title is required' })}
            placeholder="e.g. Monthly Salary, Grocery shopping..."
            className="input-base" />
          {errors.title && <p className="text-xs text-danger-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Amount + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Amount *</label>
            <input {...register('amount', { required: true, min: { value: 0.01, message: 'Must be positive' } })}
              type="number" step="0.01" placeholder="0.00" className="input-base" />
            {errors.amount && <p className="text-xs text-danger-500 mt-1">{errors.amount.message || 'Required'}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Category</label>
            <select {...register('category')} className="input-base appearance-none">
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Date</label>
          <input {...register('date')} type="date" className="input-base" />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Notes (optional)</label>
          <textarea {...register('notes')} placeholder="Add a note..." rows={2}
            className="input-base resize-none" />
        </div>
      </form>
    </Modal>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────
function FilterBar({ filters, onChange, onReset }) {
  const now = new Date();
  return (
    <div className="flex flex-wrap gap-3">
      <select value={filters.type} onChange={e => onChange({ type: e.target.value })}
        className="input-base w-auto text-sm py-2">
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select value={filters.category} onChange={e => onChange({ category: e.target.value })}
        className="input-base w-auto text-sm py-2">
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
      </select>
      <select value={filters.month} onChange={e => onChange({ month: e.target.value })}
        className="input-base w-auto text-sm py-2">
        <option value="all">All Months</option>
        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
      </select>
      <select value={filters.year} onChange={e => onChange({ year: e.target.value })}
        className="input-base w-auto text-sm py-2">
        <option value="all">All Years</option>
        {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <Button variant="ghost" size="sm" onClick={onReset}>Reset</Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem,  setEditItem]    = useState(null);
  const [deleteId,  setDeleteId]    = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  const {
    filteredTransactions, filters, setFilters, resetFilters,
    addTransaction, updateTransaction, deleteTransaction,
    totalIncome, totalExpenses,
  } = useTransactions();
  const { formatAmount } = useCurrency();

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filteredTransactions];
    arr.sort((a, b) => {
      let av = a[sortConfig.key], bv = b[sortConfig.key];
      if (sortConfig.key === 'date')   { av = new Date(av); bv = new Date(bv); }
      if (sortConfig.key === 'amount') { av = Number(av);   bv = Number(bv);   }
      return sortConfig.direction === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return arr;
  }, [filteredTransactions, sortConfig]);

  const handleSubmit = (data) => {
    if (editItem) {
      updateTransaction(editItem.id || editItem._id, data);
    } else {
      addTransaction(data);
    }
    setEditItem(null);
  };

  const openEdit = (txn) => { setEditItem(txn); setModalOpen(true); };
  const openAdd  = () => { setEditItem(null); setModalOpen(true); };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Transactions</h1>
          <p className="section-subtitle">{filteredTransactions.length} transactions found</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={SlidersHorizontal}
            onClick={() => setShowFilters(p => !p)}>
            Filters
          </Button>
          <Button variant="secondary" size="md" icon={Download}
            onClick={() => exportTransactionsToCSV(filteredTransactions)}>
            Export CSV
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={openAdd}>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Income',   value: totalIncome,   color: 'text-success-500' },
          { label: 'Total Expenses', value: totalExpenses, color: 'text-danger-500' },
          { label: 'Net Balance',    value: totalIncome - totalExpenses, color: totalIncome >= totalExpenses ? 'text-success-500' : 'text-danger-500' },
        ].map(stat => (
          <Card key={stat.label} padding="sm">
            <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{formatAmount(Math.abs(stat.value))}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card padding="sm">
          <FilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />
        </Card>
      )}

      {/* Transaction List */}
      <Card padding="none">
        {sorted.length === 0 ? (
          <EmptyState icon="💳" title="No transactions found"
            description="Try adjusting your filters or add your first transaction"
            action={{ label: 'Add Transaction', onClick: openAdd }} />
        ) : (
          <div>
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-[var(--border-color)] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <button onClick={() => setSortConfig(p => ({ key: 'title', direction: p.key === 'title' && p.direction === 'asc' ? 'desc' : 'asc' }))}>Title</button>
              <button onClick={() => setSortConfig(p => ({ key: 'category', direction: p.key === 'category' && p.direction === 'asc' ? 'desc' : 'asc' }))}>Category</button>
              <button onClick={() => setSortConfig(p => ({ key: 'date', direction: p.key === 'date' && p.direction === 'asc' ? 'desc' : 'asc' }))}>Date</button>
              <button onClick={() => setSortConfig(p => ({ key: 'amount', direction: p.key === 'amount' && p.direction === 'asc' ? 'desc' : 'asc' }))}>Amount</button>
              <span>Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--border-color)]/50">
              {sorted.map((txn, idx) => {
                const cat = getCat(txn.category);
                return (
                  <motion.div
                    key={txn.id || txn._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-3.5 hover:bg-[var(--bg-tertiary)]/50 transition-colors group"
                  >
                    {/* Title */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                        style={{ backgroundColor: `${cat.color}18` }}>
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{txn.title}</p>
                        {txn.notes && <p className="text-xs text-[var(--text-muted)] truncate">{txn.notes}</p>}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="hidden sm:block">
                      <Badge variant={txn.type === 'income' ? 'success' : 'danger'} size="sm">
                        {txn.category}
                      </Badge>
                    </div>

                    {/* Date */}
                    <p className="hidden sm:block text-sm text-[var(--text-muted)]">
                      {formatDate(txn.date)}
                    </p>

                    {/* Amount */}
                    <p className={`text-sm font-bold tabular-nums ml-auto sm:ml-0 ${
                      txn.type === 'income' ? 'text-success-500' : 'text-danger-500'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(txn)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(txn.id || txn._id)}
                        className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 text-[var(--text-muted)] hover:text-danger-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        editItem={editItem}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteTransaction(deleteId); setDeleteId(null); }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
