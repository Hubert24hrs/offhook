import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MonetizationState {
  isPro: boolean;
  lifetimeUnlocked: boolean;
  creditBalance: number;
  
  // Actions
  setIsPro: (status: boolean) => void;
  setLifetimeUnlocked: (status: boolean) => void;
  setCreditBalance: (balance: number) => void;
  deductCredit: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  
  // UI State
  isPaywallVisible: boolean;
  setPaywallVisible: (visible: boolean) => void;
  
  // Computed-like helper
  hasPremiumAccess: () => boolean;
}

export const useMonetizationStore = create<MonetizationState>()(
  persist(
    (set, get) => ({
      isPro: false,
      lifetimeUnlocked: false,
      creditBalance: 0,
      isPaywallVisible: false,
      
      setIsPro: (status) => set({ isPro: status }),
      
      setLifetimeUnlocked: (status) => set({ lifetimeUnlocked: status }),
      
      setCreditBalance: (balance) => set({ creditBalance: balance }),

      setPaywallVisible: (visible) => set({ isPaywallVisible: visible }),
      
      deductCredit: (amount) => {
        const current = get().creditBalance;
        if (current >= amount) {
          set({ creditBalance: current - amount });
          return true;
        }
        return false;
      },
      
      addCredits: (amount) => set((state) => ({ 
        creditBalance: state.creditBalance + amount 
      })),
      
      hasPremiumAccess: () => {
        const state = get();
        return state.isPro || state.lifetimeUnlocked;
      }
    }),
    {
      name: 'offhook-monetization-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
