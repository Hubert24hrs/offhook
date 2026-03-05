// OFFHOOK — Animation Configuration (Reanimated 3)
import { Easing } from 'react-native-reanimated';

export const AnimationConfig = {
    // Spring presets
    spring: {
        gentle: { damping: 20, stiffness: 150, mass: 1 },
        bouncy: { damping: 12, stiffness: 200, mass: 0.8 },
        snappy: { damping: 18, stiffness: 350, mass: 0.6 },
        smooth: { damping: 25, stiffness: 120, mass: 1.2 },
        heavy: { damping: 30, stiffness: 100, mass: 1.5 },
    },

    // Timing presets
    timing: {
        fast: { duration: 200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
        medium: { duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
        slow: { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
        entrance: { duration: 600, easing: Easing.bezier(0.0, 0.0, 0.2, 1) },
        exit: { duration: 300, easing: Easing.bezier(0.4, 0.0, 1, 1) },
    },

    // Stagger delays
    stagger: {
        fast: 50,
        medium: 80,
        slow: 120,
    },

    // Card flip
    cardFlip: {
        duration: 800,
        easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    },

    // Gauge
    gauge: {
        duration: 1200,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
    },

    // Particle burst
    particleBurst: {
        count: 20,
        duration: 1000,
        spread: 150,
    },
} as const;

export const AnimationPresets = {
    fadeInUp: {
        from: { opacity: 0, translateY: 30 },
        to: { opacity: 1, translateY: 0 },
    },
    fadeInDown: {
        from: { opacity: 0, translateY: -30 },
        to: { opacity: 1, translateY: 0 },
    },
    fadeInLeft: {
        from: { opacity: 0, translateX: -30 },
        to: { opacity: 1, translateX: 0 },
    },
    fadeInRight: {
        from: { opacity: 0, translateX: 30 },
        to: { opacity: 1, translateX: 0 },
    },
    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
    },
    slideUp: {
        from: { translateY: 100 },
        to: { translateY: 0 },
    },
} as const;
