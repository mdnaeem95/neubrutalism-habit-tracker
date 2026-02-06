import { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TextStyle, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { HabitCard } from '@components/habits/HabitCard';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { trackScreenView } from '@services/firebase/analytics';

export default function HabitsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { habits, loading, fetchHabits, toggleCheckIn } = useHabitsStore();
  const dialog = useDialog();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  useEffect(() => {
    // Track screen view
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
    try {
      await toggleCheckIn(user.id, habitId);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to update check-in');
    }
  };

  const handleCreateHabit = () => {
    router.push('/habit/create');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
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

  const subtitleStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
  };

  const completedHabits = habits.filter((h) => h.todayCheckedIn).length;
  const totalHabits = habits.length;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={headerStyle}>
        <Text style={titleStyle}>All Habits</Text>
        <Text style={subtitleStyle}>
          {completedHabits} of {totalHabits} completed today
        </Text>

        <Button variant="primary" onPress={handleCreateHabit}>
          + Add Habit
        </Button>
      </View>

      {/* Habits List */}
      {loading && habits.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: '#000000' }}>
            Loading habits...
          </Text>
        </View>
      ) : habits.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontWeight: '900', fontSize: 32, color: '#000000', marginBottom: 16, textAlign: 'center' }}>
            No habits yet!
          </Text>
          <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000', marginBottom: 24, textAlign: 'center' }}>
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
    </View>
  );
}
