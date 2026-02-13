import { forwardRef } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  ({ habitName, streakDays, showWatermark = true, themeColor = '#FF8C42' }, ref) => {
    const milestoneMessage = getMilestoneMessage(streakDays);

    const fireContainerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    };

    const streakNumberStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 72,
      color: '#1A1A2E',
      textAlign: 'center',
      lineHeight: 80,
    };

    const daysLabelStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 20,
      color: '#1A1A2E',
      textAlign: 'center',
      marginBottom: 8,
    };

    const habitNameStyle: TextStyle = {
      fontFamily: 'SpaceMono_400Regular',
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 20,
    };

    const milestoneBadgeStyle: ViewStyle = {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth: 3.5,
      borderColor: '#1A1A2E',
      borderRadius: 12,
      backgroundColor: themeColor,
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
    };

    const milestoneTextStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 18,
      color: '#1A1A2E',
      letterSpacing: 2,
    };

    return (
      <ShareCard ref={ref} showWatermark={showWatermark}>
        <View style={fireContainerStyle}>
          <MaterialCommunityIcons name="fire" size={40} color="#FF8C42" />
          <MaterialCommunityIcons name="fire" size={56} color="#FFD93D" />
          <MaterialCommunityIcons name="fire" size={40} color="#FF8C42" />
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
