import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { Button } from '../../src/components/ui/Button';

const STEPS = [
  {
    emoji: '📊',
    title: 'Smart Dashboard',
    description: 'Get a real-time overview of your income, expenses, and savings all in one place.',
  },
  {
    emoji: '💳',
    title: 'Track Every Cent',
    description: 'Log transactions in seconds. Categorize automatically and search with ease.',
  },
  {
    emoji: '🎯',
    title: 'Budget Like a Pro',
    description: 'Set spending limits by category and get alerts before you overspend.',
  },
  {
    emoji: '📈',
    title: 'Visual Reports',
    description: 'Beautiful charts that reveal your spending patterns and trends over time.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      router.replace('/(app)/dashboard');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity
        onPress={() => router.replace('/(app)/dashboard')}
        style={styles.skip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationWrap}>
        <View style={styles.illustration}>
          <Text style={styles.emoji}>{current.emoji}</Text>
        </View>
      </View>

      {/* Content */}
      <Animated.View key={step} entering={FadeInDown.springify()} style={styles.content}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === step && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          label={isLast ? 'Get Started 🚀' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
    paddingBottom: 48,
  },
  skip: { alignSelf: 'flex-end' },
  skipText: { color: Colors.dark.textSecondary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 180,
    height: 180,
    borderRadius: 60,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 80 },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.extrabold,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 16,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  cta: {},
});
