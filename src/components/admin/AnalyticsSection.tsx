import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type TrafficRow = {
  day: string;
  pageviews: number;
  unique_visitors: number;
};

type PageRow = {
  path: string;
  pageviews: number;
  unique_visitors: number;
};

type SourceRow = {
  source: string;
  referrer_host: string | null;
  pageviews: number;
};

type CountryRow = {
  country: string;
  pageviews: number;
  unique_visitors: number;
};

type Conversions = {
  bookings_by_status: Record<string, number>;
  consultation_submissions: number;
  contact_submissions: number;
  book_consultation_views: number;
  contact_views: number;
};

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export function AnalyticsSection({ toast }: { toast: ToastAPI }) {
  const [from, setFrom] = useState(isoDaysAgo(29));
  const [to, setTo] = useState(todayStr());
  const [loading, setLoading] = useState(true);

  const [traffic, setTraffic] = useState<TrafficRow[]>([]);
  const [topPages, setTopPages] = useState<PageRow[]>([]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [conversions, setConversions] = useState<Conversions | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [trafficRes, topPagesRes, sourcesRes, countriesRes, conversionsRes] = await Promise.all([
        supabase.rpc('analytics_traffic', { p_from: from, p_to: to }),
        supabase.rpc('analytics_top_pages', { p_from: from, p_to: to, p_limit: 10 }),
        supabase.rpc('analytics_sources', { p_from: from, p_to: to }),
        supabase.rpc('analytics_by_country', { p_from: from, p_to: to }),
        supabase.rpc('analytics_conversions', { p_from: from, p_to: to }),
      ]);

      if (trafficRes.error) throw trafficRes.error;
      if (topPagesRes.error) throw topPagesRes.error;
      if (sourcesRes.error) throw sourcesRes.error;
      if (countriesRes.error) throw countriesRes.error;
      if (conversionsRes.error) throw conversionsRes.error;

      setTraffic(trafficRes.data || []);
      setTopPages(topPagesRes.data || []);
      setSources(sourcesRes.data || []);
      setCountries(countriesRes.data || []);
      setConversions((conversionsRes.data as Conversions) || null);
    } catch (err: any) {
      // Don't show toast error on first load if tables/rpcs are not created yet (user hasn't run sql migration)
      console.warn('Analytics load failed. Did you run the Supabase migrations?', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [from, to]);

  const totalViews = traffic.reduce((s, d) => s + Number(d.pageviews), 0);
  const totalVisitors = traffic.reduce((s, d) => s + Number(d.unique_visitors), 0);
  const maxPageviews = Math.max(1, ...topPages.map((p) => Number(p.pageviews)));

  const dateInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(245,200,0,0.25)',
    color: 'white',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    padding: '6px 10px',
    borderRadius: 8,
    outline: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
            Analytics Dashboard
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 0 }}>
            First-party traffic and conversions metrics.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={dateInputStyle} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace" }}>→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={dateInputStyle} />
        </div>
      </div>

      {loading ? (
        <div style={{ fontFamily: "'Space Mono', monospace", padding: '40px 0', textAlign: 'center' }}>
          Loading analytics metrics...
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Main Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pageviews</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F5C800', fontFamily: "'Space Mono', monospace", marginTop: 6 }}>{totalViews}</div>
            </div>
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unique Visitors</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F5C800', fontFamily: "'Space Mono', monospace", marginTop: 6 }}>{totalVisitors}</div>
            </div>
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking Page Views</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white', fontFamily: "'Space Mono', monospace", marginTop: 6 }}>{conversions?.book_consultation_views || 0}</div>
            </div>
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact Page Views</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white', fontFamily: "'Space Mono', monospace", marginTop: 6 }}>{conversions?.contact_views || 0}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {/* Top Pages */}
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 16px 0', fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F5C800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Pages</h3>
              {topPages.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: "'Space Mono', monospace" }}>No page views recorded in this period.</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {topPages.map((p) => {
                    const pct = (p.pageviews / maxPageviews) * 100;
                    return (
                      <div key={p.path} style={{ fontFamily: "'Space Mono', monospace" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'white' }}>
                          <span style={{ wordBreak: 'break-all' }}>{p.path}</span>
                          <span style={{ fontWeight: 'bold' }}>{p.pageviews}</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(0,0,0,0.2)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#F5C800', borderRadius: 999, width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sources & Countries */}
            <div style={{ display: 'grid', gap: 16 }}>
              {/* Traffic Channels / Sources */}
              <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F5C800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referral Sources</h3>
                {sources.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: "'Space Mono', monospace" }}>No source channels recorded.</div>
                ) : (
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: 6, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                    {sources.slice(0, 5).map((s, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {s.source} {s.referrer_host ? `(${s.referrer_host})` : ''}
                        </span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{s.pageviews}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Geographic Breakdown */}
              <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F5C800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Countries</h3>
                {countries.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: "'Space Mono', monospace" }}>No location data recorded.</div>
                ) : (
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: 6, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                    {countries.slice(0, 5).map((c) => (
                      <li key={c.country} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>{c.country}</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>{c.pageviews}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Conversions Details */}
          {conversions && (
            <div style={{ background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ margin: '0 0 16px 0', fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F5C800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversion Submissions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Consultations</div>
                  <div style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 4 }}>{conversions.consultation_submissions}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Contact inquiries</div>
                  <div style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 4 }}>{conversions.contact_submissions}</div>
                </div>
                {Object.entries(conversions.bookings_by_status || {}).map(([st, count]) => (
                  <div key={st}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{st} Bookings</div>
                    <div style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 4 }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
