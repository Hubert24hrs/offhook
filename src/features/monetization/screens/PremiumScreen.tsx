// OFFHOOK — Premium/Paywall Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';

interface PremiumScreenProps {
    onNavigate: (screen: string) => void;
}

const PRO_FEATURES = [
    { icon: '♾️', title: 'Unlimited Excuses', desc: 'No daily limits' },
    { icon: '🎭', title: 'All Categories & Tones', desc: 'Full creative freedom' },
    { icon: '📸', title: 'Proof Generator', desc: 'Believable evidence' },
    { icon: '🎯', title: 'Delivery Coach', desc: 'Master your delivery' },
    { icon: '💬', title: 'Conversation Simulator', desc: 'Practice pushback' },
    { icon: '👥', title: 'Unlimited Contacts', desc: 'Track everyone' },
    { icon: '🛡️', title: 'Alibi Builder', desc: 'Full story mode' },
    { icon: '🚫', title: 'Ad-Free', desc: 'Zero distractions' },
    { icon: '🗣️', title: 'Voice Mode', desc: 'Hear your excuse' },
    { icon: '📴', title: 'Offline Mode', desc: 'Works anywhere' },
    { icon: '⌚', title: 'Watch App', desc: 'Excuse on wrist' },
    { icon: '⚡', title: 'Priority AI', desc: 'Faster & smarter' },
];

export const PremiumScreen: React.FC<PremiumScreenProps> = ({ onNavigate }) => {
    const handleSubscribe = (plan: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // RevenueCat integration placeholder
        // For MVP, just show a message
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0A1A', '#1A0A2E', '#0A0A1A']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Close button */}
                <Pressable style={styles.closeButton} onPress={() => onNavigate('home')}>
                    <Text style={styles.closeText}>✕</Text>
                </Pressable>

                {/* Hero */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.hero}>
                    <LinearGradient
                        colors={['#6C63FF', '#FF2D92', '#00F5C4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroBadge}
                    >
                        <Text style={styles.heroIcon}>⭐</Text>
                    </LinearGradient>
                    <Text style={styles.heroTitle}>OFFHOOK Pro</Text>
                    <Text style={styles.heroSubtitle}>
                        Unlock the full power of the world's smartest excuse engine
                    </Text>
                </Animated.View>

                {/* Features Grid */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <View style={styles.featuresGrid}>
                        {PRO_FEATURES.map((feat, i) => (
                            <Animated.View
                                key={feat.title}
                                entering={FadeInDown.delay(500 + i * 50).springify()}
                                style={styles.featureItem}
                            >
                                <Text style={styles.featureIcon}>{feat.icon}</Text>
                                <View>
                                    <Text style={styles.featureTitle}>{feat.title}</Text>
                                    <Text style={styles.featureDesc}>{feat.desc}</Text>
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Pricing */}
                <Animated.View entering={FadeInDown.delay(800).springify()}>
                    <GlassPanel style={styles.pricingCard} glowColor={Colors.accent1}>
                        <Pressable
                            style={styles.pricePlan}
                            onPress={() => handleSubscribe('yearly')}
                        >
                            <LinearGradient
                                colors={[Colors.accent1, '#8B85FF']}
                                style={styles.priceGradient}
                            >
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>SAVE 42%</Text>
                                </View>
                                <Text style={styles.priceAmount}>$34.99</Text>
                                <Text style={styles.pricePeriod}>per year</Text>
                                <Text style={styles.priceBreakdown}>$2.91/mo</Text>
                            </LinearGradient>
                        </Pressable>

                        <Pressable
                            style={styles.pricePlanOutline}
                            onPress={() => handleSubscribe('monthly')}
                        >
                            <Text style={styles.priceAmountOutline}>$4.99</Text>
                            <Text style={styles.pricePeriodOutline}>per month</Text>
                        </Pressable>
                    </GlassPanel>
                </Animated.View>

                {/* Legal */}
                <Animated.View entering={FadeInDown.delay(1000).springify()}>
                    <Text style={styles.legalText}>
                        Cancel anytime. Payment charged to your App Store / Google Play account.
                        Auto-renews unless cancelled 24 hours before end of current period.
                    </Text>
                </Animated.View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: 60 },
    closeButton: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceLight,
        alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end',
    },
    closeText: { color: Colors.textSecondary, fontSize: 18 },
    hero: { alignItems: 'center', marginVertical: Spacing.xxl },
    heroBadge: {
        width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    heroIcon: { fontSize: 40 },
    heroTitle: {
        ...Typography.displayMedium, color: Colors.textPrimary, fontWeight: '800',
        letterSpacing: 2,
    },
    heroSubtitle: {
        ...Typography.bodyLarge, color: Colors.textSecondary, textAlign: 'center',
        marginTop: Spacing.sm, maxWidth: 280,
    },
    featuresGrid: { gap: Spacing.md, marginBottom: Spacing.xl },
    featureItem: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        padding: Spacing.md, borderWidth: 1, borderColor: Colors.glassBorder,
    },
    featureIcon: { fontSize: 24, width: 36, textAlign: 'center' },
    featureTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '600' },
    featureDesc: { ...Typography.caption, color: Colors.textMuted },
    pricingCard: { marginBottom: Spacing.lg },
    pricePlan: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: Spacing.sm },
    priceGradient: {
        padding: Spacing.xl, alignItems: 'center', borderRadius: BorderRadius.xl, position: 'relative',
    },
    saveBadge: {
        position: 'absolute', top: 12, right: 12, backgroundColor: '#FFF',
        paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.sm,
    },
    saveText: { ...Typography.caption, color: Colors.accent1, fontWeight: '800' },
    priceAmount: { ...Typography.displayLarge, color: '#FFF' },
    pricePeriod: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.8)' },
    priceBreakdown: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.xs },
    pricePlanOutline: {
        padding: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.xl,
        borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.surfaceLight,
    },
    priceAmountOutline: { ...Typography.headlineLarge, color: Colors.textPrimary },
    pricePeriodOutline: { ...Typography.bodySmall, color: Colors.textMuted },
    legalText: {
        ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 16,
    },
});
