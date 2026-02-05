import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HabitWithStats } from '@/types/habit';
import { Badge } from '@components/ui';

interface HabitCardProps {
  habit: HabitWithStats;
  onPress?: () => void;
  onCheckIn?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress, onCheckIn }) => {
  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow':
        return '#FFD700';
      case 'pink':
        return '#FF69B4';
      case 'cyan':
        return '#00FFFF';
      case 'lime':
        return '#00FF00';
      case 'orange':
        return '#FF6B35';
      default:
        return '#FFD700';
    }
  };

  const cardStyle: ViewStyle = {
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: getColorValue(habit.color),
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
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

  const iconStyle: TextStyle = {
    fontSize: 24,
    marginRight: 8,
  };

  const nameStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 18,
    color: '#000000',
    flex: 1,
  };

  const checkboxStyle: ViewStyle = {
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: habit.todayCheckedIn ? '#00FF00' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const checkmarkStyle: TextStyle = {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  };

  const descriptionStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 14,
    color: '#000000',
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
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
    marginRight: 4,
  };

  const statValueStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 14,
    color: '#000000',
  };

  const badgeContainerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 8,
  };

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
      {/* Header with title and checkbox */}
      <View style={headerStyle}>
        <View style={titleContainerStyle}>
          <Ionicons name={habit.icon as any} size={24} color="#000000" />
          <Text style={nameStyle} numberOfLines={1}>
            {habit.name}
          </Text>
        </View>
        <TouchableOpacity
          style={checkboxStyle}
          onPress={(e) => {
            e.stopPropagation();
            onCheckIn?.();
          }}
          activeOpacity={0.7}
        >
          {habit.todayCheckedIn && <Text style={checkmarkStyle}>✓</Text>}
        </TouchableOpacity>
      </View>

      {/* Description */}
      {habit.description && (
        <Text style={descriptionStyle} numberOfLines={2}>
          {habit.description}
        </Text>
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
        {habit.frequency.type !== 'daily' && (
          <Badge variant="info">
            {habit.frequency.type.charAt(0).toUpperCase() + habit.frequency.type.slice(1)}
          </Badge>
        )}
      </View>
    </TouchableOpacity>
  );
};
