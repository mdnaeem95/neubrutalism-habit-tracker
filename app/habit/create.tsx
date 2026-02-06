import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card, TimePicker } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useAchievementsStore } from '@store/useAchievementsStore';
import { useDialog } from '@/contexts/DialogContext';
import { checkAchievements } from '@utils/achievementChecker';
import type { HabitCategory, HabitColor, FrequencyType, CheckIn } from '@/types/habit';

const HABIT_ICONS: Array<keyof typeof Ionicons.glyphMap> = [
  'fitness',
  'book',
  'walk',
  'leaf',
  'water',
  'restaurant',
  'bed',
  'pencil',
  'locate',
  'bulb',
  'heart',
  'time',
];
const HABIT_COLORS: HabitColor[] = ['yellow', 'pink', 'cyan', 'lime', 'orange'];
const CATEGORIES: HabitCategory[] = ['health', 'productivity', 'fitness', 'learning', 'mindfulness', 'other'];

export default function CreateHabitScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createHabit, loading, habits, checkIns } = useHabitsStore();
  const { unlockMultipleAchievements, unlockedIds } = useAchievementsStore();
  const dialog = useDialog();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState<HabitColor>('yellow');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [frequencyType,] = useState<FrequencyType>('daily');
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  // Check if user has premium for per-habit reminders
  const isPremium = user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial';

  const handleReminderTimeChange = (time: string | null) => {
    setReminderTime(time);
  };

  const handlePremiumLockPress = () => {
    dialog.alert('Premium Feature', 'Per-habit reminders are available with Premium. Set custom reminder times for each habit!', [
      { text: 'Maybe Later', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/paywall') },
    ]);
  };

  const checkForAchievements = async (updatedHabitsCount: number) => {
    if (!user) return;

    try {
      // Gather all check-ins across all habits
      const allCheckIns: CheckIn[] = Object.values(checkIns).flat();

      // Calculate total stats
      const totalCompletions = allCheckIns.filter((c) => c.completed).length;
      const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
      const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';

      // Check which achievements should be unlocked
      // Use updatedHabitsCount since store may not have updated yet
      const newAchievements = checkAchievements({
        habits,
        allCheckIns,
        totalHabits: updatedHabitsCount,
        totalCompletions,
        longestStreak,
        isPremium,
        unlockedAchievements: unlockedIds,
      });

      // Unlock new achievements
      if (newAchievements.length > 0) {
        await unlockMultipleAchievements(user.id, newAchievements);
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const handleCreate = async () => {
    if (!user) return;

    if (!name.trim()) {
      dialog.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      const userPlan = user.subscription?.plan || 'free';
      const currentHabitCount = habits.filter((h) => !h.archived).length;

      await createHabit(
        user.id,
        {
          name: name.trim(),
          description: description.trim(),
          icon: selectedIcon,
          color: selectedColor,
          category: selectedCategory,
          frequency: {
            type: frequencyType,
          },
          reminderTime: isPremium ? reminderTime : null,
        },
        userPlan
      );

      // Check for achievements after creating habit (pass updated count)
      await checkForAchievements(currentHabitCount + 1);

      dialog.alert('Success', 'Habit created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to create habit');
    }
  };

  const getColorValue = (color: HabitColor): string => {
    switch (color) {
      case 'yellow': return '#FFD700';
      case 'pink': return '#FF69B4';
      case 'cyan': return '#00FFFF';
      case 'lime': return '#00FF00';
      case 'orange': return '#FF6B35';
    }
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
    fontSize: 16,
    color: '#000000',
    marginBottom: 12,
  };

  const iconGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  };

  const iconButtonStyle = (isSelected: boolean): ViewStyle => ({
    width: 56,
    height: 56,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: isSelected ? '#FFD700' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const colorGridStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  };

  const colorButtonStyle = (color: HabitColor, isSelected: boolean): ViewStyle => ({
    width: 56,
    height: 56,
    borderWidth: isSelected ? 4 : 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: getColorValue(color),
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const categoryGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  };

  const categoryButtonStyle = (isSelected: boolean): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: isSelected ? '#00FFFF' : '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const categoryTextStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 14,
    color: '#000000',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={headerStyle}>
          <Text style={titleStyle}>New Habit</Text>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <Card style={{ marginBottom: 24 }}>
            {/* Name Input */}
            <View style={{ marginBottom: 16 }}>
              <Input
                label="Habit Name"
                placeholder="e.g., Morning run"
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            {/* Description Input */}
            <View style={{ marginBottom: 16 }}>
              <Input
                label="Description (Optional)"
                placeholder="Why is this habit important?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Icon Selection */}
            <Text style={sectionTitleStyle}>Choose an Icon</Text>
            <View style={iconGridStyle}>
              {HABIT_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={iconButtonStyle(icon === selectedIcon)}
                  onPress={() => setSelectedIcon(icon)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={icon} size={28} color="#000000" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <Text style={sectionTitleStyle}>Choose a Color</Text>
            <View style={colorGridStyle}>
              {HABIT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={colorButtonStyle(color, color === selectedColor)}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            {/* Category Selection */}
            <Text style={sectionTitleStyle}>Category</Text>
            <View style={categoryGridStyle}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={categoryButtonStyle(category === selectedCategory)}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text style={categoryTextStyle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reminder Time (Premium Feature) */}
            <Text style={sectionTitleStyle}>Daily Reminder</Text>
            <TimePicker
              value={isPremium ? reminderTime : null}
              onChange={handleReminderTimeChange}
              placeholder="No reminder set"
              showLock={!isPremium}
              onLockPress={handlePremiumLockPress}
            />

            {/* Action Buttons */}
            <View style={{ gap: 12, marginTop: 8 }}>
              <Button
                variant="primary"
                onPress={handleCreate}
                isLoading={loading}
                disabled={loading || !name.trim()}
              >
                Create Habit
              </Button>
              <Button variant="secondary" onPress={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
