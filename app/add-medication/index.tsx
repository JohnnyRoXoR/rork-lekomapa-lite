import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FREQUENCY_OPTIONS } from '@/constants/medications';
import { useMedicationStore } from '@/store/medicationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';
import { scheduleMedicationNotification } from '@/utils/notifications';

export default function AddMedicationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { medications, addMedication, updateMedication } = useMedicationStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const isEditing = !!id;
  const existingMedication = isEditing ? medications.find(med => med.id === id) : null;

  const [name, setName] = useState(existingMedication?.name || '');
  const [dosage, setDosage] = useState(existingMedication?.dosage || '');
  const [frequency, setFrequency] = useState<'daily' | 'twice' | 'weekly'>(
    existingMedication?.frequency || 'daily'
  );
  const [times, setTimes] = useState<string[]>(existingMedication?.times || ['08:00']);
  const [notes, setNotes] = useState(existingMedication?.notes || '');

  const handleFrequencyChange = (newFrequency: 'daily' | 'twice' | 'weekly') => {
    setFrequency(newFrequency);
    
    // Adjust times based on frequency
    switch (newFrequency) {
      case 'daily':
        setTimes(['08:00']);
        break;
      case 'twice':
        setTimes(['08:00', '20:00']);
        break;
      case 'weekly':
        setTimes(['08:00']);
        break;
    }
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...times];
    newTimes[index] = time;
    setTimes(newTimes);
  };

  const addTime = () => {
    if (times.length < 6) {
      setTimes([...times, '08:00']);
    }
  };

  const removeTime = (index: number) => {
    if (times.length > 1) {
      const newTimes = times.filter((_, i) => i !== index);
      setTimes(newTimes);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t.error, 'Nazwa leku jest wymagana');
      return;
    }

    if (!dosage.trim()) {
      Alert.alert(t.error, 'Dawka jest wymagana');
      return;
    }

    const medicationData = {
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      notes: notes.trim() || undefined
    };

    try {
      if (isEditing && existingMedication) {
        updateMedication(existingMedication.id, medicationData);
      } else {
        addMedication(medicationData);
      }

      // Schedule notifications for each time
      for (const time of times) {
        await scheduleMedicationNotification(name, time, id || Date.now().toString());
      }

      router.back();
    } catch (error) {
      Alert.alert(t.error, 'Nie udało się zapisać leku');
    }
  };

  const renderTimeInput = (time: string, index: number) => (
    <View key={index} style={styles.timeInputContainer}>
      <TextInput
        style={styles.timeInput}
        value={time}
        onChangeText={(text) => handleTimeChange(index, text)}
        placeholder="08:00"
        maxLength={5}
      />
      {times.length > 1 && (
        <TouchableOpacity
          style={styles.removeTimeButton}
          onPress={() => removeTime(index)}
        >
          <Ionicons name="close-circle" size={24} color={Colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edytuj lek' : t.addMedication}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t.save}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>{t.medicationName}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="np. Paracetamol"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t.dosage}</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="np. 500mg"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t.frequency}</Text>
          <View style={styles.frequencyContainer}>
            {FREQUENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyOption,
                  frequency === option.value && styles.frequencyOptionSelected
                ]}
                onPress={() => handleFrequencyChange(option.value)}
              >
                <Text style={[
                  styles.frequencyOptionText,
                  frequency === option.value && styles.frequencyOptionTextSelected
                ]}>
                  {language === 'pl' ? option.labelPL : option.labelEN}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.timesHeader}>
            <Text style={styles.label}>{t.times}</Text>
            {times.length < 6 && (
              <TouchableOpacity style={styles.addTimeButton} onPress={addTime}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
                <Text style={styles.addTimeText}>Dodaj godzinę</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.timesContainer}>
            {times.map((time, index) => renderTimeInput(time, index))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t.notes}</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Dodatkowe informacje (opcjonalne)"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyOptionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  frequencyOptionTextSelected: {
    color: Colors.white,
  },
  timesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTimeText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  timesContainer: {
    gap: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  removeTimeButton: {
    marginLeft: 8,
    padding: 4,
  },
});