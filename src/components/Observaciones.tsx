import React from 'react';
import { FileText } from 'lucide-react';

interface ObservacionesProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const Observaciones: React.FC<ObservacionesProps> = ({
  value,
  onChange,
  maxLength = 300,
}) => {
  return (
    <div className="bg-[#F6F5FC] border border-purple-100/90 rounded-2xl p-5 md:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-700" />
        </div>
        <h2 className="text-base md:text-lg font-bold text-purple-950">
          Observaciones
        </h2>
      </div>

      {/* Textarea Area */}
      <div className="space-y-1">
        <div className="relative bg-white border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 shadow-2xs">
          <textarea
            rows={3}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ingresa cualquier observación adicional..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none"
          />
          <div className="flex justify-end pt-1">
            <span className="text-xs font-medium text-slate-400 select-none">
              {value.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
