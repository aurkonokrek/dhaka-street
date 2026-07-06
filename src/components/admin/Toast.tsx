import { useCallback, useRef, useState } from 'react';

export type ToastKind = 'success' | 'error';
export type ToastItem = { id: number; kind: ToastKind; message: string };
export type ToastAPI = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

export function useToastController() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const api: ToastAPI = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  };

  return { items, api };
}

export function ToastHost({ controller }: { controller: ReturnType<typeof useToastController> }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 200 }}>
      {controller.items.map((t) => (
        <div
          key={t.id}
          role="status"
          style={{
            background: t.kind === 'success' ? '#1e7d4f' : '#c0392b',
            color: 'white',
            padding: '12px 18px',
            borderRadius: 10,
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            minWidth: 220,
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
