import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { Medication } from '@/constants/medications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MedicationForReport {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  notes?: string;
}

export async function generateMedicationsPdf(medications: MedicationForReport[], locale: string = 'pl-PL') {
  const date = new Date();
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; padding: 24px; color: #0F172A; }
          h1 { color: ${Colors.primary}; font-size: 24px; margin: 0 0 8px; }
          .subtitle { color: #475569; margin-bottom: 24px; }
          .card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
          .name { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
          .row { color: #334155; font-size: 14px; }
          .muted { color: #64748B; }
        </style>
      </head>
      <body>
        <h1>Raport Leków — LekoMapa Lite</h1>
        <div class="subtitle">${date.toLocaleDateString(locale)} • ${date.toLocaleTimeString(locale)}</div>
        ${medications.map(m => `
          <div class="card">
            <div class="name">${escapeHtml(m.name)}</div>
            <div class="row">Dawka: <span class="muted">${escapeHtml(m.dosage)}</span></div>
            <div class="row">Godziny: <span class="muted">${m.times.map(escapeHtml).join(', ')}</span></div>
            ${m.notes ? `<div class="row">Notatki: <span class="muted">${escapeHtml(m.notes)}</span></div>` : ''}
          </div>
        `).join('')}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (Platform.OS !== 'web') {
    try {
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log('Share failed', e);
    }
  } else {
    Alert.alert('PDF gotowy', 'Plik PDF został wygenerowany (web).');
  }

  return uri;
}

export async function exportDataToJson(): Promise<string | null> {
  try {
    const [medications, settings, subscription] = await Promise.all([
      AsyncStorage.getItem('medications'),
      AsyncStorage.getItem('settings'),
      AsyncStorage.getItem('subscription')
    ]);

    const exportData = {
      medications: medications ? JSON.parse(medications) : [],
      settings: settings ? JSON.parse(settings) : {},
      subscription: subscription ? JSON.parse(subscription) : {},
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    
    if (Platform.OS !== 'web') {
      const fileUri = FileSystem.documentDirectory + `lekomapa-backup-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      await Sharing.shareAsync(fileUri);
      return fileUri;
    } else {
      // For web, we'll create a downloadable blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lekomapa-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return 'downloaded';
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

export async function importDataFromJson(jsonData: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data.medications || !Array.isArray(data.medications)) {
      throw new Error('Invalid data format: medications missing or invalid');
    }

    // Import medications
    if (data.medications.length > 0) {
      await AsyncStorage.setItem('medications', JSON.stringify(data.medications));
    }

    // Import settings (optional)
    if (data.settings && typeof data.settings === 'object') {
      await AsyncStorage.setItem('settings', JSON.stringify(data.settings));
    }

    // Import subscription (optional)
    if (data.subscription && typeof data.subscription === 'object') {
      await AsyncStorage.setItem('subscription', JSON.stringify(data.subscription));
    }

    return true;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"]+/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as const)[s]!);
}
