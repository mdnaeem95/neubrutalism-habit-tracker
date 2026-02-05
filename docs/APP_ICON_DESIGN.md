# App Icon & Splash Screen Design Guide

## Neubrutalism Design Specifications

### Brand Identity
**App Name**: Neubrutalism Habit Tracker
**Design Style**: Neubrutalism (bold, geometric, high-contrast)
**Target Feeling**: Playful, energetic, confident, direct

## App Icon Design

### Core Concept
A **checkmark inside a square** with chunky shadow, representing habit completion.

### Detailed Specifications

#### Dimensions
- **iOS**: 1024x1024px (App Store)
- **Android**: 512x512px (Play Store)
- **Adaptive Icon** (Android): 108x108dp safe zone

#### Design Elements

**Background**:
- Color: `#FFD700` (Yellow - primary brand color)
- Style: Flat, solid fill
- No gradients, no textures

**Border**:
- Width: 60px (on 1024x1024 canvas)
- Color: `#000000` (Black)
- Style: Solid, sharp corners
- Position: Inset 40px from edges

**Checkmark Symbol**:
- Color: `#000000` (Black)
- Weight: 80px stroke width
- Style: Bold, geometric
- Position: Centered within bordered square
- Angle: Slightly rotated (5-10 degrees for energy)

**Shadow**:
- Offset: 16px right, 16px down
- Color: `#000000` (Black, 100% opacity)
- Style: Hard shadow (no blur)
- Position: Behind main square

### Color Variations

**Primary Icon** (Yellow):
- Background: `#FFD700`
- Border: `#000000`
- Checkmark: `#000000`
- Shadow: `#000000`

**Alternative Icons** (for testing):
1. **Pink**: Background `#FF69B4`
2. **Cyan**: Background `#00FFFF`
3. **Lime**: Background `#00FF00`
4. **Orange**: Background `#FF6B35`

### Design File Structure

```
assets/
├── icon.png                    # 1024x1024 (iOS App Store)
├── icon-android.png            # 512x512 (Android Play Store)
├── adaptive-icon.png           # 1024x1024 (Android foreground)
├── adaptive-icon-bg.png        # 1024x1024 (Android background)
├── favicon.png                 # 48x48 (Web)
└── splash-icon.png             # 1284x2778 (Full screen splash)
```

### Design Tools

**Option 1: Figma** (Recommended)
1. Create 1024x1024 artboard
2. Draw rectangle with border
3. Add checkmark path
4. Duplicate for shadow layer
5. Export as PNG @1x, @2x, @3x

**Option 2: Canva**
1. Use 1024x1024 custom size
2. Add square element
3. Add thick black border
4. Add checkmark element
5. Download as PNG

**Option 3: Adobe Illustrator/Photoshop**
1. New document 1024x1024px at 72dpi
2. Use shape tools for square
3. Use pen tool for checkmark
4. Apply layer styles for border
5. Export for iOS and Android

### SVG Template (for developers)

```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <rect x="56" y="56" width="928" height="928" fill="#000000"/>

  <!-- Main Square -->
  <rect x="40" y="40" width="928" height="928" fill="#FFD700" stroke="#000000" stroke-width="60"/>

  <!-- Checkmark -->
  <path d="M 300 512 L 450 680 L 750 340"
        fill="none"
        stroke="#000000"
        stroke-width="80"
        stroke-linecap="round"
        stroke-linejoin="round"/>
</svg>
```

## Splash Screen Design

### Concept
**Centered logo** on solid background with app name below.

### Specifications

#### Dimensions
- **Universal**: 1284x2778px (iPhone 14 Pro Max)
- **Aspect Ratio**: 9:19.5
- **Safe Area**: Center 1024x1024px

#### Design Elements

**Background**:
- Color: `#F5F5F5` (Light gray - app background)
- Style: Solid, flat

**Logo**:
- Same as app icon design
- Size: 400x400px
- Position: Center of screen
- Animation potential: Slide up + fade in

**App Name**:
- Text: "Habit Tracker"
- Font: System Bold (900 weight)
- Size: 48px
- Color: `#000000`
- Position: 40px below logo
- Alignment: Center

**Tagline** (optional):
- Text: "Build Better Habits"
- Font: System Semi-Bold (600 weight)
- Size: 20px
- Color: `#666666`
- Position: Below app name
- Alignment: Center

### Splash Screen Configuration

Update `app.json`:
```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#F5F5F5"
}
```

## Android Adaptive Icon

### Concept
Android uses **adaptive icons** with separate foreground and background layers.

### Foreground Layer (`adaptive-icon.png`)
- Size: 1024x1024px
- Safe Zone: Center 672x672px (66% of size)
- Content: Checkmark symbol only (transparent background)
- Color: `#000000`

### Background Layer
- Color: `#FFD700` (solid yellow)
- Or use `adaptive-icon-bg.png` with same color

### Safe Zone Guidelines
- **Full canvas**: 1024x1024px (108dp)
- **Safe zone**: 672x672px (66dp)
- **Masked shapes**: Circle, square, squircle, rounded square

Content must stay within safe zone to avoid clipping.

## Asset Generation

### Using EAS

Install expo-asset and generate all sizes:
```bash
npx expo install expo-asset
npx expo export --platform all
```

### Using Online Tools

**Icons:**
- [App Icon Generator](https://www.appicon.co/) - Upload 1024x1024, get all sizes
- [Figma Icon Plugin](https://www.figma.com/community/plugin/966779987205952607)
- [Icon Kitchen](https://icon.kitchen/) - Android adaptive icons

**Splash Screens:**
- [Expo Splash Screen](https://docs.expo.dev/develop/user-interface/splash-screen/)
- Use built-in expo-splash-screen

### Manual Generation (All Sizes)

#### iOS Sizes
- 20x20 (@1x, @2x, @3x)
- 29x29 (@1x, @2x, @3x)
- 40x40 (@1x, @2x, @3x)
- 60x60 (@2x, @3x)
- 76x76 (@1x, @2x)
- 83.5x83.5 (@2x)
- 1024x1024 (App Store)

#### Android Sizes
- 48x48 (mdpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)
- 512x512 (Play Store)

**Note**: EAS Build handles this automatically!

## Brand Guidelines

### Do's ✅
- Use bold, thick borders (minimum 3px)
- Keep sharp, 90-degree corners
- Use flat, vibrant colors from palette
- Maintain high contrast (black on yellow)
- Keep design simple and geometric
- Use hard shadows (no blur)

### Don'ts ❌
- No gradients or color blends
- No rounded corners or curves
- No subtle shadows or glows
- No textures or patterns
- No complex illustrations
- No thin lines (minimum 3px)

## Testing App Icons

### Visual Testing
1. **Small Size**: Test at 60x60px (home screen size)
2. **Multiple Backgrounds**: White, black, dark mode
3. **Among Other Apps**: Screenshot with popular apps
4. **Different Devices**: iOS and Android
5. **App Store Preview**: Search results, featured

### Technical Testing
```bash
# Test in Expo Go
npm start

# Build preview with EAS
eas build --platform all --profile preview

# Check icon on device
# iOS: Home screen, Settings, Notifications
# Android: Home screen, App drawer, Notifications
```

## Accessibility

### Contrast
- **WCAG AAA**: 7:1 contrast ratio
- Yellow (#FFD700) on Black (#000000): ✅ Pass
- Black (#000000) on Yellow (#FFD700): ✅ Pass

### Visibility
- Readable at small sizes (60x60px)
- Clear symbol/meaning
- Works in monochrome
- Distinct from competitors

## App Store Assets

### iOS App Store
- **App Icon**: 1024x1024px (PNG, no alpha)
- **iPhone Screenshots**: 1290x2796px (6.7" display)
- **iPad Screenshots**: 2048x2732px (12.9" display)

### Google Play Store
- **App Icon**: 512x512px (PNG, 32-bit)
- **Feature Graphic**: 1024x500px
- **Phone Screenshots**: 1080x1920px minimum
- **Tablet Screenshots**: 1920x1200px minimum

## Creating Assets Checklist

- [/] Design main app icon (1024x1024)
- [/] Create Android adaptive icon foreground
- [/] Create Android adaptive icon background
- [ ] Design splash screen (1284x2778)
- [ ] Export all required sizes
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Update app.json with asset paths
- [ ] Test splash screen animation
- [ ] Create App Store screenshots
- [ ] Create Play Store feature graphic
- [ ] Generate favicon for web

## Next Steps

1. **Design in Figma**:
   - Use template: [Figma Community - App Icon Template]
   - Apply neubrutalism style
   - Export at various sizes

2. **Place Assets**:
   ```bash
   /assets
     ├── icon.png
     ├── adaptive-icon.png
     ├── splash-icon.png
     └── favicon.png
   ```

3. **Update app.json**:
   - Verify icon paths
   - Set splash background color
   - Configure adaptive icon

4. **Test**:
   ```bash
   npm start
   # View in Expo Go
   # Check icon and splash screen
   ```

5. **Build**:
   ```bash
   eas build --platform all --profile preview
   # Install on device to verify
   ```

## Design Inspiration

### Neubrutalism Examples
- Gumroad branding (bold, yellow accents)
- Oatly packaging (playful, direct)
- Notion illustrations (geometric, colorful)
- Figma brand (vibrant, high-contrast)

### Habit Tracker Icons (Competitive Analysis)
- **Streaks**: Orange/red fire icon
- **Habitica**: Pixel art character
- **Productive**: Minimal checkmark
- **Way of Life**: Circular progress
- **Done**: Simple check in square

**Our Differentiation**: Bold neubrutalism style, chunky shadow, vibrant yellow

## File Delivery

Once designed, assets should be:
1. **Exported** as PNG (transparent where needed)
2. **Optimized** using ImageOptim or TinyPNG
3. **Placed** in `/assets` directory
4. **Configured** in `app.json`
5. **Tested** in Expo and production builds
