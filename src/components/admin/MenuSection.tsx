import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Item = {
  id: string;
  category: string;
  name: string;
  price: string;
  is_available: boolean;
  updated_at: string;
};

export function MenuSection() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Add form
  const [newCat, setNewCat] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('menu_items').select('*').order('category').order('name');
    if (error) setErr(error.message);
    else {
      setItems((data as Item[]) || []);
      if (data && data.length && !activeCat) setActiveCat((data[0] as Item).category);
    }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const shown = items.filter((i) => i.category === activeCat);

  const updateRow = async (id: string, patch: Partial<Item>) => {
    setMsg(''); setErr('');
    const { error } = await supabase.from('menu_items').update(patch).eq('id', id);
    if (error) setErr(error.message); else { setMsg('Saved.'); load(); }
  };

  const deleteRow = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    load();
  };

  const addItem = async () => {
    setErr(''); setMsg('');
    if (!newCat.trim() || !newName.trim() || !newPrice.trim()) { setErr('Fill all fields'); return; }
    const { error } = await supabase.from('menu_items').insert({ category: newCat.trim(), name: newName.trim(), price: newPrice.trim(), is_available: true });
    if (error) { setErr(error.message); return; }
    setNewName(''); setNewPrice('');
    setActiveCat(newCat.trim());
    load();
  };

  return (
    <div>
      <h2 style={h2}>📋 Menu Management</h2>
      <p style={sub}>Toggle items as available or sold out. Update prices.</p>

      {/* Add new item */}
      <div style={{ ...card, marginTop: 20 }}>
        <p style={{ ...label, marginBottom: 12 }}>ADD ITEM</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: 8 }}>
          <input list="cats" placeholder="Category" value={newCat} onChange={(e) => setNewCat(e.target.value)} style={input} />
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <input placeholder="Item name" value={newName} onChange={(e) => setNewName(e.target.value)} style={input} />
          <input placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={input} />
          <button onClick={addItem} style={saveBtn}>ADD</button>
        </div>
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: activeCat === c ? '1px solid #F5C800' : '1px solid rgba(255,255,255,0.15)',
                background: activeCat === c ? 'rgba(245,200,0,0.15)' : 'transparent',
                color: activeCat === c ? '#F5C800' : 'rgba(255,255,255,0.75)',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {err && <p style={errStyle}>{err}</p>}
      {msg && <p style={msgStyle}>{msg}</p>}

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>Loading…</p>
        ) : shown.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono', monospace" }}>No items in this category.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shown.map((it) => <MenuRow key={it.id} item={it} onSave={updateRow} onDelete={deleteRow} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuRow({ item, onSave, onDelete }: { item: Item; onSave: (id: string, patch: Partial<Item>) => void; onDelete: (id: string) => void }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [available, setAvailable] = useState(item.is_available);
  const dirty = name !== item.name || price !== item.price || available !== item.is_available;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto auto auto', gap: 8, alignItems: 'center', background: '#212666', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
      <input value={name} onChange={(e) => setName(e.target.value)} style={input} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} style={input} />
      <button
        onClick={() => setAvailable(!available)}
        style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: 'none',
          background: available ? '#2ecc71' : '#e74c3c',
          color: 'white',
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          cursor: 'pointer',
          minWidth: 100,
        }}
      >
        {available ? 'AVAILABLE' : 'SOLD OUT'}
      </button>
      <button
        onClick={() => onSave(item.id, { name, price, is_available: available })}
        disabled={!dirty}
        style={{ ...saveBtn, padding: '8px 14px', fontSize: 14, opacity: dirty ? 1 : 0.5, cursor: dirty ? 'pointer' : 'default' }}
      >
        SAVE
      </button>
      <button onClick={() => onDelete(item.id)} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.5)', color: '#e74c3c', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>🗑</button>
    </div>
  );
}

const h2: React.CSSProperties = { fontFamily: "'Hangyaboli', cursive", fontSize: 28, margin: 0 };
const sub: React.CSSProperties = { fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 8 };
const card: React.CSSProperties = { background: '#212666', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 16, padding: 20 };
const label: React.CSSProperties = { fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', margin: 0 };
const input: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', color: 'white', fontFamily: "'Space Mono', monospace", fontSize: 13, outline: 'none', boxSizing: 'border-box', width: '100%' };
const saveBtn: React.CSSProperties = { background: '#F5C800', color: '#212666', fontFamily: "'Hangyaboli', cursive", fontSize: 15, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' };
const errStyle: React.CSSProperties = { color: '#ff5b5b', fontSize: 12, marginTop: 12, fontFamily: "'Space Mono', monospace" };
const msgStyle: React.CSSProperties = { color: '#7ee787', fontSize: 12, marginTop: 12, fontFamily: "'Space Mono', monospace" };
