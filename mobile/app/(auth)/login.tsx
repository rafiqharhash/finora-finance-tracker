import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/useAuthStore';
import { authApi } from '../../src/api/auth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated, setLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      setToken(res.token);
      setUser(res.data?.user ?? res.user);
      setAuthenticated(true);
      router.replace('/(app)/dashboard');
    } catch (err: any) {
      Alert.alert(
        'Login Failed',
        err?.response?.data?.message ?? 'Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your Finora account</Text>
      </Animated.View>

      {/* Form */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          label="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.submitBtn}
        />
      </Animated.View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>Create one</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark.background },
  container: {
    flexGrow: 1,
    padding: Spacing['2xl'],
    paddingTop: 60,
    justifyContent: 'center',
  },
  back: { marginBottom: 32 },
  backText: { color: Colors.dark.textSecondary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.extrabold,
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: { fontSize: FontSize.base, color: Colors.dark.textSecondary, marginBottom: 32 },
  form: { gap: 4 },
  submitBtn: { marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: Colors.dark.textSecondary, fontSize: FontSize.base },
  footerLink: { color: Colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.semibold },
});
