'use client';
import React, { useState } from "react";
import { MapPin, ChevronDown, Plus, Navigation } from "lucide-react";
import { useLocationStore, POPULAR_INDIAN_CITIES } from "../store/locationStore";

/* ── Decorative dot-grid pattern rendered as SVG ── */
const DotGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#C05610" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

/* ── Open box illustration ── */
const BoxIllustration = () => (
  <div className="relative w-[130px] h-[110px] flex items-end justify-center">
    {/* Sparkle rays */}
    <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="60" height="24" viewBox="0 0 60 24" fill="none">
      <line x1="30" y1="2" x2="30" y2="14" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="6" x2="18" y2="15" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="48" y1="6" x2="42" y2="15" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4"  y1="14" x2="11" y2="18" stroke="#E96B16" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="56" y1="14" x2="49" y2="18" stroke="#E96B16" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>

    {/* Box SVG */}
    <svg width="110" height="94" viewBox="0 0 110 94" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 46 L14 78 Q14 84 20 84 L90 84 Q96 84 96 78 L96 46 L55 64 Z" fill="#E8A57A"/>
      <path d="M14 46 L55 64 L55 84 L20 84 Q14 84 14 78 Z" fill="#CC8858"/>
      <path d="M96 46 L55 64 L55 84 L90 84 Q96 84 96 78 Z" fill="#D4906A"/>
      <path d="M14 46 L55 30 L38 12 L-2 26 Z" fill="#F0B98E" opacity="0.75"/>
      <path d="M96 46 L55 30 L72 12 L112 26 Z" fill="#E8A57A" opacity="0.75"/>
      <path d="M14 46 L55 30 L96 46" stroke="#C87A4A" strokeWidth="1" opacity="0.3"/>
      <ellipse cx="28" cy="57" rx="6" ry="12" fill="#5FAD74" transform="rotate(-25 28 57)" opacity="0.85"/>
      <path d="M28 69 L26 52" stroke="#4A9660" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <ellipse cx="82" cy="57" rx="6" ry="12" fill="#5FAD74" transform="rotate(25 82 57)" opacity="0.85"/>
      <path d="M82 69 L84 52" stroke="#4A9660" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <circle cx="78" cy="32" r="7" fill="#E96B16"/>
      <path d="M78 39 L78 47" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="78" cy="32" r="3" fill="white" opacity="0.6"/>
    </svg>
  </div>
);

/* ── Map concentric rings ── */
const MapRings = () => (
  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 pointer-events-none">
    {[260, 190, 120, 60].map((size, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-[#E96B16]/20"
        style={{
          width: size,
          height: size,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-10 h-10 rounded-full bg-[#E96B16]/15 flex items-center justify-center ring-4 ring-[#E96B16]/10">
        <MapPin size={18} className="text-[#E96B16]" strokeWidth={2.5} />
      </div>
    </div>
  </div>
);

/* ── Floating location badge ── */
const FloatingBadge = ({
  label, sub, style
}: { label: string; sub: string; style: React.CSSProperties }) => (
  <div
    className="absolute bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.09)] px-3.5 py-2.5 flex items-center gap-2.5 pointer-events-none"
    style={style}
  >
    <div className="w-7 h-7 rounded-full bg-[#E96B16]/10 flex items-center justify-center shrink-0">
      <Navigation size={13} className="text-[#E96B16]" strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[0.75rem] font-bold text-[#35190F] leading-none">{label}</p>
      <p className="text-[0.68rem] text-[#654332] mt-0.5">{sub}</p>
    </div>
  </div>
);

interface NearYouProps {
  onCreateListing?: () => void;
  onExploreClick?: () => void;
}

/* ── Main Component ── */
const NearYou = ({ onCreateListing, onExploreClick }: NearYouProps) => {
  const { selectedLocation, setLocation } = useLocationStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-16 py-10">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[#E96B16] text-[11px] font-bold tracking-[0.22em] uppercase">
            Near You
          </span>
          <h2 className="text-[1.9rem] md:text-[2.25rem] font-extrabold text-[#35190F] leading-tight">
            Items near you
          </h2>
          <p className="text-[#654332] text-[0.9rem]">
            Approximate distances only&nbsp;&mdash;&nbsp;exact addresses stay private.
          </p>
        </div>

        {/* City picker */}
        <div className="relative shrink-0 mt-1">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow text-[0.88rem] font-semibold text-[#35190F] cursor-pointer"
          >
            <MapPin size={15} strokeWidth={2.5} className="text-[#E96B16]" />
            {selectedLocation}
            <ChevronDown
              size={15}
              strokeWidth={2.5}
              className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 max-h-64 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-1 scrollbar-thin">
              {POPULAR_INDIAN_CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setLocation(c); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-[#FFF6EF] flex items-center justify-between cursor-pointer ${c === selectedLocation ? "text-[#E96B16] bg-[#FFF6EF] font-bold" : "text-[#35190F]"}`}
                >
                  <span className="flex items-center gap-2">
                    {c === selectedLocation && <MapPin size={12} className="text-[#E96B16]" strokeWidth={2.5} />}
                    {c}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT CARD ── */}
      <div
        className="relative w-full rounded-[32px] overflow-hidden flex items-center justify-center"
        style={{
          background: "linear-gradient(145deg, #FFF4EC 0%, #FDEEDE 60%, #FDE8D0 100%)",
          minHeight: "280px",
          border: "1px solid rgba(233,107,22,0.12)",
          boxShadow: "0 4px 32px rgba(233,107,22,0.07)",
        }}
      >
        <DotGrid />
        <MapRings />

        <FloatingBadge label="2 items · 1.2 km" sub="Indiranagar" style={{ top: "22px", left: "160px", opacity: 0.5 }} />
        <FloatingBadge label="5 items · 3.4 km" sub="Koramangala" style={{ bottom: "22px", left: "140px", opacity: 0.45 }} />

        {/* Center empty state */}
        <div className="relative z-10 flex flex-col items-center gap-3 py-12 px-6">
          <BoxIllustration />
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <p className="font-extrabold text-[1.1rem] text-[#35190F]">Nothing nearby yet</p>
            <p className="text-[#654332] text-[0.88rem] text-center max-w-[220px] leading-relaxed">
              Be the first to list an item in your area.
            </p>
          </div>
          <button onClick={onCreateListing} className="mt-3 flex items-center gap-2 bg-[#E96B16] hover:bg-[#d45d0f] active:scale-95 text-white font-bold text-[0.92rem] px-7 py-3 rounded-full transition-all shadow-[0_4px_16px_rgba(233,107,22,0.35)] cursor-pointer">
            <Plus size={17} strokeWidth={2.5} />
            List an Item
          </button>
        </div>

        {/* Right handwritten text */}
        <div
          className="absolute hidden md:flex flex-col items-start"
          style={{ right: "56px", top: "50%", transform: "translateY(-50%) rotate(-4deg)" }}
        >
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "2rem",
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#C05610",
              letterSpacing: "0.01em",
            }}
          >
            Good<br />Things<br />Happen<br />Locally
          </span>
          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ marginTop: "5px" }}>
            <path d="M4 9 C 35 2, 80 2, 116 9" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M8 18 C 38 12, 82 12, 112 18" stroke="#E96B16" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Top-right decorative circle */}
        <div
          className="absolute top-0 right-0 rounded-full opacity-20"
          style={{
            width: "160px", height: "160px",
            background: "radial-gradient(circle, #E96B16 0%, transparent 70%)",
            transform: "translate(40%, -40%)",
          }}
        />
      </div>
    </div>
  );
};

export default NearYou;

