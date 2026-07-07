import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import logo from '@/assets/dhaka-street-logo.jpg';
import { supabase } from '@/integrations/supabase/client';
import { GallerySection } from '@/components/admin/GallerySection';
import { VideoSection } from '@/components/admin/VideoSection';
import { MenuSection } from '@/components/admin/MenuSection';
import { BannerSection } from '@/components/admin/BannerSection';
import { HoursSection } from '@/components/admin/HoursSection';
import { CRMSection } from '@/components/admin/CRMSection';
import { BookingsSection } from '@/components/admin/BookingsSection';
import { SubmissionsSection } from '@/components/admin/SubmissionsSection';
import { AvailabilitySection } from '@/components/admin/AvailabilitySection';
import { AnalyticsSection } from '@/components/admin/AnalyticsSection';
import { ToastHost, useToastController, type ToastAPI } from '@/components/admin/Toast';

// ─── SUPABASE INTEGRATION POINTS ───
// Developer: Wire these up after connecting Supabase
// Project: dhaka-street
// URL: https://ezlcmitojisrlhmwoiqq.supabase.co
// Tables: announcements, hours, video_settings, menu_items, moments
// Storage bucket: moments (public)
// Auth: email + password
// RLS: public SELECT, authenticated admin INSERT/UPDATE/DELETE

type SectionId = 'gallery' | 'video' | 'menu' | 'banner' | 'hours' | 'crm' | 'bookings' | 'submissions' | 'availability' | 'analytics';

const SECTIONS: { id: SectionId; icon: string; label: string }[] = [
  { id: 'gallery', icon: '📸', label: 'Gallery' },
  { id: 'video', icon: '🎥', label: 'Video' },
  { id: 'menu', icon: '📋', label: 'Menu' },
  { id: 'banner', icon: '📢', label: 'Banner' },
  { id: 'hours', icon: '🕐', label: 'Hours' },
  { id: 'crm', icon: '👥', label: 'CRM' },
  { id: 'bookings', icon: '📅', label: 'Bookings' },
  { id: 'submissions', icon: '📥', label: 'Submissions' },
  { id: 'availability', icon: '🕒', label: 'Availability' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
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
          <button onClick={() => { reset(); router.invalidate(); }} style={{ marginTop: 16, background: '#F5C800', color: '#212666', padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
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
  const [active, setActive] = useState<SectionId>('gallery');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const toastCtrl = useToastController();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: '/admin' });
      } else {
        supabase.from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .then(({ data: roles, error }) => {
            if (error || !roles || roles.length === 0) {
              supabase.auth.signOut().then(() => {
                navigate({ to: '/admin' });
              });
            } else {
              setCheckingAuth(false);
            }
          });
      }
    });
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate({ to: '/admin' });
  }, [navigate]);

  const toast: ToastAPI = toastCtrl.api;

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#181e55', color: 'white', display: 'grid', placeItems: 'center', fontFamily: "'Space Mono', monospace" }}>
        Loading admin session...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#181e55', color: 'white', paddingBottom: 96 }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-tabbar-mobile { display: flex !important; }
          .admin-content { margin-left: 0 !important; padding: 20px !important; }
        }
      `}</style>

      {/* Top navbar */}
      <nav
        className="admin-nav"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={logo} alt="Dhaka Street" width={44} height={44} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 22, letterSpacing: '0.04em' }}>
            Admin Dashboard
          </span>
        </div>
        <button
          className="logout-btn"
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
            letterSpacing: '0.08em',
          }}
        >
          LOGOUT
        </button>
      </nav>

      <div style={{ display: 'flex' }}>
        {/* Sidebar (desktop) */}
        <aside
          className="admin-sidebar"
          style={{
            width: 240,
            minHeight: 'calc(100vh - 78px)',
            background: '#212666',
            borderRight: '1px solid rgba(245,200,0,0.15)',
            padding: '24px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            position: 'sticky',
            top: 78,
            alignSelf: 'flex-start',
          }}
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  textAlign: 'left',
                  background: isActive ? 'rgba(245,200,0,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245,200,0,0.35)' : '1px solid transparent',
                  color: isActive ? '#F5C800' : 'rgba(255,255,255,0.75)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  padding: '12px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  letterSpacing: '0.03em',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="admin-content" style={{ flex: 1, padding: 36 }}>
          {active === 'gallery' && <GallerySection toast={toast} />}
          {active === 'video' && <VideoSection toast={toast} />}
          {active === 'menu' && <MenuSection toast={toast} />}
          {active === 'banner' && <BannerSection toast={toast} />}
          {active === 'hours' && <HoursSection toast={toast} />}
          {active === 'crm' && <CRMSection toast={toast} />}
          {active === 'bookings' && <BookingsSection toast={toast} />}
          {active === 'submissions' && <SubmissionsSection toast={toast} />}
          {active === 'availability' && <AvailabilitySection toast={toast} />}
          {active === 'analytics' && <AnalyticsSection toast={toast} />}
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav
        className="admin-tabbar-mobile"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#212666',
          borderTop: '1px solid rgba(245,200,0,0.15)',
          padding: '8px 6px',
          justifyContent: 'space-around',
          zIndex: 100,
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#F5C800' : 'rgba(255,255,255,0.6)',
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                padding: '6px 4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                borderTop: isActive ? '2px solid #F5C800' : '2px solid transparent',
                minWidth: 56,
              }}
            >
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </nav>

      <ToastHost controller={toastCtrl} />
    </div>
  );
}
