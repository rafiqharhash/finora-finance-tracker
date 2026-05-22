import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
  theme: 'dark' | 'light';
  currency: string;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setCurrency: (currency: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      currency: 'USD',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'finora-ui',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
