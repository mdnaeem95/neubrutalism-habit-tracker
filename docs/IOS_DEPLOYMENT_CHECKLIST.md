# iOS Deployment Checklist for Block

Last Updated: 2026-02-05
Status: Starting RevenueCat Setup

---

## Phase 1: Apple Developer Account & App Store Connect

### 1.1 Apple Developer Account
- [ ] Have active Apple Developer Program membership ($99/year)
- [ ] Access to [developer.apple.com](https://developer.apple.com)

### 1.2 Create App in App Store Connect
- [ ] Go to [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Navigate to "My Apps" → "+" → "New App"
- [ ] Fill in app details:
  - Platform: **iOS**
  - Name: **Block - Habit Tracker**
  - Primary Language: **English**
  - Bundle ID: **com.blockapp.habits** _(already configured in app.json)_
  - SKU: **block-habit-tracker**
- [ ] Save and note your **App Store Connect App ID** (numerical ID)

---

## Phase 2: In-App Purchase Setup

### 2.1 Create Subscription Group
- [ ] In App Store Connect, go to your app → "Monetization" → "Subscriptions"
- [ ] Click "+" to create **Auto-Renewable Subscription Group**
  - Reference Name: **Block Premium**
  - Group ID: **block_premium**

### 2.2 Create Monthly Subscription
- [ ] Click "+" in the subscription group to add a subscription
- [ ] Configure:
  - **Product ID**: `block_premium_monthly`
  - **Reference Name**: Block Premium Monthly
  - **Subscription Duration**: 1 month
  - **Price**: $4.99 USD
- [ ] Add **Free Trial**: 7 days
- [ ] Localized Information (at least English):
  - **Display Name**: Premium Monthly
  - **Description**: Unlimited habits, advanced stats, data export, custom themes, and priority support
- [ ] Add **App Store Promotion** (optional): Images and promotional text
- [ ] Submit for review (can submit before app)

### 2.3 Create Annual Subscription
- [ ] Click "+" in the subscription group to add another subscription
- [ ] Configure:
  - **Product ID**: `block_premium_annual`
  - **Reference Name**: Block Premium Annual
  - **Subscription Duration**: 1 year
  - **Price**: $29.99 USD (save 50%)
- [ ] Add **Free Trial**: 7 days
- [ ] Localized Information:
  - **Display Name**: Premium Yearly - Best Value!
  - **Description**: Unlimited habits, advanced stats, data export, custom themes, and priority support. Save 50% compared to monthly!
- [ ] Submit for review

### 2.4 Get App Store Connect API Key
- [ ] In App Store Connect, go to "Users and Access" → "Integrations" → "App Store Connect API"
- [ ] Click "+" to generate a new key
- [ ] Configure:
  - **Name**: RevenueCat
  - **Access**: Admin (or App Manager)
- [ ] Click "Generate"
- [ ] **Download the .p8 file** (you can only download once!)
- [ ] Note down:
  - **Key ID**: (e.g., `2X9R4HXF34`)
  - **Issuer ID**: (e.g., `57246542-96fe-1a63-e053-0824d011072a`)
- [ ] Store .p8 file securely (e.g., in 1Password, not in git)

---

## Phase 3: RevenueCat Setup

### 3.1 Create RevenueCat Account
- [ ] Go to [revenuecat.com](https://www.revenuecat.com)
- [ ] Sign up (free tier available)
- [ ] Create new project named **"Block"**
- [ ] Note your **Project ID**

### 3.2 Add iOS App to RevenueCat
- [ ] In RevenueCat dashboard, click "Projects" → Select "Block"
- [ ] Go to "Apps" → "Add App"
- [ ] Select **iOS / App Store**
- [ ] Enter details:
  - **App name**: Block
  - **Bundle ID**: `com.blockapp.habits`
- [ ] Upload **App Store Connect API Key**:
  - Upload the .p8 file you downloaded
  - Enter **Issuer ID**
  - Enter **Key ID**
- [ ] Click "Save"
- [ ] RevenueCat will validate the connection (may take a few minutes)

### 3.3 Create Entitlement in RevenueCat
- [ ] In RevenueCat, go to "Entitlements"
- [ ] Click "+ New"
- [ ] Enter identifier: **`premium`** _(must match code in app)_
- [ ] Save

### 3.4 Configure Products in RevenueCat
- [ ] Go to "Products"
- [ ] RevenueCat should auto-detect your subscriptions from App Store Connect
- [ ] If not, manually add:
  - [ ] `block_premium_monthly` (iOS)
  - [ ] `block_premium_annual` (iOS)
- [ ] Ensure products show "Active" status

### 3.5 Create Offerings
- [ ] Go to "Offerings"
- [ ] Create new offering:
  - **Identifier**: `default`
  - **Description**: Default subscription offerings
- [ ] Add packages to the offering:
  - [ ] **Monthly Package**:
    - Identifier: `monthly`
    - iOS Product: `block_premium_monthly`
  - [ ] **Annual Package**:
    - Identifier: `annual`
    - iOS Product: `block_premium_annual`
- [ ] Set as **Current Offering**
- [ ] Save

### 3.6 Get RevenueCat API Key
- [ ] In RevenueCat, go to "API Keys"
- [ ] Under "Public app-specific API keys", find **Apple App Store**
- [ ] Copy the key (starts with `appl_`)
- [ ] Store securely (will add to .env file next)

---

## Phase 4: Configure Local Environment

### 4.1 Create .env File
```bash
# In project root
touch .env
```

- [ ] Add RevenueCat keys to `.env`:
```env
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY=appl_xxxxxxxxxxxxxxxxx
```

- [ ] Verify `.env` is in `.gitignore` (should already be)
- [ ] Test the app locally to ensure RevenueCat initializes

### 4.2 Update EAS Configuration
- [ ] Open `eas.json`
- [ ] Update the `submit.production.ios` section:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```
  - **appleId**: Your Apple ID email
  - **ascAppId**: App Store Connect App ID (from Step 1.2)
  - **appleTeamId**: Found in App Store Connect → Membership

---

## Phase 5: Build & Deploy

### 5.1 Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

- [ ] Verify logged in: `eas whoami`

### 5.2 Configure EAS Project
```bash
eas build:configure
```

- [ ] Select iOS
- [ ] Follow prompts to link Expo project

### 5.3 Create iOS Build (Preview - Internal Testing)
```bash
eas build --platform ios --profile preview
```

- [ ] EAS will prompt for credentials (certificate, provisioning profile)
- [ ] Let EAS manage credentials automatically (recommended)
- [ ] Build will take 10-20 minutes
- [ ] Once complete, download the IPA or install via TestFlight link

### 5.4 Test Subscriptions with Sandbox
- [ ] In App Store Connect, go to "Users and Access" → "Sandbox Testers"
- [ ] Create 2-3 test Apple IDs:
  - Use format: `test1@yourpersonaldomain.com`
  - Create unique emails for each tester
- [ ] On test device:
  - Sign out of App Store completely
  - Install app via TestFlight
  - When prompted to purchase, sign in with sandbox tester account
  - Complete test purchase (won't be charged)
- [ ] Test scenarios:
  - [ ] Subscribe to monthly plan
  - [ ] Subscribe to annual plan
  - [ ] Cancel subscription
  - [ ] Restore purchases
  - [ ] Verify free trial works
  - [ ] Check that premium features unlock

### 5.5 Production Build
```bash
eas build --platform ios --profile production
```

- [ ] Build will be submitted to App Store Connect automatically (if configured)
- [ ] Or manually submit using: `eas submit --platform ios`

---

## Phase 6: App Store Submission

### 6.1 Prepare App Store Listing
- [ ] In App Store Connect, go to your app → "App Store" tab
- [ ] Fill in required information:
  - [ ] **Privacy Policy URL**: (host your privacy policy)
  - [ ] **Support URL**: (e.g., GitHub issues or support email)
  - [ ] **Marketing URL** (optional)
  - [ ] **App Description** (4000 chars max):
    - Describe Block's features
    - Mention neubrutalism design
    - Highlight free vs. premium features
  - [ ] **Keywords**: habit tracker, productivity, goals, streaks, routine
  - [ ] **Primary Category**: Productivity
  - [ ] **Secondary Category**: Health & Fitness

### 6.2 Upload Screenshots
- [ ] Required sizes:
  - 6.7" Display (iPhone 14 Pro Max): 1290 x 2796 px
  - 6.5" Display (iPhone 11 Pro Max): 1242 x 2688 px
  - 5.5" Display (iPhone 8 Plus): 1242 x 2208 px
- [ ] Use simulator or device to capture:
  - Today view with habits
  - Habit detail with calendar
  - Stats screen with charts
  - Habit creation screen
  - Paywall/premium screen
- [ ] Add text overlays highlighting features (optional but recommended)

### 6.3 App Review Information
- [ ] **Contact Information**: Your email and phone
- [ ] **Demo Account** (if login required):
  - Email: demo@blockapp.test
  - Password: DemoPass123
- [ ] **Notes**:
  - "To test premium features, please use a sandbox tester account"
  - "Subscriptions can be tested via TestFlight with sandbox accounts"

### 6.4 Submit for Review
- [ ] Verify all info is complete
- [ ] Click "Add for Review"
- [ ] Select version for review
- [ ] Submit
- [ ] Monitor status (typically 24-48 hours for first review)

---

## Phase 7: Post-Approval

### 7.1 Release Settings
- [ ] Choose release option:
  - **Automatic**: App goes live immediately after approval
  - **Manual**: You control when to release (recommended for first launch)

### 7.2 Monitor & Respond
- [ ] Watch for App Review feedback
- [ ] Check crash reports in App Store Connect
- [ ] Monitor Sentry for errors
- [ ] Respond to user reviews
- [ ] Track subscriptions in RevenueCat dashboard

---

## Quick Reference

### Important URLs
- App Store Connect: https://appstoreconnect.apple.com
- RevenueCat Dashboard: https://app.revenuecat.com
- Apple Developer Portal: https://developer.apple.com

### Bundle Identifier
- `com.blockapp.habits`

### Product IDs
- Monthly: `block_premium_monthly`
- Annual: `block_premium_annual`

### Support
- RevenueCat Docs: https://docs.revenuecat.com/
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

---

## Common Issues & Solutions

**Issue**: RevenueCat can't connect to App Store Connect
- Solution: Verify API key has correct permissions, wait 10-15 minutes for Apple's systems to sync

**Issue**: Build fails with "Bundle ID already taken"
- Solution: Verify bundle ID in app.json matches exactly in App Store Connect

**Issue**: Subscriptions not showing in app
- Solution: Ensure products are submitted (not necessarily approved) in App Store Connect, and RevenueCat offering is set as "Current"

**Issue**: Sandbox purchases not working
- Solution: Sign out of App Store completely before testing, use a new sandbox tester account that hasn't been used before
