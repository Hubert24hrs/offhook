// OFFHOOK — History Manager & Anti-Repetition Engine
// Tracks excuse history, enforces theme cooldowns, and bucket rotation

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    EXCUSE_LOG: '@offhook_excuse_log',
    THEME_REGISTRY: '@offhook_theme_registry',
    LAST_BUCKET: '@offhook_last_bucket',
};

export interface ExcuseLogEntry {
    id: string;
    contactId: string;
    category: string;
    excuseText: string;
    riskScore: number;
    createdAt: string;
    tone: string;
    situation: string;
}

export interface ThemeEntry {
    category: string;
    contactId: string;
    lastUsed: string;
    cooldownUntil: string;
}

const COOLDOWN_DAYS = {
    THEME_GLOBAL: 7,
    CATEGORY_PER_CONTACT: 14,
};

const BUCKETS = [
    'traffic', 'health', 'family', 'weather', 'tech_failure',
    'work_conflict', 'power_outage', 'errand', 'emergency', 'schedule_clash',
];

class HistoryManager {
    private excuseLog: ExcuseLogEntry[] = [];
    private themeRegistry: ThemeEntry[] = [];
    private lastBucket: string = '';

    async initialize(): Promise<void> {
        try {
            const [logData, themeData, bucketData] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.EXCUSE_LOG),
                AsyncStorage.getItem(STORAGE_KEYS.THEME_REGISTRY),
                AsyncStorage.getItem(STORAGE_KEYS.LAST_BUCKET),
            ]);

            this.excuseLog = logData ? JSON.parse(logData) : [];
            this.themeRegistry = themeData ? JSON.parse(themeData) : [];
            this.lastBucket = bucketData || '';
        } catch (error) {
            console.warn('Failed to load history:', error);
        }
    }

    async logExcuse(entry: ExcuseLogEntry): Promise<void> {
        this.excuseLog.unshift(entry);

        // Keep only last 100 entries
        if (this.excuseLog.length > 100) {
            this.excuseLog = this.excuseLog.slice(0, 100);
        }

        // Update theme registry
        const cooldownUntil = new Date(
            Date.now() + COOLDOWN_DAYS.THEME_GLOBAL * 24 * 60 * 60 * 1000
        ).toISOString();

        this.themeRegistry.push({
            category: entry.category,
            contactId: entry.contactId,
            lastUsed: entry.createdAt,
            cooldownUntil,
        });

        // Update last bucket
        this.lastBucket = entry.category;

        await this.persist();
    }

    getLastExcuses(count: number = 10): ExcuseLogEntry[] {
        return this.excuseLog.slice(0, count);
    }

    getExcusesForContact(contactId: string): ExcuseLogEntry[] {
        return this.excuseLog.filter((e) => e.contactId === contactId);
    }

    getUsedThemes(days: number = 30): string[] {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        return this.themeRegistry
            .filter((t) => t.lastUsed > cutoff)
            .map((t) => t.category);
    }

    isCategoryOnCooldown(category: string, contactId: string): boolean {
        const now = new Date().toISOString();
        return this.themeRegistry.some(
            (t) =>
                t.category === category &&
                t.contactId === contactId &&
                t.cooldownUntil > now
        );
    }

    getAvailableCategories(contactId: string): string[] {
        return BUCKETS.filter(
            (bucket) =>
                bucket !== this.lastBucket &&
                !this.isCategoryOnCooldown(bucket, contactId)
        );
    }

    getTimesUsedWithContact(category: string, contactId: string, days: number = 30): number {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        return this.excuseLog.filter(
            (e) =>
                e.category === category &&
                e.contactId === contactId &&
                e.createdAt > cutoff
        ).length;
    }

    getDaysSinceLastExcuse(contactId: string): number {
        const lastExcuse = this.excuseLog.find((e) => e.contactId === contactId);
        if (!lastExcuse) return 999;
        const diff = Date.now() - new Date(lastExcuse.createdAt).getTime();
        return Math.floor(diff / (24 * 60 * 60 * 1000));
    }

    getTotalExcusesToday(): number {
        const today = new Date().toDateString();
        return this.excuseLog.filter(
            (e) => new Date(e.createdAt).toDateString() === today
        ).length;
    }

    private async persist(): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.EXCUSE_LOG, JSON.stringify(this.excuseLog)),
                AsyncStorage.setItem(STORAGE_KEYS.THEME_REGISTRY, JSON.stringify(this.themeRegistry)),
                AsyncStorage.setItem(STORAGE_KEYS.LAST_BUCKET, this.lastBucket),
            ]);
        } catch (error) {
            console.warn('Failed to persist history:', error);
        }
    }
}

export const historyManager = new HistoryManager();
