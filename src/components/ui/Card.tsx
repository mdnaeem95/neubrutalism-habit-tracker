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
  const getVariantClasses = () => {
    switch (variant) {
      case 'yellow':
        return 'bg-neu-yellow';
      case 'pink':
        return 'bg-neu-pink';
      case 'cyan':
        return 'bg-neu-cyan';
      case 'lime':
        return 'bg-neu-lime';
      default:
        return 'bg-white';
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
    ${noPadding ? '' : 'p-4'}
  `;

  return (
    <View className={baseClasses} style={[shadowStyle, style]} {...props}>
      {children}
    </View>
  );
};
