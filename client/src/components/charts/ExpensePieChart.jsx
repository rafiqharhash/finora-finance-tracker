import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryByName, CHART_COLORS } from '../../utils/constants';
import { useCurrency } from '../../hooks/useCurrency';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

const CustomTooltip = ({ active, payload, formatAmount }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const cat = getCategoryByName(name);
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 shadow-glass text-sm">
      <p className="font-semibold text-[var(--text-primary)] mb-1">{cat.icon} {name}</p>
      <p className="text-[var(--text-muted)]">{formatAmount(value)}</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
    {payload?.map((entry) => {
      const cat = getCategoryByName(entry.value);
      return (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          {cat.icon} {entry.value}
        </div>
      );
    })}
  </div>
);

export default function ExpensePieChart({ data = {} }) {
  const { formatAmount } = useCurrency();

  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <Card className="h-full">
      <h2 className="section-title text-base mb-1">Expense Breakdown</h2>
      <p className="text-xs text-[var(--text-muted)] mb-4">By category this month</p>

      {chartData.length === 0 ? (
        <EmptyState icon="🥧" title="No expense data" description="Add some transactions to see the breakdown" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={getCategoryByName(entry.name).color || CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip formatAmount={formatAmount} />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
