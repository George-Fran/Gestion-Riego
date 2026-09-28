import React, { useState } from 'react';
import {
  Download,
  Filter,
  Layers,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { IrrigationRecord, LOTES_LIST } from '../types';
import { exportRecordsToExcel } from '../utils/excelExport';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: IrrigationRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAllRecords: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onDeleteRecord,
  onClearAllRecords,
}) => {
  const [filterLote, setFilterLote] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredRecords = records.filter((rec) => {
    const matchesLote = filterLote === 'TODOS' || rec.lote === filterLote;
    const matchesSearch =
      rec.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.parametrosRiego.fechaRiego.includes(searchTerm) ||
      rec.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLote && matchesSearch;
  });

  const handleExportFiltered = () => {
    exportRecordsToExcel(filteredRecords, 'Fundo_Monte_Carmelo_Riego');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1E3A5F] px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
                FUNDO MONTE CARMELO
              </span>
              <span className="text-xs bg-emerald-400/20 text-emerald-300 font-medium px-2 py-0.5 rounded border border-emerald-400/30">
                Arándano
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Historial de Registros de Riego
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Filter by Lote */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <Filter className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-xs font-semibold text-slate-500 mr-1">
                Lote:
              </span>
              <select
                value={filterLote}
                onChange={(e) => setFilterLote(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="TODOS">Todos los Lotes ({records.length})</option>
                {LOTES_LIST.map((lote) => (
                  <option key={lote} value={lote}>
                    {lote}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar por fecha, lote u obs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportFiltered}
              disabled={filteredRecords.length === 0}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Exportar a Excel ({filteredRecords.length})</span>
            </button>

            {records.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Estás seguro de que deseas eliminar todo el historial de registros?'
                    )
                  ) {
                    onClearAllRecords();
                  }
                }}
                className="flex items-center space-x-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Records Table */}
        <div className="p-4 overflow-y-auto flex-1">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-semibold text-slate-700">
                No hay registros guardados en este filtro
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Registra un nuevo monitoreo seleccionando tu Lote y haz clic en &quot;Guardar&quot;.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <th className="p-3">#</th>
                    <th className="p-3">Fecha Riego</th>
                    <th className="p-3">Lote</th>
                    <th className="p-3">SFR (pH / CE)</th>
                    <th className="p-3">Fibra (pH / CE)</th>
                    <th className="p-3">Drenaje (pH / CE)</th>
                    <th className="p-3">% Dren / % Hum</th>
                    <th className="p-3">Temp (°C)</th>
                    <th className="p-3">Vol Riego</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredRecords.map((rec, idx) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-3 font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {rec.parametrosRiego.fechaRiego}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {rec.lote}
                        </span>
                      </td>
                      <td className="p-3">
                        {rec.lecturasDia.sfrPh || '-'} /{' '}
                        {rec.lecturasDia.sfrCe || '-'}
                      </td>
                      <td className="p-3">
                        {rec.lecturasDia.fibraPh || '-'} /{' '}
                        {rec.lecturasDia.fibraCe || '-'}
                      </td>
                      <td className="p-3">
                        {rec.lecturasDia.drenajePh || '-'} /{' '}
                        {rec.lecturasDia.drenajeCe || '-'}
                      </td>
                      <td className="p-3">
                        {rec.lecturasDia.otrosDrenajePct
                          ? `${rec.lecturasDia.otrosDrenajePct}%`
                          : '-'}{' '}
                        /{' '}
                        {rec.lecturasDia.otrosHumedadPct
                          ? `${rec.lecturasDia.otrosHumedadPct}%`
                          : '-'}
                      </td>
                      <td className="p-3">
                        {rec.condicionesClimaticas.tempMax || '-'}{' '}
                        <span className="text-slate-400">máx</span>
                      </td>
                      <td className="p-3 font-medium">
                        {rec.parametrosRiego.volumenRiego
                          ? `${rec.parametrosRiego.volumenRiego} m³/ha`
                          : '-'}
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          title="Eliminar este registro"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>
            Total de registros: <strong>{records.length}</strong> | Fundo Monte
            Carmelo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
