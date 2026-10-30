'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import ProfilePage from '@/src/components/ProfilePage';
import { useAuthStore } from '@/src/store/authStore';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F2] flex items-center justify-center text-[#654332]">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      <Navbar activeNav="Profile" />
      <ProfilePage
        onHomeClick={() => router.push('/')}
        onCreateListing={() => router.push('/create')}
        onItemClick={(id) => router.push(`/item/${id}`)}
      />
    </div>
  );
}

