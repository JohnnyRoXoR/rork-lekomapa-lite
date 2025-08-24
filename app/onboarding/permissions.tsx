import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { requestNotificationPermissions } from '@/utils/notifications';
import { translations } from '@/utils/i18n';

export default function OnboardingPermissions() {
  const [isLoading, setIsLoading] = useState(false);
  const { language, setNotificationsEnabled } = useSettingsStore();
  const t = translations[language];

  const handleAllowNotifications = async () => {
    setIsLoading(true);
    try {
      const granted = await requestNotificationPermissions();
      setNotificationsEnabled(granted);
      
      if (granted) {
        router.push('/onboarding/complete');
      } else {
        Alert.alert(
          'Powiadomienia wyłączone',
          'Możesz włączyć powiadomienia później w ustawieniach urządzenia.',
          [{ text: 'OK', onPress: () => router.push('/onboarding/complete') }]
        );
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
      router.push('/onboarding/complete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setNotificationsEnabled(false);
    router.push('/onboarding/complete');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications" size={80} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>{t.enableNotifications}</Text>
        <Text style={styles.description}>{t.notificationsDesc}</Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Przypomnienia o wzięciu leków</Text>
          </View>
          
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Możliwość drzemki powiadomień</Text>
          </View>
          
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Szybkie oznaczanie jako wzięte</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
          onPress={handleAllowNotifications}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Ładowanie...' : t.allow}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>{t.notNow}</Text>
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
  benefitsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
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
  disabledButton: {
    opacity: 0.6,
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