// OFFHOOK — Settings Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';
import { useUserStore } from '../../../stores/userStore';
import { useExcuseStore } from '../../../stores/excuseStore';


export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { username, email, region, language, isPro, logout, updatePreferences } = useUserStore();
    const { excuseHistory, dailyGenerations } = useExcuseStore();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0A0A1A', '#12122A', '#0A0A1A']} style={StyleSheet.absoluteFill} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 50 }} />
                    </View>
                </Animated.View>

                {/* Profile Card */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassPanel style={styles.profileCard} glowColor={Colors.accent1}>
                        <View style={styles.profileRow}>
                            <LinearGradient colors={[Colors.accent1, Colors.accent2]} style={styles.avatar}>
                                <Text style={styles.avatarText}>{(username || 'U')[0].toUpperCase()}</Text>
                            </LinearGradient>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{username || 'Guest'}</Text>
                                <Text style={styles.profileEmail}>{email || 'Not signed in'}</Text>
                                {isPro && (
                                    <View style={styles.proBadge}>
                                        <Text style={styles.proBadgeText}>⭐ PRO</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Stats */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>📊 Your Stats</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{excuseHistory.length}</Text>
                                <Text style={styles.statLabel}>Total Excuses</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{dailyGenerations}</Text>
                                <Text style={styles.statLabel}>Today</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {excuseHistory.length > 0
                                        ? Math.round(excuseHistory.reduce((a, b) => a + b.riskScore, 0) / excuseHistory.length)
                                        : 0}
                                </Text>
                                <Text style={styles.statLabel}>Avg Risk</Text>
                            </View>
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Settings List */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
                        <SettingRow label="Region" value={region} onPress={() => { }} />
                        <SettingRow label="Language" value={language.toUpperCase()} onPress={() => { }} />
                        <SettingRow label="Theme" value="Dark (Always)" onPress={() => { }} />
                    </GlassPanel>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>🔒 Privacy & Security</Text>
                        <SettingRow label="Biometric Lock" value="Off" onPress={() => { }} />
                        <SettingRow label="Delete All Data" value="" onPress={() => {
                            Alert.alert('Delete Data', 'This will erase all your excuse history and contacts.', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => { } },
                            ]);
                        }} />
                        <SettingRow label="Privacy Policy" value="" onPress={() => { }} />
                        <SettingRow label="Terms of Service" value="" onPress={() => { }} />
                    </GlassPanel>
                </Animated.View>

                {/* Pro Upgrade */}
                {!isPro && (
                    <Animated.View entering={FadeInDown.delay(600).springify()}>
                        <Pressable onPress={() => (navigation as any).navigate('Premium')}>
                            <LinearGradient colors={['#6C63FF', '#FF2D92']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.proBanner}>
                                <Text style={styles.proBannerTitle}>⭐ Upgrade to OFFHOOK Pro</Text>
                                <Text style={styles.proBannerSub}>Unlimited excuses • All features • Ad-free</Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}

                {/* Logout */}
                <Animated.View entering={FadeInDown.delay(700).springify()}>
                    <Button title="Logout" variant="outline" fullWidth onPress={handleLogout} />
                </Animated.View>

                {/* Version */}
                <Text style={styles.version}>OFFHOOK v1.0.0 (MVP)</Text>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const SettingRow: React.FC<{ label: string; value: string; onPress: () => void }> = ({
    label, value, onPress,
}) => (
    <Pressable style={styles.settingRow} onPress={onPress}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingValue}>{value} →</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 60, gap: Spacing.md },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: Spacing.md,
    },
    backButton: { ...Typography.bodyMedium, color: Colors.accent1, fontWeight: '600' },
    headerTitle: { ...Typography.headlineMedium, color: Colors.textPrimary },
    profileCard: {},
    profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
    avatar: {
        width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { ...Typography.headlineLarge, color: '#FFF' },
    profileInfo: { flex: 1 },
    profileName: { ...Typography.headlineSmall, color: Colors.textPrimary },
    profileEmail: { ...Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
    proBadge: {
        backgroundColor: `${Colors.accent1}20`, paddingHorizontal: Spacing.sm,
        paddingVertical: 2, borderRadius: BorderRadius.sm, marginTop: Spacing.xs, alignSelf: 'flex-start',
    },
    proBadgeText: { ...Typography.caption, color: Colors.accent1, fontWeight: '700' },
    sectionTitle: { ...Typography.headlineSmall, color: Colors.textPrimary, marginBottom: Spacing.md },
    statsGrid: { flexDirection: 'row', gap: Spacing.md },
    statItem: { flex: 1, alignItems: 'center' },
    statNumber: { ...Typography.displaySmall, color: Colors.accent1 },
    statLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
    settingRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider,
    },
    settingLabel: { ...Typography.bodyLarge, color: Colors.textPrimary },
    settingValue: { ...Typography.bodyMedium, color: Colors.textMuted },
    proBanner: { borderRadius: BorderRadius.xl, padding: Spacing.xl },
    proBannerTitle: { ...Typography.headlineMedium, color: '#FFF', fontWeight: '800' },
    proBannerSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
    version: {
        ...Typography.caption, color: Colors.textMuted, textAlign: 'center',
        marginTop: Spacing.xl,
    },
});
