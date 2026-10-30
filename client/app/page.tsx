'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Hero from '@/src/components/Hero';
import FourWays from '@/src/components/FourWays';
import HowItWorks from '@/src/components/HowItWorks';
import BrowseCategories from '@/src/components/BrowseCategories';
import FeaturedListings from '@/src/components/FeaturedListings';
import NearYou from '@/src/components/NearYou';
import Footer from '@/src/components/Footer';
import FadeIn from '@/src/components/FadeIn';
import { useAuthStore } from '@/src/store/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleSearch = (q: string) => {
    router.push(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  const handleCategoryClick = (cat: string) => {
    router.push(`/explore?category=${encodeURIComponent(cat)}`);
  };

  const handleTypeClick = (t: string) => {
    router.push(`/explore?type=${encodeURIComponent(t)}`);
  };

  const handleCreateListing = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/create');
    } else {
      router.push('/create');
    }
  };

  const handleItemClick = (id: string) => {
    router.push(`/item/${id}`);
  };

  const handleExploreClick = () => {
    router.push('/explore');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      <Navbar
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onExploreClick={handleExploreClick}
        onLoginClick={() => router.push('/login')}
        onProfileClick={() => router.push('/profile')}
        onCreateListing={handleCreateListing}
        onSearch={handleSearch}
        activeNav="Home"
      />

      <FadeIn delay={0.1}>
        <Hero
          onSearch={handleSearch}
          onCategoryClick={handleCategoryClick}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <FourWays
          onSelectType={handleTypeClick}
          onCreateListing={handleCreateListing}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <BrowseCategories
          onCategoryClick={handleCategoryClick}
          onExploreClick={handleExploreClick}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <FeaturedListings
          onItemClick={handleItemClick}
          onExploreClick={handleExploreClick}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <NearYou
          onCreateListing={handleCreateListing}
          onExploreClick={handleExploreClick}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Footer onExploreClick={handleExploreClick} />
      </FadeIn>
    </div>
  );
}
