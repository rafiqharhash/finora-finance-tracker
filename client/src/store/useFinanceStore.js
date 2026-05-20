import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      transactions: [],
      goals:        [],
      budgets:      [],
      filters: {
        type:     'all',
        category: 'all',
        month:    'all',
        year:     'all',
        search:   '',
      },

      // ── Transaction Actions ────────────────────────────────────────────────
      setTransactions: (transactions) => set({ transactions }),

      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions],
      })),

      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id || t._id === id ? { ...t, ...updates } : t
        ),
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id && t._id !== id),
      })),

      // ── Goal Actions ───────────────────────────────────────────────────────
      setGoals: (goals) => set({ goals }),

      addGoal: (goal) => set((state) => ({
        goals: [goal, ...state.goals],
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id || g._id === id ? { ...g, ...updates } : g
        ),
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id && g._id !== id),
      })),

      // ── Budget Actions ─────────────────────────────────────────────────────
      setBudgets: (budgets) => set({ budgets }),

      addBudget: (budget) => set((state) => ({
        budgets: [budget, ...state.budgets],
      })),

      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === id || b._id === id ? { ...b, ...updates } : b
        ),
      })),

      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id && b._id !== id),
      })),

      // ── Filter Actions ─────────────────────────────────────────────────────
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

      resetFilters: () => set({
        filters: { type: 'all', category: 'all', month: 'all', year: 'all', search: '' },
      }),

      // ── Computed Selectors (call as functions) ─────────────────────────────
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        return transactions.filter((t) => {
          const date = new Date(t.date);
          if (filters.type !== 'all' && t.type !== filters.type) return false;
          if (filters.category !== 'all' && t.category !== filters.category) return false;
          if (filters.month !== 'all' && (date.getMonth() + 1) !== parseInt(filters.month)) return false;
          if (filters.year  !== 'all' && date.getFullYear()     !== parseInt(filters.year))  return false;
          if (filters.search) {
            const q = filters.search.toLowerCase();
            if (!t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
          }
          return true;
        });
      },

      getTotalIncome: () => {
        return get().transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        return get().transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        const { getTotalIncome, getTotalExpenses } = get();
        return getTotalIncome() - getTotalExpenses();
      },

      getMonthlyStats: (month, year) => {
        const txns = get().transactions.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        });
        const income   = txns.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
        const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expenses, balance: income - expenses, count: txns.length };
      },
    }),
    {
      name: 'finora-finance',
      partialize: (state) => ({
        transactions: state.transactions,
        goals:        state.goals,
        budgets:      state.budgets,
      }),
    }
  )
);
