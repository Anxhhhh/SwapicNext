'use client';
import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FourWays from './components/FourWays';
import HowItWorks from './components/HowItWorks';
import BrowseCategories from './components/BrowseCategories';
import FeaturedListings from './components/FeaturedListings';
import NearYou from './components/NearYou';
import Footer from './components/Footer';
import ExplorePage from './components/ExplorePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import CreateListingPage from './components/CreateListingPage';
import ItemDetailPage from './components/ItemDetailPage';
import FadeIn from './components/FadeIn';
import { useAuthStore } from './store/authStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Page = 'home' | 'explore' | 'login' | 'profile' | 'create' | 'item';

const App = () => {
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { fetchUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const goToExplore = (q = '', category = 'All categories', txType = 'All') => {
    setSearchQuery(q);
    setSelectedCategory(category);
    setSelectedType(txType);
    setPage('explore');
  };

  const goToItem = (id: string) => {
    setSelectedItemId(id);
    setPage('item');
  };

  const goToCreate = () => {
    if (!isAuthenticated) {
      setPage('login');
      return;
    }
    setPage('create');
  };

  const navProps = {
    onHomeClick: () => setPage('home'),
    onExploreClick: () => goToExplore(),
    onLoginClick: () => setPage('login'),
    onProfileClick: () => setPage('profile'),
    onSearch: (q: string) => goToExplore(q),
    onCreateListing: goToCreate,
  };

  if (page === 'explore') {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <ExplorePage
          {...navProps}
          onItemClick={goToItem}
          onCreateListing={goToCreate}
          initialSearch={searchQuery}
          initialCategory={selectedCategory}
          initialType={selectedType}
        />
      </>
    );
  }

  if (page === 'item' && selectedItemId) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F2]">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar {...navProps} activeNav="Explore" />
        <ItemDetailPage
          listingId={selectedItemId}
          onBack={() => setPage('explore')}
          onLoginRequired={() => setPage('login')}
        />
      </div>
    );
  }

  if (page === 'create') {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F2]">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar {...navProps} activeNav="Explore" />
        <CreateListingPage
          onBack={() => setPage('explore')}
          onSuccess={() => {
            setSearchQuery('');
            setSelectedCategory('All categories');
            setSelectedType('All');
            setPage('explore');
          }}
        />
      </div>
    );
  }

  if (page === 'login') {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <LoginPage onBack={() => setPage('home')} />
      </>
    );
  }

  if (page === 'profile') {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F2]">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar {...navProps} />
        <ProfilePage
          onHomeClick={() => setPage('home')}
          onCreateListing={goToCreate}
          onItemClick={goToItem}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar {...navProps} />
      <FadeIn delay={0.1}>
        <Hero
          onSearch={(q) => goToExplore(q)}
          onCategoryClick={(cat) => goToExplore('', cat)}
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <FourWays
          onSelectType={(t) => goToExplore('', 'All categories', t)}
          onCreateListing={goToCreate}
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <HowItWorks />
      </FadeIn>
      <FadeIn delay={0.1}>
        <BrowseCategories
          onCategoryClick={(cat) => goToExplore('', cat)}
          onExploreClick={() => goToExplore()}
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <FeaturedListings
          onItemClick={goToItem}
          onExploreClick={() => goToExplore()}
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <NearYou
          onCreateListing={goToCreate}
          onExploreClick={() => goToExplore()}
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <Footer onExploreClick={() => goToExplore()} />
      </FadeIn>
    </div>
  );
};

export default App;
