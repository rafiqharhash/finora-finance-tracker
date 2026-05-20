import { useCallback } from 'react';
import { useUIStore } from '../store/useUIStore';

/**
 * Theme hook — wraps useUIStore with convenience accessors
 */
export function useTheme() {
  const { theme, toggleTheme, setTheme } = useUIStore();

  const isDark  = theme === 'dark';
  const isLight = theme === 'light';

  return { theme, isDark, isLight, toggleTheme, setTheme };
}
