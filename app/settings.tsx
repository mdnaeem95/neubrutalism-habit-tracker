import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ViewStyle, TextStyle, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, TimePicker } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { getUserPreferences, saveUserPreferences, clearStorage, resetOnboarding } from '@utils/storage';
import { exportData } from '@utils/export';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { scheduleDailyNotification, cancelAllNotifications } from '@services/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { habits, checkIns } = useHabitsStore();
  const dialog = useDialog();
  const { hasPermission, requestPermission } = useNotifications();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState<string | null>('09:00');
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [globalNotificationId, setGlobalNotificationId] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences();
      setPreferences(prefs);
      setNotificationsEnabled(prefs.notificationsEnabled ?? true);
      setNotificationTime(prefs.notificationTime ?? '09:00');
      setGlobalNotificationId(prefs.globalNotificationId ?? null);
    };
    loadPreferences();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    if (value && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        dialog.alert('Permission Required', 'Please enable notifications in your device settings to receive reminders.');
        return;
      }
    }

    setNotificationsEnabled(value);
    await saveUserPreferences({ ...preferences, notificationsEnabled: value });

    if (value && notificationTime) {
      await scheduleGlobalReminder(notificationTime);
    } else {
      await cancelAllNotifications();
      setGlobalNotificationId(null);
      await saveUserPreferences({ ...preferences, notificationsEnabled: value, globalNotificationId: null });
    }
  };

  const handleNotificationTimeChange = async (time: string | null) => {
    setNotificationTime(time);
    await saveUserPreferences({ ...preferences, notificationTime: time });

    if (notificationsEnabled && time) {
      await scheduleGlobalReminder(time);
    } else if (!time) {
      await cancelAllNotifications();
      setGlobalNotificationId(null);
      await saveUserPreferences({ ...preferences, notificationTime: null, globalNotificationId: null });
    }
  };

  const scheduleGlobalReminder = async (time: string) => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          dialog.alert('Permission Required', 'Please enable notifications in your device settings to receive reminders.');
          return;
        }
      }

      await cancelAllNotifications();

      const [hours, minutes] = time.split(':').map(Number);

      const notificationId = await scheduleDailyNotification(
        'Time to check your habits!',
        'Stay consistent and keep your streaks going!',
        hours,
        minutes
      );

      setGlobalNotificationId(notificationId);
      await saveUserPreferences({
        ...preferences,
        notificationTime: time,
        globalNotificationId: notificationId,
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      dialog.alert('Error', 'Failed to schedule reminder. Please try again.');
    }
  };

  const handleSignOut = async () => {
    dialog.alert('Sign Out', 'Are you sure you want to sign out?', [
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
            dialog.alert('Error', error.message || 'Failed to sign out');
          }
        },
      },
    ]);
  };

  const handleResetOnboarding = () => {
    dialog.alert('Reset Onboarding', 'This will show the onboarding screens again on next launch. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: async () => {
          await resetOnboarding();
          dialog.alert('Success', 'Onboarding reset. Restart the app to see it again.');
        },
      },
    ]);
  };

  const handleExportData = () => {
    const isPremium = user?.subscription?.plan === 'premium';
    if (!isPremium) {
      dialog.alert('Premium Feature', 'Data export is available with Premium. Upgrade now?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/paywall') },
      ]);
      return;
    }

    dialog.alert('Export Data', 'Choose export format:', [
      {
        text: 'JSON',
        onPress: async () => {
          try {
            await exportData(habits, checkIns, 'json');
            dialog.alert('Success', 'Data exported successfully!');
          } catch (error: any) {
            dialog.alert('Export Failed', error.message || 'Failed to export data');
          }
        },
      },
      {
        text: 'CSV',
        onPress: async () => {
          try {
            await exportData(habits, checkIns, 'csv');
            dialog.alert('Success', 'Data exported successfully!');
          } catch (error: any) {
            dialog.alert('Export Failed', error.message || 'Failed to export data');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteAccount = () => {
    dialog.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dialog.alert('Are you absolutely sure?', 'This action cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'DELETE',
                style: 'destructive',
                onPress: async () => {
                  dialog.alert('Error', 'Account deletion not yet implemented');
                },
              },
            ]);
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

  const settingItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.divider,
  };

  const settingLabelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 15,
    color: colors.text,
    flex: 1,
  };

  const settingValueStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 8,
  };

  const linkButtonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.divider,
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const userPlan = user?.subscription?.plan || 'free';
  const isPremium = userPlan === 'premium';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.border,
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          }}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text }}>Settings</Text>
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
                borderWidth: 2.5,
                borderColor: colors.border,
                borderRadius: 12,
                backgroundColor: colors.warning,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <MaterialCommunityIcons name="account" size={40} color={colors.text} />
            </View>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text, marginBottom: 4 }}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
              {user?.email}
            </Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 2.5,
                borderColor: colors.border,
                borderRadius: 8,
                backgroundColor: isPremium ? colors.accent : colors.warning,
              }}
            >
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }}>
                {isPremium ? 'PREMIUM' : 'FREE'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats Summary */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text }}>
                {habits.filter((h) => !h.archived).length}
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted }}>
                Active Habits
              </Text>
            </View>
            <View
              style={{
                width: 1.5,
                backgroundColor: colors.border,
                marginHorizontal: 16,
              }}
            />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text }}>
                {habits.reduce((sum, h) => sum + h.totalCompletions, 0)}
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted }}>
                Total Check-ins
              </Text>
            </View>
          </View>
        </Card>

        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <Card style={{ marginBottom: 16, backgroundColor: colors.warning }}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text, marginBottom: 8 }}>
              Upgrade to Premium
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text, marginBottom: 12 }}>
              Unlimited habits, advanced stats, and more!
            </Text>
            <Button variant="primary" onPress={() => router.push('/paywall')}>
              View Plans
            </Button>
          </Card>
        )}
      </View>

      {/* Notifications */}
      <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted, marginLeft: 24, marginBottom: 12, marginTop: 16 }}>
        NOTIFICATIONS
      </Text>
      <View style={{ paddingHorizontal: 24 }}>
        <Card>
          <View style={settingItemStyle}>
            <Text style={settingLabelStyle}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.divider, true: colors.accent }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor={colors.divider}
            />
          </View>
          <View style={{ paddingTop: 8 }}>
            <TimePicker
              value={notificationTime}
              onChange={handleNotificationTimeChange}
              label="Daily Reminder Time"
              disabled={!notificationsEnabled}
              placeholder="Set reminder time"
            />
          </View>
        </Card>
      </View>

      {/* Data & Privacy */}
      <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted, marginLeft: 24, marginBottom: 12, marginTop: 16 }}>
        DATA & PRIVACY
      </Text>
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
                  borderColor: colors.border,
                  borderRadius: 8,
                  backgroundColor: colors.warning,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 10, color: colors.text }}>PRO</Text>
              </View>
            )}
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={linkButtonStyle} onPress={openPrivacyPolicy} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Privacy Policy</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={linkButtonStyle} onPress={openTermsOfService} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Terms of Service</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Support */}
      <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted, marginLeft: 24, marginBottom: 12, marginTop: 16 }}>
        SUPPORT
      </Text>
      <View style={{ paddingHorizontal: 24 }}>
        <Card>
          <TouchableOpacity style={linkButtonStyle} onPress={openSupport} activeOpacity={0.7}>
            <Text style={settingLabelStyle}>Contact Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
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
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted, marginLeft: 24, marginBottom: 12, marginTop: 16 }}>
            DEVELOPER
          </Text>
          <View style={{ paddingHorizontal: 24 }}>
            <Card>
              <TouchableOpacity
                style={linkButtonStyle}
                onPress={handleResetOnboarding}
                activeOpacity={0.7}
              >
                <Text style={settingLabelStyle}>Reset Onboarding</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
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
