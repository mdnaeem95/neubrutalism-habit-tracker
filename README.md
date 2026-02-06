# Block - Bold Habit Tracking

A modern habit tracker with a bold neubrutalism design.

## About

Block helps you build better habits with:
- Daily check-ins
- Streak tracking
- Progress statistics
- Bold neubrutalism design
- Cloud sync across devices

## Tech Stack

- **React Native** + **Expo** (v54)
- **TypeScript** (strict mode)
- **Firebase** (Auth + Firestore)
- **Zustand** (state management)
- **NativeWind** (styling)
- **React Native Reanimated** (animations)

## Features

### Free Tier
- Up to 5 active habits
- Daily check-ins
- Streak tracking
- Basic statistics
- Cloud sync
- Push notifications

### Premium (Coming Soon)
- Unlimited habits
- Advanced statistics
- Data export
- Custom themes
- Priority support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Build for production
eas build --platform all --profile production
```

## Project Structure

```
block-habit-tracker/
├── app/                    # Expo Router (screens)
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── services/         # External services (Firebase, notifications)
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, icons
└── docs/                 # Documentation
```

## Documentation

- [Privacy Policy](./docs/PRIVACY_POLICY.md)
- [Terms of Service](./docs/TERMS_OF_SERVICE.md)
- [Sentry Setup](./docs/SENTRY_SETUP.md)
- [Firebase Analytics](./docs/FIREBASE_ANALYTICS_SETUP.md)
- [Notifications](./docs/NOTIFICATIONS_GUIDE.md)
- [EAS Build](./docs/EAS_BUILD_GUIDE.md)
- [App Icon Design](./docs/APP_ICON_DESIGN.md)

## License

All rights reserved.
