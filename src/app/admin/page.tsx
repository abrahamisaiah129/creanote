'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ActivityLogProvider } from '@/context/ActivityLogContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { OverviewManager } from '@/components/admin/OverviewManager';
import { TopListManager } from '@/components/admin/TopListManager';
import { PostsManager } from '@/components/admin/PostsManager';
import { QuotesManager } from '@/components/admin/QuotesManager';
import { HeroManager } from '@/components/admin/HeroManager';
import { SubscribersManager } from '@/components/admin/SubscribersManager';

import { TopCardData } from '@/components/TopCard';
import { PostData } from '@/components/PostRow';
import { QuoteData } from '@/components/QuoteBand';
import { SlideItem } from '@/components/HeroSlider';

import { motion } from 'framer-motion';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [topItems, setTopItems] = useState<TopCardData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([]);
  const [subscribers, setSubscribers] = useState<{ email: string; createdAt?: string }[]>([
    { email: 'officialcreanote@gmail.com', createdAt: new Date().toISOString() },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
      }
    } catch (e) {
      console.warn('Auth check error, defaulting to unauthenticated:', e);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setIsAuthenticated(false);
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
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
        if (Array.isArray(data)) setTopItems(data);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        if (Array.isArray(data)) setPosts(data);
      }
      if (quotesRes.ok) {
        const data = await quotesRes.json();
        if (Array.isArray(data)) setQuotes(data);
      }
      if (heroRes.ok) {
        const data = await heroRes.json();
        if (Array.isArray(data)) setHeroSlides(data);
      }
      if (subRes.ok) {
        const data = await subRes.json();
        if (Array.isArray(data)) setSubscribers(data);
      }
    } catch (e) {
      console.warn('Using local fallback state in admin:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center flex-col gap-6">
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute h-16 w-16 rounded-full border-t-2 border-[var(--green)] border-r-2 border-r-transparent border-b-2 border-b-[var(--orange)] border-l-2 border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
          />
          <motion.div
            className="h-4 w-4 rounded-full bg-[var(--green)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>
        <motion.div 
          className="text-[var(--muted)] text-[10px] font-[Ubuntu] tracking-widest uppercase font-bold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        >
          Authenticating
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ActivityLogProvider>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
        {activeTab === 'overview' && (
          <OverviewManager
            isLoading={isLoading}
            topCount={topItems.length}
            postCount={posts.length}
            quoteCount={quotes.length}
            heroCount={heroSlides.length}
            subCount={subscribers.length}
            onRefresh={fetchAllData}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* top-list removed */}

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
    </ActivityLogProvider>
  );
}
