import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useTheme } from './useTheme';
import { useSocket } from './useSocket';

export const useApp = () => {
  const auth = useAuth();
  const theme = useTheme();
  const socket = useSocket();

  useEffect(() => {
    // Initialize app-level functionality
    console.log('App initialized');
  }, []);

  return {
    auth,
    theme,
    socket,
  };
};