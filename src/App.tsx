import { useEffect, useState } from 'react';
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
import {
  clearAllRecordsFromCloud,
  deleteRecordFromCloud,
  saveRecordToCloud,
  subscribeToRecords,
} from './firebase';

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

  // Saved Records state
  const [records, setRecords] = useState<SavedRecord[]>([]);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Real-time synchronization with Firebase Firestore Cloud Database
  useEffect(() => {
    const unsubscribe = subscribeToRecords((cloudRecords) => {
      setRecords(cloudRecords);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudRecords));
      } catch {
        // fallback
      }
    });

    return () => unsubscribe();
  }, []);

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

    // Save directly to Firebase Firestore Cloud Database
    try {
      await saveRecordToCloud(newRecord);

      if (autoExportExcel) {
        exportRecordsToExcel([newRecord], `${FUNDO_NAME}_${selectedLote}_Registro`);
        setToast({
          message: `¡Registro subido a la nube para ${selectedLote} y Excel descargado!`,
          type: 'success',
        });
      } else {
        setToast({
          message: `¡Registro subido a la nube para ${selectedLote}! Disponible al instante en todos los dispositivos.`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Error uploading to Firebase cloud:', err);
      // Fallback update local state
      setRecords((prev) => [newRecord, ...prev]);
      setToast({
        message: `Registro guardado localmente para ${selectedLote}.`,
        type: 'info',
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
    try {
      await deleteRecordFromCloud(id);
      setToast({
        message: 'Registro eliminado permanentemente de la nube.',
        type: 'info',
      });
    } catch (err) {
      console.error('Error deleting from cloud:', err);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearAllRecords = async () => {
    if (window.confirm('¿Está seguro de vaciar todo el historial de la nube?')) {
      try {
        await clearAllRecordsFromCloud(records);
        setToast({
          message: 'Base de datos en la nube vaciada.',
          type: 'info',
        });
      } catch (err) {
        console.error('Error clearing cloud database:', err);
        setRecords([]);
      }
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
