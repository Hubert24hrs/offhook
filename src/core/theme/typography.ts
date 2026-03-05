// OFFHOOK — Typography System
import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const Typography = {
    // Display
    displayLarge: {
        fontFamily,
        fontSize: 40,
        fontWeight: '800' as const,
        lineHeight: 48,
        letterSpacing: -1.5,
    },
    displayMedium: {
        fontFamily,
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -1,
    },
    displaySmall: {
        fontFamily,
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 36,
        letterSpacing: -0.5,
    },

    // Headlines
    headlineLarge: {
        fontFamily,
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
        letterSpacing: -0.5,
    },
    headlineMedium: {
        fontFamily,
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    headlineSmall: {
        fontFamily,
        fontSize: 18,
        fontWeight: '600' as const,
        lineHeight: 24,
        letterSpacing: -0.2,
    },

    // Body
    bodyLarge: {
        fontFamily,
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },
    bodyMedium: {
        fontFamily,
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    bodySmall: {
        fontFamily,
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 0.2,
    },

    // Labels
    labelLarge: {
        fontFamily,
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
    },
    labelMedium: {
        fontFamily,
        fontSize: 12,
        fontWeight: '600' as const,
        lineHeight: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
    },
    labelSmall: {
        fontFamily,
        fontSize: 10,
        fontWeight: '500' as const,
        lineHeight: 14,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
    },

    // Caption
    caption: {
        fontFamily,
        fontSize: 11,
        fontWeight: '400' as const,
        lineHeight: 14,
        letterSpacing: 0.3,
    },
} as const;
