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
      backgroundColor,
      showWatermark = true,
      aspectRatio = '1:1',
      style,
    },
    ref
  ) => {
    const cardWidth = 320;
    const cardHeight = aspectRatio === '1:1' ? 320 : 568; // 9:16 ratio

    // Default bg uses colors.background (#FFF8E7 light), but accept override
    const bgColor = backgroundColor || '#FFF8E7';

    const containerStyle: ViewStyle = {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: bgColor,
      borderWidth: 3.5,
      borderColor: '#1A1A2E',
      borderRadius: 16,
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
      overflow: 'hidden',
      ...style,
    };

    const contentStyle: ViewStyle = {
      flex: 1,
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: showWatermark ? 52 : 24,
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
