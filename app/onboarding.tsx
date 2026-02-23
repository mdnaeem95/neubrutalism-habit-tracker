import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { setOnboardingCompleted } from '@utils/storage';
import { useAuthStore } from '@store/useAuthStore';
import { useHabitsStore } from '@store/useHabitsStore';
import { useTheme } from '@/contexts/ThemeContext';
import { FREE_TEMPLATES } from '@/constants/habitTemplates';
import type { HabitTemplate } from '@/constants/habitTemplates';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const { createHabit } = useHabitsStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
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
    {
      icon: 'lightning-bolt' as const,
      title: 'Quick Start',
      description: 'Pick a few habits to get started right away',
      color: colors.accent,
      isTemplateScreen: true,
    },
  ];

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : prev.length < 3
          ? [...prev, templateId]
          : prev
    );
  };

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
    if (creating) return;
    setCreating(true);

    try {
      // Create selected template habits
      if (user && selectedTemplates.length > 0) {
        for (const templateId of selectedTemplates) {
          const template = FREE_TEMPLATES.find((t) => t.id === templateId);
          if (template) {
            try {
              await createHabit(
                user.id,
                {
                  name: template.name,
                  description: template.description,
                  icon: template.icon,
                  color: template.color,
                  category: template.category,
                  frequency: template.frequency,
                  trackingType: template.trackingType,
                  unit: template.unit,
                  targetValue: undefined,
                  reminderTime: null,
                },
                user.subscription?.plan || 'free'
              );
            } catch (error) {
              console.error('Failed to create template habit:', error);
            }
          }
        }
      }

      await setOnboardingCompleted();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      await setOnboardingCompleted();
      router.replace('/(tabs)');
    } finally {
      setCreating(false);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const currentScreen = SCREENS[currentIndex];

  const getColorValue = (color: string): string => {
    switch (color) {
      case 'yellow': return colors.warning;
      case 'pink': return colors.primary;
      case 'cyan': return colors.secondary;
      case 'lime': return colors.accent;
      case 'orange': return colors.orange;
      default: return colors.warning;
    }
  };

  const renderTemplateScreen = () => (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, textAlign: 'center', marginBottom: 8, lineHeight: 36 }}>
          Quick Start
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted, textAlign: 'center', maxWidth: 320, lineHeight: 24 }}>
          Pick up to 3 habits to start with
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {FREE_TEMPLATES.map((template: HabitTemplate) => {
          const isSelected = selectedTemplates.includes(template.id);

          return (
            <TouchableOpacity
              key={template.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderWidth: 2.5,
                borderColor: colors.border,
                borderRadius: 12,
                backgroundColor: isSelected ? getColorValue(template.color) : colors.surface,
                marginBottom: 10,
                shadowColor: colors.border,
                shadowOffset: { width: isSelected ? 3 : 2, height: isSelected ? 3 : 2 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 0,
              }}
              onPress={() => toggleTemplate(template.id)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderWidth: 2,
                  borderColor: colors.border,
                  borderRadius: 10,
                  backgroundColor: isSelected ? colors.surface : getColorValue(template.color),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <MaterialCommunityIcons name={template.icon as any} size={24} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.text }}>
                  {template.name}
                </Text>
                <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text }} numberOfLines={1}>
                  {template.description}
                </Text>
              </View>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderWidth: 2.5,
                  borderColor: colors.border,
                  borderRadius: 8,
                  backgroundColor: isSelected ? colors.accent : colors.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isSelected && (
                  <MaterialCommunityIcons name="check" size={18} color={colors.text} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderInfoScreen = () => (
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
  );

  const isTemplateScreen = currentScreen.isTemplateScreen;
  const isLastScreen = currentIndex === SCREENS.length - 1;

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
      {isTemplateScreen ? renderTemplateScreen() : renderInfoScreen()}

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
            opacity: creating ? 0.6 : 1,
          }}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={creating}
        >
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: colors.text }}>
            {creating
              ? 'Setting up...'
              : isLastScreen
                ? selectedTemplates.length > 0
                  ? `Start with ${selectedTemplates.length} habit${selectedTemplates.length > 1 ? 's' : ''}`
                  : 'Get Started'
                : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
