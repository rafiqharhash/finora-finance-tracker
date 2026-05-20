import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2,
  Settings, TrendingUp, LogOut, X, Sparkles, ChevronLeft,
  ChevronRight, Wallet,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { getInitials } from '../../utils/formatters';

const NAV_ITEMS = [
  { to: '/app/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/budgets',      label: 'Budgets',      icon: Wallet },
  { to: '/app/reports',      label: 'Reports',      icon: BarChart2 },
  { to: '/app/settings',     label: 'Settings',     icon: Settings },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate   = useNavigate();
  const { user, isDemoMode, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const collapsed = !sidebarOpen;

  // ── Desktop Sidebar ────────────────────────────────────────────────────────
  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--border-color)] ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 shadow-violet">
          <TrendingUp size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-[var(--text-primary)]"
          >
            Finora
          </motion.span>
        )}
        {mobile && (
          <button onClick={onMobileClose} className="ml-auto p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Demo Badge */}
      {isDemoMode && (!collapsed || mobile) && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <Sparkles size={13} className="text-primary-400" />
          <span className="text-xs font-medium text-primary-400">Demo Mode</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={mobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-3' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {(!collapsed || mobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className={`border-t border-[var(--border-color)] p-3 space-y-1`}>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 ${collapsed && !mobile ? 'justify-center px-3' : ''}`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>

        {/* User info */}
        {(!collapsed || mobile) && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user.name || 'User')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name || 'Demo User'}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col relative bg-[var(--bg-secondary)] border-r border-[var(--border-color)] h-screen flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-card flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shadow-2xl"
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
