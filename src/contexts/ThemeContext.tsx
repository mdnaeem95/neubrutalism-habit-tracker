/**
 * Theme Context - Premium Feature
 * Manages custom theme selection and application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, ThemePreset, ThemeId } from '@constants/themes';
import { useAuthStore } from '@store/useAuthStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase/config';

interface ThemeContextValue {
  currentTheme: ThemePreset;
  setTheme: (themeId: string) => Promise<void>;
  availableThemes: ThemePreset[];
  canUseTheme: (themeId: string) => boolean;
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
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(themes.default);

  // Load user's saved theme on mount
  useEffect(() => {
    if (user?.preferences?.theme) {
      const savedTheme = themes[user.preferences.theme as ThemeId];
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, [user]);

  const canUseTheme = (themeId: string): boolean => {
    const theme = themes[themeId as ThemeId];
    if (!theme) return false;

    // Free themes are always available
    if (!theme.isPremium) return true;

    // Premium themes require premium subscription
    const userPlan = user?.subscription?.plan || 'free';
    return userPlan === 'premium' || userPlan === 'trial';
  };

  const setTheme = async (themeId: string): Promise<void> => {
    const theme = themes[themeId as ThemeId];
    if (!theme) {
      throw new Error('Invalid theme ID');
    }

    // Check if user can use this theme
    if (!canUseTheme(themeId)) {
      throw new Error('This theme requires a premium subscription');
    }

    // Update local state
    setCurrentTheme(theme);

    // Save to Firestore if user is logged in
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          'preferences.theme': themeId,
        });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        // Don't throw - theme still works locally
      }
    }
  };

  const value: ThemeContextValue = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
    canUseTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
