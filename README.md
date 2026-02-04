# HabitBrutal - Neubrutalism Habit Tracker

A production-ready, full-scale habit tracker app with bold neubrutalism design, built with React Native and Expo.

## Features

- **Freemium + Subscription Model**: Free tier with 5 habits, premium for unlimited
- **Neubrutalism Design**: Bold borders, flat colors, sharp corners, chunky shadows
- **Cross-Platform**: iOS and Android support
- **Offline-First**: Local storage with cloud sync via Firebase
- **Modern Tech Stack**: Expo 54, React Native, TypeScript, NativeWind, Firebase

## Tech Stack

### Core
- Expo SDK 54+ (managed workflow)
- React Native 0.81
- TypeScript 5.9 (strict mode)

### State & Data
- Zustand (state management)
- TanStack Query v5 (server state)
- React Hook Form + Zod (forms)
- MMKV (fast local storage)

### Backend
- Firebase/Firestore (database)
- Firebase Auth (authentication)
- Firebase Cloud Functions
- Firebase Analytics

### UI/UX
- NativeWind 4+ (Tailwind CSS)
- React Native Reanimated 3+
- React Native Gesture Handler
- Custom neubrutalism design system

### Revenue
- RevenueCat (subscription management)
- Stripe (payment processing)

### Code Quality
- ESLint + Prettier
- Husky + lint-staged
- Jest + React Native Testing Library

## Getting Started

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
├── app/                    # Expo Router screens
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base UI components
│   │   ├── habits/        # Habit-specific components
│   │   └── stats/         # Statistics components
│   ├── features/          # Feature modules
│   ├── store/             # Zustand stores
│   ├── services/          # External services
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   └── types/             # TypeScript types
├── functions/             # Firebase Cloud Functions
├── assets/                # Static assets
└── __tests__/             # Test files
```

## Design System

### Neubrutalism Principles
- **Bold black borders** (2-4px)
- **Flat, vibrant colors** (no gradients)
- **Sharp corners** (no border radius)
- **Chunky shadows** (4-8px offset)
- **High contrast**
- **Bold typography** (700-900 weight)

### Color Palette
- Yellow: `#FFD700`
- Pink: `#FF69B4`
- Cyan: `#00FFFF`
- Lime: `#00FF00`
- Orange: `#FF6B35`
- Black: `#000000`
- White: `#FFFFFF`

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
