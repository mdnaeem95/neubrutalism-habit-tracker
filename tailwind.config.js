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
        // Neubrutalism color palette
        'neu-yellow': '#FFD700',
        'neu-pink': '#FF69B4',
        'neu-cyan': '#00FFFF',
        'neu-lime': '#00FF00',
        'neu-orange': '#FF6B35',
        'neu-black': '#000000',
        'neu-white': '#FFFFFF',
        'neu-gray': '#F5F5F5',
        'neu-success': '#00FF00',
        'neu-error': '#FF0000',
        'neu-warning': '#FF6B35',
      },
      fontFamily: {
        'space': ['SpaceGrotesk-Bold', 'sans-serif'],
        'mono': ['JetBrainsMono-Regular', 'monospace'],
      },
      fontWeight: {
        'black': '900',
        'extrabold': '800',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

