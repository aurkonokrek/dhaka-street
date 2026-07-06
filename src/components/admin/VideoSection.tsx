import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; youtube_url: string; updated_at: string };

export function VideoSection() {
  const [row, setRow] = useState<Row | null>(null);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    const { data } = await supabase.from('video_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
    setRow(data as Row | null);
    setUrl(data?.youtube_url || '');
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setErr(''); setMsg(''); setSaving(true);
    if (!url.trim()) { setErr('URL cannot be empty'); setSaving(false); return; }
    if (row) {
      const { error } = await supabase.from('video_settings').update({ youtube_url: url.trim() }).eq('id', row.id);
      if (error) setErr(error.message); else setMsg('Saved.');
    } else {
      const { error } = await supabase.from('video_settings').insert({ youtube_url: url.trim() });
      if (error) setErr(error.message); else setMsg('Saved.');
    }
    setSaving(false);
    load();
  };

  return (
    <div>
      <h2 style={h2}>🎥 Customer Interview Video</h2>
      <p style={sub}>Paste your YouTube embed URL here.</p>

      <div style={card}>
        <label style={label}>YouTube URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
          style={input}
        />
        {row && (
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            Current: {row.youtube_url}
          </p>
        )}
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
