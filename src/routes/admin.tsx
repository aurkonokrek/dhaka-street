import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import logo from '@/assets/dhaka-street-logo.jpg';

// ─── SUPABASE INTEGRATION POINTS ───
// Developer: Wire these up after connecting Supabase
// Project: dhaka-street
// URL: https://ezlcmitojisrlhmwoiqq.supabase.co
// Tables: announcements, hours, video_settings, menu_items, moments
// Storage bucket: moments (public)
// Auth: email + password
// RLS: public SELECT, authenticated admin INSERT/UPDATE/DELETE

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin Login · Dhaka Street' },
      { name: 'description', content: 'Owner access only.' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLogin,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div style={{ minHeight: '100vh', background: '#212666', color: 'white', display: 'grid', placeItems: 'center', padding: 24 }}>
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

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Wrong credentials. Try again.');
      return;
    }
    setLoading(true);

    // TODO: Replace with supabase.auth.signInWithPassword({ email, password })
    // For now: any email + password combination goes through to dashboard.
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    navigate({ to: '/admin/dashboard' });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(245,200,0,0.25)',
    color: 'white',
    fontFamily: "'Space Mono', monospace",
    fontSize: 14,
    padding: '12px 14px',
    borderRadius: 10,
    outline: 'none',
  };

  return (
    <div className="admin-login-page" style={{ minHeight: '100vh', background: '#212666', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 18, padding: 36, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: 20 }}>
          <img src={logo} alt="Dhaka Street" width={88} height={88} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ textAlign: 'center', fontFamily: "'Hangyaboly', 'Space Mono', cursive", color: 'white', fontSize: 32, letterSpacing: '0.05em', margin: 0 }}>
          ADMIN LOGIN
        </h1>
        <p style={{ textAlign: 'center', fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 8, marginBottom: 28 }}>
          Owner access only.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />
          {error && (
            <p style={{ color: '#ff6b6b', fontFamily: "'Space Mono', monospace", fontSize: 12, margin: 0 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
            style={{
              background: '#F5C800',
              color: '#212666',
              fontFamily: "'Hangyaboly', 'Space Mono', cursive",
              fontSize: 20,
              border: 'none',
              borderRadius: 10,
              padding: 14,
              cursor: loading ? 'wait' : 'pointer',
              width: '100%',
              marginTop: 6,
              letterSpacing: '0.05em',
            }}
          >
            {loading ? 'SIGNING IN…' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
