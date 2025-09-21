import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    const root = document.documentElement;
    const actualTheme = theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};
