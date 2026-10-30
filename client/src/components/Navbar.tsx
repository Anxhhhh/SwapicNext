'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Repeat, Search, SlidersHorizontal, MapPin, ChevronDown,
  User, Plus, LogOut, Navigation, Check, Loader2, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocationStore, POPULAR_INDIAN_CITIES } from '../store/locationStore';

interface NavbarProps {
  onExploreClick?: () => void;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  activeNav?: string;
  onSearch?: (q: string) => void;
  onCreateListing?: () => void;
}

const NavbarContent = ({
  onExploreClick,
  onLoginClick,
  onProfileClick,
  onHomeClick,
  activeNav: propActiveNav,
  onSearch,
  onCreateListing,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const [navSearch, setNavSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Location dropdown state
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    selectedLocation,
    setLocation,
    detectCurrentLocation,
    isDetecting,
    detectError,
  } = useLocationStore();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else if (window.scrollY < 10) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    if (locationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationOpen]);

  // Determine active navigation item
  const resolvedActive =
    propActiveNav ||
    (pathname === '/'
      ? 'Home'
      : pathname.startsWith('/explore')
      ? 'Explore'
      : pathname.startsWith('/profile')
      ? 'Profile'
      : '');

  const activeClass =
    'text-[#35190F] font-semibold relative after:absolute after:-bottom-[20px] after:left-0 after:w-full after:h-[2px] after:bg-[#E96B16] transition-colors duration-200 cursor-pointer';
  const inactiveClass =
    'relative hover:text-[#E96B16] transition-colors duration-200 after:absolute after:-bottom-[20px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E96B16] after:transition-all after:duration-300 hover:after:w-full cursor-pointer';

  // Navigation handlers
  const handleGoHome = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    } else {
      router.push('/');
    }
  };

  const handleGoExplore = (e?: React.MouseEvent, type?: string) => {
    e?.preventDefault();
    if (onExploreClick && !type) {
      onExploreClick();
    } else {
      router.push(type ? `/explore?type=${type}` : '/explore');
    }
  };

  const handleGoHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#how-it-works');
    }
  };

  const handleGoLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  const handleGoProfile = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/profile');
    }
  };

  const handleGoCreate = () => {
    if (onCreateListing) {
      onCreateListing();
    } else {
      if (!isAuthenticated) {
        router.push('/login?redirect=/create');
      } else {
        router.push('/create');
      }
    }
  };

  const handleSearchSubmit = () => {
    const q = navSearch.trim();
    if (onSearch) {
      onSearch(q);
      onExploreClick?.();
    } else {
      router.push(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
    }
  };

  // Filter cities based on search
  const filteredCities = POPULAR_INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(locationSearch.toLowerCase().trim())
  );

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'pt-3 px-4' : 'pt-6 px-4'
      }`}
    >
      {/* Navbar Container */}
      <nav
        className={`flex items-center justify-between bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] mx-auto transition-all duration-300 ${
          isScrolled ? 'px-5 py-2 max-w-[1200px]' : 'px-6 py-3.5 max-w-[1400px]'
        }`}
      >
        {/* Left Section: Logo */}
        <div
          className="flex items-center gap-2.5 pr-4 shrink-0 cursor-pointer group"
          onClick={handleGoHome}
        >
          <div className="bg-[#35190F] p-1.5 rounded-lg text-white group-hover:bg-[#E96B16] transition-colors duration-300">
            <Repeat size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-[1.15rem] text-[#35190F] tracking-wide group-hover:text-[#E96B16] transition-colors duration-300">
            SWAPIC
          </span>
        </div>

        {/* Center Section: Search */}
        <div
          className={`flex-1 hidden lg:flex items-center bg-[#f4f0ec] rounded-full mx-4 transition-all focus-within:ring-2 focus-within:ring-[#E96B16]/20 hover:bg-[#ede8e0] ${
            isScrolled ? 'px-4 py-2 max-w-[400px]' : 'px-4 py-2.5 max-w-[500px]'
          }`}
        >
          <Search size={18} className="text-gray-500 mr-2.5 shrink-0" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
            placeholder="Search products, categories, or what you need..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#35190F] placeholder:text-gray-500 w-full"
          />
          <SlidersHorizontal
            size={18}
            onClick={handleSearchSubmit}
            className="text-gray-500 ml-2.5 shrink-0 cursor-pointer hover:text-[#E96B16] transition-colors"
          />
        </div>

        {/* Right Section: Navigation & Actions */}
        <div className="flex items-center gap-5 sm:gap-7 pl-2 text-[15px] font-medium text-[#654332] shrink-0">
          {/* Main Links */}
          <div className="hidden xl:flex items-center gap-7">
            <button
              onClick={handleGoHome}
              className={resolvedActive === 'Home' ? activeClass : inactiveClass}
            >
              Home
            </button>
            <button
              onClick={(e) => handleGoExplore(e)}
              className={resolvedActive === 'Explore' ? activeClass : inactiveClass}
            >
              Explore
            </button>
            <button
              onClick={(e) => handleGoExplore(e, 'Barter')}
              className={inactiveClass}
            >
              Barter
            </button>
            <button
              onClick={(e) => handleGoExplore(e, 'Rent')}
              className={inactiveClass}
            >
              Rent
            </button>
            <button onClick={handleGoHowItWorks} className={inactiveClass}>
              How It Works
            </button>
          </div>

          {/* Location Picker */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((o) => !o)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 group text-[14px] font-semibold text-[#35190F] bg-[#FAF7F2] hover:bg-[#FFF4EC] px-3.5 py-1.5 rounded-full border border-[#ede8e1]"
            >
              <MapPin size={16} className="text-[#E96B16] shrink-0" />
              <span className="max-w-[110px] truncate">{selectedLocation}</span>
              <ChevronDown
                size={15}
                className={`text-gray-400 group-hover:text-[#E96B16] transition-transform duration-200 ${
                  locationOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Location Dropdown Modal */}
            {locationOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white border border-[#ede8e1] rounded-2xl shadow-2xl z-50 overflow-hidden py-2 text-[#35190F] animate-in fade-in zoom-in-95 duration-150">
                {/* Search / Filter City */}
                <div className="px-3 pb-2 pt-1">
                  <div className="flex items-center bg-[#FAF7F2] border border-[#ede8e1] rounded-xl px-2.5 py-1.5 gap-2 focus-within:border-[#E96B16] focus-within:bg-white transition-all">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Type any city or town..."
                      className="w-full bg-transparent border-none outline-none text-[13px] text-[#35190F] placeholder:text-gray-400"
                    />
                    {locationSearch && (
                      <button
                        onClick={() => setLocationSearch('')}
                        className="text-gray-400 hover:text-[#35190F]"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Detect Location Button */}
                <div className="px-3 pb-2 border-b border-[#ede8e1]">
                  <button
                    disabled={isDetecting}
                    onClick={async () => {
                      const detected = await detectCurrentLocation();
                      if (detected) setLocationOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#FFF4EC] text-[#E96B16] hover:bg-[#FFE8D6] font-semibold text-[13px] py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDetecting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Detecting location...</span>
                      </>
                    ) : (
                      <>
                        <Navigation size={14} className="fill-[#E96B16]" />
                        <span>Use current location</span>
                      </>
                    )}
                  </button>
                  {detectError && (
                    <p className="text-[11px] text-red-500 mt-1.5 px-1 leading-tight">
                      {detectError}
                    </p>
                  )}
                </div>

                {/* City List */}
                <div className="max-h-56 overflow-y-auto px-1 py-1 scrollbar-thin">
                  {/* If user typed a city not in list, offer it directly */}
                  {locationSearch.trim() &&
                    !filteredCities.some(
                      (c) => c.toLowerCase() === locationSearch.trim().toLowerCase()
                    ) && (
                      <button
                        onClick={() => {
                          setLocation(locationSearch.trim());
                          setLocationOpen(false);
                          setLocationSearch('');
                        }}
                        className="w-full text-left px-3.5 py-2 text-[13px] font-semibold text-[#E96B16] hover:bg-[#FFF4EC] rounded-lg flex items-center justify-between transition-colors"
                      >
                        <span>Select "{locationSearch.trim()}"</span>
                        <Check size={14} />
                      </button>
                    )}

                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        setLocationOpen(false);
                        setLocationSearch('');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[13px] font-medium rounded-lg flex items-center justify-between transition-colors ${
                        city === selectedLocation
                          ? 'bg-[#FFF4EC] text-[#E96B16] font-bold'
                          : 'text-[#35190F] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin
                          size={13}
                          className={
                            city === selectedLocation ? 'text-[#E96B16]' : 'text-gray-400'
                          }
                        />
                        {city}
                      </span>
                      {city === selectedLocation && (
                        <Check size={14} className="text-[#E96B16]" />
                      )}
                    </button>
                  ))}

                  {filteredCities.length === 0 && !locationSearch && (
                    <p className="text-[12px] text-gray-400 text-center py-4">
                      No matching cities
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Login / Profile */}
          {mounted && isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 px-2 py-1.5 rounded-full group"
                onClick={handleGoProfile}
              >
                <div className="bg-[#E96B16]/10 p-1.5 rounded-full">
                  <User size={16} className="text-[#E96B16]" />
                </div>
                <span className="font-semibold text-[#35190F]">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={handleGoLogin}
              className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-[#E96B16]/10 group"
            >
              <User
                size={19}
                className="group-hover:text-[#E96B16] transition-colors duration-200"
              />
              <span>Login</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGoCreate}
            className={`flex items-center bg-[#E96B16] text-white rounded-full font-medium hover:bg-[#d45d0f] hover:shadow-[0_4px_20px_rgba(233,107,22,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm ml-2 cursor-pointer ${
              isScrolled
                ? 'px-4 py-2 text-[14px] gap-1.5'
                : 'px-5 py-2.5 text-[15px] gap-1.5'
            }`}
          >
            <Plus size={isScrolled ? 16 : 18} className="stroke-[2.5]" />
            <span>List an Item</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const Navbar = (props: NavbarProps) => {
  return (
    <Suspense fallback={<div className="h-16 w-full" />}>
      <NavbarContent {...props} />
    </Suspense>
  );
};

export default Navbar;
