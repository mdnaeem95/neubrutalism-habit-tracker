import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface WatermarkProps {
  size?: 'sm' | 'md';
}

export function Watermark({ size = 'md' }: WatermarkProps) {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: size === 'sm' ? 4 : 8,
    paddingHorizontal: size === 'sm' ? 8 : 12,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFD700',
  };

  const textStyle: TextStyle = {
    fontWeight: '900',
    fontSize: size === 'sm' ? 10 : 12,
    color: '#000000',
    letterSpacing: 1,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>MADE WITH BLOCK</Text>
    </View>
  );
}
