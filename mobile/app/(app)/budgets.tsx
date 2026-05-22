import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/theme/useTheme';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { DEMO_BUDGETS } from '../../src/data/demoData';
import { useUIStore } from '../../src/store/useUIStore';

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  food:          { icon: 'restaurant-outline', color: Colors.categories.food },
  transport:     { icon: 'car-outline',        color: Colors.categories.transport },
  shopping:      { icon: 'bag-outline',        color: Colors.categories.shopping },
  health:        { icon: 'medkit-outline',     color: Colors.categories.health },
  entertainment: { icon: 'game-controller-outline', color: Colors.categories.entertainment },
  bills:         { icon: 'receipt-outline',    color: Colors.categories.bills },
  other:         { icon: 'ellipse-outline',    color: Colors.categories.other },
};

interface BudgetCardProps {
  budget: typeof DEMO_BUDGETS[0];
  currency: string;
}

function BudgetCard({ budget, currency }: BudgetCardProps) {
  const theme = useTheme();
  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const isOver = budget.spent > budget.limit;
  const isWarning = pct >= 80 && !isOver;

  const cat = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.other;
  const barColor = isOver ? Colors.danger : isWarning ? Colors.warning : Colors.success;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <View style={[styles.budgetCard, { backgroundColor: theme.card, borderColor: isOver ? Colors.danger + '40' : theme.border }]}>
        <View style={styles.budgetHeader}>
          <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
            <Ionicons name={cat.icon as any} size={18} color={cat.color} />
          </View>
          <View style={styles.budgetInfo}>
            <Text style={[styles.catName, { color: theme.text }]}>
              {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
            </Text>
            <Text style={[styles.budgetMeta, { color: theme.textMuted }]}>
              {fmt(budget.spent)} of {fmt(budget.limit)}
            </Text>
          </View>
          <View style={[styles.pctBadge, { backgroundColor: barColor + '20' }]}>
            <Text style={[styles.pctText, { color: barColor }]}>{Math.round(pct)}%</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={[styles.track, { backgroundColor: theme.border }]}>
          <View style={[styles.bar, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>

        {/* Status */}
        {isOver ? (
          <View style={styles.alertRow}>
            <Ionicons name="warning" size={13} color={Colors.danger} />
            <Text style={[styles.alertText, { color: Colors.danger }]}>
              Over budget by {fmt(Math.abs(remaining))}
            </Text>
          </View>
        ) : isWarning ? (
          <View style={styles.alertRow}>
            <Ionicons name="alert-circle" size={13} color={Colors.warning} />
            <Text style={[styles.alertText, { color: Colors.warning }]}>
              Only {fmt(remaining)} remaining
            </Text>
          </View>
        ) : (
          <Text style={[styles.remaining, { color: Colors.success }]}>
            {fmt(remaining)} remaining
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

export default function BudgetsScreen() {
  const theme = useTheme();
  const { currency } = useUIStore();
  const budgets = DEMO_BUDGETS;

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Budgets</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total Budget</Text>
            <Text style={[styles.summaryVal, { color: theme.text }]}>{fmt(totalLimit)}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Spent</Text>
            <Text style={[styles.summaryVal, { color: Colors.danger }]}>{fmt(totalSpent)}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Over Limit</Text>
            <Text style={[styles.summaryVal, { color: overBudgetCount > 0 ? Colors.danger : Colors.success }]}>
              {overBudgetCount}
            </Text>
          </View>
        </Animated.View>

        {/* Budget cards */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Budgets</Text>
        {budgets.map((b) => (
          <BudgetCard key={b._id} budget={b} currency={currency} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, letterSpacing: -0.5 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  summaryCard: { flexDirection: 'row', borderRadius: Radii.xl, borderWidth: 1, padding: Spacing.base, marginBottom: Spacing.lg },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, marginBottom: 4 },
  summaryVal: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  summaryDivider: { width: 1 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
  budgetCard: { borderRadius: Radii.xl, borderWidth: 1, padding: Spacing.base, marginBottom: Spacing.md },
  budgetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  budgetInfo: { flex: 1 },
  catName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  budgetMeta: { fontSize: FontSize.xs, marginTop: 2 },
  pctBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  pctText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  track: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.sm },
  bar: { height: '100%', borderRadius: 4 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alertText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  remaining: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
