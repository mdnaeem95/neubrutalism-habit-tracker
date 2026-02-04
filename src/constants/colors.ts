/**
 * Neubrutalism Color Palette
 * Bold, vibrant colors with high contrast
 */

export const colors = {
  // Primary colors
  yellow: '#FFD700',
  pink: '#FF69B4',
  cyan: '#00FFFF',
  lime: '#00FF00',
  orange: '#FF6B35',
  purple: '#9D4EDD',
  blue: '#4361EE',

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  gray: '#F5F5F5',

  // Backgrounds
  bg: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    accent: '#FFD700',
  },

  // Status colors
  success: '#00FF00',
  error: '#FF0000',
  warning: '#FF6B35',
  info: '#00FFFF',
} as const;

export type Color = keyof typeof colors;
