import { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Input, Card, TimePicker } from '@components/ui';
import { useHabitsStore } from '@store/useHabitsStore';
import { useAuthStore } from '@store/useAuthStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { HabitCategory, HabitColor, FrequencyType } from '@/types/habit';

const HABIT_ICONS: string[] = [
  'run',
  'book-open-variant',
  'walk',
  'leaf',
  'water',
  'food',
  'bed',
  'pencil',
  'crosshairs-gps',
  'lightbulb',
  'heart',
  'clock',
];
const HABIT_COLORS: HabitColor[] = ['yellow', 'pink', 'cyan', 'lime', 'orange'];
const CATEGORIES: HabitCategory[] = ['health', 'productivity', 'fitness', 'learning', 'mindfulness', 'other'];

export default function EditHabitScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabitById, updateHabit, loading } = useHabitsStore();
  const { user } = useAuthStore();
  const dialog = useDialog();

  const habit = id ? getHabitById(id) : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState<HabitColor>('yellow');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  const isPremium = user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial';

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setSelectedIcon(habit.icon);
      setSelectedColor(habit.color);
      setSelectedCategory(habit.category);
      setFrequencyType(habit.frequency.type);
      setReminderTime(habit.reminderTime || null);
    }
  }, [habit]);

  const handleReminderTimeChange = (time: string | null) => {
    setReminderTime(time);
  };

  const handlePremiumLockPress = () => {
    dialog.alert('Premium Feature', 'Per-habit reminders are available with Premium. Set custom reminder times for each habit!', [
      { text: 'Maybe Later', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/paywall') },
    ]);
  };

  const handleUpdate = async () => {
    if (!id) return;

    if (!name.trim()) {
      dialog.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      await updateHabit(id, {
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        color: selectedColor,
        category: selectedCategory,
        frequency: {
          type: frequencyType,
        },
        reminderTime: isPremium ? reminderTime : null,
      });

      dialog.alert('Success', 'Habit updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to update habit');
    }
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

  const getColorValue = (color: HabitColor): string => {
    switch (color) {
      case 'yellow': return colors.warning;
      case 'pink': return colors.primary;
      case 'cyan': return colors.secondary;
      case 'lime': return colors.accent;
      case 'orange': return colors.orange;
    }
  };

  const sectionTitleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  };

  const iconButtonStyle = (isSelected: boolean): ViewStyle => ({
    width: 56,
    height: 56,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: isSelected ? colors.warning : colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const colorButtonStyle = (color: HabitColor, isSelected: boolean): ViewStyle => ({
    width: 56,
    height: 56,
    borderWidth: isSelected ? 3.5 : 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: getColorValue(color),
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const categoryButtonStyle = (isSelected: boolean): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 9999,
    backgroundColor: isSelected ? colors.secondary : colors.surface,
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const categoryTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.text,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
            Edit Habit
          </Text>
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              {HABIT_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={iconButtonStyle(icon === selectedIcon)}
                  onPress={() => setSelectedIcon(icon)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={icon as any} size={28} color={colors.text} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <Text style={sectionTitleStyle}>Choose a Color</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
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
                onPress={handleUpdate}
                isLoading={loading}
                disabled={loading || !name.trim()}
              >
                Save Changes
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
