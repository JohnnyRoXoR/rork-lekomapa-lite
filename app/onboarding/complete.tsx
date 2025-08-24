import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/utils/i18n';

export default function OnboardingComplete() {
  const { language, setOnboardingCompleted } = useSettingsStore();
  const t = translations[language];

  const handleComplete = () => {
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
        </View>
        
        <Text style={styles.title}>Wszystko gotowe!</Text>
        <Text style={styles.description}>
          LekoMapa Lite jest skonfigurowana i gotowa do użycia. 
          Możesz teraz dodać swoje pierwsze leki i rozpocząć śledzenie.
        </Text>

        <View style={styles.tipsContainer}>
          <View style={styles.tip}>
            <Ionicons name="bulb" size={24} color={Colors.warning} />
            <Text style={styles.tipText}>
              Dodaj leki z dokładnymi godzinami, aby otrzymywać precyzyjne przypomnienia
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="star" size={24} color={Colors.premium} />
            <Text style={styles.tipText}>
              Przejdź na Premium, aby odblokować nielimitowane leki i więcej funkcji
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleComplete}
        >
          <Text style={styles.primaryButtonText}>Rozpocznij korzystanie</Text>
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
    backgroundColor: Colors.accent,
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
  tipsContainer: {
    width: '100%',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  tipText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
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
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
});