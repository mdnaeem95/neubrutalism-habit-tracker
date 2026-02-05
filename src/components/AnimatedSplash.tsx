import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Rect, Path, G } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedSplashProps {
  onAnimationComplete?: () => void;
}

export function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  // Animation values
  const squareScale = useSharedValue(0.8);
  const squareOpacity = useSharedValue(0);
  const checkmarkProgress = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // Sequence of animations
    // 1. Square fades in and scales up (400ms)
    squareOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    squareScale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
    });

    // 2. Checkmark draws in after square appears (delayed 200ms, draws over 600ms)
    checkmarkOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 100 })
    );

    checkmarkProgress.value = withDelay(
      200,
      withSequence(
        withTiming(1, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        }),
        // 3. Hold for 300ms, then call completion
        withTiming(1, {
          duration: 300,
        }, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        })
      )
    );

    // 3. Text fades in and slides up after checkmark (delayed 600ms)
    textOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    );

    textTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  // Animated props for the square
  const squareAnimatedProps = useAnimatedProps(() => ({
    opacity: squareOpacity.value,
    transform: [
      { translateX: 512 },
      { translateY: 512 },
      { scale: squareScale.value },
      { translateX: -512 },
      { translateY: -512 },
    ],
  }));

  // Animated props for the checkmark
  const checkmarkAnimatedProps = useAnimatedProps(() => ({
    opacity: checkmarkOpacity.value,
    strokeDashoffset: 900 * (1 - checkmarkProgress.value),
  }));

  // Animated style for the text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Svg width="300" height="300" viewBox="0 0 1024 1024">
        {/* Main Square with Border */}
        <AnimatedG animatedProps={squareAnimatedProps}>
          <Rect
            x="40"
            y="40"
            width="928"
            height="928"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth="60"
          />
        </AnimatedG>

        {/* Checkmark - draws in with stroke-dashoffset animation */}
        <G transform="rotate(7 525 512)">
          <AnimatedPath
            d="M 300 512 L 450 680 L 750 340"
            fill="none"
            stroke="#000000"
            strokeWidth="80"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="900"
            animatedProps={checkmarkAnimatedProps}
          />
        </G>
      </Svg>

      {/* App Name */}
      <AnimatedText style={[styles.appName, textAnimatedStyle]}>
        Block
      </AnimatedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 64,
    fontWeight: '900',
    color: '#000000',
    marginTop: 32,
    letterSpacing: -2,
  },
});
