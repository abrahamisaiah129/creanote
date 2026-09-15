'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OverviewManager } from '@/components/admin/OverviewManager';
import { TopListManager } from '@/components/admin/TopListManager';
import { PostsManager } from '@/components/admin/PostsManager';
import { QuotesManager } from '@/components/admin/QuotesManager';
import { HeroManager } from '@/components/admin/HeroManager';
import { SubscribersManager } from '@/components/admin/SubscribersManager';
import {
  defaultTopItems,
  defaultPosts,
  defaultQuotes,
  defaultHeroSlides,
} from '@/lib/defaultData';
import { TopCardData } from '@/components/TopCard';
import { PostData } from '@/components/PostRow';
import { QuoteData } from '@/components/QuoteBand';
import { SlideItem } from '@/components/HeroSlider';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [topItems, setTopItems] = useState<TopCardData[]>(defaultTopItems);
  const [posts, setPosts] = useState<PostData[]>(defaultPosts);
  const [quotes, setQuotes] = useState<QuoteData[]>(defaultQuotes);
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>(defaultHeroSlides);
  const [subscribers, setSubscribers] = useState<{ email: string; createdAt?: string }[]>([
    { email: 'officialcreanote@gmail.com', createdAt: new Date().toISOString() },
  ]);

  const fetchAllData = useCallback(async () => {
    try {
      const [topRes, postsRes, quotesRes, heroRes, subRes] = await Promise.all([
        fetch('/api/top-items'),
        fetch('/api/posts'),
        fetch('/api/quotes'),
        fetch('/api/hero-slides'),
        fetch('/api/newsletter'),
      ]);

      if (topRes.ok) {
        const data = await topRes.json();
        if (Array.isArray(data) && data.length > 0) setTopItems(data);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        if (Array.isArray(data) && data.length > 0) setPosts(data);
      }
      if (quotesRes.ok) {
        const data = await quotesRes.json();
        if (Array.isArray(data) && data.length > 0) setQuotes(data);
      }
      if (heroRes.ok) {
        const data = await heroRes.json();
        if (Array.isArray(data) && data.length > 0) setHeroSlides(data);
      }
      if (subRes.ok) {
        const data = await subRes.json();
        if (Array.isArray(data) && data.length > 0) setSubscribers(data);
      }
    } catch (e) {
      console.warn('Using local fallback state in admin:', e);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <OverviewManager
          topCount={topItems.length}
          postCount={posts.length}
          quoteCount={quotes.length}
          heroCount={heroSlides.length}
          subCount={subscribers.length}
          onRefresh={fetchAllData}
        />
      )}

      {activeTab === 'top-list' && (
        <TopListManager items={topItems} onRefresh={fetchAllData} />
      )}

      {activeTab === 'posts' && (
        <PostsManager posts={posts} onRefresh={fetchAllData} />
      )}

      {activeTab === 'quotes' && (
        <QuotesManager quotes={quotes} onRefresh={fetchAllData} />
      )}

      {activeTab === 'hero' && (
        <HeroManager slides={heroSlides} onRefresh={fetchAllData} />
      )}

      {activeTab === 'subscribers' && (
        <SubscribersManager subscribers={subscribers} />
      )}
    </AdminLayout>
  );
}
