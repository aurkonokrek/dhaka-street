export const CNGSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 80" className={className} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="72" rx="50" ry="3" fill="rgba(0,0,0,0.2)" />
    {/* Body */}
    <path d="M15 55 Q15 25 40 22 L80 22 Q100 25 105 50 L105 60 L15 60 Z" fill="#1a8c3a" stroke="#0d3d18" strokeWidth="1.5" />
    <path d="M15 55 L15 60 L105 60 L105 55 Z" fill="#0d3d18" />
    {/* Roof */}
    <path d="M40 22 L80 22 L78 12 L42 12 Z" fill="#1a8c3a" stroke="#0d3d18" strokeWidth="1.5" />
    {/* Windshield */}
    <path d="M42 22 L78 22 L75 28 L45 28 Z" fill="#bfe8ff" opacity="0.6" stroke="#0d3d18" strokeWidth="1" />
    {/* Driver */}
    <circle cx="55" cy="38" r="4" fill="#f4c89a" />
    <rect x="51" y="42" width="8" height="10" fill="#fff" />
    {/* Headlight */}
    <circle cx="100" cy="48" r="4" fill="#F5C800" stroke="#0d3d18" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="32" cy="65" r="9" fill="#222" stroke="#0d3d18" strokeWidth="1.5" />
    <circle cx="32" cy="65" r="3" fill="#888" />
    <circle cx="90" cy="65" r="9" fill="#222" stroke="#0d3d18" strokeWidth="1.5" />
    <circle cx="90" cy="65" r="3" fill="#888" />
  </svg>
);

export const RickshawSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 140 90" className={className} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="82" rx="55" ry="3" fill="rgba(0,0,0,0.2)" />
    {/* Hood */}
    <path d="M55 50 Q55 20 85 20 Q115 20 115 50" fill="#e63946" stroke="#222" strokeWidth="1.5" />
    <path d="M55 50 L115 50 L115 58 L55 58 Z" fill="#1a8c3a" stroke="#222" strokeWidth="1" />
    {/* Seat decoration */}
    <rect x="60" y="38" width="50" height="10" fill="#F5C800" stroke="#222" strokeWidth="0.8" />
    {/* Frame to front */}
    <line x1="55" y1="55" x2="20" y2="68" stroke="#222" strokeWidth="2" />
    <line x1="55" y1="45" x2="22" y2="60" stroke="#222" strokeWidth="2" />
    {/* Handlebar */}
    <line x1="22" y1="60" x2="18" y2="48" stroke="#222" strokeWidth="2.5" />
    <line x1="14" y1="46" x2="22" y2="46" stroke="#222" strokeWidth="2" />
    {/* Driver */}
    <circle cx="38" cy="42" r="4" fill="#a07050" />
    <path d="M34 46 L42 46 L44 60 L32 60 Z" fill="#1d4ed8" />
    {/* Front wheel */}
    <circle cx="18" cy="72" r="10" fill="none" stroke="#222" strokeWidth="2" />
    <circle cx="18" cy="72" r="2" fill="#222" />
    {/* Back wheels */}
    <circle cx="65" cy="72" r="10" fill="none" stroke="#222" strokeWidth="2" />
    <circle cx="65" cy="72" r="2" fill="#222" />
    <circle cx="105" cy="72" r="10" fill="none" stroke="#222" strokeWidth="2" />
    <circle cx="105" cy="72" r="2" fill="#222" />
  </svg>
);

export const BusSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 180 90" className={className} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="82" rx="75" ry="3" fill="rgba(0,0,0,0.2)" />
    <rect x="10" y="22" width="160" height="48" rx="6" fill="#F5C800" stroke="#222" strokeWidth="1.5" />
    <rect x="10" y="22" width="160" height="10" fill="#e63946" />
    {/* Windows */}
    {[20, 50, 80, 110, 140].map((x) => (
      <rect key={x} x={x} y="36" width="22" height="16" fill="#bfe8ff" stroke="#222" strokeWidth="1" />
    ))}
    {/* Door */}
    <rect x="150" y="36" width="14" height="28" fill="#222" />
    <line x1="157" y1="36" x2="157" y2="64" stroke="#F5C800" strokeWidth="1" />
    {/* Headlight */}
    <circle cx="166" cy="60" r="3" fill="#fff" stroke="#222" strokeWidth="0.8" />
    {/* Wheels */}
    <circle cx="40" cy="72" r="10" fill="#222" />
    <circle cx="40" cy="72" r="3" fill="#888" />
    <circle cx="140" cy="72" r="10" fill="#222" />
    <circle cx="140" cy="72" r="3" fill="#888" />
  </svg>
);

export const WalkerSvg = ({ color = "#F5C800", className = "" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 30 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="8" r="5" fill="#f4c89a" />
    <path d="M10 14 L20 14 L22 35 L8 35 Z" fill={color} />
    <rect x="9" y="35" width="5" height="18" fill="#222" />
    <rect x="16" y="35" width="5" height="18" fill="#222" />
    {/* Bag */}
    <rect x="20" y="20" width="6" height="8" fill="#1a8c3a" />
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
    <circle cx="42" cy="48" r="3" fill="#f7e9a0" />
    <circle cx="58" cy="48" r="3" fill="#f7e9a0" />
  </svg>
);

export const WingSvg = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 70 Q20 40 50 30 Q80 30 75 60 Q70 80 50 80 Z" fill="#c0682a" stroke="#5a2a08" strokeWidth="2" />
    <path d="M40 75 L40 90" stroke="#fff" strokeWidth="3" />
  </svg>
);
