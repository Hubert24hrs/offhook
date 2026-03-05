// OFFHOOK — Excuse Generator Screen
// Full context setup + generation
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button, CategorySelector } from '../../../shared/components';
import { useExcuseStore } from '../../../stores/excuseStore';
import { useContactStore } from '../../../stores/contactStore';
import {
    TONES,
    SITUATION_TYPES,
    URGENCY_LEVELS,
} from '../../../shared/constants/categories';
import type { ExcuseContext } from '../../../core/ai';

interface GeneratorScreenProps {
    onNavigate: (screen: string) => void;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ onNavigate }) => {
    const {
        selectedCategory,
        selectedTone,
        selectedSituation,
        selectedUrgency,
        isGenerating,
        generationError,
        setSelection,
        generateExcuse,
        canGenerate,
    } = useExcuseStore();

    const { contacts } = useContactStore();
    const [contactName, setContactName] = useState('');
    const [relationship, setRelationship] = useState('friend');

    const handleGenerate = async () => {
        if (!canGenerate()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const context: ExcuseContext = {
            location: { city: 'Lagos', country: 'Nigeria' },
            weather: { condition: 'Partly Cloudy', temperature: 24, description: 'Warm with scattered clouds' },
            currentTime: new Date().toLocaleTimeString(),
            dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
            contactName: contactName || 'Someone',
            relationship,
            excuseHistory: [],
            usedThemes: [],
            culturalRegion: 'Nigeria',
            tone: selectedTone,
            situationType: selectedSituation,
            urgency: selectedUrgency,
            category: selectedCategory,
        };

        await generateExcuse(context);
        onNavigate('result');
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
                            <Text style={styles.backButton}>← Back</Text>
                        </Pressable>
                        <Text style={styles.headerTitle}>Generate Excuse</Text>
                        <View style={{ width: 50 }} />
                    </View>
                </Animated.View>

                {/* Contact Input */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>Who is this for?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contact name..."
                            placeholderTextColor={Colors.textMuted}
                            value={contactName}
                            onChangeText={setContactName}
                        />
                        <Text style={styles.subLabel}>Relationship</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.pillRow}
                        >
                            {['boss', 'partner', 'parent', 'friend', 'colleague', 'client'].map(
                                (rel) => (
                                    <Pressable
                                        key={rel}
                                        style={[
                                            styles.pill,
                                            relationship === rel && styles.pillActive,
                                        ]}
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            setRelationship(rel);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.pillText,
                                                relationship === rel && styles.pillTextActive,
                                            ]}
                                        >
                                            {rel.charAt(0).toUpperCase() + rel.slice(1)}
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </ScrollView>
                    </GlassPanel>
                </Animated.View>

                {/* Category */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <CategorySelector
                        selected={selectedCategory}
                        onSelect={(cat) => setSelection('selectedCategory', cat.id)}
                    />
                </Animated.View>

                {/* Tone */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>Tone</Text>
                        <View style={styles.optionGrid}>
                            {TONES.map((tone) => (
                                <Pressable
                                    key={tone.id}
                                    style={[
                                        styles.optionCard,
                                        selectedTone === tone.id && styles.optionActive,
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setSelection('selectedTone', tone.id);
                                    }}
                                >
                                    <Text style={styles.optionIcon}>{tone.icon}</Text>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            selectedTone === tone.id && styles.optionLabelActive,
                                        ]}
                                    >
                                        {tone.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Situation */}
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>Situation</Text>
                        <View style={styles.optionGrid}>
                            {SITUATION_TYPES.map((sit) => (
                                <Pressable
                                    key={sit.id}
                                    style={[
                                        styles.optionCard,
                                        selectedSituation === sit.id && styles.optionActive,
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setSelection('selectedSituation', sit.id);
                                    }}
                                >
                                    <Text style={styles.optionIcon}>{sit.icon}</Text>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            selectedSituation === sit.id && styles.optionLabelActive,
                                        ]}
                                    >
                                        {sit.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Urgency */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>Urgency Level</Text>
                        <View style={styles.urgencyRow}>
                            {URGENCY_LEVELS.map((urg) => (
                                <Pressable
                                    key={urg.id}
                                    style={[
                                        styles.urgencyPill,
                                        {
                                            borderColor:
                                                selectedUrgency === urg.id
                                                    ? urg.color
                                                    : Colors.glassBorder,
                                            backgroundColor:
                                                selectedUrgency === urg.id
                                                    ? `${urg.color}20`
                                                    : 'transparent',
                                        },
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setSelection('selectedUrgency', urg.id);
                                    }}
                                >
                                    <View
                                        style={[styles.urgencyDot, { backgroundColor: urg.color }]}
                                    />
                                    <Text
                                        style={[
                                            styles.urgencyLabel,
                                            selectedUrgency === urg.id && { color: urg.color },
                                        ]}
                                    >
                                        {urg.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Generate Button */}
                <Animated.View entering={FadeInDown.delay(700).springify()}>
                    {generationError && (
                        <View style={styles.errorCard}>
                            <Text style={styles.errorText}>⚠️ {generationError}</Text>
                        </View>
                    )}

                    <Pressable
                        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                        onPress={handleGenerate}
                        disabled={isGenerating}
                    >
                        <LinearGradient
                            colors={
                                isGenerating
                                    ? [Colors.surfaceLight, Colors.surfaceLight]
                                    : [Colors.accent1, '#8B85FF', Colors.accent2]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.generateGradient}
                        >
                            {isGenerating ? (
                                <View style={styles.loadingRow}>
                                    <ActivityIndicator color={Colors.accent1} size="small" />
                                    <Text style={styles.loadingText}>Crafting your excuse...</Text>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.generateIcon}>🎯</Text>
                                    <Text style={styles.generateText}>Generate Excuse</Text>
                                </>
                            )}
                        </LinearGradient>
                    </Pressable>
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
        marginBottom: Spacing.xl,
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
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.headlineSmall,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    subLabel: {
        ...Typography.labelMedium,
        color: Colors.textSecondary,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    input: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        color: Colors.textPrimary,
        ...Typography.bodyLarge,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    pillRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    pill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    pillActive: {
        backgroundColor: `${Colors.accent1}20`,
        borderColor: Colors.accent1,
    },
    pillText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    pillTextActive: {
        color: Colors.accent1,
    },
    optionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    optionCard: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        minWidth: 80,
    },
    optionActive: {
        backgroundColor: `${Colors.accent1}20`,
        borderColor: Colors.accent1,
    },
    optionIcon: {
        fontSize: 22,
        marginBottom: Spacing.xxs,
    },
    optionLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    optionLabelActive: {
        color: Colors.accent1,
    },
    urgencyRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    urgencyPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    urgencyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    urgencyLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    errorCard: {
        backgroundColor: `${Colors.accent3}15`,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: `${Colors.accent3}30`,
    },
    errorText: {
        ...Typography.bodySmall,
        color: Colors.accent3,
    },
    generateButton: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: Colors.accent1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    generateButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    generateGradient: {
        paddingVertical: Spacing.xl,
        alignItems: 'center',
        borderRadius: BorderRadius.xl,
    },
    generateIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    generateText: {
        ...Typography.headlineMedium,
        color: '#FFF',
        fontWeight: '800',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    loadingText: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
    },
});
