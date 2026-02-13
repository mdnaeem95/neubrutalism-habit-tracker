/**
 * Achievement Badge Component
 * Small inline badge to display achievement icon
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { colors } = useTheme();
  const sizeValue = size === 'small' ? 32 : size === 'medium' ? 48 : 64;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;

  return (
    <View
      style={[
        styles.badge,
        {
          width: sizeValue,
          height: sizeValue,
          backgroundColor: unlocked ? achievement.color : colors.divider,
          borderColor: colors.border,
          shadowColor: colors.border,
          opacity: unlocked ? 1 : 0.5,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={achievement.icon as any}
        size={iconSize}
        color={unlocked ? colors.text : colors.textMuted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 2.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
});
