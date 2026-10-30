'use client';
import React, { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import ItemDetailPage from '@/src/components/ItemDetailPage';

function ItemDetailContent() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : '';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/explore');
    }
  };

  if (!id) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center text-[#654332]">
        Loading item...
      </div>
    );
  }

  return (
    <ItemDetailPage
      listingId={id}
      onBack={handleBack}
      onLoginRequired={() => router.push(`/login?redirect=/item/${id}`)}
    />
  );
}

export default function ItemPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      <Navbar activeNav="Explore" />
      <Suspense
        fallback={
          <div className="min-h-[60vh] w-full flex items-center justify-center text-[#654332]">
            Loading item...
          </div>
        }
      >
        <ItemDetailContent />
      </Suspense>
    </div>
  );
}
