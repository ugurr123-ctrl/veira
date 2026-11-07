import React from 'react';

interface VeiraLogoProps {
  className?: string;
  size?: number | string;
  showFrame?: boolean; // If true, includes the deep navy squircle frame; if false, transparent emblem
  showText?: boolean;  // If true, includes "VEIRA NOCTURNAL SERENITY" signature
}

export const VeiraLogo: React.FC<VeiraLogoProps> = ({
  className = 'w-9 h-9',
  size,
  showFrame = true,
  showText = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={style}
      fill="none"
    >
      <defs>
        {/* Background Gradient (Deep Space Navy #080A16 to #10142A) */}
        <radialGradient id="veiraBgDef" cx="50%" cy="46%" r="68%">
          <stop offset="0%" stopColor="#181d3d" />
          <stop offset="45%" stopColor="#0e1228" />
          <stop offset="100%" stopColor="#080a16" />
        </radialGradient>

        {/* Celestial Gold Gradients */}
        <linearGradient id="goldMajorDef" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="25%" stopColor="#FCE69B" />
          <stop offset="55%" stopColor="#F5D061" />
          <stop offset="85%" stopColor="#D4A02A" />
          <stop offset="100%" stopColor="#9E7012" />
        </linearGradient>

        <linearGradient id="goldWingLeftDef" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="30%" stopColor="#F9DE81" />
          <stop offset="70%" stopColor="#E5B93B" />
          <stop offset="100%" stopColor="#A87714" />
        </linearGradient>

        <linearGradient id="goldWingRightDef" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F5D061" />
          <stop offset="65%" stopColor="#C7951E" />
          <stop offset="100%" stopColor="#7A5208" />
        </linearGradient>

        <linearGradient id="goldInnerFacetDef" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="50%" stopColor="#F5D061" />
          <stop offset="100%" stopColor="#B88518" />
        </linearGradient>

        {/* Violet / Aurora Core Aura Glow */}
        <radialGradient id="mysticCoreGlowDef" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5D061" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#6366F1" stopOpacity="0.30" />
          <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#080A16" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="centerDiamondGlowDef" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#FFF3D1" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#F5D061" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F5D061" stopOpacity="0" />
        </radialGradient>

        {/* Bloom & Glow Filters */}
        <filter id="celestialBloomDef" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="softShineDef" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Optional iOS Squircle Frame */}
      {showFrame && (
        <>
          <rect x="18" y="18" width="476" height="476" rx="108" fill="url(#veiraBgDef)" />
          <rect
            x="18"
            y="18"
            width="476"
            height="476"
            rx="108"
            fill="none"
            stroke="url(#goldMajorDef)"
            strokeWidth="2.5"
            strokeOpacity="0.45"
          />
          <rect
            x="25"
            y="25"
            width="462"
            height="462"
            rx="101"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
          />
        </>
      )}

      {/* Mystic Center Ambient Aura */}
      <circle cx="256" cy="245" r="215" fill="url(#mysticCoreGlowDef)" />

      {/* Sacred Geometry / Neural 432Hz Orbit Rings */}
      <circle
        cx="256"
        cy="245"
        r="176"
        fill="none"
        stroke="url(#goldMajorDef)"
        strokeWidth="1.2"
        strokeOpacity="0.25"
        strokeDasharray="4 8"
      />

      {/* Subtle Elliptic Harmonic Rings (Rotated) */}
      <ellipse
        cx="256"
        cy="245"
        rx="180"
        ry="76"
        fill="none"
        stroke="url(#goldMajorDef)"
        strokeWidth="1.5"
        strokeOpacity="0.32"
        transform="rotate(-30 256 245)"
      />
      <ellipse
        cx="256"
        cy="245"
        rx="180"
        ry="76"
        fill="none"
        stroke="url(#goldMajorDef)"
        strokeWidth="1.5"
        strokeOpacity="0.32"
        transform="rotate(30 256 245)"
      />

      {/* Inner Sacred Ring */}
      <circle
        cx="256"
        cy="245"
        r="114"
        fill="none"
        stroke="url(#goldMajorDef)"
        strokeWidth="1.8"
        strokeOpacity="0.45"
      />

      {/* Orbit Intersection Starlight Dots */}
      <circle cx="104" cy="158" r="3" fill="#FFF8E7" filter="url(#softShineDef)" />
      <circle cx="408" cy="332" r="3" fill="#FFF8E7" filter="url(#softShineDef)" />
      <circle cx="104" cy="332" r="3" fill="#F5D061" opacity="0.8" />
      <circle cx="408" cy="158" r="3" fill="#F5D061" opacity="0.8" />
      <circle cx="256" cy="69" r="4" fill="#FFFFFF" filter="url(#softShineDef)" />
      <circle cx="256" cy="421" r="3.5" fill="#F5D061" opacity="0.75" />

      {/* Central Radiance Pulse */}
      <circle cx="256" cy="245" r="70" fill="url(#centerDiamondGlowDef)" />

      {/* Diagonal Sub-Rays (8-Point Polaris Star Foundation) */}
      <g transform="rotate(45 256 245)" opacity="0.85">
        <path
          d="M256 160 L262 236 L278 245 L262 254 L256 330 L250 254 L234 245 L250 236 Z"
          fill="url(#goldMajorDef)"
        />
        <path
          d="M160 245 L236 239 L245 223 L254 239 L330 245 L254 251 L245 267 L236 251 Z"
          fill="url(#goldMajorDef)"
        />
      </g>

      {/* Horizontal Starlight Spear Ray */}
      <g filter="url(#celestialBloomDef)">
        <polygon points="106,245 256,240 256,245" fill="url(#goldWingLeftDef)" />
        <polygon points="106,245 256,250 256,245" fill="url(#goldWingRightDef)" />
        <polygon points="406,245 256,240 256,245" fill="url(#goldWingRightDef)" />
        <polygon points="406,245 256,250 256,245" fill="url(#goldWingLeftDef)" />
      </g>

      {/* Major Vertical Spear Point (Upper Needle & Lower Diamond Apex) */}
      <g filter="url(#celestialBloomDef)">
        {/* Top Needle Spear */}
        <polygon points="256,86 256,245 247,245" fill="url(#goldWingLeftDef)" />
        <polygon points="256,86 256,245 265,245" fill="url(#goldWingRightDef)" />
        {/* Bottom Anchor Spear Point */}
        <polygon points="256,404 256,245 247,245" fill="url(#goldWingRightDef)" />
        <polygon points="256,404 256,245 265,245" fill="url(#goldWingLeftDef)" />
      </g>

      {/* THE REGAL 'V' WINGS (Architectural Monogram) */}
      <g filter="url(#softShineDef)">
        {/* Left Wing Outer Bevel */}
        <polygon points="144,142 186,142 256,334 236,334" fill="url(#goldWingLeftDef)" />
        {/* Left Wing Inner Facet (Depth Shade) */}
        <polygon points="186,142 216,142 256,252 256,334" fill="url(#goldInnerFacetDef)" />

        {/* Right Wing Outer Bevel */}
        <polygon points="368,142 326,142 256,334 276,334" fill="url(#goldWingRightDef)" />
        {/* Right Wing Inner Facet */}
        <polygon points="326,142 296,142 256,252 256,334" fill="url(#goldMajorDef)" />
      </g>

      {/* Top Wing Accents & Diamond Caps */}
      <polygon
        points="144,142 165,130 186,142 165,154"
        fill="#FFF8E7"
        filter="url(#softShineDef)"
      />
      <polygon
        points="368,142 347,130 326,142 347,154"
        fill="#FFF8E7"
        filter="url(#softShineDef)"
      />

      {/* CENTRAL BRILLIANT STAR LIGHT DIAMOND */}
      <polygon points="256,218 283,245 256,272 229,245" fill="#FFF8E7" />
      <polygon
        points="256,224 277,245 256,266 235,245"
        fill="#FFFFFF"
        filter="url(#softShineDef)"
      />
      <circle cx="256" cy="245" r="5" fill="#FFFFFF" />

      {/* Ethereal Micro-Stars & Nebula Dust Particles */}
      <circle cx="164" cy="112" r="2.5" fill="#FFFFFF" opacity="0.8" filter="url(#softShineDef)" />
      <circle cx="348" cy="108" r="2.5" fill="#FCE69B" opacity="0.75" />
      <circle cx="372" cy="374" r="2.5" fill="#FFFFFF" opacity="0.8" filter="url(#softShineDef)" />
      <circle cx="140" cy="368" r="2" fill="#FCE69B" opacity="0.7" />

      {/* Brand Typography Signature */}
      {showText && (
        <g opacity="0.95">
          <text
            x="256"
            y="448"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="28"
            fontWeight="700"
            letterSpacing="9"
            fill="url(#goldMajorDef)"
          >
            VEIRA
          </text>
          <text
            x="256"
            y="468"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="3.5"
            fill="#94A3B8"
            opacity="0.8"
          >
            NOCTURNAL SERENITY
          </text>
        </g>
      )}
    </svg>
  );
};
