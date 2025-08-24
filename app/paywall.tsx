import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

export default function PaywallScreen() {
  const { startTrial, isPremium } = useSubscriptionStore();
  const { language } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[language];

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      startTrial();
      Alert.alert(
        t.success,
        'Trial Premium został aktywowany na 7 dni!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t.error, 'Nie udało się aktywować trialu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = () => {
    Alert.alert(
      'Subskrypcja',
      'Funkcja płatności będzie dostępna w pełnej wersji aplikacji.',
      [{ text: 'OK' }]
    );
  };

  const premiumFeatures = [
    { icon: 'medical', text: t.unlimitedMeds, description: 'Dodaj więcej niż 5 leków' },
    { icon: 'analytics', text: t.fullPriceComparison, description: 'Porównuj ceny we wszystkich aptekach' },
    { icon: 'document-text', text: t.pdfExport, description: 'Generuj raporty PDF' },
    { icon: 'ban', text: t.noAds, description: 'Korzystaj bez reklam' },
    { icon: 'cloud-upload', text: t.cloudSync, description: 'Synchronizuj dane między urządzeniami' },
  ];

  if (isPremium) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.upgradeToPremium}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={48} color={Colors.premium} />
          </View>
          <Text style={styles.heroTitle}>LekoMapa Premium</Text>
          <Text style={styles.heroSubtitle}>
            Odblokuj wszystkie funkcje i korzystaj bez ograniczeń
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>{t.premiumFeatures}</Text>
          
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.text}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            </View>
          ))}
        </View>

        <View style={styles.trialSection}>
          <View style={styles.trialBadge}>
            <Text style={styles.trialBadgeText}>🎉 Specjalna oferta</Text>
          </View>
          <Text style={styles.trialTitle}>{t.freeTrial}</Text>
          <Text style={styles.trialDescription}>
            {t.trialDescription}
          </Text>
        </View>

        <View style={styles.pricingSection}>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Premium Miesięczny</Text>
            <Text style={styles.pricingPrice}>9,99 zł/miesiąc</Text>
            <Text style={styles.pricingDescription}>Po zakończeniu trialu</Text>
          </View>
          
          <View style={[styles.pricingCard, styles.popularCard]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Najpopularniejszy</Text>
            </View>
            <Text style={styles.pricingTitle}>Premium Roczny</Text>
            <Text style={styles.pricingPrice}>79,99 zł/rok</Text>
            <Text style={styles.pricingDescription}>Oszczędź 33%</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.trialButton, isLoading && styles.disabledButton]} 
          onPress={handleStartTrial}
          disabled={isLoading}
        >
          <Text style={styles.trialButtonText}>
            {isLoading ? 'Aktywowanie...' : t.startTrial}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subskrybuj teraz</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Po zakończeniu okresu próbnego zostanie naliczona opłata.
          Możesz anulować w każdej chwili w ustawieniach App Store.
        </Text>
      </View>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  premiumBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  trialSection: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  trialBadge: {
    backgroundColor: Colors.premium,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  trialBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  trialTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  pricingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pricingCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  popularCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  trialButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  subscribeButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});