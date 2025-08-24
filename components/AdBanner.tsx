import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export function AdBanner() {
  const { isPremium } = useSubscriptionStore();

  // Don't show ads for premium users or on web
  if (isPremium || Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.adText}>Reklama</Text>
      <Text style={styles.adContent}>
        Przejdź na Premium i usuń reklamy!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  adText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  adContent: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});