import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';

let adMobInitialized = false;

/**
 * Safely initialize AdMob SDK.
 * Catches native-level errors so the app doesn't crash on builds
 * that were compiled before the AdMob config plugin was added.
 */
export async function initializeAdMob(): Promise<void> {
  try {
    await mobileAds().initialize();
    adMobInitialized = true;
  } catch (error) {
    console.warn('AdMob initialization failed (rebuild required):', error);
  }
}

export function isAdMobReady(): boolean {
  return adMobInitialized;
}

const IOS_BANNER = 'ca-app-pub-3113906121142395/5053219651';
const IOS_INTERSTITIAL = 'ca-app-pub-3113906121142395/6142940042';

const PROD_AD_UNITS = {
  bannerHome: Platform.select({
    ios: IOS_BANNER,
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || '',
  }) || '',
  bannerHabits: Platform.select({
    ios: IOS_BANNER,
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || '',
  }) || '',
  bannerStats: Platform.select({
    ios: IOS_BANNER,
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || '',
  }) || '',
  interstitialCreate: Platform.select({
    ios: IOS_INTERSTITIAL,
    android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || '',
  }) || '',
};

const TEST_AD_UNITS = {
  bannerHome: TestIds.ADAPTIVE_BANNER,
  bannerHabits: TestIds.ADAPTIVE_BANNER,
  bannerStats: TestIds.ADAPTIVE_BANNER,
  interstitialCreate: TestIds.INTERSTITIAL,
};

export type AdUnitKey = keyof typeof TEST_AD_UNITS;

export const AdUnitIds: Record<AdUnitKey, string> = __DEV__
  ? TEST_AD_UNITS
  : PROD_AD_UNITS;
