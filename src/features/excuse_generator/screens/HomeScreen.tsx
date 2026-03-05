// OFFHOOK — Home Dashboard Screen
// Weather overlay, quick excuse, suggested excuses, recent activity
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button, AnimatedText } from '../../../shared/components';
import { useExcuseStore } from '../../../stores/excuseStore';
import { useContactStore } from '../../../stores/contactStore';
import { useUserStore } from '../../../stores/userStore';
import { EXCUSE_CATEGORIES } from '../../../shared/constants/categories';
import { getWeather, type WeatherData } from '../../../core/services/weather';
import { getCurrentLocation, type LocationData } from '../../../core/services/location';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { dailyGenerations, maxDailyFree, isPro, excuseHistory, loadHistory } = useExcuseStore();
    const { contacts, loadContacts } = useContactStore();
    const { username, loadUser } = useUserStore();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);

    useEffect(() => {
        loadHistory();
        loadContacts();
        loadUser();
        loadContextData();
    }, []);

    const loadContextData = async () => {
        try {
            const loc = await getCurrentLocation();
            setLocation(loc);
            if (loc) {
                const w = await getWeather(loc.coords.latitude, loc.coords.longitude);
                setWeather(w);
            }
        } catch (e) {
            // Fallback handled in services
        }
    };

    const remainingExcuses = isPro ? '∞' : `${maxDailyFree - dailyGenerations}`;

    const displayWeather = weather
        ? { condition: `${weather.icon} ${weather.condition}`, temp: `${weather.temperature}°C`, city: location?.city || 'Unknown' }
        : { condition: '🌤️ Partly Cloudy', temp: '24°C', city: 'Loading...' };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#0A0A1A', '#12122A', '#0A0A1A']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            {getGreeting()}, {username || 'there'} 👋
                        </Text>
                        <Text style={styles.subtitle}>What excuse do you need today?</Text>
                    </View>
                    <Pressable
                        style={styles.profileButton}
                        onPress={() => (navigation as any).navigate('Settings')}
                    >
                        <LinearGradient
                            colors={[Colors.accent1, Colors.accent2]}
                            style={styles.profileGradient}
                        >
                            <Text style={styles.profileText}>
                                {(username || 'U')[0].toUpperCase()}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                {/* Weather & Context Card */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassPanel style={styles.weatherCard} glowColor={Colors.accent2}>
                        <View style={styles.weatherRow}>
                            <View>
                                <Text style={styles.weatherCity}>📍 {displayWeather.city}</Text>
                                <Text style={styles.weatherCondition}>
                                    {displayWeather.condition} • {displayWeather.temp}
                                </Text>
                            </View>
                            <View style={styles.excuseCounter}>
                                <Text style={styles.counterNumber}>{remainingExcuses}</Text>
                                <Text style={styles.counterLabel}>excuses left</Text>
                            </View>
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Quick Excuse Button */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <Pressable
                        style={styles.quickExcuseButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            (navigation as any).navigate('Generator');
                        }}
                    >
                        <LinearGradient
                            colors={[Colors.accent1, '#8B85FF', Colors.accent2]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.quickExcuseGradient}
                        >
                            <Text style={styles.quickExcuseIcon}>⚡</Text>
                            <Text style={styles.quickExcuseTitle}>Generate Excuse</Text>
                            <Text style={styles.quickExcuseSubtitle}>
                                AI-powered • Context-aware • Undetectable
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                {/* Quick Categories */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <Text style={styles.sectionTitle}>Quick Categories</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {EXCUSE_CATEGORIES.slice(0, 6).map((cat, index) => (
                            <Animated.View
                                key={cat.id}
                                entering={FadeInRight.delay(450 + index * 80).springify()}
                            >
                                <Pressable
                                    style={styles.categoryCard}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        (navigation as any).navigate('Generator');
                                    }}
                                >
                                    <LinearGradient
                                        colors={[
                                            `${Colors.accent1}15`,
                                            `${Colors.accent2}08`,
                                        ]}
                                        style={styles.categoryGradient}
                                    >
                                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Recent Excuses */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    {excuseHistory.length === 0 ? (
                        <GlassPanel style={styles.emptyCard}>
                            <Text style={styles.emptyIcon}>🎯</Text>
                            <Text style={styles.emptyText}>
                                No excuses generated yet.{'\n'}Tap the button above to get started!
                            </Text>
                        </GlassPanel>
                    ) : (
                        excuseHistory.slice(0, 3).map((entry, index) => (
                            <Animated.View
                                key={entry.id}
                                entering={FadeInDown.delay(700 + index * 100).springify()}
                            >
                                <GlassPanel style={styles.historyCard}>
                                    <View style={styles.historyHeader}>
                                        <Text style={styles.historyCategory}>
                                            {EXCUSE_CATEGORIES.find((c) => c.id === entry.category)?.icon}{' '}
                                            {EXCUSE_CATEGORIES.find((c) => c.id === entry.category)?.label}
                                        </Text>
                                        <View
                                            style={[
                                                styles.riskBadge,
                                                {
                                                    backgroundColor:
                                                        entry.riskScore <= 25
                                                            ? `${Colors.riskLow}20`
                                                            : entry.riskScore <= 50
                                                                ? `${Colors.riskMedium}20`
                                                                : `${Colors.riskCritical}20`,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.riskBadgeText,
                                                    {
                                                        color:
                                                            entry.riskScore <= 25
                                                                ? Colors.riskLow
                                                                : entry.riskScore <= 50
                                                                    ? Colors.riskMedium
                                                                    : Colors.riskCritical,
                                                    },
                                                ]}
                                            >
                                                Risk: {entry.riskScore}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.historyText} numberOfLines={2}>
                                        {entry.excuseText}
                                    </Text>
                                    <Text style={styles.historyDate}>
                                        {new Date(entry.createdAt).toLocaleDateString()} •{' '}
                                        {entry.contactId}
                                    </Text>
                                </GlassPanel>
                            </Animated.View>
                        ))
                    )}
                </Animated.View>

                {/* Feature Cards */}
                <Animated.View entering={FadeInDown.delay(800).springify()}>
                    <Text style={styles.sectionTitle}>More Features</Text>
                    <View style={styles.featureGrid}>
                        <FeatureCard
                            icon="👥"
                            title="Contacts"
                            subtitle={`${contacts.length} saved`}
                            onPress={() => (navigation as any).navigate('Contacts')}
                        />
                        <FeatureCard
                            icon="📊"
                            title="Risk Meter"
                            subtitle="Analyze risk"
                            onPress={() => (navigation as any).navigate('Generator')}
                        />
                        <FeatureCard
                            icon="🎭"
                            title="Simulator"
                            subtitle="Practice"
                            onPress={() => (navigation as any).navigate('Generator')}
                            isPro
                        />
                        <FeatureCard
                            icon="🛡️"
                            title="Alibi"
                            subtitle="Full stories"
                            onPress={() => (navigation as any).navigate('Generator')}
                            isPro
                        />
                    </View>
                </Animated.View>

                {/* Pro Banner */}
                {!isPro && (
                    <Animated.View entering={FadeInDown.delay(900).springify()}>
                        <Pressable onPress={() => (navigation as any).navigate('Premium')}>
                            <LinearGradient
                                colors={['#6C63FF', '#FF2D92']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.proBanner}
                            >
                                <Text style={styles.proBannerTitle}>⭐ Upgrade to OFFHOOK Pro</Text>
                                <Text style={styles.proBannerSubtitle}>
                                    Unlimited excuses • Proof generator • Delivery coach • Ad-free
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
};

// Feature Card component
const FeatureCard: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    isPro?: boolean;
}> = ({ icon, title, subtitle, onPress, isPro: isProFeature }) => (
    <Pressable style={styles.featureCard} onPress={onPress}>
        <GlassPanel style={styles.featurePanel}>
            {isProFeature && <Text style={styles.proBadge}>PRO</Text>}
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureSubtitle}>{subtitle}</Text>
        </GlassPanel>
    </Pressable>
);

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    greeting: {
        ...Typography.headlineLarge,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        marginTop: Spacing.xxs,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    profileGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        ...Typography.headlineMedium,
        color: '#FFF',
    },
    weatherCard: {
        marginBottom: Spacing.lg,
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weatherCity: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
    },
    weatherCondition: {
        ...Typography.headlineSmall,
        color: Colors.textPrimary,
        marginTop: Spacing.xxs,
    },
    excuseCounter: {
        alignItems: 'center',
        backgroundColor: `${Colors.accent1}15`,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    counterNumber: {
        ...Typography.displaySmall,
        color: Colors.accent1,
    },
    counterLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: -2,
    },
    quickExcuseButton: {
        marginBottom: Spacing.xl,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: Colors.accent1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    quickExcuseGradient: {
        paddingVertical: Spacing.xxl,
        alignItems: 'center',
        borderRadius: BorderRadius.xl,
    },
    quickExcuseIcon: {
        fontSize: 36,
        marginBottom: Spacing.sm,
    },
    quickExcuseTitle: {
        ...Typography.headlineLarge,
        color: '#FFF',
        fontWeight: '800',
    },
    quickExcuseSubtitle: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.7)',
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        ...Typography.headlineSmall,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    categoriesScroll: {
        gap: Spacing.sm,
        paddingBottom: Spacing.lg,
    },
    categoryCard: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    categoryGradient: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    categoryIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    categoryLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        marginBottom: Spacing.lg,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: Spacing.md,
    },
    emptyText: {
        ...Typography.bodyMedium,
        color: Colors.textMuted,
        textAlign: 'center',
    },
    historyCard: {
        marginBottom: Spacing.sm,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    historyCategory: {
        ...Typography.bodyMedium,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    riskBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
        borderRadius: BorderRadius.round,
    },
    riskBadgeText: {
        ...Typography.caption,
        fontWeight: '600',
    },
    historyText: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    historyDate: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: Spacing.sm,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    featureCard: {
        width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    },
    featurePanel: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        position: 'relative',
    },
    featureIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    featureTitle: {
        ...Typography.bodyMedium,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    featureSubtitle: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: Spacing.xxs,
    },
    proBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: `${Colors.accent1}30`,
        color: Colors.accent1,
        fontSize: 9,
        fontWeight: '800',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    proBanner: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    proBannerTitle: {
        ...Typography.headlineMedium,
        color: '#FFF',
        fontWeight: '800',
    },
    proBannerSubtitle: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.8)',
        marginTop: Spacing.xs,
    },
});
