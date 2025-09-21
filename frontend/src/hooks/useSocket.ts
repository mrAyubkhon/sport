import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import socketService from '@/services/socket';

export const useSocket = () => {
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const { setupSocketListeners, clearSocketListeners } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && accessToken && user) {
      // Connect to socket and setup listeners
      socketService.connect(accessToken).then(() => {
        console.log('Socket connected successfully');
        setupSocketListeners();
      }).catch((error) => {
        console.error('Socket connection failed:', error);
      });
    } else {
      // Disconnect if not authenticated
      socketService.disconnect();
      clearSocketListeners();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      clearSocketListeners();
    };
  }, [isAuthenticated, accessToken, user, setupSocketListeners, clearSocketListeners]);

  return {
    connected: socketService.connected,
  };
};
