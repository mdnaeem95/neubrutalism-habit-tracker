/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Fokus Neubrutalism color palette
        'neu-primary': '#FF6B9D',
        'neu-secondary': '#4D96FF',
        'neu-accent': '#6BCB77',
        'neu-warning': '#FFD93D',
        'neu-background': '#FFF8E7',
        'neu-surface': '#FFFFFF',
        'neu-border': '#1A1A2E',
        'neu-text': '#1A1A2E',
        'neu-muted': '#6B7280',
        'neu-error': '#EF4444',
        'neu-orange': '#FF8C42',
      },
      fontFamily: {
        'mono': ['SpaceMono_400Regular', 'monospace'],
        'mono-bold': ['SpaceMono_700Bold', 'monospace'],
      },
      fontWeight: {
        'extrabold': '800',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(26, 26, 46, 1)',
        'brutal-lg': '6px 6px 0px 0px rgba(26, 26, 46, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(26, 26, 46, 1)',
      },
      borderWidth: {
        '1.5': '1.5px',
        '2.5': '2.5px',
        '3.5': '3.5px',
      },
      borderRadius: {
        'neu-sm': '8px',
        'neu-md': '12px',
        'neu-lg': '16px',
        'neu-xl': '20px',
      },
    },
  },
  plugins: [],
}
