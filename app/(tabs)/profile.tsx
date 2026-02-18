import { useEffect } from 'react';
import { View, Text, ScrollView, ViewStyle, TextStyle, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trackScreenView } from '@services/firebase/analytics';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { habits } = useHabitsStore();
  const dialog = useDialog();

  useEffect(() => {
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
        },
      },
    ]);
  };

  const sectionTitleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  };

  const labelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  };

  const valueStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 15,
    color: colors.text,
  };

  const statBoxStyle: ViewStyle = {
    padding: 16,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const statValueStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 4,
  };

  const statLabelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.textMuted,
  };

  const activeHabits = habits.filter((h) => !h.archived).length;
  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
          Profile
        </Text>
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
                borderWidth: 2.5,
                borderColor: colors.border,
                borderRadius: 12,
                backgroundColor: colors.warning,
                marginTop: 8,
              }}
            >
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text, textAlign: 'center' }}>
                You're at the free tier limit (5 habits)
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text, textAlign: 'center', marginTop: 4 }}>
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
              onPress={() => Linking.openURL('https://mdnaeem95.github.io/neubrutalism-habit-tracker/privacy.html')}
            >
              Privacy Policy
            </Button>

            <Button
              variant="secondary"
              onPress={() => Linking.openURL('https://mdnaeem95.github.io/neubrutalism-habit-tracker/terms.html')}
            >
              Terms of Service
            </Button>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>
                Version 1.0.0
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 4 }}>
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
