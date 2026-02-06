import { forwardRef } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShareCard } from './ShareCard';

interface StreakShareCardProps {
  habitName: string;
  streakDays: number;
  showWatermark?: boolean;
  themeColor?: string;
}

const getMilestoneMessage = (days: number): string => {
  if (days >= 365) return 'ONE YEAR!';
  if (days >= 180) return 'HALF YEAR!';
  if (days >= 90) return 'QUARTER!';
  if (days >= 60) return 'TWO MONTHS!';
  if (days >= 30) return 'ONE MONTH!';
  if (days >= 14) return 'TWO WEEKS!';
  if (days >= 7) return 'ONE WEEK!';
  return 'STREAK!';
};

export const StreakShareCard = forwardRef<View, StreakShareCardProps>(
  ({ habitName, streakDays, showWatermark = true, themeColor = '#FF6B35' }, ref) => {
    const milestoneMessage = getMilestoneMessage(streakDays);

    const fireContainerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    };

    const streakNumberStyle: TextStyle = {
      fontWeight: '900',
      fontSize: 72,
      color: '#000000',
      textAlign: 'center',
      lineHeight: 80,
    };

    const daysLabelStyle: TextStyle = {
      fontWeight: '800',
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
      marginBottom: 8,
    };

    const habitNameStyle: TextStyle = {
      fontWeight: '700',
      fontSize: 16,
      color: '#666666',
      textAlign: 'center',
      marginBottom: 20,
    };

    const milestoneBadgeStyle: ViewStyle = {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth: 4,
      borderColor: '#000000',
      backgroundColor: themeColor,
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
    };

    const milestoneTextStyle: TextStyle = {
      fontWeight: '900',
      fontSize: 18,
      color: '#000000',
      letterSpacing: 2,
    };

    return (
      <ShareCard ref={ref} showWatermark={showWatermark} backgroundColor="#F5F5F5">
        <View style={fireContainerStyle}>
          <Ionicons name="flame" size={40} color="#FF6B35" />
          <Ionicons name="flame" size={56} color="#FFD700" />
          <Ionicons name="flame" size={40} color="#FF6B35" />
        </View>
        <Text style={streakNumberStyle}>{streakDays}</Text>
        <Text style={daysLabelStyle}>DAY STREAK</Text>
        <Text style={habitNameStyle}>{habitName}</Text>
        <View style={milestoneBadgeStyle}>
          <Text style={milestoneTextStyle}>{milestoneMessage}</Text>
        </View>
      </ShareCard>
    );
  }
);

StreakShareCard.displayName = 'StreakShareCard';
