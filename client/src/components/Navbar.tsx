'use client';
import React, { useState, useEffect } from 'react';
import { Repeat, Search, SlidersHorizontal, MapPin, ChevronDown, User, Plus, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onExploreClick, onLoginClick, onProfileClick, onHomeClick, activeNav = 'Home', onSearch, onCreateListing }: { onExploreClick?: () => void; onLoginClick?: () => void; onProfileClick?: () => void; onHomeClick?: () => void; activeNav?: string; onSearch?: (q: string) => void; onCreateListing?: () => void }) => {
  const [navSearch, setNavSearch] = React.useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else if (window.scrollY < 10) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeClass = 'text-[#35190F] font-semibold relative after:absolute after:-bottom-[20px] after:left-0 after:w-full after:h-[2px] after:bg-[#E96B16] transition-colors duration-200';
  const inactiveClass = 'relative hover:text-[#E96B16] transition-colors duration-200 after:absolute after:-bottom-[20px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E96B16] after:transition-all after:duration-300 hover:after:w-full';

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'pt-3 px-4' : 'pt-6 px-4'}`}>
      {/* Navbar Container */}
      <nav className={`flex items-center justify-between bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] mx-auto transition-all duration-300 ${isScrolled ? 'px-5 py-2 max-w-[1200px]' : 'px-6 py-3.5 max-w-[1400px]'}`}>

        {/* Left Section: Logo */}
        <div className="flex items-center gap-2.5 pr-4 shrink-0 cursor-pointer group" onClick={onHomeClick}>
          <div className="bg-[#35190F] p-1.5 rounded-lg text-white group-hover:bg-[#E96B16] transition-colors duration-300">
            <Repeat size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-[1.15rem] text-[#35190F] tracking-wide group-hover:text-[#E96B16] transition-colors duration-300">SWAPIC</span>
        </div>

        {/* Center Section: Search */}
        <div className={`flex-1 hidden lg:flex items-center bg-[#f4f0ec] rounded-full mx-4 transition-all focus-within:ring-2 focus-within:ring-[#E96B16]/20 hover:bg-[#ede8e0] ${isScrolled ? 'px-4 py-2 max-w-[400px]' : 'px-4 py-2.5 max-w-[500px]'}`}>
          <Search size={18} className="text-gray-500 mr-2.5 shrink-0" />
          <input
            type="text"
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && navSearch.trim()) { onSearch?.(navSearch.trim()); onExploreClick?.(); } }}
            placeholder="Search products, categories, or what you need..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#35190F] placeholder:text-gray-500 w-full"
          />
          <SlidersHorizontal
            size={18}
            onClick={() => { if (navSearch.trim()) { onSearch?.(navSearch.trim()); onExploreClick?.(); } else { onExploreClick?.(); } }}
            className="text-gray-500 ml-2.5 shrink-0 cursor-pointer hover:text-[#E96B16] transition-colors"
          />
        </div>

        {/* Right Section: Navigation & Actions */}
        <div className="flex items-center gap-5 sm:gap-7 pl-2 text-[15px] font-medium text-[#654332] shrink-0">

          {/* Main Links */}
          <div className="hidden xl:flex items-center gap-7">
            <a href="#" onClick={e => { e.preventDefault(); onHomeClick?.(); }} className={activeNav === 'Home' ? activeClass : inactiveClass}>Home</a>
            <a
              href="#"
              onClick={e => { e.preventDefault(); onExploreClick?.(); }}
              className={activeNav === 'Explore' ? activeClass : inactiveClass}
            >Explore</a>
            <a href="#" className={activeNav === 'Barter' ? activeClass : inactiveClass}>Barter</a>
            <a href="#" className={activeNav === 'Rent' ? activeClass : inactiveClass}>Rent</a>
            <a href="#how-it-works" onClick={e => { e.preventDefault(); onHomeClick?.(); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={inactiveClass}>How It Works</a>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-1.5 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 group">
            <MapPin size={18} className="text-[#E96B16]" />
            <span>Bengaluru</span>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-[#E96B16] transition-colors duration-200 group-hover:rotate-180 transition-transform" />
          </div>

          {/* Login / Profile */}
          {mounted && isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 px-2 py-1.5 rounded-full group"
                onClick={onProfileClick}
              >
                <div className="bg-[#E96B16]/10 p-1.5 rounded-full">
                  <User size={16} className="text-[#E96B16]" />
                </div>
                <span className="font-semibold text-[#35190F]">{user?.name}</span>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors p-1.5" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={onLoginClick}
              className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-[#E96B16] transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-[#E96B16]/10 group"
            >
              <User size={19} className="group-hover:text-[#E96B16] transition-colors duration-200" />
              <span>Login</span>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={onCreateListing}
            className={`flex items-center bg-[#E96B16] text-white rounded-full font-medium hover:bg-[#d45d0f] hover:shadow-[0_4px_20px_rgba(233,107,22,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm ml-2 ${isScrolled ? 'px-4 py-2 text-[14px] gap-1.5' : 'px-5 py-2.5 text-[15px] gap-1.5'}`}
          >
            <Plus size={isScrolled ? 16 : 18} className="stroke-[2.5]" />
            <span>List an Item</span>
          </button>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;

