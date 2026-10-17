import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'danger':
        return <AlertTriangle size={16} className="text-rose-500" />;
      case 'info':
        return <Info size={16} className="text-indigo-500" />;
      default:
        return <CheckCircle2 size={16} className="text-emerald-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'danger':
        return 'border-rose-200';
      case 'info':
        return 'border-indigo-200';
      default:
        return 'border-emerald-200';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center justify-between gap-3 px-4 py-3 bg-white border ${getBorderColor()} rounded-2xl shadow-xl z-50 text-xs font-semibold text-slate-800 max-w-sm transition-all duration-200`}>
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
      <button
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
