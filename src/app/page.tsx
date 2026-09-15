'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSlider, SlideItem } from '@/components/HeroSlider';
import { TopListSection } from '@/components/TopListSection';
import { TopCardData } from '@/components/TopCard';
import { QuoteBand, QuoteData } from '@/components/QuoteBand';
import { PostsSection } from '@/components/PostsSection';
import { PostData } from '@/components/PostRow';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ContributeModal } from '@/components/ContributeModal';
import {
  defaultHeroSlides,
  defaultTopItems,
  defaultQuotes,
  defaultPosts,
} from '@/lib/defaultData';

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>(defaultHeroSlides);
  const [topItems, setTopItems] = useState<TopCardData[]>(defaultTopItems);
  const [quotes, setQuotes] = useState<QuoteData[]>(defaultQuotes);
  const [posts, setPosts] = useState<PostData[]>(defaultPosts);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [slidesRes, topRes, quotesRes, postsRes] = await Promise.all([
        fetch('/api/hero-slides'),
        fetch('/api/top-items'),
        fetch('/api/quotes'),
        fetch('/api/posts'),
      ]);

      if (slidesRes.ok) {
        const data = await slidesRes.json();
        if (Array.isArray(data) && data.length > 0) setHeroSlides(data);
      }
      if (topRes.ok) {
        const data = await topRes.json();
        if (Array.isArray(data) && data.length > 0) setTopItems(data);
      }
      if (quotesRes.ok) {
        const data = await quotesRes.json();
        if (Array.isArray(data) && data.length > 0) setQuotes(data);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        if (Array.isArray(data) && data.length > 0) setPosts(data);
      }
    } catch (e) {
      console.warn('Using local default dataset:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onContributeClick={() => setIsContributeOpen(true)}
      />

      <HeroSlider slides={heroSlides} />

      <TopListSection items={topItems} />

      <QuoteBand quotes={quotes} />

      <PostsSection posts={posts} />

      <NewsletterBand />

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        topItems={topItems}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSubmitSuccess={fetchData}
      />
    </main>
  );
}
