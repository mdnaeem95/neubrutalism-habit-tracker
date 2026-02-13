/**
 * NeuCard - Fokus Neubrutalism Card Component
 * Opaque backgrounds, bold borders, hard shadows
 */

import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface NeuCardProps extends ViewProps {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'warning';
  noPadding?: boolean;
  children: React.ReactNode;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  variant = 'default',
  noPadding = false,
  children,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'warning':
        return colors.warning;
      default:
        return colors.surface;
    }
  };

  const cardStyle: ViewStyle = {
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: getBackgroundColor(),
    padding: noPadding ? 0 : 16,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

/** @deprecated Use NeuCard instead */
export const Card = NeuCard;
