import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
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
        // Navigate to today screen
        console.log('Daily reminder tapped');
        break;
      case 'habit_reminder':
        // Navigate to specific habit
        console.log('Habit reminder tapped:', data.habitId);
        break;
      case 'streak_milestone':
        // Show celebration screen
        console.log('Streak milestone tapped');
        break;
      default:
        console.log('Unknown notification type');
    }
  };

  return {
    hasPermission,
    requestPermission,
    notification,
    notificationResponse,
  };
}
