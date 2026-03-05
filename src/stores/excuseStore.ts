// OFFHOOK — Excuse Store (Zustand)
import { create } from 'zustand';
import { historyManager } from '../core/ai';
import type { ExcuseResponse, ExcuseLogEntry } from '../core/ai';
import { generateExcuse as aiGenerateExcuse } from '../core/ai/ai_service';
import { buildRealContext } from '../core/services/context';
import { useUserStore } from './userStore';

interface ExcuseState {
    // Generation
    isGenerating: boolean;
    currentExcuse: ExcuseResponse | null;
    generationError: string | null;
    currentRiskScore: number;
    currentRiskReason: string;
    error: string | null;

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
    setCategory: (category: string) => void;
    setTone: (tone: string) => void;
    setSituation: (situation: string) => void;
    setUrgency: (urgency: string) => void;
    generateExcuse: (params: {
        contactName: string;
        relationship: string;
        category: string;
        tone: string;
        situationType: string;
        urgency: string;
        situation?: string;
    }) => Promise<void>;
    clearCurrentExcuse: () => void;
    loadHistory: () => Promise<void>;
    canGenerate: () => boolean;
}

export const useExcuseStore = create<ExcuseState>((set, get) => ({
    isGenerating: false,
    currentExcuse: null,
    generationError: null,
    currentRiskScore: 0,
    currentRiskReason: '',
    error: null,

    selectedCategory: 'traffic',
    selectedTone: 'casual',
    selectedSituation: 'work',
    selectedUrgency: 'medium',
    selectedContactId: '',

    excuseHistory: [],
    dailyGenerations: 0,
    maxDailyFree: 3,
    isPro: false,

    setSelection: (field, value) => set({ [field]: value } as any),
    setCategory: (category) => set({ selectedCategory: category }),
    setTone: (tone) => set({ selectedTone: tone }),
    setSituation: (situation) => set({ selectedSituation: situation }),
    setUrgency: (urgency) => set({ selectedUrgency: urgency }),

    generateExcuse: async (params) => {
        const state = get();

        if (!state.canGenerate()) {
            set({ generationError: 'Daily limit reached. Upgrade to OFFHOOK Pro!', error: 'Daily limit reached.' });
            throw new Error('Daily limit reached. Upgrade to OFFHOOK Pro!');
        }

        set({ isGenerating: true, generationError: null, error: null, currentExcuse: null });

        try {
            // Build real context from services
            const context = await buildRealContext(params);

            // Get API key if available
            const apiKey = useUserStore.getState().apiKey;

            // Generate via unified service (real or mock)
            const excuse = await aiGenerateExcuse(context, apiKey);

            // Log to history
            const logEntry: ExcuseLogEntry = {
                id: Date.now().toString(),
                contactId: params.contactName,
                category: params.category,
                excuseText: excuse.excuse_text,
                riskScore: excuse.risk_score,
                createdAt: new Date().toISOString(),
                tone: params.tone,
                situation: params.situationType,
            };

            await historyManager.logExcuse(logEntry);

            set({
                currentExcuse: excuse,
                currentRiskScore: excuse.risk_score,
                currentRiskReason: excuse.risk_reason,
                isGenerating: false,
                dailyGenerations: state.dailyGenerations + 1,
                excuseHistory: [logEntry, ...state.excuseHistory],
            });
        } catch (error: any) {
            set({
                isGenerating: false,
                generationError: error.message || 'Failed to generate.',
                error: error.message || 'Failed to generate.',
            });
            throw error;
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
