import { forwardRef, ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Watermark } from './Watermark';

interface ShareCardProps {
  children: ReactNode;
  backgroundColor?: string;
  showWatermark?: boolean;
  aspectRatio?: '1:1' | '9:16';
  style?: ViewStyle;
}

export const ShareCard = forwardRef<View, ShareCardProps>(
  (
    {
      children,
      backgroundColor = '#F5F5F5',
      showWatermark = true,
      aspectRatio = '1:1',
      style,
    },
    ref
  ) => {
    const cardWidth = 320;
    const cardHeight = aspectRatio === '1:1' ? 320 : 568; // 9:16 ratio

    const containerStyle: ViewStyle = {
      width: cardWidth,
      height: cardHeight,
      backgroundColor,
      borderWidth: 4,
      borderColor: '#000000',
      borderRadius: 0,
      shadowColor: '#000000',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
      overflow: 'hidden',
      ...style,
    };

    const contentStyle: ViewStyle = {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const watermarkContainerStyle: ViewStyle = {
      position: 'absolute',
      bottom: 16,
      alignSelf: 'center',
    };

    return (
      <View ref={ref} style={containerStyle} collapsable={false}>
        <View style={contentStyle}>{children}</View>
        {showWatermark && (
          <View style={watermarkContainerStyle}>
            <Watermark size="sm" />
          </View>
        )}
      </View>
    );
  }
);

ShareCard.displayName = 'ShareCard';
