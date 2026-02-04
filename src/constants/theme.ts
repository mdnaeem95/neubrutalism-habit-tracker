import { colors } from './colors';

/**
 * Neubrutalism Theme Configuration
 * Core design principles: bold borders, flat colors, sharp corners, chunky shadows
 */

export const theme = {
  colors,

  // Border widths
  borders: {
    thin: 2,
    medium: 3,
    thick: 4,
    extraThick: 6,
  },

  // Border radius (minimal for neubrutalism)
  radius: {
    none: 0,
    small: 2,
    medium: 4,
  },

  // Shadows (offset style, no blur)
  shadows: {
    small: {
      shadowColor: colors.black,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
    medium: {
      shadowColor: colors.black,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
    large: {
      shadowColor: colors.black,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // Typography
  typography: {
    // Font families
    fonts: {
      primary: 'SpaceGrotesk-Bold',
      mono: 'JetBrainsMono-Regular',
      system: 'System',
    },

    // Font sizes
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 40,
      '6xl': 48,
    },

    // Font weights
    weights: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
      black: '900' as const,
    },

    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing scale (4px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
} as const;

export type Theme = typeof theme;
