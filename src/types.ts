export interface LecturasDiaData {
  sfrPh: string;
  sfrCe: string;
  fibraPh: string;
  fibraCe: string;
  drenajePh: string;
  drenajeCe: string;
  otrosDrenajePct: string;
  otrosHumedadPct: string;
}

export interface CondicionesClimaticasData {
  tempMax: string;
  tempMin: string;
  radiacionSolar: string;
  precipitacion: string;
}

export interface ParametrosRiegoData {
  fechaRiego: string;
  volumenRiego: string;
  tiempoRiego: string;
  frecuencia: string;
  tipoRiego: 'Goteo' | 'SFR';
  laminaRiego: string;
  ecAguaRiego: string;
  phAguaRiego: string;
}

export interface SavedRecord {
  id: string;
  timestamp: string;
  createdAt: string;
  fundo: string;
  lote: string;
  cultivo: string;
  lecturasDia: LecturasDiaData;
  condicionesClimaticas: CondicionesClimaticasData;
  observaciones: string;
  parametrosRiego: ParametrosRiegoData;
}

export type IrrigationRecord = SavedRecord;

export const LOTES_LIST = [
  'LOTE 1',
  'LOTE 2',
  'LOTE 3',
  'LOTE 4',
  'LOTE 5',
  'LOTE 6',
  'LOTE 7',
  'LOTE 8',
  'LOTE 9',
  'LOTE 10',
  'LOTE 11',
  'LOTE 12',
  'LOTE 13',
  'LOTE 14',
  'LOTE 15',
  'LOTE 16',
  'LOTE 17',
  'LOTE 18',
] as const;
