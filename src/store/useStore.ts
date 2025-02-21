// src/store/useStore.ts
import { create } from 'zustand';

interface UserState {
  user: { username: string; isAdmin: boolean } | null;
  setUser: (user: { username: string; isAdmin: boolean } | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));