// OFFHOOK — Auth Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';
import { useUserStore } from '../../../stores/userStore';
import type { RootStackScreenProps } from '../../../navigation/types';

export const AuthScreen: React.FC<RootStackScreenProps<'Auth'>> = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login } = useUserStore();

    const handleAuth = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // For MVP, skip real auth and just log in
        await login(email || 'user@offhook.ai', name || 'User');
    };

    const handleSkip = async () => {
        Haptics.selectionAsync();
        await login('guest@offhook.ai', 'Guest');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0A1A', '#1A1A2E', '#0A0A1A']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Logo */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.logoContainer}>
                    <LinearGradient
                        colors={[Colors.accent1, Colors.accent2]}
                        style={styles.logoBg}
                    >
                        <Text style={styles.logoText}>⚡</Text>
                    </LinearGradient>
                    <Text style={styles.appName}>OFFHOOK</Text>
                    <Text style={styles.tagline}>Your secret weapon</Text>
                </Animated.View>

                {/* Form */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel style={styles.formCard} intensity="heavy">
                        <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

                        {!isLogin && (
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={Colors.textMuted}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Button
                            title={isLogin ? 'Sign In' : 'Create Account'}
                            onPress={handleAuth}
                            fullWidth
                            size="lg"
                        />

                        {/* Social login */}
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.socialRow}>
                            <Pressable style={styles.socialButton} onPress={handleAuth}>
                                <Text style={styles.socialIcon}>🔵</Text>
                                <Text style={styles.socialText}>Google</Text>
                            </Pressable>
                            <Pressable style={styles.socialButton} onPress={handleAuth}>
                                <Text style={styles.socialIcon}>⚫</Text>
                                <Text style={styles.socialText}>Apple</Text>
                            </Pressable>
                        </View>

                        {/* Toggle */}
                        <Pressable
                            onPress={() => {
                                Haptics.selectionAsync();
                                setIsLogin(!isLogin);
                            }}
                            style={styles.toggleButton}
                        >
                            <Text style={styles.toggleText}>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <Text style={styles.toggleLink}>
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </Text>
                            </Text>
                        </Pressable>
                    </GlassPanel>
                </Animated.View>

                {/* Skip */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Pressable onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip for now →</Text>
                    </Pressable>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl },
    logoContainer: { alignItems: 'center', marginBottom: Spacing.xxl },
    logoBg: {
        width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    logoText: { fontSize: 40 },
    appName: {
        ...Typography.displayMedium, color: Colors.textPrimary, fontWeight: '800',
        letterSpacing: 4,
    },
    tagline: { ...Typography.bodyMedium, color: Colors.textSecondary, marginTop: Spacing.xs },
    formCard: { marginBottom: Spacing.xl },
    formTitle: { ...Typography.headlineLarge, color: Colors.textPrimary, marginBottom: Spacing.xl },
    input: {
        backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        padding: Spacing.md, color: Colors.textPrimary, ...Typography.bodyLarge,
        borderWidth: 1, borderColor: Colors.glassBorder, marginBottom: Spacing.md,
    },
    dividerRow: {
        flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.xl, gap: Spacing.md,
    },
    divider: { flex: 1, height: 1, backgroundColor: Colors.divider },
    dividerText: { ...Typography.caption, color: Colors.textMuted },
    socialRow: { flexDirection: 'row', gap: Spacing.sm },
    socialButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.glassBorder,
    },
    socialIcon: { fontSize: 18 },
    socialText: { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '600' },
    toggleButton: { marginTop: Spacing.xl, alignItems: 'center' },
    toggleText: { ...Typography.bodyMedium, color: Colors.textSecondary },
    toggleLink: { color: Colors.accent1, fontWeight: '600' },
    skipButton: { alignItems: 'center', paddingVertical: Spacing.md },
    skipText: { ...Typography.bodyMedium, color: Colors.textMuted },
});
