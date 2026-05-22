// Finora Design System — Color Tokens & Theme
export const Colors = {
  // Brand
  primary: '#7C3AED',
  primaryLight: '#9D5FF3',
  primaryDark: '#6027C8',
  primarySurface: 'rgba(124, 58, 237, 0.12)',

  // Semantic
  success: '#10B981',
  successSurface: 'rgba(16, 185, 129, 0.12)',
  danger: '#F43F5E',
  dangerSurface: 'rgba(244, 63, 94, 0.12)',
  warning: '#F59E0B',
  warningSurface: 'rgba(245, 158, 11, 0.12)',
  info: '#3B82F6',
  infoSurface: 'rgba(59, 130, 246, 0.12)',

  // Dark Theme
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#263348',
    border: '#334155',
    borderSubtle: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    overlay: 'rgba(15, 23, 42, 0.85)',
    card: '#1E293B',
    cardGlass: 'rgba(30, 41, 59, 0.7)',
    tabBar: '#0F172A',
  },

  // Light Theme
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    overlay: 'rgba(248, 250, 252, 0.85)',
    card: '#FFFFFF',
    cardGlass: 'rgba(255, 255, 255, 0.8)',
    tabBar: '#FFFFFF',
  },

  // Chart palette
  chart: ['#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#F43F5E', '#06B6D4'],

  // Category colors
  categories: {
    food: '#F59E0B',
    transport: '#3B82F6',
    shopping: '#EC4899',
    health: '#10B981',
    entertainment: '#8B5CF6',
    bills: '#F43F5E',
    income: '#10B981',
    other: '#64748B',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 38,
} as const;

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  purple: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
