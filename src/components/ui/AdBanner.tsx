import React, { useState } from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@store/useAuthStore';
import { useTheme } from '@/contexts/ThemeContext';
import { AdUnitIds, AdUnitKey } from '@services/admob';

interface AdBannerProps {
  unitKey: AdUnitKey;
}

export const AdBanner: React.FC<AdBannerProps> = ({ unitKey }) => {
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  const plan = user?.subscription?.plan || 'free';
  if (plan === 'premium' || plan === 'trial') return null;
  if (failed) return null;

  const containerStyle: ViewStyle = {
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <BannerAd
        unitId={AdUnitIds[unitKey]}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
      <Pressable
        onPress={() => router.push('/paywall')}
        style={{ paddingVertical: 6, paddingHorizontal: 12 }}
      >
        <Text
          style={{
            fontFamily: 'SpaceMono_400Regular',
            fontSize: 11,
            color: colors.primary,
            textDecorationLine: 'underline',
          }}
        >
          Remove ads — Go Premium
        </Text>
      </Pressable>
    </View>
  );
};
