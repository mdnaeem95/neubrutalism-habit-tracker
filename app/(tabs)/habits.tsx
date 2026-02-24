import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { HabitCard } from '@components/habits/HabitCard';
import { QuantityInputModal } from '@components/habits/QuantityInputModal';
import { AdBanner } from '@components/ui/AdBanner';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trackScreenView } from '@services/firebase/analytics';
import type { HabitWithStats } from '@/types/habit';

export default function HabitsScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const { habits, loading, fetchHabits, toggleCheckIn } = useHabitsStore();
  const dialog = useDialog();
  const [refreshing, setRefreshing] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  useEffect(() => {
    trackScreenView('All Habits');
  }, []);

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

  const handleCheckIn = async (habitId: string) => {
    if (!user) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const isCheckingIn = !habit.todayCheckedIn;

    // For quantity/duration habits, show the input modal
    if (isCheckingIn && habit.trackingType && habit.trackingType !== 'boolean') {
      setSelectedHabit(habit);
      setQuantityModalVisible(true);
      return;
    }

    try {
      await toggleCheckIn(user.id, habitId);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to update check-in');
    }
  };

  const handleSaveQuantity = async (value: number) => {
    if (!user || !selectedHabit) return;

    try {
      await toggleCheckIn(user.id, selectedHabit.id, undefined, undefined, value);
      setQuantityModalVisible(false);
      setSelectedHabit(null);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to save check-in');
    }
  };

  const handleCancelQuantity = () => {
    setQuantityModalVisible(false);
    setSelectedHabit(null);
  };

  const handleCreateHabit = () => {
    router.push('/habit/create');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const completedHabits = habits.filter((h) => h.todayCheckedIn).length;
  const totalHabits = habits.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
          All Habits
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, marginBottom: 16 }}>
          {completedHabits} of {totalHabits} completed today
        </Text>

        <Button variant="primary" onPress={handleCreateHabit}>
          + Add Habit
        </Button>
      </View>

      {/* Ad Banner */}
      <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
        <AdBanner unitKey="bannerHabits" />
      </View>

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

      {/* Quantity/Duration Input Modal */}
      <QuantityInputModal
        visible={quantityModalVisible}
        habitName={selectedHabit?.name || ''}
        unit={selectedHabit?.unit || ''}
        targetValue={selectedHabit?.targetValue}
        initialValue={selectedHabit?.todayValue}
        mode={selectedHabit?.trackingType === 'duration' ? 'duration' : 'quantity'}
        onSave={handleSaveQuantity}
        onCancel={handleCancelQuantity}
      />
    </View>
  );
}
