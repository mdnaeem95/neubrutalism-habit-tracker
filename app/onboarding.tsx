import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { setOnboardingCompleted } from '@utils/storage';
import { useTheme } from '@/contexts/ThemeContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue(0);

  const SCREENS = [
    {
      icon: 'check-circle' as const,
      title: 'Track Your Habits',
      description: 'Simple daily check-ins to build better routines',
      color: colors.warning,
    },
    {
      icon: 'fire' as const,
      title: 'Build Streaks',
      description: 'Keep your momentum going with streak tracking',
      color: colors.orange,
    },
    {
      icon: 'chart-bar' as const,
      title: 'See Your Progress',
      description: 'Visual stats show how far you\'ve come',
      color: colors.secondary,
    },
  ];

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
    await setOnboardingCompleted();
    router.replace('/(tabs)');
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const currentScreen = SCREENS[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={{ paddingTop: 60, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: 60 }} />
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
        <View
          style={{
            width: 200,
            height: 200,
            borderWidth: 3.5,
            borderColor: colors.border,
            borderRadius: 20,
            backgroundColor: currentScreen.color,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 48,
            shadowColor: colors.border,
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          }}
        >
          <MaterialCommunityIcons name={currentScreen.icon} size={100} color={colors.text} />
        </View>

        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, textAlign: 'center', marginBottom: 16, lineHeight: 36 }}>
          {currentScreen.title}
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, textAlign: 'center', maxWidth: 320, lineHeight: 24 }}>
          {currentScreen.description}
        </Text>
      </View>

      {/* Bottom */}
      <View style={{ paddingBottom: 48 }}>
        {/* Progress Bar */}
        <View
          style={{
            height: 8,
            backgroundColor: colors.surface,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 0,
            marginBottom: 32,
            overflow: 'hidden',
          }}
        >
          <Animated.View style={[{ height: '100%', backgroundColor: colors.accent }, progressStyle]} />
        </View>

        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          {SCREENS.map((_, index) => (
            <View
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                borderWidth: 2.5,
                borderColor: colors.border,
                backgroundColor: index === currentIndex ? colors.text : colors.surface,
              }}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderWidth: 3.5,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.warning,
            alignItems: 'center',
            shadowColor: colors.border,
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          }}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text }}>
            {currentIndex === SCREENS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
