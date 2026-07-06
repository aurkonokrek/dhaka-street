import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/dhaka-street-logo.jpg';

type SectionId = 'gallery' | 'video' | 'menu' | 'banner' | 'hours';

const SECTIONS: { id: SectionId; icon: string; label: string }[] = [
  { id: 'gallery', icon: '📸', label: 'Gallery' },
  { id: 'video', icon: '🎥', label: 'Video' },
  { id: 'menu', icon: '📋', label: 'Menu' },
  { id: 'banner', icon: '📢', label: 'Banner' },
  { id: 'hours', icon: '🕐', label: 'Hours' },
];

export const Route = createFileRoute('/admin/dashboard')({
  head: () => ({
    meta: [
      { title: 'Admin Dashboard · Dhaka Street' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminDashboard,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div style={{ minHeight: '100vh', background: '#181e55', color: 'white', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Space Mono', monospace" }}>{error.message}</p>
          <button
            onClick={() => { reset(); router.invalidate(); }}
            style={{ marginTop: 16, background: '#F5C800', color: '#212666', padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => <div>Not found</div>,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<SectionId>('gallery');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: '/admin' });
      } else {
        setReady(true);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/admin' });
  };

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#181e55', color: 'rgba(255,255,255,0.5)', display: 'grid', placeItems: 'center', fontFamily: "'Space Mono', monospace" }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#181e55', color: 'white' }}>
      {/* Top navbar */}
      <nav
        style={{
          background: '#212666',
          borderBottom: '1px solid rgba(245,200,0,0.15)',
          padding: '16px 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={logo}
            alt="Dhaka Street"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,200,0,0.35)' }}
          />
          <span style={{ fontFamily: "'Hangyaboli', cursive", fontSize: 22, letterSpacing: '0.03em' }}>
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(231,76,60,0.5)',
            color: '#e74c3c',
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            padding: '8px 20px',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.1em',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e74c3c'; }}
        >
          LOGOUT
        </button>
      </nav>

      {/* Mobile tab bar */}
      <div className="admin-tabbar-mobile">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: active === s.id ? '#F5C800' : 'rgba(255,255,255,0.6)',
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              padding: '10px 4px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              borderBottom: active === s.id ? '2px solid #F5C800' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="admin-shell">
        {/* Sidebar (desktop) */}
        <aside className="admin-sidebar">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(245,200,0,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245,200,0,0.35)' : '1px solid transparent',
                  color: isActive ? '#F5C800' : 'rgba(255,255,255,0.75)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main style={{ padding: '32px 5%', flex: 1 }}>
          <SectionPlaceholder id={active} />
        </main>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: calc(100vh - 73px);
        }
        .admin-sidebar {
          width: 240px;
          background: #212666;
          border-right: 1px solid rgba(245,200,0,0.15);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-tabbar-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-tabbar-mobile {
            display: flex;
            background: #212666;
            border-bottom: 1px solid rgba(245,200,0,0.15);
            position: sticky;
            top: 73px;
            z-index: 90;
          }
        }
      `}</style>
    </div>
  );
}

function SectionPlaceholder({ id }: { id: SectionId }) {
  const section = SECTIONS.find((s) => s.id === id)!;
  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboli', cursive", fontSize: 28, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>{section.icon}</span> {section.label}
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 8 }}>
        Manage your {section.label.toLowerCase()} content here.
      </p>
      <div
        style={{
          marginTop: 24,
          background: '#212666',
          border: '1px dashed rgba(245,200,0,0.25)',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {section.label} editor coming next.
      </div>
    </div>
  );
}
