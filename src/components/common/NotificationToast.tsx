import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { CheckCircle, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const NotificationToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDyeFlow();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
          info: 'border-sky-200 bg-sky-50/95 text-sky-950',
          warning: 'border-amber-200 bg-amber-50/95 text-amber-950',
          error: 'border-rose-200 bg-rose-50/95 text-rose-950'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-elevated transition-all transform translate-y-0 ${borderStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider font-mono">
                {toast.title}
              </div>
              <div className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
