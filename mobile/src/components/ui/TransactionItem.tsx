import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontSize } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

interface TransactionItemProps {
  transaction: {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  };
  currency?: string;
  onPress?: () => void;
}

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  food:          { icon: 'restaurant-outline',   color: Colors.categories.food },
  transport:     { icon: 'car-outline',          color: Colors.categories.transport },
  shopping:      { icon: 'bag-outline',          color: Colors.categories.shopping },
  health:        { icon: 'medkit-outline',       color: Colors.categories.health },
  entertainment: { icon: 'game-controller-outline', color: Colors.categories.entertainment },
  bills:         { icon: 'receipt-outline',      color: Colors.categories.bills },
  income:        { icon: 'trending-up-outline',  color: Colors.categories.income },
  other:         { icon: 'ellipse-outline',      color: Colors.categories.other },
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  currency = 'USD',
  onPress,
}) => {
  const theme = useTheme();
  const cat = CATEGORY_ICONS[transaction.category] ?? CATEGORY_ICONS.other;
  const isIncome = transaction.type === 'income';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: cat.color + '20' }]}>
        <Ionicons name={cat.icon as any} size={20} color={cat.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.description, { color: theme.text }]} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} · {formatDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? Colors.success : Colors.danger }]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  description: {
    fontSize: FontSize.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  amount: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
});
