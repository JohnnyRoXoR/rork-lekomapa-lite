import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSettingsStore } from "@/store/settingsStore";
import { useMedicationStore } from "@/store/medicationStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { setupNotificationCategories } from "@/utils/notifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { onboardingCompleted } = useSettingsStore();

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="add-medication" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const { loadSettings, onboardingCompleted } = useSettingsStore();
  const { loadMedications } = useMedicationStore();
  const { loadSubscription } = useSubscriptionStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadSettings(),
          loadMedications(),
          loadSubscription(),
          setupNotificationCategories()
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}