import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface WatermarkProps {
  size?: 'sm' | 'md';
  color?: string;
}

export function Watermark({ size = 'md', color = '#FFD93D' }: WatermarkProps) {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: size === 'sm' ? 4 : 8,
    paddingHorizontal: size === 'sm' ? 8 : 12,
    borderWidth: 2.5,
    borderColor: '#1A1A2E',
    borderRadius: 9999,
    backgroundColor: color,
  };

  const textStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontSize: size === 'sm' ? 10 : 12,
    color: '#1A1A2E',
    letterSpacing: 1,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>MADE WITH BLOCK</Text>
    </View>
  );
}
