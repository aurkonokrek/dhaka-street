import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/dhaka-street-logo.jpg";
import busPng from "@/assets/bus.png";
import cngPng from "@/assets/cng.png";
import rickshawPng from "@/assets/rickshaw.png";

import policemanPng from "@/assets/policeman.png";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  MoonSvg,
  ShingaraSvg,
  ChaiSvg,
  MuriSvg,
  WingSvg,
} from "@/components/dhaka-svgs";
import { TongDokan } from "@/components/tong-dokan";

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
  { label: "Story", href: "#about", ref: "about" },
  { label: "Menu", href: "#menu", ref: "menu" },
  { label: "Moments", href: "#moments", ref: "moments" },
  { label: "Contact", href: "#contact", ref: "contact" },
];

type HeroFood = {
  name: string;
  desc: string;
  price: string;
  emoji?: string;
  variant?: "naga";
};

const HERO_FOODS: HeroFood[] = [
  { emoji: "🥟", name: "SHINGARA", desc: "Classic Dhaka street crisp", price: "From BDT 50" },
  { emoji: "🍗", name: "DHAKA WINGS", desc: "6 pcs BBQ, Naga or Honey Mustard", price: "BDT 199" },
  { emoji: "🥡", name: "MEATBOX", desc: "Loaded chicken, sausage, kabab or vibe box", price: "From BDT 230" },
  { emoji: "☕", name: "TONG DOKAN", desc: "Dudh Cha, Moroch Cha, Kaju Cha", price: "From BDT 30" },
  { emoji: "🍔", name: "DHAKA BURGER", desc: "Crispy to Double Patty Smashed", price: "From BDT 169" },
  { name: "NAGA SHINGARA", desc: "The spiciest thing on the street. Not for the weak.", price: "From BDT 50", variant: "naga" },
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


function Index() {
  useScrollReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Street Bites");
  

  

  const [activeSection, setActiveSection] = useState<string>("about");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const el = document.getElementById("full-menu");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = ["about", "menu", "moments", "contact"];
    const navHeight = 90;

    const onScroll = () => {
      const scrollY = window.scrollY;
      let current = "";
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        const top = section.offsetTop - navHeight - 100;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          current = id;
        }
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Multi-layer parallax for the hero. Each element with [data-parallax-speed]
  // is translated by (scrollY * speed). Lower speeds = farther background,
  // higher speeds = closer foreground. rAF keeps it buttery smooth.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax-speed]")
    );
    if (!layers.length) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      for (const el of layers) {
        const speed = parseFloat(el.dataset.parallaxSpeed || "0");
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnnouncementBanner />
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#212666]/80 border-b-2 border-yellow-street">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-3">
            <img src={logo} alt="Dhaka Street Logo" className="w-11 h-11 rounded-full border-2 border-yellow-street" />
            <span className="font-display text-2xl text-yellow-street">Dhaka Street</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((n) => {
              const isActive = activeSection === n.ref;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  data-ref={n.ref}
                  className="relative uppercase transition-colors duration-200"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: isActive ? "#F5C800" : "rgba(255,255,255,0.6)",
                    fontFamily: "'Space Mono', monospace",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#F5C800"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  {n.label}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "-8px",
                        transform: "translateX(-50%)",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#F5C800",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* STICKY FLOATING BUTTONS */}
      <div className="sticky-buttons">
        <button
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-top-btn"
          style={{ opacity: showScrollTop ? 1 : 0, pointerEvents: showScrollTop ? "auto" : "none" }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F5C800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="wa-sticky"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.514 5.26l-.999 3.648 3.974-1.607z" />
          </svg>
        </a>
      </div>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen pt-24 pb-0 overflow-hidden hero-night flex flex-col">
        {/* PARALLAX LAYER 1 — far background (slowest) */}
        <div className="absolute inset-0 star-field pointer-events-none" data-parallax-speed="0.15" />
        {/* PARALLAX LAYER 2 — string lights (slow) */}
        <div className="absolute top-16 left-0 right-0 h-2 string-lights opacity-80 pointer-events-none" data-parallax-speed="0.22" />
        {/* PARALLAX LAYER 2 — Crescent moon (slow) */}
        <div className="absolute top-24 right-10 sm:right-24 will-change-transform" data-parallax-speed="0.28">
          <MoonSvg className="w-14 h-14 opacity-90 drop-shadow-[0_0_10px_rgba(245,200,0,0.4)]" />
        </div>
        {/* PARALLAX LAYER 3 — dot grid (mid) */}
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" data-parallax-speed="0.35" />
        {/* PARALLAX LAYER 4 — Floating midground food (faster) */}
        <div className="absolute top-40 left-8 will-change-transform" data-parallax-speed="0.45">
          <ShingaraSvg className="w-28 h-28 opacity-[0.10] animate-float-faint" />
        </div>
        <div className="absolute top-52 right-32 will-change-transform" data-parallax-speed="0.5">
          <ChaiSvg className="w-24 h-24 opacity-[0.10] animate-float-faint" />
        </div>
        <div className="absolute bottom-72 left-20 will-change-transform" data-parallax-speed="0.55">
          <MuriSvg className="w-28 h-28 opacity-[0.10] animate-float-faint" />
        </div>
        <div className="absolute top-1/2 right-1/4 will-change-transform" data-parallax-speed="0.6">
          <WingSvg className="w-24 h-24 opacity-[0.10] animate-float-faint" />
        </div>

        {/* PARALLAX LAYER 5 — UI / Text (closest, moves fastest with scroll) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center text-center" data-parallax-speed="0.18">
          <div className="reveal inline-block mx-auto mb-6 font-bangla text-yellow-street text-sm sm:text-base" style={{ letterSpacing: "0.04em" }}>
            ✦ আড্ডা দাও। খাও। চলে যাও।
          </div>
          <h1 className="reveal hero-title font-display text-yellow-street leading-[0.85]" style={{ fontSize: "clamp(60px, 14vw, 130px)" }}>
            Dhaka
            <br />
            Street
          </h1>
          <p className="reveal font-bangla text-2xl sm:text-3xl mt-6 text-white/90 font-bangla-heading">
            ঢাকার স্বাদ। আমাদের আড্ডা।
          </p>
          <p className="reveal mt-4 max-w-xl mx-auto text-white/80 lowercase" style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>
            Life At Dhaka Street
          </p>
          <div className="reveal mt-10">
            <a
              href="#menu"
              className="font-display inline-block bg-yellow-street text-indigo-deep px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_10px_30px_-10px_rgba(245,200,0,0.6)]"
              style={{ letterSpacing: "0.04em", fontSize: "1.25rem" }}
            >
              See The Menu
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

            {/* BUS — R→L (upper sub-lane) */}
            <img
              src={busPng}
              alt=""
              className="street-bus absolute"
              style={{ bottom: "40px", height: "75px", width: "auto", zIndex: 4, display: "block" }}
            />
            {/* CNG — L→R (lower sub-lane) */}
            <img
              src={cngPng}
              alt=""
              className="street-cng absolute"
              style={{ bottom: "0px", height: "70px", width: "auto", zIndex: 5, display: "block" }}
            />
            {/* RICKSHAW — L→R (lower sub-lane) */}
            <img
              src={rickshawPng}
              alt=""
              className="street-rickshaw absolute"
              style={{ bottom: "0px", height: "78px", width: "auto", zIndex: 5, display: "block" }}
            />
            {/* MOTORBIKE — R→L (upper sub-lane) */}
            <div className="bike-wrap motorbike1" style={{ bottom: "42px" }}>
              <img src="/vehicles/Motorbike_png.png" className="bike-char motorbike-img" loading="eager" alt="" style={{ height: "42px" }} />
            </div>
            {/* DELIVERY BIKE — R→L (upper sub-lane) */}
            <div className="bike-wrap delivery1" style={{ bottom: "42px" }}>
              <img src="/vehicles/Bike_Delivery_Sticker_gif.gif" className="bike-char" loading="eager" alt="" style={{ height: "40px" }} />
            </div>
            {/* BICYCLE — L→R (lower sub-lane) */}
            <div className="bike-wrap bicycle1" style={{ bottom: "0px" }}>
              <img src="/vehicles/Bike_Bicycling_Sticker_gif.gif" className="bike-char bicycle-flip" loading="eager" alt="" />
            </div>
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

            {/* TONG DOKAN — rendered before walkers so they pass in front */}
            <TongDokan className="tong-dokan" />

            {/* WALKERS — animated GIFs */}
            <div className="walker-wrap w1"><img src="/walkers/walker1.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w2"><img src="/walkers/walker2.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w3"><img src="/walkers/walker3.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w4"><img src="/walkers/walker4.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w5"><img src="/walkers/walker5.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w6"><img src="/walkers/walker6.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w7"><img src="/walkers/walker7.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w8"><img src="/walkers/walker8.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w9"><img src="/walkers/walker9.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w10"><img src="/walkers/walker4.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w11"><img src="/walkers/walker6.gif" className="walker-char" alt="walker" loading="eager" /></div>
            <div className="walker-wrap w12"><img src="/walkers/walker8.gif" className="walker-char" alt="walker" loading="eager" /></div>

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
      <section id="about" className="bg-cream text-indigo-deep py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="text-[#e8721c] uppercase font-semibold" style={{ fontSize: "11px", letterSpacing: "0.22em" }}>Our Story</span>
            <h2 className="section-title font-display text-5xl md:text-7xl mt-3 leading-none"><span className="text-yellow-street">Life At Dhaka Street.</span> Built for the adda.</h2>
            <p className="mt-6 leading-[1.8]" style={{ fontSize: "0.875rem" }}>
              Dhaka Street didn't come from a business plan. It came from a city — the smell of shingara frying at 11pm, rickshaw bells at rush hour, and a cup of dudh cha that somehow fixes everything. We just put it all under one roof.
            </p>
            <p className="mt-4 leading-[1.8]" style={{ fontSize: "0.875rem" }}>
              The walls are painted with Dhaka's soul. The food tastes like the streets. And the adda? That's on you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Dine-in", "Outdoor Seating", "Reservations"].map((b) => (
                <span key={b} className="font-display bg-indigo-deep text-yellow-street px-4 py-2 rounded-full text-sm" style={{ letterSpacing: "0.04em" }}>
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
            <span className="text-yellow-street uppercase font-semibold" style={{ fontSize: "11px", letterSpacing: "0.22em" }}>The Menu</span>
            <h2 className="section-title font-display text-5xl md:text-7xl mt-3">Order Something.</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto" style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>
              You won't regret it.
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HERO_FOODS.map((f) => {
              const isNaga = f.variant === "naga";
              return (
                <div
                  key={f.name}
                  className={`reveal group relative bg-[#212666] rounded-2xl p-8 border-t-4 border-transparent transition-all duration-300 hover:-translate-y-2 ${
                    isNaga ? "naga-card" : "hover:border-yellow-street hover:shadow-[0_20px_40px_-15px_rgba(245,200,0,0.3)]"
                  }`}
                >
                  {isNaga ? (
                    <div className="naga-icon animate-float-slow">
                      <span className="icon-mountain">⛰</span>
                      <span className="icon-shingara">🥟</span>
                    </div>
                  ) : (
                    <div className="text-6xl animate-float-slow inline-block">{f.emoji}</div>
                  )}
                  <h3 className="font-display text-3xl mt-4 text-yellow-street">{f.name}</h3>
                  <p className="mt-2 text-white/70" style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>{f.desc}</p>
                  <p className="font-display mt-4 text-white" style={{ letterSpacing: "0.04em" }}>{f.price}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center reveal">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="font-display border-2 border-yellow-street text-yellow-street px-8 py-3 rounded-full hover:bg-yellow-street hover:text-indigo-deep transition-colors"
              style={{ letterSpacing: "0.04em", fontSize: "1.1rem" }}
            >
              {menuOpen ? "Hide Full Menu" : "View Full Menu"}
            </button>
          </div>

          {menuOpen && (
            <div id="full-menu" className="mt-12 bg-[#212666] rounded-3xl p-6 sm:p-10 border border-yellow-street/30">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="font-display text-3xl text-yellow-street">Full Menu</h3>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-display bg-yellow-street text-indigo-deep px-5 py-2 rounded-full text-sm"
                  style={{ letterSpacing: "0.04em" }}
                >
                  ⬇ Download PDF
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                {Object.keys(MENU_TABS).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`font-display px-4 py-2 rounded-full text-sm transition-colors ${
                      activeTab === t
                        ? "bg-yellow-street text-indigo-deep"
                        : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                {MENU_TABS[activeTab].map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="font-bangla text-white/90">{item.name}</span>
                    <span className="font-display text-yellow-street whitespace-nowrap ml-3" style={{ letterSpacing: "0.04em" }}>৳ {item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MOMENTS GALLERY + VIDEO */}
      <section id="moments" className="bg-[#181e55] py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* PART 1 — Gallery */}
          <div className="text-center reveal">
            <div className="font-bangla text-yellow-street text-sm" style={{ letterSpacing: "0.04em" }}>
              আমাদের মানুষ
            </div>
            <h2 className="section-title font-display text-white text-5xl md:text-7xl mt-3">Real People. Real Vibe.</h2>
          </div>

          {/* Filter pills */}
          <div className="mt-8 flex justify-center gap-3 reveal">
            {["Adda Moments", "Food Shots"].map((p) => (
              <span
                key={p}
                className="font-display border-2 border-yellow-street text-yellow-street px-5 py-2 rounded-full text-sm"
                style={{ letterSpacing: "0.04em" }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {[
              { ar: "4/5" }, { ar: "16/9" }, { ar: "4/5" }, { ar: "1/1" },
              { ar: "16/9" }, { ar: "4/5" }, { ar: "1/1" }, { ar: "16/9" },
              { ar: "4/5" },
            ].map((p, i) => (
              <div
                key={i}
                className="reveal mb-5 break-inside-avoid bg-[#2a317a] rounded-[12px] flex flex-col items-center justify-center text-white/20 hover:border-2 hover:border-yellow-street hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                style={{ aspectRatio: p.ar, border: "2px solid transparent" }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>Your moment here</span>
              </div>
            ))}
          </div>

          <p className="text-center text-white/40 mt-6" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
            📸 Tag us @lifeatdhakastreet
          </p>

          {/* Divider */}
          <div className="my-20 h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* PART 2 — Video */}
          <div className="text-center reveal">
            <div className="text-white/40 uppercase" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.22em" }}>
              Hear it from them.
            </div>
            <h2 className="video-title font-display text-white text-5xl md:text-7xl mt-3 leading-[0.95]">
              DON'T TAKE
              <br />
              <span className="text-yellow-street">OUR WORD</span> FOR IT.
            </h2>
          </div>

          <div className="reveal mx-auto mt-12 relative" style={{ maxWidth: "860px" }}>
            <div
              className="relative w-full flex flex-col items-center justify-center"
              style={{
                aspectRatio: "16/9",
                background: "#212666",
                border: "1px solid rgba(245,200,0,0.15)",
                borderRadius: "20px",
              }}
            >
              <button
                className="rounded-full flex items-center justify-center animate-pulse-glow"
                style={{ width: "72px", height: "72px", background: "#F5C800" }}
                aria-label="Play video"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1" fill="#212666">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="text-white/50 mt-5" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
                Customer Stories
              </div>
            </div>
            <p className="text-center text-white/30 mt-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
              📍 Replace with your YouTube embed link
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT / FIND US */}
      <section id="contact" className="bg-indigo-deep py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center reveal">
            <div className="font-bangla text-yellow-street text-sm" style={{ letterSpacing: "0.04em" }}>
              আজকে যাবি নাকি?
            </div>
            <h2 className="section-title font-display text-white mt-3 leading-[0.9]" style={{ fontSize: "clamp(56px, 12vw, 130px)" }}>
              AJKE <span className="text-yellow-street">JABI</span> NAKI?
            </h2>
            <p className="text-white/50 mt-6 max-w-2xl mx-auto" style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: 1.8 }}>
              Tomar plan jai hok — amader address ekhono shei same. Chole asho.
            </p>
          </div>

          {/* Three info cards */}
          <div className="mt-14 grid md:grid-cols-3 gap-4">
            {/* Location */}
            <div className="reveal rounded-2xl p-8" style={{ background: "#2a317a" }}>
              <div className="text-yellow-street/70 uppercase" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.22em" }}>
                LOCATION
              </div>
              <div className="font-display text-white text-3xl mt-4 leading-tight">
                SHOP B1, MB SQUARE MARKET
                <br />
                DHAKA 1229
              </div>
              <a
                href="https://maps.app.goo.gl/dhaka-street-bashundhara"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-street mt-6 inline-block hover:underline"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px" }}
              >
                Open in Maps →
              </a>
            </div>

            {/* Hours */}
            <div className="reveal rounded-2xl p-8" style={{ background: "#2a317a" }}>
              <div className="text-yellow-street/70 uppercase" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.22em" }}>
                HOURS
              </div>
              <div className="font-display text-white text-3xl mt-4 leading-tight">
                DAILY
                <br />
                4 PM – 1 AM
              </div>
              <div className="font-bangla text-white/70 mt-6 text-sm">Late nights welcome.</div>
            </div>

            {/* WhatsApp */}
            <div className="reveal rounded-2xl p-8" style={{ background: "#F5C800", color: "#212666" }}>
              <div className="uppercase opacity-70" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.22em" }}>
                WHATSAPP
              </div>
              <div className="font-display text-3xl mt-4 leading-tight">
                QUESTION ACHE?
                <br />
                MESSAGE KORO.
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block px-6 py-3 rounded-full text-white transition-colors hover:bg-whatsapp"
                style={{ background: "#212666", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}
              >
                +880 01789-977034
              </a>
            </div>
          </div>

          {/* Map */}
          <div
            className="reveal mt-10 relative w-full overflow-hidden"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(245,200,0,0.15)",
              height: "380px",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1825.025068957758!2d90.42311192692888!3d23.81681608963593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7d9a715f9c5%3A0x3f31760387dc159a!2sDhaka%20Street%2C%20Bashundhara%20R%2FA!5e0!3m2!1sen!2sbd!4v1779019084854!5m2!1sen!2sbd"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: 16, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Pin overlay */}
            <svg
              viewBox="0 0 24 24"
              className="absolute pointer-events-none"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -100%)", width: "44px", height: "44px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}
              fill="#F5C800"
            >
              <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" stroke="#212666" strokeWidth="1" />
            </svg>
          </div>
        </div>
        <style>{`
          @media (max-width: 767px) {
            #contact iframe { height: 240px; }
            #contact .reveal[style*="height: 380px"], #contact div[style*="height: 380px"] { height: 240px !important; }
          }
        `}</style>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#181e55] border-t-2 border-yellow-street pt-16 pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Dhaka Street Logo" className="w-12 h-12 rounded-full border-2 border-yellow-street" />
              <span className="font-display text-2xl text-yellow-street">Dhaka Street</span>
            </div>
            <p className="text-white/80 mt-4" style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>No reservations needed. Just hunger.</p>
            <p className="font-bangla text-yellow-street mt-1 font-bangla-heading">ঢাকার স্বাদ ✦</p>
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
            <div className="font-display text-xl text-yellow-street mb-4">Quick Links</div>
            <ul className="space-y-2 text-white/80 text-sm">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-yellow-street">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-display text-xl text-yellow-street mb-4">Follow Us</div>
            <ul className="space-y-3 text-white/80 text-sm">
              <li>
                <a href="https://facebook.com/LifeAtDhakaStreet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-yellow-street group">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-yellow-street group-hover:text-[#181e55] transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12H17l-.4 2.9h-2.3v7A10 10 0 0022 12z"/></svg>
                  </span>
                  Dhaka Street
                </a>
              </li>
              <li>
                <a href="https://instagram.com/lifeatdhakastreet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-yellow-street group">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-yellow-street group-hover:text-[#181e55] transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.1-2.1a1.1 1.1 0 110 2.3 1.1 1.1 0 010-2.3z"/></svg>
                  </span>
                  lifeatdhakastreet
                </a>
              </li>
              <li>
                <a href="tel:+8801789977034" className="inline-flex items-center gap-2 hover:text-yellow-street group">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-yellow-street group-hover:text-[#181e55] transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg>
                  </span>
                  +88 01789-977034
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Dhaka Street. All rights reserved.</div>
          <div className="font-bangla text-yellow-street">ঢাকার স্বাদ ✦</div>
          <a
            href="/admin"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.15)',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,200,0,0.4)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.15)')}
          >
            admin
          </a>
        </div>
      </footer>
    </div>
  );
}

function AnnouncementBanner() {
  const [msg, setMsg] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("message,is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.message) setMsg(data.message);
      });
  }, []);

  if (!msg || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "#F5C800",
        color: "#212666",
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 14,
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ flex: 1, textAlign: "center" }}>{msg}</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          color: "#212666",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: 4,
        }}
      >
        ✕
      </button>
    </div>
  );
}
