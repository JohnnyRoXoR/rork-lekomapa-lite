import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { useSettingsStore } from '@/store/settingsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useMedicationStore } from '@/store/medicationStore';
import { translations } from '@/utils/i18n';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const {
    language,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    setLanguage,
    setQuietHours
  } = useSettingsStore();
  
  const { isPremium, isTrialActive, trialEndDate } = useSubscriptionStore();
  const { medications } = useMedicationStore();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage(language === 'pl' ? 'en' : 'pl');
  };

  const handleExportPDF = async () => {
    if (!isPremium) {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2E86AB; }
              .medication { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .medication-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
              .medication-details { color: #666; }
            </style>
          </head>
          <body>
            <h1>Raport Leków - LekoMapa Lite</h1>
            <p>Data wygenerowania: ${new Date().toLocaleDateString('pl-PL')}</p>
            ${medications.map(med => `
              <div class="medication">
                <div class="medication-name">${med.name}</div>
                <div class="medication-details">
                  <p>Dawka: ${med.dosage}</p>
                  <p>Godziny: ${med.times.join(', ')}</p>
                  ${med.notes ? `<p>Notatki: ${med.notes}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert(t.error, 'Nie udało się wygenerować raportu PDF');
    }
  };

  const handleExportData = async () => {
    try {
      const data = {
        medications,
        settings: {
          language,
          quietHoursEnabled,
          quietHoursStart,
          quietHoursEnd
        },
        exportDate: new Date().toISOString()
      };

      const jsonString = JSON.stringify(data, null, 2);
      const { uri } = await Print.printToFileAsync({
        html: `<pre>${jsonString}</pre>`,
        base64: false
      });
      
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert(t.error, 'Nie udało się wyeksportować danych');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import danych',
      'Funkcja importu będzie dostępna w przyszłych wersjach aplikacji.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    isPremiumFeature = false
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, isPremiumFeature && !isPremium && styles.premiumItem]}
      onPress={isPremiumFeature && !isPremium ? () => setShowSubscriptionModal(true) : onPress}
      disabled={!onPress && !rightComponent}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={Colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {isPremiumFeature && !isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
        {rightComponent}
        {onPress && <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Premium Status */}
      {isPremium && (
        <View style={styles.premiumStatus}>
          <Ionicons name="star" size={24} color={Colors.premium} />
          <View style={styles.premiumStatusText}>
            <Text style={styles.premiumStatusTitle}>Premium Active</Text>
            {isTrialActive && trialEndDate && (
              <Text style={styles.premiumStatusSubtitle}>
                Trial kończy się: {trialEndDate.toLocaleDateString('pl-PL')}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ogólne</Text>
        
        {renderSettingItem(
          'language',
          t.language,
          language === 'pl' ? 'Polski' : 'English',
          handleLanguageToggle
        )}

        {renderSettingItem(
          'moon',
          t.quietHours,
          quietHoursEnabled ? `${quietHoursStart} - ${quietHoursEnd}` : 'Wyłączone',
          undefined,
          <Switch
            value={quietHoursEnabled}
            onValueChange={(value) => setQuietHours(value)}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={quietHoursEnabled ? Colors.primary : Colors.textSecondary}
          />
        )}
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zarządzanie danymi</Text>
        
        {renderSettingItem(
          'document-text',
          'Eksport do PDF',
          'Wygeneruj raport przyjmowania leków',
          handleExportPDF,
          undefined,
          true
        )}

        {renderSettingItem(
          'download',
          t.exportData,
          'Eksportuj dane do pliku JSON',
          handleExportData
        )}

        {renderSettingItem(
          'cloud-upload',
          t.importData,
          'Importuj dane z pliku JSON',
          handleImportData
        )}
      </View>

      {/* Premium */}
      {!isPremium && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          {renderSettingItem(
            'star',
            t.upgradeToPremium,
            'Odblokuj wszystkie funkcje',
            () => setShowSubscriptionModal(true)
          )}
        </View>
      )}

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacje</Text>
        
        {renderSettingItem(
          'shield-checkmark',
          t.privacyPolicy,
          'Przeczytaj naszą politykę prywatności',
          () => Alert.alert('Polityka prywatności', 'Funkcja będzie dostępna wkrótce')
        )}

        {renderSettingItem(
          'information-circle',
          'O aplikacji',
          'LekoMapa Lite v1.0.0'
        )}
      </View>

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  premiumStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.premium,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  premiumStatusText: {
    marginLeft: 12,
  },
  premiumStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  premiumStatusSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  premiumItem: {
    opacity: 0.7,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: Colors.premium,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
});