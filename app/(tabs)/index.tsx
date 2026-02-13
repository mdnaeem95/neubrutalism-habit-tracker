import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { NotificationPermissionBanner } from '@components/ui/NotificationPermissionBanner';
import { HabitCard } from '@components/habits/HabitCard';
import { NoteInputModal } from '@components/habits/NoteInputModal';
import { AchievementUnlockedModal } from '@components/achievements';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useAchievementsStore } from '@store/useAchievementsStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trackScreenView } from '@services/firebase/analytics';
import { checkAchievements } from '@utils/achievementChecker';
import { format } from 'date-fns';
import type { HabitWithStats, CheckIn } from '@/types/habit';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const { habits, loading, fetchHabits, toggleCheckIn, checkIns } = useHabitsStore();
  const {
    fetchUserAchievements,
    unlockMultipleAchievements,
    getPendingUnlock,
    clearPendingUnlock,
    unlockedIds,
  } = useAchievementsStore();
  const dialog = useDialog();
  const [refreshing, setRefreshing] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  useEffect(() => {
    if (user) {
      loadHabits();
      loadAchievements();
    }
  }, [user]);

  useEffect(() => {
    trackScreenView('Today');
  }, []);

  const loadAchievements = async () => {
    if (!user) return;
    try {
      await fetchUserAchievements(user.id);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const loadHabits = async () => {
    if (!user) return;
    try {
      await fetchHabits(user.id);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to load habits');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const checkForAchievements = async () => {
    if (!user) return;

    try {
      const allCheckIns: CheckIn[] = Object.values(checkIns).flat();
      const totalHabits = habits.filter((h) => !h.archived).length;
      const totalCompletions = allCheckIns.filter((c) => c.completed).length;
      const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
      const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';

      const newAchievements = checkAchievements({
        habits,
        allCheckIns,
        totalHabits,
        totalCompletions,
        longestStreak,
        isPremium,
        unlockedAchievements: unlockedIds,
      });

      if (newAchievements.length > 0) {
        await unlockMultipleAchievements(user.id, newAchievements);
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const handleCheckIn = async (habitId: string) => {
    if (!user) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';
    const isCheckingIn = !habit.todayCheckedIn;

    if (isPremium && isCheckingIn) {
      setSelectedHabit(habit);
      setNoteModalVisible(true);
    } else {
      try {
        await toggleCheckIn(user.id, habitId);
        await checkForAchievements();
      } catch (error: any) {
        dialog.alert('Error', error.message || 'Failed to update check-in');
      }
    }
  };

  const handleSaveNote = async (note: string) => {
    if (!user || !selectedHabit) return;

    try {
      await toggleCheckIn(user.id, selectedHabit.id, undefined, note);
      setNoteModalVisible(false);
      setSelectedHabit(null);
      await checkForAchievements();
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to save check-in with note');
    }
  };

  const handleCancelNote = () => {
    setNoteModalVisible(false);
    setSelectedHabit(null);
  };

  const handleCreateHabit = () => {
    router.push('/habit/create');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const todayDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 4 }}>
          Today
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, marginBottom: 16 }}>
          {todayDate}
        </Text>

        <Button variant="primary" onPress={handleCreateHabit}>
          + Add Habit
        </Button>
      </View>

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />

      {/* Habits List */}
      {loading && habits.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>
            Loading habits...
          </Text>
        </View>
      ) : habits.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text, marginBottom: 16, textAlign: 'center' }}>
            No habits yet!
          </Text>
          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, marginBottom: 24, textAlign: 'center' }}>
            Create your first habit to start building better routines
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onPress={() => handleHabitPress(item.id)}
              onCheckIn={() => handleCheckIn(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Note Input Modal */}
      <NoteInputModal
        visible={noteModalVisible}
        habitName={selectedHabit?.name || ''}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
      />

      {/* Achievement Unlocked Modal */}
      <AchievementUnlockedModal
        visible={getPendingUnlock() !== null}
        achievement={getPendingUnlock()}
        onClose={clearPendingUnlock}
      />
    </View>
  );
}
