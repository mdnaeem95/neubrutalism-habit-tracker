import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';
import { app } from './config';

// Initialize Analytics (only works in web, not in React Native)
// For React Native, we'll use a no-op implementation
const isWeb = Platform.OS === 'web' && typeof document !== 'undefined';

let analytics = null;

if (isWeb) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase Analytics:', error);
    analytics = null;
  }
}

/**
 * Log a custom event
 */
export const logEvent = (eventName: string, params?: Record<string, any>) => {
  if (!analytics) {
    // In development, log to console
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, params);
    }
    return;
  }

  firebaseLogEvent(analytics, eventName, params);
};

/**
 * Set user ID for analytics
 */
export const setAnalyticsUserId = (userId: string | null) => {
  if (!analytics) {
    if (__DEV__) {
      console.log(`[Analytics] Set user ID:`, userId);
    }
    return;
  }

  if (userId) {
    setUserId(analytics, userId);
  }
};

/**
 * Set user properties
 */
export const setAnalyticsUserProperties = (properties: Record<string, string>) => {
  if (!analytics) {
    if (__DEV__) {
      console.log(`[Analytics] Set user properties:`, properties);
    }
    return;
  }

  setUserProperties(analytics, properties);
};

// Predefined events for habit tracker

export const trackHabitCreated = (habitCategory: string, color: string) => {
  logEvent('habit_created', {
    category: habitCategory,
    color: color,
  });
};

export const trackHabitCheckIn = (habitId: string, currentStreak: number) => {
  logEvent('habit_check_in', {
    habit_id: habitId,
    current_streak: currentStreak,
  });
};

export const trackHabitDeleted = (habitId: string, totalCompletions: number) => {
  logEvent('habit_deleted', {
    habit_id: habitId,
    total_completions: totalCompletions,
  });
};

export const trackHabitArchived = (habitId: string) => {
  logEvent('habit_archived', {
    habit_id: habitId,
  });
};

export const trackStreakMilestone = (habitId: string, streakDays: number) => {
  logEvent('streak_milestone', {
    habit_id: habitId,
    streak_days: streakDays,
  });
};

export const trackSignup = (method: 'email' | 'google' | 'apple') => {
  logEvent('sign_up', {
    method: method,
  });
};

export const trackLogin = (method: 'email' | 'google' | 'apple') => {
  logEvent('login', {
    method: method,
  });
};

export const trackScreenView = (screenName: string) => {
  logEvent('screen_view', {
    screen_name: screenName,
  });
};

export const trackFeatureUsed = (featureName: string) => {
  logEvent('feature_used', {
    feature_name: featureName,
  });
};

export const trackPaywallShown = (trigger: string) => {
  logEvent('paywall_shown', {
    trigger: trigger,
  });
};

export const trackPurchaseAttempt = (plan: 'monthly' | 'yearly') => {
  logEvent('purchase_attempt', {
    plan: plan,
  });
};

export const trackPurchaseSuccess = (plan: 'monthly' | 'yearly', revenue: number) => {
  logEvent('purchase', {
    plan: plan,
    value: revenue,
    currency: 'USD',
  });
};
