# EAS Build Configuration Guide

## Overview

EAS (Expo Application Services) Build is configured for building production-ready iOS and Android apps.

## Build Profiles

### Development Build
For internal testing with development client:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Features:
- Development client enabled
- Internal distribution only
- Fast iteration
- APK for Android (faster)

### Preview Build
For testing before production:
```bash
eas build --profile preview --platform all
```

Features:
- Internal distribution
- Production-like build
- APK for Android
- Preview channel for OTA updates
- No simulator builds (real devices only)

### Production Build
For App Store and Play Store submission:
```bash
eas build --profile production --platform all
```

Features:
- App Store / Play Store ready
- AAB for Android (required by Play Store)
- Production channel
- Optimized builds

## Prerequisites

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project
```bash
eas build:configure
```

## Environment Variables

Create `.env.production` for production builds:

```env
# Firebase Production
EXPO_PUBLIC_FIREBASE_API_KEY=your_production_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_production_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_production_measurement_id

# Sentry Production
EXPO_PUBLIC_SENTRY_DSN=your_production_sentry_dsn

# RevenueCat Production
EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY=your_production_apple_key
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=your_production_google_key
```

## iOS Setup

### Apple Developer Account
1. Sign up at [developer.apple.com](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Create App ID: `com.neubrutalism.habittracker`
4. Create provisioning profile

### App Store Connect
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app
3. Bundle ID: `com.neubrutalism.habittracker`
4. App Name: "Habit Tracker"
5. Primary Language: English
6. SKU: `neubrutalism-habit-tracker`

### Credentials
EAS handles certificates automatically:
```bash
eas credentials
```

Or manually:
```bash
eas build --platform ios --profile production
# Follow prompts for credentials
```

## Android Setup

### Google Play Console
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create application
3. Package name: `com.neubrutalism.habittracker`
4. App name: "Habit Tracker"
5. Upload 512x512 icon
6. Create store listing

### Signing Key
EAS generates automatically, or provide your own:
```bash
eas credentials
# Select Android > Production > Keystore
```

### Service Account (for automated submission)
1. In Google Play Console → Setup → API access
2. Create service account
3. Grant permissions
4. Download JSON key
5. Save as `google-play-service-account.json`

## Building

### First Build
```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview

# Both
eas build --platform all --profile preview
```

### Production Build
```bash
# After testing preview builds
eas build --platform all --profile production
```

### Build Status
```bash
eas build:list
eas build:view [BUILD_ID]
```

## App Store Submission

### iOS (Manual)
1. Build production:
   ```bash
   eas build --platform ios --profile production
   ```
2. Download IPA from EAS dashboard
3. Upload to App Store Connect using Transporter
4. Submit for review

### iOS (Automated)
```bash
eas submit --platform ios --profile production
```

Configure in eas.json:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

### Android (Manual)
1. Build production:
   ```bash
   eas build --platform android --profile production
   ```
2. Download AAB from EAS dashboard
3. Upload to Google Play Console
4. Create release (Internal → Production)
5. Submit for review

### Android (Automated)
```bash
eas submit --platform android --profile production
```

## OTA Updates

### Setup Channels
Channels are configured in `eas.json`:
- `preview` - For preview builds
- `production` - For production builds

### Publishing Updates
```bash
# Preview channel
eas update --channel preview --message "Fixed login bug"

# Production channel
eas update --channel production --message "Performance improvements"
```

### Update Strategy
- **Minor fixes**: Use EAS Update (instant OTA)
- **New features**: New build + store submission
- **Breaking changes**: New build + version bump

## Resource Classes

Configured in `eas.json`:
```json
"ios": {
  "resourceClass": "m-medium"
}
```

Options:
- `m-medium` - Default (recommended, included in free tier)
- `m-large` - Faster builds (paid)
- `m-xlarge` - Very fast (paid)

## Build Times

Typical build times:
- **iOS**: 15-20 minutes
- **Android**: 10-15 minutes
- **Concurrent**: 20-25 minutes

Optimization:
- Use cache (enabled by default)
- Minimize dependencies
- Use appropriate resource class

## Common Commands

```bash
# Login
eas login

# Build preview
eas build --platform all --profile preview

# Build production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all --profile production

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]

# Manage credentials
eas credentials

# Publish OTA update
eas update --channel production

# View project info
eas project:info

# Clear cache (if build fails)
eas build --platform all --profile preview --clear-cache
```

## Troubleshooting

### Build Fails
1. Check build logs in EAS dashboard
2. Verify environment variables
3. Clear cache: `--clear-cache`
4. Check dependencies versions
5. Review `app.json` and `eas.json`

### Credentials Issues
```bash
# Reset credentials
eas credentials

# Manual certificate upload
eas credentials --platform ios
```

### Submission Fails
- iOS: Check App Store Connect status
- Android: Verify service account permissions
- Check bundle ID / package name matches

## CI/CD Integration

### GitHub Actions Example
```yaml
name: EAS Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm install -g eas-cli
      - run: eas build --platform all --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Best Practices

1. **Test Preview First**: Always test preview builds before production
2. **Version Bumping**: Increment version in `app.json` for each release
3. **Release Notes**: Keep detailed changelogs
4. **Staged Rollouts**: Use Google Play's staged rollout (10% → 50% → 100%)
5. **Monitor Crashes**: Use Sentry to catch production issues
6. **OTA for Fixes**: Use EAS Update for quick fixes, new builds for features

## Cost Management

### Free Tier
- **Builds per month**: 30 (shared across iOS/Android)
- **Resource class**: m-medium included
- **Storage**: 5GB
- **OTA Updates**: Unlimited

### Paid Plans
If you exceed free tier:
- **Production**: $99/month (unlimited builds)
- **Enterprise**: Custom pricing

Tips to stay within free tier:
- Combine platforms: `--platform all` (counts as 2 builds)
- Use OTA updates for minor changes
- Test locally before building
- Build only when necessary

## Next Steps

1. **First Build**:
   ```bash
   eas build --platform all --profile preview
   ```

2. **Test on Device**: Download and install preview build

3. **Set Up App Store Accounts**: Apple Developer + Google Play

4. **Configure Submission**: Update `eas.json` with store credentials

5. **Production Build**: When ready for launch
   ```bash
   eas build --platform all --profile production
   ```

6. **Submit to Stores**:
   ```bash
   eas submit --platform all --profile production
   ```

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [EAS Update Docs](https://docs.expo.dev/eas-update/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
