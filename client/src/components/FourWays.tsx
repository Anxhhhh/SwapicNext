'use client';
import React from 'react';
import { ArrowRightLeft, Tag, Home, ShoppingCart, ArrowRight } from 'lucide-react';

interface FourWaysProps {
  onSelectType?: (type: string) => void;
  onCreateListing?: () => void;
}

const FourWays = ({ onSelectType, onCreateListing }: FourWaysProps) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-16 py-12 relative overflow-hidden">
      
      {/* ── BACKGROUND DECORATIONS ────────────────────────────── */}
      {/* Top left striped circle */}
      <div
        className="absolute rounded-full overflow-hidden opacity-30"
        style={{
          width: '180px', height: '180px',
          top: '20px', left: '-50px',
          zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, #E96B16 0, #E96B16 1px, transparent 1px, transparent 10px)',
        }}
      />
      {/* Top right striped circle */}
      <div
        className="absolute rounded-full overflow-hidden opacity-30 hidden md:block"
        style={{
          width: '140px', height: '140px',
          top: '40px', right: '15%',
          zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, #E96B16 0, #E96B16 1px, transparent 1px, transparent 10px)',
        }}
      />

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-12">
        <div className="flex flex-col gap-2">
          <div className="text-[#E96B16] text-[12px] font-bold tracking-[0.2em] uppercase">
            TRADE YOUR WAY
          </div>
          <h2 className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#35190F] leading-tight">
            Four ways to trade
          </h2>
          <p className="text-[#654332] text-[1.1rem]">
            One product can support several of them at the same time.
          </p>
        </div>

        {/* Handwritten text */}
        <div className="hidden md:flex flex-col items-start relative mb-4 mr-4 transform rotate-[-5deg]">
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '2rem',
              lineHeight: 1.1,
              fontWeight: 700,
              color: '#35190F',
              textAlign: 'center',
              display: 'block',
              letterSpacing: '0.01em',
            }}
          >
            Same Items<br />More Possibilities
          </span>
          <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-6 left-0">
            <path d="M5 25 C 40 5, 80 5, 115 10" stroke="#E96B16" strokeWidth="3" strokeLinecap="round"/>
            <path d="M15 30 C 50 15, 90 15, 110 20" stroke="#E96B16" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* ── CARDS ────────────────────────────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* BARTER CARD */}
        <div onClick={() => onSelectType?.('Barter')} className="cursor-pointer relative bg-[#FFF9F2] border border-[#FDE5CA] rounded-[24px] p-6 flex flex-col items-start overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="w-[56px] h-[56px] bg-[#FDE5CA] rounded-2xl flex items-center justify-center text-[#C05610] mb-6">
            <ArrowRightLeft size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-[#C05610] font-extrabold text-[1.35rem] mb-2">BARTER</h3>
          <p className="text-[#654332] text-[0.95rem] leading-relaxed mb-8 relative z-10">
            Trade what you have<br />for what you need.
          </p>
          <button onClick={(e) => { e.stopPropagation(); onSelectType?.('Barter'); }} className="mt-auto bg-[#FDE5CA] text-[#C05610] px-5 py-2.5 rounded-full font-bold text-[0.9rem] flex items-center gap-2 hover:bg-[#FCD8B0] transition-colors relative z-10">
            Explore Barter <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <ArrowRightLeft className="absolute -bottom-4 -right-4 text-[#FDE5CA] opacity-50" size={120} strokeWidth={1} />
        </div>

        {/* SELL CARD */}
        <div onClick={() => onCreateListing?.()} className="cursor-pointer relative bg-[#F3FBF5] border border-[#D5EEDD] rounded-[24px] p-6 flex flex-col items-start overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="w-[56px] h-[56px] bg-[#D5EEDD] rounded-2xl flex items-center justify-center text-[#1A8744] mb-6">
            <Tag size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-[#1A8744] font-extrabold text-[1.35rem] mb-2">SELL</h3>
          <p className="text-[#654332] text-[0.95rem] leading-relaxed mb-8 relative z-10">
            Turn unused items<br />into money.
          </p>
          <button onClick={(e) => { e.stopPropagation(); onCreateListing?.(); }} className="mt-auto bg-[#D5EEDD] text-[#1A8744] px-5 py-2.5 rounded-full font-bold text-[0.9rem] flex items-center gap-2 hover:bg-[#C2E6CE] transition-colors relative z-10">
            Start Selling <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <Tag className="absolute -bottom-6 -right-6 text-[#D5EEDD] opacity-60" size={130} strokeWidth={1} />
        </div>

        {/* RENT CARD */}
        <div onClick={() => onSelectType?.('Rent')} className="cursor-pointer relative bg-[#F4F8FE] border border-[#D7E6FD] rounded-[24px] p-6 flex flex-col items-start overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="w-[56px] h-[56px] bg-[#D7E6FD] rounded-2xl flex items-center justify-center text-[#1D60C9] mb-6">
            <Home size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-[#1D60C9] font-extrabold text-[1.35rem] mb-2">RENT</h3>
          <p className="text-[#654332] text-[0.95rem] leading-relaxed mb-8 relative z-10">
            Use what you need<br />without buying it.
          </p>
          <button onClick={(e) => { e.stopPropagation(); onSelectType?.('Rent'); }} className="mt-auto bg-[#D7E6FD] text-[#1D60C9] px-5 py-2.5 rounded-full font-bold text-[0.9rem] flex items-center gap-2 hover:bg-[#C2D8FB] transition-colors relative z-10">
            Find Rentals <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <Home className="absolute -bottom-4 -right-4 text-[#D7E6FD] opacity-60" size={130} strokeWidth={1} />
        </div>

        {/* BUY CARD */}
        <div onClick={() => onSelectType?.('Sell')} className="cursor-pointer relative bg-[#FFF7F2] border border-[#FCE1CE] rounded-[24px] p-6 flex flex-col items-start overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="w-[56px] h-[56px] bg-[#FCE1CE] rounded-2xl flex items-center justify-center text-[#C65D1A] mb-6">
            <ShoppingCart size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-[#C65D1A] font-extrabold text-[1.35rem] mb-2">BUY</h3>
          <p className="text-[#654332] text-[0.95rem] leading-relaxed mb-8 relative z-10">
            Find products from<br />people near you.
          </p>
          <button onClick={(e) => { e.stopPropagation(); onSelectType?.('Sell'); }} className="mt-auto bg-[#FCE1CE] text-[#C65D1A] px-5 py-2.5 rounded-full font-bold text-[0.9rem] flex items-center gap-2 hover:bg-[#FBD1B5] transition-colors relative z-10">
            Start Shopping <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <ShoppingCart className="absolute -bottom-4 -right-4 text-[#FCE1CE] opacity-60" size={130} strokeWidth={1} />
        </div>

      </div>
    </div>
  );
};

export default FourWays;

