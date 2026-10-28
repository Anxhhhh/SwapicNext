'use client';
import React from 'react';

const StatsStrip = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 pb-16">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 border border-gray-100 flex flex-wrap lg:flex-nowrap justify-between items-start lg:items-center gap-8 lg:gap-0">
        
        <div className="flex flex-col gap-1 w-[45%] lg:w-auto">
          <span className="font-extrabold text-[1.5rem] text-[#35190F] leading-none">10K+</span>
          <span className="text-[#654332] text-sm font-medium">Active Members</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1 w-[45%] lg:w-auto">
          <span className="font-extrabold text-[1.5rem] text-[#35190F] leading-none">25K+</span>
          <span className="text-[#654332] text-sm font-medium">Items Listed</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1 w-[45%] lg:w-auto">
          <span className="font-extrabold text-[1.15rem] text-[#35190F] mb-0.5">4 Ways</span>
          <span className="text-[#654332] text-sm font-medium">Buy, Sell, Rent, Barter</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1 w-[45%] lg:w-auto">
          <span className="font-extrabold text-[1.15rem] text-[#35190F] mb-0.5">Safe & Trusted</span>
          <span className="text-[#654332] text-sm font-medium">Verified Community</span>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

        <div className="flex flex-col gap-1 w-full lg:w-auto mt-4 lg:mt-0">
          <span className="font-extrabold text-[1.15rem] text-[#35190F] mb-0.5">Sustainable</span>
          <span className="text-[#654332] text-sm font-medium">Give items a new life</span>
        </div>

      </div>
    </div>
  );
};

export default StatsStrip;

