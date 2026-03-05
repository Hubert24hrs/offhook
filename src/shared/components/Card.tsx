// OFFHOOK — Animated Card Component
// 3D-style card with depth shadows and flip animation
import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Shadows, AnimationConfig } from '../../core/theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'elevated' | 'glowing';
    glowColor?: string;
    onPress?: () => void;
    flipContent?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default',
    glowColor = Colors.accent1,
    onPress,
    flipContent,
}) => {
    const scale = useSharedValue(1);
    const flipProgress = useSharedValue(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1200 },
            { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
        ],
        backfaceVisibility: 'hidden' as const,
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1200 },
            { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
        ],
        backfaceVisibility: 'hidden' as const,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, AnimationConfig.spring.snappy);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, AnimationConfig.spring.bouncy);
    };

    const handlePress = () => {
        if (flipContent) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsFlipped(!isFlipped);
            flipProgress.value = withTiming(isFlipped ? 0 : 1, {
                duration: AnimationConfig.cardFlip.duration,
            });
        }
        onPress?.();
    };

    const cardVariantStyle =
        variant === 'elevated'
            ? styles.elevated
            : variant === 'glowing'
                ? [styles.glowing, { shadowColor: glowColor }]
                : styles.default;

    if (flipContent) {
        return (
            <Animated.View style={[animatedStyle, style]}>
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handlePress}
                >
                    <Animated.View style={[styles.card, cardVariantStyle, frontAnimatedStyle]}>
                        <LinearGradient
                            colors={[
                                'rgba(108, 99, 255, 0.08)',
                                'rgba(0, 245, 196, 0.03)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        {children}
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.card,
                            cardVariantStyle,
                            styles.backCard,
                            backAnimatedStyle,
                        ]}
                    >
                        <LinearGradient
                            colors={[
                                'rgba(0, 245, 196, 0.08)',
                                'rgba(108, 99, 255, 0.03)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        {flipContent}
                    </Animated.View>
                </Pressable>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[animatedStyle, style]}>
            <Pressable
                onPressIn={onPress ? handlePressIn : undefined}
                onPressOut={onPress ? handlePressOut : undefined}
                onPress={onPress ? handlePress : undefined}
                style={[styles.card, cardVariantStyle]}
            >
                <LinearGradient
                    colors={[
                        'rgba(108, 99, 255, 0.06)',
                        'rgba(0, 245, 196, 0.02)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                {children}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.cardBg,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        padding: Spacing.lg,
        overflow: 'hidden',
    },
    default: {
        ...Shadows.md,
    },
    elevated: {
        ...Shadows.lg,
        borderColor: Colors.glassBorderLight,
    },
    glowing: {
        ...Shadows.lg,
        shadowOpacity: 0.4,
        shadowRadius: 20,
        borderColor: 'rgba(108, 99, 255, 0.3)',
    },
    backCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});
