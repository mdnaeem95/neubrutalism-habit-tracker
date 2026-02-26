import '../global.css';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { useAuthStore } from '@store/useAuthStore';
import { initSentry, setUserContext, clearUserContext } from '@services/sentry/config';
import { initializeRevenueCat, identifyUser, getSubscriptionStatus, addSubscriptionListener } from '@services/revenuecat';
import { initializeAdMob } from '@services/admob';
import { AnimatedSplash } from '@components';
import { hasCompletedOnboardingSync, initializeStorage } from '@utils/storage';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { useNotifications } from '@/hooks/useNotifications';

// Initialize Sentry
initSentry();

function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const updateSubscription = useAuthStore((state) => state.updateSubscription);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  // Initialize notification listeners
  useNotifications();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Initialize storage cache (must complete before routing)
    initializeStorage().then(() => setStorageReady(true));

    // Initialize RevenueCat SDK
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });

    // Initialize Google Mobile Ads SDK
    initializeAdMob();

    // Initialize auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  // Update Sentry user context and sync subscription when auth state changes
  useEffect(() => {
    if (!user) {
      clearUserContext();
      return;
    }

    setUserContext({
      id: user.id,
      email: user.email || undefined,
      username: user.displayName || undefined,
    });

    // Identify user in RevenueCat and sync subscription status
    identifyUser(user.id).then(() =>
      getSubscriptionStatus().then((status) => {
        updateSubscription(
          status.isPremium ? 'premium' : 'free',
          status.expirationDate ?? undefined
        );
      })
    ).catch((error) => {
      console.error('Failed to sync subscription:', error);
    });

    // Listen for subscription changes (renewal, expiry, etc.)
    const unsubscribe = addSubscriptionListener(({ isPremium, expirationDate }) => {
      updateSubscription(
        isPremium ? 'premium' : 'free',
        expirationDate ?? undefined
      );
    });

    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    // Wait for splash, fonts, and storage before routing
    if (showSplash || !fontsLoaded || !storageReady) return;

    // Wait for auth to initialize
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && !hasCompletedOnboardingSync() && !inOnboarding) {
      router.replace('/onboarding');
    } else if (user && hasCompletedOnboardingSync() && (inAuthGroup || segments.length === 0)) {
      router.replace('/(tabs)');
    }
  }, [user, segments, loading, showSplash, fontsLoaded, storageReady]);

  // Show animated splash screen on first load (also waits for fonts)
  if (showSplash || !fontsLoaded) {
    return <AnimatedSplash onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider>
      <DialogProvider>
        <RootNavigator />
      </DialogProvider>
    </ThemeProvider>
  );
}
