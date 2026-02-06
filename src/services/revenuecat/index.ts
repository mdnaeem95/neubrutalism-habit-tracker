import { Platform } from 'react-native';
import Constants from 'expo-constants';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';

// RevenueCat API Keys (configure in your RevenueCat dashboard)
const API_KEYS = {
  apple: Constants.expoConfig?.extra?.revenuecatAppleApiKey || process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '',
  google: Constants.expoConfig?.extra?.revenuecatGoogleApiKey || process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY || '',
};

// Entitlement identifiers (configure in RevenueCat dashboard)
export const ENTITLEMENT_ID = 'premium';

/**
 * Initialize RevenueCat SDK
 * Call this once on app startup
 */
export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      console.log('RevenueCat not supported on web');
      return;
    }

    // Configure SDK
    Purchases.setLogLevel(LOG_LEVEL.INFO);

    // Initialize with platform-specific API key
    const apiKey = Platform.OS === 'ios' ? API_KEYS.apple : API_KEYS.google;

    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * Get current customer info and subscription status
 */
export async function getSubscriptionStatus(): Promise<{
  isPremium: boolean;
  expirationDate: Date | null;
  willRenew: boolean;
}> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (entitlement) {
      return {
        isPremium: true,
        expirationDate: entitlement.expirationDate
          ? new Date(entitlement.expirationDate)
          : null,
        willRenew: entitlement.willRenew,
      };
    }

    return {
      isPremium: false,
      expirationDate: null,
      willRenew: false,
    };
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return {
      isPremium: false,
      expirationDate: null,
      willRenew: false,
    };
  }
}

/**
 * Get available offerings (subscription packages)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current !== null) {
      return offerings.current;
    }

    console.warn('No current offering available');
    return null;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
}

/**
 * Purchase a subscription package
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{
  success: boolean;
  customerInfo: CustomerInfo | null;
  error?: string;
}> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Check if user now has premium entitlement
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error: any) {
    // Handle user cancellation
    if (error.userCancelled) {
      return {
        success: false,
        customerInfo: null,
        error: 'Purchase cancelled',
      };
    }

    console.error('Purchase failed:', error);
    return {
      success: false,
      customerInfo: null,
      error: error.message || 'Purchase failed',
    };
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  isPremium: boolean;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: true,
      isPremium,
    };
  } catch (error: any) {
    console.error('Failed to restore purchases:', error);
    return {
      success: false,
      isPremium: false,
      error: error.message || 'Failed to restore purchases',
    };
  }
}

/**
 * Update user ID (when user logs in)
 */
export async function identifyUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    console.log('User identified in RevenueCat:', userId);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
}

/**
 * Logout user from RevenueCat
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('User logged out from RevenueCat');
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
}

/**
 * Check if user is subscribed (premium)
 */
export async function isPremiumUser(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('Failed to check premium status:', error);
    return false;
  }
}

/**
 * Get product pricing information
 */
export function getPackagePrice(pkg: PurchasesPackage): string {
  return pkg.product.priceString;
}

/**
 * Get product intro price (if available)
 */
export function getIntroPrice(pkg: PurchasesPackage): string | null {
  const introPrice = pkg.product.introPrice;
  return introPrice ? introPrice.priceString : null;
}
