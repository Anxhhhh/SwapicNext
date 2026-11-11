'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, ChevronDown, Repeat, ArrowRightLeft, Home,
  ShoppingCart, Tag, Laptop, Shirt, Armchair, BookOpen, Dumbbell,
  Coffee, Sparkles, ArrowRight, SlidersHorizontal, Leaf, Check,
  Mic, Heart, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocationStore, POPULAR_INDIAN_CITIES } from '../store/locationStore';
import { useListingStore } from '../store/listingStore';

interface MobileHomeViewProps {
  onSearch?: (q: string) => void;
  onCategoryClick?: (category: string) => void;
  onSelectType?: (type: string) => void;
  onCreateListing?: () => void;
  onItemClick?: (id: string) => void;
}

export const MobileHomeView = ({
  onSearch,
  onCategoryClick,
  onSelectType,
  onCreateListing,
  onItemClick,
}: MobileHomeViewProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectedLocation, setLocation, detectCurrentLocation, isDetecting } = useLocationStore();
  const { listings, fetchListings } = useListingStore();

  const [activeMode, setActiveMode] = useState<'All' | 'Barter' | 'Rent' | 'Sell'>('All');
  const [activeCategory, setActiveCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    fetchListings({ limit: '12' });
  }, [fetchListings]);

  // Auto-rotate hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // swipe left
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else if (diff < -45) {
      // swipe right
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
    setTouchStartX(null);
  };

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore');
    }
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'For You') {
      router.push('/explore');
    } else {
      const dbCat = cat === 'Fashion' ? 'Clothing' : cat;
      if (onCategoryClick) {
        onCategoryClick(dbCat);
      } else {
        router.push(`/explore?category=${encodeURIComponent(dbCat)}`);
      }
    }
  };

  const handleModeSelect = (mode: 'All' | 'Barter' | 'Rent' | 'Sell') => {
    setActiveMode(mode);
    if (mode === 'All') {
      router.push('/explore');
    } else {
      if (onSelectType) {
        onSelectType(mode);
      } else {
        router.push(`/explore?type=${mode}`);
      }
    }
  };

  const categories = [
    { label: 'For You', icon: Sparkles },
    { label: 'Electronics', icon: Laptop },
    { label: 'Fashion', icon: Shirt },
    { label: 'Furniture', icon: Armchair },
    { label: 'Books', icon: BookOpen },
    { label: 'Sports', icon: Dumbbell },
    { label: 'Home', icon: Coffee },
  ];

  const heroSlides = [
    {
      badge: 'COMMUNITY BARTER',
      title: 'Trade What You Have',
      sub: 'Exchange pre-loved items with zero cash needed.',
      cta: 'Explore Swaps',
      bg: 'linear-gradient(135deg, #35190F 0%, #4E2514 60%, #E96B16 100%)',
      type: 'Barter',
      tag: '100% Cashless',
      handwritten: 'Same items, new homes',
    },
    {
      badge: 'AFFORDABLE RENTALS',
      title: 'Rent Cameras & Tech',
      sub: 'DSLRs, lenses & gear for short-term daily use.',
      cta: 'Browse Rentals',
      bg: 'linear-gradient(135deg, #24140D 0%, #1D3557 100%)',
      type: 'Rent',
      tag: 'From ₹199/day',
      handwritten: 'Use without buying',
    },
    {
      badge: 'SUSTAINABLE COMMUNITY',
      title: 'A Kinder Marketplace',
      sub: 'Safe local handovers with verified neighbors.',
      cta: 'Start Trading',
      bg: 'linear-gradient(135deg, #1E1F1A 0%, #2A4736 100%)',
      type: 'Sell',
      tag: 'Verified Members',
      handwritten: 'People • Planet • Community',
    },
  ];

  // Fallback curated listings if API hasn't loaded items yet
  const displayItems = listings.length > 0 ? listings : [
    {
      _id: 'demo-1',
      title: 'Canon AE-1 Program 35mm Film Camera',
      price: 28000,
      rentPerDay: 500,
      type: 'Sell',
      condition: 'Like New',
      location: 'Bengaluru',
      images: ['/images/campic1.jpg'],
    },
    {
      _id: 'demo-2',
      title: 'Apple MacBook Air M2 (16GB, 512GB)',
      price: 85000,
      rentPerDay: 800,
      type: 'Barter',
      condition: 'Like New',
      location: 'Bengaluru',
      images: ['/images/macbook.jpg'],
    },
    {
      _id: 'demo-3',
      title: 'Mid-Century Modern Lounge Sofa',
      price: 18500,
      rentPerDay: 350,
      type: 'Sell',
      condition: 'Good',
      location: 'Bengaluru',
      images: ['/images/sofa.jpg'],
    },
    {
      _id: 'demo-4',
      title: 'Trek Mountain Bicycle 21-Speed',
      price: 14000,
      rentPerDay: 200,
      type: 'Rent',
      condition: 'Good',
      location: 'Bengaluru',
      images: ['/images/cycle.jpg'],
    },
  ];

  return (
    <div className="w-full pb-20 bg-[#FAF7F2] overflow-x-hidden text-[#35190F]">
      {/* ── 1. TOP APP HEADER BAR (Swapic warm aesthetic) ── */}
      <div className="w-full bg-[#FAF7F2] pt-3 pb-3 px-3.5 border-b border-[#ede8e1]">
        
        {/* MODE SWITCHER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-hide">
          <button
            onClick={() => handleModeSelect('All')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold shrink-0 shadow-xs transition-all cursor-pointer ${
              activeMode === 'All'
                ? 'bg-[#E96B16] text-white shadow-sm'
                : 'bg-white text-[#654332] border border-[#ede8e1] hover:border-[#E96B16]'
            }`}
          >
            <div className={`p-0.5 rounded-sm ${activeMode === 'All' ? 'bg-white/20 text-white' : 'bg-[#35190F] text-white'}`}>
              <Repeat size={10} className="stroke-[3]" />
            </div>
            <span>Swapic</span>
          </button>

          <button
            onClick={() => handleModeSelect('Barter')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all cursor-pointer ${
              activeMode === 'Barter'
                ? 'bg-[#E96B16] text-white shadow-sm font-bold'
                : 'bg-white text-[#654332] border border-[#ede8e1] hover:border-[#E96B16]'
            }`}
          >
            <ArrowRightLeft size={12} className={activeMode === 'Barter' ? 'text-white' : 'text-[#E96B16]'} strokeWidth={2.5} />
            <span>Barter Hub</span>
          </button>

          <button
            onClick={() => handleModeSelect('Rent')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all cursor-pointer ${
              activeMode === 'Rent'
                ? 'bg-[#E96B16] text-white shadow-sm font-bold'
                : 'bg-white text-[#654332] border border-[#ede8e1] hover:border-[#E96B16]'
            }`}
          >
            <Home size={12} className={activeMode === 'Rent' ? 'text-white' : 'text-[#1D60C9]'} strokeWidth={2.5} />
            <span>Rentals</span>
          </button>

          <button
            onClick={() => handleModeSelect('Sell')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all cursor-pointer ${
              activeMode === 'Sell'
                ? 'bg-[#E96B16] text-white shadow-sm font-bold'
                : 'bg-white text-[#654332] border border-[#ede8e1] hover:border-[#E96B16]'
            }`}
          >
            <Tag size={12} className={activeMode === 'Sell' ? 'text-white' : 'text-[#1A8744]'} strokeWidth={2.5} />
            <span>Buy & Sell</span>
          </button>
        </div>

        {/* LOCATION & COMMUNITY KARMA BAR */}
        <div className="flex items-center justify-between py-1 mb-2.5">
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-left cursor-pointer group"
          >
            <div className="bg-[#FFF4EC] p-1 rounded-full text-[#E96B16] border border-[#E96B16]/20">
              <MapPin size={13} />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[12px] tracking-wider text-[#35190F] uppercase">LOCATION</span>
              <span className="text-[12px] font-medium text-[#654332] truncate max-w-[170px]">
                {selectedLocation}
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-[#E96B16] transition-colors" />
            </div>
          </button>

          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#ede8e1] shadow-xs">
            <span className="text-[11px]">🪙</span>
            <span className="text-[11.5px] font-bold text-[#E96B16]">250 pts</span>
          </div>
        </div>

        {/* POLISHED SEARCH BAR */}
        <div className="w-full bg-white rounded-2xl border border-[#ddd5c8] shadow-xs flex items-center px-3.5 py-2.5 gap-2.5 focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search 'Camera', 'MacBook', 'Sofa'..."
            className="w-full bg-transparent border-none outline-none text-[13.5px] text-[#35190F] placeholder:text-gray-400 font-medium"
          />
          <div className="flex items-center gap-1 shrink-0 text-gray-400">
            <button
              onClick={() => router.push('/explore')}
              title="Voice Search"
              className="p-1 rounded-lg hover:text-[#E96B16] transition-colors cursor-pointer"
            >
              <Mic size={17} />
            </button>
            <button
              onClick={handleSearchSubmit}
              title="Filters"
              className="p-1 rounded-lg hover:text-[#E96B16] transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* 2. HORIZONTAL CATEGORY ICON STRIP */}
        <div className="flex items-center gap-4 overflow-x-auto pt-3.5 pb-1 scrollbar-hide">
          {categories.map(({ label, icon: Icon }) => {
            const isSelected = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => handleCategorySelect(label)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#E96B16] text-white shadow-sm scale-105'
                      : 'bg-white text-[#654332] border border-[#ede8e1] hover:border-[#E96B16]'
                  }`}
                >
                  <Icon size={20} className={isSelected ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                </div>
                <span
                  className={`text-[11px] font-semibold transition-colors ${
                    isSelected ? 'text-[#E96B16] font-bold' : 'text-[#654332]'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. HERO PROMO BANNER CAROUSEL ── */}
      <div className="px-3.5 pt-4">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full rounded-2xl p-5 text-white shadow-md relative overflow-hidden transition-all duration-500 select-none"
          style={{ background: heroSlides[currentSlide].bg }}
        >
          {/* Subtle watermark / sparkle decoration */}
          <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
            <Sparkles size={70} />
          </div>

          <div className="relative z-10 flex flex-col items-start max-w-[75%]">
            <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-2">
              {heroSlides[currentSlide].badge}
            </span>
            <h3 className="text-[1.35rem] font-extrabold leading-tight mb-1 text-white">
              {heroSlides[currentSlide].title}
            </h3>
            <p className="text-[12px] text-white/90 leading-snug mb-3">
              {heroSlides[currentSlide].sub}
            </p>
            <button
              onClick={() => handleModeSelect(heroSlides[currentSlide].type as any)}
              className="bg-[#E96B16] hover:bg-[#d45d0f] text-white font-bold text-[12px] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right badge decoration */}
          <div className="absolute right-3 bottom-3 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-semibold text-white/90">
            {heroSlides[currentSlide].tag}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide ? 'w-5 bg-[#E96B16]' : 'w-1.5 bg-[#ddd5c8]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── 4. "STILL LOOKING FOR THESE? / CURATED FOR YOU" CARD SHELF ── */}
      <div className="mt-4 px-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#ede8e1] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-[15px] font-extrabold text-[#35190F] leading-tight">
                {user?.name ? `${user.name.split(' ')[0]}, still looking for these?` : 'Still looking for these?'}
              </h4>
              <p className="text-[11.5px] text-[#8c6e5d] mt-0.5">Handpicked for your neighborhood</p>
            </div>
            <button
              onClick={() => router.push('/explore')}
              className="text-[11.5px] font-bold text-[#E96B16] bg-[#FFF4EC] hover:bg-[#FFE8D6] px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          {/* Horizontal Product Card Deck */}
          <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {displayItems.map((item: any) => {
              const image = item.images?.[0] || '/images/campic1.jpg';
              return (
                <div
                  key={item._id}
                  onClick={() => (onItemClick ? onItemClick(item._id) : router.push(`/item/${item._id}`))}
                  className="w-[145px] shrink-0 bg-[#FAF7F2] rounded-xl p-2.5 border border-[#ede8e1] flex flex-col justify-between shadow-xs cursor-pointer group active:scale-95 transition-all"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                    <img
                      src={image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&fit=crop';
                      }}
                    />
                    <span className="absolute top-1 left-1 bg-white/90 backdrop-blur-xs text-[#35190F] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-[11.5px] font-bold text-[#35190F] line-clamp-1 mb-1 leading-snug">
                    {item.title}
                  </p>

                  <div className="mt-auto">
                    <div className="font-extrabold text-[12px] text-[#35190F] mb-1.5">
                      {item.type === 'Barter' ? (
                        <span className="text-[#1A8744] font-bold text-[11px]">Open to Swap</span>
                      ) : item.type === 'Rent' ? (
                        `₹${(item.rentPerDay || 0).toLocaleString('en-IN')}/day`
                      ) : (
                        `₹${(item.price || 0).toLocaleString('en-IN')}`
                      )}
                    </div>
                    <button className="w-full bg-white hover:bg-[#FFF4EC] text-[#E96B16] text-[10.5px] font-bold py-1 rounded-lg border border-[#ede8e1] transition-colors cursor-pointer">
                      View Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. FOUR WAYS TO TRANSACT (2x2 Grid with Swapic signature pastel tones) ── */}
      <div className="mt-5 px-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[14px] font-extrabold text-[#35190F]">Four Ways to Trade</h4>
          <span className="text-[11px] font-semibold text-[#8c6e5d]">One product • More options</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Barter */}
          <div
            onClick={() => handleModeSelect('Barter')}
            className="bg-[#FFF9F2] border border-[#FDE5CA] rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FDE5CA] text-[#C05610] flex items-center justify-center mb-2">
              <ArrowRightLeft size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h5 className="font-extrabold text-[13px] text-[#C05610]">BARTER</h5>
              <p className="text-[11px] text-[#654332] leading-tight mt-0.5">Zero money. Trade items you already have.</p>
            </div>
          </div>

          {/* Rent */}
          <div
            onClick={() => handleModeSelect('Rent')}
            className="bg-[#F4F8FE] border border-[#D7E6FD] rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-[#D7E6FD] text-[#1D60C9] flex items-center justify-center mb-2">
              <Home size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h5 className="font-extrabold text-[13px] text-[#1D60C9]">RENT</h5>
              <p className="text-[11px] text-[#654332] leading-tight mt-0.5">Use cameras, tech & gear without buying.</p>
            </div>
          </div>

          {/* Sell */}
          <div
            onClick={() => (onCreateListing ? onCreateListing() : router.push('/create'))}
            className="bg-[#F3FBF5] border border-[#D5EEDD] rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-[#D5EEDD] text-[#1A8744] flex items-center justify-center mb-2">
              <Tag size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h5 className="font-extrabold text-[13px] text-[#1A8744]">SELL</h5>
              <p className="text-[11px] text-[#654332] leading-tight mt-0.5">Turn pre-loved items into cash quickly.</p>
            </div>
          </div>

          {/* Buy */}
          <div
            onClick={() => handleModeSelect('Sell')}
            className="bg-[#FFF7F2] border border-[#FCE1CE] rounded-2xl p-3 flex flex-col justify-between shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FCE1CE] text-[#C65D1A] flex items-center justify-center mb-2">
              <ShoppingCart size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h5 className="font-extrabold text-[13px] text-[#C65D1A]">BUY</h5>
              <p className="text-[11px] text-[#654332] leading-tight mt-0.5">Verified listings from people near you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. SLIM SUSTAINABILITY PROMO BANNER ── */}
      <div className="mt-4 px-3.5">
        <div className="w-full bg-[#35190F] rounded-2xl p-3.5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#5FAD74]/20 flex items-center justify-center text-[#5FAD74]">
              <Leaf size={18} />
            </div>
            <div>
              <p className="font-extrabold text-[12.5px] leading-tight text-white">A Kinder Marketplace</p>
              <p className="text-[10.5px] text-[#D6C8BC]">Give items new life & strengthen community</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="bg-[#E96B16] hover:bg-[#d45d0f] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer"
          >
            Explore
          </button>
        </div>
      </div>

      {/* ── 7. NEARBY LISTINGS PREVIEW CARD ── */}
      <div className="mt-4 px-3.5 mb-5">
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF4EC] flex items-center justify-center text-[#E96B16]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="font-extrabold text-[13px] text-[#35190F]">Items near {selectedLocation}</p>
              <p className="text-[11px] text-gray-500">Discover handovers within 5 km of your place</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="text-[#E96B16] font-bold text-[12px] flex items-center gap-1 cursor-pointer hover:underline"
          >
            View <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── 8. 2-COLUMN DISCOVERY FEED (High-converting mobile browsing) ── */}
      <div className="px-3.5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-[#FFF4EC] text-[#E96B16]">
              <TrendingUp size={15} />
            </div>
            <h4 className="text-[14px] font-extrabold text-[#35190F]">
              Trending in {selectedLocation}
            </h4>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="text-[11.5px] font-bold text-[#E96B16] flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            See all <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {displayItems.map((item: any) => {
            const image = item.images?.[0] || '/images/campic1.jpg';
            const isBarter = item.type === 'Barter';
            const isRent = item.type === 'Rent';

            return (
              <div
                key={`grid-${item._id}`}
                onClick={() => (onItemClick ? onItemClick(item._id) : router.push(`/item/${item._id}`))}
                className="bg-white rounded-2xl p-2.5 border border-[#ede8e1] shadow-xs flex flex-col justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div>
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-2 relative">
                    <img
                      src={image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&fit=crop';
                      }}
                    />
                    <span
                      className={`absolute top-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs ${
                        isBarter
                          ? 'bg-[#EBF7EE] text-[#1A8744]'
                          : isRent
                          ? 'bg-[#EBF2FD] text-[#1D60C9]'
                          : 'bg-[#FFF4EC] text-[#E96B16]'
                      }`}
                    >
                      {item.type}
                    </span>
                    {item.condition && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-semibold px-1.5 py-0.5 rounded">
                        {item.condition}
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-[12px] text-[#35190F] line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h5>
                </div>

                <div className="mt-2 pt-2 border-t border-[#ede8e1]">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-extrabold text-[13px] text-[#35190F]">
                      {isBarter ? (
                        <span className="text-[#1A8744] text-[11.5px] font-bold">Open to Swap</span>
                      ) : isRent ? (
                        `₹${(item.rentPerDay || 0).toLocaleString('en-IN')}/day`
                      ) : (
                        `₹${(item.price || 0).toLocaleString('en-IN')}`
                      )}
                    </span>
                    {item.location && (
                      <span className="text-[10px] text-gray-400 truncate max-w-[60px]">
                        {item.location}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onItemClick) {
                        onItemClick(item._id);
                      } else {
                        router.push(`/item/${item._id}`);
                      }
                    }}
                    className="w-full bg-[#FAF7F2] hover:bg-[#FFF4EC] text-[#E96B16] text-[11px] font-bold py-1.5 rounded-xl border border-[#ede8e1] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{isBarter ? 'Make Offer' : isRent ? 'Rent Now' : 'Buy Now'}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LOCATION SELECTOR MODAL ── */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede8e1] mb-3">
              <h3 className="font-extrabold text-[16px] text-[#35190F]">Select Your City</h3>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="text-gray-400 hover:text-[#35190F] font-bold text-[16px] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* GPS Detect */}
            <button
              disabled={isDetecting}
              onClick={async () => {
                const detected = await detectCurrentLocation();
                if (detected) setLocationModalOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FFF4EC] text-[#E96B16] font-bold text-[13px] py-2.5 rounded-xl mb-3 cursor-pointer disabled:opacity-50"
            >
              <MapPin size={15} />
              <span>{isDetecting ? 'Detecting GPS...' : 'Use current location'}</span>
            </button>

            {/* City list */}
            <div className="space-y-1">
              {POPULAR_INDIAN_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setLocation(city);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] flex items-center justify-between transition-colors cursor-pointer ${
                    city === selectedLocation
                      ? 'bg-[#FFF4EC] text-[#E96B16] font-bold'
                      : 'text-[#35190F] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{city}</span>
                  {city === selectedLocation && <Check size={16} className="text-[#E96B16]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHomeView;
