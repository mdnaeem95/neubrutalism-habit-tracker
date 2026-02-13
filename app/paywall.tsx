import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle, ActivityIndicator, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDialog } from '@/contexts/DialogContext';
import { useAuthStore } from '@store/useAuthStore';
import { useAchievementsStore } from '@store/useAchievementsStore';
import { useTheme } from '@/contexts/ThemeContext';
import { getOfferings, purchasePackage, restorePurchases, getPackagePrice, getIntroPrice } from '@services/revenuecat';
import type { PurchasesPackage } from 'react-native-purchases';

const PRIVACY_URL = 'https://blockapp.co/privacy';
const TERMS_URL = 'https://blockapp.co/terms';

export default function PaywallScreen() {
  const router = useRouter();
  const dialog = useDialog();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const { unlockAchievement, unlockedIds } = useAchievementsStore();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offering = await getOfferings();

      if (offering && offering.availablePackages.length > 0) {
        const monthly = offering.availablePackages.find((pkg) =>
          pkg.identifier.toLowerCase().includes('monthly') ||
          pkg.packageType === 'MONTHLY'
        );
        const annual = offering.availablePackages.find((pkg) =>
          pkg.identifier.toLowerCase().includes('annual') ||
          pkg.identifier.toLowerCase().includes('yearly') ||
          pkg.packageType === 'ANNUAL'
        );

        setMonthlyPackage(monthly || offering.availablePackages[0] || null);
        setAnnualPackage(annual || offering.availablePackages[1] || null);
      } else {
        console.warn('No offerings or packages available from RevenueCat');
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
      dialog.alert('Error', 'Failed to load subscription options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      setPurchasing(true);

      const result = await purchasePackage(pkg);

      if (result.success) {
        if (user && !unlockedIds.includes('premium_member')) {
          try {
            await unlockAchievement(user.id, 'premium_member');
          } catch (error) {
            console.error('Failed to unlock premium achievement:', error);
          }
        }

        dialog.alert('Welcome to Premium!', 'You now have access to all premium features.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else if (result.error === 'cancelled') {
        // User cancelled
      } else if (result.error) {
        dialog.alert('Purchase Failed', result.error);
      }
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);

      const result = await restorePurchases();

      if (result.success && result.isPremium) {
        if (user && !unlockedIds.includes('premium_member')) {
          try {
            await unlockAchievement(user.id, 'premium_member');
          } catch (error) {
            console.error('Failed to unlock premium achievement:', error);
          }
        }

        dialog.alert('Purchases Restored', 'Your premium subscription has been restored!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        dialog.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to restore purchases.');
    } finally {
      setPurchasing(false);
    }
  };

  const featureItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  };

  const featureTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 15,
    color: colors.text,
    flex: 1,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8, textAlign: 'center' }}>
          Upgrade to Premium
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 24 }}>
          Unlock unlimited habits and premium features
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Features Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text, marginBottom: 16 }}>
            Premium Features
          </Text>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="infinity" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Unlimited habits (vs 5 free)</Text>
          </View>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Advanced statistics & insights</Text>
          </View>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="download" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Export your data (CSV, JSON)</Text>
          </View>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="palette" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Custom themes & colors</Text>
          </View>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="text-box" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Habit notes & journaling</Text>
          </View>

          <View style={featureItemStyle}>
            <MaterialCommunityIcons name="shield-check" size={24} color={colors.text} />
            <Text style={featureTextStyle}>Priority support</Text>
          </View>
        </Card>

        {/* Loading State */}
        {loading && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={colors.text} />
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 12 }}>
              Loading subscription options...
            </Text>
          </View>
        )}

        {/* Pricing Cards */}
        {!loading && (
          <View style={{ position: 'relative' }}>
            {/* Yearly Plan (Popular) */}
            {annualPackage && (
              <Card style={{ marginBottom: 16, backgroundColor: colors.warning }}>
                <View
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 2.5,
                    borderColor: colors.border,
                    borderRadius: 9999,
                    backgroundColor: colors.primary,
                    shadowColor: colors.border,
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                  }}
                >
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }}>BEST VALUE</Text>
                </View>

                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text, marginBottom: 8 }}>Yearly</Text>
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 4 }}>{getPackagePrice(annualPackage)}</Text>
                <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text, marginBottom: 16 }}>
                  {annualPackage.product.subscriptionPeriod || 'per year'}
                  {getIntroPrice(annualPackage) && ' - Free Trial Available'}
                </Text>

                <Button
                  variant="primary"
                  onPress={() => handlePurchase(annualPackage)}
                  disabled={purchasing}
                  isLoading={purchasing}
                >
                  {getIntroPrice(annualPackage) ? 'Start Free Trial' : 'Subscribe'}
                </Button>
              </Card>
            )}

            {/* Monthly Plan */}
            {monthlyPackage && (
              <Card style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text, marginBottom: 8 }}>Monthly</Text>
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 4 }}>{getPackagePrice(monthlyPackage)}</Text>
                <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text, marginBottom: 16 }}>
                  {monthlyPackage.product.subscriptionPeriod || 'per month'}
                  {getIntroPrice(monthlyPackage) && ' - Free Trial Available'}
                </Text>

                <Button
                  variant="secondary"
                  onPress={() => handlePurchase(monthlyPackage)}
                  disabled={purchasing}
                  isLoading={purchasing}
                >
                  {getIntroPrice(monthlyPackage) ? 'Start Free Trial' : 'Subscribe'}
                </Button>
              </Card>
            )}

            {/* Fallback if no packages loaded */}
            {!annualPackage && !monthlyPackage && (
              <Card style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text, textAlign: 'center' }}>
                  Unable to load subscription options. Please try again later.
                </Text>
                <Button variant="primary" onPress={loadOfferings} style={{ marginTop: 16 }}>
                  Retry
                </Button>
              </Card>
            )}
          </View>
        )}

        {/* Subscription Disclosure */}
        <View style={{ marginTop: 16, marginBottom: 24 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text, textAlign: 'center', marginBottom: 8 }}>
            Block Premium — Auto-Renewable Subscription
          </Text>

          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 18 }}>
            {annualPackage && `Yearly: ${getPackagePrice(annualPackage)}/year. `}
            {monthlyPackage && `Monthly: ${getPackagePrice(monthlyPackage)}/month. `}
            {'\n'}Includes unlimited habits, advanced stats, custom themes, data export, habit notes, and priority support for the duration of your subscription.
          </Text>

          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 16 }}>
            Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.
          </Text>

          {/* Terms & Privacy Links */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 }}>
            <Text
              style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.primary, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(TERMS_URL)}
            >
              Terms of Use
            </Text>
            <Text
              style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.primary, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(PRIVACY_URL)}
            >
              Privacy Policy
            </Text>
          </View>
        </View>

        {/* Restore Purchases Button */}
        <Button
          variant="secondary"
          onPress={handleRestore}
          disabled={purchasing}
          style={{ marginBottom: 12 }}
        >
          Restore Purchases
        </Button>

        {/* Back Button */}
        <Button variant="secondary" onPress={() => router.back()} style={{ marginBottom: 48 }}>
          Maybe Later
        </Button>
      </View>
    </ScrollView>
  );
}
