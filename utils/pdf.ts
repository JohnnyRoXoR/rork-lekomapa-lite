import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { Colors } from '@/constants/colors';

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

function escapeHtml(str: string) {
  return str.replace(/[&<>"]+/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as const)[s]!);
}
