import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing, Shadow } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glass?: boolean;
  elevated?: boolean;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  glass = false,
  elevated = false,
  padding = Spacing.base,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: glass ? theme.cardGlass : theme.card,
          borderColor: theme.border,
          borderRadius: Radii.xl,
          padding,
        },
        elevated && Shadow.md,
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  color = Colors.primary,
  icon,
  style,
}) => {
  const theme = useTheme();

  return (
    <Card elevated style={[{ flex: 1 }, style]}>
      <View style={styles.statHeader}>
        {icon && (
          <View style={[styles.iconBadge, { backgroundColor: color + '20' }]}>
            {icon}
          </View>
        )}
      </View>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSub, { color: theme.textMuted }]}>{subtitle}</Text>
      )}
    </Card>
  );
};

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => {
  const theme = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {action && (
        <Text style={[styles.sectionAction, { color: Colors.primary }]} onPress={onAction}>
          {action}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  statHeader: {
    marginBottom: 8,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
});
