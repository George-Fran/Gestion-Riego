import React from 'react';
import { CloudSun } from 'lucide-react';
import { CondicionesClimaticasData } from '../types';

interface CondicionesClimaticasProps {
  data: CondicionesClimaticasData;
  onChange: (field: keyof CondicionesClimaticasData, value: string) => void;
}

export const CondicionesClimaticas: React.FC<CondicionesClimaticasProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-[#EFF8F7] border border-teal-100/90 rounded-2xl p-5 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-teal-100 text-teal-700 p-2.5 rounded-xl flex items-center justify-center">
          <CloudSun className="w-5 h-5 text-teal-700" />
        </div>
        <h2 className="text-base md:text-lg font-bold text-teal-950">
          Condiciones climáticas
        </h2>
      </div>

      {/* Grid of 4 Climate Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Temp Max */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Temp. Máx. del día
          </label>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 shadow-2xs">
            <input
              type="text"
              value={data.tempMax}
              onChange={(e) => onChange('tempMax', e.target.value)}
              placeholder="Ej. 28"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <span className="text-xs font-medium text-slate-400 ml-1 select-none">
              °C
            </span>
          </div>
        </div>

        {/* Temp Min */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Temp. Mín. del día
          </label>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 shadow-2xs">
            <input
              type="text"
              value={data.tempMin}
              onChange={(e) => onChange('tempMin', e.target.value)}
              placeholder="Ej. 16"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <span className="text-xs font-medium text-slate-400 ml-1 select-none">
              °C
            </span>
          </div>
        </div>

        {/* Radiación Solar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Radiación solar
          </label>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 shadow-2xs">
            <input
              type="text"
              value={data.radiacionSolar}
              onChange={(e) => onChange('radiacionSolar', e.target.value)}
              placeholder="Ej. 650"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <span className="text-xs font-medium text-slate-400 ml-1 select-none whitespace-nowrap">
              W/m²
            </span>
          </div>
        </div>

        {/* Precipitación */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Precipitación <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400 shadow-2xs">
            <input
              type="text"
              value={data.precipitacion}
              onChange={(e) => onChange('precipitacion', e.target.value)}
              placeholder="Ej. 0"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <span className="text-xs font-medium text-slate-400 ml-1 select-none">
              mm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
