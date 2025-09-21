import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeState } from '@/types';

interface ThemeStore extends ThemeState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',

      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        const actualTheme = theme === 'system' ? get().systemTheme : theme;
        
        if (actualTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        let newTheme: Theme;
        
        switch (currentTheme) {
          case 'light':
            newTheme = 'dark';
            break;
          case 'dark':
            newTheme = 'system';
            break;
          default:
            newTheme = 'light';
        }
        
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const store = useThemeStore.getState();
    store.systemTheme = e.matches ? 'dark' : 'light';
    
    // If using system theme, update the actual theme
    if (store.theme === 'system') {
      store.setTheme('system');
    }
  });
}
