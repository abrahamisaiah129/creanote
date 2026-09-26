"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSlider, SlideItem } from "@/components/HeroSlider";
import { TopListSection } from "@/components/TopListSection";
import { TopCardData } from "@/components/TopCard";
import { QuoteSection } from "@/components/QuoteSection";
import { QuoteData } from "@/components/QuoteBand";
import { PostsSection } from "@/components/PostsSection";
import { PostData } from "@/components/PostRow";
import { NewsletterBand } from "@/components/NewsletterBand";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { ContributeModal } from "@/components/ContributeModal";
import { placeholderUrl } from "@/lib/defaultData";

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([]);
  const [topItems, setTopItems] = useState<TopCardData[]>([]);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [slidesRes, topRes, quotesRes, postsRes] = await Promise.all([
        fetch("/api/hero-slides"),
        fetch("/api/posts?isTopOnTheList=true"),
        fetch("/api/quotes"),
        fetch("/api/posts?limit=3"),
      ]);

      // Maximum limit for items to display on the homepage
      const HOMEPAGE_LIMIT = 9;

      if (slidesRes.ok) {
        const data = await slidesRes.json();
        if (Array.isArray(data)) setHeroSlides(data);
      }
      if (topRes.ok) {
        const payload = await topRes.json();
        const data = payload.data || payload;
        if (Array.isArray(data)) {
          setTopItems(data.slice(0, 4).map((p: any) => ({
            id: p.id || p._id,
            title: p.headline,
            meta: p.sub,
            imageUrl: p.thumbUrl || placeholderUrl(p.headline, 640, 360),
            linkUrl: `/stories/${p.slug || p.id || p._id}`
          })));
        }
      }
      if (quotesRes.ok) {
        const payload = await quotesRes.json();
        const data = payload.data || payload;
        if (Array.isArray(data)) setQuotes(data.slice(0, HOMEPAGE_LIMIT));
      }
      if (postsRes.ok) {
        const payload = await postsRes.json();
        const data = payload.data || payload;
        if (Array.isArray(data)) setPosts(data.slice(0, HOMEPAGE_LIMIT));
      }
    } catch (e) {
      console.warn("Failed to fetch data:", e);
    } finally {
      setIsLoading(false);
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

      {isLoading ? (
        <div className="w-full animate-pulse">
          {/* Hero Skeleton */}
          <div className="w-full aspect-[9/16] sm:aspect-[16/8] lg:aspect-[16/7] bg-[#0C100D] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
          
          {/* Top Items Skeleton */}
          <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 sm:h-64 bg-[#0C100D] rounded-xl relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Posts Skeleton */}
          <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-12">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 h-32 bg-[#0C100D] rounded-xl relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <HeroSlider slides={heroSlides} />
          <TopListSection items={topItems} />
          <PostsSection posts={posts} />
          <QuoteSection quotes={quotes} />
        </>
      )}

      <NewsletterBand />
      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        topItems={topItems}
        quotes={quotes}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSubmitSuccess={fetchData}
      />
    </main>
  );
}
