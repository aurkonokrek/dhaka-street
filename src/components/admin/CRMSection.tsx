import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type Contact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  branch: string | null;
  details: Record<string, any>;
  notes: string | null;
  created_at: string;
};

export function CRMSection({ toast }: { toast: ToastAPI }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<Record<string, boolean>>({});

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
      
      // Initialize notes draft inputs
      const drafts: Record<string, string> = {};
      (data || []).forEach(c => {
        drafts[c.id] = c.notes || '';
      });
      setEditingNotes(drafts);
    } catch (err: any) {
      toast.error(`CRM Load failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSaveNote = async (id: string) => {
    setSavingNote(prev => ({ ...prev, [id]: true }));
    try {
      const noteText = editingNotes[id] || '';
      const { error } = await supabase
        .from('contacts')
        .update({ notes: noteText })
        .eq('id', id);

      if (error) throw error;
      
      setContacts(prev => prev.map(c => c.id === id ? { ...c, notes: noteText } : c));
      toast.success('Notes saved ✓');
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    } finally {
      setSavingNote(prev => ({ ...prev, [id]: false }));
    }
  };

  const filtered = contacts.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      (c.phone && c.phone.includes(s)) ||
      (c.email && c.email.toLowerCase().includes(s)) ||
      (c.branch && c.branch.toLowerCase().includes(s))
    );
  });

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(245,200,0,0.25)',
    color: 'white',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
    marginBottom: 20,
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading contacts...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        CRM & Contacts
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 20 }}>
        Leads captured from bookings and inquiries. Add private notes.
      </p>

      <input
        type="text"
        placeholder="Search contacts by name, email, phone or branch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed rgba(245,200,0,0.2)',
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255,255,255,0.5)'
        }}>
          No contacts found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#2a317a',
                border: '1px solid rgba(245,200,0,0.15)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontFamily: "'Space Mono', monospace", fontSize: 16, color: 'white', fontWeight: 'bold' }}>
                    {c.name}
                  </h3>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace" }}>
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                <div style={{ marginTop: 10, fontSize: 13, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.7)', display: 'grid', gap: 4 }}>
                  {c.phone && <div>📞 {c.phone}</div>}
                  {c.email && <div>✉️ {c.email}</div>}
                  {c.branch && <div>📍 Branch: {c.branch}</div>}
                  {c.details && Object.keys(c.details).length > 0 && (
                    <div style={{ marginTop: 6, padding: 6, background: 'rgba(0,0,0,0.15)', borderRadius: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      {Object.entries(c.details).map(([k, v]) => (
                        <div key={k}>{k}: {String(v)}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <textarea
                  rows={2}
                  value={editingNotes[c.id] || ''}
                  onChange={(e) => setEditingNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                  placeholder="Add private note..."
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(245,200,0,0.15)',
                    borderRadius: 8,
                    padding: '6px 10px',
                    color: 'white',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <button
                  type="button"
                  disabled={savingNote[c.id] || editingNotes[c.id] === (c.notes || '')}
                  onClick={() => handleSaveNote(c.id)}
                  style={{
                    background: editingNotes[c.id] === (c.notes || '') ? 'rgba(245,200,0,0.1)' : '#F5C800',
                    color: editingNotes[c.id] === (c.notes || '') ? 'rgba(255,255,255,0.3)' : '#212666',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 12px',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: "'Space Mono', monospace",
                    transition: 'all 0.2s',
                  }}
                >
                  {savingNote[c.id] ? '...' : 'SAVE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
