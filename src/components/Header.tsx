import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  ChevronDown,
  Download,
  History,
  Layers,
  Sprout,
} from 'lucide-react';
import { LOTES_LIST } from '../types';

interface HeaderProps {
  fundoName?: string;
  selectedLote: string;
  onLoteChange: (lote: string) => void;
  selectedDate: string;
  recordsCount: number;
  onOpenHistory: () => void;
  onExportAllExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fundoName = 'Fundo Monte Carmelo',
  selectedLote,
  onLoteChange,
  selectedDate,
  recordsCount,
  onOpenHistory,
  onExportAllExcel,
}) => {
  const [isLoteDropdownOpen, setIsLoteDropdownOpen] = useState(false);

  // Format date string for display (e.g. "28 sep. 2026")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) {
      const now = new Date();
      return now.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const months = [
          'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
          'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'
        ];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const monthName = months[monthIndex] || 'sep.';
        return `${parts[0]} ${monthName} ${parts[2]}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <header className="bg-[#1E3A5F] text-white px-4 md:px-8 py-3.5 shadow-md sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Brand, Estate Name & App Title */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-emerald-500/20 p-2.5 rounded-xl flex items-center justify-center border border-emerald-400/30 backdrop-blur-xs">
            <Sprout className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">
                <Building2 className="w-3 h-3 mr-1" />
                {fundoName}
              </span>
              <span className="inline-flex items-center bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium px-2 py-0.5 rounded-md">
                Cultivo: Arándano
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              Gestión de Riego
            </h1>
          </div>
        </div>

        {/* Right Side: Date, Lote Dropdown, History & Export Excel */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          {/* Date Indicator */}
          <div className="flex items-center text-slate-200 text-xs md:text-sm font-medium space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{formatDateDisplay(selectedDate)}</span>
          </div>

          {/* LOTE Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLoteDropdownOpen(!isLoteDropdownOpen)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl border border-emerald-400/30 text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-emerald-100" />
              <span>{selectedLote}</span>
              <ChevronDown className="w-4 h-4 text-emerald-200 ml-0.5" />
            </button>

            {isLoteDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 max-h-80 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex justify-between items-center">
                  <span>Seleccionar Lote</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    18 Lotes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 p-1.5">
                  {LOTES_LIST.map((lote) => (
                    <button
                      key={lote}
                      type="button"
                      onClick={() => {
                        onLoteChange(lote);
                        setIsLoteDropdownOpen(false);
                      }}
                      className={`text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors ${
                        selectedLote === lote
                          ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{lote}</span>
                      {selectedLote === lote && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/15 text-xs md:text-sm font-medium transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-blue-300" />
            <span>Historial</span>
            {recordsCount > 0 && (
              <span className="ml-1 bg-emerald-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {recordsCount}
              </span>
            )}
          </button>

          {/* Download All Excel Button */}
          <button
            type="button"
            onClick={onExportAllExcel}
            disabled={recordsCount === 0}
            title={
              recordsCount === 0
                ? 'Guarda al menos un registro para exportar'
                : 'Exportar todos los registros a Excel'
            }
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              recordsCount > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed opacity-60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
