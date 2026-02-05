import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { Ionicons } from '@expo/vector-icons';
import { getOfferings, purchasePackage, restorePurchases, getPackagePrice, getIntroPrice } from '@services/revenuecat';
import type { PurchasesPackage } from 'react-native-purchases';

export default function PaywallScreen() {
  const router = useRouter();
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

      if (offering) {
        // Find monthly and annual packages
        const monthly = offering.availablePackages.find((pkg) =>
          pkg.identifier.toLowerCase().includes('monthly') ||
          pkg.packageType === 'MONTHLY'
        );
        const annual = offering.availablePackages.find((pkg) =>
          pkg.identifier.toLowerCase().includes('annual') ||
          pkg.identifier.toLowerCase().includes('yearly') ||
          pkg.packageType === 'ANNUAL'
        );

        setMonthlyPackage(monthly || offering.availablePackages[0]);
        setAnnualPackage(annual || offering.availablePackages[1]);
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      setPurchasing(true);

      const result = await purchasePackage(pkg);

      if (result.success) {
        Alert.alert(
          'Welcome to Premium! 🎉',
          'You now have access to all premium features.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else if (result.error && result.error !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', result.error);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);

      const result = await restorePurchases();

      if (result.success && result.isPremium) {
        Alert.alert(
          'Purchases Restored',
          'Your premium subscription has been restored!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to restore purchases.');
    } finally {
      setPurchasing(false);
    }
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 48,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  };

  const subtitleStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  };

  const featureItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  };

  const featureTextStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
    flex: 1,
  };

  const priceCardStyle = (isPopular: boolean): ViewStyle => ({
    marginBottom: 16,
    backgroundColor: isPopular ? '#FFD700' : '#FFFFFF',
  });

  const priceHeaderStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
  };

  const priceAmountStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 36,
    color: '#000000',
    marginBottom: 4,
  };

  const pricePeriodStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 14,
    color: '#000000',
    marginBottom: 16,
  };

  const popularBadgeStyle: ViewStyle = {
    position: 'absolute',
    top: -12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FF69B4',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  };

  const popularTextStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 12,
    color: '#000000',
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />

      <View style={headerStyle}>
        <Text style={titleStyle}>Upgrade to Premium</Text>
        <Text style={subtitleStyle}>
          Unlock unlimited habits and premium features
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Features Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: '800', fontSize: 20, color: '#000000', marginBottom: 16 }}>
            Premium Features
          </Text>

          <View style={featureItemStyle}>
            <Ionicons name="infinite" size={24} color="#000000" />
            <Text style={featureTextStyle}>Unlimited habits (vs 5 free)</Text>
          </View>

          <View style={featureItemStyle}>
            <Ionicons name="stats-chart" size={24} color="#000000" />
            <Text style={featureTextStyle}>Advanced statistics & insights</Text>
          </View>

          <View style={featureItemStyle}>
            <Ionicons name="download" size={24} color="#000000" />
            <Text style={featureTextStyle}>Export your data (CSV, JSON)</Text>
          </View>

          <View style={featureItemStyle}>
            <Ionicons name="color-palette" size={24} color="#000000" />
            <Text style={featureTextStyle}>Custom themes & colors</Text>
          </View>

          <View style={featureItemStyle}>
            <Ionicons name="document-text" size={24} color="#000000" />
            <Text style={featureTextStyle}>Habit notes & journaling</Text>
          </View>

          <View style={featureItemStyle}>
            <Ionicons name="shield-checkmark" size={24} color="#000000" />
            <Text style={featureTextStyle}>Priority support</Text>
          </View>
        </Card>

        {/* Loading State */}
        {loading && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ fontWeight: '600', fontSize: 14, color: '#666666', marginTop: 12 }}>
              Loading subscription options...
            </Text>
          </View>
        )}

        {/* Pricing Cards */}
        {!loading && (
          <View style={{ position: 'relative' }}>
            {/* Yearly Plan (Popular) */}
            {annualPackage && (
              <Card style={priceCardStyle(true)}>
                <View style={popularBadgeStyle}>
                  <Text style={popularTextStyle}>BEST VALUE</Text>
                </View>

                <Text style={priceHeaderStyle}>Yearly</Text>
                <Text style={priceAmountStyle}>{getPackagePrice(annualPackage)}</Text>
                <Text style={pricePeriodStyle}>
                  {annualPackage.product.subscriptionPeriod || 'per year'}
                  {getIntroPrice(annualPackage) && ' • Free Trial Available'}
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
              <Card style={priceCardStyle(false)}>
                <Text style={priceHeaderStyle}>Monthly</Text>
                <Text style={priceAmountStyle}>{getPackagePrice(monthlyPackage)}</Text>
                <Text style={pricePeriodStyle}>
                  {monthlyPackage.product.subscriptionPeriod || 'per month'}
                  {getIntroPrice(monthlyPackage) && ' • Free Trial Available'}
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
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#000000', textAlign: 'center' }}>
                  Unable to load subscription options. Please try again later.
                </Text>
                <Button variant="primary" onPress={loadOfferings} style={{ marginTop: 16 }}>
                  Retry
                </Button>
              </Card>
            )}
          </View>
        )}

        {/* Fine Print */}
        <View style={{ marginTop: 16, marginBottom: 24 }}>
          <Text style={{ fontWeight: '600', fontSize: 12, color: '#666666', textAlign: 'center' }}>
            Free trial available • Cancel anytime
          </Text>
          <Text style={{ fontWeight: '500', fontSize: 10, color: '#666666', textAlign: 'center', marginTop: 8 }}>
            Payment will be charged to your app store account. Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
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
