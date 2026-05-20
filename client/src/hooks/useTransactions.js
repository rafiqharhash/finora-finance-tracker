import { useEffect, useCallback } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { demoTransactions, demoGoals, demoBudgets } from '../utils/demoData';
import toast from 'react-hot-toast';

/**
 * Transactions hook — loads demo or live data, exposes CRUD
 */
export function useTransactions() {
  const { isDemoMode } = useAuthStore();
  const {
    transactions, goals, budgets, filters,
    setTransactions, addTransaction, updateTransaction, deleteTransaction,
    setGoals, setFilters, resetFilters, setBudgets,
    getFilteredTransactions, getTotalIncome, getTotalExpenses, getBalance,
  } = useFinanceStore();

  // ── Load demo data on mount if in demo mode ───────────────────────────────
  useEffect(() => {
    if (isDemoMode && transactions.length === 0) {
      setTransactions(demoTransactions);
      setGoals(demoGoals);
      setBudgets(demoBudgets);
    }
  }, [isDemoMode]);

  // ── CRUD wrappers ─────────────────────────────────────────────────────────
  const handleAdd = useCallback((data) => {
    const newTxn = {
      ...data,
      id:        `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    addTransaction(newTxn);
    toast.success('Transaction added!');
    return newTxn;
  }, [addTransaction]);

  const handleUpdate = useCallback((id, data) => {
    updateTransaction(id, data);
    toast.success('Transaction updated!');
  }, [updateTransaction]);

  const handleDelete = useCallback((id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted.');
  }, [deleteTransaction]);

  // ── Computed ──────────────────────────────────────────────────────────────
  const filteredTransactions = getFilteredTransactions();
  const totalIncome   = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance       = getBalance();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  // Category breakdown for current month
  const categoryBreakdown = transactions
    .filter((t) => {
      const d = new Date(t.date);
      const now = new Date();
      return t.type === 'expense' &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return {
    transactions,
    filteredTransactions,
    recentTransactions,
    categoryBreakdown,
    filters,
    totalIncome,
    totalExpenses,
    balance,
    setFilters,
    resetFilters,
    addTransaction:    handleAdd,
    updateTransaction: handleUpdate,
    deleteTransaction: handleDelete,
  };
}
