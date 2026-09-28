import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LecturasDia } from './components/LecturasDia';
import { CondicionesClimaticas } from './components/CondicionesClimaticas';
import { Observaciones } from './components/Observaciones';
import { ParametrosRiego } from './components/ParametrosRiego';
import { HistoryModal } from './components/HistoryModal';
import { NotificationToast } from './components/NotificationToast';
import {
  CondicionesClimaticasData,
  LecturasDiaData,
  ParametrosRiegoData,
  SavedRecord,
} from './types';
import { exportRecordsToExcel, getCurrentFormattedDate } from './utils/exportExcel';

const FUNDO_NAME = 'FUNDO MONTE CARMELO';
const LOCAL_STORAGE_KEY = 'montecarmelo_riego_records_v1';

const getInitialLecturas = (): LecturasDiaData => ({
  sfrPh: '',
  sfrCe: '',
  fibraPh: '',
  fibraCe: '',
  drenajePh: '',
  drenajeCe: '',
  otrosDrenajePct: '',
  otrosHumedadPct: '',
});

const getInitialCondiciones = (): CondicionesClimaticasData => ({
  tempMax: '',
  tempMin: '',
  radiacionSolar: '',
  precipitacion: '',
});

const getInitialParametros = (): ParametrosRiegoData => ({
  fechaRiego: getCurrentFormattedDate(),
  volumenRiego: '',
  tiempoRiego: '',
  frecuencia: '',
  tipoRiego: 'Goteo',
  laminaRiego: '',
  ecAguaRiego: '',
  phAguaRiego: '',
});

export default function App() {
  const [selectedLote, setSelectedLote] = useState<string>('LOTE 1');
  const [lecturas, setLecturas] = useState<LecturasDiaData>(getInitialLecturas);
  const [condiciones, setCondiciones] = useState<CondicionesClimaticasData>(getInitialCondiciones);
  const [observaciones, setObservaciones] = useState<string>('');
  const [parametros, setParametros] = useState<ParametrosRiegoData>(getInitialParametros);

  // Saved Records in SQLite + localStorage fallback
  const [records, setRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Fetch records from SQLite server API on load
  const fetchRecordsFromSQLite = useCallback(async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.records));
      }
    } catch {
      // Keep local state if server API fails
    }
  }, []);

  useEffect(() => {
    fetchRecordsFromSQLite();
    // Periodically poll for shared multi-device updates every 10s
    const interval = setInterval(fetchRecordsFromSQLite, 10000);
    return () => clearInterval(interval);
  }, [fetchRecordsFromSQLite]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch {
      // fallback
    }
  }, [records]);

  const handleLecturaChange = (
    field: keyof LecturasDiaData,
    value: string
  ) => {
    setLecturas((prev) => ({ ...prev, [field]: value }));
  };

  const handleCondicionChange = (
    field: keyof CondicionesClimaticasData,
    value: string
  ) => {
    setCondiciones((prev) => ({ ...prev, [field]: value }));
  };

  const handleParametroChange = (
    field: keyof ParametrosRiegoData,
    value: string
  ) => {
    setParametros((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (autoExportExcel = false) => {
    const newRecord: SavedRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('es-PE'),
      createdAt: new Date().toISOString(),
      fundo: FUNDO_NAME,
      lote: selectedLote,
      cultivo: 'Arándano',
      lecturasDia: { ...lecturas },
      condicionesClimaticas: { ...condiciones },
      observaciones,
      parametrosRiego: { ...parametros },
    };

    const updated = [newRecord, ...records];
    setRecords(updated);

    // Save to server SQLite database
    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch (err) {
      console.error('Error saving to server SQLite database:', err);
    }

    if (autoExportExcel) {
      exportRecordsToExcel([newRecord], `${FUNDO_NAME}_${selectedLote}_Registro`);
      setToast({
        message: `¡Registro guardado en SQLite para ${selectedLote} y archivo Excel descargado!`,
        type: 'success',
      });
    } else {
      setToast({
        message: `¡Registro guardado en la base de datos para ${selectedLote}! Accesible desde cualquier dispositivo.`,
        type: 'success',
      });
    }

    setTimeout(() => setToast(null), 4500);
  };

  const handleClear = () => {
    setLecturas(getInitialLecturas());
    setCondiciones(getInitialCondiciones());
    setObservaciones('');
    setParametros(getInitialParametros());
    setToast({
      message: 'Se han limpiado los campos del formulario.',
      type: 'info',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteRecord = async (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    setToast({
      message: 'Registro eliminado del servidor.',
      type: 'info',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearAllRecords = async () => {
    if (window.confirm('¿Está seguro de vaciar todo el historial de la base de datos?')) {
      setRecords([]);
      try {
        await fetch('/api/records', { method: 'DELETE' });
      } catch {
        // ignore
      }
      setToast({
        message: 'Base de datos SQLite vaciada.',
        type: 'info',
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleExportAllExcel = () => {
    exportRecordsToExcel(records, `${FUNDO_NAME}_Todos_Registros`);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-800 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Header Bar */}
      <Header
        fundoName={FUNDO_NAME}
        selectedLote={selectedLote}
        onLoteChange={setSelectedLote}
        selectedDate={parametros.fechaRiego}
        recordsCount={records.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportAllExcel={handleExportAllExcel}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Lecturas, Clima, Observaciones) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <LecturasDia
              data={lecturas}
              onChange={handleLecturaChange}
              selectedLote={selectedLote}
              onLoteChange={setSelectedLote}
            />

            <CondicionesClimaticas
              data={condiciones}
              onChange={handleCondicionChange}
            />

            <Observaciones
              value={observaciones}
              onChange={setObservaciones}
            />
          </div>

          {/* Right Column (Parámetros de riego del día) */}
          <div className="lg:col-span-5 xl:col-span-4 h-full">
            <ParametrosRiego
              fundoName={FUNDO_NAME}
              selectedLote={selectedLote}
              onLoteChange={setSelectedLote}
              data={parametros}
              onChange={handleParametroChange}
              onSave={() => handleSave(false)}
              onSaveAndExportExcel={() => handleSave(true)}
              onClear={handleClear}
            />
          </div>
        </div>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={records}
        onDeleteRecord={handleDeleteRecord}
        onClearAllRecords={handleClearAllRecords}
      />

      {/* Notification Toast */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
