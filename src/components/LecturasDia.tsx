import React from 'react';
import { Building2, Droplet, Droplets, Layers, Sprout } from 'lucide-react';
import { LecturasDiaData, LOTES_LIST } from '../types';

interface LecturasDiaProps {
  data: LecturasDiaData;
  onChange: (field: keyof LecturasDiaData, value: string) => void;
  selectedLote?: string;
  onLoteChange?: (lote: string) => void;
}

export const LecturasDia: React.FC<LecturasDiaProps> = ({
  data,
  onChange,
  selectedLote,
  onLoteChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100/80 text-blue-600 p-2.5 rounded-xl flex items-center justify-center">
            <Sprout className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lecturas del día</h2>
            <p className="text-xs md:text-sm text-slate-500">
              Ingresa los valores de tus monitoreos
            </p>
          </div>
        </div>

        {/* Selected LOTE & Fundo Badge */}
        {selectedLote && onLoteChange && (
          <div className="flex items-center space-x-2">
            <span className="hidden lg:inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-slate-500 mr-1" />
              Fundo Monte Carmelo
            </span>

            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-900">Muestra para:</span>
              <select
                value={selectedLote}
                onChange={(e) => onLoteChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-emerald-800 focus:outline-none cursor-pointer"
              >
                {LOTES_LIST.map((lote) => (
                  <option key={lote} value={lote}>
                    {lote}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid of 4 parameter boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: SFR / Gotero */}
        <div className="bg-[#F3F7FC] border border-blue-100/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="bg-blue-600 text-white p-1.5 rounded-full flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-white text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="font-bold text-slate-800 text-sm md:text-base">SFR / Gotero</h3>
              <span className="text-xs text-slate-500 font-normal">
                (Misma referencia de pH y CE)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                pH
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 shadow-2xs">
                <input
                  type="text"
                  value={data.sfrPh}
                  onChange={(e) => onChange('sfrPh', e.target.value)}
                  placeholder="Ej. 5.5"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none">
                  pH
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CE
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 shadow-2xs">
                <input
                  type="text"
                  value={data.sfrCe}
                  onChange={(e) => onChange('sfrCe', e.target.value)}
                  placeholder="Ej. 1.2"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none whitespace-nowrap">
                  dS/m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Fibra */}
        <div className="bg-[#F2F9F5] border border-emerald-100/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-full flex items-center justify-center">
              <Sprout className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Fibra</h3>
              <span className="text-xs text-slate-500 font-normal">
                (Sustrato)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                pH
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400 shadow-2xs">
                <input
                  type="text"
                  value={data.fibraPh}
                  onChange={(e) => onChange('fibraPh', e.target.value)}
                  placeholder="Ej. 5.8"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none">
                  pH
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CE
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400 shadow-2xs">
                <input
                  type="text"
                  value={data.fibraCe}
                  onChange={(e) => onChange('fibraCe', e.target.value)}
                  placeholder="Ej. 1.8"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none whitespace-nowrap">
                  dS/m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 3: Drenaje */}
        <div className="bg-[#F5F4FA] border border-indigo-100/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-600 text-white p-1.5 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Drenaje</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                pH
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 shadow-2xs">
                <input
                  type="text"
                  value={data.drenajePh}
                  onChange={(e) => onChange('drenajePh', e.target.value)}
                  placeholder="Ej. 5.5"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none">
                  pH
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CE
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 shadow-2xs">
                <input
                  type="text"
                  value={data.drenajeCe}
                  onChange={(e) => onChange('drenajeCe', e.target.value)}
                  placeholder="Ej. 2.0"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none whitespace-nowrap">
                  dS/m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 4: Otros parámetros */}
        <div className="bg-[#FCF8F2] border border-amber-100/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full flex items-center justify-center">
              <Droplet className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="font-bold text-amber-900 text-sm md:text-base">Otros parámetros</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                % Drenaje
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 shadow-2xs">
                <input
                  type="text"
                  value={data.otrosDrenajePct}
                  onChange={(e) => onChange('otrosDrenajePct', e.target.value)}
                  placeholder="Ej. 15"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                % Humedad
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 shadow-2xs">
                <input
                  type="text"
                  value={data.otrosHumedadPct}
                  onChange={(e) => onChange('otrosHumedadPct', e.target.value)}
                  placeholder="Ej. 62"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 ml-1 select-none">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
