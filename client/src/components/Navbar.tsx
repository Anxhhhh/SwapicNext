'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Repeat, Search, SlidersHorizontal, MapPin, ChevronDown,
  User, Plus, LogOut, Navigation, Check, Loader2, X, Menu
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
            className={`flex items-center bg-[#E96B16] text-white rounded-full font-medium hover:bg-[#d45d0f] hover:shadow-[0_4px_20px_rgba(233,107,22,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm ml-1 sm:ml-2 cursor-pointer ${
              isScrolled
                ? 'px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-[14px] gap-1 sm:gap-1.5'
                : 'px-3.5 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-[15px] gap-1 sm:gap-1.5'
            }`}
          >
            <Plus size={isScrolled ? 16 : 18} className="stroke-[2.5]" />
            <span className="hidden xs:inline">List an Item</span>
            <span className="inline xs:hidden">List</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex xl:hidden items-center justify-center p-2 rounded-full hover:bg-[#FAF7F2] text-[#35190F] hover:text-[#E96B16] transition-colors cursor-pointer ml-1"
            aria-label="Open mobile menu"
          >
            <Menu size={22} className="stroke-[2.5]" />
          </button>
        </div>
      </nav>

      {/* ── MOBILE SLIDE-OVER DRAWER & BACKDROP ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ede8e1]">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  handleGoHome(e);
                  setMobileMenuOpen(false);
                }}
              >
                <div className="bg-[#35190F] p-1.5 rounded-lg text-white">
                  <Repeat size={18} className="stroke-[2.5]" />
                </div>
                <span className="font-extrabold text-[1.1rem] text-[#35190F] tracking-wide">
                  SWAPIC
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-[#35190F] hover:bg-[#FAF7F2] transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* User Auth Section */}
            <div className="py-4 border-b border-[#ede8e1]">
              {mounted && isAuthenticated ? (
                <div className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-2xl">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      handleGoProfile();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E96B16]/10 flex items-center justify-center text-[#E96B16] font-bold text-[16px]">
                      {user?.name?.[0]?.toUpperCase() || <User size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#35190F] leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[12px] text-gray-400 truncate max-w-[150px]">
                        {user?.email || 'Swapic Member'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="bg-[#FFF4EC] border border-[#E96B16]/20 p-3.5 rounded-2xl text-center">
                  <p className="font-bold text-[13.5px] text-[#35190F] mb-1">
                    Join the Swapic Community
                  </p>
                  <p className="text-[12px] text-gray-500 mb-3">
                    Buy, sell, rent, and trade with your neighborhood.
                  </p>
                  <button
                    onClick={() => {
                      handleGoLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#E96B16] text-white font-bold text-[13px] py-2 rounded-xl hover:bg-[#d45d0f] transition-all cursor-pointer shadow-sm"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <div className="py-4 border-b border-[#ede8e1]">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Search Marketplace
              </p>
              <div className="flex items-center bg-[#f4f0ec] rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#E96B16]/20">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                      setMobileMenuOpen(false);
                    }
                  }}
                  placeholder="Search items or categories..."
                  className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-[#35190F] placeholder:text-gray-400 w-full"
                />
                {navSearch && (
                  <button
                    onClick={() => setNavSearch('')}
                    className="text-gray-400 hover:text-[#35190F]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Location Picker */}
            <div className="py-4 border-b border-[#ede8e1]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Location
                </p>
                <span className="text-[12px] font-bold text-[#E96B16] flex items-center gap-1">
                  <MapPin size={12} /> {selectedLocation}
                </span>
              </div>

              {/* Detect Location Button */}
              <button
                disabled={isDetecting}
                onClick={async () => {
                  const detected = await detectCurrentLocation();
                  if (detected) setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#FFF4EC] text-[#E96B16] font-semibold text-[12px] py-2 rounded-xl transition-all mb-2 cursor-pointer disabled:opacity-50"
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Detecting GPS location...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={13} className="fill-[#E96B16]" />
                    <span>Use current location</span>
                  </>
                )}
              </button>

              {/* Popular Cities Horizontal Scroll Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {POPULAR_INDIAN_CITIES.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setLocation(city);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-[11.5px] font-semibold shrink-0 transition-colors ${
                      city === selectedLocation
                        ? 'bg-[#E96B16] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#654332] hover:bg-[#ede8e1]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Navigation Links */}
            <div className="py-4 flex-1 flex flex-col gap-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Navigation
              </p>
              {[
                { label: 'Home', action: handleGoHome, active: resolvedActive === 'Home' },
                { label: 'Explore Marketplace', action: (e: any) => handleGoExplore(e), active: resolvedActive === 'Explore' },
                { label: 'Barter Exchange', action: (e: any) => handleGoExplore(e, 'Barter'), active: false },
                { label: 'Rentals', action: (e: any) => handleGoExplore(e, 'Rent'), active: false },
                { label: 'How It Works', action: handleGoHowItWorks, active: false },
              ].map(({ label, action, active }) => (
                <button
                  key={label}
                  onClick={(e) => {
                    action(e);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-[14.5px] font-semibold transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-[#E96B16]/10 text-[#E96B16]'
                      : 'text-[#35190F] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E96B16]" />}
                </button>
              ))}
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-4 border-t border-[#ede8e1]">
              <button
                onClick={() => {
                  handleGoCreate();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#E96B16] text-white font-bold text-[14.5px] py-3 rounded-2xl hover:bg-[#d45d0f] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(233,107,22,0.4)] cursor-pointer"
              >
                <Plus size={18} className="stroke-[2.5]" />
                <span>List an Item</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
