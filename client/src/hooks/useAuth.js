import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Auth hook — exposes auth state and actions
 */
export function useAuth() {
  const {
    user, token, isAuthenticated, isDemoMode,
    isLoading, login, logout, setDemoMode, updateUser, setLoading,
  } = useAuthStore();

  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const handleDemoMode = useCallback(() => {
    setDemoMode(true);
    navigate('/app/dashboard');
  }, [setDemoMode, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isDemoMode,
    isLoading,
    isLoggedIn: isAuthenticated || isDemoMode,
    login,
    logout:       handleLogout,
    setDemoMode:  handleDemoMode,
    updateUser,
    setLoading,
    redirectToLogin,
  };
}
