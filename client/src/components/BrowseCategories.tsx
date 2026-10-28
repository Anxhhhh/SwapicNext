'use client';
import React from 'react';
import { ArrowRight, Armchair, Laptop, Shirt, BookOpen, Dumbbell, MoreHorizontal } from 'lucide-react';

interface Props {
  onCategoryClick?: (category: string) => void;
  onExploreClick?: () => void;
}

const BrowseCategories = ({ onCategoryClick, onExploreClick }: Props) => {
  const handleCategory = (label: string) => {
    if (label === 'More') {
      onExploreClick?.();
      return;
    }
    // Map UI labels to database category names
    const categoryName = label === 'Fashion' ? 'Clothing' : label;
    onCategoryClick?.(categoryName);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-16 py-10">
      
      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="flex justify-between items-end mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[2rem] font-bold text-[#35190F] leading-tight">
            Browse categories
          </h2>
          <p className="text-[#654332] text-[1rem]">
            Discover items you'll love.
          </p>
        </div>
        
        <button
          onClick={onExploreClick}
          className="text-[#E96B16] font-bold text-[0.95rem] flex items-center gap-2 hover:text-[#d45d0f] transition-colors pb-1"
        >
          View all <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── CATEGORY ITEMS ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide">
        
        <CategoryCard 
          icon={<Armchair size={40} stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />} 
          label="Furniture" 
          onClick={() => handleCategory("Furniture")}
        />
        
        <CategoryCard 
          icon={<Laptop size={40} stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />} 
          label="Electronics" 
          onClick={() => handleCategory("Electronics")}
        />
        
        <CategoryCard 
          icon={<Shirt size={40} stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />} 
          label="Fashion" 
          onClick={() => handleCategory("Fashion")}
        />
        
        <CategoryCard 
          icon={<BookOpen size={40} stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />} 
          label="Books" 
          onClick={() => handleCategory("Books")}
        />
        
        <CategoryCard 
          icon={<Dumbbell size={40} stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />} 
          label="Sports" 
          onClick={() => handleCategory("Sports")}
        />
        
        <CategoryCard 
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 14h10v2H7z" fill="currentColor" fillOpacity={0.15} />
              <path d="M8 16h8l-1 4H9z" fill="currentColor" fillOpacity={0.15} />
              <path d="M12 14v-5" />
              <path d="M12 9c0-3 3-4 3-4s1 3-3 4z" fill="currentColor" fillOpacity={0.15} />
              <path d="M12 11c0-2-2-3-2-3s-1 2 2 3z" fill="currentColor" fillOpacity={0.15} />
            </svg>
          } 
          label="Home & Living" 
          onClick={() => handleCategory("Home & Living")}
        />
        
        <CategoryCard 
          icon={<MoreHorizontal size={40} stroke="currentColor" strokeWidth={1.5} />} 
          label="More" 
          onClick={() => handleCategory("More")}
        />

      </div>
    </div>
  );
};

// Sub-component for individual category cards
const CategoryCard = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-4 cursor-pointer group shrink-0 w-[140px]"
    >
      <div className="w-[130px] h-[85px] bg-[#FFF6EF] rounded-[28px] flex justify-center items-center group-hover:bg-[#E96B16] group-hover:shadow-[0_8px_24px_rgba(233,107,22,0.3)] transition-all duration-300 text-[#35190F] group-hover:text-white group-hover:-translate-y-1">
        {icon}
      </div>
      <span className="text-[14px] font-medium text-[#4A2B1D] group-hover:text-[#E96B16] transition-colors duration-300">
        {label}
      </span>
    </div>
  );
};

export default BrowseCategories;
