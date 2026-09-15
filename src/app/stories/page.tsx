'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PostsSection } from '@/components/PostsSection';
import { PostData } from '@/components/PostRow';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { ContributeModal } from '@/components/ContributeModal';
import { defaultPosts } from '@/lib/defaultData';

export default function StoriesPage() {
  const [posts, setPosts] = useState<PostData[]>(defaultPosts);
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setPosts(data);
      }
    } catch (e) {
      console.warn('Using default posts:', e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main>
      <Navbar onContributeClick={() => setIsContributeOpen(true)} />

      <div className="section">
        <div className="section-label">Creator Stories & Updates</div>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '14px',
            marginBottom: '16px',
            maxWidth: '700px',
            lineHeight: 1.6,
          }}
        >
          Discover notes, lessons, breakthroughs, and honest reflections shared by creatives from all walks of life.
        </p>
      </div>

      <PostsSection posts={posts} title="All Stories" itemsPerPage={6} />

      <NewsletterBand />
      <Footer />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSubmitSuccess={fetchPosts}
      />
    </main>
  );
}
