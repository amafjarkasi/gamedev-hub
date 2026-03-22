import React, { createContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
    );
    clearTimeout(timeoutsRef.current[`dismiss-${id}`]);
    timeoutsRef.current[`remove-${id}`] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timeoutsRef.current[`remove-${id}`];
    }, 300);
  }, []);

  const addToast = useCallback(
    (message, variant = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, message, variant, dismissing: false }];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });
      timeoutsRef.current[`dismiss-${id}`] = setTimeout(() => {
        removeToast(id);
      }, 3000);
      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export default ToastContext;
