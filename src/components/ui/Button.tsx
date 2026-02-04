import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { colors } from '@constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-neu-yellow';
      case 'secondary':
        return 'bg-neu-cyan';
      case 'danger':
        return 'bg-neu-error';
      case 'success':
        return 'bg-neu-lime';
      default:
        return 'bg-neu-yellow';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'md':
        return 'px-6 py-3';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const shadowStyle: ViewStyle = {
    shadowColor: colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const baseClasses = `
    border-3 border-neu-black rounded-none
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${disabled || isLoading ? 'opacity-50' : 'active:translate-y-1 active:translate-x-1'}
  `;

  return (
    <TouchableOpacity
      className={baseClasses}
      style={[shadowStyle, style]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.black} size="small" />
      ) : (
        <Text className={`font-extrabold text-neu-black text-center ${getTextSizeClasses()}`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
