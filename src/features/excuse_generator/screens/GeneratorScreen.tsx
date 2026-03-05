// OFFHOOK — Excuse Generator Screen
// Category, tone, contact, situation selection → generate excuse
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button, CategorySelector } from '../../../shared/components';
import { useExcuseStore } from '../../../stores/excuseStore';
import { useContactStore } from '../../../stores/contactStore';
import { useUserStore } from '../../../stores/userStore';
import {
    EXCUSE_CATEGORIES,
    TONES,
    SITUATION_TYPES,
    URGENCY_LEVELS,
    RELATIONSHIP_TYPES,
} from '../../../shared/constants/categories';
import type { TabScreenProps } from '../../../navigation/types';

export const GeneratorScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<TabScreenProps<'Generator'>['route']>();
    const { generateExcuse, isGenerating, error, setCategory, setTone, setSituation, setUrgency } = useExcuseStore();
    const { contacts } = useContactStore();
    const { isPro } = useUserStore();

    const [contactName, setContactName] = useState('');
    const [relationship, setRelationship] = useState('friend');
    const [selectedCategory, setSelectedCategory] = useState('work');
    const [selectedTone, setSelectedTone] = useState('apologetic');
    const [selectedSituation, setSelectedSituation] = useState('cancellation');
    const [selectedUrgency, setSelectedUrgency] = useState('medium');
    const [situation, setSituationText] = useState('');
    const [showContactList, setShowContactList] = useState(false);
    const [contactSearch, setContactSearch] = useState('');

    // Pre-fill from navigation params
    useEffect(() => {
        const params = route.params;
        if (params?.contactName) {
            setContactName(params.contactName);
        }
        if (params?.relationship) {
            setRelationship(params.relationship);
        }
    }, [route.params]);

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(contactSearch.toLowerCase())
    );

    const handleGenerate = async () => {
        if (!contactName.trim()) {
            Alert.alert('Missing Contact', 'Please enter who the excuse is for.');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            await generateExcuse({
                contactName: contactName.trim(),
                relationship,
                category: selectedCategory,
                tone: selectedTone,
                situationType: selectedSituation,
                urgency: selectedUrgency,
                situation: situation.trim(),
            });

            // Navigate to result screen
            (navigation as any).navigate('Result');
        } catch (err: any) {
            Alert.alert('Generation Failed', err.message || 'Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0A0A1A', '#12122A', '#0A0A1A']} style={StyleSheet.absoluteFill} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Text style={styles.screenTitle}>Create Excuse</Text>
                    <Text style={styles.screenSubtitle}>Tell us the situation and we'll craft the perfect excuse</Text>
                </Animated.View>

                {/* Contact Input */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>👤 Who is this for?</Text>
                        <View style={styles.contactInputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Contact name"
                                placeholderTextColor={Colors.textMuted}
                                value={contactName}
                                onChangeText={(text) => {
                                    setContactName(text);
                                    setContactSearch(text);
                                    setShowContactList(text.length > 0);
                                }}
                            />
                            {contacts.length > 0 && (
                                <Pressable
                                    style={styles.contactPickerBtn}
                                    onPress={() => setShowContactList(!showContactList)}
                                >
                                    <Text style={styles.contactPickerIcon}>📋</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Contact suggestions */}
                        {showContactList && filteredContacts.length > 0 && (
                            <View style={styles.contactSuggestions}>
                                {filteredContacts.slice(0, 5).map((contact) => (
                                    <Pressable
                                        key={contact.id}
                                        style={styles.contactSuggestion}
                                        onPress={() => {
                                            setContactName(contact.name);
                                            setRelationship(contact.relationship);
                                            setShowContactList(false);
                                            Haptics.selectionAsync();
                                        }}
                                    >
                                        <Text style={styles.contactSuggestionText}>
                                            {RELATIONSHIP_TYPES.find(r => r.id === contact.relationship)?.icon}{' '}
                                            {contact.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {/* Relationship pills */}
                        <Text style={styles.fieldLabel}>Relationship</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                            {RELATIONSHIP_TYPES.map((rel) => (
                                <Pressable
                                    key={rel.id}
                                    style={[styles.pill, relationship === rel.id && styles.pillActive]}
                                    onPress={() => { setRelationship(rel.id); Haptics.selectionAsync(); }}
                                >
                                    <Text style={styles.pillIcon}>{rel.icon}</Text>
                                    <Text style={[styles.pillText, relationship === rel.id && styles.pillTextActive]}>
                                        {rel.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </GlassPanel>
                </Animated.View>

                {/* Category */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>📁 Excuse Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                            {EXCUSE_CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat.id}
                                    style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}
                                    onPress={() => { setSelectedCategory(cat.id); Haptics.selectionAsync(); }}
                                >
                                    <Text style={styles.categoryPillIcon}>{cat.icon}</Text>
                                    <Text style={[styles.categoryPillText, selectedCategory === cat.id && styles.categoryPillTextActive]}>
                                        {cat.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </GlassPanel>
                </Animated.View>

                {/* Tone */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>🎭 Tone</Text>
                        <View style={styles.toneGrid}>
                            {TONES.map((tone) => (
                                <Pressable
                                    key={tone.id}
                                    style={[styles.tonePill, selectedTone === tone.id && styles.tonePillActive]}
                                    onPress={() => { setSelectedTone(tone.id); Haptics.selectionAsync(); }}
                                >
                                    <Text style={[styles.tonePillText, selectedTone === tone.id && styles.tonePillTextActive]}>
                                        {tone.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Urgency */}
                <Animated.View entering={FadeInDown.delay(450).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>⏱️ Urgency</Text>
                        <View style={styles.urgencyRow}>
                            {URGENCY_LEVELS.map((urg) => (
                                <Pressable
                                    key={urg.id}
                                    style={[styles.urgencyPill, selectedUrgency === urg.id && styles.urgencyPillActive]}
                                    onPress={() => { setSelectedUrgency(urg.id); Haptics.selectionAsync(); }}
                                >
                                    <Text style={[styles.urgencyPillText, selectedUrgency === urg.id && styles.urgencyPillTextActive]}>
                                        {urg.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </GlassPanel>
                </Animated.View>

                {/* Extra details */}
                <Animated.View entering={FadeInDown.delay(500).springify()}>
                    <GlassPanel style={styles.section}>
                        <Text style={styles.sectionTitle}>📝 Additional Context</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Any specific details? (optional)"
                            placeholderTextColor={Colors.textMuted}
                            value={situation}
                            onChangeText={setSituationText}
                            multiline
                            numberOfLines={3}
                        />
                    </GlassPanel>
                </Animated.View>

                {/* Generate Button */}
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Pressable onPress={handleGenerate} disabled={isGenerating}>
                        <LinearGradient
                            colors={isGenerating ? ['#333', '#444'] : [Colors.accent1, '#8B85FF', Colors.accent2]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.generateButton}
                        >
                            <Text style={styles.generateButtonText}>
                                {isGenerating ? '⏳ Generating...' : '⚡ Generate Excuse'}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                {error && (
                    <Animated.View entering={FadeInDown.springify()}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </Animated.View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 60 },
    screenTitle: { ...Typography.displaySmall, color: Colors.textPrimary, fontWeight: '800' },
    screenSubtitle: { ...Typography.bodyMedium, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.xl },
    section: { marginBottom: Spacing.md },
    sectionTitle: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.md },
    contactInputRow: { flexDirection: 'row', gap: Spacing.sm },
    input: {
        flex: 1, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        padding: Spacing.md, color: Colors.textPrimary, ...Typography.bodyLarge,
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    contactPickerBtn: {
        width: 48, height: 48, borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceLight,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.glassBorder,
    },
    contactPickerIcon: { fontSize: 20 },
    contactSuggestions: {
        backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        marginTop: Spacing.xs, borderWidth: 1, borderColor: Colors.glassBorder, overflow: 'hidden',
    },
    contactSuggestion: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.glassBorder },
    contactSuggestionText: { ...Typography.bodyMedium, color: Colors.textPrimary },
    fieldLabel: { ...Typography.labelMedium, color: Colors.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.sm },
    pillRow: { flexDirection: 'row', gap: Spacing.sm, paddingBottom: 2 },
    pill: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round, backgroundColor: Colors.surfaceLight,
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    pillActive: { backgroundColor: `${Colors.accent1}20`, borderColor: Colors.accent1 },
    pillIcon: { fontSize: 14 },
    pillText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    pillTextActive: { color: Colors.accent1 },
    categoryPill: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round, backgroundColor: Colors.surfaceLight,
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    categoryPillActive: { backgroundColor: `${Colors.accent1}20`, borderColor: Colors.accent1 },
    categoryPillIcon: { fontSize: 16 },
    categoryPillText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
    categoryPillTextActive: { color: Colors.accent1 },
    toneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    tonePill: {
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round, backgroundColor: Colors.surfaceLight,
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    tonePillActive: { backgroundColor: `${Colors.accent1}20`, borderColor: Colors.accent1 },
    tonePillText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
    tonePillTextActive: { color: Colors.accent1 },
    urgencyRow: { flexDirection: 'row', gap: Spacing.sm },
    urgencyPill: {
        flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight, alignItems: 'center',
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    urgencyPillActive: { backgroundColor: `${Colors.accent1}20`, borderColor: Colors.accent1 },
    urgencyPillText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    urgencyPillTextActive: { color: Colors.accent1 },
    textArea: { height: 80, textAlignVertical: 'top' },
    generateButton: {
        paddingVertical: Spacing.lg, borderRadius: BorderRadius.xl, alignItems: 'center',
        marginTop: Spacing.md,
        shadowColor: Colors.accent1, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    generateButtonText: { ...Typography.headlineMedium, color: '#FFF', fontWeight: '800' },
    errorText: { ...Typography.bodyMedium, color: Colors.riskCritical, textAlign: 'center', marginTop: Spacing.md },
});
