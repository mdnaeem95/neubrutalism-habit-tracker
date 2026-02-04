import React from 'react';
import { View, Text, ViewProps, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-neu-success';
      case 'error':
        return 'bg-neu-error';
      case 'warning':
        return 'bg-neu-warning';
      case 'info':
        return 'bg-neu-cyan';
      default:
        return 'bg-neu-yellow';
    }
  };

  const shadowStyle: ViewStyle = {
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  return (
    <View
      className={`
        border-2 border-neu-black rounded-none
        px-3 py-1
        ${getVariantClasses()}
      `}
      style={[shadowStyle, style]}
      {...props}
    >
      <Text className="font-extrabold text-xs text-neu-black">{children}</Text>
    </View>
  );
};
