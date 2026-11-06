import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-float border transition-all duration-300 animate-slide-up bg-white border-charcoal-200 text-charcoal-900"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-gold" />}
              {isError && <AlertCircle className="w-4 h-4 text-charcoal-900" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-gold" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-4 h-4 text-gold" />
              )}
            </div>

            <div className="flex-1">
              {t.title && (
                <h4 className="text-xs font-semibold tracking-wide font-sans text-charcoal-950">
                  {t.title}
                </h4>
              )}
              <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed font-sans">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-charcoal-400 hover:text-charcoal-900 transition p-0.5"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
