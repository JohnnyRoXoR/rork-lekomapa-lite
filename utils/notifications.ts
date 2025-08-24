import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleMedicationNotification(
  medicationName: string,
  time: string,
  medicationId: string
): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const [hours, minutes] = time.split(':').map(Number);
    
    const trigger: Notifications.CalendarTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Czas na lek! 💊',
        body: `Nie zapomnij wziąć: ${medicationName}`,
        data: {
          medicationId,
          time,
          type: 'medication_reminder'
        },
        categoryIdentifier: 'medication',
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

export async function setupNotificationCategories(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.setNotificationCategoryAsync('medication', [
      {
        identifier: 'taken',
        buttonTitle: 'Wzięte ✅',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'snooze',
        buttonTitle: 'Drzemka 10 min',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);
  } catch (error) {
    console.error('Failed to setup notification categories:', error);
  }
}