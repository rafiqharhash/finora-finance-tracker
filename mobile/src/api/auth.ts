import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authApi = {
  login: async (payload: LoginPayload) => {
    await delay(100); // slight async feel
    const usersStr = await AsyncStorage.getItem('@finora_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find((u: any) => u.email === payload.email && u.password === payload.password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `fake-jwt-token-${user.id}`;
    return { token, data: { user } };
  },

  register: async (payload: RegisterPayload) => {
    await delay(100);
    const usersStr = await AsyncStorage.getItem('@finora_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find((u: any) => u.email === payload.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: payload.name,
      email: payload.email,
      password: payload.password, // storing plain text for offline mock
      currency: 'USD',
      monthlyIncome: 0,
    };
    
    users.push(newUser);
    await AsyncStorage.setItem('@finora_users', JSON.stringify(users));
    
    const token = `fake-jwt-token-${newUser.id}`;
    return { token, data: { user: newUser } };
  },

  getMe: async () => {
    await delay(50);
    const authState = useAuthStore.getState();
    if (!authState.user) throw new Error('Not authenticated');
    return { data: { user: authState.user } };
  },

  logout: async () => {
    await delay(50);
    return { success: true };
  },

  refreshToken: async () => {
    await delay(50);
    const authState = useAuthStore.getState();
    return { token: `fake-jwt-token-${authState.user?.id}-refreshed` };
  },
};
