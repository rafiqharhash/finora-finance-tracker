import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  userId?: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getLocalBudgets = async (): Promise<Budget[]> => {
  const str = await AsyncStorage.getItem('@finora_budgets');
  return str ? JSON.parse(str) : [];
};

const saveLocalBudgets = async (data: Budget[]) => {
  await AsyncStorage.setItem('@finora_budgets', JSON.stringify(data));
};

export const budgetsApi = {
  getAll: async () => {
    await delay(50);
    const userId = useAuthStore.getState().user?.id;
    let budgets = await getLocalBudgets();
    budgets = budgets.filter(b => b.userId === userId);
    return { data: budgets };
  },

  create: async (payload: Omit<Budget, '_id' | 'spent'>) => {
    await delay(50);
    const userId = useAuthStore.getState().user?.id;
    const budgets = await getLocalBudgets();
    
    const newBudget: Budget = {
      ...payload,
      _id: Math.random().toString(36).substring(2, 11),
      spent: 0,
      userId,
    };
    
    budgets.push(newBudget);
    await saveLocalBudgets(budgets);
    
    return { data: newBudget };
  },

  update: async (id: string, payload: Partial<Budget>) => {
    await delay(50);
    const budgets = await getLocalBudgets();
    const index = budgets.findIndex(b => b._id === id);
    
    if (index === -1) throw new Error('Budget not found');
    
    budgets[index] = { ...budgets[index], ...payload };
    await saveLocalBudgets(budgets);
    
    return { data: budgets[index] };
  },

  delete: async (id: string) => {
    await delay(50);
    let budgets = await getLocalBudgets();
    budgets = budgets.filter(b => b._id !== id);
    await saveLocalBudgets(budgets);
    
    return { success: true };
  },
};

// We will mock the reports API based on local transactions since the server isn't doing it
import { transactionsApi } from './transactions';

export const reportsApi = {
  getSummary: async (period?: string) => {
    await delay(50);
    // Simple mock using the existing summary function
    const summary = await transactionsApi.getSummary();
    return summary;
  },

  getSpendingByCategory: async (period?: string) => {
    await delay(50);
    const { data: txs } = await transactionsApi.getAll({ limit: 10000 });
    const expenses = txs.filter(t => t.type === 'expense');
    
    const byCategory: Record<string, number> = {};
    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    
    const chartData = Object.keys(byCategory).map(cat => ({
      name: cat,
      amount: byCategory[cat],
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // random color
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
    
    return { data: chartData };
  },

  getMonthlyTrend: async () => {
    await delay(50);
    // Mock monthly trend data
    return {
      data: [
        { month: 'Jan', income: 4000, expense: 2400 },
        { month: 'Feb', income: 3000, expense: 1398 },
        { month: 'Mar', income: 2000, expense: 9800 },
        { month: 'Apr', income: 2780, expense: 3908 },
        { month: 'May', income: 1890, expense: 4800 },
        { month: 'Jun', income: 2390, expense: 3800 },
      ]
    };
  },

  getIncomeVsExpense: async (months?: number) => {
    await delay(50);
    const summary = await transactionsApi.getSummary();
    return {
      data: [
        { name: 'Income', amount: summary.data.totalIncome, color: '#10B981', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Expense', amount: summary.data.totalExpense, color: '#EF4444', legendFontColor: '#7F7F7F', legendFontSize: 12 }
      ]
    };
  },
};
