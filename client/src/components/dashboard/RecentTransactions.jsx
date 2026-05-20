import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { useCurrency } from '../../hooks/useCurrency';
import { formatDate, formatRelativeDate } from '../../utils/formatters';
import { getCategoryById, getCategoryByName } from '../../utils/constants';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';

export default function RecentTransactions() {
  const navigate = useNavigate();
  const { recentTransactions } = useTransactions();
  const { formatAmount } = useCurrency();

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title text-base">Recent Transactions</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Last {recentTransactions.length} activities</p>
        </div>
        <button
          onClick={() => navigate('/app/transactions')}
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {/* List */}
      {recentTransactions.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No transactions yet"
          description="Add your first transaction using the + button"
        />
      ) : (
        <div className="flex-1 space-y-1 overflow-y-auto -mx-1 px-1">
          {recentTransactions.map((txn, idx) => {
            const cat = getCategoryByName(txn.category);
            return (
              <motion.div
                key={txn.id || txn._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer group"
                onClick={() => navigate('/app/transactions')}
              >
                {/* Category Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  {cat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{txn.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {txn.category} · {formatRelativeDate(txn.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-sm font-semibold tabular-nums ${
                    txn.type === 'income' ? 'text-success-500' : 'text-danger-500'
                  }`}>
                    {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    txn.type === 'income'
                      ? 'bg-success-100 dark:bg-success-900/30'
                      : 'bg-danger-100 dark:bg-danger-900/30'
                  }`}>
                    {txn.type === 'income'
                      ? <ArrowUpRight size={11} className="text-success-600 dark:text-success-400" />
                      : <ArrowDownLeft size={11} className="text-danger-600 dark:text-danger-400" />
                    }
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
