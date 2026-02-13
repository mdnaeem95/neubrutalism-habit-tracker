/**
 * NeuChip - Fokus Neubrutalism Chip/Badge Component
 * Pill-shaped, bold border, small shadow, SpaceMono font
 */

import React from 'react';
import { View, Text, ViewProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface NeuChipProps extends ViewProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const NeuChip: React.FC<NeuChipProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.accent;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.secondary;
      default:
        return colors.warning;
    }
  };

  const chipStyle: ViewStyle = {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: getBackgroundColor(),
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 12,
    color: colors.text,
  };

  return (
    <View style={[chipStyle, style]} {...props}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

/** @deprecated Use NeuChip instead */
export const Badge = NeuChip;
