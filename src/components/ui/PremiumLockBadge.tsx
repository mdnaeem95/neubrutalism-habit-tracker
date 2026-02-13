/**
 * PremiumLockBadge - Fokus Neubrutalism Premium Lock Badge
 * MaterialCommunityIcons lock, theme colors, SpaceMono font
 */

import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface PremiumLockBadgeProps {
  size?: 'sm' | 'md';
  onPress?: () => void;
  variant?: 'default' | 'inline';
}

export const PremiumLockBadge: React.FC<PremiumLockBadgeProps> = ({
  size = 'sm',
  onPress,
  variant = 'default',
}) => {
  const { colors } = useTheme();

  const isSmall = size === 'sm';
  const isInline = variant === 'inline';

  const badgeStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 4,
    gap: 4,
    ...(isSmall
      ? { paddingHorizontal: 6, paddingVertical: 2 }
      : { paddingHorizontal: 10, paddingVertical: 4 }),
    ...(isInline ? { marginLeft: 8 } : {}),
  };

  const textStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    color: colors.text,
    fontSize: isSmall ? 9 : 11,
  };

  const content = (
    <View style={badgeStyle}>
      <MaterialCommunityIcons
        name="lock"
        size={isSmall ? 10 : 12}
        color={colors.text}
      />
      <Text style={textStyle}>PRO</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
