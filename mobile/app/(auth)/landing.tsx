import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { useAuthStore } from '../../src/store/useAuthStore';
import { DEMO_USER } from '../../src/data/demoData';

const { width, height } = Dimensions.get('window');

const Feature = ({ icon, title, delay }: { icon: string; title: string; delay: number }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.feature}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{title}</Text>
  </Animated.View>
);

export default function LandingScreen() {
  const router = useRouter();
  const { setDemoMode, setUser, setAuthenticated } = useAuthStore();

  const handleDemo = () => {
    setUser(DEMO_USER);
    setDemoMode(true);
    setAuthenticated(false);
    router.replace('/(app)/dashboard');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <View style={styles.gradientBg}>
        <View style={styles.orb1} />
        <View style={styles.orb2} />
      </View>

      {/* Logo */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoSection}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>F</Text>
        </View>
        <Text style={styles.appName}>Finora</Text>
        <Text style={styles.tagline}>Your premium finance companion</Text>
      </Animated.View>

      {/* Features */}
      <View style={styles.features}>
        <Feature icon="📊" title="Smart Dashboard" delay={200} />
        <Feature icon="💳" title="Track Transactions" delay={300} />
        <Feature icon="🎯" title="Budget Goals" delay={400} />
        <Feature icon="📈" title="Visual Reports" delay={500} />
      </View>

      {/* CTAs */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Get Started Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDemo} activeOpacity={0.7}>
          <Text style={styles.demoText}>Try Demo Mode — No Sign-up Required</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  orb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124,58,237,0.18)',
    top: -80,
    right: -80,
  },
  orb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(16,185,129,0.1)',
    bottom: 100,
    left: -60,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  logoLetter: {
    fontSize: 44,
    fontWeight: '800',
    color: '#fff',
  },
  appName: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.extrabold,
    color: '#fff',
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: FontSize.base,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    fontWeight: FontWeight.medium,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 16,
  },
  feature: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: (width - 80) / 2 - 6,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  featureText: {
    color: Colors.dark.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  ctaSection: {
    gap: Spacing.md,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radii.lg,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    paddingVertical: 16,
    borderRadius: Radii.lg,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.dark.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  demoText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});
