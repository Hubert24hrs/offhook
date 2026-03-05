// OFFHOOK — Custom Bottom Tab Bar with Glassmorphism
import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, { icon: string; label: string }> = {
    Home: { icon: '🏠', label: 'Home' },
    Generator: { icon: '⚡', label: 'Generate' },
    Contacts: { icon: '👥', label: 'Contacts' },
    Settings: { icon: '⚙️', label: 'Settings' },
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const tabConfig = TAB_ICONS[route.name] || { icon: '📱', label: route.name };

                    const onPress = () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={styles.tab}
                        >
                            {isFocused && (
                                <LinearGradient
                                    colors={[`${Colors.accent1}30`, `${Colors.accent2}15`]}
                                    style={styles.activeBackground}
                                />
                            )}
                            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                                {tabConfig.icon}
                            </Text>
                            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                                {tabConfig.label}
                            </Text>
                            {isFocused && <View style={styles.activeDot} />}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 15, 30, 0.92)',
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 20,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    activeBackground: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: BorderRadius.lg,
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 2,
        opacity: 0.5,
    },
    tabIconActive: {
        opacity: 1,
        fontSize: 24,
    },
    tabLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.accent1,
        fontWeight: '700',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.accent1,
        marginTop: 3,
        shadowColor: Colors.accent1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
});
