import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { requestNotificationPermissions, clearBadge } from '@services/notifications';

interface UseNotificationsReturn {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  notification: Notifications.Notification | null;
  notificationResponse: Notifications.NotificationResponse | null;
}

/**
 * Hook for managing notification permissions and listeners
 */
export function useNotifications(): UseNotificationsReturn {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [notificationResponse, setNotificationResponse] = useState<Notifications.NotificationResponse | null>(null);
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);
  const appStateListener = useRef<any>(undefined);

  useEffect(() => {
    // Check initial permission status
    checkPermissions();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotificationResponse(response);
      // Handle notification tap here
      handleNotificationResponse(response);
    });

    // Clear badge when app comes to foreground
    appStateListener.current = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        clearBadge();
      }
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (appStateListener.current) {
        appStateListener.current.remove();
      }
    };
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async (): Promise<boolean> => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);
    return granted;
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;

    // Handle different notification types
    switch (data?.type) {
      case 'daily_reminder':
        router.push('/(tabs)');
        break;
      case 'habit_reminder':
        if (data.habitId) {
          router.push(`/habit/${data.habitId}`);
        } else {
          router.push('/(tabs)');
        }
        break;
      case 'streak_milestone':
        router.push('/(tabs)');
        break;
      default:
        router.push('/(tabs)');
    }
  };

  return {
    hasPermission,
    requestPermission,
    notification,
    notificationResponse,
  };
}
