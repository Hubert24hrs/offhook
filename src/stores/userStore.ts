// OFFHOOK — User Store (Zustand)
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    // Auth
    isAuthenticated: boolean;
    hasCompletedOnboarding: boolean;
    username: string;
    email: string;

    // Preferences
    region: string;
    language: string;
    darkMode: boolean;
    isPro: boolean;
    apiKey: string;
    weatherApiKey: string;

    // Actions
    loadUser: () => Promise<void>;
    setOnboardingComplete: () => Promise<void>;
    login: (email: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    updatePreferences: (prefs: Partial<UserState>) => Promise<void>;
    setProStatus: (isPro: boolean) => Promise<void>;
    setApiKey: (key: string) => Promise<void>;
    setWeatherApiKey: (key: string) => Promise<void>;
}

const STORAGE_KEY = '@offhook_user';

export const useUserStore = create<UserState>((set, get) => ({
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    username: '',
    email: '',
    region: 'generic_global',
    language: 'en',
    darkMode: true,
    isPro: false,
    apiKey: '',
    weatherApiKey: '',

    loadUser: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                set(parsed);
            }
        } catch (error) {
            console.warn('Failed to load user:', error);
        }
    },

    setOnboardingComplete: async () => {
        set({ hasCompletedOnboarding: true });
        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...get(), hasCompletedOnboarding: true })
        );
    },

    login: async (email, username) => {
        const updates = { isAuthenticated: true, email, username };
        set(updates);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...updates }));
    },

    logout: async () => {
        set({ isAuthenticated: false, email: '', username: '' });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get()));
    },

    updatePreferences: async (prefs) => {
        set(prefs);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...prefs }));
    },

    setProStatus: async (isPro) => {
        set({ isPro });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), isPro }));
    },

    setApiKey: async (key) => {
        set({ apiKey: key });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), apiKey: key }));
    },

    setWeatherApiKey: async (key) => {
        set({ weatherApiKey: key });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), weatherApiKey: key }));
    },
}));
