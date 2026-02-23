# App Store Assets Guide - Block

## Overview
This guide covers all visual assets needed for App Store (iOS) and Google Play Store (Android) submissions.

---

## 1. App Icon

### Requirements
- **iOS**: 1024x1024px PNG (no alpha channel, no transparency)
- **Android**: 512x512px PNG (can have transparency)

### Design Specs
- Yellow square (#FFD700) with 3px black border
- Black checkmark rotated 7° in center
- Hard shadow (4px offset, 100% black)
- No gradients or effects

### Files Needed
Already created:
- `assets/icon.png` (1024x1024)
- `assets/adaptive-icon.png` (1024x1024)

---

## 2. Screenshots

### iOS Sizes Required

You need screenshots for these device sizes:

**6.9" Display (iPhone 16 Pro Max, 15 Pro Max)**
- 1320 x 2868 pixels (portrait)
- 5-10 screenshots

**6.7" Display (iPhone 15 Plus, 14 Pro Max)**
- 1290 x 2796 pixels (portrait)
- 5-10 screenshots

**6.5" Display (iPhone 11 Pro Max, XS Max)**
- 1242 x 2688 pixels (portrait)
- 5-10 screenshots

**5.5" Display (iPhone 8 Plus, 7 Plus)**
- 1242 x 2208 pixels (portrait)
- 5-10 screenshots

**12.9" iPad Pro (6th gen)**
- 2048 x 2732 pixels (portrait)
- Optional but recommended

### Android Sizes Required

**Phone**
- Minimum: 1080 x 1920 pixels
- Maximum: 7680 pixels on any side
- 2-8 screenshots

**7" Tablet**
- 1200 x 1920 pixels
- Optional

**10" Tablet**
- 1536 x 2048 pixels
- Optional

---

## 3. Recommended Screenshots (v1.1.0)

Create these 6-8 key screenshots (in priority order):

### Screenshot 1: Today View with Mixed Habits
**What to show:**
- Today tab with 4-5 habits (mix of boolean + quantity)
- At least 2 checked off, 1 showing progress bar (e.g. "5/8 glasses")
- Completion counter in header (e.g. "3/5")
- Off-day habits dimmed at bottom
- Streak counts visible

**Overlay Text:**
"Your habits, your schedule"

### Screenshot 2: Flexible Frequency (Create Screen)
**What to show:**
- Habit creation form with FrequencySelector visible
- "Specific Days" selected with Mon/Wed/Fri toggled
- Day-of-week button row (S M T W T F S)
- Tracking type chips visible (Yes/No, Quantity, Duration)

**Overlay Text:**
"Set your own schedule"

### Screenshot 3: Quantity Tracking in Action
**What to show:**
- QuantityInputModal open over a habit card
- +/- counter with current value (e.g. "5 glasses")
- Target indicator visible
- Behind modal: habit card with progress bar

**Overlay Text:**
"Track more than yes or no"

### Screenshot 4: Template Picker
**What to show:**
- TemplatePickerModal open
- Category tabs across top (All, Health, Fitness...)
- Colorful template cards with icons
- Premium templates showing lock badges

**Overlay Text:**
"Start tracking in seconds"

### Screenshot 5: Habit Detail with Stats
**What to show:**
- Habit detail for a quantity habit
- Stats grid: streak, best, total, rate
- Total/Avg stats (e.g. "245 glasses", "7/day")
- Today's progress bar
- Last 7 days with values in boxes

**Overlay Text:**
"See every detail"

### Screenshot 6: Onboarding Quick Start
**What to show:**
- 4th onboarding screen with template cards
- 2 templates selected (green checkmarks)
- "Start with 2 habits" button at bottom

**Overlay Text:**
"Pick habits, start instantly"

### Screenshot 7: Streak & Calendar
**What to show:**
- Habit detail calendar with check-ins filled in
- Streak freeze indicator visible
- Current streak prominently displayed
- "Tap to share" streak card

**Overlay Text:**
"Build streaks that forgive"

### Screenshot 8: Premium Features
**What to show:**
- Paywall with updated feature list
- New features: scheduling, targets, freezes, templates
- "BEST VALUE" yearly plan badge
- Pricing cards

**Overlay Text:**
"Unlock the full experience"

---

## 4. Creating Screenshots

### Method 1: Direct from Expo Go (Quick)
1. Run app on device/simulator
2. Navigate to each screen
3. Use device screenshot (Power + Volume Up)
4. Transfer files to computer

### Method 2: Using iOS Simulator (Better quality)
```bash
# Start simulator
npx expo start --ios

# Navigate to desired screen in app

# Take screenshot (saves to Desktop)
# macOS: Cmd + S in Simulator window

# Screenshots saved to: ~/Desktop/
```

### Method 3: Using Android Emulator
```bash
# Start emulator
npx expo start --android

# Navigate to desired screen

# Take screenshot
# Android Studio > Camera icon in emulator toolbar

# Or use adb:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

### Method 4: Professional Tools (Best)
- **Figma/Sketch**: Design mockups with device frames
- **Placeit**: Generate device mockups
- **Screenshot Creator**: Online tool for app screenshots
- **Rotato**: 3D device mockup creator ($$$)

---

## 5. Screenshot Overlay Text

Add text overlays to make screenshots pop:

### Design Specs for Text Overlays
- Font: Inter or SF Pro (900 weight)
- Size: 48-64px
- Color: #000000 (black)
- Background: Semi-transparent colored banner
- Border: 3px black (neubrutalism style)

### Tools for Adding Text
- **Canva**: Easy online editor
- **Figma**: Professional design tool
- **Photoshop**: Industry standard
- **Sketch**: Mac-only design tool

---

## 6. App Preview Videos

### iOS App Preview Video

**Requirements:**
- Length: 15-30 seconds
- Orientation: Portrait
- Format: .mov or .mp4
- Codec: H.264 or HEVC
- Sizes needed:
  - 6.9": 886 x 1920 pixels
  - 6.7": 886 x 1920 pixels
  - 6.5": 886 x 1920 pixels
  - 5.5": 886 x 1920 pixels

**Content Suggestions:**
1. Splash screen animation (2s)
2. Swipe through Today tab checking habits (3s)
3. Navigate to habit detail, show calendar (3s)
4. View stats with charts (3s)
5. Quick create new habit flow (4s)
6. End on "Block" logo with tagline (2s)

### Android Feature Graphic & Promo Video

**Feature Graphic:**
- Size: 1024 x 500 pixels
- Format: PNG or JPEG
- Content: App logo + tagline + key features
- Used at top of Play Store listing

**Promo Video (YouTube):**
- Upload video to YouTube (unlisted)
- Paste YouTube URL in Play Console
- Same content as iOS preview

---

## 7. Recording App Preview Videos

### Method 1: iOS Simulator Screen Recording
```bash
# Start recording
xcrun simctl io booted recordVideo --codec=h264 --force output.mov

# Stop with Ctrl+C
# Output saved to current directory
```

### Method 2: QuickTime Screen Recording (Mac)
1. Open QuickTime Player
2. File → New Screen Recording
3. Select iOS Simulator window
4. Record your walkthrough
5. File → Export → 1080p

### Method 3: Android Emulator Recording
```bash
# Start recording (max 3 minutes)
adb shell screenrecord /sdcard/demo.mp4

# Stop with Ctrl+C

# Pull to computer
adb pull /sdcard/demo.mp4
```

### Method 4: Professional Tools
- **Screen Studio**: Beautiful screen recordings ($$$)
- **OBS Studio**: Free screen recording
- **Loom**: Quick screen recordings
- **Rotato**: 3D device mockup videos ($$$)

---

## 8. App Store Connect Metadata

### App Name
**Primary:** Block - Habit Tracker

**Subtitle (iOS):**
Bold habits, flexible streaks

### Description (Short - 80 chars)
Flexible habit tracking with bold design. Schedule, count, freeze streaks.

### Description (Full)
```
Block adapts to your life — not the other way around.

KEY FEATURES
• Flexible scheduling: daily, specific days, X/week, intervals
• Quantity & duration tracking with progress bars
• Streak freezes — miss a day without losing progress
• 20+ templates to start tracking in seconds
• Beautiful neubrutalism design
• Cloud sync across devices

FREE FEATURES
• Up to 5 habits
• Daily & specific-day scheduling
• Quantity tracking (counters)
• 1 streak freeze per week
• 6 starter templates

PREMIUM FEATURES
• Unlimited habits
• Advanced scheduling (X/week, intervals)
• Duration tracking & daily targets
• 3 streak freezes per week
• 20+ templates
• Habit notes & journaling
• Per-habit reminders
• Data export (CSV, JSON)
• Custom themes

PREMIUM SUBSCRIPTION
• Free: 5 habits with core features
• Premium: Everything unlimited
• 7-day free trial
• $4.99/month or $29.99/year

Block combines powerful habit tracking with bold neubrutalism design. Start building better habits today!
```

### Keywords (iOS - comma-separated)
```
habit tracker,streak,schedule,routine,goals,productivity,quantity,templates,self improvement,motivation
```

### What's New (Update Notes)
```
Block 1.1 — Your habits, your schedule.

NEW:
• Flexible scheduling: specific days, X/week, intervals
• Quantity & duration tracking with progress bars
• Streak freezes — miss a day, keep your streak
• 20+ habit templates to start fast
• Quick Start onboarding — pick templates and go
• Improved stats and habit detail screens

We'd love to hear your feedback!
```

---

## 9. Google Play Store Metadata

### Short Description (80 chars)
Bold habit tracking - Build better routines with simple daily check-ins.

### Full Description (4000 chars max)
```
BLOCK - BOLD HABIT TRACKING

Build better habits with Block - the habit tracker that combines powerful features with bold, beautiful design.

SIMPLE DAILY TRACKING
Check in on your habits with just one tap. Block makes it easy to stay consistent without complicated systems or overwhelming features.

BUILD MOTIVATING STREAKS
Watch your streaks grow as you complete habits day after day. Visualize your progress and stay motivated to keep going.

DETAILED STATISTICS
See how you're doing with comprehensive stats:
- Current and longest streaks
- Completion rates
- Monthly calendar view
- Daily activity charts
- Category breakdowns

BEAUTIFUL DESIGN
Block features a unique neubrutalism design with:
- Bold colors and sharp edges
- High contrast for easy reading
- Clean, organized layouts
- Delightful animations

CLOUD SYNC
Your habits sync automatically across all your devices. Never lose your data.

FREE TIER
Start with up to 5 habits completely free. Perfect for getting started!

PREMIUM FEATURES
Upgrade for unlimited habits plus:
- Advanced statistics and insights
- Export your data (CSV, JSON)
- Custom themes and colors
- Habit notes and journaling
- Priority support

PRICING
- Free: Track up to 5 habits
- Premium: $4.99/month or $29.99/year
- 7-day free trial included
- Cancel anytime

WHY BLOCK?
- No ads, ever
- Privacy-focused
- Fast and responsive
- Regular updates
- Excellent support

Download Block today and start building habits that stick!

---

Questions? Contact us at support@blockapp.co
Privacy Policy: blockapp.co/privacy
Terms of Service: blockapp.co/terms
```

### Category
**Primary:** Health & Fitness
**Secondary:** Productivity

---

## 10. Preparation Checklist

Before submitting to stores:

**Assets:**
- [ ] App icon (1024x1024)
- [ ] iOS screenshots (all sizes)
- [ ] Android screenshots (min 2, max 8)
- [ ] Feature graphic (Android, 1024x500)
- [ ] App preview video (iOS, optional)
- [ ] Promo video on YouTube (Android, optional)

**Metadata:**
- [ ] App name and subtitle
- [ ] Short description
- [ ] Full description
- [ ] Keywords (iOS)
- [ ] Category selection
- [ ] Content rating completed
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

**Legal:**
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance documented
- [ ] COPPA compliance (if applicable)

**Testing:**
- [ ] Test all flows on physical device
- [ ] Test subscriptions in sandbox
- [ ] Verify all links work
- [ ] Check all copy for typos

---

## 11. Tools & Resources

### Free Tools
- **Canva**: Screenshot text overlays
- **GIMP**: Photo editing (Photoshop alternative)
- **OBS Studio**: Screen recording
- **Figma** (free tier): UI design

### Paid Tools
- **Sketch**: UI design (Mac only, $99)
- **Rotato**: 3D mockups ($60)
- **Screen Studio**: Screen recording ($89)
- **App Store Screenshot Generator**: Batch creation

### Resources
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Google Play Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)
- [App Screenshot Best Practices](https://www.apptamin.com/blog/app-store-screenshots/)

---

## 12. Tips for Great Screenshots

1. **Use actual app content** - Don't use mockups or fake data
2. **Show key features first** - Most impactful screenshots in positions 1-3
3. **Add text overlays** - Help users understand what they're seeing
4. **Use device frames** - Makes screenshots look more professional
5. **Show premium features** - Help users understand upgrade value
6. **Localize if possible** - Screenshots in user's language convert better
7. **A/B test** - Try different screenshot orders to optimize conversions
8. **Update seasonally** - Refresh screenshots every 3-6 months

---

## Need Help?

If you need professional help creating assets:
- **Fiverr**: $50-200 for complete asset package
- **Upwork**: Hire designers for custom work
- **99designs**: Design contests for logos and graphics

Good luck with your launch!
