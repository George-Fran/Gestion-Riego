import * as XLSX from 'xlsx';
import { SavedRecord } from '../types';

export function exportRecordsToExcel(
  records: SavedRecord[],
  fileNamePrefix = 'Monte_Carmelo_Registros_Riego'
) {
  if (!records || records.length === 0) return;

  const dataRows = records.map((r, index) => ({
    'N°': index + 1,
    'Fundo': r.fundo || 'FUNDO MONTE CARMELO',
    'Lote': r.lote,
    'Cultivo': r.cultivo || 'Arándano',
    'Fecha Riego': r.parametrosRiego.fechaRiego,
    'SFR - pH': r.lecturasDia.sfrPh || '-',
    'SFR - CE (dS/m)': r.lecturasDia.sfrCe || '-',
    'Fibra - pH': r.lecturasDia.fibraPh || '-',
    'Fibra - CE (dS/m)': r.lecturasDia.fibraCe || '-',
    'Drenaje - pH': r.lecturasDia.drenajePh || '-',
    'Drenaje - CE (dS/m)': r.lecturasDia.drenajeCe || '-',
    '% Drenaje': r.lecturasDia.otrosDrenajePct || '-',
    '% Humedad': r.lecturasDia.otrosHumedadPct || '-',
    'Temp. Máx (°C)': r.condicionesClimaticas.tempMax || '-',
    'Temp. Mín (°C)': r.condicionesClimaticas.tempMin || '-',
    'Radiación Solar (W/m²)': r.condicionesClimaticas.radiacionSolar || '-',
    'Precipitación (mm)': r.condicionesClimaticas.precipitacion || '-',
    'Volumen Riego (m³/ha)': r.parametrosRiego.volumenRiego || '-',
    'Tiempo Riego (hrs)': r.parametrosRiego.tiempoRiego || '-',
    'Frecuencia': r.parametrosRiego.frecuencia || '-',
    'Tipo Riego': r.parametrosRiego.tipoRiego || '-',
    'Lámina Riego (mm)': r.parametrosRiego.laminaRiego || '-',
    'EC Agua (dS/m)': r.parametrosRiego.ecAguaRiego || '-',
    'pH Agua': r.parametrosRiego.phAguaRiego || '-',
    'Observaciones': r.observaciones || 'Sin observaciones',
    'Fecha de Registro': r.timestamp,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataRows);

  // Auto-fit column widths
  const colWidths = Object.keys(dataRows[0] || {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...dataRows.map((row) => String((row as Record<string, unknown>)[key] || '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riego y Monitoreo');

  const dateStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  XLSX.writeFile(workbook, `${fileNamePrefix}_${dateStamp}.xlsx`);
}

export function getCurrentFormattedDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}
