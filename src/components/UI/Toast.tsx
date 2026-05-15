import { useEffect } from 'react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const colors = {
  success: '#4ade80',
  error: '#ff6b80',
  info: '#6a9cf8',
};

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      style={{ borderLeft: `3px solid ${colors[toast.type]}` }}
      className="bg-sidebar border border-border rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3 min-w-72 animate-in slide-in-from-right"
    >
      <span className="text-text-main text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-text-secondary hover:text-text-main text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
