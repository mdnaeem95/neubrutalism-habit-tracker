import { useEffect } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { trackScreenView } from '@services/firebase/analytics';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { habits } = useHabitsStore();
  const dialog = useDialog();

  useEffect(() => {
    // Track screen view
    trackScreenView('Profile');
  }, []);

  const handleLogout = () => {
    dialog.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // Navigation handled automatically by _layout.tsx
        },
      },
    ]);
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
  };

  const sectionTitleStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
  };

  const labelStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  };

  const valueStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
  };

  const statBoxStyle: ViewStyle = {
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const statValueStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 32,
    color: '#000000',
    marginBottom: 4,
  };

  const statLabelStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
  };

  const activeHabits = habits.filter((h) => !h.archived).length;
  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />

      <View style={headerStyle}>
        <Text style={titleStyle}>Profile</Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* User Info Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Account</Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{user?.displayName || 'Not set'}</Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{user?.email || 'Not available'}</Text>
          </View>

          <View>
            <Text style={labelStyle}>Account Type</Text>
            <Text style={valueStyle}>Free</Text>
          </View>
        </Card>

        {/* Stats Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Your Stats</Text>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{activeHabits}</Text>
              <Text style={statLabelStyle}>Active Habits</Text>
            </View>
            <View style={statBoxStyle}>
              <Text style={statValueStyle}>{totalStreakDays}</Text>
              <Text style={statLabelStyle}>Total Streaks</Text>
            </View>
          </View>

          {activeHabits >= 5 && (
            <View
              style={{
                padding: 12,
                borderWidth: 3,
                borderColor: '#000000',
                borderRadius: 0,
                backgroundColor: '#FFD700',
                marginTop: 8,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#000000', textAlign: 'center' }}>
                You're at the free tier limit (5 habits)
              </Text>
              <Text style={{ fontWeight: '600', fontSize: 12, color: '#000000', textAlign: 'center', marginTop: 4 }}>
                Upgrade to Premium for unlimited habits!
              </Text>
              <View style={{ marginTop: 12 }}>
                <Button
                  variant="primary"
                  onPress={() => router.push('/paywall')}
                >
                  Upgrade Now
                </Button>
              </View>
            </View>
          )}
        </Card>

        {/* Settings Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Settings</Text>

          <View style={{ gap: 12 }}>
            <Button
              variant="secondary"
              onPress={() => router.push('/achievements')}
            >
              Achievements
            </Button>

            <Button
              variant="secondary"
              onPress={() => router.push('/theme-settings')}
            >
              Custom Themes
            </Button>

            <Button
              variant="secondary"
              onPress={() => router.push('/settings')}
            >
              App Settings
            </Button>

            <Button
              variant="secondary"
              onPress={() => router.push('/paywall')}
            >
              Subscription
            </Button>
          </View>
        </Card>
        {/* Info Card */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>About</Text>

          <View style={{ gap: 12 }}>
            <Button
              variant="secondary"
              onPress={() => dialog.alert('Help', 'Help center coming soon!')}
            >
              Help & Support
            </Button>

            <Button
              variant="secondary"
              onPress={() => dialog.alert('Privacy Policy', 'Privacy policy coming soon!')}
            >
              Privacy Policy
            </Button>

            <Button
              variant="secondary"
              onPress={() => dialog.alert('Terms', 'Terms of service coming soon!')}
            >
              Terms of Service
            </Button>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: '600', fontSize: 12, color: '#000000', textAlign: 'center' }}>
                Version 1.0.0
              </Text>
              <Text style={{ fontWeight: '500', fontSize: 10, color: '#666666', textAlign: 'center', marginTop: 4 }}>
                Made with Claude Code
              </Text>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <Button variant="danger" onPress={handleLogout} style={{ marginBottom: 48 }}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}
