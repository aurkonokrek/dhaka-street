import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

const MAX = 120;

export function BannerSection({ toast }: { toast: ToastAPI }) {
  const [id, setId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching announcement:', error);
        } else if (data) {
          setId(data.id);
          setMessage(data.message);
          setIsActive(data.is_active);
        }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    try {
      const payload: any = {
        message,
        is_active: isActive,
      };
      if (id) {
        payload.id = id;
      }
      const { data, error } = await supabase
        .from('announcements')
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;
      if (data) setId(data.id);
      toast.success('Banner saved ✓');
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading announcement...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Announcement Banner
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Shows a strip at the top of the website when active.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
        placeholder="Type your announcement here..."
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(245,200,0,0.25)',
          color: 'white',
          fontFamily: "'Space Mono', monospace",
          fontSize: 14,
          padding: '12px 14px',
          borderRadius: 10,
          outline: 'none',
          resize: 'vertical',
        }}
      />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6, textAlign: 'right' }}>
        {message.length} / {MAX}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
        <button
          role="switch"
          aria-checked={isActive}
          onClick={() => setIsActive((v) => !v)}
          style={{
            width: 58,
            height: 30,
            borderRadius: 999,
            background: isActive ? '#2ecc71' : 'rgba(255,255,255,0.15)',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: isActive ? 31 : 3,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s',
            }}
          />
        </button>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            color: isActive ? '#2ecc71' : 'rgba(255,255,255,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          {isActive ? 'Banner is ACTIVE' : 'Banner is OFF'}
        </span>
      </div>

      <button
        onClick={save}
        style={{
          marginTop: 22,
          background: '#F5C800',
          color: '#212666',
          fontFamily: "'Hangyaboly', 'Space Mono', cursive",
          fontSize: 16,
          border: 'none',
          borderRadius: 10,
          padding: '12px 28px',
          cursor: 'pointer',
          letterSpacing: '0.06em',
        }}
      >
        SAVE BANNER
      </button>

      <div style={{ marginTop: 34 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginBottom: 10 }}>
          PREVIEW
        </div>
        <div
          style={{
            background: '#F5C800',
            color: '#212666',
            padding: '12px 20px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span>{message || 'Your announcement will appear here'}</span>
          <button
            aria-label="Close preview"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#212666',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 700,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
