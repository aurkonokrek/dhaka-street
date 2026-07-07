import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type Booking = {
  id: string;
  contact_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: string;
  notes: string | null;
  details: Record<string, any>;
  created_at: string;
  contacts: {
    name: string;
    phone: string | null;
    email: string | null;
    branch: string | null;
  } | null;
};

export function BookingsSection({ toast }: { toast: ToastAPI }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          contact_id,
          date,
          time,
          status,
          source,
          notes,
          details,
          created_at,
          contacts (
            name,
            phone,
            email,
            branch
          )
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setBookings((data || []) as any[]);
    } catch (err: any) {
      toast.error(`Load bookings failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking status updated to ${status} ✓`);
    } catch (err: any) {
      toast.error(`Update status failed: ${err.message}`);
    }
  };

  const handleReschedule = async (id: string) => {
    const defaultDate = new Date().toISOString().slice(0, 10);
    const dateInput = prompt('Enter new date (YYYY-MM-DD):', defaultDate);
    if (!dateInput) return;
    const timeInput = prompt('Enter new time (HH:MM):', '12:00');
    if (!timeInput) return;

    try {
      // Call RPC
      const { data, error } = await supabase.rpc('reschedule_booking', {
        p_booking_id: id,
        p_slot_date: dateInput,
        p_slot_time: timeInput,
      });

      if (error) throw error;
      
      const res = data as any;
      if (res?.status !== 'ok') {
        toast.error(`Could not reschedule: ${res?.status || 'invalid slot'}`);
      } else {
        toast.success('Rescheduled successfully ✓');
        fetchBookings();
      }
    } catch (err: any) {
      toast.error(`Reschedule failed: ${err.message}`);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { background: 'rgba(46,204,113,0.15)', color: '#2ecc71' };
      case 'cancelled':
        return { background: 'rgba(231,76,60,0.15)', color: '#e74c3c' };
      case 'pending':
      default:
        return { background: 'rgba(243,156,18,0.15)', color: '#f39c12' };
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading bookings...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Bookings & Reservations
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Confirm, cancel, or reschedule customer catering & table bookings.
      </p>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed rgba(245,200,0,0.2)',
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255,255,255,0.5)'
        }}>
          No bookings found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#2a317a', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Space Mono', monospace", fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,200,0,0.2)', color: '#F5C800' }}>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Date</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Time</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Contact</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 'bold' }}>Source</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const badge = getStatusStyles(b.status);
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>
                      {new Date(`${b.date}T00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{b.time.slice(0, 5)}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{b.contacts?.name ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)' }}>
                      {b.contacts?.phone && <div>📞 {b.contacts.phone}</div>}
                      {b.contacts?.email && <div style={{ fontSize: 11 }}>✉️ {b.contacts.email}</div>}
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
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)' }}>{b.source}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            style={{
                              background: 'rgba(46,204,113,0.15)',
                              color: '#2ecc71',
                              border: '1px solid rgba(46,204,113,0.3)',
                              borderRadius: 6,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 11
                            }}
                            title="Confirm Booking"
                          >
                            ✓ CONFIRM
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            style={{
                              background: 'rgba(231,76,60,0.15)',
                              color: '#e74c3c',
                              border: '1px solid rgba(231,76,60,0.3)',
                              borderRadius: 6,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 11
                            }}
                            title="Cancel Booking"
                          >
                            ✗ CANCEL
                          </button>
                        )}
                        <button
                          onClick={() => handleReschedule(b.id)}
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
                          title="Reschedule Booking"
                        >
                          📅 MOVE
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
