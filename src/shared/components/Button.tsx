// OFFHOOK — Animated Button Component
// Press-depth animation with haptic feedback and glassmorphism
import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, AnimationConfig } from '../../core/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, AnimationConfig.spring.snappy);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, AnimationConfig.spring.bouncy);
    };

    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }
    };

    const sizeStyles = SIZE_MAP[size];
    const isGradient = variant === 'primary';

    const content = (
        <>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? Colors.accent1 : '#FFF'}
                    size="small"
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            sizeStyles.text,
                            VARIANT_TEXT[variant],
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                animatedStyle,
                styles.base,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                !isGradient && VARIANT_STYLES[variant],
                style,
            ]}
        >
            {isGradient ? (
                <LinearGradient
                    colors={[Colors.accent1, Colors.accent1Light]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientBg, sizeStyles.container]}
                >
                    {content}
                </LinearGradient>
            ) : (
                content
            )}
        </AnimatedPressable>
    );
};

const SIZE_MAP = {
    sm: {
        container: { height: 36, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.sm },
        text: { fontSize: 13, fontWeight: '600' as const },
    },
    md: {
        container: { height: 48, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg },
        text: { fontSize: 15, fontWeight: '600' as const },
    },
    lg: {
        container: { height: 56, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.xl },
        text: { fontSize: 17, fontWeight: '700' as const },
    },
};

const VARIANT_STYLES: Record<string, ViewStyle> = {
    secondary: { backgroundColor: Colors.surfaceLight },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.accent1 },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: Colors.accent3 },
};

const VARIANT_TEXT: Record<string, TextStyle> = {
    primary: { color: '#FFFFFF' },
    secondary: { color: Colors.textPrimary },
    outline: { color: Colors.accent1 },
    ghost: { color: Colors.accent1 },
    danger: { color: '#FFFFFF' },
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        overflow: 'hidden',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    gradientBg: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        width: '100%',
    },
    text: {
        letterSpacing: 0.3,
    },
});
