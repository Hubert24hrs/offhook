// OFFHOOK — Excuse Store (Zustand)
import { create } from 'zustand';
import { ExcuseResponse, ExcuseContext, generateMockExcuse, historyManager } from '../core/ai';
import type { ExcuseLogEntry } from '../core/ai';

interface ExcuseState {
    // Generation
    isGenerating: boolean;
    currentExcuse: ExcuseResponse | null;
    generationError: string | null;

    // Selection state
    selectedCategory: string;
    selectedTone: string;
    selectedSituation: string;
    selectedUrgency: string;
    selectedContactId: string;

    // History
    excuseHistory: ExcuseLogEntry[];
    dailyGenerations: number;
    maxDailyFree: number;
    isPro: boolean;

    // Actions
    setSelection: (field: string, value: string) => void;
    generateExcuse: (context: ExcuseContext) => Promise<void>;
    clearCurrentExcuse: () => void;
    loadHistory: () => Promise<void>;
    canGenerate: () => boolean;
}

export const useExcuseStore = create<ExcuseState>((set, get) => ({
    isGenerating: false,
    currentExcuse: null,
    generationError: null,

    selectedCategory: 'traffic',
    selectedTone: 'casual',
    selectedSituation: 'work',
    selectedUrgency: 'medium',
    selectedContactId: '',

    excuseHistory: [],
    dailyGenerations: 0,
    maxDailyFree: 3,
    isPro: false,

    setSelection: (field, value) => {
        set({ [field]: value } as any);
    },

    generateExcuse: async (context) => {
        const state = get();

        if (!state.canGenerate()) {
            set({ generationError: 'Daily limit reached. Upgrade to OFFHOOK Pro for unlimited excuses!' });
            return;
        }

        set({ isGenerating: true, generationError: null, currentExcuse: null });

        try {
            const excuse = await generateMockExcuse(context);

            // Log to history
            const logEntry: ExcuseLogEntry = {
                id: Date.now().toString(),
                contactId: context.contactName,
                category: context.category,
                excuseText: excuse.excuse_text,
                riskScore: excuse.risk_score,
                createdAt: new Date().toISOString(),
                tone: context.tone,
                situation: context.situationType,
            };

            await historyManager.logExcuse(logEntry);

            set({
                currentExcuse: excuse,
                isGenerating: false,
                dailyGenerations: state.dailyGenerations + 1,
                excuseHistory: [logEntry, ...state.excuseHistory],
            });
        } catch (error) {
            set({
                isGenerating: false,
                generationError: 'Failed to generate excuse. Please try again.',
            });
        }
    },

    clearCurrentExcuse: () => {
        set({ currentExcuse: null, generationError: null });
    },

    loadHistory: async () => {
        await historyManager.initialize();
        const history = historyManager.getLastExcuses(50);
        const dailyCount = historyManager.getTotalExcusesToday();
        set({ excuseHistory: history, dailyGenerations: dailyCount });
    },

    canGenerate: () => {
        const state = get();
        if (state.isPro) return true;
        return state.dailyGenerations < state.maxDailyFree;
    },
}));
