import React from 'react';
import { View, Text, ViewProps, ViewStyle, TextStyle } from 'react-native';
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
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return '#00FF00'; // lime
      case 'error':
        return '#FF0000'; // red
      case 'warning':
        return '#FF6B35'; // orange
      case 'info':
        return '#00FFFF'; // cyan
      default:
        return '#FFD700'; // yellow
    }
  };

  const badgeStyle: ViewStyle = {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: getBackgroundColor(),
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const textStyle: TextStyle = {
    fontWeight: '800',
    fontSize: 12,
    color: '#000000',
  };

  return (
    <View
      style={[badgeStyle, style]}
      {...props}
    >
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};
