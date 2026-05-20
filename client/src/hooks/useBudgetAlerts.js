import { useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { DEFAULT_ALERT_THRESHOLD } from '../utils/constants';

/**
 * Budget alerts hook — checks if any budget exceeds its threshold
 * Returns alerts[] and fires toast notifications
 */
export function useBudgetAlerts() {
  const { budgets } = useFinanceStore();
  const { isDemoMode, isAuthenticated } = useAuthStore();

  const alerts = useMemo(() => {
    return budgets
      .filter((b) => {
        const threshold = b.alertThreshold ?? DEFAULT_ALERT_THRESHOLD;
        const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
        return pct >= threshold;
      })
      .map((b) => {
        const pct = Math.round((b.spent / b.limit) * 100);
        const isOverBudget = b.spent > b.limit;
        return {
          id:          b.id || b._id,
          category:    b.category,
          spent:       b.spent,
          limit:       b.limit,
          percentage:  pct,
          isOverBudget,
          severity:    isOverBudget ? 'danger' : 'warning',
          message:     isOverBudget
            ? `${b.category} budget exceeded! ($${b.spent} / $${b.limit})`
            : `${b.category} is at ${pct}% of budget ($${b.spent} / $${b.limit})`,
        };
      });
  }, [budgets]);

  // Fire toast for over-budget items on mount
  useEffect(() => {
    if (!(isDemoMode || isAuthenticated)) return;
    const overBudget = alerts.filter((a) => a.isOverBudget);
    if (overBudget.length > 0) {
      setTimeout(() => {
        overBudget.slice(0, 2).forEach((a) => {
          toast.error(`⚠️ ${a.message}`, { duration: 5000 });
        });
      }, 1500);
    }
  }, []); // Only on mount

  return { alerts, hasAlerts: alerts.length > 0 };
}
