export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice' | 'weekly';
  times: string[];
  notes?: string;
  taken: { [date: string]: { [time: string]: boolean } };
  createdAt: Date;
}

export interface PharmacyPrice {
  id: string;
  name: string;
  price: number;
  distance: string;
  address: string;
  phone?: string;
}

export const MOCK_PHARMACIES: PharmacyPrice[] = [
  {
    id: '1',
    name: 'Apteka Centralna',
    price: 12.50,
    distance: '0.2 km',
    address: 'ul. Główna 15, Warszawa',
    phone: '+48 22 123 45 67'
  },
  {
    id: '2',
    name: 'Apteka Pod Orłem',
    price: 11.90,
    distance: '0.5 km',
    address: 'ul. Marszałkowska 42, Warszawa',
    phone: '+48 22 987 65 43'
  },
  {
    id: '3',
    name: 'Apteka 24h',
    price: 13.20,
    distance: '0.8 km',
    address: 'ul. Nowy Świat 8, Warszawa',
    phone: '+48 22 555 44 33'
  }
];

export const FREQUENCY_OPTIONS = [
  { value: 'daily', labelPL: 'Codziennie', labelEN: 'Daily' },
  { value: 'twice', labelPL: 'Co 12 godzin', labelEN: 'Every 12 hours' },
  { value: 'weekly', labelPL: 'Raz w tygodniu', labelEN: 'Once a week' }
] as const;