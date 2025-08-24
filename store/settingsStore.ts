import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'pl' | 'en';

interface SettingsState {
  language: Language;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  setLanguage: (language: Language) => void;
  setQuietHours: (enabled: boolean, start?: string, end?: string) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'pl',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  onboardingCompleted: false,
  notificationsEnabled: false,

  setLanguage: (language) => {
    set({ language });
    get().saveSettings();
  },

  setQuietHours: (enabled, start, end) => {
    set({
      quietHoursEnabled: enabled,
      ...(start && { quietHoursStart: start }),
      ...(end && { quietHoursEnd: end })
    });
    get().saveSettings();
  },

  setOnboardingCompleted: (completed) => {
    set({ onboardingCompleted: completed });
    get().saveSettings();
  },

  setNotificationsEnabled: (enabled) => {
    set({ notificationsEnabled: enabled });
    get().saveSettings();
  },

  loadSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        set(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const state = get();
      const settings = {
        language: state.language,
        quietHoursEnabled: state.quietHoursEnabled,
        quietHoursStart: state.quietHoursStart,
        quietHoursEnd: state.quietHoursEnd,
        onboardingCompleted: state.onboardingCompleted,
        notificationsEnabled: state.notificationsEnabled
      };
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}));