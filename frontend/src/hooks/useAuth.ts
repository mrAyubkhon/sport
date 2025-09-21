import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import socketService from '@/services/socket';

export const useAuth = () => {
  const { isAuthenticated, accessToken, user, clearAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on app load
    if (accessToken && user && !isAuthenticated) {
      // Token exists but user is not authenticated, try to refresh
      useAuthStore.getState().refreshProfile().catch(() => {
        // If refresh fails, clear auth
        clearAuth();
      });
    }
  }, [accessToken, user, isAuthenticated, clearAuth]);

  return {
    isAuthenticated,
    user,
    accessToken,
  };
};
