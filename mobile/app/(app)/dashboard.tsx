import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useUIStore } from '../../src/store/useUIStore';
import { useTheme } from '../../src/theme/useTheme';
import { Colors, Spacing, Radii, FontSize, FontWeight, Shadow } from '../../src/theme/tokens';
import { Card, SectionHeader } from '../../src/components/ui/Card';
import { TransactionItem } from '../../src/components/ui/TransactionItem';
import {
  DEMO_TRANSACTIONS,
  DEMO_SUMMARY,
  DEMO_AI_INSIGHTS,
} from '../../src/data/demoData';

export default function DashboardScreen() {
  const { user, isDemoMode } = useAuthStore();
  const { currency } = useUIStore();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const summary = DEMO_SUMMARY;
  const recentTxns = DEMO_TRANSACTIONS.slice(0, 5);
  const insights = DEMO_AI_INSIGHTS;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInsightColor = (type: string) => {
    if (type === 'success') return Colors.success;
    if (type === 'warning') return Colors.warning;
    return Colors.info;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>{greeting()},</Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name?.split(' ')[0] ?? 'there'} 👋
            </Text>
          </View>
          {isDemoMode && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO</Text>
            </View>
          )}
        </Animated.View>

        {/* Hero Balance Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.px}>
          <View style={[styles.balanceCard, Shadow.purple]}>
            <View style={styles.balanceOrb} />
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(summary.balance)}</Text>
            <View style={styles.balanceStats}>
              <View style={styles.balanceStat}>
                <Ionicons name="arrow-up-circle" size={16} color={Colors.success} />
                <Text style={styles.balanceStatText}>{formatCurrency(summary.totalIncome)}</Text>
                <Text style={styles.balanceStatLabel}>Income</Text>
              </View>
              <View style={[styles.balanceDivider]} />
              <View style={styles.balanceStat}>
                <Ionicons name="arrow-down-circle" size={16} color={Colors.danger} />
                <Text style={styles.balanceStatText}>{formatCurrency(summary.totalExpenses)}</Text>
                <Text style={styles.balanceStatLabel}>Expenses</Text>
              </View>
              <View style={[styles.balanceDivider]} />
              <View style={styles.balanceStat}>
                <Ionicons name="trending-up" size={16} color={Colors.primary} />
                <Text style={styles.balanceStatText}>{summary.savingsRate}%</Text>
                <Text style={styles.balanceStatLabel}>Saved</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.section}>
          <SectionHeader title="This Month" />
          <View style={styles.statsRow}>
            <Card elevated style={[styles.statCard, { backgroundColor: Colors.successSurface }]}>
              <Ionicons name="trending-up" size={20} color={Colors.success} />
              <Text style={[styles.statVal, { color: Colors.success }]}>{formatCurrency(summary.totalIncome)}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Income</Text>
            </Card>
            <Card elevated style={[styles.statCard, { backgroundColor: Colors.dangerSurface }]}>
              <Ionicons name="trending-down" size={20} color={Colors.danger} />
              <Text style={[styles.statVal, { color: Colors.danger }]}>{formatCurrency(summary.totalExpenses)}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Expenses</Text>
            </Card>
            <Card elevated style={[styles.statCard, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="wallet" size={20} color={Colors.primary} />
              <Text style={[styles.statVal, { color: Colors.primary }]}>{summary.transactionCount}</Text>
              <Text style={[styles.statLbl, { color: theme.textMuted }]}>Txns</Text>
            </Card>
          </View>
        </Animated.View>

        {/* AI Insights */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <SectionHeader title="AI Insights ✨" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insightsScroll}>
            {insights.map((insight) => {
              const color = getInsightColor(insight.type);
              return (
                <View
                  key={insight.id}
                  style={[styles.insightCard, { backgroundColor: theme.surface, borderColor: color + '40' }]}
                >
                  <View style={[styles.insightDot, { backgroundColor: color }]} />
                  <Text style={[styles.insightTitle, { color: theme.text }]}>{insight.title}</Text>
                  <Text style={[styles.insightMsg, { color: theme.textSecondary }]}>{insight.message}</Text>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={[styles.section, { paddingBottom: 24 }]}>
          <SectionHeader title="Recent Transactions" action="See All" />
          {recentTxns.map((txn) => (
            <TransactionItem key={txn._id} transaction={txn as any} currency={currency} />
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  greeting: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  userName: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, letterSpacing: -0.5 },
  demoBadge: {
    backgroundColor: Colors.warning + '20',
    borderWidth: 1,
    borderColor: Colors.warning + '60',
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  demoBadgeText: { color: Colors.warning, fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1 },
  px: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  balanceCard: {
    borderRadius: Radii['2xl'],
    backgroundColor: Colors.primary,
    padding: Spacing['2xl'],
    overflow: 'hidden',
  },
  balanceOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    right: -60,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold, letterSpacing: -1.5, marginBottom: Spacing.lg },
  balanceStats: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  balanceStat: { flex: 1, alignItems: 'center', gap: 2 },
  balanceStatText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
  balanceStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.xs },
  balanceDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.md },
  statVal: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  statLbl: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  insightsScroll: { marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base },
  insightCard: {
    width: 240,
    borderRadius: Radii.xl,
    borderWidth: 1,
    padding: Spacing.base,
    marginRight: Spacing.sm,
  },
  insightDot: { width: 8, height: 8, borderRadius: 4, marginBottom: Spacing.sm },
  insightTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, marginBottom: 4 },
  insightMsg: { fontSize: FontSize.sm, lineHeight: 18 },
});
