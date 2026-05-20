import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      theme:       'dark',
      sidebarOpen: true,
      currency:    'USD',
      activePage:  'dashboard',

      // ── Actions ────────────────────────────────────────────────────────────
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
      },

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setCurrency: (currency) => set({ currency }),

      setActivePage: (activePage) => set({ activePage }),
    }),
    {
      name: 'finora-ui',
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydrate
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
