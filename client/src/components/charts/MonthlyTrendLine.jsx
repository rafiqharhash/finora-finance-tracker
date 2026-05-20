import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, ReferenceLine,
} from 'recharts';
import { useCurrency } from '../../hooks/useCurrency';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

const CustomTooltip = ({ active, payload, label, formatAmount }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 shadow-glass text-sm">
      <p className="font-semibold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-[var(--text-muted)] capitalize">{entry.name}:</span>
          <span className="font-medium text-[var(--text-primary)]">{formatAmount(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyTrendLine({ data = [] }) {
  const { formatAmount } = useCurrency();

  return (
    <Card className="h-full">
      <h2 className="section-title text-base mb-1">Spending Trend</h2>
      <p className="text-xs text-[var(--text-muted)] mb-4">6-month overview</p>

      {data.length === 0 ? (
        <EmptyState icon="📈" title="Not enough data" description="Add transactions across multiple months to see your trend" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip formatAmount={formatAmount} />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F43F5E"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              dot={{ fill: '#F43F5E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
