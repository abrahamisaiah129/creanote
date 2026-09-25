'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ContributeModal } from '@/components/ContributeModal';
import { PostData } from '@/components/PostRow';
import { placeholderUrl } from '@/lib/defaultData';
import { ArrowLeft, Clock, Calendar, Share2, ArrowUpRight, X } from 'lucide-react';
import { DotsLoader } from '@/components/DotsLoader';
export default function StoryDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isAuthorLightboxOpen, setIsAuthorLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch exact story by id or slug from database endpoint
    fetch(`/api/posts/${encodeURIComponent(idOrSlug)}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && !data.error) {
          setPost(data);
        } else {
          // No fallback to mock data
          setPost(null);
        }
      })
      .catch(() => {
        setPost(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Fetch all posts to populate related posts and search modal
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPosts(data);
        }
      })
      .catch((e) => console.warn('Using default posts list:', e));
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060a07] text-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="font-['Ubuntu'] text-sm font-bold text-[var(--muted)] tracking-widest uppercase">Loading Story</div>
          <DotsLoader />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060a07] text-white">
        <div className="text-center">
          <div className="font-['Ubuntu'] text-xl font-bold">Story not found.</div>
          <Link href="/stories" className="mt-4 inline-block text-sm text-[var(--green)] underline">
            Back to Stories
          </Link>
        </div>
      </main>
    );
  }

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.slug !== post.slug)
    .slice(0, 3);

  const authorName = post.author || post.sub.split('|')[0]?.trim() || 'Creanote Creator';
  const authorRole = post.authorRole || post.sub.split('|')[2]?.trim() || 'Creator';
  const cover =
    post.coverImage ||
    post.thumbUrl ||
    placeholderUrl(post.headline || 'Creanote Story Cover', 1200, 675);

  const paragraphs = post.content
    ? post.content.split('\n\n')
    : [
        'Every creative journey is punctuated by moments of uncertainty and breakthroughs. Documenting the process helps not only the author synthesize their learnings, but also provides a blueprint for the next creator who walks this path.',
        'When building something new, feedback loops matter. By embracing transparency, creators discover a community of collaborators, early supporters, and peers who value the craft.',
      ];

  return (
    <main className="min-h-screen bg-[#060a07] text-[var(--text)]">
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onContributeClick={() => setIsContributeOpen(true)}
      />

      {/* Article Header & Breadcrumbs */}
      <article className="mx-auto max-w-[920px] px-6 py-10 md:px-8 md:py-16">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] transition hover:text-[var(--green)]"
          >
            <ArrowLeft size={14} />
            Back to All Stories
          </Link>

          <span className="rounded bg-[var(--green)]/15 px-3 py-1 font-['Ubuntu'] text-[11px] font-black uppercase tracking-wider text-[var(--green)]">
            {post.category || 'CREATOR NOTE'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-['Ubuntu'] text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
          {post.headline}
        </h1>

        {/* Author & Meta Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] py-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--green)] flex items-center justify-center bg-[#0c1611]">
              {(post as any).authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={(post as any).authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-lg font-bold text-white">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="font-['Ubuntu'] text-sm font-bold text-white">
                {authorName}
              </div>
              <div className="text-xs text-[var(--muted)]">{authorRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--orange)]">
              <Calendar size={13} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime || '4 min read'}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Story link copied to clipboard!');
              }}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-white transition hover:border-[var(--green)] hover:text-[var(--green)]"
              aria-label="Share story"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>
        </div>

        {/* Story Cover Image */}
        <div className="relative my-8 aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-white/[0.08]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={post.headline}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed text-neutral-300">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-base leading-relaxed md:text-lg">
              {p}
            </p>
          ))}

          {/* Featured Pull Quote Block */}
          <div className="my-8 rounded-[16px] border-l-4 border-[var(--green)] border border-white/[0.08] bg-[#0d1611] p-6">
            <p className="font-['Ubuntu'] text-lg font-bold italic text-white md:text-xl">
              &ldquo;{post.headline}&rdquo;
            </p>
            <div className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              — {authorName}
            </div>
          </div>
        </div>

        {/* Author Bio Box */}
        <button 
          type="button"
          onClick={() => setIsAuthorLightboxOpen(true)}
          className="w-full text-left block relative mt-14 rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-6 md:p-8 hover:border-[var(--green)]/30 transition-colors group cursor-pointer"
        >
          {/* Preview Icon at the edge */}
          <div className="absolute right-6 top-6 text-neutral-500 transition-colors group-hover:text-[var(--green)]">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[var(--green)] flex items-center justify-center bg-[#0c1611]">
              {(post as any).authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={(post as any).authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-2xl font-bold text-white">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="pr-8">
              <h4 className="font-['Ubuntu'] text-base font-bold text-white">
                About {authorName}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                {authorRole}. An active contributor to Creanote, sharing weekly
                milestones, development notes, and creative reflections.
              </p>
            </div>
          </div>
        </button>
      </article>

      {/* Related Stories Section */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[#090f0b] px-6 py-14 md:px-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-['Ubuntu'] text-2xl font-bold text-white">
                More Stories & Notes
              </h2>
              <Link href="/stories" className="text-xs font-bold text-[var(--green)] hover:underline">
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rel, idx) => (
                <Link
                  key={rel.id || idx}
                  href={`/stories/${rel.slug || rel.id || (rel as any)._id}`}
                  className="group flex flex-col no-underline text-inherit"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] border border-white/[0.08] bg-black transition-colors duration-300 group-hover:border-white/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        rel.coverImage ||
                        rel.thumbUrl ||
                        placeholderUrl(rel.headline, 640, 400)
                      }
                      alt={rel.headline}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--green)] text-black opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                  <div className="mt-3 font-['Ubuntu'] text-sm font-bold text-white transition group-hover:text-[var(--green)] line-clamp-2">
                    {rel.headline}
                  </div>
                  <div className="mt-1 text-xs text-[var(--orange)] font-bold">
                    {rel.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterBand />
      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={allPosts}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
      />

      {/* Author Lightbox */}
      {isAuthorLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsAuthorLightboxOpen(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-[24px] border border-[var(--border)] bg-[#090f0b] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAuthorLightboxOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <div className="mx-auto mb-6 flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--green)] bg-[#0c1611]">
              {(post as any).authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={(post as any).authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-5xl font-bold text-white">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <h3 className="font-['Ubuntu'] text-2xl font-bold text-white">
              {authorName}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {authorRole}. An active contributor to Creanote, sharing weekly milestones, development notes, and creative reflections.
            </p>
            
            <Link 
              href={`/stories?author=${encodeURIComponent(authorName)}`}
              onClick={() => setIsAuthorLightboxOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-6 py-3.5 font-['Ubuntu'] text-[13px] font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(0,208,132,0.35)]"
            >
              View all stories
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
