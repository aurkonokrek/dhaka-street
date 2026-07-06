import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; message: string; is_active: boolean; created_at: string };

export function BannerSection() {
  const [row, setRow] = useState<Row | null>(null);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
    const r = data as Row | null;
    setRow(r);
    setMessage(r?.message || '');
    setActive(!!r?.is_active);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setErr(''); setMsg(''); setSaving(true);
    if (!message.trim()) { setErr('Message cannot be empty'); setSaving(false); return; }
    // Deactivate all other announcements first so only this one is active
    if (active) await supabase.from('announcements').update({ is_active: false }).neq('id', row?.id ?? '00000000-0000-0000-0000-000000000000');
    if (row) {
      const { error } = await supabase.from('announcements').update({ message: message.trim(), is_active: active }).eq('id', row.id);
      if (error) setErr(error.message); else setMsg('Saved.');
    } else {
      const { error } = await supabase.from('announcements').insert({ message: message.trim(), is_active: active });
      if (error) setErr(error.message); else setMsg('Saved.');
    }
    setSaving(false);
    load();
  };

  return (
    <div>
      <h2 style={h2}>📢 Announcement Banner</h2>
      <p style={sub}>Show a message on the hero section. Useful for closures, events, or deals.</p>

      <div style={card}>
        <label style={label}>MESSAGE</label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="⚠️ Closed today for renovation. Back tomorrow at 4PM!"
          style={input}
        />

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setActive(!active)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: active ? '#2ecc71' : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {active ? 'ACTIVE' : 'INACTIVE'}
          </button>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {active ? 'Banner will show on the website' : 'Banner is hidden'}
          </span>
        </div>

        {/* Preview */}
        <div style={{ marginTop: 20 }}>
          <p style={label}>PREVIEW</p>
          <div style={{ background: '#F5C800', color: '#212666', padding: '12px 20px', borderRadius: 8, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, opacity: active ? 1 : 0.4 }}>
            <span>{message || 'Your message preview…'}</span>
            <span style={{ opacity: 0.6 }}>✕</span>
          </div>
        </div>

        {err && <p style={errStyle}>{err}</p>}
        {msg && <p style={msgStyle}>{msg}</p>}
        <button onClick={save} disabled={saving} style={saveBtn}>{saving ? 'SAVING…' : 'SAVE'}</button>
      </div>
    </div>
  );
}

const h2: React.CSSProperties = { fontFamily: "'Hangyaboli', cursive", fontSize: 28, margin: 0 };
const sub: React.CSSProperties = { fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 8 };
const card: React.CSSProperties = { marginTop: 20, background: '#212666', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 16, padding: 24 };
const label: React.CSSProperties = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8, letterSpacing: '0.08em' };
const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '12px 14px', color: 'white', fontFamily: "'Space Mono', monospace", fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const saveBtn: React.CSSProperties = { marginTop: 16, background: '#F5C800', color: '#212666', fontFamily: "'Hangyaboli', cursive", fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer' };
const errStyle: React.CSSProperties = { color: '#ff5b5b', fontSize: 12, marginTop: 10, fontFamily: "'Space Mono', monospace" };
const msgStyle: React.CSSProperties = { color: '#7ee787', fontSize: 12, marginTop: 10, fontFamily: "'Space Mono', monospace" };
