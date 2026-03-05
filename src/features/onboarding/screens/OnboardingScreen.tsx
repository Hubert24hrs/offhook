// OFFHOOK — Onboarding Screen (5 Slides)
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { Button } from '../../../shared/components';
import { useUserStore } from '../../../stores/userStore';
import type { RootStackScreenProps } from '../../../navigation/types';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        icon: '🎯',
        title: 'Welcome to\nOFFHOOK',
        subtitle: 'The world\'s smartest excuse engine — powered by your reality.',
        gradient: ['#6C63FF', '#0A84FF'],
    },
    {
        icon: '🌍',
        title: 'Context-Aware\nExcuses',
        subtitle: 'Real weather, live traffic, local news — your excuses are grounded in reality. No one will doubt you.',
        gradient: ['#0A84FF', '#00F5C4'],
    },
    {
        icon: '🧠',
        title: 'Never Repeat\nThe Same Excuse',
        subtitle: 'Our AI remembers every excuse per contact. Smart cooldowns ensure you never get caught recycling.',
        gradient: ['#00F5C4', '#6C63FF'],
    },
    {
        icon: '🎭',
        title: 'Delivery\nCoaching',
        subtitle: 'Know HOW to say it, WHEN to send it, and what to follow up with 1 hour later.',
        gradient: ['#FF2D92', '#6C63FF'],
    },
    {
        icon: '⚡',
        title: 'Ready to\nGet Off The Hook?',
        subtitle: 'Generate your first excuse in seconds. Your secret weapon starts now.',
        gradient: ['#6C63FF', '#FF2D92', '#00F5C4'],
    },
];

export const OnboardingScreen: React.FC<RootStackScreenProps<'Onboarding'>> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { setOnboardingComplete } = useUserStore();

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await setOnboardingComplete();
    };

    const handleSkip = async () => {
        Haptics.selectionAsync();
        await setOnboardingComplete();
    };

    const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
        <View style={styles.slide}>
            <LinearGradient
                colors={item.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.slideGradient}
            >
                <View style={styles.slideContent}>
                    <Animated.Text entering={ZoomIn.delay(200)} style={styles.slideIcon}>
                        {item.icon}
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.slideTitle}>
                        {item.title}
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(600).springify()} style={styles.slideSubtitle}>
                        {item.subtitle}
                    </Animated.Text>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(_, i) => i.toString()}
            />

            {/* Bottom controls */}
            <View style={styles.controls}>
                {/* Dots */}
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === currentIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttons}>
                    {currentIndex < SLIDES.length - 1 ? (
                        <>
                            <Pressable onPress={handleSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip</Text>
                            </Pressable>
                            <Button title="Next" onPress={handleNext} size="lg" />
                        </>
                    ) : (
                        <Button
                            title="Get Started 🚀"
                            onPress={handleFinish}
                            size="lg"
                            fullWidth
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    slide: {
        width,
        height,
    },
    slideGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
    },
    slideContent: {
        alignItems: 'center',
        marginTop: -60,
    },
    slideIcon: {
        fontSize: 80,
        marginBottom: Spacing.xxl,
    },
    slideTitle: {
        ...Typography.displayLarge,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    slideSubtitle: {
        ...Typography.bodyLarge,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 320,
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.xxl,
        paddingBottom: 50,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xxl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#FFF',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: Spacing.lg,
    },
    skipButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    skipText: {
        ...Typography.bodyMedium,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
});
