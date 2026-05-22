import { Colors } from './tokens';
import { useUIStore } from '../store/useUIStore';

export type Theme = typeof Colors.dark;

export function useTheme(): Theme & { isDark: boolean } {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  return { ...(isDark ? Colors.dark : Colors.light), isDark };
}
