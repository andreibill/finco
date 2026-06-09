import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Toast, type ToastTone } from "@components/feedback/Toast/Toast";
import "./ToastProvider.css";

type ToastItem = {
  id: number;
  tone: ToastTone;
  title: string;
  body?: string;
};

type ToastContextValue = {
  showToast: (toast: { tone?: ToastTone; title: string; body?: string }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback<ToastContextValue["showToast"]>((toast) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, tone: toast.tone ?? "ok", title: toast.title, body: toast.body }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <AutoToast key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function AutoToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);
  return (
    <Toast tone={item.tone} title={item.title} body={item.body} onClose={() => onDismiss(item.id)} />
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast trebuie folosit in interiorul ToastProvider");
  return ctx;
}
