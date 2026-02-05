import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
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
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFD700'; // yellow
      case 'secondary':
        return '#00FFFF'; // cyan
      case 'danger':
        return '#FF0000'; // red
      case 'success':
        return '#00FF00'; // lime
      default:
        return '#FFD700';
    }
  };

  const getPadding = () => {
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

  const getTextSize = () => {
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
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: getBackgroundColor(),
    ...getPadding(),
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    opacity: disabled || isLoading ? 0.5 : 1,
  };

  const textStyle: TextStyle = {
    fontWeight: '800',
    fontSize: getTextSize(),
    color: '#000000',
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
        <ActivityIndicator color={colors.black} size="small" />
      ) : (
        <Text style={textStyle}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
