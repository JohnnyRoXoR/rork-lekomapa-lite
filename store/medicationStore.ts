import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '@/constants/medications';

interface MedicationState {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'taken' | 'createdAt'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markAsTaken: (id: string, date: string, time: string, taken: boolean) => void;
  loadMedications: () => Promise<void>;
  saveMedications: () => Promise<void>;
  getTodaysMedications: () => Array<Medication & { nextTime: string; isTaken: boolean }>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],

  addMedication: (medicationData) => {
    const medication: Medication = {
      ...medicationData,
      id: Date.now().toString(),
      taken: {},
      createdAt: new Date()
    };
    
    set((state) => ({
      medications: [...state.medications, medication]
    }));
    get().saveMedications();
  },

  updateMedication: (id, updates) => {
    set((state) => ({
      medications: state.medications.map((med) =>
        med.id === id ? { ...med, ...updates } : med
      )
    }));
    get().saveMedications();
  },

  deleteMedication: (id) => {
    set((state) => ({
      medications: state.medications.filter((med) => med.id !== id)
    }));
    get().saveMedications();
  },

  markAsTaken: (id, date, time, taken) => {
    set((state) => ({
      medications: state.medications.map((med) => {
        if (med.id === id) {
          const updatedTaken = { ...med.taken };
          if (!updatedTaken[date]) {
            updatedTaken[date] = {};
          }
          updatedTaken[date][time] = taken;
          return { ...med, taken: updatedTaken };
        }
        return med;
      })
    }));
    get().saveMedications();
  },

  loadMedications: async () => {
    try {
      const medications = await AsyncStorage.getItem('medications');
      if (medications) {
        const parsed = JSON.parse(medications);
        // Convert date strings back to Date objects
        const medicationsWithDates = parsed.map((med: any) => ({
          ...med,
          createdAt: new Date(med.createdAt)
        }));
        set({ medications: medicationsWithDates });
      }
    } catch (error) {
      console.error('Failed to load medications:', error);
    }
  },

  saveMedications: async () => {
    try {
      const { medications } = get();
      await AsyncStorage.setItem('medications', JSON.stringify(medications));
    } catch (error) {
      console.error('Failed to save medications:', error);
    }
  },

  getTodaysMedications: () => {
    const { medications } = get();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return medications.flatMap((med) => {
      return med.times.map((time) => {
        const isTaken = med.taken[today]?.[time] || false;
        return {
          ...med,
          nextTime: time,
          isTaken
        };
      });
    }).sort((a, b) => a.nextTime.localeCompare(b.nextTime));
  }
}));