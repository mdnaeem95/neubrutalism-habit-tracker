import { useEffect, useRef, useCallback } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useAuthStore } from '@store/useAuthStore';
import { AdUnitIds } from '@services/admob';

const interstitial = InterstitialAd.createForAdRequest(AdUnitIds.interstitialCreate);

/**
 * Hook to manage interstitial ads with a session-level frequency cap.
 * - Skips loading entirely for premium/trial users.
 * - Shows at most 1 interstitial per app session.
 * - showAd() returns a Promise that resolves when the ad closes (or immediately if no ad shown).
 */
export function useInterstitialAd() {
  const { user } = useAuthStore();
  const shownThisSession = useRef(false);
  const adLoaded = useRef(false);
  const closeResolverRef = useRef<(() => void) | null>(null);

  const isPremium = (() => {
    const plan = user?.subscription?.plan || 'free';
    return plan === 'premium' || plan === 'trial';
  })();

  useEffect(() => {
    if (isPremium) return;

    const onLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      adLoaded.current = true;
    });

    const onClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      adLoaded.current = false;
      // Resolve the pending promise so the caller can continue
      if (closeResolverRef.current) {
        closeResolverRef.current();
        closeResolverRef.current = null;
      }
      interstitial.load();
    });

    const onError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      adLoaded.current = false;
      // Resolve on error too so the caller isn't stuck
      if (closeResolverRef.current) {
        closeResolverRef.current();
        closeResolverRef.current = null;
      }
    });

    interstitial.load();

    return () => {
      onLoaded();
      onClosed();
      onError();
    };
  }, [isPremium]);

  /**
   * Show an interstitial ad. Returns a Promise<boolean>:
   * - Resolves `true` after the ad is closed by the user
   * - Resolves `false` immediately if no ad was shown (premium, cap reached, not loaded)
   */
  const showAd = useCallback((): Promise<boolean> => {
    if (isPremium || shownThisSession.current || !adLoaded.current) {
      return Promise.resolve(false);
    }
    shownThisSession.current = true;

    return new Promise<boolean>((resolve) => {
      closeResolverRef.current = () => resolve(true);
      interstitial.show();
    });
  }, [isPremium]);

  return { showAd };
}
