/**
 * Achievement Badge Component
 * Small inline badge to display achievement icon
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Achievement } from '@/types/achievement';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  unlocked,
}) => {
  const sizeValue = size === 'small' ? 32 : size === 'medium' ? 48 : 64;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;

  return (
    <View
      style={[
        styles.badge,
        {
          width: sizeValue,
          height: sizeValue,
          backgroundColor: unlocked ? achievement.color : '#E0E0E0',
          opacity: unlocked ? 1 : 0.5,
        },
      ]}
    >
      <Ionicons
        name={achievement.icon as any}
        size={iconSize}
        color={unlocked ? '#000000' : '#999999'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
});
