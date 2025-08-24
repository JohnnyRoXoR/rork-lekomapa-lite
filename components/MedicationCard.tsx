import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Medication } from '@/constants/medications';
import { useMedicationStore } from '@/store/medicationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

interface MedicationCardProps {
  medication: Medication & { nextTime: string; isTaken: boolean };
  onEdit?: () => void;
}

export function MedicationCard({ medication, onEdit }: MedicationCardProps) {
  const { markAsTaken, deleteMedication } = useMedicationStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const today = new Date().toISOString().split('T')[0];

  const handleToggleTaken = () => {
    markAsTaken(medication.id, today, medication.nextTime, !medication.isTaken);
  };

  const handleDelete = () => {
    Alert.alert(
      t.confirm,
      `${t.delete} ${medication.name}?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: () => deleteMedication(medication.id)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.medicationInfo}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
          <Text style={styles.time}>{medication.nextTime}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              medication.isTaken ? styles.takenButton : styles.notTakenButton
            ]}
            onPress={handleToggleTaken}
          >
            <Ionicons
              name={medication.isTaken ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={medication.isTaken ? Colors.white : Colors.primary}
            />
            <Text style={[
              styles.statusText,
              medication.isTaken ? styles.takenText : styles.notTakenText
            ]}>
              {medication.isTaken ? t.taken : t.notTaken}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {medication.notes && (
        <Text style={styles.notes}>{medication.notes}</Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>{t.edit}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={[styles.actionButtonText, { color: Colors.error }]}>{t.delete}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  actions: {
    alignItems: 'flex-end',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  takenButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  notTakenButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  takenText: {
    color: Colors.white,
  },
  notTakenText: {
    color: Colors.primary,
  },
  notes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});