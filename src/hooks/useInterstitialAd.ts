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
 */
export function useInterstitialAd() {
  const { user } = useAuthStore();
  const shownThisSession = useRef(false);
  const adLoaded = useRef(false);

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
      // Pre-load next ad for this session (won't be shown due to cap, but keeps it warm)
      interstitial.load();
    });

    const onError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      adLoaded.current = false;
    });

    interstitial.load();

    return () => {
      onLoaded();
      onClosed();
      onError();
    };
  }, [isPremium]);

  const showAd = useCallback((): boolean => {
    if (isPremium || shownThisSession.current || !adLoaded.current) {
      return false;
    }
    shownThisSession.current = true;
    interstitial.show();
    return true;
  }, [isPremium]);

  return { showAd };
}
