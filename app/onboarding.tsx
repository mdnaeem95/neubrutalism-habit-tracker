import { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { setOnboardingCompleted } from '@utils/storage';

const SCREENS = [
  {
    icon: 'checkmark-circle' as const,
    title: 'Track Your Habits',
    description: 'Simple daily check-ins to build better routines',
    color: '#FFD700',
  },
  {
    icon: 'flame' as const,
    title: 'Build Streaks',
    description: 'Keep your momentum going with streak tracking',
    color: '#FF6B35',
  },
  {
    icon: 'bar-chart' as const,
    title: 'See Your Progress',
    description: 'Visual stats show how far you\'ve come',
    color: '#00FFFF',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < SCREENS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      progress.value = withSpring((currentIndex + 1) / SCREENS.length);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    // Mark onboarding as complete
    await setOnboardingCompleted();
    router.replace('/(tabs)');
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const currentScreen = SCREENS[currentIndex];

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
  };

  const headerStyle: ViewStyle = {
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const skipButtonStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  };

  const iconContainerStyle: ViewStyle = {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: currentScreen.color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const titleStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 40,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 48,
  };

  const descriptionStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 26,
  };

  const bottomStyle: ViewStyle = {
    paddingBottom: 48,
  };

  const progressBarContainerStyle: ViewStyle = {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    marginBottom: 32,
    overflow: 'hidden',
  };

  const progressBarStyle: ViewStyle = {
    height: '100%',
    backgroundColor: '#00FF00',
  };

  const buttonStyle: ViewStyle = {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const buttonTextStyle: TextStyle = {
    fontWeight: '900',
    fontSize: 18,
    color: '#000000',
  };

  const dotsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  };

  const dotStyle = (isActive: boolean): ViewStyle => ({
    width: 12,
    height: 12,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: isActive ? '#000000' : '#FFFFFF',
  });

  return (
    <View style={containerStyle}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={headerStyle}>
        <View style={{ width: 60 }} />
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={skipButtonStyle}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={contentStyle}>
        <View style={iconContainerStyle}>
          <Ionicons name={currentScreen.icon} size={100} color="#000000" />
        </View>

        <Text style={titleStyle}>{currentScreen.title}</Text>
        <Text style={descriptionStyle}>{currentScreen.description}</Text>
      </View>

      {/* Bottom */}
      <View style={bottomStyle}>
        {/* Progress Bar */}
        <View style={progressBarContainerStyle}>
          <Animated.View style={[progressBarStyle, progressStyle]} />
        </View>

        {/* Dots */}
        <View style={dotsContainerStyle}>
          {SCREENS.map((_, index) => (
            <View key={index} style={dotStyle(index === currentIndex)} />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={buttonStyle}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>
            {currentIndex === SCREENS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
