// OFFHOOK — Settings Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Alert,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';
import { useUserStore } from '../../../stores/userStore';
import { useExcuseStore } from '../../../stores/excuseStore';


import { useMonetizationStore } from '../../../stores/monetizationStore';

export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { username, email, region, language, apiKey, logout, setApiKey } = useUserStore();
    const { excuseHistory, dailyGenerations, maxDailyFree } = useExcuseStore();
    const { hasPremiumAccess } = useMonetizationStore();
    const isPro = hasPremiumAccess();
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
    const [apiKeySaved, setApiKeySaved] = useState(false);

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

    const handleSaveApiKey = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await setApiKey(apiKeyInput.trim());
        setApiKeySaved(true);
        setTimeout(() => setApiKeySaved(false), 2000);
    };

    const handleDeleteAllData = () => {
        Alert.alert(
            'Delete All Data',
            'This will permanently erase all your excuse history, contacts, and settings. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Everything',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            Alert.alert('Data Deleted', 'All data has been erased. Restart the app.');
                        } catch {
                            Alert.alert('Error', 'Failed to delete data. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Could not open link.');
        });
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
                                    {isPro ? '∞' : `${Math.max(0, maxDailyFree - dailyGenerations)}`}
                                </Text>
                                <Text style={styles.statLabel}>Left Today</Text>
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

                {/* Claude API Key */}
                <Animated.View entering={FadeInDown.delay(350).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>🤖 AI Configuration</Text>
                        <Text style={styles.fieldDesc}>
                            Enter your Anthropic Claude API key to enable real AI generation.
                            Without a key, OFFHOOK uses its built-in offline engine.
                        </Text>
                        <View style={styles.apiKeyRow}>
                            <TextInput
                                style={[styles.input, styles.apiKeyInput]}
                                placeholder="sk-ant-api03-..."
                                placeholderTextColor={Colors.textMuted}
                                value={apiKeyInput}
                                onChangeText={setApiKeyInput}
                                secureTextEntry={!showApiKey}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setShowApiKey(!showApiKey)}
                            >
                                <Text style={styles.eyeIcon}>{showApiKey ? '🙈' : '👁️'}</Text>
                            </Pressable>
                        </View>
                        <Button
                            title={apiKeySaved ? '✅ Saved!' : 'Save API Key'}
                            onPress={handleSaveApiKey}
                            variant={apiKeySaved ? 'ghost' : 'primary'}
                            size="sm"
                        />
                        {apiKey && apiKey.length > 10 && (
                            <Text style={styles.apiKeyStatus}>
                                ✅ API key configured — real AI generation active
                            </Text>
                        )}
                    </GlassPanel>
                </Animated.View>

                {/* Preferences */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
                        <SettingRow
                            label="Region"
                            value={region}
                            onPress={() => {
                                Alert.alert('Region', 'Region is auto-detected from your location.');
                            }}
                        />
                        <SettingRow
                            label="Language"
                            value={language.toUpperCase()}
                            onPress={() => {
                                Alert.alert('Language', 'Language settings coming in v1.1.');
                            }}
                        />
                        <SettingRow label="Theme" value="Dark (Always)" onPress={() => { }} />
                    </GlassPanel>
                </Animated.View>

                {/* Store & Support */}
                <Animated.View entering={FadeInDown.delay(450).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>💎 Extras</Text>
                        <SettingRow
                            label="Refer a Friend (Get Credits)"
                            value="🎁"
                            onPress={() => (navigation as any).navigate('Referral')}
                        />
                        <SettingRow
                            label="Get More Excuses"
                            value="🪙"
                            onPress={() => (navigation as any).navigate('CreditPack')}
                        />
                        <SettingRow
                            label="Tip Jar"
                            value="💖"
                            onPress={() => (navigation as any).navigate('TipJar')}
                        />
                    </GlassPanel>
                </Animated.View>

                {/* Privacy & Security */}
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassPanel>
                        <Text style={styles.sectionTitle}>🔒 Privacy & Security</Text>
                        <SettingRow
                            label="Delete All Data"
                            value=""
                            onPress={handleDeleteAllData}
                            destructive
                        />
                        <SettingRow
                            label="Privacy Policy"
                            value=""
                            onPress={() => handleOpenLink('https://offhook.app/privacy')}
                        />
                        <SettingRow
                            label="Terms of Service"
                            value=""
                            onPress={() => handleOpenLink('https://offhook.app/terms')}
                        />
                        <SettingRow
                            label="Support"
                            value=""
                            onPress={() => handleOpenLink('mailto:support@offhook.app')}
                        />
                    </GlassPanel>
                </Animated.View>

                {/* Pro Upgrade */}
                {!isPro && (
                    <Animated.View entering={FadeInDown.delay(600).springify()}>
                        <Pressable onPress={() => (navigation as any).navigate('Premium')}>
                            <LinearGradient
                                colors={['#6C63FF', '#FF2D92']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.proBanner}
                            >
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
                <Text style={styles.version}>OFFHOOK v1.0.0 • Powered by Claude AI</Text>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const SettingRow: React.FC<{
    label: string;
    value: string;
    onPress: () => void;
    destructive?: boolean;
}> = ({ label, value, onPress, destructive }) => (
    <Pressable style={styles.settingRow} onPress={onPress}>
        <Text style={[styles.settingLabel, destructive && styles.settingLabelDestructive]}>{label}</Text>
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
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    statItem: { flex: 1, minWidth: '40%', alignItems: 'center', paddingVertical: Spacing.sm },
    statNumber: { ...Typography.displaySmall, color: Colors.accent1 },
    statLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
    fieldDesc: {
        ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 18,
        marginBottom: Spacing.md,
    },
    apiKeyRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    input: {
        backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        padding: Spacing.md, color: Colors.textPrimary, ...Typography.bodySmall,
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    apiKeyInput: { flex: 1 },
    eyeButton: {
        width: 44, height: 44, borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    eyeIcon: { fontSize: 18 },
    apiKeyStatus: {
        ...Typography.caption, color: Colors.riskLow, marginTop: Spacing.sm,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider,
    },
    settingLabel: { ...Typography.bodyLarge, color: Colors.textPrimary },
    settingLabelDestructive: { color: Colors.riskCritical },
    settingValue: { ...Typography.bodyMedium, color: Colors.textMuted },
    proBanner: { borderRadius: BorderRadius.xl, padding: Spacing.xl },
    proBannerTitle: { ...Typography.headlineMedium, color: '#FFF', fontWeight: '800' },
    proBannerSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
    version: {
        ...Typography.caption, color: Colors.textMuted, textAlign: 'center',
        marginTop: Spacing.xl,
    },
});
