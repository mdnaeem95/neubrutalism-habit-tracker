# Firebase Analytics Setup Guide

## What is Firebase Analytics?
Firebase Analytics is a free app measurement solution that provides insight into user behavior and app usage, helping you make data-driven decisions.

## Current Implementation

Analytics tracking has been integrated throughout the app to track:

### User Events
- **Signup & Login**: Track when users create accounts or sign in
- **Screen Views**: Automatically track which screens users visit
- **User Properties**: Set user ID for cross-session tracking

### Habit Events
- **Habit Created**: Track when users create new habits (with category and color)
- **Habit Check-in**: Track daily check-ins with current streak
- **Habit Deleted**: Track when habits are removed (with total completions)
- **Habit Archived**: Track when habits are archived
- **Streak Milestones**: Automatic tracking when users hit 7, 14, 30, 60, 90, 180, or 365 day streaks

### Future Events (Premium Features)
- **Paywall Shown**: Track when subscription screen is displayed
- **Purchase Attempt**: Track when users try to purchase
- **Purchase Success**: Track successful subscription purchases with revenue

## How It Works

### Development Mode
In development (`__DEV__ === true`):
- Events are logged to the console
- Events are NOT sent to Firebase Analytics
- No analytics quota is consumed
- Useful for debugging event tracking

Example console output:
```
[Analytics] habit_created { category: 'health', color: '#FFD700' }
[Analytics] screen_view { screen_name: 'Today' }
```

### Production Mode
In production builds:
- Events are sent to Firebase Analytics
- Real-time dashboard updates
- User behavior tracking
- Funnel analysis available

## What's Being Tracked

### Automatic Events
These events are tracked automatically by the app:

1. **Screen Views** (`screen_view`)
   - Tracked when: User navigates to a screen
   - Data: `screen_name` (Today, All Habits, Profile, etc.)

2. **User Authentication** (`login`, `sign_up`)
   - Tracked when: User logs in or signs up
   - Data: `method` (email, google, apple)

### User Action Events
These events track user interactions:

1. **Habit Creation** (`habit_created`)
   - Tracked when: User creates a new habit
   - Data: `category`, `color`

2. **Habit Check-in** (`habit_check_in`)
   - Tracked when: User marks a habit as complete
   - Data: `habit_id`, `current_streak`

3. **Habit Deletion** (`habit_deleted`)
   - Tracked when: User deletes a habit
   - Data: `habit_id`, `total_completions`

4. **Streak Milestones** (`streak_milestone`)
   - Tracked when: User reaches milestone streaks (7, 14, 30, 60, 90, 180, 365 days)
   - Data: `habit_id`, `streak_days`

## Firebase Analytics Dashboard

Once your app is live, you'll have access to:

### Real-time Data
- Active users right now
- Events happening in real-time
- Screen views and user flows

### Audience Insights
- Daily/Weekly/Monthly active users (DAU/WAU/MAU)
- User retention cohorts
- Demographics and interests

### Behavior Analysis
- Most visited screens
- User flow between screens
- Feature usage patterns

### Conversion Tracking
- Signup completion rate
- Habit creation rate
- Check-in frequency
- Premium conversion funnel (when implemented)

## Key Metrics to Monitor

### Engagement Metrics
- **DAU/MAU Ratio**: Measures daily engagement
- **Session Duration**: How long users spend in app
- **Sessions per User**: How often users return
- **Screen Views per Session**: Navigation patterns

### Habit Tracker Specific
- **Habits Created per User**: Average number of habits
- **Check-in Rate**: Daily completion percentage
- **Streak Milestones**: How many users reach long streaks
- **Retention by Streak**: Do longer streaks = better retention?

### Conversion Metrics (Future)
- **Free to Premium**: Conversion rate
- **Paywall View to Purchase**: Purchase funnel
- **Trial to Paid**: Trial conversion rate

## Testing Analytics

### In Expo Go (Development)
Firebase Analytics is primarily web-based in the current implementation, so it won't send real events in Expo Go. However, you'll see console logs:

```bash
npm start
# Then in your app:
[Analytics] screen_view { screen_name: 'Today' }
[Analytics] habit_created { category: 'health', color: '#FFD700' }
```

### In Production Build
To test analytics in a production build:

1. Build the app:
   ```bash
   eas build --platform ios --profile preview
   # or
   eas build --platform android --profile preview
   ```

2. Install on a physical device

3. Use the app normally

4. Check Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to Analytics → Dashboard
   - View DebugView for real-time events (enable with `adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME`)

## Privacy Considerations

### What We Track
- User actions (screen views, habit creation, check-ins)
- User ID (Firebase Auth UID)
- Device information (automatically collected by Firebase)
- App version and platform

### What We DON'T Track
- Personal information (names, emails are not sent to Analytics)
- Habit names or descriptions
- Check-in notes
- Sensitive user data

### GDPR Compliance
- Analytics data is automatically anonymized
- User IP addresses are anonymized
- Data retention can be configured (default: 14 months)
- Users can request data deletion through Firebase

## Cost & Quotas

### Free Tier (Current)
Firebase Analytics is **completely free** with:
- Unlimited events
- Unlimited users
- 500 distinct event types
- 25 user properties
- 14 months data retention

### No Hidden Costs
Unlike some analytics services:
- No per-event pricing
- No user-based pricing
- No data export fees
- No dashboard access fees

## Upgrading Analytics for React Native

The current implementation uses Firebase Web SDK, which works but is limited. For better native analytics:

### Option 1: React Native Firebase (Recommended for Production)
Install `@react-native-firebase/analytics`:

```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

Benefits:
- Native SDK (better performance)
- Automatic screen tracking
- Offline event queuing
- BigQuery export support

### Option 2: Expo Analytics (Coming Soon)
Expo is working on native analytics support in SDK 53+.

## Best Practices

### 1. Event Naming
- Use snake_case for event names (`habit_created`, not `habitCreated`)
- Keep names under 40 characters
- Be descriptive but concise

### 2. Event Parameters
- Use consistent parameter names across events
- Keep parameter names under 40 characters
- Use meaningful values (not just IDs)

### 3. Don't Over-Track
Avoid tracking:
- Too many custom events (stay under 500 distinct types)
- Events that fire every second (will hit quotas)
- Duplicate events (check if Firebase already tracks it)

### 4. Set User Properties
Track important user attributes:
- Premium vs Free tier
- Signup method
- Onboarding completion
- Preferred categories

Example:
```typescript
import { setAnalyticsUserProperties } from '@services/firebase/analytics';

setAnalyticsUserProperties({
  plan: 'premium',
  signup_method: 'email',
  preferred_category: 'health',
});
```

## Troubleshooting

### Events Not Showing Up
1. **Check development mode**: Events are only logged, not sent
2. **Wait 24 hours**: Analytics data can take up to 24 hours to appear
3. **Use DebugView**: Enable debug mode for real-time event viewing
4. **Check network**: Ensure device has internet connection

### DebugView Not Working
Enable debug mode:
```bash
# iOS
adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME

# Android
adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME
```

### Wrong Data Being Tracked
1. Check the `analytics.ts` file for event definitions
2. Verify parameter names and types
3. Clear app data and reinstall
4. Check for duplicate event tracking

## Next Steps

1. **Monitor Events**: Check console logs while using the app
2. **Production Build**: Create a production build to test real analytics
3. **Set Up Goals**: Define key metrics to track (DAU, retention, etc.)
4. **Create Funnels**: Track user flows (signup → create habit → first check-in)
5. **A/B Testing**: Use Firebase Remote Config with Analytics for experiments

## Resources

- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Firebase Console](https://console.firebase.google.com)
- [Analytics DebugView](https://firebase.google.com/docs/analytics/debugview)
- [BigQuery Export](https://firebase.google.com/docs/analytics/bigquery-export) (Blaze plan only)
- [Analytics Best Practices](https://firebase.google.com/docs/analytics/best-practices)
