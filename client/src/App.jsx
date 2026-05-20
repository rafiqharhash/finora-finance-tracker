import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useUIStore } from './store/useUIStore';
import { FullPageSpinner } from './components/ui/Spinner';

// Lazy-loaded pages for code splitting
const Landing        = lazy(() => import('./pages/Landing'));
const Login          = lazy(() => import('./pages/Login'));
const Register       = lazy(() => import('./pages/Register'));
const Onboarding     = lazy(() => import('./pages/Onboarding'));
const DashboardLayout= lazy(() => import('./components/layout/DashboardLayout'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Transactions   = lazy(() => import('./pages/Transactions'));
const Budgets        = lazy(() => import('./pages/Budgets'));
const Reports        = lazy(() => import('./pages/Reports'));
const Settings       = lazy(() => import('./pages/Settings'));

// Protected route guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  if (!isAuthenticated && !isDemoMode) return <Navigate to="/login" replace />;
  return children;
}

// Public route (redirect to app if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  if (isAuthenticated || isDemoMode) return <Navigate to="/app/dashboard" replace />;
  return children;
}

export default function App() {
  const { theme } = useUIStore();

  // Apply theme class on mount and change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected App */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets"      element={<Budgets />} />
          <Route path="reports"      element={<Reports />} />
          <Route path="settings"     element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
