/**
 * Custom Theme Presets - Premium Feature
 * Different color combinations for the neubrutalism aesthetic
 */

import { colors } from './colors';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  isPremium: boolean;
}

export const themes: Record<string, ThemePreset> = {
  default: {
    id: 'default',
    name: 'Classic Yellow',
    description: 'The original Block theme',
    primary: colors.yellow,
    secondary: colors.pink,
    accent: colors.cyan,
    background: colors.gray,
    isPremium: false, // Free theme
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Vibes',
    description: 'Warm orange and pink',
    primary: colors.orange,
    secondary: colors.pink,
    accent: colors.yellow,
    background: colors.gray,
    isPremium: true,
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool cyan and blue',
    primary: colors.cyan,
    secondary: colors.blue,
    accent: colors.lime,
    background: colors.gray,
    isPremium: true,
  },
  neon: {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Electric purple and lime',
    primary: colors.purple,
    secondary: colors.lime,
    accent: colors.pink,
    background: colors.gray,
    isPremium: true,
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black and white',
    primary: colors.black,
    secondary: colors.gray,
    accent: colors.white,
    background: colors.white,
    isPremium: true,
  },
  candy: {
    id: 'candy',
    name: 'Candy Pop',
    description: 'Sweet pink and cyan',
    primary: colors.pink,
    secondary: colors.cyan,
    accent: colors.yellow,
    background: colors.gray,
    isPremium: true,
  },
} as const;

export type ThemeId = keyof typeof themes;

export const getTheme = (themeId: string): ThemePreset => {
  return themes[themeId as ThemeId] || themes.default;
};

export const getPremiumThemes = (): ThemePreset[] => {
  return Object.values(themes).filter((theme) => theme.isPremium);
};

export const getFreeThemes = (): ThemePreset[] => {
  return Object.values(themes).filter((theme) => !theme.isPremium);
};
