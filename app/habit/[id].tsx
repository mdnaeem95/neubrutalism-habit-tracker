import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Badge } from '@components/ui';
import { HabitCalendar } from '@components';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { getLast7DaysCheckIns } from '@utils/habitCalculations';

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { getHabitById, checkIns, deleteHabit, archiveHabit, toggleCheckIn } = useHabitsStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const habit = id ? getHabitById(id) : null;
  const habitCheckIns = id && checkIns[id] ? checkIns[id] : [];
  const last7Days = getLast7DaysCheckIns(habitCheckIns);

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteHabit(id);
              Alert.alert('Success', 'Habit deleted successfully');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await archiveHabit(id);
      Alert.alert('Success', 'Habit archived successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to archive habit');
    }
  };

  const handleCheckIn = async (date: string) => {
    if (!user || !id) return;
    try {
      await toggleCheckIn(user.id, id, date);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update check-in');
    }
  };

  if (!habit) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <Text style={{ fontWeight: '700', fontSize: 16, color: '#000000' }}>Habit not found</Text>
        <Button variant="secondary" onPress={() => router.back()} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow': return '#FFD700';
      case 'pink': return '#FF69B4';
      case 'cyan': return '#00FFFF';
      case 'lime': return '#00FF00';
      case 'orange': return '#FF6B35';
      default: return '#FFD700';
    }
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  };

  const iconContainerStyle: ViewStyle = {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: getColorValue(habit.color),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 36,
    color: '#000000',
    marginBottom: 8,
  };

  const descriptionStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
  };

  const statCardStyle: ViewStyle = {
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
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

  const dayBoxStyle = (completed: boolean): ViewStyle => ({
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: completed ? '#00FF00' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const dayTextStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 12,
    color: '#000000',
  };

  const sectionTitleStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />

      <View style={headerStyle}>
        <View style={iconContainerStyle}>
          <Ionicons name={habit.icon as any} size={48} color="#000000" />
        </View>

        <Text style={titleStyle}>{habit.name}</Text>

        {habit.description && (
          <Text style={descriptionStyle}>{habit.description}</Text>
        )}

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Badge variant="default">
            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
          </Badge>
          <Badge variant="info">
            {habit.frequency.type.charAt(0).toUpperCase() + habit.frequency.type.slice(1)}
          </Badge>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <View style={statCardStyle}>
              <Text style={statValueStyle}>{habit.currentStreak}</Text>
              <Text style={statLabelStyle}>Current Streak</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={statCardStyle}>
              <Text style={statValueStyle}>{habit.longestStreak}</Text>
              <Text style={statLabelStyle}>Best Streak</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <View style={statCardStyle}>
              <Text style={statValueStyle}>{habit.totalCompletions}</Text>
              <Text style={statLabelStyle}>Total Days</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={statCardStyle}>
              <Text style={statValueStyle}>{habit.completionRate}%</Text>
              <Text style={statLabelStyle}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Last 7 Days */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Last 7 Days</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {last7Days.map((day, _) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
              return (
                <TouchableOpacity
                  key={day.date}
                  style={dayBoxStyle(day.completed)}
                  onPress={() => handleCheckIn(day.date)}
                  activeOpacity={0.7}
                >
                  <Text style={dayTextStyle}>{dayName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Monthly Calendar */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={sectionTitleStyle}>Calendar</Text>
          <HabitCalendar
            checkIns={habitCheckIns}
            onDayPress={handleCheckIn}
            currentMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </Card>

        {/* Actions */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          <Button variant="primary" onPress={() => router.push(`/habit/${id}/edit`)}>
            Edit Habit
          </Button>
          <Button variant="secondary" onPress={handleArchive}>
            Archive Habit
          </Button>
          <Button variant="danger" onPress={handleDelete}>
            Delete Habit
          </Button>
          <Button variant="secondary" onPress={() => router.back()}>
            Back to Habits
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
