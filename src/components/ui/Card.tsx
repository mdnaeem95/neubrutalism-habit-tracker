import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';

interface CardProps extends ViewProps {
  variant?: 'default' | 'yellow' | 'pink' | 'cyan' | 'lime';
  noPadding?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  noPadding = false,
  children,
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'yellow':
        return '#FFD700';
      case 'pink':
        return '#FF69B4';
      case 'cyan':
        return '#00FFFF';
      case 'lime':
        return '#00FF00';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View
      style={[
        {
          borderWidth: 3,
          borderColor: '#000000',
          borderRadius: 0,
          backgroundColor: getBackgroundColor(),
          padding: noPadding ? 0 : 16,
          shadowColor: '#000000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
