import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUser } from '../utils/demoData';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user:            null,
      token:           null,
      isAuthenticated: false,
      isDemoMode:      false,
      isLoading:       false,

      // ── Actions ────────────────────────────────────────────────────────────
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isDemoMode:      false,
      }),

      logout: () => set({
        user:            null,
        token:           null,
        isAuthenticated: false,
        isDemoMode:      false,
      }),

      setDemoMode: (enabled) => {
        if (enabled) {
          set({
            user:            demoUser,
            token:           'demo-token',
            isAuthenticated: false,
            isDemoMode:      true,
          });
        } else {
          set({ isDemoMode: false, user: null, token: null, isAuthenticated: false });
        }
      },

      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name:    'finora-auth',
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
        isDemoMode:      state.isDemoMode,
      }),
    }
  )
);
