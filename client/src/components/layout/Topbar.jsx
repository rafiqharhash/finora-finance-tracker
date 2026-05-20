import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, Search, Sun, Moon, Bell, TrendingUp,
  Settings, LogOut, User, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useBudgetAlerts } from '../../hooks/useBudgetAlerts';
import { useDebounce } from '../../hooks/useDebounce';
import { getInitials } from '../../utils/formatters';
import Dropdown from '../ui/Dropdown';

export default function Topbar({ onMenuClick }) {
  const navigate  = useNavigate();
  const { user, isDemoMode, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { setFilters } = useFinanceStore();
  const { alerts } = useBudgetAlerts();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  // Apply search filter when debounced value changes
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setFilters({ search: val });
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const userMenuItems = [
    { label: 'Profile & Settings', icon: Settings, onClick: () => navigate('/app/settings') },
    { divider: true },
    { label: 'Sign Out', icon: LogOut, onClick: handleLogout, danger: true },
  ];

  return (
    <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center px-4 gap-4 flex-shrink-0 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="font-bold text-[var(--text-primary)]">Finora</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchValue}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Demo Badge */}
        {isDemoMode && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
            <Sparkles size={12} className="text-primary-400" />
            <span className="text-xs font-medium text-primary-400">Demo</span>
          </div>
        )}

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <Bell size={18} />
          </button>
          {alerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-[var(--bg-secondary)]" />
          )}
        </div>

        {/* User Avatar Dropdown */}
        <Dropdown
          trigger={
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-sm font-bold shadow-violet cursor-pointer"
            >
              {getInitials(user?.name || 'U')}
            </motion.button>
          }
          items={userMenuItems}
          align="right"
        />
      </div>
    </header>
  );
}
