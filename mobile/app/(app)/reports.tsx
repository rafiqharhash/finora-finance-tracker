import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/theme/useTheme';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { useUIStore } from '../../src/store/useUIStore';
import {
  DEMO_MONTHLY_TREND,
  DEMO_CATEGORY_BREAKDOWN,
  DEMO_SUMMARY,
} from '../../src/data/demoData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.base * 2;
const CHART_HEIGHT = 180;
const PERIODS = ['6M', '3M', '1M'];

// Simple bar chart (no external lib needed)
function BarChart({ data }: { data: typeof DEMO_MONTHLY_TREND }) {
  const theme = useTheme();
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  const barW = (CHART_WIDTH - 32) / data.length / 2 - 4;

  return (
    <View style={{ height: CHART_HEIGHT + 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT, paddingHorizontal: 8 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
            <View style={{ width: barW, height: (d.income / maxVal) * CHART_HEIGHT, backgroundColor: Colors.success, borderRadius: 4 }} />
            <View style={{ width: barW, height: (d.expenses / maxVal) * CHART_HEIGHT, backgroundColor: Colors.danger, borderRadius: 4 }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 8, marginTop: 6 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', color: theme.textMuted, fontSize: 10 }}>
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}

// Donut-style category breakdown
function CategoryBreakdown({ data }: { data: typeof DEMO_CATEGORY_BREAKDOWN }) {
  const theme = useTheme();
  const palette = Colors.chart;

  return (
    <View style={styles.breakdown}>
      {data.map((item, i) => (
        <View key={item.category} style={styles.breakdownRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.breakdownDot, { backgroundColor: palette[i % palette.length] }]} />
            <Text style={[styles.breakdownCat, { color: theme.text }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
          <View style={[styles.breakdownBarTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.breakdownBar, { width: `${item.percentage}%`, backgroundColor: palette[i % palette.length] }]} />
          </View>
          <Text style={[styles.breakdownPct, { color: theme.textSecondary }]}>{item.percentage}%</Text>
        </View>
      ))}
    </View>
  );
}

export default function ReportsScreen() {
  const theme = useTheme();
  const { currency } = useUIStore();
  const [period, setPeriod] = useState('6M');

  const summary = DEMO_SUMMARY;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Reports</Text>
          <View style={[styles.periodToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodBtn, period === p && { backgroundColor: Colors.primary }]}
              >
                <Text style={[styles.periodText, { color: period === p ? '#fff' : theme.textSecondary }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* KPI Row */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.kpiRow}>
          {[
            { label: 'Net Savings', value: fmt(summary.balance), color: Colors.success },
            { label: 'Savings Rate', value: `${summary.savingsRate}%`, color: Colors.primary },
            { label: '# Transactions', value: String(summary.transactionCount), color: Colors.info },
          ].map((k) => (
            <View key={k.label} style={[styles.kpi, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.kpiVal, { color: k.color }]}>{k.value}</Text>
              <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>{k.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Income vs Expense Chart */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Income vs Expenses</Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Expenses</Text>
            </View>
          </View>
          <BarChart data={DEMO_MONTHLY_TREND} />
        </Animated.View>

        {/* Monthly summary rows */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Monthly Breakdown</Text>
          {DEMO_MONTHLY_TREND.map((row, i) => {
            const net = row.income - row.expenses;
            return (
              <View key={i} style={[styles.monthRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.monthLabel, { color: theme.text }]}>{row.month}</Text>
                <Text style={[styles.monthIncome, { color: Colors.success }]}>{fmt(row.income)}</Text>
                <Text style={[styles.monthExp, { color: Colors.danger }]}>-{fmt(row.expenses)}</Text>
                <Text style={[styles.monthNet, { color: net >= 0 ? Colors.success : Colors.danger }]}>
                  {net >= 0 ? '+' : ''}{fmt(net)}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Category breakdown */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Spending by Category</Text>
          <CategoryBreakdown data={DEMO_CATEGORY_BREAKDOWN} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, letterSpacing: -0.5 },
  periodToggle: { flexDirection: 'row', borderRadius: Radii.md, borderWidth: 1, padding: 3, gap: 2 },
  periodBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radii.sm - 1 },
  periodText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  kpi: { flex: 1, borderRadius: Radii.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center' },
  kpiVal: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  kpiLabel: { fontSize: FontSize.xs, marginTop: 2 },
  card: { borderRadius: Radii.xl, borderWidth: 1, padding: Spacing.base, marginBottom: Spacing.md },
  cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
  legend: { flexDirection: 'row', gap: 16, marginBottom: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  monthRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, gap: 4 },
  monthLabel: { width: 36, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  monthIncome: { flex: 1, textAlign: 'right', fontSize: FontSize.sm },
  monthExp: { flex: 1, textAlign: 'right', fontSize: FontSize.sm },
  monthNet: { flex: 1, textAlign: 'right', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  breakdown: { gap: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownCat: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  breakdownBarTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  breakdownBar: { height: '100%', borderRadius: 4 },
  breakdownPct: { width: 36, textAlign: 'right', fontSize: FontSize.sm },
});
