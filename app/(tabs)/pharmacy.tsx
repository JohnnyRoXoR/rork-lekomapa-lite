import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { PriceComparison } from '@/components/PriceComparison';
import { AdBanner } from '@/components/AdBanner';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { MOCK_PHARMACIES } from '@/constants/medications';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

const MOCK_MEDICATIONS = [
  'Paracetamol',
  'Ibuprofen',
  'Aspirin',
  'Amoxicillin',
  'Metformin',
  'Atorvastatin',
  'Omeprazol',
  'Losartan'
];

export default function PharmacyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { canViewAllPrices, isPremium } = useSubscriptionStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const filteredMedications = MOCK_MEDICATIONS.filter(med =>
    med.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMedicationSelect = (medication: string) => {
    setSelectedMedication(medication);
  };

  const displayedPrices = canViewAllPrices() ? MOCK_PHARMACIES : MOCK_PHARMACIES.slice(0, 3);

  const renderMedicationItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.medicationItem}
      onPress={() => handleMedicationSelect(item)}
    >
      <Ionicons name="medical" size={20} color={Colors.primary} />
      <Text style={styles.medicationName}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>{t.priceComparison}</Text>
      <Text style={styles.subtitle}>
        Znajdź najlepsze ceny leków w aptekach
      </Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchMedication}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {!isPremium && (
        <View style={styles.limitBanner}>
          <Ionicons name="information-circle" size={16} color={Colors.warning} />
          <Text style={styles.limitText}>
            Wersja darmowa: maksymalnie 3 ceny
          </Text>
          <TouchableOpacity onPress={() => setShowSubscriptionModal(true)}>
            <Text style={styles.upgradeText}>Przejdź na Premium</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedMedication ? (
        <View style={styles.container}>
          <View style={styles.backHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMedication(null)}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
              <Text style={styles.backText}>Wróć</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[selectedMedication]}
            renderItem={() => (
              <PriceComparison
                prices={displayedPrices}
                medicationName={selectedMedication}
              />
            )}
            ListFooterComponent={() => (
              <View>
                {!canViewAllPrices() && (
                  <View style={styles.premiumPrompt}>
                    <Text style={styles.premiumPromptText}>
                      {t.priceLimitReached}
                    </Text>
                    <TouchableOpacity
                      style={styles.premiumButton}
                      onPress={() => setShowSubscriptionModal(true)}
                    >
                      <Text style={styles.premiumButtonText}>{t.upgradeToPremium}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <AdBanner />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FlatList
          data={filteredMedications}
          renderItem={renderMedicationItem}
          keyExtractor={(item) => item}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={() => <AdBanner />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

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
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  limitText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: Colors.text,
  },
  upgradeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicationName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  backHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  premiumPrompt: {
    backgroundColor: Colors.primaryLight,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumPromptText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  premiumButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
  },
});