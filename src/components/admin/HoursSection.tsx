import { useState } from 'react';
import type { ToastAPI } from './Toast';

type Row = { id: string; day_label: string; hours_text: string; is_open: boolean };

// TODO: Load from hours table (SELECT * FROM hours ORDER BY updated_at)
const INITIAL_ROWS: Row[] = [
  { id: 'h1', day_label: 'Daily', hours_text: '4 PM – 1 AM', is_open: true },
  { id: 'h2', day_label: 'Late Night', hours_text: 'Welcome anytime after midnight', is_open: true },
];

export function HoursSection({ toast }: { toast: ToastAPI }) {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({});

  const update = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const saveRow = (id: string) => {
    // TODO: await supabase.from('hours').update({ day_label, hours_text, is_open }).eq('id', id)
    setSavedFlash((s) => ({ ...s, [id]: true }));
    toast.success('Hours updated ✓');
    setTimeout(() => setSavedFlash((s) => ({ ...s, [id]: false })), 1600);
  };

  const addRow = () => {
    // TODO: await supabase.from('hours').insert({ day_label: '', hours_text: '', is_open: true })
    setRows((prev) => [...prev, { id: `new-${Date.now()}`, day_label: '', hours_text: '', is_open: true }]);
  };

  const removeRow = (id: string) => {
    // TODO: await supabase.from('hours').delete().eq('id', id)
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(245,200,0,0.2)',
    color: 'white',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Hours
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Update your hours. Changes reflect on the website immediately.
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#2a317a',
              border: '1px solid rgba(245,200,0,0.15)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '200px 1fr 150px 100px 24px 40px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <input
              value={r.day_label}
              onChange={(e) => update(r.id, { day_label: e.target.value })}
              placeholder="Day label"
              style={inputStyle}
            />
            <input
              value={r.hours_text}
              onChange={(e) => update(r.id, { hours_text: e.target.value })}
              placeholder="Hours text"
              style={inputStyle}
            />
            <button
              onClick={() => update(r.id, { is_open: !r.is_open })}
              style={{
                background: r.is_open ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                color: r.is_open ? '#2ecc71' : '#e74c3c',
                border: `1px solid ${r.is_open ? 'rgba(46,204,113,0.5)' : 'rgba(231,76,60,0.5)'}`,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {r.is_open ? 'Open' : 'Closed'}
            </button>
            <button
              onClick={() => saveRow(r.id)}
              style={{
                background: '#F5C800',
                color: '#212666',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                fontWeight: 700,
              }}
            >
              SAVE
            </button>
            <div style={{ color: '#2ecc71', fontSize: 16, opacity: savedFlash[r.id] ? 1 : 0, transition: 'opacity 0.2s' }}>✓</div>
            <button
              onClick={() => removeRow(r.id)}
              aria-label="Delete row"
              style={{
                background: 'transparent',
                border: '1px solid rgba(231,76,60,0.4)',
                color: '#e74c3c',
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        style={{
          marginTop: 18,
          background: 'transparent',
          border: '1px dashed rgba(245,200,0,0.4)',
          color: '#F5C800',
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          padding: '10px 20px',
          borderRadius: 10,
          cursor: 'pointer',
          letterSpacing: '0.06em',
        }}
      >
        + ADD NEW ROW
      </button>
    </div>
  );
}
