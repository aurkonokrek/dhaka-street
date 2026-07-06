import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Moment = { id: string; image_url: string; caption: string | null; uploaded_at: string };

const MAX_MB = 5;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];

export function GallerySection() {
  const [items, setItems] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('moments').select('*').order('uploaded_at', { ascending: false });
    if (error) setErr(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFiles = async (files: FileList | File[]) => {
    setErr('');
    const arr = Array.from(files);
    for (const file of arr) {
      if (!ACCEPT.includes(file.type)) { setErr(`${file.name}: use JPG, PNG, or WebP`); continue; }
      if (file.size > MAX_MB * 1024 * 1024) { setErr(`${file.name}: over ${MAX_MB}MB`); continue; }
      setUploading(true);
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: up, error: upErr } = await supabase.storage.from('moments').upload(path, file);
      if (upErr || !up) { setErr(upErr?.message || 'Upload failed'); setUploading(false); continue; }
      const publicUrl = supabase.storage.from('moments').getPublicUrl(up.path).data.publicUrl;
      const { error: insErr } = await supabase.from('moments').insert({ image_url: publicUrl });
      if (insErr) setErr(insErr.message);
      setUploading(false);
    }
    load();
  };

  const handleDelete = async (m: Moment) => {
    if (!confirm('Delete this photo?')) return;
    // derive storage path from public URL
    const match = m.image_url.match(/moments\/(.+)$/);
    const path = match?.[1];
    if (path) await supabase.storage.from('moments').remove([path]);
    await supabase.from('moments').delete().eq('id', m.id);
    load();
  };

  return (
    <div>
      <h2 style={h2}>📸 Moments Gallery</h2>
      <p style={sub}>Upload customer photos. They appear on the website instantly.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        style={{
          marginTop: 20,
          border: `2px dashed ${dragOver ? '#F5C800' : 'rgba(245,200,0,0.35)'}`,
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          background: dragOver ? 'rgba(245,200,0,0.08)' : '#212666',
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: 40 }}>📤</div>
        <p style={{ fontFamily: "'Space Mono', monospace", marginTop: 8, color: 'rgba(255,255,255,0.75)' }}>
          Drop photos here or
        </p>
        <label style={{ display: 'inline-block', marginTop: 12, background: '#F5C800', color: '#212666', padding: '10px 22px', borderRadius: 8, fontFamily: "'Hangyaboli', cursive", fontSize: 16, cursor: 'pointer' }}>
          {uploading ? 'UPLOADING…' : 'BROWSE'}
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </label>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>
          JPG, PNG, WebP · max {MAX_MB}MB
        </p>
        {err && <p style={{ color: '#ff5b5b', fontSize: 12, marginTop: 12, fontFamily: "'Space Mono', monospace" }}>{err}</p>}
      </div>

      <div style={{ marginTop: 28 }}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>No photos yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {items.map((m) => (
              <div key={m.id} style={{ background: '#212666', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ position: 'relative', paddingBottom: '75%', background: '#0f1240' }}>
                  <img src={m.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleDelete(m)}
                    title="Delete"
                    style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
                  >
                    🗑
                  </button>
                </div>
                <div style={{ padding: 10, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                  {new Date(m.uploaded_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const h2: React.CSSProperties = { fontFamily: "'Hangyaboli', cursive", fontSize: 28, margin: 0 };
const sub: React.CSSProperties = { fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 8 };
