/**
 * Fokus Neubrutalism Color Palette
 * Bold, vibrant colors with light/dark mode support
 */

export const lightColors = {
  primary: '#FF6B9D',    // Hot Pink
  secondary: '#4D96FF',  // Electric Blue
  accent: '#6BCB77',     // Lime Green
  warning: '#FFD93D',    // Bright Yellow
  background: '#FFF8E7', // Warm Cream
  surface: '#FFFFFF',
  border: '#1A1A2E',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  error: '#EF4444',
  success: '#6BCB77',
  info: '#4D96FF',
  orange: '#FF8C42',
  divider: 'rgba(26, 26, 46, 0.12)',
} as const;

export const darkColors = {
  primary: '#FF85B1',
  secondary: '#6DAAFF',
  accent: '#85D694',
  warning: '#FFE16A',
  background: '#1A1A2E',
  surface: '#2D2D44',
  border: '#4A4A6A',
  text: '#F0F0F0',
  textMuted: '#9CA3AF',
  error: '#F87171',
  success: '#85D694',
  info: '#6DAAFF',
  orange: '#FFA566',
  divider: 'rgba(74, 74, 106, 0.3)',
} as const;

export type ColorScheme = {
  [K in keyof typeof lightColors]: string;
};
export type ColorKey = keyof ColorScheme;

export const getColors = (scheme: 'light' | 'dark'): ColorScheme => {
  return scheme === 'dark' ? darkColors : lightColors;
};
