import React from 'react';
import { Calendar, ChevronDown, Download, Droplet, Layers, RotateCcw, Save } from 'lucide-react';
import { ParametrosRiegoData } from '../types';

interface ParametrosRiegoProps {
  fundoName?: string;
  selectedLote: string;
  onLoteChange?: (lote: string) => void;
  data: ParametrosRiegoData;
  onChange: (field: keyof ParametrosRiegoData, value: string) => void;
  onSave: () => void;
  onSaveAndExportExcel: () => void;
  onClear: () => void;
}

const FRECUENCIA_OPTIONS = [
  'Selecciona...',
  '1 vez al día',
  '2 veces al día',
  '3 veces al día',
  '4 veces al día',
  'Cada 2 días',
  'Riego continuo por pulso',
];

export const ParametrosRiego: React.FC<ParametrosRiegoProps> = ({
  fundoName = 'FUNDO MONTE CARMELO',
  selectedLote,
  data,
  onChange,
  onSave,
  onSaveAndExportExcel,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col h-full">
      {/* Top Header */}
      <div className="bg-[#1B4D4F] p-4 md:p-5 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-xl flex items-center justify-center backdrop-blur-xs border border-white/10">
            <Droplet className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
              Parámetros de riego del día
            </h2>
            <p className="text-teal-100/90 text-xs font-normal">
              {fundoName}
            </p>
          </div>
        </div>

        {/* Lote indicator badge */}
        <div className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-xs font-bold text-emerald-200">{selectedLote}</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-5 md:p-6 space-y-4 flex-1">
        {/* Fecha de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Fecha de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={data.fechaRiego}
              onChange={(e) => onChange('fechaRiego', e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <Calendar className="w-4 h-4 text-slate-400 ml-2 shrink-0 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        {/* Volumen de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Volumen de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <input
              type="text"
              value={data.volumenRiego}
              onChange={(e) => onChange('volumenRiego', e.target.value)}
              placeholder="Ej. 120"
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0 min-w-[65px] select-none">
              m³/ha
            </div>
          </div>
        </div>

        {/* Tiempo de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tiempo de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <input
              type="text"
              value={data.tiempoRiego}
              onChange={(e) => onChange('tiempoRiego', e.target.value)}
              placeholder="Ej. 2.5"
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0 min-w-[65px] select-none">
              horas
            </div>
          </div>
        </div>

        {/* Frecuencia */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Frecuencia
          </label>
          <div className="relative">
            <select
              value={data.frecuencia}
              onChange={(e) => onChange('frecuencia', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
            >
              {FRECUENCIA_OPTIONS.map((opt) => (
                <option key={opt} value={opt === 'Selecciona...' ? '' : opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tipo de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tipo de riego
          </label>
          <div className="flex items-center space-x-6 pt-0.5">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="radio"
                name="tipoRiego"
                value="Goteo"
                checked={data.tipoRiego === 'Goteo'}
                onChange={() => onChange('tipoRiego', 'Goteo')}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  data.tipoRiego === 'Goteo'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {data.tipoRiego === 'Goteo' && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-slate-800">Goteo</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="radio"
                name="tipoRiego"
                value="SFR"
                checked={data.tipoRiego === 'SFR'}
                onChange={() => onChange('tipoRiego', 'SFR')}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  data.tipoRiego === 'SFR'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {data.tipoRiego === 'SFR' && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-slate-800">SFR</span>
            </label>
          </div>
        </div>

        {/* Lámina de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Lámina de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <input
              type="text"
              value={data.laminaRiego}
              onChange={(e) => onChange('laminaRiego', e.target.value)}
              placeholder="Ej. 12"
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0 min-w-[65px] select-none">
              mm
            </div>
          </div>
        </div>

        {/* EC del agua de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            EC del agua de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <input
              type="text"
              value={data.ecAguaRiego}
              onChange={(e) => onChange('ecAguaRiego', e.target.value)}
              placeholder="Ej. 0.8"
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0 min-w-[65px] select-none">
              dS/m
            </div>
          </div>
        </div>

        {/* pH del agua de riego */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            pH del agua de riego
          </label>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-2xs">
            <input
              type="text"
              value={data.phAguaRiego}
              onChange={(e) => onChange('phAguaRiego', e.target.value)}
              placeholder="Ej. 6.0"
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-center shrink-0 min-w-[65px] select-none">
              pH
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Save className="w-5 h-5 text-white" />
            <span>Guardar Registro</span>
          </button>

          {/* Save & Export Excel Button */}
          <button
            type="button"
            onClick={onSaveAndExportExcel}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Guardar y Descargar Excel</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={onClear}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Limpiar Campos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
