'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ExplorePage from '@/src/components/ExplorePage';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All categories';
  const type = searchParams.get('type') || 'All';

  return (
    <ExplorePage
      initialSearch={q}
      initialCategory={category}
      initialType={type}
      onHomeClick={() => router.push('/')}
      onExploreClick={() => router.push('/explore')}
      onLoginClick={() => router.push('/login')}
      onProfileClick={() => router.push('/profile')}
      onCreateListing={() => router.push('/create')}
      onItemClick={(id) => router.push(`/item/${id}`)}
      onSearch={(newQ) => router.push(newQ ? `/explore?q=${encodeURIComponent(newQ)}` : '/explore')}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#654332]">
          Loading marketplace...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

