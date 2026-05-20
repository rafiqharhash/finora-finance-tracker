import { subMonths, format, getMonth, getYear, startOfMonth, endOfMonth } from 'date-fns';

// ─── Demo User ─────────────────────────────────────────────────────────────────
export const demoUser = {
  id:        'demo-user-001',
  name:      'Alex Johnson',
  email:     'demo@finora.app',
  currency:  'USD',
  theme:     'dark',
  avatar:    null,
  role:      'user',
  createdAt: '2024-01-01T00:00:00.000Z',
};

// ─── Helper: generate a date N days relative to monthsBack ────────────────────
function demoDate(monthsBack, day) {
  const d = subMonths(new Date(), monthsBack);
  d.setDate(day);
  d.setHours(Math.floor(Math.random() * 12) + 8, 0, 0, 0);
  return d.toISOString();
}

let _id = 1;
function tid() { return `txn-demo-${String(_id++).padStart(3, '0')}`; }

// ─── Demo Transactions (60 entries over 6 months) ─────────────────────────────
export const demoTransactions = [
  // ── Month 0 (Current) ──────────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(0, 1),  notes: 'Regular monthly salary deposit' },
  { id: tid(), title: 'Freelance Project — Acme Corp', amount: 1200, type: 'income', category: 'Freelance', date: demoDate(0, 5), notes: 'Logo redesign project' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(0, 2),  notes: 'Monthly rent payment' },
  { id: tid(), title: 'Electricity Bill',      amount: 85,   type: 'expense', category: 'Bills',         date: demoDate(0, 4),  notes: '' },
  { id: tid(), title: 'Netflix Subscription',  amount: 15,   type: 'expense', category: 'Entertainment', date: demoDate(0, 3),  notes: '' },
  { id: tid(), title: 'Spotify Premium',       amount: 10,   type: 'expense', category: 'Entertainment', date: demoDate(0, 3),  notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 95,   type: 'expense', category: 'Food',          date: demoDate(0, 6),  notes: 'Whole Foods shop' },
  { id: tid(), title: 'Restaurant — Sakura',   amount: 68,   type: 'expense', category: 'Food',          date: demoDate(0, 8),  notes: 'Date night dinner' },
  { id: tid(), title: 'Uber to Office',        amount: 22,   type: 'expense', category: 'Transport',     date: demoDate(0, 7),  notes: '' },
  { id: tid(), title: 'Coffee — Blue Bottle',  amount: 18,   type: 'expense', category: 'Food',          date: demoDate(0, 9),  notes: 'Weekly coffee run' },
  { id: tid(), title: 'Amazon — Books',        amount: 45,   type: 'expense', category: 'Shopping',      date: demoDate(0, 10), notes: 'Programming books' },
  { id: tid(), title: 'Gym Membership',        amount: 50,   type: 'expense', category: 'Health',        date: demoDate(0, 1),  notes: 'Monthly gym membership' },
  { id: tid(), title: 'Doctor Checkup',        amount: 120,  type: 'expense', category: 'Health',        date: demoDate(0, 11), notes: 'Annual physical' },
  { id: tid(), title: 'Weekly Groceries',      amount: 88,   type: 'expense', category: 'Food',          date: demoDate(0, 13), notes: 'Trader Joe\'s' },
  { id: tid(), title: 'Movie Tickets',         amount: 32,   type: 'expense', category: 'Entertainment', date: demoDate(0, 14), notes: '2 tickets + popcorn' },

  // ── Month 1 (Last Month) ──────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(1, 1),  notes: '' },
  { id: tid(), title: 'Freelance — UI Design', amount: 850,  type: 'income',  category: 'Freelance',     date: demoDate(1, 15), notes: 'Dashboard UI for startup' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(1, 2),  notes: '' },
  { id: tid(), title: 'Internet Bill',         amount: 60,   type: 'expense', category: 'Bills',         date: demoDate(1, 4),  notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 78,   type: 'expense', category: 'Food',          date: demoDate(1, 5),  notes: '' },
  { id: tid(), title: 'McDonald\'s',           amount: 24,   type: 'expense', category: 'Food',          date: demoDate(1, 7),  notes: '' },
  { id: tid(), title: 'Monthly Bus Pass',      amount: 65,   type: 'expense', category: 'Transport',     date: demoDate(1, 2),  notes: '' },
  { id: tid(), title: 'New Running Shoes',     amount: 110,  type: 'expense', category: 'Shopping',      date: demoDate(1, 10), notes: 'Nike Air Max' },
  { id: tid(), title: 'Concert Tickets',       amount: 120,  type: 'expense', category: 'Entertainment', date: demoDate(1, 18), notes: 'Taylor Swift concert' },
  { id: tid(), title: 'ETF Investment',        amount: 500,  type: 'income',  category: 'Investments',   date: demoDate(1, 20), notes: 'Dividend payout' },
  { id: tid(), title: 'Pharmacy',              amount: 35,   type: 'expense', category: 'Health',        date: demoDate(1, 12), notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 92,   type: 'expense', category: 'Food',          date: demoDate(1, 19), notes: '' },

  // ── Month 2 ────────────────────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(2, 1),  notes: '' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(2, 2),  notes: '' },
  { id: tid(), title: 'Electricity Bill',      amount: 90,   type: 'expense', category: 'Bills',         date: demoDate(2, 4),  notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 82,   type: 'expense', category: 'Food',          date: demoDate(2, 6),  notes: '' },
  { id: tid(), title: 'Restaurant — Chipotle', amount: 28,   type: 'expense', category: 'Food',          date: demoDate(2, 9),  notes: '' },
  { id: tid(), title: 'Freelance — Consulting',amount: 600,  type: 'income',  category: 'Freelance',     date: demoDate(2, 12), notes: 'Tech consulting session' },
  { id: tid(), title: 'Uber Rides',            amount: 45,   type: 'expense', category: 'Transport',     date: demoDate(2, 11), notes: 'Multiple rides' },
  { id: tid(), title: 'Steam Games',           amount: 60,   type: 'expense', category: 'Entertainment', date: demoDate(2, 15), notes: 'Summer sale purchases' },
  { id: tid(), title: 'Clothing Haul',         amount: 180,  type: 'expense', category: 'Shopping',      date: demoDate(2, 20), notes: 'H&M and Zara' },
  { id: tid(), title: 'Weekly Groceries',      amount: 75,   type: 'expense', category: 'Food',          date: demoDate(2, 22), notes: '' },
  { id: tid(), title: 'Gym Membership',        amount: 50,   type: 'expense', category: 'Health',        date: demoDate(2, 1),  notes: '' },

  // ── Month 3 ────────────────────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(3, 1),  notes: '' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(3, 2),  notes: '' },
  { id: tid(), title: 'Water + Internet Bills',amount: 90,   type: 'expense', category: 'Bills',         date: demoDate(3, 5),  notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 105,  type: 'expense', category: 'Food',          date: demoDate(3, 7),  notes: 'Stocked up for the month' },
  { id: tid(), title: 'Birthday Dinner',       amount: 95,   type: 'expense', category: 'Food',          date: demoDate(3, 14), notes: 'Friend\'s birthday at Il Mulino' },
  { id: tid(), title: 'Flight Tickets',        amount: 380,  type: 'expense', category: 'Transport',     date: demoDate(3, 10), notes: 'Weekend trip tickets' },
  { id: tid(), title: 'Freelance — Website',   amount: 2000, type: 'income',  category: 'Freelance',     date: demoDate(3, 18), notes: 'Full website build for restaurant' },
  { id: tid(), title: 'Amazon — Electronics',  amount: 220,  type: 'expense', category: 'Shopping',      date: demoDate(3, 22), notes: 'Keyboard + mouse upgrade' },
  { id: tid(), title: 'Disney+ Subscription',  amount: 14,   type: 'expense', category: 'Entertainment', date: demoDate(3, 3),  notes: '' },
  { id: tid(), title: 'Pharmacy — Vitamins',   amount: 42,   type: 'expense', category: 'Health',        date: demoDate(3, 16), notes: '' },

  // ── Month 4 ────────────────────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(4, 1),  notes: '' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(4, 2),  notes: '' },
  { id: tid(), title: 'Electricity Bill',      amount: 78,   type: 'expense', category: 'Bills',         date: demoDate(4, 4),  notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 88,   type: 'expense', category: 'Food',          date: demoDate(4, 6),  notes: '' },
  { id: tid(), title: 'ETF Investment',        amount: 800,  type: 'income',  category: 'Investments',   date: demoDate(4, 15), notes: 'Index fund dividend' },
  { id: tid(), title: 'Gas Station',           amount: 55,   type: 'expense', category: 'Transport',     date: demoDate(4, 9),  notes: '' },
  { id: tid(), title: 'Online Course',         amount: 89,   type: 'expense', category: 'Shopping',      date: demoDate(4, 12), notes: 'Udemy React course' },
  { id: tid(), title: 'Bar with Friends',      amount: 65,   type: 'expense', category: 'Entertainment', date: demoDate(4, 20), notes: '' },
  { id: tid(), title: 'Weekly Groceries',      amount: 71,   type: 'expense', category: 'Food',          date: demoDate(4, 21), notes: '' },

  // ── Month 5 ────────────────────────────────────────────────────────────────
  { id: tid(), title: 'Monthly Salary',        amount: 4500, type: 'income',  category: 'Salary',        date: demoDate(5, 1),  notes: '' },
  { id: tid(), title: 'Apartment Rent',        amount: 1200, type: 'expense', category: 'Bills',         date: demoDate(5, 2),  notes: '' },
  { id: tid(), title: 'Freelance — App Dev',   amount: 1500, type: 'income',  category: 'Freelance',     date: demoDate(5, 8),  notes: 'React Native mobile app' },
  { id: tid(), title: 'Bills & Utilities',     amount: 145,  type: 'expense', category: 'Bills',         date: demoDate(5, 4),  notes: 'All monthly bills combined' },
  { id: tid(), title: 'Grocery Shopping',      amount: 110,  type: 'expense', category: 'Food',          date: demoDate(5, 7),  notes: '' },
  { id: tid(), title: 'Car Maintenance',       amount: 240,  type: 'expense', category: 'Transport',     date: demoDate(5, 15), notes: 'Oil change + tire rotation' },
  { id: tid(), title: 'New Wardrobe',          amount: 320,  type: 'expense', category: 'Shopping',      date: demoDate(5, 22), notes: 'Spring wardrobe refresh' },
  { id: tid(), title: 'Gym + Yoga Classes',    amount: 80,   type: 'expense', category: 'Health',        date: demoDate(5, 1),  notes: '' },
  { id: tid(), title: 'Theme Park Trip',       amount: 145,  type: 'expense', category: 'Entertainment', date: demoDate(5, 28), notes: 'Day trip with family' },
];

// ─── Demo Saving Goals ─────────────────────────────────────────────────────────
export const demoGoals = [
  {
    id:            'goal-001',
    title:         'Emergency Fund',
    targetAmount:  10000,
    currentAmount: 6500,
    deadline:      format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'),
    color:         '#7C3AED',
    icon:          '🛡️',
    status:        'active',
  },
  {
    id:            'goal-002',
    title:         'Vacation to Japan',
    targetAmount:  3000,
    currentAmount: 1200,
    deadline:      format(subMonths(new Date(), -3), 'yyyy-MM-dd'),
    color:         '#06B6D4',
    icon:          '✈️',
    status:        'active',
  },
  {
    id:            'goal-003',
    title:         'New MacBook Pro',
    targetAmount:  2500,
    currentAmount: 2500,
    deadline:      format(subMonths(new Date(), -1), 'yyyy-MM-dd'),
    color:         '#10B981',
    icon:          '💻',
    status:        'completed',
  },
  {
    id:            'goal-004',
    title:         'Investment Portfolio',
    targetAmount:  50000,
    currentAmount: 12300,
    deadline:      format(new Date(new Date().getFullYear() + 1, 11, 31), 'yyyy-MM-dd'),
    color:         '#F59E0B',
    icon:          '📈',
    status:        'active',
  },
];

// ─── Demo Budgets ──────────────────────────────────────────────────────────────
const now = new Date();
const currentMonth = getMonth(now) + 1;
const currentYear  = getYear(now);

export const demoBudgets = [
  { id: 'budget-001', category: 'Food',          limit: 600, spent: 480, month: currentMonth, year: currentYear, alertThreshold: 80 },
  { id: 'budget-002', category: 'Entertainment', limit: 200, spent: 210, month: currentMonth, year: currentYear, alertThreshold: 80 },
  { id: 'budget-003', category: 'Transport',     limit: 150, spent: 90,  month: currentMonth, year: currentYear, alertThreshold: 80 },
  { id: 'budget-004', category: 'Shopping',      limit: 300, spent: 175, month: currentMonth, year: currentYear, alertThreshold: 80 },
  { id: 'budget-005', category: 'Bills',         limit: 1500,spent: 1370,month: currentMonth, year: currentYear, alertThreshold: 80 },
  { id: 'budget-006', category: 'Health',        limit: 200, spent: 120, month: currentMonth, year: currentYear, alertThreshold: 80 },
];

// ─── Computed Demo Stats ───────────────────────────────────────────────────────
export function getDemoStats(transactions = demoTransactions) {
  const totalIncome   = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
}

export function getDemoMonthlyStats(transactions = demoTransactions) {
  const map = {};
  transactions.forEach((t) => {
    const key = getYearMonthKey(new Date(t.date));
    if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 };
    if (t.type === 'income')  map[key].income   += t.amount;
    if (t.type === 'expense') map[key].expenses += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

function getYearMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
