// OFFHOOK — Contact Manager Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { GlassPanel, Button } from '../../../shared/components';
import { useContactStore, Contact } from '../../../stores/contactStore';
import { RELATIONSHIP_TYPES, SENSITIVITY_LEVELS } from '../../../shared/constants/categories';

export const ContactScreen: React.FC = () => {
    const navigation = useNavigation();
    const { contacts, loadContacts, addContact, deleteContact } = useContactStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRelationship, setNewRelationship] = useState('friend');
    const [newSensitivity, setNewSensitivity] = useState<'relaxed' | 'moderate' | 'strict'>('moderate');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadContacts();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await addContact({
            name: newName.trim(),
            relationship: newRelationship,
            sensitivity: newSensitivity,
            notes: '',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setNewName('');
        setShowAddModal(false);
    };

    const handleDelete = (contact: Contact) => {
        Alert.alert(
            'Delete Contact',
            `Remove ${contact.name} and their excuse history?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteContact(contact.id),
                },
            ]
        );
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactTap = (contact: Contact) => {
        Haptics.selectionAsync();
        (navigation as any).navigate('Generator', {
            contactName: contact.name,
            relationship: contact.relationship,
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0A0A1A', '#12122A', '#0A0A1A']} style={StyleSheet.absoluteFill} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Contacts</Text>
                        <Pressable onPress={() => setShowAddModal(true)}>
                            <LinearGradient colors={[Colors.accent1, Colors.accent2]} style={styles.addButton}>
                                <Text style={styles.addButtonText}>+</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Search */}
                <Animated.View entering={FadeInDown.delay(150).springify()}>
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput style={styles.searchInput} placeholder="Search contacts..." placeholderTextColor={Colors.textMuted} value={searchQuery} onChangeText={setSearchQuery} />
                    </View>
                </Animated.View>

                {/* Contact count */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text style={styles.countText}>{filteredContacts.length} contacts</Text>
                </Animated.View>

                {/* Contact List */}
                {filteredContacts.length === 0 ? (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <GlassPanel style={styles.emptyCard}>
                            <Text style={styles.emptyIcon}>👥</Text>
                            <Text style={styles.emptyText}>
                                No contacts yet.{'\n'}Add people you frequently make excuses to.
                            </Text>
                            <Button title="Add Contact" onPress={() => setShowAddModal(true)} size="sm" />
                        </GlassPanel>
                    </Animated.View>
                ) : (
                    filteredContacts.map((contact, index) => (
                        <Animated.View key={contact.id} entering={FadeInRight.delay(300 + index * 80).springify()}>
                            <Pressable onPress={() => handleContactTap(contact)} onLongPress={() => handleDelete(contact)}>
                                <GlassPanel style={styles.contactCard}>
                                    <View style={styles.contactRow}>
                                        <View style={styles.contactAvatar}>
                                            <Text style={styles.avatarText}>
                                                {RELATIONSHIP_TYPES.find((r) => r.id === contact.relationship)?.icon || '👤'}
                                            </Text>
                                        </View>
                                        <View style={styles.contactInfo}>
                                            <Text style={styles.contactName}>{contact.name}</Text>
                                            <Text style={styles.contactRelationship}>
                                                {contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1)} •{' '}
                                                {contact.sensitivity}
                                            </Text>
                                        </View>
                                        <View style={styles.contactStats}>
                                            <Text style={styles.statNumber}>{contact.excuseCount}</Text>
                                            <Text style={styles.statLabel}>excuses</Text>
                                        </View>
                                    </View>
                                    {contact.lastExcuseDate && (
                                        <Text style={styles.lastExcuse}>
                                            Last: {new Date(contact.lastExcuseDate).toLocaleDateString()}
                                        </Text>
                                    )}
                                </GlassPanel>
                            </Pressable>
                        </Animated.View>
                    ))
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Contact Modal */}
            <Modal visible={showAddModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <GlassPanel style={styles.modalContent} intensity="heavy">
                        <Text style={styles.modalTitle}>Add Contact</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor={Colors.textMuted}
                            value={newName}
                            onChangeText={setNewName}
                            autoFocus
                        />

                        <Text style={styles.modalLabel}>Relationship</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                            {RELATIONSHIP_TYPES.map((rel) => (
                                <Pressable
                                    key={rel.id}
                                    style={[styles.pill, newRelationship === rel.id && styles.pillActive]}
                                    onPress={() => setNewRelationship(rel.id)}
                                >
                                    <Text style={styles.pillIcon}>{rel.icon}</Text>
                                    <Text style={[styles.pillText, newRelationship === rel.id && styles.pillTextActive]}>
                                        {rel.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text style={styles.modalLabel}>Sensitivity</Text>
                        <View style={styles.sensitivityRow}>
                            {SENSITIVITY_LEVELS.map((s) => (
                                <Pressable
                                    key={s.id}
                                    style={[styles.sensPill, newSensitivity === s.id && styles.sensPillActive]}
                                    onPress={() => setNewSensitivity(s.id as any)}
                                >
                                    <Text style={[styles.sensText, newSensitivity === s.id && styles.sensTextActive]}>
                                        {s.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <Button title="Cancel" variant="ghost" onPress={() => setShowAddModal(false)} />
                            <Button title="Add Contact" onPress={handleAdd} />
                        </View>
                    </GlassPanel>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.primary },
    scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 60 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: Spacing.md,
    },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
        borderWidth: 1, borderColor: Colors.glassBorder, marginBottom: Spacing.md,
    },
    searchIcon: { fontSize: 16, marginRight: Spacing.sm },
    searchInput: { flex: 1, color: Colors.textPrimary, ...Typography.bodyMedium, paddingVertical: Spacing.md },
    headerTitle: { ...Typography.headlineMedium, color: Colors.textPrimary },
    addButton: {
        width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    },
    addButtonText: { fontSize: 22, color: '#FFF', fontWeight: '700', marginTop: -2 },
    countText: { ...Typography.bodySmall, color: Colors.textMuted, marginBottom: Spacing.lg },
    emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
    emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
    emptyText: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
    contactCard: { marginBottom: Spacing.sm },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    contactAvatar: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: `${Colors.accent1}15`, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 22 },
    contactInfo: { flex: 1 },
    contactName: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '600' },
    contactRelationship: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
    contactStats: { alignItems: 'center' },
    statNumber: { ...Typography.headlineMedium, color: Colors.accent1 },
    statLabel: { ...Typography.caption, color: Colors.textMuted },
    lastExcuse: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.sm, marginLeft: 60 },
    modalOverlay: {
        flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', paddingHorizontal: Spacing.xl,
    },
    modalContent: { padding: Spacing.xl },
    modalTitle: { ...Typography.headlineLarge, color: Colors.textPrimary, marginBottom: Spacing.xl },
    input: {
        backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
        padding: Spacing.md, color: Colors.textPrimary, ...Typography.bodyLarge,
        borderWidth: 1, borderColor: Colors.glassBorder, marginBottom: Spacing.lg,
    },
    modalLabel: { ...Typography.labelMedium, color: Colors.textSecondary, marginBottom: Spacing.sm },
    pillRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
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
    sensitivityRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
    sensPill: {
        flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight, alignItems: 'center',
        borderWidth: 1, borderColor: Colors.glassBorder,
    },
    sensPillActive: { backgroundColor: `${Colors.accent1}20`, borderColor: Colors.accent1 },
    sensText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    sensTextActive: { color: Colors.accent1 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm },
});
