import { useState } from 'react';
import type { ToastAPI } from './Toast';

const PLACEHOLDER = 'https://www.youtube.com/embed/your-video-id';

export function VideoSection({ toast }: { toast: ToastAPI }) {
  // TODO: Load from video_settings table (SELECT youtube_url LIMIT 1)
  const [url, setUrl] = useState(PLACEHOLDER);
  const [draft, setDraft] = useState(PLACEHOLDER);

  const save = () => {
    // TODO: Save to video_settings table in Supabase
    //   await supabase.from('video_settings').upsert({ id, youtube_url: draft });
    setUrl(draft);
    toast.success('Saved successfully ✓');
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Video
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 28 }}>
        Set the customer interview video shown on the homepage.
      </p>

      <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
        CUSTOMER INTERVIEW VIDEO URL
      </label>
      <input
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={PLACEHOLDER}
        style={{
          width: '100%',
          marginTop: 8,
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(245,200,0,0.25)',
          color: 'white',
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          padding: '12px 14px',
          borderRadius: 10,
          outline: 'none',
        }}
      />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
        Current: {url}
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
        SAVE
      </button>
    </div>
  );
}
