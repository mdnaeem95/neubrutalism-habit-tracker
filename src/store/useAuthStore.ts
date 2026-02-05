import { create } from 'zustand';
import type { User, AuthState, LoginCredentials, SignupCredentials } from '@types/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  onAuthStateChange,
} from '@services/firebase/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  // Initialize auth listener
  initialize: () => {
    const unsubscribe = onAuthStateChange((user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Login with email/password
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const user = await signInWithEmail(credentials);
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Signup with email/password
  signup: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const user = await signUpWithEmail(credentials);
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut();
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Send password reset email
  sendPasswordReset: async (email) => {
    try {
      set({ loading: true, error: null });
      await resetPassword(email);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Set user
  setUser: (user) => set({ user }),

  // Set loading
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),
}));
