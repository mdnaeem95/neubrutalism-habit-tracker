/**
 * Custom Theme Presets - Premium Feature
 * Different color combinations for the Fokus neubrutalism aesthetic
 */

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
    name: 'Fokus Pink',
    description: 'The signature Fokus theme',
    primary: '#FF6B9D',
    secondary: '#4D96FF',
    accent: '#6BCB77',
    background: '#FFF8E7',
    isPremium: false,
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Vibes',
    description: 'Warm orange and pink tones',
    primary: '#FF8C42',
    secondary: '#FF6B9D',
    accent: '#FFD93D',
    background: '#FFF8E7',
    isPremium: true,
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool blue and green',
    primary: '#4D96FF',
    secondary: '#6BCB77',
    accent: '#85D694',
    background: '#FFF8E7',
    isPremium: true,
  },
  neon: {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Electric purple and green',
    primary: '#A855F7',
    secondary: '#6BCB77',
    accent: '#FF6B9D',
    background: '#FFF8E7',
    isPremium: true,
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Sleek black and white',
    primary: '#1A1A2E',
    secondary: '#6B7280',
    accent: '#F0F0F0',
    background: '#FFFFFF',
    isPremium: true,
  },
  candy: {
    id: 'candy',
    name: 'Candy Pop',
    description: 'Sweet pink and blue',
    primary: '#FF85B1',
    secondary: '#6DAAFF',
    accent: '#FFD93D',
    background: '#FFF8E7',
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
