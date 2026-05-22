import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useUIStore } from '../../src/store/useUIStore';
import { useTheme } from '../../src/theme/useTheme';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'ZAR'];

interface SettingRowProps {
  icon: string;
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ icon, iconColor, label, value, onPress, rightElement, danger }: SettingRowProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.row, { borderBottomColor: theme.border }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? Colors.danger : theme.text }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={[styles.rowValue, { color: theme.textMuted }]}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && (
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {children}
      </View>
    </Animated.View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, isDemoMode } = useAuthStore();
  const { theme, toggleTheme, currency, setCurrency } = useUIStore();
  const appTheme = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/landing');
        },
      },
    ]);
  };

  const handleCurrencyPicker = () => {
    Alert.alert(
      'Select Currency',
      undefined,
      CURRENCIES.map((c) => ({
        text: c === currency ? `✓ ${c}` : c,
        onPress: () => setCurrency(c),
      })).concat([{ text: 'Cancel', style: 'cancel' } as any])
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: appTheme.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <Text style={[styles.title, { color: appTheme.text }]}>Settings</Text>

        {/* Profile */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={[styles.profileCard, { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: appTheme.text }]}>{user?.name ?? 'User'}</Text>
              <Text style={[styles.profileEmail, { color: appTheme.textMuted }]}>{user?.email ?? ''}</Text>
              {isDemoMode && (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>Demo Mode</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Preferences */}
        <Section title="PREFERENCES">
          <SettingRow
            icon="moon-outline"
            iconColor={Colors.primary}
            label="Dark Mode"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ true: Colors.primary, false: appTheme.border }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            icon="cash-outline"
            iconColor={Colors.success}
            label="Currency"
            value={currency}
            onPress={handleCurrencyPicker}
          />
          <SettingRow
            icon="notifications-outline"
            iconColor={Colors.warning}
            label="Notifications"
            value="Enabled"
            onPress={() => {}}
          />
        </Section>

        {/* Account */}
        <Section title="ACCOUNT">
          <SettingRow
            icon="person-outline"
            iconColor={Colors.info}
            label="Edit Profile"
            onPress={() => {}}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            iconColor={Colors.success}
            label="Privacy & Security"
            onPress={() => {}}
          />
          <SettingRow
            icon="lock-closed-outline"
            iconColor={Colors.primary}
            label="Change Password"
            onPress={() => {}}
          />
        </Section>

        {/* About */}
        <Section title="ABOUT">
          <SettingRow
            icon="information-circle-outline"
            iconColor={Colors.info}
            label="Version"
            value="1.0.0"
          />
          <SettingRow
            icon="document-text-outline"
            iconColor={appTheme.textMuted}
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingRow
            icon="shield-outline"
            iconColor={appTheme.textMuted}
            label="Privacy Policy"
            onPress={() => {}}
          />
        </Section>

        {/* Logout */}
        <Section title="">
          <SettingRow
            icon="log-out-outline"
            iconColor={Colors.danger}
            label="Sign Out"
            onPress={handleLogout}
            danger
          />
        </Section>

        <Text style={[styles.footer, { color: appTheme.textMuted }]}>
          Finora v1.0.0 · Made with ❤️
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 40 },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, letterSpacing: -0.5, marginBottom: Spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center', borderRadius: Radii.xl, borderWidth: 1, padding: Spacing.base, marginBottom: Spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  profileEmail: { fontSize: FontSize.sm, marginTop: 2 },
  demoBadge: { marginTop: 6, backgroundColor: Colors.warning + '20', borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'flex-start' },
  demoBadgeText: { color: Colors.warning, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 },
  sectionCard: { borderRadius: Radii.xl, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  rowLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: FontSize.sm },
  footer: { textAlign: 'center', fontSize: FontSize.xs, marginTop: 8 },
});
