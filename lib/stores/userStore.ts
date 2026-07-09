import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  activeRole: 'client' | 'provider';
  setActiveRole: (role: 'client' | 'provider') => void;
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  toggleRole: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      activeRole: 'client',
      language: 'en',
      setActiveRole: (role) => set({ activeRole: role }),
      setLanguage: (lang) => set({ language: lang }),
      toggleRole: () =>
        set((state) => ({
          activeRole: state.activeRole === 'client' ? 'provider' : 'client',
        })),
    }),
    {
      name: 'binder-user-storage',
    }
  )
);
