import { useState } from 'react';
import type { ToastAPI } from './Toast';

// TODO: Load from menu_items table, save changes to Supabase
const INITIAL_MENU: Record<string, { id: string; name: string; price: string; is_available: boolean }[]> = {
  'Starters': [
    { id: 's1', name: 'Fuchka', price: '£5', is_available: true },
    { id: 's2', name: 'Chotpoti', price: '£5', is_available: true },
    { id: 's3', name: 'Jhal Muri', price: '£4', is_available: true },
  ],
  'Kebabs': [
    { id: 'k1', name: 'Seekh Kebab', price: '£7', is_available: true },
    { id: 'k2', name: 'Chicken Tikka', price: '£8', is_available: true },
  ],
  'Curries': [
    { id: 'c1', name: 'Chicken Curry', price: '£10', is_available: true },
    { id: 'c2', name: 'Beef Bhuna', price: '£11', is_available: true },
  ],
  'Biryani': [
    { id: 'b1', name: 'Chicken Biryani', price: '£12', is_available: true },
    { id: 'b2', name: 'Kacchi Biryani', price: '£14', is_available: true },
  ],
  'Rolls & Wraps': [
    { id: 'r1', name: 'Kebab Roll', price: '£6', is_available: true },
    { id: 'r2', name: 'Paneer Wrap', price: '£6', is_available: true },
  ],
  'Sides': [
    { id: 'sd1', name: 'Naan', price: '£3', is_available: true },
    { id: 'sd2', name: 'Basmati Rice', price: '£3', is_available: true },
  ],
  'Sweets': [
    { id: 'sw1', name: 'Rasmalai', price: '£4', is_available: true },
    { id: 'sw2', name: 'Gulab Jamun', price: '£4', is_available: true },
  ],
  'Drinks': [
    { id: 'd1', name: 'Mango Lassi', price: '£4', is_available: true },
    { id: 'd2', name: 'Masala Chai', price: '£3', is_available: true },
  ],
};

const CATEGORIES = Object.keys(INITIAL_MENU);

export function MenuSection({ toast }: { toast: ToastAPI }) {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({});

  const updateItem = (cat: string, id: string, patch: Partial<{ price: string; is_available: boolean }>) => {
    setMenu((prev) => ({
      ...prev,
      [cat]: prev[cat].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const saveRow = (id: string) => {
    // TODO: await supabase.from('menu_items').update({ price, is_available }).eq('id', id)
    setSavedFlash((s) => ({ ...s, [id]: true }));
    toast.success('Item updated ✓');
    setTimeout(() => setSavedFlash((s) => ({ ...s, [id]: false })), 1600);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Menu
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Adjust prices and mark items sold out.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {CATEGORIES.map((c) => {
          const isActive = c === activeCat;
          return (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                background: isActive ? '#F5C800' : 'transparent',
                color: isActive ? '#212666' : 'rgba(255,255,255,0.8)',
                border: isActive ? '1px solid #F5C800' : '1px solid rgba(245,200,0,0.25)',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                padding: '8px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {menu[activeCat].map((item) => (
          <div
            key={item.id}
            style={{
              background: '#2a317a',
              border: '1px solid rgba(245,200,0,0.15)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 100px 130px 110px 24px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: 'white' }}>{item.name}</div>
            <input
              value={item.price}
              onChange={(e) => updateItem(activeCat, item.id, { price: e.target.value })}
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(245,200,0,0.2)',
                color: 'white',
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                padding: '8px 10px',
                borderRadius: 8,
                outline: 'none',
              }}
            />
            <button
              onClick={() => updateItem(activeCat, item.id, { is_available: !item.is_available })}
              style={{
                background: item.is_available ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                color: item.is_available ? '#2ecc71' : '#e74c3c',
                border: `1px solid ${item.is_available ? 'rgba(46,204,113,0.5)' : 'rgba(231,76,60,0.5)'}`,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {item.is_available ? 'Available' : 'Sold Out'}
            </button>
            <button
              onClick={() => saveRow(item.id)}
              style={{
                background: '#F5C800',
                color: '#212666',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                fontWeight: 700,
              }}
            >
              SAVE
            </button>
            <div style={{ color: '#2ecc71', fontSize: 16, opacity: savedFlash[item.id] ? 1 : 0, transition: 'opacity 0.2s' }}>
              ✓
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
