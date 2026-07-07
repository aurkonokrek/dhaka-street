import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type Photo = { id: string; url: string; uploaded_at: string };

export function GallerySection({ toast }: { toast: ToastAPI }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('moments')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching moments:', error);
        } else if (data) {
          setPhotos(data.map((m: any) => ({
            id: m.id,
            url: m.image_url,
            uploaded_at: m.uploaded_at ? m.uploaded_at.slice(0, 10) : '',
          })));
        }
        setLoading(false);
      });
  }, []);

  const handleFiles = async (files: FileList | null) => {
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

      try {
        const fileExt = f.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('moments')
          .upload(path, f);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('moments')
          .getPublicUrl(path);

        const { data: momentData, error: dbError } = await supabase
          .from('moments')
          .insert({ image_url: publicUrl, caption: f.name })
          .select()
          .single();

        if (dbError) throw dbError;

        if (momentData) {
          next.push({
            id: momentData.id,
            url: momentData.image_url,
            uploaded_at: momentData.uploaded_at ? momentData.uploaded_at.slice(0, 10) : '',
          });
        }
      } catch (err: any) {
        toast.error(`Upload failed: ${err.message}`);
      }
    }
    
    if (next.length > 0) {
      setPhotos((prev) => [...next, ...prev]);
      toast.success(`Uploaded ${next.length} photo${next.length > 1 ? 's' : ''} ✓`);
    }
  };

  const removePhoto = async (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;

    try {
      const urlParts = photo.url.split('/moments/');
      const path = urlParts[urlParts.length - 1];

      const { error: dbError } = await supabase.from('moments').delete().eq('id', id);
      if (dbError) throw dbError;

      if (path) {
        await supabase.storage.from('moments').remove([path]);
      }

      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Photo removed');
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading moments...
      </div>
    );
  }

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
