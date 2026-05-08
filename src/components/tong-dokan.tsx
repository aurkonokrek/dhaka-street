// Animated roadside tong dokan (tea stall) SVG.
// Sits on the sidewalk in the hero street scene.
export const TongDokan = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 220"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* ── Warm ambient glow behind stall ── */}
    <ellipse
      className="bulb-ambient"
      cx="140"
      cy="120"
      rx="150"
      ry="90"
      fill="url(#ambientGlow)"
      opacity="0.9"
    />

    <defs>
      <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,180,80,0.55)" />
        <stop offset="60%" stopColor="rgba(255,140,40,0.18)" />
        <stop offset="100%" stopColor="rgba(255,140,40,0)" />
      </radialGradient>
      <radialGradient id="bulbHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff5b0" />
        <stop offset="40%" stopColor="rgba(255,210,90,0.7)" />
        <stop offset="100%" stopColor="rgba(255,180,40,0)" />
      </radialGradient>
      <linearGradient id="tarp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a2a1a" />
        <stop offset="100%" stopColor="#1f140a" />
      </linearGradient>
      <linearGradient id="counter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6a4a2a" />
        <stop offset="100%" stopColor="#3a2410" />
      </linearGradient>
      <linearGradient id="signBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1ea33f" />
        <stop offset="100%" stopColor="#0d6a26" />
      </linearGradient>
    </defs>

    {/* ── Back wall / shack frame (corrugated tin) ── */}
    <rect x="40" y="40" width="200" height="130" fill="#2a1f14" stroke="#0a0500" strokeWidth="1.5" />
    {/* corrugated lines */}
    {Array.from({ length: 12 }).map((_, i) => (
      <line
        key={i}
        x1={42 + i * 16.5}
        y1="42"
        x2={42 + i * 16.5}
        y2="168"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.6"
      />
    ))}

    {/* ── Tarp/awning roof ── */}
    <path d="M28 50 L252 50 L240 38 L40 38 Z" fill="url(#tarp)" stroke="#0a0500" strokeWidth="1.2" />
    <path d="M28 50 L252 50 L248 56 L32 56 Z" fill="#1a1208" />
    {/* fringe scallops */}
    {Array.from({ length: 14 }).map((_, i) => (
      <path
        key={i}
        d={`M${32 + i * 16} 56 Q${40 + i * 16} 64 ${48 + i * 16} 56`}
        fill="#1a1208"
        stroke="#000"
        strokeWidth="0.4"
      />
    ))}

    {/* ── Green sign board ── */}
    <rect x="55" y="64" width="170" height="22" fill="url(#signBg)" stroke="#062b10" strokeWidth="1" rx="2" />
    <rect x="55" y="64" width="170" height="3" fill="#F5C800" opacity="0.5" />
    <text
      x="140"
      y="80"
      textAnchor="middle"
      fontSize="13"
      fontFamily="'Anek Bangla', serif"
      fontWeight="700"
      fill="#F5C800"
    >
      মামার চা ও নাস্তা
    </text>

    {/* ── Hanging string of bulbs ── */}
    <path d="M28 50 Q140 60 252 50" stroke="#222" strokeWidth="0.6" fill="none" />
    {[50, 90, 130, 170, 210].map((cx, i) => (
      <g key={cx} className="bulb-glow" style={{ animationDelay: `${i * 0.4}s` }}>
        <circle cx={cx} cy={56 + (i % 2) * 1} r="10" fill="url(#bulbHalo)" opacity="0.9" />
        <circle cx={cx} cy={56 + (i % 2) * 1} r="2.6" fill="#fff5b0" />
      </g>
    ))}

    {/* ── Shelves with jars/snacks ── */}
    <rect x="60" y="94" width="160" height="3" fill="#4a2f18" />
    <rect x="60" y="118" width="160" height="3" fill="#4a2f18" />

    {/* jars row 1 (biscuits, chanachur) */}
    {[
      { x: 70, c: "#d4843a" },
      { x: 92, c: "#e8a55a" },
      { x: 114, c: "#c46a2a" },
      { x: 136, c: "#F5C800" },
      { x: 158, c: "#a05028" },
      { x: 180, c: "#d4843a" },
      { x: 202, c: "#e8a55a" },
    ].map((j) => (
      <g key={j.x}>
        <rect x={j.x} y="98" width="14" height="18" fill={j.c} stroke="#1a0a00" strokeWidth="0.4" rx="1.5" />
        <rect x={j.x} y="98" width="14" height="3" fill="#222" />
        <rect x={j.x + 1} y="101" width="12" height="5" fill="rgba(255,255,255,0.18)" />
      </g>
    ))}

    {/* shelf 2 — packets/snacks */}
    {[68, 88, 108, 128, 148, 168, 188, 208].map((x, i) => (
      <rect
        key={x}
        x={x}
        y="122"
        width="14"
        height="14"
        fill={["#e63946", "#3a7dd1", "#F5C800", "#1ea33f", "#e63946", "#3a7dd1", "#F5C800", "#1ea33f"][i]}
        stroke="#0a0500"
        strokeWidth="0.4"
        rx="1"
      />
    ))}

    {/* ── Counter ── */}
    <rect x="35" y="140" width="210" height="32" fill="url(#counter)" stroke="#0a0500" strokeWidth="1.2" />
    <rect x="35" y="140" width="210" height="3" fill="#8a5a32" />

    {/* ── Mama (shopkeeper) behind counter ── */}
    <g>
      {/* head */}
      <circle cx="100" cy="115" r="9" fill="#a07050" />
      {/* hair / cap */}
      <path d="M91 110 Q100 100 109 110 Z" fill="#1a1208" />
      {/* body — white panjabi */}
      <path d="M85 124 L115 124 L118 145 L82 145 Z" fill="#f7f2e8" stroke="#1a1208" strokeWidth="0.6" />
      {/* arm pouring */}
      <path d="M115 130 L132 138 L130 142 L113 134 Z" fill="#f7f2e8" stroke="#1a1208" strokeWidth="0.5" />
    </g>

    {/* ── Kettle on counter (steaming) ── */}
    <g>
      <ellipse cx="138" cy="156" rx="11" ry="3" fill="#1a1208" opacity="0.5" />
      <path d="M127 156 Q127 144 138 144 Q149 144 149 156 Z" fill="#5a5a5a" stroke="#1a1208" strokeWidth="0.6" />
      <path d="M149 148 L156 145 L155 150 L149 152 Z" fill="#5a5a5a" stroke="#1a1208" strokeWidth="0.5" />
      <path d="M133 144 Q138 138 143 144" stroke="#1a1208" strokeWidth="1.2" fill="none" />
      {/* steam */}
      <g className="steam-1">
        <path d="M138 142 Q135 138 138 134 Q141 130 138 126" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
      </g>
      <g className="steam-2">
        <path d="M142 142 Q145 138 142 134" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" strokeLinecap="round" />
      </g>
    </g>

    {/* ── Tea cups on counter ── */}
    {[160, 175, 190, 205].map((cx, i) => (
      <g key={cx}>
        <path d={`M${cx - 4} 152 L${cx + 4} 152 L${cx + 3} 160 L${cx - 3} 160 Z`} fill="#fff" stroke="#1a1208" strokeWidth="0.4" />
        <ellipse cx={cx} cy="152" rx="4" ry="1" fill="#a05028" />
        {i === 1 && (
          <g className="steam-2">
            <path d={`M${cx} 150 Q${cx - 2} 146 ${cx} 142`} stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
          </g>
        )}
      </g>
    ))}

    {/* ── Front posts ── */}
    <rect x="32" y="50" width="3" height="120" fill="#1a1208" />
    <rect x="245" y="50" width="3" height="120" fill="#1a1208" />

    {/* ── Plastic chairs on sidewalk in front ── */}
    {/* red chair */}
    <g>
      <rect x="48" y="180" width="20" height="14" fill="#e63946" stroke="#1a0500" strokeWidth="0.6" rx="2" />
      <rect x="48" y="180" width="20" height="3" fill="#a01a26" />
      <line x1="50" y1="194" x2="50" y2="204" stroke="#1a0500" strokeWidth="1.2" />
      <line x1="66" y1="194" x2="66" y2="204" stroke="#1a0500" strokeWidth="1.2" />
    </g>
    {/* blue chair */}
    <g>
      <rect x="200" y="182" width="22" height="14" fill="#3a7dd1" stroke="#1a0500" strokeWidth="0.6" rx="2" />
      <rect x="200" y="182" width="22" height="3" fill="#1a4a8a" />
      <line x1="202" y1="196" x2="202" y2="206" stroke="#1a0500" strokeWidth="1.2" />
      <line x1="220" y1="196" x2="220" y2="206" stroke="#1a0500" strokeWidth="1.2" />
    </g>

    {/* ── Customer seated on red chair (smoking) ── */}
    <g>
      {/* body */}
      <path d="M48 168 L70 168 L72 182 L46 182 Z" fill="#1a1e50" stroke="#0a0500" strokeWidth="0.5" />
      {/* head */}
      <circle cx="58" cy="162" r="6" fill="#a07050" />
      {/* arm with phone */}
      <path d="M62 174 L74 168 L76 172 L64 178 Z" fill="#1a1e50" />
      {/* phone */}
      <rect x="74" y="164" width="6" height="10" fill="#222" stroke="#000" strokeWidth="0.4" rx="1" />
      <rect className="phone-screen" x="75" y="165" width="4" height="8" fill="#bfe8ff" />
      {/* cigarette + smoke */}
      <line x1="54" y1="161" x2="50" y2="158" stroke="#fff" strokeWidth="1" />
      <circle cx="50" cy="158" r="0.8" fill="#ff6a1a" />
      <g className="cig-smoke">
        <path d="M50 156 Q48 152 50 148 Q52 144 50 140" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </g>

    {/* ── Tea cups & cigarette butts on ground ── */}
    <g opacity="0.85">
      <ellipse cx="90" cy="208" rx="3" ry="1" fill="#fff" />
      <ellipse cx="120" cy="210" rx="3" ry="1" fill="#fff" />
      <line x1="105" y1="210" x2="108" y2="211" stroke="#fff" strokeWidth="0.8" />
      <line x1="135" y1="208" x2="138" y2="209" stroke="#fff" strokeWidth="0.8" />
      <line x1="170" y1="210" x2="173" y2="211" stroke="#fff" strokeWidth="0.8" />
    </g>

    {/* ── Bengali label bottom corner ── */}
    <text
      x="140"
      y="218"
      textAnchor="middle"
      fontSize="6"
      fontFamily="'Anek Bangla', serif"
      fill="rgba(245,200,0,0.55)"
      letterSpacing="2"
    >
      টং দোকান
    </text>
  </svg>
);
