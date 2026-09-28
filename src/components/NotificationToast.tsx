import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  onClose,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md w-full px-4">
      <div
        className={`flex items-center justify-between p-4 rounded-xl shadow-xl border ${
          type === 'success'
            ? 'bg-emerald-900 text-white border-emerald-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          {type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
