/*
  Illustrations for the four-step process.
  Drawn for a light panel (turquoise tint #E9FFFD) inside the dark "how it works" section.
*/

const DEEP = "#0d2c33";
const SHERPA = "#004a5d";
const ORIENT = "#00627b";
const TURQ = "#6ae6dc";
const TURQ_DEEP = "#2cc2b6";
const SLAB = "#d9d6d6";
const SLAB_LINE = "#c5c5cf";
const SPRING = "#f8f8f9";

/* Surface cross-section: a slab with a subtle hatch */
function Slab({ y = 118, h = 26 }: { y?: number; h?: number }) {
  return (
    <g>
      <rect x="16" y={y} width="208" height={h} rx="6" fill={SLAB} />
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={i}
          x1={24 + i * 13}
          y1={y + h - 5}
          x2={32 + i * 13}
          y2={y + 5}
          stroke={SLAB_LINE}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/* Bonded film + upright positively charged spikes */
function ShieldLayer({ count = 9, top = 64, y = 118 }: { count?: number; top?: number; y?: number }) {
  const gap = 200 / count;
  return (
    <g>
      {/* anchors: the layer is bonded into the surface */}
      {Array.from({ length: count }, (_, i) => {
        const x = 20 + gap / 2 + i * gap;
        return (
          <g key={`a${i}`}>
            <line x1={x} y1={y - 8} x2={x} y2={y + 6} stroke={SHERPA} strokeWidth="2" />
            <circle cx={x} cy={y + 6} r="2.6" fill={SHERPA} />
          </g>
        );
      })}
      <rect x="16" y={y - 12} width="208" height="8" rx="4" fill={TURQ} />
      {Array.from({ length: count }, (_, i) => {
        const x = 20 + gap / 2 + i * gap;
        return (
          <g key={`s${i}`}>
            <line x1={x} y1={y - 12} x2={x} y2={top + 7} stroke={ORIENT} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={x} cy={top} r="7.5" fill={SHERPA} className="art-tip" style={{ animationDelay: `${i * 0.18}s` }} />
            <path d={`M${x - 3.5} ${top}h7M${x} ${top - 3.5}v7`} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

export function ApplyArt() {
  // droplets inside the mist cone (deterministic)
  const drops = [
    [104, 52, 2.2],
    [118, 62, 1.8],
    [132, 58, 2.6],
    [124, 78, 2],
    [146, 72, 1.6],
    [140, 90, 2.4],
    [158, 84, 2],
    [166, 100, 1.8],
    [178, 92, 2.6],
    [150, 108, 1.6],
    [190, 108, 2.2],
    [200, 96, 1.6],
    [172, 118, 2],
    [206, 116, 2.4],
    [186, 124, 1.6],
    [214, 104, 1.8],
    [112, 70, 1.4],
    [196, 80, 1.4],
  ];
  return (
    <svg viewBox="0 0 240 160" aria-hidden className="w-full">
      <defs>
        <linearGradient id="mist" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor={TURQ} stopOpacity="0.85" />
          <stop offset="1" stopColor={TURQ} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* surface being coated */}
      <rect x="92" y="136" width="136" height="12" rx="6" fill={SLAB} />
      <rect x="120" y="131" width="108" height="6" rx="3" fill={TURQ} />

      {/* mist cone */}
      <path d="M86 40 L232 92 L232 132 L120 132 Z" fill="url(#mist)" />
      {drops.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={i % 3 ? TURQ_DEEP : ORIENT}
          opacity={0.55 + (i % 4) * 0.1}
          className="art-mist"
          style={{ animationDelay: `${(i % 6) * 0.35}s` }}
        />
      ))}

      {/* trigger sprayer */}
      <rect x="22" y="70" width="44" height="78" rx="12" fill={SHERPA} />
      <rect x="30" y="90" width="28" height="30" rx="4" fill={SPRING} opacity="0.9" />
      <path d="M38 102l4 4 8-9" fill="none" stroke={SHERPA} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="58" width="20" height="14" rx="3" fill={DEEP} />
      <path d="M24 58 V40 Q24 30 34 30 H74 L86 36 V44 L64 44 L56 58 Z" fill={DEEP} />
      <path d="M44 58 Q38 70 46 78 L54 74 Q48 68 52 58 Z" fill={ORIENT} />
    </svg>
  );
}

export function BondArt() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden className="w-full">
      <Slab />
      <ShieldLayer />
      {/* callouts */}
      <g fontSize="9" fontWeight="600" fill={DEEP}>
        <text x="224" y="30" textAnchor="end">
          + charged tips
        </text>
        <line x1="190" y1="34" x2="182" y2="54" stroke={DEEP} strokeWidth="1" />
        <text x="18" y="30">
          bonded layer
        </text>
        <line x1="36" y1="34" x2="42" y2="103" stroke={DEEP} strokeWidth="1" />
        <circle cx="42" cy="104" r="2" fill={DEEP} />
      </g>
    </svg>
  );
}

export function ProtectArt() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden className="w-full">
      <Slab />
      <ShieldLayer top={72} />

      {/* microbe approaching */}
      <g className="art-bob">
        <g transform="translate(64 30) rotate(-18)">
          <path d="M-26 0 q-10 -6 -18 0 q-8 6 -16 0" fill="none" stroke={DEEP} strokeWidth="1.6" strokeLinecap="round" />
          <rect x="-26" y="-11" width="52" height="22" rx="11" fill={SPRING} stroke={DEEP} strokeWidth="2" />
          <circle cx="-8" cy="-2" r="2.4" fill={DEEP} />
          <circle cx="6" cy="3" r="2" fill={DEEP} />
        </g>
        <path d="M78 50 v10" stroke={DEEP} strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M74 58 l4 5 4 -5" fill="none" stroke={DEEP} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* microbe split apart on contact */}
      <g transform="translate(166 46)">
        <g transform="translate(-9 0) rotate(-24)">
          <path d="M-2 -11 H-14 A11 11 0 0 0 -14 11 H-2" fill={SPRING} stroke={DEEP} strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g transform="translate(9 0) rotate(24)">
          <path d="M2 -11 H14 A11 11 0 0 1 14 11 H2" fill={SPRING} stroke={DEEP} strokeWidth="2" strokeLinejoin="round" />
        </g>
        <circle cx="-1" cy="-4" r="2" fill={DEEP} />
        <circle cx="3" cy="4" r="1.6" fill={DEEP} />
        <circle cx="-3" cy="9" r="1.3" fill={DEEP} />
        {[-50, 0, 50].map((a, i) => (
          <line
            className="art-spark"
            style={{ animationDelay: `${i * 0.2}s` }}
            key={a}
            x1={Math.sin((a * Math.PI) / 180) * 22}
            y1={-Math.cos((a * Math.PI) / 180) * 22 - 6}
            x2={Math.sin((a * Math.PI) / 180) * 31}
            y2={-Math.cos((a * Math.PI) / 180) * 31 - 6}
            stroke={TURQ_DEEP}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

export function VerifyArt() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden className="w-full">
      {/* surface with swab */}
      <rect x="16" y="134" width="96" height="12" rx="6" fill={SLAB} />
      <rect x="16" y="129" width="96" height="6" rx="3" fill={TURQ} />
      <line x1="44" y1="40" x2="72" y2="124" stroke={ORIENT} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="73" cy="126" rx="6" ry="4" fill={SPRING} stroke={ORIENT} strokeWidth="2" transform="rotate(-20 73 126)" />

      {/* ATP luminometer */}
      <rect x="124" y="16" width="96" height="132" rx="18" fill={SHERPA} />
      <rect x="136" y="30" width="72" height="54" rx="8" fill={DEEP} />
      <text x="172" y="60" textAnchor="middle" fill={TURQ} fontSize="22" fontWeight="700">
        18
      </text>
      <text x="172" y="75" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600" letterSpacing="1">
        RLU
      </text>
      <circle cx="172" cy="112" r="17" fill="none" stroke={TURQ} strokeWidth="2" className="art-ping" />
      <circle cx="172" cy="112" r="17" fill={TURQ} />
      <path d="M163 112l6 6 11-13" fill="none" stroke={DEEP} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
