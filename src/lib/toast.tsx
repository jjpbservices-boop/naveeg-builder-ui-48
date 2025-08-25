import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

type Toast = { id: string; title: string; kind?: "success" | "error" | "info" };
type Ctx = { push: (t: Omit<Toast, "id">) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed z-[9999] right-4 bottom-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "rounded-xl border px-4 py-3 shadow-sm text-sm " +
              (t.kind === "success"
                ? "border-green-300 bg-green-50 dark:bg-green-950/30"
                : t.kind === "error"
                ? "border-red-300 bg-red-50 dark:bg-red-950/30"
                : "border-neutral-300 bg-white dark:bg-neutral-900")
            }
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}