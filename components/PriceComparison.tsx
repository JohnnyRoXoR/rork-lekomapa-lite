import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { PharmacyPrice } from '@/constants/medications';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

interface PriceComparisonProps {
  prices: PharmacyPrice[];
  medicationName: string;
}

export function PriceComparison({ prices, medicationName }: PriceComparisonProps) {
  const { language } = useSettingsStore();
  const t = translations[language];

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{medicationName}</Text>
      <Text style={styles.subtitle}>{t.nearbyPharmacies}</Text>
      
      {sortedPrices.map((pharmacy, index) => (
        <View key={pharmacy.id} style={[
          styles.pharmacyCard,
          index === 0 && styles.bestPrice
        ]}>
          <View style={styles.pharmacyHeader}>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
              <Text style={styles.distance}>{pharmacy.distance}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{pharmacy.price.toFixed(2)} zł</Text>
              {index === 0 && (
                <View style={styles.bestPriceBadge}>
                  <Text style={styles.bestPriceText}>Najlepsze</Text>
                </View>
              )}
            </View>
          </View>
          
          {pharmacy.phone && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(pharmacy.phone!)}
            >
              <Ionicons name="call" size={16} color={Colors.primary} />
              <Text style={styles.callButtonText}>{t.call}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  pharmacyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bestPrice: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  bestPriceBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  bestPriceText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  callButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});