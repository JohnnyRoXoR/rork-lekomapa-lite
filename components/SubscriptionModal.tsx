import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ visible, onClose }: SubscriptionModalProps) {
  const { startTrial, isPremium } = useSubscriptionStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const handleStartTrial = () => {
    startTrial();
    onClose();
  };

  const premiumFeatures = [
    { icon: 'medical', text: t.unlimitedMeds },
    { icon: 'analytics', text: t.fullPriceComparison },
    { icon: 'document-text', text: t.pdfExport },
    { icon: 'ban', text: t.noAds },
    { icon: 'cloud-upload', text: t.cloudSync },
  ];

  if (isPremium) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.upgradeToPremium}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={32} color={Colors.premium} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>

          <Text style={styles.subtitle}>{t.premiumFeatures}</Text>

          <View style={styles.featuresContainer}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name={feature.icon as any} size={24} color={Colors.primary} />
                <Text style={styles.featureText}>{feature.text}</Text>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
            ))}
          </View>

          <View style={styles.trialContainer}>
            <Text style={styles.trialTitle}>{t.freeTrial}</Text>
            <Text style={styles.trialDescription}>
              Wypróbuj wszystkie funkcje Premium przez 7 dni za darmo
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.trialButton} onPress={handleStartTrial}>
            <Text style={styles.trialButtonText}>{t.startTrial}</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Po zakończeniu okresu próbnego zostanie naliczona opłata.
            Możesz anulować w każdej chwili.
          </Text>
        </View>
      </View>
    </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  premiumBadge: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  premiumText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.premium,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 16,
  },
  trialContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 16,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});