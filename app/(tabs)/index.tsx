import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { MedicationCard } from '@/components/MedicationCard';
import { AdBanner } from '@/components/AdBanner';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { useMedicationStore } from '@/store/medicationStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

export default function MedicationsScreen() {
  const { getTodaysMedications, medications } = useMedicationStore();
  const { canAddMoreMedications, isPremium } = useSubscriptionStore();
  const { language } = useSettingsStore();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const t = translations[language];

  const todaysMedications = getTodaysMedications();

  const handleAddMedication = () => {
    if (!canAddMoreMedications(medications.length)) {
      Alert.alert(
        t.upgradeToPremium,
        t.freeLimit,
        [
          { text: t.cancel, style: 'cancel' },
          { text: t.premium, onPress: () => setShowSubscriptionModal(true) }
        ]
      );
      return;
    }
    router.push('/add-medication');
  };

  const renderMedication = ({ item }: { item: any }) => (
    <MedicationCard
      medication={item}
      onEdit={() => router.push(`/add-medication?id=${item.id}`)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        {new Date().getHours() < 12 ? 'Dzień dobry!' : 
         new Date().getHours() < 18 ? 'Dzień dobry!' : 'Dobry wieczór!'}
      </Text>
      <Text style={styles.subtitle}>
        {todaysMedications.length > 0 
          ? `Masz ${todaysMedications.length} leków do wzięcia dzisiaj`
          : 'Nie masz żadnych leków na dzisiaj'
        }
      </Text>
      
      {!isPremium && (
        <View style={styles.limitInfo}>
          <Text style={styles.limitText}>
            {medications.length}/5 leków (wersja darmowa)
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <Text style={styles.upgradeButtonText}>Przejdź na Premium</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medical-outline" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>Brak leków</Text>
      <Text style={styles.emptyText}>
        Dodaj swój pierwszy lek, aby rozpocząć śledzenie
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todaysMedications}
        renderItem={renderMedication}
        keyExtractor={(item) => `${item.id}-${item.nextTime}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={() => <AdBanner />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddMedication}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  limitInfo: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 200,
  },
  limitText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  upgradeButtonText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});