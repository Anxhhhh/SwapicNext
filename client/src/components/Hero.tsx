'use client';
import React, { useState } from 'react';
import { Search, ArrowRight, Armchair, Laptop, Shirt, BookOpen, Dumbbell, Coffee, Leaf, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
  onSearch?: (q: string) => void;
  onCategoryClick?: (cat: string) => void;
}

const Hero = ({ onSearch, onCategoryClick }: HeroProps) => {
  const [query, setQuery] = useState('');
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-4 lg:py-8 flex flex-col gap-6 overflow-hidden">

      {/* ── TWO COLUMN ROW ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
      
      {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
      <div className="w-full lg:w-[52%] flex flex-col items-start z-10 order-1 lg:order-1">
        
        {/* Eyebrow */}
        <div className="bg-[#F7E4D1]/50 border border-[#E96B16]/20 text-[#E96B16] px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] mb-7 uppercase">
          BUY &middot; SELL &middot; RENT &middot; BARTER
        </div>

        {/* Headline */}
        <h1 className="text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] font-extrabold leading-[1.0] tracking-tight mb-6">
          <span className="block text-[#35190F]">More Possibilities.</span>
          <span className="block text-[#E96B16]">A Kinder Marketplace.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#654332] text-[1.05rem] sm:text-[1.125rem] mb-9 max-w-[520px] leading-[1.6]">
          One platform. Four ways to get what you need.<br />
          Trade what you have, get what you need &mdash; no money, just community.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[540px] bg-white flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.05)] border border-gray-100/80 mb-10 overflow-hidden">
          <div className="flex items-center flex-1 pl-5 pr-3 py-3.5 sm:py-0 sm:h-[58px]">
            <Search className="text-gray-400 mr-3 shrink-0" size={20} />
            <input 
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSearch?.(query)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent border-none outline-none text-[#35190F] placeholder:text-gray-400 text-[1rem]"
            />
          </div>
          <button
            onClick={() => onSearch?.(query)}
            className="bg-[#E96B16] hover:bg-[#d45d0f] text-white px-7 py-3.5 sm:py-0 sm:h-[58px] sm:rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-[0_4px_20px_rgba(233,107,22,0.5)] hover:scale-105 active:scale-95 shrink-0 text-[0.95rem] sm:m-1"
          >
            Search
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Categories */}
        <div className="w-full flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-hide mb-7">
          <CategoryItem onClick={() => onCategoryClick?.("Furniture")} icon={<Armchair size={22} strokeWidth={1.5} />} label="Furniture" />
          <CategoryItem onClick={() => onCategoryClick?.("Electronics")} icon={<Laptop size={22} strokeWidth={1.5} />} label="Electronics" />
          <CategoryItem onClick={() => onCategoryClick?.("Clothing")} icon={<Shirt size={22} strokeWidth={1.5} />} label="Fashion" />
          <CategoryItem onClick={() => onCategoryClick?.("Books")} icon={<BookOpen size={22} strokeWidth={1.5} />} label="Books" />
          <CategoryItem onClick={() => onCategoryClick?.("Sports")} icon={<Dumbbell size={22} strokeWidth={1.5} />} label="Sports" />
          <CategoryItem onClick={() => onCategoryClick?.("Home & Living")} icon={<Coffee size={22} strokeWidth={1.5} />} label="Home & Living" />
        </div>

        {/* Trust Signals */}
        <div className="flex items-center gap-4 text-[0.82rem] text-[#654332] font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#2E8B57]" />
            <span>Verified members</span>
          </div>
          <div className="w-px h-3.5 bg-[#D6BAA8]"></div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-[#E96B16]" />
            <span>Community-first trading</span>
          </div>
        </div>

      </div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] order-2 lg:order-2 relative flex justify-center lg:justify-end items-center mt-10 lg:mt-0"
           style={{ minHeight: '560px', paddingBottom: '50px' }}>

        {/* ── Decorative: Striped circle top-left */}
        <div
          className="absolute rounded-full overflow-hidden opacity-60"
          style={{
            width: '120px', height: '120px',
            top: '-14px', left: '0px',
            zIndex: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, #EDD9C3 0, #EDD9C3 1.5px, transparent 1.5px, transparent 9px)',
          }}
        />

        {/* ── Decorative: Pale warm rounded rectangle behind image */}
        <div
          className="absolute rounded-[40px] opacity-70"
          style={{
            width: '90%', height: '78%',
            top: '10%', right: '-4%',
            background: '#F2E1CE',
            zIndex: 0,
          }}
        />

        {/* ── Decorative: Striped circle bottom-right */}
        <div
          className="absolute rounded-full overflow-hidden opacity-50"
          style={{
            width: '80px', height: '80px',
            bottom: '16px', right: '2%',
            zIndex: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, #EDD9C3 0, #EDD9C3 1.5px, transparent 1.5px, transparent 9px)',
          }}
        />

        {/* ── MAIN IMAGE CARD ─────────────────────────────────── */}
        <div
          className="relative overflow-hidden shadow-[0_24px_60px_rgba(60,30,10,0.18)]"
          style={{
            width: '88%',
            maxWidth: '440px',
            aspectRatio: '4 / 4.1',
            borderRadius: '42px',
            transform: 'rotate(-3deg)',
            transformOrigin: 'center center',
            zIndex: 10,
            marginRight: '2%',
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          {/* The Camera Photograph */}
          <img
            src="/images/campic1.jpg"
            alt="Vintage Canon AE-1 camera on wooden table"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 50%' }}
          />

          {/* Warm orange overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(120,60,20,0.10) 0%, rgba(180,90,30,0.05) 50%, rgba(80,40,10,0.15) 100%)',
            }}
          />

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(20,8,2,0.20) 100%)',
            }}
          />

          {/* ── Orange sparkle accent above camera ─────────────── */}
          <svg
            className="absolute"
            style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', width: '52px', height: '48px', zIndex: 15 }}
            viewBox="0 0 52 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="26" y1="8" x2="26" y2="20" stroke="#E96B16" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="18" y1="13" x2="22" y2="20" stroke="#E96B16" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="34" y1="13" x2="30" y2="20" stroke="#E96B16" strokeWidth="2.8" strokeLinecap="round"/>
          </svg>

          {/* ── Handwritten text: upper-right ─────────────────── */}
          <div
            className="absolute flex flex-col items-start"
            style={{
              top: '7%',
              right: '7%',
              zIndex: 15,
              transform: 'rotate(10deg)',
              transformOrigin: 'top right',
            }}
          >
            <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '2.15rem',
                lineHeight: 1.05,
                fontWeight: 700,
                color: '#FFFFFF',
                textAlign: 'right',
                display: 'block',
                letterSpacing: '0.01em',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))',
              }}
            >
              Good<br />Things<br />Find<br />New Homes
            </span>

            {/* Hand-drawn orange double-swoosh underline */}
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', marginLeft: '2px' }}>
              <path d="M4 12 C 22 5, 50 3, 86 11" stroke="#E96B16" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 22 C 28 17, 56 15, 80 21" stroke="#E96B16" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

        </div>{/* end image card */}

        {/* ── PRODUCT PRICE CARD ─────────────────────────────── */}
        <div
          className="absolute bg-white"
          style={{
            borderRadius: '26px',
            padding: '18px 22px',
            width: '260px',
            left: '0px',
            bottom: '44px',
            zIndex: 30,
            boxShadow: '0 16px 50px rgba(40,15,5,0.13)',
          }}
        >
          <p style={{ fontWeight: 800, fontSize: '1rem', color: '#35190F', marginBottom: '12px' }}>Canon AE-1</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {/* Buy row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2E8B57' }}>Buy</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2E8B57' }}>₹28,000</span>
            </div>
            {/* Rent row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1769AA' }}>Rent</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1769AA' }}>₹500/day</span>
            </div>
            {/* Barter row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#E96B16' }}>Barter</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#E96B16' }}>Open to swap</span>
            </div>
          </div>
        </div>

        {/* ── CURVED ARROW ───────────────────────────────────── */}
        <svg
          style={{
            position: 'absolute',
            bottom: '86px',
            left: '255px',
            width: '70px',
            height: '64px',
            zIndex: 30,
          }}
          viewBox="0 0 70 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 60 10 C 58 38, 32 52, 10 42" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M 20 33 L 10 42 L 18 50" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* ── SUSTAINABILITY CARD ─────────────────────────────── */}
        <div
          className="absolute bg-white flex items-center gap-3"
          style={{
            borderRadius: '18px',
            padding: '10px 14px',
            width: '210px',
            right: '0px',
            bottom: '10px',
            zIndex: 30,
            boxShadow: '0 12px 36px rgba(40,15,5,0.10)',
          }}
        >
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '50%',
            background: '#EAF5EC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Leaf size={16} strokeWidth={2} color="#2E8B57" />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#35190F', lineHeight: 1.35 }}>
            Same item.<br />More ways to own.
          </span>
        </div>

      </div>{/* end right column */}

      </div>{/* end two column row */}

      {/* ── STATS STRIP ─────────────────────────────────────────── */}
      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 px-8 py-5 flex flex-wrap lg:flex-nowrap justify-between items-center gap-y-4 gap-x-4">

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-[1.5rem] text-[#35190F] leading-none">10K+</span>
          <span className="text-[#654332] text-sm font-medium">Active Members</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-[1.5rem] text-[#E96B16] leading-none">25K+</span>
          <span className="text-[#654332] text-sm font-medium">Items Listed</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-[1.15rem] text-[#35190F]">4 Ways</span>
          <span className="text-[#654332] text-sm font-medium">Buy, Sell, Rent, Barter</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-[1.15rem] text-[#35190F]">Safe &amp; Trusted</span>
          <span className="text-[#654332] text-sm font-medium">Verified Community</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-[1.15rem] text-[#35190F]">Sustainable</span>
          <span className="text-[#654332] text-sm font-medium">Give items a new life</span>
        </div>

      </div>{/* end stats strip */}

    </div>
  );
};

const CategoryItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
      <div className="w-[58px] h-[58px] bg-[#F7E4D1]/50 rounded-xl flex justify-center items-center text-[#E96B16] group-hover:bg-[#F7E4D1] transition-all">
        {icon}
      </div>
      <span className="text-[12px] font-medium text-[#654332] group-hover:text-[#35190F] transition-colors">
        {label}
      </span>
    </div>
  );
};

export default Hero;

