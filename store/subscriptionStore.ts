import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionState {
  isPremium: boolean;
  trialStartDate: Date | null;
  trialEndDate: Date | null;
  isTrialActive: boolean;
  subscriptionEndDate: Date | null;
  setPremium: (premium: boolean) => void;
  startTrial: () => void;
  endTrial: () => void;
  setSubscription: (endDate: Date) => void;
  loadSubscription: () => Promise<void>;
  saveSubscription: () => Promise<void>;
  canAddMoreMedications: (currentCount: number) => boolean;
  canViewAllPrices: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPremium: false,
  trialStartDate: null,
  trialEndDate: null,
  isTrialActive: false,
  subscriptionEndDate: null,

  setPremium: (premium) => {
    set({ isPremium: premium });
    get().saveSubscription();
  },

  startTrial: () => {
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    set({
      trialStartDate: now,
      trialEndDate: endDate,
      isTrialActive: true,
      isPremium: true
    });
    get().saveSubscription();
  },

  endTrial: () => {
    set({
      isTrialActive: false,
      isPremium: false
    });
    get().saveSubscription();
  },

  setSubscription: (endDate) => {
    set({
      subscriptionEndDate: endDate,
      isPremium: true,
      isTrialActive: false
    });
    get().saveSubscription();
  },

  loadSubscription: async () => {
    try {
      const subscription = await AsyncStorage.getItem('subscription');
      if (subscription) {
        const parsed = JSON.parse(subscription);
        // Convert date strings back to Date objects
        if (parsed.trialStartDate) parsed.trialStartDate = new Date(parsed.trialStartDate);
        if (parsed.trialEndDate) parsed.trialEndDate = new Date(parsed.trialEndDate);
        if (parsed.subscriptionEndDate) parsed.subscriptionEndDate = new Date(parsed.subscriptionEndDate);
        
        // Check if trial is still active
        if (parsed.isTrialActive && parsed.trialEndDate) {
          const now = new Date();
          if (now > parsed.trialEndDate) {
            parsed.isTrialActive = false;
            parsed.isPremium = false;
          }
        }
        
        set(parsed);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  },

  saveSubscription: async () => {
    try {
      const state = get();
      const subscription = {
        isPremium: state.isPremium,
        trialStartDate: state.trialStartDate,
        trialEndDate: state.trialEndDate,
        isTrialActive: state.isTrialActive,
        subscriptionEndDate: state.subscriptionEndDate
      };
      await AsyncStorage.setItem('subscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  },

  canAddMoreMedications: (currentCount) => {
    const state = get();
    return state.isPremium || currentCount < 5;
  },

  canViewAllPrices: () => {
    const state = get();
    return state.isPremium;
  }
}));