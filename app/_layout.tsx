import '../global.css';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@store/useAuthStore';
import { initSentry, setUserContext, clearUserContext } from '@services/sentry/config';
import { initializeRevenueCat } from '@services/revenuecat';
import { AnimatedSplash } from '@components';
import { hasCompletedOnboardingSync, initializeStorage } from '@utils/storage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { useNotifications } from '@/hooks/useNotifications';

// Initialize Sentry
initSentry();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const segments = useSegments();
  const router = useRouter();

  // Initialize notification listeners
  useNotifications();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Initialize storage cache
    initializeStorage();

    // Initialize RevenueCat SDK
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });

    // Initialize auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  // Update Sentry user context when auth state changes
  useEffect(() => {
    if (user) {
      setUserContext({
        id: user.id,
        email: user.email || undefined,
        username: user.displayName || undefined,
      });
    } else {
      clearUserContext();
    }
  }, [user]);

  useEffect(() => {
    // Wait for splash to complete before routing
    if (showSplash) return;

    // Wait for auth to initialize
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Check if user has completed onboarding
      const completedOnboarding = hasCompletedOnboardingSync();
      if (!completedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (user && !inOnboarding && !hasCompletedOnboardingSync()) {
      // Redirect to onboarding if authenticated but hasn't completed onboarding
      router.replace('/onboarding');
    }
  }, [user, segments, loading, showSplash]);

  // Show animated splash screen on first load
  if (showSplash) {
    return <AnimatedSplash onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider>
      <DialogProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F5F5F5' },
          }}
        />
      </DialogProvider>
    </ThemeProvider>
  );
}
