import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subMonths, getMonth, getYear } from 'date-fns';
import { Sparkles, TrendingUp, Bell, Download } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useFinanceStore } from '../store/useFinanceStore';
import { useCurrency } from '../hooks/useCurrency';
import { useBudgetAlerts } from '../hooks/useBudgetAlerts';
import { generateInsights } from '../utils/insights';
import { SHORT_MONTHS } from '../utils/constants';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsGoalCard from '../components/dashboard/SavingsGoalCard';
import { InsightsList } from '../components/dashboard/InsightCard';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyTrendLine from '../components/charts/MonthlyTrendLine';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const { transactions, categoryBreakdown, totalIncome, totalExpenses, balance } = useTransactions();
  const { goals, budgets } = useFinanceStore();
  const { formatAmount } = useCurrency();
  const { alerts } = useBudgetAlerts();

  // Savings rate for current month
  const now = new Date();
  const curMonth = getMonth(now) + 1;
  const curYear  = getYear(now);
  const thisMonthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === curMonth && d.getFullYear() === curYear;
  });
  const thisIncome   = thisMonthTxns.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
  const thisExpenses = thisMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate  = thisIncome > 0 ? Math.round(((thisIncome - thisExpenses) / thisIncome) * 100) : 0;

  // Monthly trend data (last 6 months)
  const monthlyData = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const d     = subMonths(now, 5 - i);
      const mo    = getMonth(d) + 1;
      const yr    = getYear(d);
      const txns  = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getMonth() + 1 === mo && td.getFullYear() === yr;
      });
      return {
        month:    SHORT_MONTHS[mo - 1],
        income:   txns.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0),
        expenses: txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  // AI Insights
  const insights = useMemo(
    () => generateInsights(transactions, budgets, goals),
    [transactions, budgets, goals]
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="section-title text-2xl">Dashboard</h1>
          <p className="section-subtitle">
            {format(now, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-danger-500/10 border border-danger-500/20">
            <Bell size={14} className="text-danger-500" />
            <span className="text-xs font-medium text-danger-500">{alerts.length} budget alert{alerts.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUp}><StatsCard type="balance"  amount={balance}       index={0} /></motion.div>
        <motion.div variants={fadeUp}><StatsCard type="income"   amount={totalIncome}   index={1} /></motion.div>
        <motion.div variants={fadeUp}><StatsCard type="expenses" amount={totalExpenses} index={2} /></motion.div>
        <motion.div variants={fadeUp}><StatsCard type="savings"  amount={Math.max(0, savingsRate)} isSavings index={3} /></motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendLine data={monthlyData} />
        </div>
        <div>
          <ExpensePieChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Bar Chart */}
      <IncomeExpenseBar data={monthlyData} />

      {/* Bottom Row: Recent + Goals + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>

        {/* Savings Goals */}
        <div className="lg:col-span-1">
          <Card>
            <SavingsGoalCard goals={goals} />
          </Card>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary-500" />
              <h2 className="text-base font-semibold text-[var(--text-primary)]">AI Insights</h2>
              <Badge variant="primary" size="sm">Smart</Badge>
            </div>
            <InsightsList insights={insights} />
          </Card>
        </div>
      </div>
    </div>
  );
}
