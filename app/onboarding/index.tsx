import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

export default function OnboardingWelcome() {
  const { language } = useSettingsStore();
  const t = translations[language];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={80} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>{t.welcome}</Text>
        <Text style={styles.description}>{t.welcomeDesc}</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="notifications" size={32} color={Colors.primary} />
            <Text style={styles.featureTitle}>{t.trackMeds}</Text>
            <Text style={styles.featureDescription}>{t.trackMedsDesc}</Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="analytics" size={32} color={Colors.primary} />
            <Text style={styles.featureTitle}>{t.comparePrices}</Text>
            <Text style={styles.featureDescription}>{t.comparePricesDesc}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/permissions')}
        >
          <Text style={styles.primaryButtonText}>{t.getStarted}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/onboarding/complete')}
        >
          <Text style={styles.secondaryButtonText}>{t.skip}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  featuresContainer: {
    width: '100%',
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});