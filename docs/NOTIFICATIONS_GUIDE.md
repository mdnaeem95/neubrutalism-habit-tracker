# Push Notifications Guide

## Overview

The app uses Expo Notifications to provide:
- Daily habit reminders
- Streak milestone celebrations
- Custom notification scheduling per habit

## Implementation

### Services

**Location**: `src/services/notifications/index.ts`

**Core Functions**:
- `requestNotificationPermissions()` - Request user permission
- `scheduleDailyNotification()` - Schedule recurring daily notifications
- `scheduleHabitReminder()` - Schedule habit-specific reminders
- `scheduleStreakMilestone()` - Instant milestone notifications
- `cancelNotification()` - Cancel specific notification
- `cancelAllNotifications()` - Clear all scheduled notifications

### Hook

**Location**: `src/hooks/useNotifications.ts`

**Features**:
- Permission state management
- Notification received listener
- Notification response (tap) handling
- Auto badge clearing

### Permission Banner

**Component**: `NotificationPermissionBanner`

- Shows on Today tab if permission not granted
- Dismissible
- Pink neubrutalism styling
- Requests permission on "Enable" tap

## Quick Start

### Request Permissions

```typescript
import { requestNotificationPermissions } from '@services/notifications';

const granted = await requestNotificationPermissions();
if (granted) {
  // Schedule notifications
}
```

### Schedule Habit Reminder

```typescript
import { scheduleHabitReminder } from '@services/notifications';

const notificationId = await scheduleHabitReminder(
  'habit-123',
  'Morning Run',
  7,  // 7:00 AM
  0
);

// Save notificationId to cancel later
```

### Celebrate Milestone

```typescript
import { scheduleStreakMilestone } from '@services/notifications';

if (currentStreak === 7) {
  await scheduleStreakMilestone('Morning Run', 7);
}
```

## Testing

### Test Immediate Notification

```typescript
import { sendLocalNotification } from '@services/notifications';

await sendLocalNotification(
  'Test Notification',
  'This works!'
);
```

### Check Scheduled Notifications

```typescript
import { getAllScheduledNotifications } from '@services/notifications';

const scheduled = await getAllScheduledNotifications();
console.log(scheduled.length, 'notifications scheduled');
```

## Production Checklist

- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Verify permission flow
- [ ] Test notification cancellation
- [ ] Verify milestone notifications
- [ ] Test background notifications
- [ ] Check badge updates (iOS)

## Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [iOS Guidelines](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [Android Best Practices](https://developer.android.com/design/patterns/notifications)
