import { getMonth, getYear, subMonths, parseISO } from 'date-fns';
import { CATEGORIES, getCategoryByName } from './constants';

/**
 * Generate deterministic AI-like financial insights from transaction/budget/goal data
 * Returns up to 5 insight objects: { id, type, title, message }
 */
export function generateInsights(transactions = [], budgets = [], goals = []) {
  const insights = [];
  const now = new Date();
  const curMonth  = getMonth(now);
  const curYear   = getYear(now);
  const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
  const prevYear  = curMonth === 0 ? curYear - 1 : curYear;

  // Split transactions by month
  const thisMo = transactions.filter((t) => {
    const d = parseISO(t.date);
    return getMonth(d) === curMonth && getYear(d) === curYear;
  });
  const lastMo = transactions.filter((t) => {
    const d = parseISO(t.date);
    return getMonth(d) === prevMonth && getYear(d) === prevYear;
  });

  const thisExpenses = thisMo.filter((t) => t.type === 'expense');
  const lastExpenses = lastMo.filter((t) => t.type === 'expense');
  const thisIncome   = thisMo.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastIncome   = lastMo.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // ── Rule 1: Category spending increased >15% vs last month ────────────────
  const thisExpByCategory = groupBy(thisExpenses, 'category');
  const lastExpByCategory = groupBy(lastExpenses, 'category');
  for (const [cat, curAmt] of Object.entries(thisExpByCategory)) {
    const prevAmt = lastExpByCategory[cat] || 0;
    if (prevAmt > 0) {
      const pctChange = ((curAmt - prevAmt) / prevAmt) * 100;
      if (pctChange > 15) {
        const catObj = getCategoryByName(cat);
        insights.push({
          id:      `insight-cat-${cat}`,
          type:    pctChange > 40 ? 'alert' : 'warning',
          title:   `${catObj.icon} ${cat} spending up ${Math.round(pctChange)}%`,
          message: `You spent $${Math.round(curAmt)} on ${cat} this month vs $${Math.round(prevAmt)} last month.`,
        });
      }
    }
  }

  // ── Rule 2: Income increased vs last month ────────────────────────────────
  if (thisIncome > 0 && lastIncome > 0 && thisIncome > lastIncome) {
    const pct = ((thisIncome - lastIncome) / lastIncome) * 100;
    if (pct > 5) {
      insights.push({
        id:      'insight-income-up',
        type:    'success',
        title:   `💰 Income up ${Math.round(pct)}% this month`,
        message: `Great job! Your income increased from $${Math.round(lastIncome)} to $${Math.round(thisIncome)} this month.`,
      });
    }
  }

  // ── Rule 3: Budget exceeded ───────────────────────────────────────────────
  const overBudget = budgets.filter((b) => b.spent > b.limit);
  overBudget.slice(0, 2).forEach((b) => {
    const overage = Math.round(b.spent - b.limit);
    insights.push({
      id:      `insight-budget-${b.id}`,
      type:    'alert',
      title:   `⚠️ ${b.category} budget exceeded`,
      message: `You've gone $${overage} over your $${b.limit} ${b.category} budget this month.`,
    });
  });

  // ── Rule 4: Goal close to completion ────────────────────────────────────
  const nearComplete = goals.filter((g) => {
    const pct = (g.currentAmount / g.targetAmount) * 100;
    return pct >= 80 && pct < 100 && g.status !== 'completed';
  });
  nearComplete.slice(0, 1).forEach((g) => {
    const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
    insights.push({
      id:      `insight-goal-${g.id}`,
      type:    'success',
      title:   `🎯 "${g.title}" is ${pct}% complete!`,
      message: `Almost there! You need $${Math.round(g.targetAmount - g.currentAmount)} more to reach your goal.`,
    });
  });

  // ── Rule 5: No transactions in 7 days ────────────────────────────────────
  const lastTxnDate = transactions.length > 0
    ? new Date(Math.max(...transactions.map((t) => new Date(t.date).getTime())))
    : null;
  if (!lastTxnDate || (now - lastTxnDate) > 7 * 24 * 60 * 60 * 1000) {
    insights.push({
      id:      'insight-no-activity',
      type:    'tip',
      title:   '📝 Keep your records up to date',
      message: 'No recent transactions found. Log your expenses regularly for the most accurate insights.',
    });
  }

  // ── Rule 6: Top spending category this month ─────────────────────────────
  if (Object.keys(thisExpByCategory).length > 0 && insights.length < 4) {
    const topCat = Object.entries(thisExpByCategory).sort(([, a], [, b]) => b - a)[0];
    if (topCat) {
      const catObj = getCategoryByName(topCat[0]);
      insights.push({
        id:      'insight-top-cat',
        type:    'info',
        title:   `${catObj.icon} ${topCat[0]} is your top expense`,
        message: `You've spent $${Math.round(topCat[1])} on ${topCat[0]} this month — your highest category.`,
      });
    }
  }

  // ── Rule 7: Savings rate ─────────────────────────────────────────────────
  if (thisIncome > 0 && insights.length < 5) {
    const totalExp = thisExpenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = ((thisIncome - totalExp) / thisIncome) * 100;
    if (savingsRate > 20) {
      insights.push({
        id:      'insight-savings-rate',
        type:    'success',
        title:   `🌟 Great savings rate: ${Math.round(savingsRate)}%`,
        message: `You're saving ${Math.round(savingsRate)}% of your income this month. Financial experts recommend at least 20%!`,
      });
    } else if (savingsRate < 0) {
      insights.push({
        id:      'insight-overspending',
        type:    'alert',
        title:   '🔴 Spending exceeds income this month',
        message: `Your expenses exceed your income by $${Math.round(Math.abs(thisIncome - totalExp))}. Consider reviewing your budget.`,
      });
    }
  }

  return insights.slice(0, 5);
}

// Helper: sum amounts grouped by a key
function groupBy(txns, key) {
  return txns.reduce((acc, t) => {
    acc[t[key]] = (acc[t[key]] || 0) + t.amount;
    return acc;
  }, {});
}
