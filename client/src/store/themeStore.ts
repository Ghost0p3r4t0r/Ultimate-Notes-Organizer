import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggle: () =>
    set((state) => {
      const newDark = !state.isDark;
      document.documentElement.classList.toggle('dark', newDark);
      return { isDark: newDark };
    }),
}));
