// OFFHOOK — AnimatedText Component
// Typewriter and fade-in text animations
import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

interface AnimatedTextProps {
    text: string;
    style?: StyleProp<TextStyle>;
    animation?: 'fadeIn' | 'typewriter' | 'slideUp';
    delay?: number;
    duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
    text,
    style,
    animation = 'fadeIn',
    delay = 0,
    duration = 500,
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(animation === 'slideUp' ? 20 : 0);
    const [displayText, setDisplayText] = useState(animation === 'typewriter' ? '' : text);

    useEffect(() => {
        if (animation === 'typewriter') {
            opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
            let index = 0;
            const interval = setInterval(() => {
                index++;
                setDisplayText(text.slice(0, index));
                if (index >= text.length) clearInterval(interval);
            }, duration / text.length);
            return () => clearInterval(interval);
        } else {
            opacity.value = withDelay(delay, withTiming(1, { duration }));
            if (animation === 'slideUp') {
                translateY.value = withDelay(delay, withTiming(0, { duration }));
            }
        }
    }, [text]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.Text style={[style, animatedStyle]}>
            {displayText}
        </Animated.Text>
    );
};
