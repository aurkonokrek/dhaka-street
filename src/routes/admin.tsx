import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/dhaka-street-logo.jpg';

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

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already signed in, skip to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/admin/dashboard' });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('Wrong credentials. Try again.');
    } else {
      navigate({ to: '/admin/dashboard' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#212666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
        padding: '40px 20px',
      }}
    >
      <img
        src={logo}
        alt="Dhaka Street"
        style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,200,0,0.35)' }}
      />
      <div
        style={{
          background: '#2a317a',
          border: '1px solid rgba(245,200,0,0.15)',
          borderRadius: 20,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: "'Hangyaboli', cursive",
              color: 'white',
              fontSize: 32,
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            ADMIN LOGIN
          </h1>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'rgba(255,255,255,0.45)',
              fontSize: 12,
              marginTop: 8,
              letterSpacing: '0.08em',
            }}
          >
            Owner access only.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,200,0,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,200,0,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />

          {error && (
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                color: '#ff5b5b',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#F5C800',
              color: '#212666',
              fontFamily: "'Hangyaboli', cursive",
              fontSize: 20,
              border: 'none',
              borderRadius: 10,
              padding: 14,
              cursor: loading ? 'wait' : 'pointer',
              width: '100%',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.background = '#ffd700';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F5C800';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '14px 18px',
  color: 'white',
  fontFamily: "'Space Mono', monospace",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};
