import React from 'react';
import { useToast } from '../hooks/useToast';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.variant] || ''} ${
            toast.dismissing ? styles.dismissing : ''
          }`}
        >
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.dismissBtn}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
