import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; day_label: string; hours_text: string; is_open: boolean; updated_at: string };

export function HoursSection() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hours').select('*').order('updated_at');
    if (error) setErr(error.message);
    else setRows((data as Row[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addRow = async () => {
    setErr(''); setMsg('');
    if (!newLabel.trim() || !newText.trim()) { setErr('Fill both fields'); return; }
    const { error } = await supabase.from('hours').insert({ day_label: newLabel.trim(), hours_text: newText.trim(), is_open: true });
    if (error) { setErr(error.message); return; }
    setNewLabel(''); setNewText('');
    load();
  };

  const deleteRow = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await supabase.from('hours').delete().eq('id', id);
    load();
  };

  const saveRow = async (id: string, patch: Partial<Row>) => {
    setErr(''); setMsg('');
    const { error } = await supabase.from('hours').update(patch).eq('id', id);
    if (error) setErr(error.message); else { setMsg('Saved.'); load(); }
  };

  return (
    <div>
      <h2 style={h2}>🕐 Opening Hours</h2>
      <p style={sub}>Update your hours. Changes reflect on the website immediately.</p>

      <div style={{ ...card, marginTop: 20 }}>
        <p style={{ ...label, marginBottom: 12 }}>ADD ENTRY</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8 }}>
          <input placeholder="Day / label (e.g. Daily)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} style={input} />
          <input placeholder="Hours (e.g. 4 PM – 1 AM)" value={newText} onChange={(e) => setNewText(e.target.value)} style={input} />
          <button onClick={addRow} style={saveBtn}>ADD</button>
        </div>
      </div>

      {err && <p style={errStyle}>{err}</p>}
      {msg && <p style={msgStyle}>{msg}</p>}

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>No entries yet.</p>
        ) : (
          rows.map((r) => <HoursRow key={r.id} row={r} onSave={saveRow} onDelete={deleteRow} />)
        )}
      </div>
    </div>
  );
}

function HoursRow({ row, onSave, onDelete }: { row: Row; onSave: (id: string, patch: Partial<Row>) => void; onDelete: (id: string) => void }) {
  const [dayLabel, setDayLabel] = useState(row.day_label);
  const [hoursText, setHoursText] = useState(row.hours_text);
  const [isOpen, setIsOpen] = useState(row.is_open);
  const dirty = dayLabel !== row.day_label || hoursText !== row.hours_text || isOpen !== row.is_open;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto auto', gap: 8, alignItems: 'center', background: '#212666', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
      <input value={dayLabel} onChange={(e) => setDayLabel(e.target.value)} style={input} />
      <input value={hoursText} onChange={(e) => setHoursText(e.target.value)} style={input} />
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: isOpen ? '#2ecc71' : '#e74c3c', color: 'white', fontFamily: "'Space Mono', monospace", fontSize: 11, cursor: 'pointer', minWidth: 90 }}
      >
        {isOpen ? 'OPEN' : 'CLOSED'}
      </button>
      <button
        onClick={() => onSave(row.id, { day_label: dayLabel, hours_text: hoursText, is_open: isOpen })}
        disabled={!dirty}
        style={{ ...saveBtn, padding: '8px 14px', fontSize: 14, opacity: dirty ? 1 : 0.5, cursor: dirty ? 'pointer' : 'default' }}
      >
        SAVE
      </button>
      <button onClick={() => onDelete(row.id)} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.5)', color: '#e74c3c', padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}>🗑</button>
    </div>
  );
}

const h2: React.CSSProperties = { fontFamily: "'Hangyaboli', cursive", fontSize: 28, margin: 0 };
const sub: React.CSSProperties = { fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 8 };
const card: React.CSSProperties = { background: '#212666', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 16, padding: 20 };
const label: React.CSSProperties = { fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', margin: 0 };
const input: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', color: 'white', fontFamily: "'Space Mono', monospace", fontSize: 13, outline: 'none', boxSizing: 'border-box', width: '100%' };
const saveBtn: React.CSSProperties = { background: '#F5C800', color: '#212666', fontFamily: "'Hangyaboli', cursive", fontSize: 15, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' };
const errStyle: React.CSSProperties = { color: '#ff5b5b', fontSize: 12, marginTop: 12, fontFamily: "'Space Mono', monospace" };
const msgStyle: React.CSSProperties = { color: '#7ee787', fontSize: 12, marginTop: 12, fontFamily: "'Space Mono', monospace" };
