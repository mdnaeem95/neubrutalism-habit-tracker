/**
 * Theme Settings Screen - Premium Feature
 * Allows users to select custom themes
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeSelector } from '@components/settings/ThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text }}>
          Themes
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Theme Selector */}
      <ThemeSelector />
    </View>
  );
}
