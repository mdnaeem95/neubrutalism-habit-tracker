import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@store/useAuthStore';

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F5F5' },
      }}
    />
  );
}
