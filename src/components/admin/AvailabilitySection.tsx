import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type AvailabilityWindow = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  active: boolean;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AvailabilitySection({ toast }: { toast: ToastAPI }) {
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('18:00');
  const [slotMinutes, setSlotMinutes] = useState(60);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('weekday', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setWindows(data || []);
    } catch (err: any) {
      toast.error(`Load availability failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('availability')
        .update({ active })
        .eq('id', id);

      if (error) throw error;
      setWindows(prev => prev.map(w => w.id === id ? { ...w, active } : w));
      toast.success(active ? 'Window enabled ✓' : 'Window disabled ✓');
    } catch (err: any) {
      toast.error(`Toggle failed: ${err.message}`);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability window?')) return;
    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWindows(prev => prev.filter(w => w.id !== id));
      toast.success('Window removed');
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endTime <= startTime) {
      alert('End time must be after start time.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('availability')
        .insert({
          weekday: Number(weekday),
          start_time: startTime + ':00',
          end_time: endTime + ':00',
          slot_minutes: Number(slotMinutes),
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setWindows(prev => [...prev, data].sort((a, b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time)));
        toast.success('Availability window added ✓');
        setShowAddForm(false);
      }
    } catch (err: any) {
      toast.error(`Add failed: ${err.message}`);
    }
  };

  const formInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(245,200,0,0.25)',
    color: 'white',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    marginTop: 4,
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading availability...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
            Availability Slots
          </h2>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 0 }}>
            Define the weekly hours windows visitors can book catering or consultations in.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: '#F5C800',
            color: '#212666',
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: '0.05em'
          }}
        >
          {showAddForm ? '✕ CANCEL' : '+ ADD WINDOW'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{
          background: '#2a317a',
          border: '1px solid rgba(245,200,0,0.25)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          maxWidth: 600,
          display: 'grid',
          gap: 16
        }}>
          <h3 style={{ margin: 0, color: 'white', fontFamily: "'Space Mono', monospace", fontSize: 16 }}>Add New Availability Window</h3>
          
          <div>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Space Mono', monospace" }}>DAY OF WEEK</label>
            <select
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              style={formInputStyle}
            >
              {WEEKDAYS.map((dayName, idx) => (
                <option key={idx} value={idx}>{dayName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Space Mono', monospace" }}>START TIME</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={formInputStyle}
                required
              />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Space Mono', monospace" }}>END TIME</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={formInputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'Space Mono', monospace" }}>SLOT DURATION (MINUTES)</label>
            <input
              type="number"
              min={5}
              max={240}
              value={slotMinutes}
              onChange={(e) => setSlotMinutes(Number(e.target.value))}
              style={formInputStyle}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              background: '#F5C800',
              color: '#212666',
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              border: 'none',
              borderRadius: 8,
              padding: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              marginTop: 8
            }}
          >
            SAVE WINDOW
          </button>
        </form>
      )}

      {windows.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed rgba(245,200,0,0.2)',
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255,255,255,0.5)'
        }}>
          No availability windows defined yet. Add a window to start accepting slots.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {WEEKDAYS.map((dayName, dayIdx) => {
            const dayWindows = windows.filter((w) => w.weekday === dayIdx);
            if (dayWindows.length === 0) return null;
            return (
              <div
                key={dayIdx}
                style={{
                  background: '#2a317a',
                  border: '1px solid rgba(245,200,0,0.15)',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F5C800', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  {dayName}
                </h3>
                <div style={{ display: 'grid', gap: 8 }}>
                  {dayWindows.map((w) => (
                    <div
                      key={w.id}
                      style={{
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                        <span style={{ fontWeight: 'bold', color: 'white' }}>
                          {w.start_time.slice(0, 5)} – {w.end_time.slice(0, 5)}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                          ({w.slot_minutes} min slots)
                        </span>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: w.active ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.08)',
                          color: w.active ? '#2ecc71' : 'rgba(255,255,255,0.45)',
                        }}>
                          {w.active ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleToggle(w.id, !w.active)}
                          style={{
                            background: 'transparent',
                            color: w.active ? '#e74c3c' : '#2ecc71',
                            border: `1px solid ${w.active ? 'rgba(231,76,60,0.4)' : 'rgba(46,204,113,0.4)'}`,
                            borderRadius: 6,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 11,
                            fontFamily: "'Space Mono', monospace",
                          }}
                        >
                          {w.active ? 'DISABLE' : 'ENABLE'}
                        </button>
                        <button
                          onClick={() => handleRemove(w.id)}
                          style={{
                            background: 'transparent',
                            color: '#e74c3c',
                            border: '1px solid rgba(231,76,60,0.4)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 11
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
