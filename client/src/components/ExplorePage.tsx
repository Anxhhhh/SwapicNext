'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, SlidersHorizontal, MapPin, ChevronDown,
  Plus, X, Star, Heart, Package, Loader2
} from 'lucide-react';
import Navbar from './Navbar';
import { useListingStore, type Listing } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

/* ─────────────────────── Filter Sidebar ─────────────────────── */
type FilterState = {
  txType: string;
  category: string;
  priceMin: string;
  priceMax: string;
  conditions: string[];
  distance: string | null;
};

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'];
const CATEGORIES = ['All categories', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Toys', 'Home & Living', 'Other'];
const DISTANCES = ['1 km', '5 km', '10 km', '25 km', '50 km'];

const FilterSidebar = ({
  filters, setFilters, onClear,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}) => {
  const toggle = (c: string) =>
    setFilters(f => ({
      ...f,
      conditions: f.conditions.includes(c)
        ? f.conditions.filter(x => x !== c)
        : [...f.conditions, c],
    }));

  return (
    <aside className="w-[220px] shrink-0 bg-white rounded-2xl border border-[#ede8e1] p-5 self-start sticky top-5 text-[#35190F]">

      {/* Transaction type */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold mb-2.5">Transaction type</p>
        <div className="flex flex-wrap gap-2">
          {['All', 'Sell', 'Rent', 'Barter'].map(t => (
            <button
              key={t}
              onClick={() => setFilters(f => ({ ...f, txType: t }))}
              className={`px-3 py-1 rounded-full text-[12.5px] font-medium border transition-all ${
                filters.txType === t
                  ? 'bg-[#E96B16] text-white border-[#E96B16]'
                  : 'bg-white text-[#654332] border-[#ddd5c8] hover:border-[#E96B16]'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold mb-2">Category</p>
        <div className="relative">
          <select
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-[#ddd5c8] rounded-lg px-3 py-2 text-[13px] text-[#35190F] bg-white appearance-none outline-none focus:border-[#E96B16] cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold mb-2">Price (₹)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.priceMin} onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))}
            className="w-full border border-[#ddd5c8] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#E96B16] placeholder:text-gray-400" />
          <input type="number" placeholder="Max" value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))}
            className="w-full border border-[#ddd5c8] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#E96B16] placeholder:text-gray-400" />
        </div>
      </div>

      {/* Condition */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold mb-2">Condition</p>
        <div className="flex flex-col gap-1.5">
          {CONDITIONS.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.conditions.includes(c)} onChange={() => toggle(c)}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-[#E96B16] cursor-pointer" />
              <span className="text-[13px] text-[#654332] group-hover:text-[#35190F] transition-colors">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <p className="text-[13px] font-semibold mb-2">Distance</p>
        <div className="flex flex-wrap gap-2">
          {DISTANCES.map(d => (
            <button
              key={d}
              onClick={() => setFilters(f => ({ ...f, distance: f.distance === d ? null : d }))}
              className={`px-3 py-1 rounded-full text-[12.5px] font-medium border transition-all ${
                filters.distance === d
                  ? 'bg-[#E96B16] text-white border-[#E96B16]'
                  : 'bg-white text-[#654332] border-[#ddd5c8] hover:border-[#E96B16]'
              }`}
            >{d}</button>
          ))}
        </div>
      </div>

      <button onClick={onClear} className="flex items-center gap-1.5 text-[13px] text-[#654332] hover:text-[#35190F] transition-colors font-medium">
        <X size={14} /> Clear filters
      </button>
    </aside>
  );
};

/* ─────────────────── Item Card ──────────────────────────────── */
const TYPE_COLORS: Record<string, string> = {
  Sell:   'bg-blue-50 text-blue-600 border-blue-100',
  Rent:   'bg-purple-50 text-purple-600 border-purple-100',
  Barter: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const ItemCard = ({ item, onClick, onLoginRequired, isAuthenticated }: {
  item: Listing;
  onClick: () => void;
  onLoginRequired?: () => void;
  isAuthenticated: boolean;
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) { onLoginRequired?.(); return; }
    try {
      await api.post(`/listings/${item._id}/save`);
      setSaved(s => !s);
    } catch {}
  };

  const image = item.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop';
  const price = item.type === 'Rent' ? item.rentPerDay : item.price;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#ede8e1] overflow-hidden group hover:shadow-[0_12px_40px_rgba(233,107,22,0.35)] hover:-translate-y-1 hover:border-[#E96B16] transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <img src={image} alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-[#E96B16]/0 group-hover:bg-[#E96B16]/15 transition-all duration-300" />
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${TYPE_COLORS[item.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
          {item.type}
        </span>
        <button onClick={handleSave} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Heart size={15} className={saved ? 'fill-[#E96B16] text-[#E96B16]' : 'text-gray-400'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5 bg-white group-hover:bg-[#E96B16] transition-colors duration-300">
        <h3 className="text-[14px] font-semibold text-[#35190F] group-hover:text-white leading-snug line-clamp-2 mb-2 transition-colors duration-300">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[16px] font-extrabold text-[#35190F] group-hover:text-white transition-colors duration-300">
            {item.type === 'Barter'
              ? <span className="text-emerald-600 group-hover:text-white text-[13px] font-bold transition-colors duration-300">Open to swap</span>
              : <>₹{(price || 0).toLocaleString('en-IN')}{item.type === 'Rent' && <span className="text-[11px] font-medium text-gray-400 group-hover:text-white/80 transition-colors duration-300">/day</span>}</>
            }
          </span>
          <span className="text-[11.5px] font-semibold text-gray-500 group-hover:text-white/90 transition-colors duration-300">{item.condition}</span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-gray-400 group-hover:text-white/80 transition-colors duration-300">
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-[#E96B16] group-hover:text-white transition-colors duration-300" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400 group-hover:fill-white group-hover:text-white transition-colors duration-300" />
            <span className="font-medium text-[#35190F] group-hover:text-white transition-colors duration-300">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Main Page ─────────────────────────── */
const DEFAULT_FILTERS: FilterState = {
  txType: 'All',
  category: 'All categories',
  priceMin: '',
  priceMax: '',
  conditions: [],
  distance: null,
};

const ExplorePage = ({
  onHomeClick, onExploreClick, onLoginClick, onProfileClick,
  onItemClick, onCreateListing, onSearch, initialSearch = '',
  initialCategory = 'All categories',
  initialType = 'All',
}: {
  onHomeClick?: () => void;
  onExploreClick?: () => void;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
  onItemClick?: (id: string) => void;
  onCreateListing?: () => void;
  onSearch?: (q: string) => void;
  initialSearch?: string;
  initialCategory?: string;
  initialType?: string;
}) => {
  const { listings, total, loading, fetchListings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState<FilterState>({
    txType: initialType || 'All',
    category: initialCategory || 'All categories',
    priceMin: '',
    priceMax: '',
    conditions: [],
    distance: null,
  });
  const [sort, setSort] = useState('Recommended');
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNav =
    filters.txType === 'Barter' ? 'Barter' :
    filters.txType === 'Rent'   ? 'Rent'   :
    'Explore';

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setSearchQuery('');
  };

  const loadListings = useCallback(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (filters.txType !== 'All') params.type = filters.txType;
    if (filters.category !== 'All categories') params.category = filters.category;
    if (filters.priceMin) params.minPrice = filters.priceMin;
    if (filters.priceMax) params.maxPrice = filters.priceMax;
    if (filters.conditions.length) params.condition = filters.conditions[0];
    fetchListings(params);
  }, [searchQuery, filters, fetchListings]);

  useEffect(() => { loadListings(); }, [loadListings]);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(val), 450);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar
        onHomeClick={onHomeClick}
        onExploreClick={onExploreClick}
        onLoginClick={onLoginClick}
        onProfileClick={onProfileClick}
        onSearch={onSearch}
        onCreateListing={onCreateListing}
        activeNav={activeNav}
      />

      {/* Page body */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-8">

        {/* Page heading + search */}
        <div className="mb-6">
          <h1 className="text-[1.7rem] font-extrabold text-[#35190F] leading-tight">
            Explore the marketplace
          </h1>
          <p className="text-[14px] text-[#8c6e5d] mt-1 mb-4">
            Buy, rent or swap — <span className="font-medium text-[#35190F]">filter down</span> to exactly{' '}
            <span className="italic">what you need.</span>
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-full border border-[#ddd5c8] px-4 py-2.5 max-w-[560px] gap-2 shadow-sm focus-within:border-[#E96B16] focus-within:ring-2 focus-within:ring-[#E96B16]/15 transition-all">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search listings, categories, locations..."
              className="flex-1 bg-transparent outline-none text-[14px] text-[#35190F] placeholder:text-gray-400"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="text-gray-400 hover:text-[#35190F]">
                <X size={15} />
              </button>
            )}
            <SlidersHorizontal size={16} className="text-gray-400 hover:text-[#E96B16] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Content: sidebar + results */}
        <div className="flex gap-6 items-start">
          <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearFilters} />

          {/* Results panel */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13.5px] text-[#8c6e5d] font-medium">
                {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''}${searchQuery ? ` for "${searchQuery}"` : ''}`}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onCreateListing}
                  className="flex items-center gap-1.5 bg-[#E96B16] text-white px-4 py-1.5 rounded-full text-[13px] font-semibold hover:bg-[#d45d0f] transition-all shadow-sm"
                >
                  <Plus size={14} /> List an item
                </button>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="border border-[#ddd5c8] rounded-lg pl-3 pr-8 py-1.5 text-[13px] text-[#35190F] bg-white appearance-none outline-none focus:border-[#E96B16] cursor-pointer"
                  >
                    <option>Recommended</option>
                    <option>Newest first</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 size={36} className="text-[#E96B16] animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && listings.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 flex flex-col items-center justify-center min-h-[380px] shadow-sm">
                <div className="bg-[#FAF7F2] p-5 rounded-full mb-4">
                  <Package size={40} className="text-[#d4c6bc]" />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[#35190F] mb-2">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No listings yet'}
                </h3>
                <p className="text-[14px] text-gray-500 mb-6 text-center max-w-[260px]">
                  {searchQuery ? 'Try different keywords or clear your filters.' : 'Be the first to list an item on Swapic!'}
                </p>
                <button
                  onClick={onCreateListing}
                  className="bg-[#E96B16] text-white px-6 py-2.5 rounded-full font-semibold text-[14px] hover:bg-[#d45d0f] transition-all shadow-sm"
                >
                  + Create First Listing
                </button>
              </div>
            )}

            {/* Items grid */}
            {!loading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onClick={() => onItemClick?.(item._id)}
                    onLoginRequired={onLoginClick}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

