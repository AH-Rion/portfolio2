import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md min-w-[260px] max-w-sm"
              style={{
                background: 'rgba(13,15,23,0.92)',
                borderColor:
                  t.type === 'success'
                    ? 'rgba(34,211,238,0.35)'
                    : t.type === 'error'
                    ? 'rgba(168,85,247,0.4)'
                    : 'rgba(148,163,184,0.3)',
              }}
            >
              {t.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
              ) : t.type === 'error' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-fuchsia-400" />
              ) : (
                <Info className="h-5 w-5 shrink-0 text-slate-300" />
              )}
              <p className="flex-1 text-sm text-slate-100 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-500 hover:text-slate-200 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
