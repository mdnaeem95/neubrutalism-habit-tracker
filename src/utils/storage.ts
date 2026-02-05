import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_PERMISSION_REQUESTED: 'notification_permission_requested',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Synchronous version for use in routing logic
 */
export function hasCompletedOnboardingSync(): boolean {
  // For initial check, we'll use a cached value
  // This is set by the async function when it runs
  return global.__onboardingCompleted__ ?? false;
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
    global.__onboardingCompleted__ = true;
  } catch (error) {
    console.error('Failed to set onboarding completed:', error);
  }
}

/**
 * Reset onboarding (for testing)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.ONBOARDING_COMPLETED);
    global.__onboardingCompleted__ = false;
  } catch (error) {
    console.error('Failed to reset onboarding:', error);
  }
}

/**
 * Check if notification permission has been requested
 */
export async function hasRequestedNotificationPermission(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.NOTIFICATION_PERMISSION_REQUESTED);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark notification permission as requested
 */
export async function setNotificationPermissionRequested(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATION_PERMISSION_REQUESTED, 'true');
  } catch (error) {
    console.error('Failed to set notification permission requested:', error);
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<Record<string, any>> {
  try {
    const prefs = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : {};
  } catch {
    return {};
  }
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(preferences: Record<string, any>): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
}

/**
 * Clear all storage (for logout/reset)
 */
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
    global.__onboardingCompleted__ = false;
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Initialize storage cache (call on app start)
 */
export async function initializeStorage(): Promise<void> {
  try {
    const completed = await hasCompletedOnboarding();
    global.__onboardingCompleted__ = completed;
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}
