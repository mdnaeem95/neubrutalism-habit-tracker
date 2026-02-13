import { forwardRef } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShareCard } from './ShareCard';
import type { Achievement } from '@/types/achievement';

interface AchievementShareCardProps {
  achievement: Achievement;
  showWatermark?: boolean;
  themeColor?: string;
}

const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return '#6BCB77';
    case 'rare':
      return '#4D96FF';
    case 'epic':
      return '#FF6B9D';
    case 'legendary':
      return '#FFD93D';
    default:
      return '#6BCB77';
  }
};

const getRarityLabel = (rarity: Achievement['rarity']): string => {
  return rarity.toUpperCase();
};

export const AchievementShareCard = forwardRef<View, AchievementShareCardProps>(
  ({ achievement, showWatermark = true, themeColor = '#FFD93D' }, ref) => {
    const rarityColor = getRarityColor(achievement.rarity);

    const titleStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 24,
      color: '#1A1A2E',
      textAlign: 'center',
      marginBottom: 20,
      letterSpacing: 2,
    };

    const iconContainerStyle: ViewStyle = {
      width: 100,
      height: 100,
      borderWidth: 3.5,
      borderColor: '#1A1A2E',
      borderRadius: 12,
      backgroundColor: themeColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
    };

    const nameStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 20,
      color: '#1A1A2E',
      textAlign: 'center',
      marginBottom: 8,
    };

    const descriptionStyle: TextStyle = {
      fontFamily: 'SpaceMono_400Regular',
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 16,
    };

    const rarityBadgeStyle: ViewStyle = {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 2.5,
      borderColor: '#1A1A2E',
      borderRadius: 9999,
      backgroundColor: rarityColor,
    };

    const rarityTextStyle: TextStyle = {
      fontFamily: 'SpaceMono_700Bold',
      fontSize: 12,
      color: '#1A1A2E',
      letterSpacing: 2,
    };

    return (
      <ShareCard ref={ref} showWatermark={showWatermark}>
        <Text style={titleStyle}>UNLOCKED!</Text>
        <View style={iconContainerStyle}>
          <MaterialCommunityIcons
            name={achievement.icon as any}
            size={48}
            color="#1A1A2E"
          />
        </View>
        <Text style={nameStyle}>{achievement.name}</Text>
        <Text style={descriptionStyle}>"{achievement.description}"</Text>
        <View style={rarityBadgeStyle}>
          <Text style={rarityTextStyle}>{getRarityLabel(achievement.rarity)}</Text>
        </View>
      </ShareCard>
    );
  }
);

AchievementShareCard.displayName = 'AchievementShareCard';
