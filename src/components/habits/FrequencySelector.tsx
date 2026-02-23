import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PremiumLockBadge } from '@components/ui/PremiumLockBadge';
import { useTheme } from '@/contexts/ThemeContext';
import type { HabitFrequency, FrequencyType } from '@/types/habit';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface FrequencySelectorProps {
  value: HabitFrequency;
  onChange: (frequency: HabitFrequency) => void;
  isPremium: boolean;
  onPremiumPress: () => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  value,
  onChange,
  isPremium,
  onPremiumPress,
}) => {
  const { colors } = useTheme();

  const frequencyOptions: { type: FrequencyType; label: string; premium: boolean }[] = [
    { type: 'daily', label: 'Daily', premium: false },
    { type: 'specific_days', label: 'Specific Days', premium: false },
    { type: 'times_per_week', label: 'X/Week', premium: true },
    { type: 'interval', label: 'Interval', premium: true },
  ];

  const handleTypeChange = (type: FrequencyType, isPremiumOption: boolean) => {
    if (isPremiumOption && !isPremium) {
      onPremiumPress();
      return;
    }

    switch (type) {
      case 'daily':
        onChange({ type: 'daily' });
        break;
      case 'specific_days':
        onChange({ type: 'specific_days', daysOfWeek: value.daysOfWeek || [1, 3, 5] });
        break;
      case 'times_per_week':
        onChange({ type: 'times_per_week', timesPerWeek: value.timesPerWeek || 3 });
        break;
      case 'interval':
        onChange({ type: 'interval', intervalDays: value.intervalDays || 2 });
        break;
    }
  };

  const toggleDay = (dayIndex: number) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex].sort();

    if (newDays.length === 0) return; // Must have at least 1 day
    onChange({ ...value, daysOfWeek: newDays });
  };

  const chipStyle = (isSelected: boolean): ViewStyle => ({
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

  const chipTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.text,
  };

  const dayButtonStyle = (isSelected: boolean): ViewStyle => ({
    width: 40,
    height: 40,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: isSelected ? colors.accent : colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const counterStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  };

  const counterButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const counterValueStyle: ViewStyle = {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.warning,
    minWidth: 60,
    alignItems: 'center',
  };

  return (
    <View>
      {/* Frequency type chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {frequencyOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={chipStyle(value.type === option.type)}
            onPress={() => handleTypeChange(option.type, option.premium)}
            activeOpacity={0.7}
          >
            <Text style={chipTextStyle}>{option.label}</Text>
            {option.premium && !isPremium && (
              <PremiumLockBadge size="sm" variant="inline" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Specific days picker */}
      {value.type === 'specific_days' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          {DAY_LABELS.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={dayButtonStyle(value.daysOfWeek?.includes(index) ?? false)}
              onPress={() => toggleDay(index)}
              activeOpacity={0.7}
            >
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 14, color: colors.text }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Times per week counter */}
      {value.type === 'times_per_week' && isPremium && (
        <View style={counterStyle}>
          <TouchableOpacity
            style={counterButtonStyle}
            onPress={() => {
              const current = value.timesPerWeek || 3;
              if (current > 1) onChange({ ...value, timesPerWeek: current - 1 });
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={counterValueStyle}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text }}>
              {value.timesPerWeek || 3}
            </Text>
          </View>

          <TouchableOpacity
            style={counterButtonStyle}
            onPress={() => {
              const current = value.timesPerWeek || 3;
              if (current < 7) onChange({ ...value, timesPerWeek: current + 1 });
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 14, color: colors.text }}>
            times/week
          </Text>
        </View>
      )}

      {/* Interval counter */}
      {value.type === 'interval' && isPremium && (
        <View style={counterStyle}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 14, color: colors.text }}>
            Every
          </Text>

          <TouchableOpacity
            style={counterButtonStyle}
            onPress={() => {
              const current = value.intervalDays || 2;
              if (current > 2) onChange({ ...value, intervalDays: current - 1 });
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={counterValueStyle}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text }}>
              {value.intervalDays || 2}
            </Text>
          </View>

          <TouchableOpacity
            style={counterButtonStyle}
            onPress={() => {
              const current = value.intervalDays || 2;
              if (current < 30) onChange({ ...value, intervalDays: current + 1 });
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 14, color: colors.text }}>
            days
          </Text>
        </View>
      )}
    </View>
  );
};
