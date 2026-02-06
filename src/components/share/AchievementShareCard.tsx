import { forwardRef } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      return '#A0A0A0';
    case 'rare':
      return '#00BFFF';
    case 'epic':
      return '#9B59B6';
    case 'legendary':
      return '#FFD700';
    default:
      return '#A0A0A0';
  }
};

const getRarityLabel = (rarity: Achievement['rarity']): string => {
  return rarity.toUpperCase();
};

export const AchievementShareCard = forwardRef<View, AchievementShareCardProps>(
  ({ achievement, showWatermark = true, themeColor = '#FFD700' }, ref) => {
    const rarityColor = getRarityColor(achievement.rarity);

    const titleStyle: TextStyle = {
      fontWeight: '900',
      fontSize: 24,
      color: '#000000',
      textAlign: 'center',
      marginBottom: 20,
      letterSpacing: 2,
    };

    const iconContainerStyle: ViewStyle = {
      width: 100,
      height: 100,
      borderWidth: 4,
      borderColor: '#000000',
      borderRadius: 0,
      backgroundColor: themeColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
    };

    const nameStyle: TextStyle = {
      fontWeight: '800',
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
      marginBottom: 8,
    };

    const descriptionStyle: TextStyle = {
      fontWeight: '600',
      fontSize: 14,
      color: '#666666',
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 16,
    };

    const rarityBadgeStyle: ViewStyle = {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 3,
      borderColor: '#000000',
      backgroundColor: rarityColor,
    };

    const rarityTextStyle: TextStyle = {
      fontWeight: '900',
      fontSize: 12,
      color: '#000000',
      letterSpacing: 2,
    };

    return (
      <ShareCard ref={ref} showWatermark={showWatermark} backgroundColor="#F5F5F5">
        <Text style={titleStyle}>UNLOCKED!</Text>
        <View style={iconContainerStyle}>
          <Ionicons
            name={achievement.icon as keyof typeof Ionicons.glyphMap}
            size={48}
            color="#000000"
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
