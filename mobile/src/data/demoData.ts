import { subDays, subMonths, format } from 'date-fns';

const today = new Date();

export const DEMO_USER = {
  id: 'demo-user',
  name: 'Alex Demo',
  email: 'demo@finora.app',
  currency: 'USD',
  monthlyIncome: 5500,
  avatar: undefined,
};

export const DEMO_TRANSACTIONS = [
  // Income
  { _id: 't1', type: 'income', amount: 5500, category: 'income', description: 'Monthly Salary', date: format(subDays(today, 1), 'yyyy-MM-dd'), notes: 'Direct deposit' },
  { _id: 't2', type: 'income', amount: 320, category: 'income', description: 'Freelance Payment', date: format(subDays(today, 5), 'yyyy-MM-dd'), notes: '' },
  // Food
  { _id: 't3', type: 'expense', amount: 12.50, category: 'food', description: 'Starbucks Coffee', date: format(subDays(today, 0), 'yyyy-MM-dd'), notes: '' },
  { _id: 't4', type: 'expense', amount: 67.80, category: 'food', description: 'Weekly Groceries', date: format(subDays(today, 2), 'yyyy-MM-dd'), notes: 'Whole Foods' },
  { _id: 't5', type: 'expense', amount: 34.20, category: 'food', description: 'Restaurant Dinner', date: format(subDays(today, 3), 'yyyy-MM-dd'), notes: '' },
  { _id: 't6', type: 'expense', amount: 18.90, category: 'food', description: 'Lunch Delivery', date: format(subDays(today, 4), 'yyyy-MM-dd'), notes: 'DoorDash' },
  // Transport
  { _id: 't7', type: 'expense', amount: 45.00, category: 'transport', description: 'Uber Rides', date: format(subDays(today, 2), 'yyyy-MM-dd'), notes: '' },
  { _id: 't8', type: 'expense', amount: 120.00, category: 'transport', description: 'Monthly Metro Pass', date: format(subDays(today, 8), 'yyyy-MM-dd'), notes: '' },
  // Shopping
  { _id: 't9', type: 'expense', amount: 89.99, category: 'shopping', description: 'Nike Sneakers', date: format(subDays(today, 6), 'yyyy-MM-dd'), notes: 'Sale 30% off' },
  { _id: 't10', type: 'expense', amount: 45.00, category: 'shopping', description: 'Amazon Order', date: format(subDays(today, 7), 'yyyy-MM-dd'), notes: '' },
  // Bills
  { _id: 't11', type: 'expense', amount: 1200.00, category: 'bills', description: 'Rent Payment', date: format(subDays(today, 1), 'yyyy-MM-dd'), notes: 'Monthly rent' },
  { _id: 't12', type: 'expense', amount: 89.00, category: 'bills', description: 'Electric Bill', date: format(subDays(today, 10), 'yyyy-MM-dd'), notes: '' },
  { _id: 't13', type: 'expense', amount: 14.99, category: 'entertainment', description: 'Netflix', date: format(subDays(today, 12), 'yyyy-MM-dd'), notes: '' },
  { _id: 't14', type: 'expense', amount: 9.99, category: 'entertainment', description: 'Spotify', date: format(subDays(today, 12), 'yyyy-MM-dd'), notes: '' },
  // Health
  { _id: 't15', type: 'expense', amount: 55.00, category: 'health', description: 'Gym Membership', date: format(subDays(today, 15), 'yyyy-MM-dd'), notes: '' },
  { _id: 't16', type: 'expense', amount: 28.50, category: 'health', description: 'Pharmacy', date: format(subDays(today, 9), 'yyyy-MM-dd'), notes: '' },
  // Last month
  { _id: 't17', type: 'income', amount: 5500, category: 'income', description: 'Monthly Salary', date: format(subMonths(today, 1), 'yyyy-MM-dd'), notes: '' },
  { _id: 't18', type: 'expense', amount: 1200, category: 'bills', description: 'Rent Payment', date: format(subMonths(today, 1), 'yyyy-MM-dd'), notes: '' },
  { _id: 't19', type: 'expense', amount: 430, category: 'food', description: 'Groceries & Dining', date: format(subMonths(today, 1), 'yyyy-MM-dd'), notes: '' },
  { _id: 't20', type: 'expense', amount: 210, category: 'transport', description: 'Transport', date: format(subMonths(today, 1), 'yyyy-MM-dd'), notes: '' },
];

export const DEMO_BUDGETS = [
  { _id: 'b1', category: 'food', limit: 500, spent: 133.40, period: 'monthly' },
  { _id: 'b2', category: 'transport', limit: 200, spent: 165.00, period: 'monthly' },
  { _id: 'b3', category: 'shopping', limit: 300, spent: 134.99, period: 'monthly' },
  { _id: 'b4', category: 'entertainment', limit: 80, spent: 24.98, period: 'monthly' },
  { _id: 'b5', category: 'health', limit: 150, spent: 83.50, period: 'monthly' },
  { _id: 'b6', category: 'bills', limit: 1400, spent: 1289.00, period: 'monthly' },
];

export const DEMO_MONTHLY_TREND = [
  { month: 'Jan', income: 5500, expenses: 3820 },
  { month: 'Feb', income: 5500, expenses: 4100 },
  { month: 'Mar', income: 5820, expenses: 3650 },
  { month: 'Apr', income: 5500, expenses: 3980 },
  { month: 'May', income: 5820, expenses: 3790 },
  { month: 'Jun', income: 5500, expenses: 4210 },
];

export const DEMO_CATEGORY_BREAKDOWN = [
  { category: 'bills', amount: 1289, percentage: 34 },
  { category: 'food', amount: 133, percentage: 18 },
  { category: 'transport', amount: 165, percentage: 14 },
  { category: 'shopping', amount: 135, percentage: 11 },
  { category: 'health', amount: 84, percentage: 9 },
  { category: 'entertainment', amount: 25, percentage: 7 },
  { category: 'other', amount: 85, percentage: 7 },
];

export const DEMO_SUMMARY = {
  totalIncome: 5820,
  totalExpenses: 1916.37,
  balance: 3903.63,
  savingsRate: 67,
  transactionCount: 16,
};

export const DEMO_AI_INSIGHTS = [
  {
    id: 'ai1',
    type: 'success',
    title: 'Great savings rate! 🎉',
    message: "You're saving 67% of your income this month — well above the 20% recommended target.",
  },
  {
    id: 'ai2',
    type: 'warning',
    title: 'Transport budget at 83%',
    message: "You've used $165 of your $200 transport budget. Consider carpooling for the rest of the month.",
  },
  {
    id: 'ai3',
    type: 'info',
    title: 'Bills spike detected',
    message: 'Your bills category is 8% higher than last month. Review recurring subscriptions.',
  },
];
