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
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as defaultTheme } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
import { useAuthStore } from '@store/useAuthStore';
import { useRouter } from 'expo-router';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes, canUseTheme } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleThemeSelect = async (themeId: string) => {
    if (!canUseTheme(themeId)) {
      Alert.alert(
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
      Alert.alert('Error', error.message || 'Failed to change theme');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Choose Your Theme</Text>
        <Text style={styles.subtitle}>
          {user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial'
            ? 'Select any theme below'
            : 'Upgrade to Premium to unlock all themes'}
        </Text>
      </View>

      <View style={styles.themesGrid}>
        {availableThemes.map((themeItem) => {
          const isActive = currentTheme.id === themeItem.id;
          const isLocked = !canUseTheme(themeItem.id);
          const isLoading = loading === themeItem.id;

          return (
            <TouchableOpacity
              key={themeItem.id}
              style={[
                styles.themeCard,
                isActive && styles.themeCardActive,
                {
                  borderColor: defaultTheme.colors.black,
                  backgroundColor: isActive ? themeItem.primary : defaultTheme.colors.white,
                },
              ]}
              onPress={() => handleThemeSelect(themeItem.id)}
              disabled={isLoading}
            >
              {isLocked && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={16} color={defaultTheme.colors.black} />
                </View>
              )}

              {isActive && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark-circle" size={24} color={defaultTheme.colors.black} />
                </View>
              )}

              <View style={styles.colorPreview}>
                <View style={[styles.colorBox, { backgroundColor: themeItem.primary }]} />
                <View style={[styles.colorBox, { backgroundColor: themeItem.secondary }]} />
                <View style={[styles.colorBox, { backgroundColor: themeItem.accent }]} />
              </View>

              <Text style={[styles.themeName, isActive && { color: defaultTheme.colors.white }]}>
                {themeItem.name}
              </Text>
              <Text
                style={[styles.themeDescription, isActive && { color: defaultTheme.colors.white }]}
              >
                {themeItem.description}
              </Text>

              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color={defaultTheme.colors.black} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  themesGrid: {
    padding: 16,
    gap: 16,
  },
  themeCard: {
    borderWidth: 4,
    borderRadius: 0,
    padding: 20,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  themeCardActive: {
    shadowOffset: { width: 6, height: 6 },
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#000000',
  },
  themeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
