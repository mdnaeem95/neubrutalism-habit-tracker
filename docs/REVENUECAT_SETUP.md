# RevenueCat Setup Guide

## Overview
RevenueCat handles all subscription management, receipt validation, and cross-platform purchase tracking for Block.

## Prerequisites
- Apple Developer Account ($99/year)
- Google Play Console Account ($25 one-time)
- RevenueCat account (free tier available)

---

## 1. Create RevenueCat Account

1. Go to [revenuecat.com](https://www.revenuecat.com) and sign up
2. Create a new project called "Block"
3. Note your project ID

---

## 2. Configure iOS (App Store Connect)

### A. Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to "My Apps" → "+" → "New App"
3. Fill in details:
   - Platform: iOS
   - Name: Block - Habit Tracker
   - Primary Language: English
   - Bundle ID: `com.blockapp.habits`
   - SKU: `block-habit-tracker`

### B. Create In-App Purchases
1. In App Store Connect, go to your app → "In-App Purchases"
2. Click "+" to create new subscriptions
3. Create **Auto-Renewable Subscription Group**:
   - Reference Name: "Block Premium"
   - Group ID: `block_premium`

4. Create **Monthly Subscription**:
   - Product ID: `block_premium_monthly`
   - Reference Name: "Block Premium Monthly"
   - Subscription Duration: 1 month
   - Price: $4.99 USD
   - **Free Trial**: 7 days
   - Localized Information:
     - Display Name: "Premium Monthly"
     - Description: "Unlimited habits and premium features"

5. Create **Annual Subscription**:
   - Product ID: `block_premium_annual`
   - Reference Name: "Block Premium Annual"
   - Subscription Duration: 1 year
   - Price: $29.99 USD
   - **Free Trial**: 7 days
   - Localized Information:
     - Display Name: "Premium Yearly"
     - Description: "Unlimited habits and premium features - Best Value!"

### C. Get App Store Connect API Key
1. Go to "Users and Access" → "Keys" → "In-App Purchase"
2. Click "+" to generate a new key
3. Name: "RevenueCat"
4. Download the `.p8` file (save securely!)
5. Note: Issuer ID, Key ID, and download the key file

### D. Configure RevenueCat for iOS
1. In RevenueCat dashboard, go to your project
2. Click "Apps" → "Add App"
3. Select "iOS"
4. Enter Bundle ID: `com.blockapp.habits`
5. Upload App Store Connect API Key:
   - Upload the `.p8` file
   - Enter Issuer ID
   - Enter Key ID
6. Save

---

## 3. Configure Android (Google Play Console)

### A. Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in details:
   - App name: Block - Habit Tracker
   - Default language: English
   - App or game: App
   - Free or paid: Free

### B. Create In-App Products
1. In Google Play Console, go to "Monetize" → "Products" → "Subscriptions"
2. Click "Create subscription"

3. Create **Monthly Subscription**:
   - Product ID: `block_premium_monthly`
   - Name: Premium Monthly
   - Description: "Unlimited habits and premium features"
   - Billing period: Monthly
   - Price: $4.99 USD
   - **Free Trial**: 7 days
   - Grace period: 3 days

4. Create **Annual Subscription**:
   - Product ID: `block_premium_annual`
   - Name: Premium Yearly
   - Description: "Unlimited habits and premium features - Best Value!"
   - Billing period: Yearly
   - Price: $29.99 USD
   - **Free Trial**: 7 days
   - Grace period: 3 days

### C. Get Google Play Service Credentials
1. In Google Play Console, go to "Setup" → "API access"
2. Link to Google Cloud project (or create new one)
3. Create Service Account:
   - Go to Google Cloud Console
   - Navigate to "IAM & Admin" → "Service Accounts"
   - Create service account named "RevenueCat"
   - Grant role: "Monitoring Viewer" (or custom)
4. Create JSON key and download
5. In Google Play Console, grant access to the service account

### D. Configure RevenueCat for Android
1. In RevenueCat dashboard, go to your project
2. Click "Apps" → "Add App"
3. Select "Android"
4. Enter Package Name: `com.blockapp.habits`
5. Upload Google Play Service Account JSON file
6. Save

---

## 4. Configure Products in RevenueCat

### A. Create Entitlement
1. In RevenueCat, go to "Entitlements"
2. Click "New Entitlement"
3. Identifier: `premium`
4. Save

### B. Create Offerings
1. Go to "Offerings"
2. Create offering called "default"
3. Add packages:
   - **Monthly Package**:
     - Identifier: `monthly`
     - Attached Products:
       - iOS: `block_premium_monthly`
       - Android: `block_premium_monthly`
   - **Annual Package**:
     - Identifier: `annual`
     - Attached Products:
       - iOS: `block_premium_annual`
       - Android: `block_premium_annual`
4. Make "default" offering current

---

## 5. Get API Keys for App

1. In RevenueCat, go to "API Keys"
2. Copy the **Public API Keys**:
   - **iOS**: Copy the Apple App-specific public key
   - **Android**: Copy the Google Play App-specific public key

---

## 6. Configure Environment Variables

Create/update `.env` file in project root:

```env
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY=appl_xxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=goog_xxxxxxxxxxxxxx
```

**IMPORTANT**:
- Never commit `.env` to git
- Add `.env` to `.gitignore`
- Use different keys for development/staging/production

---

## 7. Update App Configuration

Update `app.json` with subscription info:

```json
{
  "expo": {
    "ios": {
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "permissions": [
        "com.android.vending.BILLING"
      ]
    }
  }
}
```

---

## 8. Testing Subscriptions

### iOS Testing (Sandbox)
1. In App Store Connect, go to "Users and Access" → "Sandbox Testers"
2. Create test Apple ID accounts
3. On your test device:
   - Sign out of App Store
   - Run the app
   - When prompted to sign in, use sandbox tester account
   - Complete purchase (won't be charged)
4. Test scenarios:
   - Subscribe to monthly
   - Subscribe to annual
   - Restore purchases
   - Cancel and re-subscribe
   - Free trial

### Android Testing (License Testing)
1. In Google Play Console, go to "Setup" → "License Testing"
2. Add test Google accounts
3. Create internal test track:
   - Upload APK/AAB via EAS Build
   - Add testers
   - Testers can install via Play Store link
4. Test purchases (won't be charged)

---

## 9. Initialize RevenueCat in App

The app is already configured! RevenueCat initializes automatically when:
1. User logs in (see `src/store/useAuthStore.ts`)
2. App starts (see `src/services/revenuecat/index.ts`)

To manually initialize during development:
```typescript
import { initializeRevenueCat } from '@services/revenuecat';

await initializeRevenueCat(userId);
```

---

## 10. Webhook Configuration (Optional but Recommended)

### Setup Firebase Cloud Function for RevenueCat Webhooks

1. In RevenueCat, go to "Integrations" → "Webhooks"
2. Add webhook URL: `https://your-firebase-project.cloudfunctions.net/revenuecatWebhook`
3. Enable events:
   - Initial Purchase
   - Renewal
   - Cancellation
   - Billing Issue
   - Transfer

Example Cloud Function (create in `functions/src/webhooks/revenuecat.ts`):
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';

export const revenuecatWebhook = onRequest(async (req, res) => {
  const event = req.body;

  // Verify webhook (check Authorization header)
  // Process event and update Firestore user subscription status

  const userId = event.app_user_id;
  const isPremium = event.type === 'INITIAL_PURCHASE' || event.type === 'RENEWAL';

  await getFirestore()
    .collection('users')
    .doc(userId)
    .update({
      'subscription.plan': isPremium ? 'premium' : 'free',
      'subscription.expiresAt': event.expiration_at_ms
        ? new Date(event.expiration_at_ms)
        : null,
    });

  res.sendStatus(200);
});
```

---

## 11. Production Checklist

Before launching:
- [ ] All in-app products approved in App Store Connect
- [ ] All subscriptions approved in Google Play Console
- [ ] RevenueCat configured with production API keys
- [ ] Webhook configured and tested
- [ ] Privacy policy mentions subscriptions
- [ ] Terms of service include cancellation policy
- [ ] App description mentions pricing clearly
- [ ] Screenshots show premium features
- [ ] Tested restore purchases
- [ ] Tested family sharing (if enabled)
- [ ] Verified pricing in all regions

---

## Support & Documentation

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [iOS Subscription Guide](https://developer.apple.com/in-app-purchase/)
- [Android Billing Guide](https://developer.android.com/google/play/billing)
- RevenueCat Support: support@revenuecat.com

---

## Troubleshooting

**"Failed to load offerings"**
- Check API keys are correct in `.env`
- Verify products are configured in RevenueCat
- Ensure products are submitted (not approved) in stores

**"Purchase failed"**
- Check bundle ID matches exactly
- Verify subscription is active in store
- For iOS: Use sandbox tester account
- For Android: Ensure app is uploaded to internal test track

**"Restore purchases found nothing"**
- User must have previous purchase on same Apple ID/Google account
- Receipt validation may take a few minutes
- Try force-quitting and reopening app
