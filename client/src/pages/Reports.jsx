import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { exportTransactionsToCSV } from '../utils/csvExport';
import { CATEGORIES } from '../utils/constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import MonthlyTrendLine from '../components/charts/MonthlyTrendLine';
import { getMonth, getYear, subMonths } from 'date-fns';
import { SHORT_MONTHS } from '../utils/constants';

export default function Reports() {
  const { transactions } = useTransactions();
  const { formatAmount } = useCurrency();
  const [timeRange, setTimeRange] = useState('6M');

  const now = new Date();

  // Compute stats based on timeRange (6M or 1Y)
  const monthsBack = timeRange === '1Y' ? 12 : 6;
  
  const reportData = useMemo(() => {
    const data = [...Array(monthsBack)].map((_, i) => {
      const d = subMonths(now, (monthsBack - 1) - i);
      const mo = getMonth(d) + 1;
      const yr = getYear(d);
      
      const txns = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getMonth() + 1 === mo && td.getFullYear() === yr;
      });
      
      const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      
      return {
        month: `${SHORT_MONTHS[mo - 1]} ${yr.toString().slice(-2)}`,
        income,
        expenses,
        balance: income - expenses
      };
    });
    return data;
  }, [transactions, monthsBack, now]);

  // Aggregate Category Breakdown for the period
  const categoryBreakdown = useMemo(() => {
    const startDate = subMonths(now, monthsBack);
    const txns = transactions.filter(t => new Date(t.date) >= startDate && t.type === 'expense');
    
    return txns.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  }, [transactions, monthsBack, now]);

  const totalPeriodIncome = reportData.reduce((s, d) => s + d.income, 0);
  const totalPeriodExpenses = reportData.reduce((s, d) => s + d.expenses, 0);
  const averageMonthlySavings = (totalPeriodIncome - totalPeriodExpenses) / monthsBack;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Financial Reports</h1>
          <p className="section-subtitle">Deep dive into your financial health</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button onClick={() => setTimeRange('6M')} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeRange === '6M' ? 'bg-[var(--bg-secondary)] shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>6 Months</button>
            <button onClick={() => setTimeRange('1Y')} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeRange === '1Y' ? 'bg-[var(--bg-secondary)] shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>1 Year</button>
          </div>
          <Button variant="secondary" size="md" icon={Download} onClick={() => exportTransactionsToCSV(transactions, `finora-report-${timeRange}`)}>
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card padding="sm">
          <p className="text-sm text-[var(--text-muted)] mb-1">Period Income</p>
          <p className="text-2xl font-bold text-success-500 tabular-nums">{formatAmount(totalPeriodIncome)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-[var(--text-muted)] mb-1">Period Expenses</p>
          <p className="text-2xl font-bold text-danger-500 tabular-nums">{formatAmount(totalPeriodExpenses)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-[var(--text-muted)] mb-1">Avg. Monthly Savings</p>
          <p className={`text-2xl font-bold tabular-nums ${averageMonthlySavings >= 0 ? 'text-primary-500' : 'text-danger-500'}`}>
            {formatAmount(averageMonthlySavings)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendLine data={reportData} />
        <IncomeExpenseBar data={reportData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExpensePieChart data={categoryBreakdown} />
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h2 className="section-title text-base mb-4">Category Spending Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([catName, amount], idx) => {
                  const cat = CATEGORIES.find(c => c.name === catName) || CATEGORIES[0];
                  const pct = (amount / totalPeriodExpenses) * 100;
                  return (
                    <motion.div key={catName} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ backgroundColor: `${cat.color}18` }}>
                        {cat.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{catName}</p>
                          <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">{formatAmount(amount)}</p>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
