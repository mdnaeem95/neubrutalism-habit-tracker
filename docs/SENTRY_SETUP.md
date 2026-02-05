# Sentry Setup Guide

## What is Sentry?
Sentry is an error tracking and performance monitoring tool that helps you identify and fix issues in production.

## Setup Steps

### 1. Create a Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account (includes 5,000 errors/month)
3. Click "Create Project"

### 2. Configure Your Project
1. Select **React Native** as the platform
2. Name your project: "neubrutalism-habit-tracker"
3. Click "Create Project"

### 3. Get Your DSN
1. After creating the project, Sentry will show you a **DSN** (Data Source Name)
2. It looks like: `https://xxxxx@o12345.ingest.sentry.io/67890`
3. Copy this DSN

### 4. Add DSN to Your App
1. Open `.env` file in your project root
2. Add your Sentry DSN:
   ```env
   EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@o12345.ingest.sentry.io/67890
   ```
3. Save the file
4. Restart your Expo dev server: `npm start`

### 5. Test Error Tracking
Add a test button to trigger an error:

```typescript
import { captureError } from '@services/sentry/config';

// In your component
<Button onPress={() => {
  try {
    throw new Error('Test error from habit tracker!');
  } catch (error) {
    captureError(error as Error, { test: true });
  }
}}>
  Test Sentry
</Button>
```

After clicking, check your Sentry dashboard - you should see the error appear within seconds!

## What's Already Configured

✅ **Automatic error tracking** - All unhandled errors are captured
✅ **User context** - Errors include user ID and email
✅ **Breadcrumbs** - Track user actions leading to errors
✅ **Performance monitoring** - Track app performance (20% sampling in production)
✅ **Development mode** - Errors logged to console but not sent in dev

## Error Tracking in the App

The following actions are automatically tracked:

### Auth Events
- Login attempts and success/failure
- Signup attempts and success/failure
- Password reset attempts
- User context automatically attached to all errors

### Habit Events (can be added)
- Habit creation
- Check-in toggles
- Streak calculations
- Data sync errors

## Sentry Dashboard Features

Once set up, you'll have access to:

1. **Issues** - All errors grouped by type
2. **Performance** - Transaction performance monitoring
3. **Releases** - Track errors by app version
4. **Alerts** - Get notified of critical errors
5. **User Feedback** - See which users are affected

## Best Practices

1. **Don't send PII** - Avoid sending passwords, tokens, or sensitive data
2. **Use breadcrumbs** - Track user actions to understand error context
3. **Set user context** - Already done automatically when user logs in
4. **Filter noise** - Use `beforeSend` to filter out irrelevant errors
5. **Monitor quotas** - Free tier has 5,000 errors/month

## Cost Management

Free tier includes:
- 5,000 errors/month
- 10,000 transactions/month
- 30-day error retention
- 1 team member

If you exceed limits, consider:
- Increasing `tracesSampleRate` to reduce transaction volume
- Filtering low-priority errors
- Upgrading to paid plan (~$26/month for more quota)

## Production Checklist

Before launching:
- [ ] Sentry DSN added to production environment variables
- [ ] Test error reporting in production build
- [ ] Set up email/Slack alerts for critical errors
- [ ] Configure release tracking
- [ ] Set up performance budgets
- [ ] Review and customize `beforeSend` filter

## Need Help?
- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Performance Monitoring](https://docs.sentry.io/platforms/react-native/performance/)
- [Error Filtering](https://docs.sentry.io/platforms/react-native/configuration/filtering/)
