import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '../../src/theme/tokens';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/useAuthStore';
import { authApi } from '../../src/api/auth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setToken(res.token);
      setUser(res.data?.user ?? res.user);
      setAuthenticated(true);
      router.replace('/(auth)/onboarding');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.response?.data?.message ?? 'Please try again.');
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
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join Finora and take control of your finances</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } }}
          render={({ field: { onChange, value } }) => (
            <Input label="Full Name" icon="person-outline" placeholder="Alex Johnson" value={value} onChangeText={onChange} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } }}
          render={({ field: { onChange, value } }) => (
            <Input label="Email" icon="mail-outline" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
          render={({ field: { onChange, value } }) => (
            <Input label="Password" icon="lock-closed-outline" placeholder="At least 6 characters" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' }}
          render={({ field: { onChange, value } }) => (
            <Input label="Confirm Password" icon="shield-checkmark-outline" placeholder="Repeat password" secureTextEntry value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
          )}
        />

        <Button label="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.submitBtn} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Sign in</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.dark.background },
  container: { flexGrow: 1, padding: Spacing['2xl'], paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { color: Colors.dark.textSecondary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  title: { fontSize: FontSize['3xl'], fontWeight: FontWeight.extrabold, color: '#fff', letterSpacing: -1, marginBottom: 8 },
  subtitle: { fontSize: FontSize.base, color: Colors.dark.textSecondary, marginBottom: 32 },
  form: { gap: 4 },
  submitBtn: { marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: Colors.dark.textSecondary, fontSize: FontSize.base },
  footerLink: { color: Colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.semibold },
});
