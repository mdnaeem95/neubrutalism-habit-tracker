import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { HabitWithStats } from '@/types/habit';
import { Badge } from '@components/ui';
import { ProgressBar } from '@components/habits/ProgressBar';
import { useTheme } from '@/contexts/ThemeContext';
import { getFrequencyLabel } from '@utils/frequencyUtils';

interface HabitCardProps {
  habit: HabitWithStats;
  onPress?: () => void;
  onCheckIn?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress, onCheckIn }) => {
  const { colors } = useTheme();

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow':
        return colors.warning;
      case 'pink':
        return colors.primary;
      case 'cyan':
        return colors.secondary;
      case 'lime':
        return colors.accent;
      case 'orange':
        return colors.orange;
      default:
        return colors.warning;
    }
  };

  const trackingType = habit.trackingType || 'boolean';
  const hasValue = trackingType !== 'boolean' && habit.todayValue !== undefined && habit.todayValue > 0;
  const progress = habit.targetValue && habit.todayValue
    ? Math.min(habit.todayValue / habit.targetValue, 1)
    : 0;

  const formatValue = (value: number): string => {
    if (trackingType === 'duration') {
      const hours = Math.floor(value / 60);
      const mins = value % 60;
      if (hours > 0) return `${hours}h ${mins}m`;
      return `${mins}m`;
    }
    return `${value}`;
  };

  const cardStyle: ViewStyle = {
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: getColorValue(habit.color),
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  };

  const titleContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  };

  const nameStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 18,
    color: colors.text,
    flex: 1,
    marginLeft: 8,
  };

  const checkboxStyle: ViewStyle = {
    width: 32,
    height: 32,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: habit.todayCheckedIn ? colors.accent : colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const descriptionStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  };

  const statsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  };

  const statItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const statLabelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    color: colors.text,
    marginRight: 4,
  };

  const statValueStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 14,
    color: colors.text,
  };

  const badgeContainerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 8,
  };

  const frequencyLabel = getFrequencyLabel(habit.frequency);

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
      {/* Header with title and checkbox */}
      <View style={headerStyle}>
        <View style={titleContainerStyle}>
          <MaterialCommunityIcons name={habit.icon as any} size={24} color={colors.text} />
          <Text style={nameStyle} numberOfLines={1}>
            {habit.name}
          </Text>
        </View>
        {onCheckIn && (
          <TouchableOpacity
            style={checkboxStyle}
            onPress={(e) => {
              e.stopPropagation();
              onCheckIn?.();
            }}
            activeOpacity={0.7}
          >
            {habit.todayCheckedIn && (
              <MaterialCommunityIcons name="check" size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      {habit.description && (
        <Text style={descriptionStyle} numberOfLines={2}>
          {habit.description}
        </Text>
      )}

      {/* Quantity/Duration progress */}
      {trackingType !== 'boolean' && (
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 13, color: colors.text }}>
              {hasValue ? formatValue(habit.todayValue!) : '0'}
              {habit.targetValue ? ` / ${formatValue(habit.targetValue)}` : ''}
              {habit.unit && trackingType !== 'duration' ? ` ${habit.unit}` : ''}
            </Text>
          </View>
          {habit.targetValue && habit.targetValue > 0 && (
            <ProgressBar progress={progress} />
          )}
        </View>
      )}

      {/* Stats */}
      <View style={statsContainerStyle}>
        <View style={statItemStyle}>
          <Text style={statLabelStyle}>Streak:</Text>
          <Text style={statValueStyle}>{habit.currentStreak}</Text>
        </View>
        <View style={statItemStyle}>
          <Text style={statLabelStyle}>Total:</Text>
          <Text style={statValueStyle}>{habit.totalCompletions}</Text>
        </View>
        <View style={statItemStyle}>
          <Text style={statLabelStyle}>Rate:</Text>
          <Text style={statValueStyle}>{habit.completionRate}%</Text>
        </View>
      </View>

      {/* Badges */}
      <View style={badgeContainerStyle}>
        <Badge variant="default">
          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
        </Badge>
        {frequencyLabel !== 'Daily' && (
          <Badge variant="info">
            {frequencyLabel}
          </Badge>
        )}
        {trackingType !== 'boolean' && (
          <Badge variant="warning">
            {trackingType === 'duration' ? 'Duration' : 'Quantity'}
          </Badge>
        )}
      </View>
    </TouchableOpacity>
  );
};
