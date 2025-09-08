import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: User | null) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
