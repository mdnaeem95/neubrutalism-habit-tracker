# Free Tier Limits & Premium Features

## Free Tier Restrictions

The free tier is limited to **5 active habits** to encourage users to upgrade to Premium.

### How It Works

1. **Habit Count Check**: Before creating a new habit, the app checks the current number of active (non-archived) habits
2. **Enforcement**: If a free user has 5 or more active habits, they cannot create new ones
3. **Error Message**: Users see: "Free tier limit reached. Upgrade to Premium for unlimited habits!"
4. **Visual Indicators**: Profile screen shows warning when at limit with upgrade CTA

### Implementation Details

#### User Type Extension
```typescript
// src/types/auth.ts
export interface User {
  subscription?: {
    plan: 'free' | 'premium' | 'trial';
    expiresAt?: Date;
  };
}
```

#### Habit Store Enforcement
```typescript
// src/store/useHabitsStore.ts
createHabit: async (userId: string, input: CreateHabitInput, userPlan: 'free' | 'premium' | 'trial' = 'free') => {
  // Check free tier limit (5 habits)
  const activeHabits = get().habits.filter((h) => !h.archived);

  if (userPlan === 'free' && activeHabits.length >= 5) {
    throw new Error('Free tier limit reached. Upgrade to Premium for unlimited habits!');
  }

  // Proceed with creation...
}
```

#### User Flow
1. User tries to create 6th habit
2. Alert shows: "Free tier limit reached. Upgrade to Premium for unlimited habits!"
3. User can:
   - Delete/archive existing habits to make room
   - Upgrade to Premium via paywall screen
   - Continue using existing 5 habits

### Testing Free Tier Limits

1. Create 5 habits as a free user
2. Try to create a 6th habit
3. Verify error message appears
4. Check profile screen shows limit warning
5. Click "Upgrade Now" button to see paywall

### Premium Features (Current & Planned)

#### Included in Free Tier
- Up to 5 active habits
- Daily check-ins
- Basic streak tracking
- Basic statistics (7-day, 30-day views)
- Habit categories and colors
- Push notifications

#### Premium Only
- **Unlimited habits** (vs 5 free)
- Advanced statistics with charts
- Data export (CSV, JSON)
- Custom themes
- Habit notes & journaling
- Priority support
- Habit templates
- Habit groups/bundles

### Upgrade Flow

1. **Triggers**:
   - Hit 5 habit limit (automatic error)
   - Click "Upgrade Now" in profile
   - Access premium-only feature

2. **Paywall Screen** (`/paywall`):
   - Lists all premium features
   - Shows pricing (monthly/yearly)
   - 7-day free trial offer
   - "Maybe Later" option to continue with free tier

3. **Future Implementation**:
   - RevenueCat integration for subscription management
   - In-app purchases (iOS/Android)
   - Trial period handling
   - Subscription status sync

## Business Logic

### Why 5 Habits?

The 5-habit limit is designed to:
- Provide meaningful value to free users (5 habits is substantial)
- Create natural upgrade opportunity (power users need more)
- Balance free value with revenue generation
- Prevent abuse (unlimited free accounts)

### Conversion Funnel

1. **Awareness**: User creates 1-3 habits, sees value
2. **Engagement**: User builds streaks, gets invested
3. **Limitation**: User hits 5 habit limit, feels constrained
4. **Consideration**: Paywall shows premium value
5. **Trial**: 7-day free trial removes friction
6. **Conversion**: User becomes paying customer

### Free vs Premium User Psychology

**Free Users (5 habits)**:
- "I'm testing this app"
- "I only need a few core habits"
- "I'll upgrade if I stick with it"

**Premium Users (unlimited)**:
- "I'm serious about habit tracking"
- "I want to track everything"
- "The data export and insights are valuable"
- "I want to support the app"

## Technical Considerations

### Archived Habits

Archived habits **do not count** toward the 5-habit limit. This allows users to:
- Retire completed habits
- Seasonal habits (archived during off-season)
- Free up space for new habits without deleting history

### Trial Period

Users on trial period have `plan: 'trial'` which grants full premium access:
```typescript
if (userPlan === 'free' && activeHabits.length >= 5) {
  // Only block free users, not trial or premium
}
```

### Subscription Expiry

When premium subscription expires:
- User plan changes from `'premium'` to `'free'`
- Existing habits remain (no data loss)
- User can continue using up to 5 active habits
- Must archive or delete habits to create new ones
- All habit data preserved for re-subscription

## Future Enhancements

### Soft Limits
Instead of hard blocking at 5 habits, consider:
- Allow 6th habit with prominent upgrade prompt
- Grace period for recently expired subscriptions
- One-time "extend free tier" offer

### Smart Limits
- Different limits for different user segments
- Higher limits for referrals
- Temporary limit increases for promotions

### Upgrade Incentives
- Streak milestones unlock premium trial
- Achievement-based premium access
- Referral program for premium months

## Security

### Client-Side Enforcement
Current implementation enforces limit in:
- Habit store (before API call)
- UI (error alerts)

### Server-Side Enforcement (Future)
For production, also enforce in:
- Firebase Cloud Functions
- Firestore security rules
- Backend validation on habit creation

Example Firestore rule:
```javascript
match /habits/{habitId} {
  allow create: if
    request.auth != null &&
    (getUserPlan(request.auth.uid) == 'premium' ||
     getUserPlan(request.auth.uid) == 'trial' ||
     getActiveHabitCount(request.auth.uid) < 5);
}
```

## Analytics

Track free tier metrics:
- `habit_limit_reached` - User hits 5 habit limit
- `paywall_shown` - User sees upgrade screen
- `upgrade_from_limit` - User upgrades after hitting limit
- `free_tier_retention` - How long users stay on free tier

## Support & FAQ

### Common Questions

**Q: I hit the 5 habit limit. What can I do?**
A: You can archive or delete existing habits, or upgrade to Premium for unlimited habits.

**Q: Do archived habits count toward the limit?**
A: No, only active habits count. Archived habits are preserved but don't use your quota.

**Q: What happens if my subscription expires?**
A: You keep all your habits, but can only have 5 active at a time. Archive extras or renew subscription.

**Q: Can I get a free trial?**
A: Yes! Premium includes a 7-day free trial. Cancel anytime during the trial.

## Pricing Strategy

### Current Pricing (Placeholder)
- **Monthly**: $4.99/month
- **Yearly**: $29.99/year ($2.50/month, save 50%)
- **Trial**: 7 days free

### Competitive Analysis
Similar apps charge:
- Habitica: Free with $4.99/month premium
- Streaks: $4.99 one-time purchase
- Productive: $6.99/month or $39.99/year
- Way of Life: $4.99/month

### Value Proposition
Our app offers:
- Generous free tier (5 habits vs 3 for competitors)
- Unique neubrutalism design
- Real-time sync across devices
- Fair pricing ($29.99/year vs $40-60 for competitors)
