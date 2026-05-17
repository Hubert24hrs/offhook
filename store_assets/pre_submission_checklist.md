# OFFHOOK — Pre-Submission Checklist

Complete every item before submitting to App Store Connect or Google Play Console.

---

## 1. Code & Build Quality

- [ ] Remove all `console.log` statements from production code
  ```bash
  # Find all console.log in source
  grep -r "console.log\|console.warn\|console.error" src/ --include="*.ts" --include="*.tsx"
  ```
- [ ] Run TypeScript strict check — zero errors:
  ```bash
  npx tsc --noEmit
  ```
- [ ] Run Expo Doctor:
  ```bash
  npx expo-doctor
  ```
- [ ] Confirm no `TODO` or `FIXME` comments in production paths:
  ```bash
  grep -r "TODO\|FIXME\|HACK\|placeholder" src/
  ```

---

## 2. API Keys & Secrets

- [ ] Claude API key is set via EAS secret (NOT hardcoded):
  ```bash
  eas secret:create --scope project --name EXPO_PUBLIC_CLAUDE_API_KEY --value sk-ant-...
  ```
- [ ] RevenueCat iOS key is set via EAS secret:
  ```bash
  eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_...
  ```
- [ ] RevenueCat Android key is set via EAS secret:
  ```bash
  eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_...
  ```
- [ ] `.env` is in `.gitignore` and contains no real keys
- [ ] No API keys appear in git history (`git log --all -p | grep "sk-ant"`)

---

## 3. RevenueCat Setup

- [ ] Created RevenueCat account at https://app.revenuecat.com
- [ ] Added iOS app with bundle ID `com.offhook.app`
- [ ] Added Android app with package `com.offhook.app`
- [ ] Created products in App Store Connect:
  - `offhook_monthly` — $4.99/month auto-renewing subscription
  - `offhook_annual` — $34.99/year auto-renewing subscription
- [ ] Created matching products in Google Play Console
- [ ] Created Offering in RevenueCat with both packages
- [ ] Entitlement named `pro` linked to both packages
- [ ] Tested sandbox purchase on TestFlight (iOS)
- [ ] Tested sandbox purchase on internal track (Android)
- [ ] Restore Purchases tested on both platforms

---

## 4. Device Testing

- [ ] Tested on real **Android device** (API 29+ / Android 10+):
  - [ ] Location permission flow works
  - [ ] Weather loads from Open-Meteo
  - [ ] Full onboarding → auth → generator → result flow
  - [ ] Copy to clipboard works
  - [ ] Share sheet works
  - [ ] Notifications permission + follow-up reminder fires
  - [ ] Pro paywall blocks at 5 excuses/day
- [ ] Tested on real **iPhone** (iOS 16+):
  - [ ] Same checklist as Android above
  - [ ] Back gesture / swipe navigation feels native
  - [ ] Safe area padding correct on notched and Dynamic Island devices
- [ ] Tested on **iPad** (if `supportsTablet: true`):
  - [ ] Layout doesn't break on large screen

---

## 5. Navigation & Deep Links

- [ ] All tab routes navigate correctly
- [ ] Result screen modal opens and dismisses cleanly
- [ ] Premium modal opens from Settings and Home
- [ ] Deep link scheme `offhook://` tested (if used)
- [ ] Back navigation from every screen works

---

## 6. Privacy & Legal

- [ ] Privacy Policy is live at `https://offhook.app/privacy`
  - Must state: what data is collected, how Claude API is used (stateless), no resale
- [ ] Terms of Service live at `https://offhook.app/terms`
- [ ] Support URL is reachable: `https://offhook.app/support` or `mailto:support@offhook.app`
- [ ] App does NOT collect data beyond what's declared in privacy policy
- [ ] Location data is NOT sent to any third party (only used locally to build Open-Meteo URL)
- [ ] App Store Privacy Nutrition Label filled out in App Store Connect:
  - Location: Used for app functionality (not linked to user)
  - Purchase history: Managed by RevenueCat

---

## 7. Store Assets

### App Store Connect
- [ ] App icon: 1024×1024px PNG, no transparency, no rounded corners (Apple applies mask)
- [ ] Screenshots — **iPhone 6.9" (1320×2868px)**:
  - [ ] Home screen with weather widget
  - [ ] Generator screen with category/tone selection
  - [ ] Result screen with excuse text and risk gauge
  - [ ] Premium screen with pricing plans
  - [ ] Settings screen with API key section
- [ ] Screenshots — **iPhone 6.5" (1242×2688px)**: Same 5 screens
- [ ] Screenshots — **iPad Pro 12.9" (2048×2732px)**: At least 2 screens
- [ ] App Preview video (optional but recommended): 30s, 1080×1920px

### Google Play Console
- [ ] App icon: 512×512px PNG
- [ ] Feature graphic: 1024×500px (see `app_store_description.md` for brief)
- [ ] Phone screenshots: At least 2, max 8 (1080×1920px recommended)
- [ ] 7" tablet screenshots (optional)
- [ ] 10" tablet screenshots (optional)

---

## 8. App Metadata

- [ ] `app.json` has correct `bundleIdentifier`: `com.offhook.app`
- [ ] `app.json` has correct `package`: `com.offhook.app`
- [ ] `app.json` `versionCode` is `1` for first submission (increment on every update)
- [ ] `app.json` `version` is `1.0.0`
- [ ] EAS `projectId` in `app.json` matches your actual EAS project

---

## 9. EAS Build

### Android AAB
```bash
# Login
eas login

# Build AAB for Google Play
eas build --platform android --profile production

# After build completes, download the .aab from EAS dashboard
# OR submit directly:
eas submit --platform android --profile production
```

### iOS IPA
```bash
# Must be on macOS with Xcode installed for local, or use EAS cloud build
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --profile production
```

### Manual Android (if not using EAS)
```bash
# Prebuild (eject from Expo managed)
npx expo prebuild --platform android

# Generate upload keystore (do this ONCE, back up securely)
keytool -genkeypair -v \
  -keystore offhook-upload.jks \
  -alias offhook \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Build release AAB
cd android && ./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 10. Post-Build Verification

- [ ] AAB verified with bundletool:
  ```bash
  bundletool build-apks \
    --bundle=android/app/build/outputs/bundle/release/app-release.aab \
    --output=test.apks \
    --overwrite
  bundletool install-apks --apks=test.apks
  ```
- [ ] TestFlight build installed and tested end-to-end on real iPhone
- [ ] Google Play internal track build tested on real Android device
- [ ] App correctly identifies first launch (onboarding shows)
- [ ] App correctly restores session on relaunch (auth persisted)

---

## 11. App Store Connect Setup

- [ ] Create new App in App Store Connect
- [ ] Fill in name, subtitle, description (see `app_store_description.md`)
- [ ] Add all screenshot sizes
- [ ] Set Age Rating: 4+
- [ ] Set Primary Category: Productivity
- [ ] Set Secondary Category: Entertainment
- [ ] Add Privacy Policy URL
- [ ] Add Support URL
- [ ] Add Marketing URL
- [ ] Add In-App Purchases (linked from RevenueCat):
  - `offhook_monthly` — Auto-Renewable Subscription — $4.99/month
  - `offhook_annual` — Auto-Renewable Subscription — $34.99/year
- [ ] Add Subscription Group: "OFFHOOK Pro"
- [ ] Export Compliance: No (no custom encryption)
- [ ] Submit for Review

---

## 12. Google Play Console Setup

- [ ] Create app in Google Play Console
- [ ] Fill in store listing (see `app_store_description.md`)
- [ ] Add feature graphic 1024×500px
- [ ] Upload AAB to internal testing track
- [ ] Complete content rating questionnaire → Rating: Everyone
- [ ] Set target audience: 16+ (due to social manipulation theme)
- [ ] Declare data safety:
  - Location: Collected, not shared, used for app functionality
  - App activity: Crash logs via Expo (approximate location)
- [ ] Set up Google Play Billing for subscriptions
- [ ] Promote from internal → closed testing → open testing → production
