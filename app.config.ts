// OFFHOOK — Dynamic Expo Config
// Reads environment variables so API keys are injected at EAS build time.
// To set EAS secrets (never commit real keys to git):
//   eas secret:create --scope project --name EXPO_PUBLIC_CLAUDE_API_KEY --value sk-ant-...
//   eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_...
//   eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value goog_...

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'OFFHOOK',
    slug: 'offhook',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'offhook',
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0A0A1A',
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.offhook.app',
        buildNumber: '1',
        infoPlist: {
            NSLocationWhenInUseUsageDescription:
                'OFFHOOK uses your location to generate context-aware excuses grounded in your real surroundings.',
            NSLocationAlwaysUsageDescription:
                'OFFHOOK uses your location to provide hyper-realistic excuses.',
            NSUserTrackingUsageDescription:
                'This helps us show relevant content.',
        },
    },
    android: {
        package: 'com.offhook.app',
        versionCode: 1,
        adaptiveIcon: {
            backgroundColor: '#0A0A1A',
            foregroundImage: './assets/android-icon-foreground.png',
            backgroundImage: './assets/android-icon-background.png',
            monochromeImage: './assets/android-icon-monochrome.png',
        },
        permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
        predictiveBackGestureEnabled: false,
    },
    web: {
        favicon: './assets/favicon.png',
        bundler: 'metro',
    },
    extra: {
        eas: {
            projectId: 'offhook-mvp',
        },
        privacyPolicyUrl: 'https://offhook.app/privacy',
        supportUrl: 'https://offhook.app/support',
        marketingUrl: 'https://offhook.app',
        // Injected from EAS secrets or local .env at build time
        claudeApiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? '',
        revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
        revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
    },
    plugins: [
        [
            'expo-location',
            {
                locationAlwaysAndWhenInUsePermission:
                    'OFFHOOK uses your location to generate context-aware excuses.',
            },
        ],
    ],
});
