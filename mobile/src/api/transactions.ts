import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  notes?: string;
  userId?: string;
}

export interface TransactionFilters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getLocalTransactions = async (): Promise<Transaction[]> => {
  const str = await AsyncStorage.getItem('@finora_transactions');
  return str ? JSON.parse(str) : [];
};

const saveLocalTransactions = async (data: Transaction[]) => {
  await AsyncStorage.setItem('@finora_transactions', JSON.stringify(data));
};

export const transactionsApi = {
  getAll: async (filters?: TransactionFilters) => {
    await delay(50);
    const userId = useAuthStore.getState().user?.id;
    let transactions = await getLocalTransactions();
    
    // Filter by current user
    transactions = transactions.filter(t => t.userId === userId);

    if (filters) {
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(query) || 
          (t.notes && t.notes.toLowerCase().includes(query))
        );
      }
      if (filters.startDate) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate!));
      }
      if (filters.endDate) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate!));
      }
    }

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return {
      data: transactions.slice(startIndex, endIndex),
      total: transactions.length,
      page,
      pages: Math.ceil(transactions.length / limit)
    };
  },

  getById: async (id: string) => {
    await delay(50);
    const transactions = await getLocalTransactions();
    const transaction = transactions.find(t => t._id === id);
    if (!transaction) throw new Error('Transaction not found');
    return { data: transaction };
  },

  create: async (payload: Omit<Transaction, '_id'>) => {
    await delay(50);
    const userId = useAuthStore.getState().user?.id;
    const transactions = await getLocalTransactions();
    
    const newTransaction: Transaction = {
      ...payload,
      _id: Math.random().toString(36).substring(2, 11),
      userId,
    };
    
    transactions.push(newTransaction);
    await saveLocalTransactions(transactions);
    
    return { data: newTransaction };
  },

  update: async (id: string, payload: Partial<Transaction>) => {
    await delay(50);
    const transactions = await getLocalTransactions();
    const index = transactions.findIndex(t => t._id === id);
    
    if (index === -1) throw new Error('Transaction not found');
    
    transactions[index] = { ...transactions[index], ...payload };
    await saveLocalTransactions(transactions);
    
    return { data: transactions[index] };
  },

  delete: async (id: string) => {
    await delay(50);
    let transactions = await getLocalTransactions();
    transactions = transactions.filter(t => t._id !== id);
    await saveLocalTransactions(transactions);
    
    return { success: true };
  },

  getSummary: async () => {
    await delay(50);
    const userId = useAuthStore.getState().user?.id;
    const transactions = await getLocalTransactions();
    const userTx = transactions.filter(t => t.userId === userId);
    
    const income = userTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = userTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    return {
      data: {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
      }
    };
  },
};
