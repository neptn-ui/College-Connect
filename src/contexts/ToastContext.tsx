import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast]);
  const error = useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast]);
  const info = useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-500/10',
    error: 'border-rose-500/20 bg-rose-500/10',
    info: 'border-blue-500/20 bg-blue-500/10'
  };

  return (
    <div 
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-sm
        glass-panel rounded-xl border ${borders[toast.type]}
        transition-all duration-300 ease-out origin-top-right
        ${isLeaving ? 'opacity-0 scale-90 translate-x-4' : 'animate-in slide-in-from-right-4 fade-in slide-in-from-top-2'}
      `}
    >
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <p className="text-sm font-medium text-white flex-1">{toast.message}</p>
      <button 
        onClick={handleClose}
        className="shrink-0 p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div 
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-gradient-to-r ${
          toast.type === 'success' ? 'from-emerald-400/50' : 
          toast.type === 'error' ? 'from-rose-400/50' : 'from-blue-400/50'
        } to-transparent`}
        style={{
          width: '100%',
          animation: `shrink ${toast.duration}ms linear forwards`
        }}
      />
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
