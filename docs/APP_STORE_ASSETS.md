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
✅ Already created:
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

## 3. Recommended Screenshots

Create these 5 key screenshots (in order):

### Screenshot 1: Today View
**What to show:**
- Today tab with 3-4 habits
- At least 2 habits checked off (green checkmarks)
- Current date visible
- Clean, organized layout
- Streak counts visible

**Overlay Text:**
"Track habits with bold design"

### Screenshot 2: Habit Detail with Calendar
**What to show:**
- Habit detail screen
- Monthly calendar view filled with check-ins
- Stats cards (streaks, completion rate)
- Green squares showing completed days

**Overlay Text:**
"Build streaks that last"

### Screenshot 3: Stats Dashboard
**What to show:**
- Stats tab open
- Bar chart with daily activity
- Top performing habits section
- Colorful stat cards

**Overlay Text:**
"See your progress instantly"

### Screenshot 4: Create/Edit Habit
**What to show:**
- Habit creation form
- Icon grid with emoji options
- Color selection
- Category tags

**Overlay Text:**
"Customize your habits"

### Screenshot 5: Premium Features
**What to show:**
- Paywall screen with pricing
- List of premium features
- "BEST VALUE" badge visible
- Pricing cards

**Overlay Text:**
"Upgrade for unlimited habits"

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
Bold habit tracking

### Description (Short - 80 chars)
Build better habits with bold design and daily tracking.

### Description (Full)
```
Block helps you build better habits through simple daily tracking and streak building.

KEY FEATURES
• Track up to 5 habits for free
• Check in daily with one tap
• Build motivating streaks
• View progress with calendar
• Beautiful neubrutalism design
• Cloud sync across devices

PREMIUM FEATURES
• Unlimited habits
• Advanced statistics
• Data export (CSV, JSON)
• Custom themes
• Priority support

SIMPLE & EFFECTIVE
Block makes habit building simple. No complicated systems or gamification - just clean design and daily check-ins.

TRACK YOUR PROGRESS
See your streaks grow and visualize your progress with monthly calendars and detailed statistics.

PREMIUM SUBSCRIPTION
• Free: 5 habits
• Premium: Unlimited habits + advanced features
• 7-day free trial
• $4.99/month or $29.99/year

Block combines powerful habit tracking with bold neubrutalism design. Start building better habits today!
```

### Keywords (iOS - comma-separated)
```
habit tracker,daily habits,streak,routine,goals,productivity,habit builder,self improvement,personal growth,motivation
```

### What's New (Update Notes)
```
🎉 Block v1.0 is here!

NEW IN THIS VERSION:
• Track up to 5 habits for free
• Build and maintain streaks
• View monthly calendar
• See detailed statistics
• Export your data (Premium)
• Beautiful neubrutalism design

We'd love to hear your feedback!
```

---

## 9. Google Play Store Metadata

### Short Description (80 chars)
Bold habit tracking - Build better routines with simple daily check-ins.

### Full Description (4000 chars max)
```
📱 BLOCK - BOLD HABIT TRACKING

Build better habits with Block - the habit tracker that combines powerful features with bold, beautiful design.

✅ SIMPLE DAILY TRACKING
Check in on your habits with just one tap. Block makes it easy to stay consistent without complicated systems or overwhelming features.

🔥 BUILD MOTIVATING STREAKS
Watch your streaks grow as you complete habits day after day. Visualize your progress and stay motivated to keep going.

📊 DETAILED STATISTICS
See how you're doing with comprehensive stats:
• Current and longest streaks
• Completion rates
• Monthly calendar view
• Daily activity charts
• Category breakdowns

🎨 BEAUTIFUL DESIGN
Block features a unique neubrutalism design with:
• Bold colors and sharp edges
• High contrast for easy reading
• Clean, organized layouts
• Delightful animations

☁️ CLOUD SYNC
Your habits sync automatically across all your devices. Never lose your data.

🆓 FREE TIER
Start with up to 5 habits completely free. Perfect for getting started!

⭐ PREMIUM FEATURES
Upgrade for unlimited habits plus:
• Advanced statistics and insights
• Export your data (CSV, JSON)
• Custom themes and colors
• Habit notes and journaling
• Priority support

💰 PRICING
• Free: Track up to 5 habits
• Premium: $4.99/month or $29.99/year
• 7-day free trial included
• Cancel anytime

🎯 WHY BLOCK?
• No ads, ever
• Privacy-focused
• Fast and responsive
• Regular updates
• Excellent support

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

Good luck with your launch! 🚀
