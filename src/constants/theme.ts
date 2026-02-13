/**
 * Fokus Neubrutalism Theme Configuration
 * Bold borders, flat offset shadows, rounded corners, monospace typography
 */

export const theme = {
  // Border widths
  borders: {
    thin: 1.5,
    medium: 2.5,
    thick: 3.5,
  },

  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  // Shadows (offset style, no blur)
  shadows: {
    small: {
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
    medium: {
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
    large: {
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // Typography
  typography: {
    fonts: {
      regular: 'SpaceMono_400Regular',
      bold: 'SpaceMono_700Bold',
    },

    sizes: {
      h1: 28,
      h2: 22,
      h3: 18,
      body: 15,
      caption: 12,
      xs: 10,
    },

    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },

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
