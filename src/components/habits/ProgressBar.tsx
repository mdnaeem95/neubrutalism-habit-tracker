import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  fillColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  fillColor,
}) => {
  const { colors } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const containerStyle: ViewStyle = {
    height,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  };

  const fillStyle: ViewStyle = {
    height: '100%',
    width: `${clampedProgress * 100}%`,
    backgroundColor: fillColor || (clampedProgress >= 1 ? colors.accent : colors.warning),
    borderRadius: 2,
  };

  return (
    <View style={containerStyle}>
      <View style={fillStyle} />
    </View>
  );
};
