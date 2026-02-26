import { create } from 'zustand';
import type { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  onAuthStateChange,
} from '@services/firebase/auth';
import { captureError, addBreadcrumb } from '@services/sentry/config';
import { trackLogin, trackSignup, setAnalyticsUserId } from '@services/firebase/analytics';

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
  updateSubscription: (plan: 'free' | 'premium' | 'trial', expiresAt?: Date) => void;
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
      addBreadcrumb('User attempting login', 'auth');
      const user = await signInWithEmail(credentials);
      set({ user, loading: false });
      addBreadcrumb('User logged in successfully', 'auth', { userId: user.id });

      // Track login event
      trackLogin('email');
      setAnalyticsUserId(user.id);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      captureError(error, { action: 'login', email: credentials.email });
      throw error;
    }
  },

  // Signup with email/password
  signup: async (credentials) => {
    try {
      set({ loading: true, error: null });
      addBreadcrumb('User attempting signup', 'auth');
      const user = await signUpWithEmail(credentials);
      set({ user, loading: false });
      addBreadcrumb('User signed up successfully', 'auth', { userId: user.id });

      // Track signup event
      trackSignup('email');
      setAnalyticsUserId(user.id);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      captureError(error, { action: 'signup', email: credentials.email });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut();
      set({ user: null, loading: false });

      // Clear analytics user ID on logout
      setAnalyticsUserId(null);
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

  // Update subscription status
  updateSubscription: (plan, expiresAt) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, subscription: { plan, expiresAt } }
        : null,
    })),
}));
