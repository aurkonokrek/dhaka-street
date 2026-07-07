import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ToastAPI } from './Toast';

type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  is_available: boolean;
};

const CATEGORIES = ["Street Bites", "Meatbox", "Wings & Burgers", "Rice Meal", "Tong Dokan", "Dumplings", "Sides & Drinks", "Combos"];

const SEED_ITEMS = [
  // Street Bites
  { category: "Street Bites", name: "Chicken সিঙ্গারা", price: "70 / 130", is_available: true },
  { category: "Street Bites", name: "Cheesy Chicken সিঙ্গারা", price: "90 / 170", is_available: true },
  { category: "Street Bites", name: "Cheese সিঙ্গারা", price: "80 / 150", is_available: true },
  { category: "Street Bites", name: "Naga সিঙ্গারা", price: "50 / 90", is_available: true },
  { category: "Street Bites", name: "Kolija সিঙ্গারা", price: "80 / 170", is_available: true },
  { category: "Street Bites", name: "Chicken Cheesy Momo সিঙ্গারা", price: "110 / 210", is_available: true },
  { category: "Street Bites", name: "Chicken Momo সিঙ্গারা", price: "90 / 170", is_available: true },
  { category: "Street Bites", name: "Make Your Own Bucket (10 pcs)", price: "390", is_available: true },
  { category: "Street Bites", name: "Chanachur Makha", price: "50", is_available: true },
  { category: "Street Bites", name: "Jhal Muri", price: "70", is_available: true },
  { category: "Street Bites", name: "Alu Muri", price: "90", is_available: true },
  { category: "Street Bites", name: "Chicken Jhal Muri", price: "120", is_available: true },
  // Meatbox
  { category: "Meatbox", name: "Loaded Chicken Box", price: "240", is_available: true },
  { category: "Meatbox", name: "Loaded Sausage Box", price: "230", is_available: true },
  { category: "Meatbox", name: "Loaded Naga Chicken Box", price: "270", is_available: true },
  { category: "Meatbox", name: "Grilled Chicken Box", price: "260", is_available: true },
  { category: "Meatbox", name: "Loaded Kabab Box", price: "270", is_available: true },
  { category: "Meatbox", name: "Loaded Vibe Box", price: "280", is_available: true },
  // Wings & Burgers
  { category: "Wings & Burgers", name: "Wings — BBQ (6 pcs)", price: "199", is_available: true },
  { category: "Wings & Burgers", name: "Wings — Naga (6 pcs)", price: "199", is_available: true },
  { category: "Wings & Burgers", name: "Wings — Honey Mustard (6 pcs)", price: "199", is_available: true },
  { category: "Wings & Burgers", name: "Veg Burger", price: "169", is_available: true },
  { category: "Wings & Burgers", name: "Crispy Burger", price: "179", is_available: true },
  { category: "Wings & Burgers", name: "BBQ Chicken Burger", price: "199", is_available: true },
  { category: "Wings & Burgers", name: "Smashed Burger", price: "249", is_available: true },
  { category: "Wings & Burgers", name: "Loaded Cheese Burger", price: "299", is_available: true },
  { category: "Wings & Burgers", name: "Double Patty Smashed", price: "349", is_available: true },
  { category: "Wings & Burgers", name: "Add-on: Cheese / Naga / Mayo", price: "50 / 30 / 20", is_available: true },
  // Rice Meal
  { category: "Rice Meal", name: "Vegi Vibe Rice", price: "130", is_available: true },
  { category: "Rice Meal", name: "Pankha Rice", price: "230", is_available: true },
  { category: "Rice Meal", name: "Bideshi Rice", price: "250", is_available: true },
  { category: "Rice Meal", name: "Shommanjonok Rice", price: "270", is_available: true },
  { category: "Rice Meal", name: "Vibe Khichuri — Handi Chicken", price: "150 / 250", is_available: true },
  { category: "Rice Meal", name: "Vibe Khichuri — Shahi Hash", price: "180 / 300", is_available: true },
  { category: "Rice Meal", name: "Vegitable Letka", price: "150", is_available: true },
  { category: "Rice Meal", name: "Chicken Letka", price: "200", is_available: true },
  { category: "Rice Meal", name: "Chita Ruti", price: "20", is_available: true },
  { category: "Rice Meal", name: "Hasher Mangsho", price: "130 / 250", is_available: true },
  { category: "Rice Meal", name: "Dhaka Chips Blast — Large / Mini", price: "150 / 100", is_available: true },
  // Tong Dokan
  { category: "Tong Dokan", name: "মাসালা দুধ চা", price: "50", is_available: true },
  { category: "Tong Dokan", name: "Classic দুধ চা", price: "40", is_available: true },
  { category: "Tong Dokan", name: "ডেফুঁল চা", price: "50", is_available: true },
  { category: "Tong Dokan", name: "মালতা রং চা", price: "40", is_available: true },
  { category: "Tong Dokan", name: "মরিচ চা", price: "30", is_available: true },
  { category: "Tong Dokan", name: "লেবু চা", price: "30", is_available: true },
  { category: "Tong Dokan", name: "মাসালা রং চা", price: "30", is_available: true },
  { category: "Tong Dokan", name: "কাজু চা", price: "120", is_available: true },
  { category: "Tong Dokan", name: "হরিলক্ষ চা", price: "100", is_available: true },
  { category: "Tong Dokan", name: "Chocolate চা", price: "90", is_available: true },
  { category: "Tong Dokan", name: "Pora Ruti–Cha", price: "60", is_available: true },
  { category: "Tong Dokan", name: "Shingara Combo-1 (2 Koliza + Dudh Cha)", price: "100", is_available: true },
  // Dumplings
  { category: "Dumplings", name: "Chicken Momo", price: "170", is_available: true },
  { category: "Dumplings", name: "Chicken Cheese Momo", price: "210", is_available: true },
  { category: "Dumplings", name: "Naga Chicken Momo", price: "180", is_available: true },
  { category: "Dumplings", name: "BBQ Chicken Momo", price: "190", is_available: true },
  // Sides & Drinks
  { category: "Sides & Drinks", name: "Coleslaw", price: "59", is_available: true },
  { category: "Sides & Drinks", name: "Hot Fries", price: "90", is_available: true },
  { category: "Sides & Drinks", name: "Fusion Wedges", price: "110", is_available: true },
  { category: "Sides & Drinks", name: "Frappuccino", price: "180", is_available: true },
  { category: "Sides & Drinks", name: "Strawberry Flash", price: "100", is_available: true },
  { category: "Sides & Drinks", name: "Pink Tea", price: "180", is_available: true },
  { category: "Sides & Drinks", name: "Chocolate Tea", price: "180", is_available: true },
  { category: "Sides & Drinks", name: "Virgin Mojito", price: "100", is_available: true },
  { category: "Sides & Drinks", name: "Apple Flash", price: "100", is_available: true },
  { category: "Sides & Drinks", name: "Due Mojito", price: "120", is_available: true },
  { category: "Sides & Drinks", name: "Mint Lemonade", price: "70", is_available: true },
  { category: "Sides & Drinks", name: "Carbonated Drinks", price: "MRP", is_available: true },
  // Combos
  { category: "Combos", name: "Pankha Meal", price: "280", is_available: true },
  { category: "Combos", name: "Bideshi Deal", price: "340", is_available: true },
  { category: "Combos", name: "Meatbox Combo-1", price: "300", is_available: true },
  { category: "Combos", name: "Meatbox Combo-2", price: "280", is_available: true },
  { category: "Combos", name: "Wings Combo-1", price: "280", is_available: true },
  { category: "Combos", name: "Wings Combo-2", price: "320", is_available: true },
  { category: "Combos", name: "Wedges Combo-1", price: "180", is_available: true },
  { category: "Combos", name: "Naga Challenger", price: "300", is_available: true },
  { category: "Combos", name: "Hot Fries + Drink", price: "100", is_available: true },
  { category: "Combos", name: "Coleslaw", price: "45", is_available: true },
  { category: "Combos", name: "Wedges + Drink", price: "120", is_available: true }
];

export function MenuSection({ toast }: { toast: ToastAPI }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({});

  const fetchMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Automatically seed menu items if empty
        const { data: seededData, error: seedError } = await supabase
          .from('menu_items')
          .insert(SEED_ITEMS)
          .select();
        
        if (seedError) throw seedError;
        setMenuItems(seededData || []);
      } else {
        setMenuItems(data);
      }
    } catch (err: any) {
      console.error('Menu load/seed failed:', err);
      toast.error(`Load failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const updateItem = (id: string, patch: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  const saveRow = async (id: string) => {
    const item = menuItems.find((it) => it.id === id);
    if (!item) return;

    try {
      const isNew = id.startsWith('new-');
      const payload: any = {
        name: item.name,
        price: item.price,
        category: item.category,
        is_available: item.is_available,
      };
      if (!isNew) {
        payload.id = id;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMenuItems((prev) => prev.map((it) => (it.id === id ? data : it)));
        setSavedFlash((s) => ({ ...s, [data.id] : true }));
        toast.success('Item updated ✓');
        setTimeout(() => setSavedFlash((s) => ({ ...s, [data.id]: false })), 1600);
      }
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

  const addItem = () => {
    setMenuItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        category: activeCat,
        name: 'New Item',
        price: '100',
        is_available: true,
      },
    ]);
  };

  const removeItem = async (id: string) => {
    if (id.startsWith('new-')) {
      setMenuItems((prev) => prev.filter((it) => it.id !== id));
      return;
    }

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      setMenuItems((prev) => prev.filter((it) => it.id !== id));
      toast.success('Item deleted');
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const currentItems = menuItems.filter((it) => it.category === activeCat);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", padding: '20px 0' }}>
        Loading menu items...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Hangyaboly', 'Space Mono', cursive", fontSize: 30, letterSpacing: '0.04em', margin: 0 }}>
        Menu
      </h2>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 24 }}>
        Adjust prices, mark items sold out, or add new items.
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
        {currentItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#2a317a',
              border: '1px solid rgba(245,200,0,0.15)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 120px 100px 130px 110px 24px 40px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <input
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
              placeholder="Item name"
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
            <input
              value={item.price}
              onChange={(e) => updateItem(item.id, { price: e.target.value })}
              placeholder="Price"
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
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Category: {item.category}
            </span>
            <button
              onClick={() => updateItem(item.id, { is_available: !item.is_available })}
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
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Delete item"
              style={{
                background: 'transparent',
                border: '1px solid rgba(231,76,60,0.4)',
                color: '#e74c3c',
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        style={{
          marginTop: 18,
          background: 'transparent',
          border: '1px dashed rgba(245,200,0,0.4)',
          color: '#F5C800',
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          padding: '10px 20px',
          borderRadius: 10,
          cursor: 'pointer',
          letterSpacing: '0.06em',
        }}
      >
        + ADD NEW ITEM
      </button>
    </div>
  );
}
