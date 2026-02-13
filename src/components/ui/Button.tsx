/**
 * NeuButton - Fokus Neubrutalism Button Component
 * Bold borders, hard shadows, SpaceMono font
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface NeuButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
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
      case 'danger':
        return colors.error;
      case 'success':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  const getPadding = (): { paddingHorizontal: number; paddingVertical: number } => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 16, paddingVertical: 8 };
      case 'md':
        return { paddingHorizontal: 24, paddingVertical: 12 };
      case 'lg':
        return { paddingHorizontal: 32, paddingVertical: 16 };
      default:
        return { paddingHorizontal: 24, paddingVertical: 12 };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyle: ViewStyle = {
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: getBackgroundColor(),
    ...getPadding(),
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    opacity: disabled || isLoading ? 0.5 : 1,
  };

  const textStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: getTextSize(),
    color: colors.text,
    textAlign: 'center',
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

/** @deprecated Use NeuButton instead */
export const Button = NeuButton;
