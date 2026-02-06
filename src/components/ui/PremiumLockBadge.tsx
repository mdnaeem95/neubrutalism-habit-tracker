/**
 * PremiumLockBadge Component
 * Small badge showing premium lock status
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const isSmall = size === 'sm';
  const isInline = variant === 'inline';

  const content = (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        isInline && styles.badgeInline,
      ]}
    >
      <Ionicons
        name="lock-closed"
        size={isSmall ? 10 : 12}
        color="#000000"
      />
      <Text style={[styles.text, isSmall ? styles.textSmall : styles.textMedium]}>
        PRO
      </Text>
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

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#000000',
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeMedium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeInline: {
    marginLeft: 8,
  },
  text: {
    fontWeight: '800',
    color: '#000000',
  },
  textSmall: {
    fontSize: 9,
  },
  textMedium: {
    fontSize: 11,
  },
});
