import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Badge } from '@components/ui';
import { HabitCalendar } from '@components';
import { NoteInputModal } from '@components/habits/NoteInputModal';
import { NoteCard } from '@components/habits/NoteCard';
import { ShareCardModal, StreakShareCard } from '@components/share';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useDialog } from '@/contexts/DialogContext';
import { getLast7DaysCheckIns } from '@utils/habitCalculations';
import type { CheckIn } from '@/types/habit';

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { getHabitById, checkIns, deleteHabit, archiveHabit, toggleCheckIn } = useHabitsStore();
  const dialog = useDialog();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentNote, setCurrentNote] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if user has premium (for watermark removal)
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

    // Check if user is premium and if we're checking in (not unchecking)
    const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';
    const existingCheckIn = habitCheckIns.find((c) => c.date === date);
    const isCheckingIn = !existingCheckIn?.completed;

    if (isPremium && isCheckingIn) {
      // Show note modal for premium users
      setSelectedDate(date);
      setCurrentNote(existingCheckIn?.note || '');
      setNoteModalVisible(true);
    } else {
      // Regular check-in without note
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
            <TouchableOpacity
              style={statCardStyle}
              onPress={() => habit.currentStreak > 0 && setShowShareModal(true)}
              activeOpacity={habit.currentStreak > 0 ? 0.7 : 1}
            >
              <Text style={statValueStyle}>{habit.currentStreak}</Text>
              <Text style={statLabelStyle}>Current Streak</Text>
              {habit.currentStreak > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name="share-outline" size={14} color="#666666" />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#666666', marginLeft: 4 }}>
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
                    <Text style={dayTextStyle}>{dayName}</Text>
                  </TouchableOpacity>
                  {hasNote && (
                    <View style={{ marginTop: 4 }}>
                      <Ionicons name="document-text" size={12} color="#000000" />
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
            .slice(0, 5); // Show last 5 notes

          if (notesWithCheckIns.length > 0) {
            return (
              <Card style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={sectionTitleStyle}>Recent Notes</Text>
                  <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#FFD700', borderWidth: 2, borderColor: '#000000' }}>
                    <Ionicons name="star" size={10} color="#000000" />
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#000000', marginLeft: 4 }}>PREMIUM</Text>
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
