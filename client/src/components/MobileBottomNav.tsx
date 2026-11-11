'use client';
import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Plus, Repeat, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MobileBottomNavContent = () => {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Hide bottom nav on login page
  if (pathname.startsWith('/login')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home, exact: true },
    { label: 'Explore', path: '/explore', icon: Compass, exact: false, activeMatch: (p: string) => p === '/explore' },
    { label: 'List', path: '/create', icon: Plus, isAction: true },
    { label: 'Barter', path: '/explore?type=Barter', icon: Repeat, exact: false, activeMatch: (p: string) => p.includes('type=Barter') || p.includes('Barter') },
    {
      label: isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Account',
      path: isAuthenticated ? '/profile' : '/login',
      icon: User,
      exact: false,
      activeMatch: (p: string) => p.startsWith('/profile') || p.startsWith('/login'),
    },
  ];

  const handleNav = (item: typeof navItems[0]) => {
    if (item.path === '/create' && !isAuthenticated) {
      router.push('/login?redirect=/create');
      return;
    }
    router.push(item.path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#ede8e1] px-2 py-1.5 z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.activeMatch
            ? item.activeMatch(pathname)
            : item.exact
            ? pathname === item.path
            : pathname.startsWith(item.path) && item.path !== '/';

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
                aria-label="List an Item"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E96B16] to-[#ff8c3b] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(233,107,22,0.45)] group-hover:scale-105 active:scale-95 transition-transform border-4 border-[#FAF7F2]">
                  <Plus size={22} className="stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-[#E96B16] mt-0.5">List Item</span>
              </button>
            );
          }

          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#E96B16]' : 'text-gray-500 hover:text-[#35190F]'
              }`}
            >
              <div
                className={`flex items-center justify-center px-3.5 py-1 rounded-full transition-all ${
                  isActive ? 'bg-[#FFF4EC] text-[#E96B16]' : ''
                }`}
              >
                <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              </div>
              <span className={`text-[10.5px] mt-0.5 ${isActive ? 'font-bold text-[#E96B16]' : 'font-medium text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const MobileBottomNav = () => (
  <Suspense fallback={null}>
    <MobileBottomNavContent />
  </Suspense>
);

export default MobileBottomNav;

