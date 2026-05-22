import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { Colors } from '../src/theme/tokens';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isDemoMode, isLoading, setLoading } = useAuthStore();

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const logoAnim = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const textAnim = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  useEffect(() => {
    // Animate in
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    // Route after animation
    const timer = setTimeout(() => {
      setLoading(false);
      if (isAuthenticated || isDemoMode) {
        router.replace('/(app)/dashboard');
      } else {
        router.replace('/(auth)/landing');
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, logoAnim]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
      </Animated.View>
      <Animated.View style={textAnim}>
        <Text style={styles.appName}>Finora</Text>
        <Text style={styles.tagline}>Smart Finance Tracker</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -2,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
});
