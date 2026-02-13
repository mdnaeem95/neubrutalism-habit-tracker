import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Card, Badge } from '@components/ui';
import { HabitCalendar } from '@components';
import { NoteInputModal } from '@components/habits/NoteInputModal';
import { NoteCard } from '@components/habits/NoteCard';
import { ShareCardModal, StreakShareCard } from '@components/share';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getLast7DaysCheckIns } from '@utils/habitCalculations';
import type { CheckIn } from '@/types/habit';

export default function HabitDetailScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { getHabitById, checkIns, deleteHabit, archiveHabit, toggleCheckIn } = useHabitsStore();
  const dialog = useDialog();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentNote, setCurrentNote] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);

  const isPremium = user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial';

  const habit = id ? getHabitById(id) : null;
  const habitCheckIns = id && checkIns[id] ? checkIns[id] : [];
  const last7Days = getLast7DaysCheckIns(habitCheckIns);

  const handleDelete = () => {
    dialog.alert(
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
              dialog.alert('Success', 'Habit deleted successfully', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error: any) {
              dialog.alert('Error', error.message || 'Failed to delete habit');
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
      dialog.alert('Success', 'Habit archived successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to archive habit');
    }
  };

  const handleCheckIn = async (date: string) => {
    if (!user || !id) return;

    const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';
    const existingCheckIn = habitCheckIns.find((c) => c.date === date);
    const isCheckingIn = !existingCheckIn?.completed;

    if (isPremium && isCheckingIn) {
      setSelectedDate(date);
      setCurrentNote(existingCheckIn?.note || '');
      setNoteModalVisible(true);
    } else {
      try {
        await toggleCheckIn(user.id, id, date);
      } catch (error: any) {
        dialog.alert('Error', error.message || 'Failed to update check-in');
      }
    }
  };

  const handleSaveNote = async (note: string) => {
    if (!user || !id) return;

    try {
      await toggleCheckIn(user.id, id, selectedDate, note);
      setNoteModalVisible(false);
      setSelectedDate('');
      setCurrentNote('');
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to save check-in with note');
    }
  };

  const handleCancelNote = () => {
    setNoteModalVisible(false);
    setSelectedDate('');
    setCurrentNote('');
  };

  if (!habit) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>Habit not found</Text>
        <Button variant="secondary" onPress={() => router.back()} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow': return colors.warning;
      case 'pink': return colors.primary;
      case 'cyan': return colors.secondary;
      case 'lime': return colors.accent;
      case 'orange': return colors.orange;
      default: return colors.warning;
    }
  };

  const iconContainerStyle: ViewStyle = {
    width: 80,
    height: 80,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: getColorValue(habit.color),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const statCardStyle: ViewStyle = {
    padding: 16,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
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

  const dayBoxStyle = (completed: boolean): ViewStyle => ({
    width: 40,
    height: 40,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: completed ? colors.accent : colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const sectionTitleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
        <View style={iconContainerStyle}>
          <MaterialCommunityIcons name={habit.icon as any} size={48} color={colors.text} />
        </View>

        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
          {habit.name}
        </Text>

        {habit.description && (
          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, marginBottom: 16 }}>
            {habit.description}
          </Text>
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
            <TouchableOpacity
              style={statCardStyle}
              onPress={() => habit.currentStreak > 0 && setShowShareModal(true)}
              activeOpacity={habit.currentStreak > 0 ? 0.7 : 1}
            >
              <Text style={statValueStyle}>{habit.currentStreak}</Text>
              <Text style={statLabelStyle}>Current Streak</Text>
              {habit.currentStreak > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <MaterialCommunityIcons name="share-variant" size={14} color={colors.textMuted} />
                  <Text style={{ fontSize: 10, fontFamily: 'SpaceMono_700Bold', color: colors.textMuted, marginLeft: 4 }}>
                    Tap to share
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
              const checkIn = habitCheckIns.find((c) => c.date === day.date);
              const hasNote = checkIn?.note && checkIn.note.trim().length > 0;

              return (
                <View key={day.date} style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={dayBoxStyle(day.completed)}
                    onPress={() => handleCheckIn(day.date)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.text }}>
                      {dayName}
                    </Text>
                  </TouchableOpacity>
                  {hasNote && (
                    <View style={{ marginTop: 4 }}>
                      <MaterialCommunityIcons name="text-box" size={12} color={colors.textMuted} />
                    </View>
                  )}
                </View>
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

        {/* Recent Notes (Premium Feature) */}
        {(() => {
          const notesWithCheckIns = habitCheckIns
            .filter((c) => c.note && c.note.trim().length > 0)
            .slice(0, 5);

          if (notesWithCheckIns.length > 0) {
            return (
              <Card style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={sectionTitleStyle}>Recent Notes</Text>
                  <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.warning, borderWidth: 2, borderColor: colors.border, borderRadius: 8 }}>
                    <MaterialCommunityIcons name="star" size={10} color={colors.text} />
                    <Text style={{ fontSize: 10, fontFamily: 'SpaceMono_700Bold', color: colors.text, marginLeft: 4 }}>PREMIUM</Text>
                  </View>
                </View>
                <View style={{ gap: 12 }}>
                  {notesWithCheckIns.map((checkIn: CheckIn) => (
                    <NoteCard
                      key={checkIn.id}
                      note={checkIn.note || ''}
                      date={checkIn.date}
                      compact={true}
                    />
                  ))}
                </View>
              </Card>
            );
          }
          return null;
        })()}

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

      {/* Note Input Modal */}
      <NoteInputModal
        visible={noteModalVisible}
        habitName={habit?.name || ''}
        initialNote={currentNote}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
      />

      {/* Share Streak Modal */}
      {habit && (
        <ShareCardModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share Your Streak"
        >
          <StreakShareCard
            habitName={habit.name}
            streakDays={habit.currentStreak}
            showWatermark={!isPremium}
            themeColor={getColorValue(habit.color)}
          />
        </ShareCardModal>
      )}
    </ScrollView>
  );
}
