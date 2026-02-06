import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
  // Only initialize Sentry if DSN is provided
  if (!SENTRY_DSN) {
    console.log('Sentry DSN not found, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // Adjust this value in production to reduce costs
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Set to true to enable debug mode (shows more detailed logs)
    debug: __DEV__,

    // Enable automatic error tracking
    enableAutoSessionTracking: true,

    // Session timeout in milliseconds
    sessionTrackingIntervalMillis: 30000,

    // Environment
    environment: __DEV__ ? 'development' : 'production',

    // Enable native crash handling
    enableNative: true,

    // Before sending an event, modify or drop it
    beforeSend(event, _) {
      // Don't send events in development
      if (__DEV__) {
        console.log('Sentry event (dev mode, not sent):', event);
        return null;
      }

      return event;
    },
  });
};

// Helper to manually capture errors
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext('custom', context);
  }
  Sentry.captureException(error);
};

// Helper to capture messages
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

// Helper to set user context
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

// Helper to clear user context
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Helper to add breadcrumb
export const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};
