// OFFHOOK — Premium/Paywall Screen
// Integrates RevenueCat for real in-app subscriptions
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';
import { useUserStore } from '../../../stores/userStore';
import {
    purchasePackage,
    restorePurchases,
    getOfferings,
    type PurchasePackage,
} from '../../../core/services/purchases';

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

// Fallback pricing when RevenueCat is not configured
const FALLBACK_PRICES = {
    MONTHLY: { priceString: '$4.99', period: 'per month', identifier: 'offhook_monthly' },
    ANNUAL: { priceString: '$34.99', period: 'per year', identifier: 'offhook_annual' },
};

export const PremiumScreen: React.FC = () => {
    const navigation = useNavigation();
    const { setProStatus, username } = useUserStore();
    const [offerings, setOfferings] = useState<PurchasePackage[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [loadingOfferings, setLoadingOfferings] = useState(true);

    useEffect(() => {
        loadOfferings();
    }, []);

    const loadOfferings = async () => {
        try {
            const pkgs = await getOfferings();
            setOfferings(pkgs);
        } catch {
            // Use fallback pricing
        } finally {
            setLoadingOfferings(false);
        }
    };

    const getPackageId = (plan: 'annual' | 'monthly'): string => {
        if (offerings.length > 0) {
            const pkg = offerings.find(p =>
                plan === 'annual'
                    ? p.productIdentifier.includes('annual') || p.productIdentifier.includes('yearly')
                    : p.productIdentifier.includes('monthly')
            );
            return pkg?.identifier || (plan === 'annual' ? 'offhook_annual' : 'offhook_monthly');
        }
        return plan === 'annual' ? 'offhook_annual' : 'offhook_monthly';
    };

    const getPriceString = (plan: 'annual' | 'monthly'): string => {
        if (offerings.length > 0) {
            const pkg = offerings.find(p =>
                plan === 'annual'
                    ? p.productIdentifier.includes('annual') || p.productIdentifier.includes('yearly')
                    : p.productIdentifier.includes('monthly')
            );
            return pkg?.product.priceString || (plan === 'annual' ? '$34.99' : '$4.99');
        }
        return plan === 'annual' ? '$34.99' : '$4.99';
    };

    const handleSubscribe = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsPurchasing(true);

        try {
            const packageId = getPackageId(selectedPlan);
            const result = await purchasePackage(packageId);

            if (result.success && result.isPro) {
                await setProStatus(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                    '🎉 Welcome to OFFHOOK Pro!',
                    'All premium features are now unlocked. Generate unlimited excuses!',
                    [{ text: 'Let\'s Go!', onPress: () => navigation.goBack() }]
                );
            } else if (result.error && result.error !== 'Purchase cancelled') {
                // RevenueCat not configured — activate mock Pro for testing
                if (result.error.includes('not available') || result.error.includes('No offerings')) {
                    Alert.alert(
                        'Subscribe to Pro',
                        `Activate ${selectedPlan === 'annual' ? 'Annual ($34.99/yr)' : 'Monthly ($4.99/mo)'} plan?\n\n(Demo mode — RevenueCat not yet configured)`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Activate Pro (Demo)',
                                onPress: async () => {
                                    await setProStatus(true);
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    Alert.alert('Welcome to Pro!', 'All features are now unlocked.');
                                    navigation.goBack();
                                },
                            },
                        ]
                    );
                } else {
                    Alert.alert('Purchase Failed', result.error);
                }
            }
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        Haptics.selectionAsync();
        setIsRestoring(true);

        try {
            const result = await restorePurchases();

            if (result.success && result.isPro) {
                await setProStatus(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert('Purchases Restored!', 'Your Pro subscription has been restored.');
                navigation.goBack();
            } else {
                Alert.alert(
                    'No Purchases Found',
                    result.error || 'No active subscriptions found for this account.'
                );
            }
        } finally {
            setIsRestoring(false);
        }
    };

    const annualPrice = getPriceString('annual');
    const monthlyPrice = getPriceString('monthly');

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0A1A', '#1A0A2E', '#0A0A1A']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Close button */}
                <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
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
                        <Text style={styles.pricingTitle}>Choose Your Plan</Text>

                        {/* Annual Plan */}
                        <Pressable
                            style={[styles.planOption, selectedPlan === 'annual' && styles.planOptionSelected]}
                            onPress={() => {
                                setSelectedPlan('annual');
                                Haptics.selectionAsync();
                            }}
                        >
                            <LinearGradient
                                colors={selectedPlan === 'annual' ? [Colors.accent1, '#8B85FF'] : ['transparent', 'transparent']}
                                style={styles.planGradient}
                            >
                                <View style={styles.planContent}>
                                    <View style={styles.planLeft}>
                                        <View style={styles.saveBadge}>
                                            <Text style={styles.saveText}>SAVE 42%</Text>
                                        </View>
                                        <Text style={[styles.planLabel, selectedPlan === 'annual' && styles.planLabelSelected]}>
                                            Annual Plan
                                        </Text>
                                        <Text style={[styles.planBreakdown, selectedPlan === 'annual' && styles.planBreakdownSelected]}>
                                            ~$2.91/month
                                        </Text>
                                    </View>
                                    <View style={styles.planRight}>
                                        <Text style={[styles.planPrice, selectedPlan === 'annual' && styles.planPriceSelected]}>
                                            {loadingOfferings ? '...' : annualPrice}
                                        </Text>
                                        <Text style={[styles.planPeriod, selectedPlan === 'annual' && styles.planPeriodSelected]}>
                                            per year
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.radioOuter, selectedPlan === 'annual' && styles.radioOuterSelected]}>
                                    {selectedPlan === 'annual' && <View style={styles.radioInner} />}
                                </View>
                            </LinearGradient>
                        </Pressable>

                        {/* Monthly Plan */}
                        <Pressable
                            style={[styles.planOption, selectedPlan === 'monthly' && styles.planOptionSelected]}
                            onPress={() => {
                                setSelectedPlan('monthly');
                                Haptics.selectionAsync();
                            }}
                        >
                            <View style={styles.planGradient}>
                                <View style={styles.planContent}>
                                    <View style={styles.planLeft}>
                                        <Text style={styles.planLabel}>Monthly Plan</Text>
                                        <Text style={styles.planBreakdown}>Cancel anytime</Text>
                                    </View>
                                    <View style={styles.planRight}>
                                        <Text style={styles.planPrice}>
                                            {loadingOfferings ? '...' : monthlyPrice}
                                        </Text>
                                        <Text style={styles.planPeriod}>per month</Text>
                                    </View>
                                </View>
                                <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioOuterSelected]}>
                                    {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
                                </View>
                            </View>
                        </Pressable>

                        {/* Subscribe Button */}
                        <Pressable
                            style={styles.subscribeButton}
                            onPress={handleSubscribe}
                            disabled={isPurchasing}
                        >
                            <LinearGradient
                                colors={isPurchasing ? ['#333', '#444'] : [Colors.accent1, '#8B85FF', Colors.accent2]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.subscribeGradient}
                            >
                                {isPurchasing ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.subscribeText}>
                                        ⚡ Subscribe Now
                                    </Text>
                                )}
                            </LinearGradient>
                        </Pressable>

                        {/* Restore */}
                        <Pressable style={styles.restoreButton} onPress={handleRestore} disabled={isRestoring}>
                            <Text style={styles.restoreText}>
                                {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                            </Text>
                        </Pressable>
                    </GlassPanel>
                </Animated.View>

                {/* Legal */}
                <Animated.View entering={FadeInDown.delay(1000).springify()}>
                    <Text style={styles.legalText}>
                        Subscription auto-renews unless cancelled at least 24 hours before the end of the
                        current period. Manage subscriptions in your device's account settings.
                        Payment will be charged to your App Store / Google Play account upon confirmation.
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
    pricingTitle: {
        ...Typography.headlineSmall, color: Colors.textPrimary, textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    planOption: {
        borderRadius: BorderRadius.xl, overflow: 'hidden',
        borderWidth: 1, borderColor: Colors.glassBorder,
        marginBottom: Spacing.sm,
    },
    planOptionSelected: { borderColor: Colors.accent1 },
    planGradient: { padding: Spacing.lg, borderRadius: BorderRadius.xl, flexDirection: 'row', alignItems: 'center' },
    planContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    planLeft: { flex: 1 },
    planRight: { alignItems: 'flex-end' },
    saveBadge: {
        backgroundColor: '#FFF', paddingHorizontal: Spacing.sm, paddingVertical: 2,
        borderRadius: BorderRadius.sm, marginBottom: Spacing.xs, alignSelf: 'flex-start',
    },
    saveText: { ...Typography.caption, color: Colors.accent1, fontWeight: '800', fontSize: 9 },
    planLabel: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '700' },
    planLabelSelected: { color: '#FFF' },
    planBreakdown: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
    planBreakdownSelected: { color: 'rgba(255,255,255,0.7)' },
    planPrice: { ...Typography.headlineLarge, color: Colors.textPrimary, fontWeight: '800' },
    planPriceSelected: { color: '#FFF' },
    planPeriod: { ...Typography.caption, color: Colors.textMuted },
    planPeriodSelected: { color: 'rgba(255,255,255,0.8)' },
    radioOuter: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 2,
        borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center',
        marginLeft: Spacing.md,
    },
    radioOuterSelected: { borderColor: '#FFF' },
    radioInner: {
        width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF',
    },
    subscribeButton: {
        borderRadius: BorderRadius.xl, overflow: 'hidden', marginTop: Spacing.lg,
        shadowColor: Colors.accent1, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    subscribeGradient: {
        paddingVertical: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.xl,
    },
    subscribeText: { ...Typography.headlineMedium, color: '#FFF', fontWeight: '800' },
    restoreButton: { alignItems: 'center', paddingVertical: Spacing.md, marginTop: Spacing.sm },
    restoreText: { ...Typography.bodySmall, color: Colors.textMuted },
    legalText: {
        ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 16,
    },
});
