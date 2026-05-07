// Dhaka street scene SVGs — stylized to match real Dhaka vehicles.
// All vehicles drawn FACING RIGHT by default (headlights/front on right side).
// Apply scaleX(-1) externally to face left (used for bus going right→left).

export const CNGSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* shadow */}
    <ellipse cx="70" cy="92" rx="58" ry="3" fill="rgba(0,0,0,0.25)" />
    {/* bunting flags across the top */}
    <path d="M20 12 Q70 6 120 12" stroke="#0d3d18" strokeWidth="0.6" fill="none" />
    {[
      { x: 28, c: "#e63946" },
      { x: 40, c: "#F5C800" },
      { x: 52, c: "#1a8c3a" },
      { x: 64, c: "#3a7dd1" },
      { x: 76, c: "#e63946" },
      { x: 88, c: "#F5C800" },
      { x: 100, c: "#1a8c3a" },
      { x: 112, c: "#3a7dd1" },
    ].map((f) => (
      <polygon key={f.x} points={`${f.x},12 ${f.x + 8},12 ${f.x + 4},20`} fill={f.c} />
    ))}
    {/* dark navy roof */}
    <path d="M40 30 L100 30 L96 18 L44 18 Z" fill="#1a1e50" stroke="#0a0d2e" strokeWidth="1.2" />
    {/* green body */}
    <path d="M14 65 Q14 32 44 30 L100 30 Q124 32 126 60 L126 72 L14 72 Z" fill="#1ea33f" stroke="#0d3d18" strokeWidth="1.5" />
    {/* yellow stripe */}
    <rect x="14" y="58" width="112" height="6" fill="#F5C800" />
    {/* red stripe */}
    <rect x="14" y="64" width="112" height="3" fill="#e63946" />
    {/* windshield */}
    <path d="M44 30 L96 30 L92 38 L48 38 Z" fill="#bfe8ff" opacity="0.7" stroke="#0a0d2e" strokeWidth="1" />
    {/* side panel with Bengali text */}
    <rect x="48" y="42" width="50" height="14" fill="#fff" opacity="0.85" stroke="#0d3d18" strokeWidth="0.5" />
    <text x="73" y="53" textAnchor="middle" fontSize="8" fontFamily="serif" fill="#0d3d18" fontWeight="bold">ভাড়ায় চালিত</text>
    {/* driver silhouette */}
    <circle cx="58" cy="44" r="4" fill="#a07050" />
    {/* yellow headlight glow on right (front) */}
    <circle cx="122" cy="58" r="6" fill="#fff48a" opacity="0.6" />
    <circle cx="122" cy="58" r="3.5" fill="#F5C800" stroke="#0d3d18" strokeWidth="1" />
    {/* wheels */}
    <circle cx="34" cy="78" r="11" fill="#1a1a1a" stroke="#0d3d18" strokeWidth="1.5" />
    <circle cx="34" cy="78" r="5" fill="#F5C800" />
    <circle cx="34" cy="78" r="1.5" fill="#0d3d18" />
    <circle cx="106" cy="78" r="11" fill="#1a1a1a" stroke="#0d3d18" strokeWidth="1.5" />
    <circle cx="106" cy="78" r="5" fill="#F5C800" />
    <circle cx="106" cy="78" r="1.5" fill="#0d3d18" />
  </svg>
);

export const RickshawSvg = ({ className = "" }: { className?: string }) => (
  // Faces RIGHT: puller on right pedaling forward
  <svg viewBox="0 0 180 110" className={className} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="102" rx="80" ry="3" fill="rgba(0,0,0,0.25)" />
    {/* canopy back panel */}
    <path d="M20 70 Q20 22 60 22 L75 22 L75 70 Z" fill="#3a7dd1" stroke="#0a0d2e" strokeWidth="1.2" />
    {/* canopy decoration stripes */}
    <path d="M20 70 Q20 22 60 22 L75 22 L75 70 Z" fill="url(#rickPat)" opacity="0.5" />
    <defs>
      <pattern id="rickPat" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#3a7dd1" />
        <circle cx="5" cy="5" r="2" fill="#e63946" />
      </pattern>
    </defs>
    {/* lotus flower on canopy */}
    <circle cx="45" cy="46" r="9" fill="#fff" />
    <circle cx="45" cy="46" r="5" fill="#F5C800" />
    {/* canopy top arc */}
    <path d="M16 30 Q40 8 68 22" stroke="#e63946" strokeWidth="3" fill="none" />
    {/* fringe */}
    {[20, 28, 36, 44, 52, 60, 68].map((x) => (
      <line key={x} x1={x} y1="22" x2={x} y2="30" stroke="#F5C800" strokeWidth="1.5" />
    ))}
    {/* red cushion seat */}
    <rect x="55" y="58" width="30" height="14" fill="#e63946" stroke="#7a1a1a" strokeWidth="1" />
    {/* chassis */}
    <rect x="22" y="72" width="80" height="6" fill="#0d3d18" />
    {/* bicycle frame to front */}
    <line x1="80" y1="78" x2="120" y2="62" stroke="#1a1a1a" strokeWidth="2.5" />
    <line x1="80" y1="86" x2="118" y2="86" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="120" y1="62" x2="120" y2="86" stroke="#1a1a1a" strokeWidth="2" />
    {/* handlebar */}
    <line x1="120" y1="62" x2="128" y2="56" stroke="#1a1a1a" strokeWidth="2.5" />
    <line x1="125" y1="54" x2="135" y2="58" stroke="#1a1a1a" strokeWidth="2" />
    {/* puller — body */}
    <ellipse cx="108" cy="62" rx="6" ry="9" fill="#F5C800" />
    {/* gamcha head wrap */}
    <circle cx="108" cy="48" r="6" fill="#a07050" />
    <path d="M102 46 Q108 40 114 46 L114 50 L102 50 Z" fill="#e63946" />
    <line x1="103" y1="48" x2="113" y2="48" stroke="#fff" strokeWidth="0.5" />
    {/* lungi (blue plaid) */}
    <path d="M104 70 L114 70 L116 84 L102 84 Z" fill="#3a7dd1" />
    <line x1="104" y1="74" x2="116" y2="74" stroke="#1a3a6e" strokeWidth="0.5" />
    <line x1="104" y1="78" x2="116" y2="78" stroke="#1a3a6e" strokeWidth="0.5" />
    {/* legs pedaling */}
    <line x1="108" y1="84" x2="116" y2="92" stroke="#a07050" strokeWidth="3" />
    {/* spoked wheels */}
    {[40, 90, 130].map((cx, i) => (
      <g key={i}>
        <circle cx={cx} cy="92" r="14" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        {[0, 30, 60, 90, 120, 150].map((ang) => (
          <line
            key={ang}
            x1={cx}
            y1="92"
            x2={cx + 13 * Math.cos((ang * Math.PI) / 180)}
            y2={92 + 13 * Math.sin((ang * Math.PI) / 180)}
            stroke="#888"
            strokeWidth="0.6"
          />
        ))}
        <circle cx={cx} cy="92" r="2.5" fill="#1a1a1a" />
      </g>
    ))}
  </svg>
);

export const BusSvg = ({ className = "" }: { className?: string }) => (
  // Faces RIGHT by default; flip with scaleX(-1) for right→left motion
  <svg viewBox="0 0 220 110" className={className} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="110" cy="102" rx="95" ry="3" fill="rgba(0,0,0,0.25)" />
    {/* main body cream */}
    <rect x="10" y="28" width="200" height="58" rx="6" fill="#f7f2e8" stroke="#0a0d2e" strokeWidth="1.5" />
    {/* destination board top — navy with bengali text */}
    <rect x="10" y="28" width="200" height="14" fill="#1a1e50" />
    <text x="110" y="39" textAnchor="middle" fontSize="9" fontFamily="serif" fill="#F5C800" fontWeight="bold">ঢাকা পরিবহন</text>
    {/* red stripe */}
    <rect x="10" y="42" width="200" height="3" fill="#e63946" />
    {/* green stripe */}
    <rect x="10" y="80" width="200" height="6" fill="#1ea33f" />
    {/* wave decoration */}
    <path d="M10 70 Q40 60 70 70 T130 70 T190 70 T210 70" stroke="#3a7dd1" strokeWidth="3" fill="none" opacity="0.7" />
    <path d="M10 74 Q40 64 70 74 T130 74 T190 74 T210 74" stroke="#e63946" strokeWidth="2" fill="none" opacity="0.7" />
    {/* floral accents */}
    {[30, 100, 170].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="76" r="3" fill="#e63946" />
        <circle cx={cx + 5} cy="72" r="2" fill="#1ea33f" />
      </g>
    ))}
    {/* windows with passenger silhouettes */}
    {[18, 50, 82, 114, 146].map((x) => (
      <g key={x}>
        <rect x={x} y="48" width="26" height="18" fill="#bfe8ff" stroke="#0a0d2e" strokeWidth="0.8" />
        <circle cx={x + 8} cy="62" r="3" fill="#1a1e50" />
        <circle cx={x + 18} cy="62" r="3" fill="#1a1e50" />
      </g>
    ))}
    {/* door */}
    <rect x="180" y="48" width="14" height="32" fill="#1a1e50" />
    <line x1="187" y1="48" x2="187" y2="80" stroke="#F5C800" strokeWidth="1" />
    {/* front headlights (right side) */}
    <circle cx="206" cy="74" r="5" fill="#fff48a" opacity="0.6" />
    <circle cx="206" cy="74" r="3" fill="#F5C800" stroke="#0a0d2e" strokeWidth="0.8" />
    {/* wheels */}
    <circle cx="42" cy="92" r="11" fill="#1a1a1a" />
    <circle cx="42" cy="92" r="4" fill="#888" />
    <circle cx="170" cy="92" r="11" fill="#1a1a1a" />
    <circle cx="170" cy="92" r="4" fill="#888" />
  </svg>
);

export const WalkerSvg = ({ color = "#F5C800", className = "" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 30 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="8" r="5" fill="#f4c89a" />
    <path d="M10 14 L20 14 L22 35 L8 35 Z" fill={color} />
    <rect x="9" y="35" width="5" height="18" fill="#222" />
    <rect x="16" y="35" width="5" height="18" fill="#222" />
    <rect x="20" y="20" width="6" height="8" fill="#1a8c3a" />
  </svg>
);

export const TrafficPoliceSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 110" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* shadow */}
    <ellipse cx="40" cy="106" rx="22" ry="2.5" fill="rgba(0,0,0,0.3)" />
    {/* legs (navy trousers) */}
    <rect x="32" y="68" width="7" height="34" fill="#1a1e50" />
    <rect x="41" y="68" width="7" height="34" fill="#1a1e50" />
    {/* shoes */}
    <ellipse cx="35" cy="103" rx="5" ry="2" fill="#000" />
    <ellipse cx="45" cy="103" rx="5" ry="2" fill="#000" />
    {/* white shirt */}
    <path d="M28 38 L52 38 L54 70 L26 70 Z" fill="#fff" stroke="#0a0d2e" strokeWidth="0.8" />
    {/* green/teal vest */}
    <path d="M30 40 L50 40 L52 66 L28 66 Z" fill="#2fb39a" stroke="#0a0d2e" strokeWidth="0.8" />
    <rect x="29" y="52" width="22" height="3" fill="#F5C800" opacity="0.7" />
    {/* arms spread wide */}
    <path d="M28 42 L8 38 L6 44 L28 50 Z" fill="#fff" stroke="#0a0d2e" strokeWidth="0.8" />
    <path d="M52 42 L72 38 L74 44 L52 50 Z" fill="#fff" stroke="#0a0d2e" strokeWidth="0.8" />
    {/* hands */}
    <circle cx="7" cy="41" r="3" fill="#f4c89a" />
    <circle cx="73" cy="41" r="3" fill="#f4c89a" />
    {/* head */}
    <circle cx="40" cy="28" r="9" fill="#d9a978" />
    {/* moustache */}
    <path d="M35 32 Q40 34 45 32" stroke="#3a2010" strokeWidth="1.5" fill="none" />
    {/* whistle */}
    <line x1="40" y1="33" x2="48" y2="36" stroke="#1a1a1a" strokeWidth="1" />
    <circle cx="49" cy="36.5" r="1.5" fill="#1a1a1a" />
    {/* police cap */}
    <path d="M30 22 L50 22 L51 16 L29 16 Z" fill="#1a1e50" stroke="#0a0d2e" strokeWidth="0.8" />
    <rect x="29" y="20" width="22" height="3" fill="#0a0d2e" />
    <rect x="32" y="14" width="16" height="4" fill="#1a1e50" />
    {/* badge */}
    <circle cx="40" cy="16" r="1.5" fill="#F5C800" />
  </svg>
);

export const MoonSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="20" fill="#F5C800" />
    <circle cx="38" cy="26" r="18" fill="#212666" />
  </svg>
);

export const ShingaraSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L90 85 L10 85 Z" fill="#d4843a" stroke="#7a3e10" strokeWidth="2" />
    <path d="M50 10 L70 50 L30 50 Z" fill="#e8a55a" opacity="0.6" />
  </svg>
);

export const ChaiSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M25 30 L75 30 L70 85 L30 85 Z" fill="#fff" stroke="#222" strokeWidth="2" />
    <ellipse cx="50" cy="32" rx="25" ry="6" fill="#a0522d" />
    <path d="M75 45 Q90 50 85 65 Q80 70 75 65" fill="none" stroke="#222" strokeWidth="2" />
  </svg>
);

export const MuriSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 50 L85 50 L75 90 L25 90 Z" fill="#F5C800" stroke="#222" strokeWidth="2" />
    <circle cx="35" cy="45" r="3" fill="#f7e9a0" />
    <circle cx="50" cy="42" r="3" fill="#f7e9a0" />
    <circle cx="65" cy="45" r="3" fill="#f7e9a0" />
  </svg>
);

export const WingSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 70 Q20 40 50 30 Q80 30 75 60 Q70 80 50 80 Z" fill="#c0682a" stroke="#5a2a08" strokeWidth="2" />
    <path d="M40 75 L40 90" stroke="#fff" strokeWidth="3" />
  </svg>
);
