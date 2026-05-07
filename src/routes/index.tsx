import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/dhaka-street-logo.jpg";
import busPng from "@/assets/bus.png";
import cngPng from "@/assets/cng.png";
import rickshawPng from "@/assets/rickshaw.png";
import walkersPng from "@/assets/walkers.png";
import policemanPng from "@/assets/policeman.png";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  MoonSvg,
  ShingaraSvg,
  ChaiSvg,
  MuriSvg,
  WingSvg,
} from "@/components/dhaka-svgs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dhaka Street — The Hangout Capital of Dhaka" },
      {
        name: "description",
        content:
          "Where the energy of Dhaka's streets meets food that hits different. Shingara, Dhaka Wings, Dudh Cha & more — the new adda spot for the Dhaka crowd.",
      },
      { property: "og:title", content: "Dhaka Street — The Hangout Capital of Dhaka" },
      {
        property: "og:description",
        content: "ঢাকার স্বাদ। আমাদের আড্ডা। Street food, elevated.",
      },
    ],
  }),
  component: Index,
});

const WHATSAPP = "https://wa.me/8801789977034";

const NAV = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const HERO_FOODS = [
  { emoji: "🥟", name: "SHINGARA", desc: "Classic Dhaka street crisp", price: "From BDT 50" },
  { emoji: "🍗", name: "DHAKA WINGS", desc: "6 pcs BBQ, Naga or Honey Mustard", price: "BDT 199" },
  { emoji: "📦", name: "MEATBOX", desc: "Loaded chicken, sausage, kabab or vibe box", price: "From BDT 230" },
  { emoji: "☕", name: "TONG DOKAN", desc: "Dudh Cha, Moroch Cha, Kaju Cha", price: "From BDT 30" },
  { emoji: "🍔", name: "DHAKA BURGER", desc: "Crispy to Double Patty Smashed", price: "From BDT 169" },
  { emoji: "🫙", name: "MURIVERSE", desc: "Jhal Muri, Chanachur Makha, Alu Muri", price: "From BDT 50" },
];

const MENU_TABS: Record<string, { name: string; price: string }[]> = {
  "Street Bites": [
    { name: "Chicken সিঙ্গারা", price: "70 / 130" },
    { name: "Cheesy Chicken সিঙ্গারা", price: "90 / 170" },
    { name: "Cheese সিঙ্গারা", price: "80 / 150" },
    { name: "Naga সিঙ্গারা", price: "50 / 90" },
    { name: "Kolija সিঙ্গারা", price: "80 / 170" },
    { name: "Chicken Cheesy Momo সিঙ্গারা", price: "110 / 210" },
    { name: "Chicken Momo সিঙ্গারা", price: "90 / 170" },
    { name: "Make Your Own Bucket (10 pcs)", price: "390" },
    { name: "Chanachur Makha", price: "50" },
    { name: "Jhal Muri", price: "70" },
    { name: "Alu Muri", price: "90" },
    { name: "Chicken Jhal Muri", price: "120" },
  ],
  Meatbox: [
    { name: "Loaded Chicken Box", price: "240" },
    { name: "Loaded Sausage Box", price: "230" },
    { name: "Loaded Naga Chicken Box", price: "270" },
    { name: "Grilled Chicken Box", price: "260" },
    { name: "Loaded Kabab Box", price: "270" },
    { name: "Loaded Vibe Box", price: "280" },
  ],
  "Wings & Burgers": [
    { name: "Wings — BBQ (6 pcs)", price: "199" },
    { name: "Wings — Naga (6 pcs)", price: "199" },
    { name: "Wings — Honey Mustard (6 pcs)", price: "199" },
    { name: "Veg Burger", price: "169" },
    { name: "Crispy Burger", price: "179" },
    { name: "BBQ Chicken Burger", price: "199" },
    { name: "Smashed Burger", price: "249" },
    { name: "Loaded Cheese Burger", price: "299" },
    { name: "Double Patty Smashed", price: "349" },
    { name: "Add-on: Cheese / Naga / Mayo", price: "50 / 30 / 20" },
  ],
  "Rice Meal": [
    { name: "Vegi Vibe Rice", price: "130" },
    { name: "Pankha Rice", price: "230" },
    { name: "Bideshi Rice", price: "250" },
    { name: "Shommanjonok Rice", price: "270" },
    { name: "Vibe Khichuri — Handi Chicken", price: "150 / 250" },
    { name: "Vibe Khichuri — Shahi Hash", price: "180 / 300" },
    { name: "Vegitable Letka", price: "150" },
    { name: "Chicken Letka", price: "200" },
    { name: "Chita Ruti", price: "20" },
    { name: "Hasher Mangsho", price: "130 / 250" },
    { name: "Dhaka Chips Blast — Large / Mini", price: "150 / 100" },
  ],
  "Tong Dokan": [
    { name: "মাসালা দুধ চা", price: "50" },
    { name: "Classic দুধ চা", price: "40" },
    { name: "ডেফুঁল চা", price: "50" },
    { name: "মালতা রং চা", price: "40" },
    { name: "মরিচ চা", price: "30" },
    { name: "লেবু চা", price: "30" },
    { name: "মাসালা রং চা", price: "30" },
    { name: "কাজু চা", price: "120" },
    { name: "হরিলক্ষ চা", price: "100" },
    { name: "Chocolate চা", price: "90" },
    { name: "Pora Ruti–Cha", price: "60" },
    { name: "Shingara Combo-1 (2 Koliza + Dudh Cha)", price: "100" },
  ],
  Dumplings: [
    { name: "Chicken Momo", price: "170" },
    { name: "Chicken Cheese Momo", price: "210" },
    { name: "Naga Chicken Momo", price: "180" },
    { name: "BBQ Chicken Momo", price: "190" },
  ],
  "Sides & Drinks": [
    { name: "Coleslaw", price: "59" },
    { name: "Hot Fries", price: "90" },
    { name: "Fusion Wedges", price: "110" },
    { name: "Frappuccino", price: "180" },
    { name: "Strawberry Flash", price: "100" },
    { name: "Pink Tea", price: "180" },
    { name: "Chocolate Tea", price: "180" },
    { name: "Virgin Mojito", price: "100" },
    { name: "Apple Flash", price: "100" },
    { name: "Due Mojito", price: "120" },
    { name: "Mint Lemonade", price: "70" },
    { name: "Carbonated Drinks", price: "MRP" },
  ],
  Combos: [
    { name: "Pankha Meal", price: "280" },
    { name: "Bideshi Deal", price: "340" },
    { name: "Meatbox Combo-1", price: "300" },
    { name: "Meatbox Combo-2", price: "280" },
    { name: "Wings Combo-1", price: "280" },
    { name: "Wings Combo-2", price: "320" },
    { name: "Wedges Combo-1", price: "180" },
    { name: "Naga Challenger", price: "300" },
    { name: "Hot Fries + Drink", price: "100" },
    { name: "Coleslaw", price: "45" },
    { name: "Wedges + Drink", price: "120" },
  ],
};

const REVIEWS = [
  {
    name: "Tahmid R.",
    school: "BUET",
    text: "The Naga Challenger broke me — in a good way. Dudh Cha refill loop was unmatched. New adda spot fixed.",
  },
  {
    name: "Anika S.",
    school: "North South University",
    text: "Loaded Vibe Box for the squad, Cheesy Shingara for the soul. Walls are art, vibe is straight Dhaka.",
  },
  {
    name: "Rifat H.",
    school: "Dhaka University",
    text: "Felt like the street walked into the restaurant. Wings hit, cha hit, conversation hit harder.",
  },
];

function Index() {
  useScrollReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Street Bites");
  const [submitted, setSubmitted] = useState(false);

  const walkerDelays = [0, -8, -15];

  useEffect(() => {
    if (menuOpen) {
      const el = document.getElementById("full-menu");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#212666]/80 border-b-2 border-yellow-street">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="Dhaka Street Logo" className="w-11 h-11 rounded-full border-2 border-yellow-street" />
            <span className="font-display text-2xl tracking-wider text-yellow-street">DHAKA STREET</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm uppercase tracking-wider hover:text-yellow-street transition-colors">
                {n.label}
              </a>
            ))}
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="bg-whatsapp text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.514 5.26l-.999 3.648 3.974-1.607z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative min-h-screen pt-24 pb-0 overflow-hidden hero-night flex flex-col">
        {/* Star field */}
        <div className="absolute inset-0 star-field pointer-events-none" />
        {/* String lights along top */}
        <div className="absolute top-16 left-0 right-0 h-2 string-lights opacity-80 pointer-events-none" />
        {/* Crescent moon */}
        <MoonSvg className="absolute top-24 right-10 sm:right-24 w-14 h-14 opacity-90 drop-shadow-[0_0_10px_rgba(245,200,0,0.4)]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
        {/* Floating background food */}
        <ShingaraSvg className="absolute top-40 left-8 w-28 h-28 opacity-[0.10] animate-float-faint" />
        <ChaiSvg className="absolute top-52 right-32 w-24 h-24 opacity-[0.10] animate-float-faint" />
        <MuriSvg className="absolute bottom-72 left-20 w-28 h-28 opacity-[0.10] animate-float-faint" />
        <WingSvg className="absolute top-1/2 right-1/4 w-24 h-24 opacity-[0.10] animate-float-faint" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center text-center">
          <div className="inline-block mx-auto text-yellow-street text-xs sm:text-sm uppercase tracking-[0.3em] mb-6 reveal">
            ✦ The Hangout Capital of Dhaka
          </div>
          <h1 className="reveal font-display text-yellow-street leading-[0.85]" style={{ fontSize: "clamp(60px, 14vw, 130px)" }}>
            DHAKA
            <br />
            STREET
          </h1>
          <p className="reveal font-bangla text-2xl sm:text-3xl mt-6 text-white/90">
            ঢাকার স্বাদ। আমাদের আড্ডা।
          </p>
          <p className="reveal mt-4 max-w-xl mx-auto text-white/80 text-base sm:text-lg">
            Where the energy of Dhaka's streets meets food that hits different.
          </p>
          <div className="reveal mt-10">
            <a
              href="#menu"
              className="inline-block bg-yellow-street text-indigo-deep font-bold px-10 py-4 rounded-full uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_10px_30px_-10px_rgba(245,200,0,0.6)]"
            >
              See Our Menu
            </a>
          </div>
        </div>

        {/* Animated street scene — 220px tall, layered */}
        <div className="street-scene relative w-full mt-8" style={{ height: "220px" }}>
          {/* LAYER 1 — building silhouettes */}
          <svg
            className="absolute bottom-[155px] left-0 w-full"
            style={{ zIndex: 1, height: "70px" }}
            viewBox="0 0 1200 70"
            preserveAspectRatio="none"
          >
            <path
              fill="#0d1140"
              d="M0,70 L0,40 L60,40 L60,20 L120,20 L120,45 L180,45 L180,15 L240,15 L240,35 L300,35 L300,5 L360,5 L360,30 L420,30 L420,18 L500,18 L500,42 L560,42 L560,12 L620,12 L620,38 L700,38 L700,22 L780,22 L780,8 L840,8 L840,32 L900,32 L900,16 L980,16 L980,40 L1060,40 L1060,24 L1140,24 L1140,44 L1200,44 L1200,70 Z"
            />
          </svg>

          {/* LAYER 3 — Road */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{ height: "100px", background: "#12153a", borderTop: "3px solid #333", zIndex: 2 }}
          >
            {/* animated dashed center line */}
            <div className="absolute left-0 right-0 road-dashes" style={{ top: "50%", height: "4px", zIndex: 3 }} />

            {/* BUS — R→L */}
            <img
              src={busPng}
              alt=""
              className="street-bus absolute"
              style={{ bottom: "8px", height: "110px", width: "auto", zIndex: 4 }}
            />
            {/* CNG — L→R */}
            <img
              src={cngPng}
              alt=""
              className="street-cng absolute"
              style={{ bottom: "8px", height: "80px", width: "auto", zIndex: 5 }}
            />
            {/* RICKSHAW — L→R */}
            <img
              src={rickshawPng}
              alt=""
              className="street-rickshaw absolute"
              style={{ bottom: "8px", height: "90px", width: "auto", zIndex: 5 }}
            />
          </div>

          {/* LAYER 2 — Sidewalk */}
          <div
            className="absolute left-0 right-0 overflow-visible"
            style={{
              bottom: "100px",
              height: "55px",
              background: "#2a2f6e",
              borderTop: "2px solid rgba(245,200,0,0.15)",
              zIndex: 6,
            }}
          >
            {/* STREETLAMPS */}
            {[15, 40, 65, 90].map((leftPct) => (
              <div key={leftPct} className="absolute" style={{ left: `${leftPct}%`, bottom: "0", zIndex: 7 }}>
                {/* glow */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: "-90px",
                    bottom: "-30px",
                    width: "200px",
                    height: "120px",
                    background: "radial-gradient(ellipse at center, rgba(255,180,60,0.18), transparent 70%)",
                  }}
                />
                {/* pole */}
                <div style={{ width: "3px", height: "60px", background: "#555" }} />
                {/* arm */}
                <div style={{ position: "absolute", top: "0", right: "3px", width: "26px", height: "3px", background: "#555" }} />
                {/* bulb */}
                <div
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "26px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ffcc66",
                    boxShadow: "0 0 14px 4px rgba(255,180,60,0.7)",
                  }}
                />
              </div>
            ))}

            {/* WALKERS */}
            {walkerDelays.map((d, i) => (
              <img
                key={i}
                src={walkersPng}
                alt=""
                className="street-walkers absolute hidden-on-mobile-extra"
                style={{
                  bottom: `${i * 4}px`,
                  height: "72px",
                  width: "auto",
                  zIndex: 8,
                  animationDelay: `${d}s`,
                }}
                data-walker-index={i}
              />
            ))}

            {/* POLICEMAN + traffic light */}
            <div className="absolute" style={{ left: "38%", bottom: "0", zIndex: 10 }}>
              {/* Traffic light */}
              <div className="absolute" style={{ left: "78px", bottom: "0", zIndex: 9 }}>
                <div style={{ width: "4px", height: "80px", background: "#555" }} />
                <div style={{ position: "absolute", top: "0", left: "4px", width: "40px", height: "4px", background: "#555" }} />
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    background: "#222",
                    padding: "3px",
                    borderRadius: "3px",
                  }}
                >
                  <div className="tl-red" style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#5a1a1a" }} />
                  <div className="tl-yellow" style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#5a4a1a" }} />
                  <div className="tl-green" style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#1a4a1a" }} />
                </div>
              </div>
              <img src={policemanPng} alt="" className="policeman-img" style={{ height: "95px", width: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="bg-cream text-indigo-deep py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="text-[#e8721c] uppercase tracking-[0.3em] text-sm font-semibold">Our Story</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3 leading-none">WHERE DHAKA COMES ALIVE</h2>
            <p className="mt-6 text-lg leading-relaxed">
              Born out of love for the city we call home — Dhaka Street is what happens when the chaos of Old Dhaka,
              the smell of frying shingara, the ring of a rickshaw bell, and the warm fog of dudh cha all gather
              under one roof. We turned the street into the menu.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              From hand-painted walls to the way the chai is poured — every corner is built for the adda your
              friend group keeps trying to plan. Pull up a chair. Stay a while. Order another cha.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["DINE-IN", "OUTDOOR SEATING", "RESERVATIONS"].map((b) => (
                <span key={b} className="bg-indigo-deep text-yellow-street px-4 py-2 rounded-full text-sm font-semibold tracking-wider">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="reveal flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-deep/40 animate-spin-slow" />
              <img src={logo} alt="Dhaka Street Logo" className="w-60 h-60 sm:w-64 sm:h-64 rounded-full shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="relative bg-[#181e55] py-24 px-4 sm:px-6 overflow-hidden">
        {/* Food rain */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const items = ["🥟", "☕", "🍗", "🌶️", "🍔", "🫙"];
            const item = items[i % items.length];
            const left = (i * 4.3) % 100;
            const dur = 3 + ((i * 1.7) % 6);
            const delay = (i * 0.6) % 10;
            const size = 16 + ((i * 7) % 22);
            const drift = (i % 2 === 0 ? 1 : -1) * (20 + (i * 3) % 40);
            const op = 0.08 + ((i * 13) % 8) / 100;
            return (
              <span
                key={i}
                className="absolute top-0 select-none"
                style={{
                  left: `${left}%`,
                  fontSize: `${size}px`,
                  animation: `food-rain ${dur}s linear infinite`,
                  animationDelay: `${delay}s`,
                  ["--rain-opacity" as never]: op,
                  ["--drift" as never]: `${drift}px`,
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center reveal">
            <span className="text-yellow-street uppercase tracking-[0.3em] text-sm font-semibold">The Menu</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3">STREET FOOD. ELEVATED.</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Fresh flavors & comfort bites — straight from Dhaka's soul.
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HERO_FOODS.map((f) => (
              <div
                key={f.name}
                className="reveal group relative bg-[#212666] rounded-2xl p-8 border-t-4 border-transparent hover:border-yellow-street transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,200,0,0.3)]"
              >
                <div className="text-6xl animate-float-slow inline-block">{f.emoji}</div>
                <h3 className="font-display text-3xl mt-4 text-yellow-street tracking-wider">{f.name}</h3>
                <p className="mt-2 text-white/70">{f.desc}</p>
                <p className="mt-4 font-semibold text-white">{f.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center reveal">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="border-2 border-yellow-street text-yellow-street font-bold uppercase tracking-wider px-8 py-3 rounded-full hover:bg-yellow-street hover:text-indigo-deep transition-colors"
            >
              {menuOpen ? "Hide Full Menu" : "View Full Menu"}
            </button>
          </div>

          {menuOpen && (
            <div id="full-menu" className="mt-12 bg-[#212666] rounded-3xl p-6 sm:p-10 border border-yellow-street/30">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="font-display text-3xl text-yellow-street">FULL MENU</h3>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="bg-yellow-street text-indigo-deep px-5 py-2 rounded-full text-sm font-semibold"
                >
                  ⬇ Download PDF
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                {Object.keys(MENU_TABS).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === t
                        ? "bg-yellow-street text-indigo-deep"
                        : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                {MENU_TABS[activeTab].map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-white/5 pb-2 font-bangla">
                    <span className="text-white/90">{item.name}</span>
                    <span className="text-yellow-street font-semibold whitespace-nowrap ml-3">৳ {item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-cream text-indigo-deep py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center reveal">
            <span className="text-[#e8721c] uppercase tracking-[0.3em] text-sm font-semibold">What They Say</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3">THE CROWD HAS SPOKEN</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="reveal bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 transition-transform">
                <div className="text-yellow-street text-xl">★★★★★</div>
                <p className="italic mt-4 text-indigo-deep/90">"{r.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-deep text-yellow-street font-bold flex items-center justify-center">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-indigo-deep/60">{r.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="bg-indigo-deep py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal">
            <h2 className="font-display text-5xl md:text-7xl">
              HEAR IT FROM <span className="text-yellow-street">THEM</span>
            </h2>
            <p className="text-white/60 uppercase tracking-[0.3em] text-xs mt-3">Customer Stories</p>
          </div>
          <div className="reveal mt-12 relative aspect-video bg-[#181e55] rounded-3xl border border-yellow-street/30 flex items-center justify-center overflow-hidden">
            <div className="dot-grid absolute inset-0 opacity-50" />
            <button className="relative w-24 h-24 rounded-full bg-yellow-street text-indigo-deep flex items-center justify-center animate-pulse-glow">
              <svg viewBox="0 0 24 24" className="w-10 h-10 ml-1" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <p className="text-white/40 text-sm mt-4 italic">Replace with YouTube embed link</p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[#181e55] py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center reveal">
            <h2 className="font-display text-5xl md:text-7xl">
              COME, EAT, <span className="text-yellow-street">ADDA.</span>
            </h2>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <div className="reveal space-y-6">
              <div>
                <div className="text-yellow-street uppercase text-xs tracking-[0.2em] mb-2">Address</div>
                <p className="text-lg">Dhaka Street HQ, Dhaka, Bangladesh</p>
              </div>
              <div>
                <div className="text-yellow-street uppercase text-xs tracking-[0.2em] mb-2">Hours</div>
                <p>Every day · 12:00 PM – 11:30 PM</p>
              </div>
              <div>
                <div className="text-yellow-street uppercase text-xs tracking-[0.2em] mb-2">Phone</div>
                <p>+88 01789-977034</p>
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-whatsapp text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.514 5.26l-.999 3.648 3.974-1.607z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="reveal bg-[#212666] p-8 rounded-2xl border border-yellow-street/20 space-y-4"
            >
              <h3 className="font-display text-2xl text-yellow-street">SEND US LOVE (OR FEEDBACK)</h3>
              <input
                required
                placeholder="Your Name"
                className="w-full bg-[#181e55] border border-white/10 rounded-lg px-4 py-3 focus:border-yellow-street outline-none"
              />
              <input
                required
                placeholder="Phone or Email"
                className="w-full bg-[#181e55] border border-white/10 rounded-lg px-4 py-3 focus:border-yellow-street outline-none"
              />
              <textarea
                required
                rows={4}
                placeholder="Your feedback..."
                className="w-full bg-[#181e55] border border-white/10 rounded-lg px-4 py-3 focus:border-yellow-street outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full bg-yellow-street text-indigo-deep font-bold py-3 rounded-lg uppercase tracking-wider hover:scale-[1.02] transition-transform"
              >
                {submitted ? "✓ Sent! See you soon" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#181e55] border-t-2 border-yellow-street pt-16 pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Dhaka Street Logo" className="w-12 h-12 rounded-full border-2 border-yellow-street" />
              <span className="font-display text-2xl text-yellow-street tracking-wider">DHAKA STREET</span>
            </div>
            <p className="font-bangla text-white/80 mt-4">ঢাকার স্বাদ, আমাদের আড্ডা।</p>
            <div className="flex gap-3 mt-5">
              {[
                { href: "https://facebook.com/LifeAtDhakaStreet", label: "Facebook", svg: "M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12H17l-.4 2.9h-2.3v7A10 10 0 0022 12z" },
                { href: "https://instagram.com/lifeatdhakastreet", label: "Instagram", svg: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.1-2.1a1.1 1.1 0 110 2.3 1.1 1.1 0 010-2.3z" },
                { href: WHATSAPP, label: "WhatsApp", svg: "M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-yellow-street/10 hover:bg-yellow-street text-yellow-street hover:text-indigo-deep flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d={s.svg} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-display text-xl text-yellow-street tracking-wider mb-4">QUICK LINKS</div>
            <ul className="space-y-2 text-white/80 text-sm">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-yellow-street">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-display text-xl text-yellow-street tracking-wider mb-4">FOLLOW US</div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="https://facebook.com/LifeAtDhakaStreet" target="_blank" rel="noreferrer" className="hover:text-yellow-street">facebook.com/LifeAtDhakaStreet</a></li>
              <li><a href="https://instagram.com/lifeatdhakastreet" target="_blank" rel="noreferrer" className="hover:text-yellow-street">instagram.com/lifeatdhakastreet</a></li>
              <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-yellow-street">+88 01789-977034</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Dhaka Street. All rights reserved.</div>
          <div className="font-bangla text-yellow-street">ঢাকার স্বাদ ✦</div>
        </div>
      </footer>
    </div>
  );
}
