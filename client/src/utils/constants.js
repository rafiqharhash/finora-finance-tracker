// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'food',           name: 'Food',           icon: '🍔', color: '#F59E0B', type: 'expense' },
  { id: 'transport',      name: 'Transport',       icon: '🚗', color: '#06B6D4', type: 'expense' },
  { id: 'bills',          name: 'Bills',           icon: '📄', color: '#EF4444', type: 'expense' },
  { id: 'shopping',       name: 'Shopping',        icon: '🛍️', color: '#EC4899', type: 'expense' },
  { id: 'entertainment',  name: 'Entertainment',   icon: '🎬', color: '#8B5CF6', type: 'expense' },
  { id: 'health',         name: 'Health',          icon: '💊', color: '#10B981', type: 'expense' },
  { id: 'salary',         name: 'Salary',          icon: '💼', color: '#10B981', type: 'income' },
  { id: 'freelance',      name: 'Freelance',       icon: '💻', color: '#7C3AED', type: 'income' },
  { id: 'investments',    name: 'Investments',     icon: '📈', color: '#F59E0B', type: 'income' },
  { id: 'other',          name: 'Other',           icon: '📦', color: '#64748B', type: 'both' },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both');
export const INCOME_CATEGORIES  = CATEGORIES.filter(c => c.type === 'income'  || c.type === 'both');

export const getCategoryById   = (id)   => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
export const getCategoryByName = (name) => CATEGORIES.find(c => c.name === name) || CATEGORIES[CATEGORIES.length - 1];

// ─── Currencies ───────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'PKR', symbol: '₨',  name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ',name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// ─── Transaction Types ────────────────────────────────────────────────────────
export const TRANSACTION_TYPES = [
  { value: 'income',  label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

// ─── Months ───────────────────────────────────────────────────────────────────
export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const SHORT_MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

// ─── Chart Colors ──────────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#7C3AED', '#06B6D4', '#10B981', '#F59E0B',
  '#F43F5E', '#EC4899', '#8B5CF6', '#3B82F6',
  '#EF4444', '#14B8A6',
];

// ─── API Base URL ──────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// ─── Local Storage Keys ────────────────────────────────────────────────────────
export const LOCAL_STORAGE_KEYS = {
  auth:         'finora-auth',
  theme:        'finora-theme',
  currency:     'finora-currency',
  demo:         'finora-demo',
  transactions: 'finora-transactions',
  goals:        'finora-goals',
  budgets:      'finora-budgets',
  ui:           'finora-ui',
  onboarded:    'finora-onboarded',
};

// ─── Budget Alert Threshold ────────────────────────────────────────────────────
export const DEFAULT_ALERT_THRESHOLD = 80; // percent

// ─── Recurring Periods ────────────────────────────────────────────────────────
export const RECURRING_PERIODS = [
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly',  label: 'Yearly' },
];

// ─── Goal Icons ───────────────────────────────────────────────────────────────
export const GOAL_ICONS = ['🎯','✈️','🏠','🚗','💻','📱','🎓','💎','🏋️','🌴','💍','📚'];

// ─── Goal Colors ──────────────────────────────────────────────────────────────
export const GOAL_COLORS = [
  '#7C3AED','#06B6D4','#10B981','#F59E0B','#F43F5E',
  '#EC4899','#3B82F6','#8B5CF6','#14B8A6','#EF4444',
];

// ─── Date Ranges ──────────────────────────────────────────────────────────────
export const DATE_RANGES = [
  { value: 'this_month',  label: 'This Month' },
  { value: 'last_month',  label: 'Last Month' },
  { value: 'last_3',      label: 'Last 3 Months' },
  { value: 'last_6',      label: 'Last 6 Months' },
  { value: 'this_year',   label: 'This Year' },
  { value: 'all',         label: 'All Time' },
];

// ─── Demo Credentials ─────────────────────────────────────────────────────────
export const DEMO_CREDENTIALS = {
  email:    'demo@finora.app',
  password: 'password123',
};
