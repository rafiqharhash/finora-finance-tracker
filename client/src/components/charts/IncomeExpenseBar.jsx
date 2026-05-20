import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
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
        <div key={entry.name} className="flex items-center gap-2 text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.fill }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-medium text-[var(--text-primary)]">{formatAmount(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function IncomeExpenseBar({ data = [] }) {
  const { formatAmount } = useCurrency();

  return (
    <Card className="h-full">
      <h2 className="section-title text-base mb-1">Income vs Expenses</h2>
      <p className="text-xs text-[var(--text-muted)] mb-4">Monthly comparison</p>

      {data.length === 0 ? (
        <EmptyState icon="📊" title="No data yet" description="Add transactions to see your monthly comparison" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barGap={4} barSize={14}>
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
            <Tooltip content={<CustomTooltip formatAmount={formatAmount} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)', paddingTop: '16px' }}
              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Bar dataKey="income"   fill="#10B981" radius={[4, 4, 0, 0]} name="income" />
            <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} name="expenses" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
