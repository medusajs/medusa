import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className="toast-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {toast.type === 'success' && <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />}
            {toast.type === 'error' && <AlertCircle size={16} style={{ color: 'var(--accent-red)' }} />}
            {toast.type === 'info' && <Info size={16} style={{ color: 'var(--accent-gold)' }} />}
            <span>{toast.message}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {toast.actionLabel && toast.onAction && (
              <span
                className="toast-action-btn"
                onClick={() => {
                  toast.onAction();
                  removeToast(toast.id);
                }}
              >
                {toast.actionLabel}
              </span>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'inherit', opacity: 0.7, cursor: 'pointer', display: 'flex' }}
              aria-label="Dismiss Notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
