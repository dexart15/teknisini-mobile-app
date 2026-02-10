import {
  logout as authLogout,
  getCurrentUser,
  observeAuthState,
} from "@/services/authService";
import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user, loading: false }),

  refreshUser: () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      set({ user: { ...currentUser } });
    }
  },

  logout: async () => {
    await authLogout();
    set({ user: null });
  },

  initialize: () => {
    const unsubscribe = observeAuthState((user) => {
      set({ user, loading: false, initialized: true });
    });
    return unsubscribe;
  },
}));
