// OFFHOOK — Result Screen
// Displays the generated excuse with risk gauge, delivery tips, and actions
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Share,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button, RiskGauge } from '../../../shared/components';
import { useExcuseStore } from '../../../stores/excuseStore';
import { scheduleFollowUpReminder } from '../../../core/services/notifications';
import type { RootStackScreenProps } from '../../../navigation/types';

export const ResultScreen: React.FC = () => {
    const navigation = useNavigation();
    const { currentExcuse, currentRiskScore, currentRiskReason } = useExcuseStore();
    const [copied, setCopied] = useState(false);
    const [followUpScheduled, setFollowUpScheduled] = useState(false);

    if (!currentExcuse) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#0A0A1A', '#12122A', '#0A0A1A']} style={StyleSheet.absoluteFill} />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No excuse generated yet.</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </View>
            </View>
        );
    }

    const riskColor = currentRiskScore <= 25
        ? Colors.riskLow
        : currentRiskScore <= 50
            ? Colors.riskMedium
            : currentRiskScore <= 75
                ? Colors.riskHigh
                : Colors.riskCritical;

    const handleCopy = async () => {
        await Clipboard.setStringAsync(currentExcuse.excuse_text);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const handleScheduleFollowUp = async () => {
        if (currentExcuse.follow_up_suggestion) {
            const notifId = await scheduleFollowUpReminder(
                'latest',
                currentExcuse.follow_up_suggestion,
                60 // 1 hour later
            );
            if (notifId) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setFollowUpScheduled(true);
                Alert.alert('Reminder Set!', 'We will remind you in 1 hour to follow up.');
            } else {
                Alert.alert('Permission Needed', 'Please enable notifications in your device settings.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0A0A1A', '#12122A', '#0A0A1A']} style={StyleSheet.absoluteFill} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Close button */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeText}>← Back</Text>
                    </Pressable>
                </Animated.View>

                {/* Success header */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.successHeader}>
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successTitle}>Excuse Generated!</Text>
                </Animated.View>

                {/* Main excuse card */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <GlassPanel style={styles.excuseCard} glowColor={Colors.accent1}>
                        <Text style={styles.excuseText}>{currentExcuse.excuse_text}</Text>
                    </GlassPanel>
                </Animated.View>

                {/* Risk assessment */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel style={styles.riskCard}>
                        <Text style={styles.cardTitle}>🛡️ Risk Assessment</Text>
                        <RiskGauge score={currentRiskScore} />
                        <Text style={[styles.riskLabel, { color: riskColor }]}>
                            Risk Score: {currentRiskScore}/100
                        </Text>
                        <Text style={styles.riskReason}>{currentRiskReason}</Text>
                    </GlassPanel>
                </Animated.View>

                {/* Delivery tip */}
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassPanel style={styles.tipCard}>
                        <Text style={styles.cardTitle}>💡 Delivery Tip</Text>
                        <Text style={styles.tipText}>{currentExcuse.delivery_tip}</Text>
                        <View style={styles.tipMeta}>
                            <Text style={styles.metaLabel}>Best send time:</Text>
                            <Text style={styles.metaValue}>{currentExcuse.best_send_time}</Text>
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Follow-up suggestion */}
                {currentExcuse.follow_up_suggestion && (
                    <Animated.View entering={FadeInDown.delay(600).springify()}>
                        <GlassPanel style={styles.followUpCard}>
                            <Text style={styles.cardTitle}>🔄 Follow-up Suggestion</Text>
                            <Text style={styles.followUpText}>{currentExcuse.follow_up_suggestion}</Text>
                            <Button
                                title={followUpScheduled ? '✅ Reminder Set!' : '🔔 Remind Me in 1 Hour'}
                                onPress={handleScheduleFollowUp}
                                variant={followUpScheduled ? 'ghost' : 'outline'}
                                size="sm"
                            />
                        </GlassPanel>
                    </Animated.View>
                )}

                {/* Supporting context */}
                {currentExcuse.supporting_context && (
                    <Animated.View entering={FadeInDown.delay(700).springify()}>
                        <GlassPanel style={styles.contextCard}>
                            <Text style={styles.cardTitle}>🌍 Why This Works</Text>
                            <Text style={styles.contextText}>{currentExcuse.supporting_context}</Text>
                        </GlassPanel>
                    </Animated.View>
                )}

                {/* Action buttons */}
                <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.actionRow}>
                    <Pressable style={styles.actionButton} onPress={handleCopy}>
                        <LinearGradient
                            colors={copied ? ['#00F5C4', '#00D4AA'] : [Colors.accent1, '#8B85FF']}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionIcon}>{copied ? '✅' : '📋'}</Text>
                            <Text style={styles.actionLabel}>{copied ? 'Copied!' : 'Copy'}</Text>
                        </LinearGradient>
                    </Pressable>

                    <Pressable style={styles.actionButton} onPress={handleShare}>
                        <LinearGradient
                            colors={['#FF2D92', '#FF6B6B']}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionIcon}>📤</Text>
                            <Text style={styles.actionLabel}>Share</Text>
                        </LinearGradient>
                    </Pressable>

                    <Pressable
                        style={styles.actionButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            navigation.goBack();
                        }}
                    >
                        <LinearGradient
                            colors={['#00F5C4', '#00D4AA']}
                            style={styles.actionGradient}
                        >
                            <Text style={styles.actionIcon}>⚡</Text>
                            <Text style={styles.actionLabel}>New</Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 60 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
    emptyText: { ...Typography.bodyLarge, color: Colors.textMuted, marginBottom: Spacing.lg },
    closeButton: { marginBottom: Spacing.md },
    closeText: { ...Typography.bodyMedium, color: Colors.accent1, fontWeight: '600' },
    successHeader: { alignItems: 'center', marginBottom: Spacing.xl },
    successIcon: { fontSize: 48, marginBottom: Spacing.sm },
    successTitle: { ...Typography.headlineLarge, color: Colors.textPrimary, fontWeight: '800' },
    excuseCard: { marginBottom: Spacing.md },
    excuseText: { ...Typography.bodyLarge, color: Colors.textPrimary, lineHeight: 26, fontWeight: '500' },
    riskCard: { marginBottom: Spacing.md, alignItems: 'center' },
    cardTitle: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.md, alignSelf: 'flex-start' },
    riskLabel: { ...Typography.headlineSmall, fontWeight: '700', marginTop: Spacing.sm },
    riskReason: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
    tipCard: { marginBottom: Spacing.md },
    tipText: { ...Typography.bodyMedium, color: Colors.textSecondary, lineHeight: 22 },
    tipMeta: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
    metaLabel: { ...Typography.caption, color: Colors.textMuted },
    metaValue: { ...Typography.caption, color: Colors.accent1, fontWeight: '600' },
    followUpCard: { marginBottom: Spacing.md },
    followUpText: { ...Typography.bodyMedium, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
    contextCard: { marginBottom: Spacing.lg },
    contextText: { ...Typography.bodyMedium, color: Colors.textSecondary, lineHeight: 22 },
    actionRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
    actionButton: { flex: 1, borderRadius: BorderRadius.xl, overflow: 'hidden' },
    actionGradient: { paddingVertical: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.xl },
    actionIcon: { fontSize: 24, marginBottom: Spacing.xs },
    actionLabel: { ...Typography.caption, color: '#FFF', fontWeight: '700' },
});
