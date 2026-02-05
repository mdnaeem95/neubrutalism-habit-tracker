import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Ask for permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Get push token (optional - only needed for server-sent push notifications)
    // For local notifications (scheduled reminders), this is not required
    if (Platform.OS !== 'web') {
      try {
        // Uncomment when you have a project ID configured
        // const token = await Notifications.getExpoPushTokenAsync({
        //   projectId: 'your-expo-project-id',
        // });
        // console.log('Push token:', token.data);
      } catch (error) {
        console.warn('Could not get push token (not required for local notifications):', error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a daily notification
 */
export async function scheduleDailyNotification(
  title: string,
  body: string,
  hour: number,
  minute: number,
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });

    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

/**
 * Schedule a notification for a specific habit reminder
 */
export async function scheduleHabitReminder(
  habitId: string,
  habitName: string,
  hour: number,
  minute: number
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${habitName}! 💪`,
        body: 'Keep your streak going!',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'habit_reminder',
          habitId,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });

    return id;
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
    throw error;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    throw error;
  }
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Schedule streak milestone notification
 */
export async function scheduleStreakMilestone(
  habitName: string,
  streakDays: number
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 ${streakDays}-Day Streak! 🔥`,
        body: `Congratulations on your ${streakDays}-day streak for ${habitName}!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: {
          type: 'streak_milestone',
          streakDays,
        },
      },
      trigger: null, // Send immediately
    });

    return id;
  } catch (error) {
    console.error('Error scheduling streak milestone:', error);
    throw error;
  }
}

/**
 * Send local notification immediately
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data,
      },
      trigger: null, // Send immediately
    });

    return id;
  } catch (error) {
    console.error('Error sending local notification:', error);
    throw error;
  }
}

/**
 * Update notification badge count (iOS)
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
}

/**
 * Clear notification badge (iOS)
 */
export async function clearBadge(): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Error clearing badge:', error);
  }
}
