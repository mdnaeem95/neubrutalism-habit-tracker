import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Input, Card, TimePicker } from '@components/ui';
import { PremiumLockBadge } from '@components/ui/PremiumLockBadge';
import { FrequencySelector } from '@components/habits/FrequencySelector';
import { TemplatePickerModal } from '@components/habits/TemplatePickerModal';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useAchievementsStore } from '@store/useAchievementsStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { checkAchievements } from '@utils/achievementChecker';
import type { HabitCategory, HabitColor, HabitFrequency, HabitTrackingType, CheckIn } from '@/types/habit';

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

export default function CreateHabitScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const { createHabit, loading, habits, checkIns } = useHabitsStore();
  const { unlockMultipleAchievements, unlockedIds } = useAchievementsStore();
  const dialog = useDialog();
  const { showAd } = useInterstitialAd();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState<HabitColor>('yellow');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>({ type: 'daily' });
  const [trackingType, setTrackingType] = useState<HabitTrackingType>('boolean');
  const [unit, setUnit] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);

  const isPremium = user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial';

  const handleTemplateSelect = (template: any) => {
    setName(template.name);
    setDescription(template.description);
    setSelectedIcon(template.icon);
    setSelectedColor(template.color);
    setSelectedCategory(template.category);
    setFrequency(template.frequency);
    setTrackingType(template.trackingType || 'boolean');
    setUnit(template.unit || '');
    setTargetValue(template.targetValue ? String(template.targetValue) : '');
    setTemplateModalVisible(false);
  };

  const handleReminderTimeChange = (time: string | null) => {
    setReminderTime(time);
  };

  const handlePremiumLockPress = () => {
    dialog.alert('Premium Feature', 'Per-habit reminders are available with Premium. Set custom reminder times for each habit!', [
      { text: 'Maybe Later', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/paywall') },
    ]);
  };

  const handlePremiumFrequencyPress = () => {
    dialog.alert('Premium Feature', 'Advanced scheduling like "X times per week" and custom intervals are available with Premium!', [
      { text: 'Maybe Later', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/paywall') },
    ]);
  };

  const handlePremiumTrackingPress = () => {
    dialog.alert('Premium Feature', 'Duration tracking and goal targets are available with Premium!', [
      { text: 'Maybe Later', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/paywall') },
    ]);
  };

  const handleTrackingTypeChange = (type: HabitTrackingType) => {
    if (type === 'duration' && !isPremium) {
      handlePremiumTrackingPress();
      return;
    }
    setTrackingType(type);
    if (type === 'boolean') {
      setUnit('');
      setTargetValue('');
    } else if (type === 'duration') {
      setUnit('minutes');
    }
  };

  const checkForAchievements = async (updatedHabitsCount: number) => {
    if (!user) return;

    try {
      const allCheckIns: CheckIn[] = Object.values(checkIns).flat();
      const totalCompletions = allCheckIns.filter((c) => c.completed).length;
      const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
      const isPremiumUser = user.subscription?.plan === 'premium' || user.subscription?.plan === 'trial';

      const newAchievements = checkAchievements({
        habits,
        allCheckIns,
        totalHabits: updatedHabitsCount,
        totalCompletions,
        longestStreak,
        isPremium: isPremiumUser,
        unlockedAchievements: unlockedIds,
      });

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

      const parsedTarget = targetValue ? parseFloat(targetValue) : undefined;

      await createHabit(
        user.id,
        {
          name: name.trim(),
          description: description.trim(),
          icon: selectedIcon,
          color: selectedColor,
          category: selectedCategory,
          frequency,
          trackingType,
          unit: trackingType !== 'boolean' ? unit.trim() || undefined : undefined,
          targetValue: isPremium && parsedTarget && parsedTarget > 0 ? parsedTarget : undefined,
          reminderTime: isPremium ? reminderTime : null,
        },
        userPlan
      );

      await checkForAchievements(currentHabitCount + 1);

      // Show interstitial ad for free users (max 1 per session)
      // Wait for the ad to close before showing the success dialog
      const adShown = await showAd();

      if (adShown) {
        // Ad was shown and closed — just navigate back
        router.back();
      } else {
        dialog.alert('Success', 'Habit created successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to create habit');
    }
  };

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

  const trackingChipStyle = (isSelected: boolean): ViewStyle => ({
    paddingHorizontal: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
            New Habit
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          {/* Template Button */}
          <Button
            variant="secondary"
            onPress={() => setTemplateModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Start from Template
          </Button>

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

            {/* Frequency Selection */}
            <Text style={sectionTitleStyle}>Frequency</Text>
            <View style={{ marginBottom: 24 }}>
              <FrequencySelector
                value={frequency}
                onChange={setFrequency}
                isPremium={isPremium}
                onPremiumPress={handlePremiumFrequencyPress}
              />
            </View>

            {/* Tracking Type */}
            <Text style={sectionTitleStyle}>Tracking Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <TouchableOpacity
                style={trackingChipStyle(trackingType === 'boolean')}
                onPress={() => handleTrackingTypeChange('boolean')}
                activeOpacity={0.7}
              >
                <Text style={categoryTextStyle}>Yes/No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={trackingChipStyle(trackingType === 'quantity')}
                onPress={() => handleTrackingTypeChange('quantity')}
                activeOpacity={0.7}
              >
                <Text style={categoryTextStyle}>Quantity</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={trackingChipStyle(trackingType === 'duration')}
                onPress={() => handleTrackingTypeChange('duration')}
                activeOpacity={0.7}
              >
                <Text style={categoryTextStyle}>Duration</Text>
                {!isPremium && <PremiumLockBadge size="sm" variant="inline" />}
              </TouchableOpacity>
            </View>

            {/* Unit input for quantity */}
            {trackingType === 'quantity' && (
              <View style={{ marginBottom: 12 }}>
                <Input
                  label="Unit"
                  placeholder="e.g., glasses, pages, reps"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            )}

            {/* Target value (premium) */}
            {trackingType !== 'boolean' && (
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 13, color: colors.text }}>
                    Daily Target
                  </Text>
                  {!isPremium && <PremiumLockBadge size="sm" onPress={handlePremiumTrackingPress} />}
                </View>
                <Input
                  placeholder={trackingType === 'duration' ? 'e.g., 30 (minutes)' : `e.g., 8 (${unit || 'units'})`}
                  value={targetValue}
                  onChangeText={setTargetValue}
                  keyboardType="numeric"
                  editable={isPremium}
                />
              </View>
            )}

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

      {/* Template Picker Modal */}
      <TemplatePickerModal
        visible={templateModalVisible}
        isPremium={isPremium}
        onSelect={handleTemplateSelect}
        onPremiumPress={() => {
          setTemplateModalVisible(false);
          handlePremiumTrackingPress();
        }}
        onClose={() => setTemplateModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
