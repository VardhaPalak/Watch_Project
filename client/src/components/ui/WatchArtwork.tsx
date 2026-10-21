import { useId } from "react";
import type { ProductArt } from "../../types";

const METALS: Record<ProductArt["case"], { light: string; mid: string; dark: string; rim: string }> = {
  gold: { light: "#F6E6BE", mid: "#B89458", dark: "#6C5027", rim: "#E5C98F" },
  steel: { light: "#F4F7F9", mid: "#A9B2BA", dark: "#5F686F", rim: "#DCE3E8" },
  black: { light: "#565656", mid: "#232323", dark: "#0C0C0C", rim: "#3C3C3C" },
  rose: { light: "#F7DFCE", mid: "#C9A87C", dark: "#8A6543", rim: "#E9C7AC" },
};

interface Props {
  art: ProductArt;
  className?: string;
  label?: string;
}

export default function WatchArtwork({ art, className, label }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const metal = METALS[art.case] ?? METALS.gold;
  const cx = 160;
  const cy = 160;
  const caseRadius = 96;
  const dialRadius = 78;

  const markers = Array.from({ length: 12 }, (_, index) => index * 30);
  const sunburst = Array.from({ length: 24 }, (_, index) => index * 15);

  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label={label || "TIMECRAFT timepiece"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor={art.background} stopOpacity="1" />
          <stop offset="55%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={`spot-${uid}`} cx="50%" cy="32%" r="55%">
          <stop offset="0%" stopColor={art.accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={art.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="28%" stopColor={metal.mid} />
          <stop offset="55%" stopColor={metal.dark} />
          <stop offset="78%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.rim} />
        </linearGradient>
        <linearGradient id={`bezel-${uid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={metal.rim} />
          <stop offset="45%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <radialGradient id={`dial-${uid}`} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor={art.dial} />
          <stop offset="70%" stopColor={art.dial} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id={`strap-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="35%" stopColor={art.strap} />
          <stop offset="65%" stopColor={art.strap} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000" floodOpacity="0.65" />
        </filter>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id={`dialClip-${uid}`}>
          <circle cx={cx} cy={cy} r={dialRadius} />
        </clipPath>
      </defs>

      <rect width="320" height="320" fill={`url(#bg-${uid})`} />
      <circle cx={cx} cy={cy - 10} r="150" fill={`url(#spot-${uid})`} />

      {/* strap */}
      {art.strapStyle === "bracelet" ? (
        <g>
          {Array.from({ length: 7 }).map((_, index) => (
            <g key={index}>
              <rect x="126" y={index * 11 - 6} width="68" height="9" rx="2" fill={art.strap} opacity="0.92" />
              <rect x="126" y={index * 11 - 6} width="68" height="9" rx="2" fill="#000" opacity="0.28" />
              <rect x="126" y={index * 11 - 6 + 7} width="68" height="2" rx="1" fill={metal.rim} opacity="0.35" />
              <rect x="126" y={258 - index * 11} width="68" height="9" rx="2" fill={art.strap} opacity="0.92" />
              <rect x="126" y={258 - index * 11} width="68" height="9" rx="2" fill="#000" opacity="0.28" />
            </g>
          ))}
        </g>
      ) : art.strapStyle === "rubber" ? (
        <g>
          <rect x="130" y="0" width="60" height="120" fill={`url(#strap-${uid})`} />
          <rect x="130" y="200" width="60" height="120" fill={`url(#strap-${uid})`} />
          {Array.from({ length: 9 }).map((_, index) => (
            <g key={index}>
              <rect x="136" y={index * 12 + 6} width="48" height="3" rx="1.5" fill="#000" opacity="0.45" />
              <rect x="136" y={204 + index * 12} width="48" height="3" rx="1.5" fill="#000" opacity="0.45" />
            </g>
          ))}
        </g>
      ) : art.strapStyle === "chain" ? (
        <g fill="none" stroke={art.strap} strokeWidth="3">
          {Array.from({ length: 14 }).map((_, index) => (
            <g key={index}>
              <circle cx="160" cy={index * 12} r="5" />
              <circle cx="160" cy={306 - index * 12} r="5" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <path d="M128 0h64l-6 118h-52z" fill={`url(#strap-${uid})`} />
          <path d="M128 320h64l-6-118h-52z" fill={`url(#strap-${uid})`} />
          <path d="M134 6v104M186 6v104M134 314V210M186 314V210" stroke={art.accent} strokeWidth="1.2" opacity="0.5" strokeDasharray="5 6" />
        </g>
      )}

      {/* case + bezel */}
      <g filter={`url(#shadow-${uid})`}>
        <circle cx={cx} cy={cy} r={caseRadius} fill={`url(#metal-${uid})`} />
        <circle cx={cx} cy={cy} r={caseRadius - 7} fill={`url(#bezel-${uid})`} opacity="0.95" />
        <circle cx={cx} cy={cy} r={dialRadius} fill={`url(#dial-${uid})`} />
      </g>

      {/* crown */}
      <g>
        <rect x={cx + caseRadius - 4} y={cy - 9} width="12" height="18" rx="3" fill={`url(#metal-${uid})`} />
        <rect x={cx + caseRadius - 2} y={cy - 6} width="8" height="12" rx="2" fill="#000" opacity="0.25" />
      </g>

      {/* dial detailing */}
      {art.dialStyle === "sunburst" && (
        <g opacity="0.28" clipPath={`url(#dialClip-${uid})`}>
          {sunburst.map((angle) => (
            <path
              key={angle}
              d={`M ${cx} ${cy} L ${cx + 200 * Math.cos(((angle - 90) * Math.PI) / 180)} ${
                cy + 200 * Math.sin(((angle - 90) * Math.PI) / 180)
              } L ${cx + 200 * Math.cos(((angle - 90 + 7) * Math.PI) / 180)} ${
                cy + 200 * Math.sin(((angle - 90 + 7) * Math.PI) / 180)
              } Z`}
              fill="#ffffff"
            />
          ))}
        </g>
      )}

      {art.dialStyle === "diver" && (
        <g>
          <circle cx={cx} cy={cy} r={dialRadius - 4} fill="none" stroke={art.accent} strokeWidth="7" opacity="0.9" />
          <circle cx={cx} cy={cy} r={dialRadius - 4} fill="none" stroke="#000" strokeWidth="1" opacity="0.35" />
          {Array.from({ length: 24 }).map((_, index) => {
            const angle = (index * 15 * Math.PI) / 180;
            const x1 = cx + (dialRadius - 8) * Math.cos(angle - Math.PI / 2);
            const y1 = cy + (dialRadius - 8) * Math.sin(angle - Math.PI / 2);
            const x2 = cx + (dialRadius - (index % 6 === 0 ? 18 : 13)) * Math.cos(angle - Math.PI / 2);
            const y2 = cy + (dialRadius - (index % 6 === 0 ? 18 : 13)) * Math.sin(angle - Math.PI / 2);
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={index % 6 === 0 ? art.accent : "#ffffff"}
                strokeWidth={index % 6 === 0 ? 3 : 1.5}
                opacity="0.85"
              />
            );
          })}
          <path d={`M ${cx - 7} ${cy - dialRadius + 2} L ${cx + 7} ${cy - dialRadius + 2} L ${cx} ${cy - dialRadius + 15} Z`} fill={art.accent} />
        </g>
      )}

      {art.dialStyle === "skeleton" && (
        <g>
          <circle cx={cx} cy={cy} r={dialRadius - 3} fill="#0d0b08" />
          <circle cx={cx - 18} cy={cy + 20} r="26" fill="none" stroke={art.accent} strokeWidth="4" opacity="0.9" />
          <circle cx={cx - 18} cy={cy + 20} r="13" fill="none" stroke={art.accent} strokeWidth="2" opacity="0.7" />
          <circle cx={cx + 26} cy={cy - 14} r="19" fill="none" stroke={art.accent} strokeWidth="3" opacity="0.85" />
          <circle cx={cx + 26} cy={cy - 14} r="8" fill="none" stroke={art.accent} strokeWidth="2" opacity="0.7" />
          <path
            d={`M ${cx - 46} ${cy - 34} Q ${cx} ${cy - 62} ${cx + 44} ${cy - 28} L ${cx + 30} ${cy - 20} Q ${cx} ${cy - 44} ${cx - 36} ${cy - 24} Z`}
            fill={art.accent}
            opacity="0.85"
          />
          <circle cx={cx + 10} cy={cy + 40} r="12" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.4" />
        </g>
      )}

      {art.dialStyle === "digital" && (
        <g>
          <rect x={cx - 48} y={cy - 34} width="96" height="68" rx="10" fill="#050607" stroke={art.accent} strokeWidth="1.5" opacity="0.95" />
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fill={art.accent}
            fontSize="26"
            fontFamily="Inter, ui-sans-serif, sans-serif"
            fontWeight="500"
            letterSpacing="1"
          >
            10:09
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            fill="#ffffff"
            opacity="0.75"
            fontSize="11"
            fontFamily="Inter, ui-sans-serif, sans-serif"
            letterSpacing="2"
          >
            MON 20
          </text>
        </g>
      )}

      {/* hour markers */}
      {art.dialStyle !== "digital" && (
        <g>
          {markers.map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const outer = dialRadius - 10;
            const inner = dialRadius - (angle % 90 === 0 ? 24 : 18);
            return (
              <line
                key={angle}
                x1={cx + inner * Math.cos(rad)}
                y1={cy + inner * Math.sin(rad)}
                x2={cx + outer * Math.cos(rad)}
                y2={cy + outer * Math.sin(rad)}
                stroke={angle % 90 === 0 ? art.accent : "#ffffff"}
                strokeWidth={angle % 90 === 0 ? 4 : 2}
                strokeLinecap="round"
                opacity="0.95"
              />
            );
          })}
        </g>
      )}

      {/* brand mark */}
      {art.dialStyle !== "digital" && (
        <text
          x={cx}
          y={cy - 30}
          textAnchor="middle"
          fill="#ffffff"
          opacity="0.78"
          fontSize="9"
          letterSpacing="3"
          fontFamily="Cormorant Garamond, serif"
        >
          TIMECRAFT
        </text>
      )}

      {/* hands */}
      {art.dialStyle !== "digital" && (
        <g>
          <line x1={cx} y1={cy} x2={cx - 26} y2={cy - 18} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 40} stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" />
          <line x1={cx} y1={cy + 14} x2={cx + 40} y2={cy + 24} stroke={art.accent} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="4.5" fill={art.accent} />
          <circle cx={cx} cy={cy} r="1.6" fill="#000" opacity="0.6" />
        </g>
      )}

      {/* glass reflection */}
      <circle cx={cx} cy={cy} r={dialRadius} fill={`url(#glass-${uid})`} opacity="0.5" />
      <ellipse cx={cx - 26} cy={cy - 38} rx="34" ry="20" fill="#ffffff" opacity="0.07" transform={`rotate(-28 ${cx - 26} ${cy - 38})`} />

      {/* floor shadow */}
      <ellipse cx={cx} cy={cy + 118} rx="86" ry="14" fill="#000" opacity="0.5" filter={`url(#blur-${uid})`} />
    </svg>
  );
}
