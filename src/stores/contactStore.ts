// OFFHOOK — Contact Store (Zustand)
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contact {
    id: string;
    name: string;
    relationship: string;
    sensitivity: 'relaxed' | 'moderate' | 'strict';
    excuseCount: number;
    lastExcuseDate: string | null;
    notes: string;
    createdAt: string;
}

interface ContactState {
    contacts: Contact[];
    selectedContact: Contact | null;

    // Actions
    loadContacts: () => Promise<void>;
    addContact: (contact: Omit<Contact, 'id' | 'excuseCount' | 'lastExcuseDate' | 'createdAt'>) => Promise<void>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    selectContact: (contact: Contact | null) => void;
    incrementExcuseCount: (id: string) => Promise<void>;
}

const STORAGE_KEY = '@offhook_contacts';

export const useContactStore = create<ContactState>((set, get) => ({
    contacts: [],
    selectedContact: null,

    loadContacts: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                set({ contacts: JSON.parse(data) });
            }
        } catch (error) {
            console.warn('Failed to load contacts:', error);
        }
    },

    addContact: async (contactData) => {
        const newContact: Contact = {
            ...contactData,
            id: Date.now().toString(),
            excuseCount: 0,
            lastExcuseDate: null,
            createdAt: new Date().toISOString(),
        };

        const updated = [...get().contacts, newContact];
        set({ contacts: updated });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    updateContact: async (id, updates) => {
        const updated = get().contacts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
        );
        set({ contacts: updated });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    deleteContact: async (id) => {
        const updated = get().contacts.filter((c) => c.id !== id);
        set({ contacts: updated });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    selectContact: (contact) => {
        set({ selectedContact: contact });
    },

    incrementExcuseCount: async (id) => {
        const updated = get().contacts.map((c) =>
            c.id === id
                ? { ...c, excuseCount: c.excuseCount + 1, lastExcuseDate: new Date().toISOString() }
                : c
        );
        set({ contacts: updated });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
}));
