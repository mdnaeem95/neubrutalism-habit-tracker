import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, ViewStyle, TextStyle, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { getUserPreferences, saveUserPreferences, clearStorage, resetOnboarding } from '@utils/storage';
import { exportData } from '@utils/export';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { habits, checkIns } = useHabitsStore();

  // Load preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [preferences, setPreferences] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load preferences on mount
    const loadPreferences = async () => {
      const prefs = await getUserPreferences();
      setPreferences(prefs);
      setNotificationsEnabled(prefs.notificationsEnabled ?? true);
      setNotificationTime(prefs.notificationTime ?? '09:00');
    };
    loadPreferences();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await saveUserPreferences({ ...preferences, notificationsEnabled: value });
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              await clearStorage();
              router.replace('/(auth)/login');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screens again on next launch. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await resetOnboarding();
            Alert.alert('Success', 'Onboarding reset. Restart the app to see it again.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const isPremium = user?.subscription?.plan === 'premium';
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Data export is available with Premium. Upgrade now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/paywall') },
        ]
      );
      return;
    }

    // Show format selection
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        {
          text: 'JSON',
          onPress: async () => {
            try {
              await exportData(habits, checkIns, 'json');
            } catch (error) {
              // Error already handled in exportData
            }
          },
        },
        {
          text: 'CSV',
          onPress: async () => {
            try {
              await exportData(habits, checkIns, 'csv');
            } catch (error) {
              // Error already handled in exportData
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'Type "DELETE" to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'DELETE',
                  style: 'destructive',
                  onPress: async () => {
                    // TODO: Implement account deletion
                    Alert.alert('Error', 'Account deletion not yet implemented');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://blockapp.co/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://blockapp.co/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@blockapp.co');
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: '#F5F5F5',
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const backButtonStyle: ViewStyle = {
    width: 44,
    height: 44,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 36,
    color: '#000000',
  };

  const sectionTitleStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 14,
    color: '#000000',
    marginLeft: 24,
    marginBottom: 12,
    marginTop: 16,
  };

  const settingItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  };

  const settingLabelStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
    flex: 1,
  };

  const settingValueStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  };

  const linkButtonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const userPlan = user?.subscription?.plan || 'free';
  const isPremium = userPlan === 'premium';

  return (
    <ScrollView style={containerStyle}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={headerStyle}>
        <TouchableOpacity
          style={backButtonStyle}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={titleStyle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Account Info */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderWidth: 3,
                borderColor: '#000000',
                borderRadius: 0,
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="person" size={40} color="#000000" />
            </View>
            <Text style={{ fontWeight: '800', fontSize: 20, color: '#000000', marginBottom: 4 }}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 14, color: '#666666', marginBottom: 8 }}>
              {user?.email}
            </Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 3,
                borderColor: '#000000',
                backgroundColor: isPremium ? '#00FF00' : '#FFD700',
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 12, color: '#000000' }}>
                {isPremium ? 'PREMIUM' : 'FREE'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats Summary */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', fontSize: 28, color: '#000000' }}>
                {habits.filter((h) => !h.archived).length}
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#666666' }}>
                Active Habits
              </Text>
            </View>
            <View
              style={{
                width: 2,
                backgroundColor: '#000000',
                marginHorizontal: 16,
              }}
            />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', fontSize: 28, color: '#000000' }}>
                {habits.reduce((sum, h) => sum + h.totalCompletions, 0)}
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#666666' }}>
                Total Check-ins
              </Text>
            </View>
          </View>
        </Card>

        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <Card style={{ marginBottom: 16, backgroundColor: '#FFD700' }}>
            <Text style={{ fontWeight: '800', fontSize: 18, color: '#000000', marginBottom: 8 }}>
              Upgrade to Premium
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 14, color: '#000000', marginBottom: 12 }}>
              Unlimited habits, advanced stats, and more!
            </Text>
            <Button variant="primary" onPress={() => router.push('/paywall')}>
              View Plans
            </Button>
          </Card>
        )}
      </View>

      {/* Notifications */}
      <Text style={sectionTitleStyle}>NOTIFICATIONS</Text>
      <View style={{ paddingHorizontal: 24 }}>
        <Card>
          <View style={settingItemStyle}>
            <Text style={settingLabelStyle}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#00FF00' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={settingItemStyle}>
            <Text style={settingLabelStyle}>Reminder Time</Text>
            <Text style={settingValueStyle}>{notificationTime}</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </View>
        </Card>
      </View>

      {/* Data & Privacy */}
      <Text style={sectionTitleStyle}>DATA & PRIVACY</Text>
      <View style={{ paddingHorizontal: 24 }}>
        <Card>
          <TouchableOpacity style={linkButtonStyle} onPress={handleExportData} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Export Data</Text>
            {!isPremium && (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderWidth: 2,
                  borderColor: '#000000',
                  backgroundColor: '#FFD700',
                  marginRight: 8,
                }}
              >
                <Text style={{ fontWeight: '800', fontSize: 10, color: '#000000' }}>PRO</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={linkButtonStyle} onPress={openPrivacyPolicy} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={linkButtonStyle} onPress={openTermsOfService} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Support */}
      <Text style={sectionTitleStyle}>SUPPORT</Text>
      <View style={{ paddingHorizontal: 24 }}>
        <Card>
          <TouchableOpacity style={linkButtonStyle} onPress={openSupport} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <View style={settingItemStyle}>
            <Text style={settingLabelStyle}>App Version</Text>
            <Text style={settingValueStyle}>{appVersion}</Text>
          </View>
        </Card>
      </View>

      {/* Developer Tools (Debug) */}
      {__DEV__ && (
        <>
          <Text style={sectionTitleStyle}>DEVELOPER</Text>
          <View style={{ paddingHorizontal: 24 }}>
            <Card>
              <TouchableOpacity
                style={linkButtonStyle}
                onPress={handleResetOnboarding}
                activeOpacity={0.7}
              >
                <Text style={settingLabelStyle}>Reset Onboarding</Text>
                <Ionicons name="chevron-forward" size={20} color="#000000" />
              </TouchableOpacity>
            </Card>
          </View>
        </>
      )}

      {/* Account Actions */}
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48, gap: 12 }}>
        <Button variant="secondary" onPress={handleSignOut}>
          Sign Out
        </Button>
        <Button variant="danger" onPress={handleDeleteAccount}>
          Delete Account
        </Button>
      </View>
    </ScrollView>
  );
}
