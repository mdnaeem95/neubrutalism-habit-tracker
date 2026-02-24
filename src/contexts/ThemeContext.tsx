/**
 * Theme Context - Fokus Neubrutalism
 * Manages theme selection, dark mode, and color resolution
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { themes, ThemePreset, ThemeId } from '@constants/themes';
import { lightColors, darkColors, ColorScheme } from '@constants/colors';
import { useAuthStore } from '@store/useAuthStore';
import { useAchievementsStore } from '@store/useAchievementsStore';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@services/firebase/config';

interface ThemeContextValue {
  currentTheme: ThemePreset;
  setTheme: (themeId: string) => Promise<void>;
  availableThemes: ThemePreset[];
  canUseTheme: (themeId: string) => boolean;
  usedThemesCount: number;
  colors: ColorScheme;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { unlockAchievement, unlockedIds } = useAchievementsStore();
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(themes.default);
  const [usedThemes, setUsedThemes] = useState<string[]>([]);
  const systemScheme = useColorScheme();
  const colorScheme: 'light' | 'dark' = systemScheme === 'dark' ? 'dark' : 'light';

  // Resolve colors: base palette for current scheme
  const baseColors = colorScheme === 'dark' ? darkColors : lightColors;
  const colors: ColorScheme = {
    ...baseColors,
    // Override primary/secondary/accent from selected theme preset
    primary: colorScheme === 'dark'
      ? adjustForDark(currentTheme.primary)
      : currentTheme.primary,
    secondary: colorScheme === 'dark'
      ? adjustForDark(currentTheme.secondary)
      : currentTheme.secondary,
    accent: colorScheme === 'dark'
      ? adjustForDark(currentTheme.accent)
      : currentTheme.accent,
  };

  // Load user's saved theme and used themes on mount
  useEffect(() => {
    if (user?.preferences?.theme) {
      const savedTheme = themes[user.preferences.theme as ThemeId];
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
    if (user?.preferences?.usedThemes) {
      setUsedThemes(user.preferences.usedThemes);
    }
  }, [user]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canUseTheme = (themeId: string): boolean => {
    const theme = themes[themeId as ThemeId];
    if (!theme) return false;
    if (!theme.isPremium) return true;
    const userPlan = user?.subscription?.plan || 'free';
    return userPlan === 'premium' || userPlan === 'trial';
  };

  // Debounced Firestore persistence
  const persistTheme = useCallback((themeId: string, isNewTheme: boolean) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.id);
        const updateData: Record<string, any> = {
          'preferences.theme': themeId,
        };

        if (isNewTheme) {
          updateData['preferences.usedThemes'] = arrayUnion(themeId);
        }

        await updateDoc(userRef, updateData);

        const newUsedCount = isNewTheme ? usedThemes.length + 1 : usedThemes.length;
        if (newUsedCount >= 3 && !unlockedIds.includes('theme_master')) {
          await unlockAchievement(user.id, 'theme_master');
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }, 500);
  }, [user, usedThemes, unlockedIds, unlockAchievement]);

  const setTheme = async (themeId: string): Promise<void> => {
    const theme = themes[themeId as ThemeId];
    if (!theme) {
      throw new Error('Invalid theme ID');
    }

    if (!canUseTheme(themeId)) {
      throw new Error('This theme requires a premium subscription');
    }

    // Update UI immediately
    setCurrentTheme(theme);

    const isPremiumTheme = theme.isPremium;
    const isNewTheme = isPremiumTheme && !usedThemes.includes(themeId);

    if (isNewTheme) {
      setUsedThemes((prev) => [...prev, themeId]);
    }

    // Debounce the Firestore write
    persistTheme(themeId, isNewTheme);
  };

  const value: ThemeContextValue = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
    canUseTheme,
    usedThemesCount: usedThemes.length,
    colors,
    colorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Simple brightness adjustment for dark mode.
 * Lightens a color slightly so it remains visible on dark backgrounds.
 */
function adjustForDark(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Lighten by ~15%
  const lighten = (v: number) => Math.min(255, Math.round(v + (255 - v) * 0.15));

  const rr = lighten(r).toString(16).padStart(2, '0');
  const gg = lighten(g).toString(16).padStart(2, '0');
  const bb = lighten(b).toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
}
