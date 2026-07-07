import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type Submission = {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  language: string;
  status: 'new' | 'contacted' | 'closed';
  details: Record<string, any>;
  created_at: string;
};

export function SubmissionsSection({ toast }: { toast: ToastAPI }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err: any) {
      toast.error(`Load submissions failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      toast.success(`Marked as ${status} ✓`);
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  const handleConvert = async (s: Submission) => {
    if (s.status === 'closed') return;
    if (!confirm(`Add "${s.name}" to CRM and close this submission?`)) return;

    try {
      // Check if contact already promotes from this submission
      const { data: existing, error: existError } = await supabase
        .from('contacts')
        .select('id')
        .eq('source_submission_id', s.id)
        .maybeSingle();

      if (existError) throw existError;

      if (!existing) {
        const { error: insertError } = await supabase
          .from('contacts')
          .insert({
            name: s.name,
            phone: s.phone,
            email: s.email,
            source_submission_id: s.id,
            details: s.details || {},
            notes: s.message,
          });

        if (insertError) throw insertError;
      }

      const { error: updateError } = await supabase
        .from('inquiries')
        .update({ status: 'closed' })
        .eq('id', s.id);

      if (updateError) throw updateError;

      setSubmissions(prev => prev.map(item => item.id === s.id ? { ...item, status: 'closed' } : item));
      toast.success('Successfully added to CRM ✓');
    } catch (err: any) {
      toast.error(`Conversion failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast.success('Submission deleted');
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const cleanPhoneDigits = (phone: string) => {
    return phone.replace(/[^\d]/g, '');
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'new':
        return { background: 'rgba(52,152,219,0.15)', color: '#3498db' };
      case 'contacted':
        return { background: 'rgba(243,156,18,0.15)', color: '#f39c12' };
      case 'closed':
      default:
        return { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' };
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading submissions...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Inbound Submissions
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Incoming inquiries from the website. Review, contact, then add to CRM.
      </p>

      {submissions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed rgba(245,200,0,0.2)',
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255,255,255,0.5)'
        }}>
          No submissions found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Space Mono', monospace", fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,200,0,0.2)', color: '#F5C800' }}>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Name</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Type</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Phone</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Message</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((r) => {
                const badge = getStatusStyles(r.status);
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{r.name}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.type}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.phone ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.email ?? '—'}</td>
                    <td style={{ padding: '14px 16px', maxW: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.6)' }} title={r.message ?? ''}>
                      {r.message ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 'bold',
                        ...badge
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {r.phone && (
                          <a
                            href={`https://wa.me/${cleanPhoneDigits(r.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(46,204,113,0.15)',
                              color: '#2ecc71',
                              border: '1px solid rgba(46,204,113,0.3)',
                              borderRadius: 6,
                              padding: '4px 8px',
                              textDecoration: 'none',
                              fontSize: 11
                            }}
                            title="Message on WhatsApp"
                          >
                            💬 WA
                          </a>
                        )}
                        {r.status === 'new' && (
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'contacted')}
                            style={{
                              background: 'rgba(243,156,18,0.15)',
                              color: '#f39c12',
                              border: '1px solid rgba(243,156,18,0.3)',
                              borderRadius: 6,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 11
                            }}
                            title="Mark contacted"
                          >
                            ✓ CONTACT
                          </button>
                        )}
                        {r.status !== 'closed' && (
                          <button
                            onClick={() => handleConvert(r)}
                            style={{
                              background: '#F5C800',
                              color: '#212666',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 11,
                              fontWeight: 'bold'
                            }}
                            title="Add to CRM"
                          >
                            + CRM
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          style={{
                            background: 'transparent',
                            color: '#e74c3c',
                            border: '1px solid rgba(231,76,60,0.4)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 11
                          }}
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
