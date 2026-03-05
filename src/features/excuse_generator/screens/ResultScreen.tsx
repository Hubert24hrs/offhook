// OFFHOOK — Excuse Result Screen
// Animated 3D card reveal with all excuse details, risk gauge, delivery tips
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Share,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Card, RiskGauge, AnimatedText, Button } from '../../../shared/components';
import { useExcuseStore } from '../../../stores/excuseStore';

interface ResultScreenProps {
    onNavigate: (screen: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ onNavigate }) => {
    const { currentExcuse, clearCurrentExcuse } = useExcuseStore();

    if (!currentExcuse) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#0A0A1A', '#12122A']} style={StyleSheet.absoluteFill} />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🤷</Text>
                    <Text style={styles.emptyText}>No excuse generated yet</Text>
                    <Button title="Go Back" onPress={() => onNavigate('home')} />
                </View>
            </View>
        );
    }

    const handleCopy = async () => {
        await Clipboard.setStringAsync(currentExcuse.excuse_text);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: currentExcuse.excuse_text,
            });
        } catch (error) {
            // User cancelled
        }
    };

    const handleNewExcuse = () => {
        clearCurrentExcuse();
        onNavigate('generator');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0A1A', '#12122A', '#0A0A1A']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={styles.header}>
                        <Pressable onPress={() => onNavigate('home')}>
                            <Text style={styles.backButton}>← Home</Text>
                        </Pressable>
                        <Text style={styles.headerTitle}>Your Excuse</Text>
                        <View style={{ width: 50 }} />
                    </View>
                </Animated.View>

                {/* Success Badge */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.successBadge}>
                    <Text style={styles.successIcon}>✨</Text>
                    <Text style={styles.successText}>Excuse Generated!</Text>
                </Animated.View>

                {/* Main Excuse Card */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <Card variant="glowing" glowColor={Colors.accent1}>
                        <LinearGradient
                            colors={['rgba(108, 99, 255, 0.1)', 'rgba(0, 245, 196, 0.05)']}
                            style={styles.excuseGradient}
                        >
                            <AnimatedText
                                text={currentExcuse.excuse_text}
                                style={styles.excuseText}
                                animation="typewriter"
                                duration={2000}
                            />
                        </LinearGradient>
                    </Card>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.actionRow}>
                    <Pressable style={styles.actionButton} onPress={handleCopy}>
                        <LinearGradient
                            colors={[Colors.accent1, Colors.accent1Light]}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionIcon}>📋</Text>
                            <Text style={styles.actionLabel}>Copy</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleShare}>
                        <LinearGradient
                            colors={[Colors.accent2Dark, Colors.accent2]}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionIcon}>📤</Text>
                            <Text style={styles.actionLabel}>Share</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleNewExcuse}>
                        <View style={styles.actionOutline}>
                            <Text style={styles.actionIcon}>🔄</Text>
                            <Text style={[styles.actionLabel, { color: Colors.textSecondary }]}>New</Text>
                        </View>
                    </Pressable>
                </Animated.View>

                {/* Risk Meter */}
                <Animated.View entering={FadeInDown.delay(800).springify()}>
                    <GlassPanel style={styles.riskSection} glowColor={
                        currentExcuse.risk_score <= 30 ? Colors.riskLow :
                            currentExcuse.risk_score <= 60 ? Colors.riskMedium : Colors.riskCritical
                    }>
                        <Text style={styles.sectionTitle}>Risk Assessment</Text>
                        <View style={styles.riskGaugeContainer}>
                            <RiskGauge score={currentExcuse.risk_score} size={180} />
                        </View>
                        <Text style={styles.riskReason}>{currentExcuse.risk_reason}</Text>
                    </GlassPanel>
                </Animated.View>

                {/* Delivery Tips */}
                <Animated.View entering={FadeInDown.delay(1000).springify()}>
                    <GlassPanel style={styles.tipSection} glowColor={Colors.accent2}>
                        <Text style={styles.sectionTitle}>🎯 Delivery Coach</Text>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipLabel}>How to deliver</Text>
                            <Text style={styles.tipText}>{currentExcuse.delivery_tip}</Text>
                        </View>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipLabel}>Best time to send</Text>
                            <Text style={styles.tipText}>{currentExcuse.best_send_time}</Text>
                        </View>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipLabel}>Supporting context</Text>
                            <Text style={styles.tipText}>{currentExcuse.supporting_context}</Text>
                        </View>

                        <View style={styles.tipCard}>
                            <Text style={styles.tipLabel}>Follow-up (1 hour later)</Text>
                            <Text style={styles.tipText}>{currentExcuse.follow_up_suggestion}</Text>
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Cultural Tags */}
                <Animated.View entering={FadeInDown.delay(1200).springify()}>
                    <View style={styles.tagRow}>
                        {currentExcuse.cultural_tags.map((tag, i) => (
                            <View key={i} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

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
        marginBottom: Spacing.lg,
    },
    backButton: {
        ...Typography.bodyMedium,
        color: Colors.accent1,
        fontWeight: '600',
    },
    headerTitle: {
        ...Typography.headlineMedium,
        color: Colors.textPrimary,
    },
    successBadge: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    successIcon: {
        fontSize: 40,
        marginBottom: Spacing.xs,
    },
    successText: {
        ...Typography.headlineSmall,
        color: Colors.accent2,
        fontWeight: '700',
    },
    excuseGradient: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    excuseText: {
        ...Typography.bodyLarge,
        color: Colors.textPrimary,
        lineHeight: 26,
        fontSize: 17,
    },
    actionRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginVertical: Spacing.xl,
    },
    actionButton: {
        flex: 1,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    actionGradient: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
    },
    actionOutline: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        backgroundColor: Colors.surfaceLight,
    },
    actionIcon: {
        fontSize: 20,
        marginBottom: Spacing.xxs,
    },
    actionLabel: {
        ...Typography.caption,
        color: '#FFF',
        fontWeight: '700',
    },
    riskSection: {
        marginBottom: Spacing.lg,
        alignItems: 'center',
    },
    riskGaugeContainer: {
        marginVertical: Spacing.md,
    },
    riskReason: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    tipSection: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.headlineSmall,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    tipCard: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    tipLabel: {
        ...Typography.labelSmall,
        color: Colors.accent2,
        marginBottom: Spacing.xs,
    },
    tipText: {
        ...Typography.bodyMedium,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    tag: {
        backgroundColor: `${Colors.accent1}15`,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: `${Colors.accent1}30`,
    },
    tagText: {
        ...Typography.caption,
        color: Colors.accent1,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
    },
    emptyIcon: {
        fontSize: 50,
    },
    emptyText: {
        ...Typography.bodyLarge,
        color: Colors.textMuted,
    },
});
