/**
 * Theme Selector Component - Premium Feature
 * Allows users to choose custom themes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@store/useAuthStore';
import { useRouter } from 'expo-router';
import { useDialog } from '@/contexts/DialogContext';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes, canUseTheme, colors } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const dialog = useDialog();
  const [loading, setLoading] = useState<string | null>(null);

  const handleThemeSelect = async (themeId: string) => {
    if (!canUseTheme(themeId)) {
      dialog.alert(
        'Premium Feature',
        'Custom themes are available with Premium. Upgrade to unlock all themes!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => router.push('/paywall'),
          },
        ]
      );
      return;
    }

    try {
      setLoading(themeId);
      await setTheme(themeId);
    } catch (error: any) {
      dialog.alert('Error', error.message || 'Failed to change theme');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingBottom: 16 }}>
        <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text, marginBottom: 8 }}>
          Choose Your Theme
        </Text>
        <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted }}>
          {user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial'
            ? 'Select any theme below'
            : 'Upgrade to Premium to unlock all themes'}
        </Text>
      </View>

      <View style={{ padding: 16, gap: 16 }}>
        {availableThemes.map((themeItem) => {
          const isActive = currentTheme.id === themeItem.id;
          const isLocked = !canUseTheme(themeItem.id);
          const isLoading = loading === themeItem.id;

          return (
            <TouchableOpacity
              key={themeItem.id}
              style={{
                borderWidth: 3.5,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 20,
                position: 'relative',
                backgroundColor: isActive ? themeItem.primary : colors.surface,
                shadowColor: colors.border,
                shadowOffset: { width: isActive ? 6 : 4, height: isActive ? 6 : 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 0,
              }}
              onPress={() => handleThemeSelect(themeItem.id)}
              disabled={isLoading}
            >
              {isLocked && (
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: 9999,
                    backgroundColor: colors.warning,
                    borderWidth: 2.5,
                    borderColor: colors.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: colors.border,
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                  }}
                >
                  <MaterialCommunityIcons name="lock" size={16} color={colors.text} />
                </View>
              )}

              {isActive && (
                <View style={{ position: 'absolute', top: 12, right: 12 }}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.text} />
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <View style={{ width: 40, height: 40, borderWidth: 2.5, borderColor: colors.border, borderRadius: 8, backgroundColor: themeItem.primary }} />
                <View style={{ width: 40, height: 40, borderWidth: 2.5, borderColor: colors.border, borderRadius: 8, backgroundColor: themeItem.secondary }} />
                <View style={{ width: 40, height: 40, borderWidth: 2.5, borderColor: colors.border, borderRadius: 8, backgroundColor: themeItem.accent }} />
              </View>

              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 18, color: isActive ? '#FFFFFF' : colors.text, marginBottom: 4 }}>
                {themeItem.name}
              </Text>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: isActive ? '#FFFFFF' : colors.textMuted }}>
                {themeItem.description}
              </Text>

              {isLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator color={colors.text} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
