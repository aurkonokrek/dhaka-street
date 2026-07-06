import { useRef, useState } from 'react';
import type { ToastAPI } from './Toast';

// TODO: Replace mock data with SELECT * FROM moments ORDER BY uploaded_at DESC
const INITIAL_PHOTOS = [
  { id: 'm1', url: '', uploaded_at: '2026-07-01' },
  { id: 'm2', url: '', uploaded_at: '2026-06-28' },
  { id: 'm3', url: '', uploaded_at: '2026-06-25' },
  { id: 'm4', url: '', uploaded_at: '2026-06-22' },
  { id: 'm5', url: '', uploaded_at: '2026-06-18' },
  { id: 'm6', url: '', uploaded_at: '2026-06-14' },
];

type Photo = { id: string; url: string; uploaded_at: string };

export function GallerySection({ toast }: { toast: ToastAPI }) {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const accepted = ['image/jpeg', 'image/png', 'image/webp'];
    const next: Photo[] = [];
    for (const f of Array.from(files)) {
      if (!accepted.includes(f.type)) {
        toast.error(`${f.name}: unsupported type`);
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: over 5MB`);
        continue;
      }
      // TODO: Wire upload to Supabase Storage bucket "moments"
      //   const path = `${Date.now()}-${f.name}`;
      //   await supabase.storage.from('moments').upload(path, f);
      //   const { data: { publicUrl } } = supabase.storage.from('moments').getPublicUrl(path);
      //   await supabase.from('moments').insert({ image_url: publicUrl });
      next.push({
        id: `local-${Date.now()}-${f.name}`,
        url: URL.createObjectURL(f),
        uploaded_at: new Date().toISOString().slice(0, 10),
      });
    }
    if (next.length > 0) {
      setPhotos((prev) => [...next, ...prev]);
      toast.success(`Uploaded ${next.length} photo${next.length > 1 ? 's' : ''} ✓`);
    }
  };

  const removePhoto = (id: string) => {
    // TODO: Wire delete to Supabase Storage + moments table
    //   await supabase.from('moments').delete().eq('id', id);
    //   await supabase.storage.from('moments').remove([path]);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    toast.success('Photo removed');
  };

  return (
    <div>
      <SectionHeader
        title="Moments Gallery"
        subtitle="Upload customer photos. They appear on the website instantly."
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInput.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#F5C800' : 'rgba(245,200,0,0.4)'}`,
          background: dragging ? 'rgba(245,200,0,0.06)' : 'rgba(0,0,0,0.15)',
          borderRadius: 14,
          padding: 40,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: 40 }}>📷</div>
        <div style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 18, color: 'white', marginTop: 10 }}>
          Drop photos here or click to browse
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
          JPG · PNG · WebP · max 5MB each
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 28,
        }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#2a317a',
              border: '1px solid rgba(245,200,0,0.15)',
              borderRadius: 12,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ aspectRatio: '1 / 1', background: p.url ? '#000' : 'rgba(255,255,255,0.08)' }}>
              {p.url && <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <button
              onClick={() => removePhoto(p.id)}
              aria-label="Delete photo"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#e74c3c',
                border: 'none',
                color: 'white',
                width: 32,
                height: 32,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              🗑
            </button>
            <div style={{ padding: '8px 12px', fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
              {p.uploaded_at}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>{title}</h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{subtitle}</p>
    </div>
  );
}
