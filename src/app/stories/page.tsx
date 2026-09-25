'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { ContributeModal } from '@/components/ContributeModal';
import { SearchModal } from '@/components/SearchModal';
import { Pagination } from '@/components/Pagination';
import { PostData } from '@/components/PostRow';
import { placeholderUrl } from '@/lib/defaultData';
import { Clock, ArrowUpRight, BookOpen, PlusCircle, Search, X, SlidersHorizontal } from 'lucide-react';

export default function StoriesPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['ALL']);
  const [dynamicAuthors, setDynamicAuthors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSort, setDateSort] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [readingTimeFilter, setReadingTimeFilter] = useState<'ALL' | 'SHORT' | 'LONG'>('ALL');
  const [authorFilter, setAuthorFilter] = useState<string>('ALL');
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 6;

  const handleToggleSearch = () => {
    setIsSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          filterBarRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
          searchInputRef.current?.focus();
        }, 120);
      }
      return next;
    });
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        paginated: 'true',
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: dateSort,
      });
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (authorFilter !== 'ALL') params.append('author', authorFilter);
      if (readingTimeFilter !== 'ALL') params.append('readingTime', readingTimeFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.data) {
          setPosts(payload.data);
          setTotalPages(payload.totalPages || 1);
          setTotalPosts(payload.total || 0);
          if (payload.categories) setDynamicCategories(['ALL', ...payload.categories]);
          if (payload.authors) setDynamicAuthors(payload.authors);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch posts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when dependencies change
  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, authorFilter, readingTimeFilter, dateSort]);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPosts();
    }, 300);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    authorFilter !== 'ALL' ||
    readingTimeFilter !== 'ALL' ||
    dateSort !== 'NEWEST' ||
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setSelectedCategory('ALL');
    setAuthorFilter('ALL');
    setReadingTimeFilter('ALL');
    setDateSort('NEWEST');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  const currentSafePage = Math.min(currentPage, totalPages);
  const visiblePosts = posts;

  return (
    <main className="min-h-screen bg-[#060a07]">
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onContributeClick={() => setIsContributeOpen(true)}
      />

      {/* Header Banner */}
      <section className="border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
            Creanote Archives
          </div>
          <h1 className="font-['Ubuntu'] text-3xl font-extrabold text-white md:text-5xl">
            Creator Stories & Notes
          </h1>
          <p className="mt-3 max-w-[720px] text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Honest reflections, breakthrough milestones, and candid lessons
            shared by creators building in public.
          </p>

          {/* Collapsible Hidden Search & Filter Bar - Positioned at the TOP, right above the tags */}
          <div
            ref={filterBarRef}
            className={`transition-all duration-700 ease-in-out ${
              isSearchVisible
                ? 'max-h-[600px] opacity-100 mt-6 mb-6 pointer-events-auto'
                : 'max-h-0 opacity-0 overflow-hidden mt-0 mb-0 pointer-events-none'
            }`}
            data-testid="stories-filter-panel"
          >
            <div className="rounded-[20px] border border-white/[0.1] bg-[#0c1611]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Input & Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Real-time Search Input */}
                  <div className="relative flex w-full sm:w-auto sm:min-w-[240px] md:min-w-[280px] items-center">
                    <Search size={14} className="absolute left-3.5 text-[var(--muted)] pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search stories, creators, keywords..."
                      className="w-full rounded-full border border-white/[0.12] bg-[#111c15] py-2 pl-9 pr-8 font-['Ubuntu'] text-xs text-white placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--green)]"
                      data-testid="stories-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute right-3 text-[var(--muted)] hover:text-white cursor-pointer"
                        title="Clear"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Date Sorting Filter */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                    <label htmlFor="stories-date-sort" className="font-['Ubuntu'] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Date:
                    </label>
                    <select
                      id="stories-date-sort"
                      value={dateSort}
                      onChange={(e) => {
                        setDateSort(e.target.value as 'NEWEST' | 'OLDEST');
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer rounded-full border border-white/[0.1] bg-[#111c15] px-3.5 py-1.5 font-['Ubuntu'] text-xs font-semibold text-white outline-none transition hover:border-white/20 w-full sm:w-auto"
                      data-testid="stories-date-sort"
                    >
                      <option value="NEWEST">Newest First</option>
                      <option value="OLDEST">Oldest First</option>
                    </select>
                  </div>

                  {/* Reading Time Filter */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                    <label htmlFor="stories-time-filter" className="font-['Ubuntu'] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Read Time:
                    </label>
                    <select
                      id="stories-time-filter"
                      value={readingTimeFilter}
                      onChange={(e) => {
                        setReadingTimeFilter(e.target.value as 'ALL' | 'SHORT' | 'LONG');
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer rounded-full border border-white/[0.1] bg-[#111c15] px-3.5 py-1.5 font-['Ubuntu'] text-xs font-semibold text-white outline-none transition hover:border-white/20 w-full sm:w-auto"
                      data-testid="stories-time-filter"
                    >
                      <option value="ALL">All Lengths</option>
                      <option value="SHORT">Quick Reads (&lt; 4 min)</option>
                      <option value="LONG">In-depth (4+ min)</option>
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                    <label htmlFor="stories-author-filter" className="font-['Ubuntu'] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Author:
                    </label>
                    <select
                      id="stories-author-filter"
                      value={authorFilter}
                      onChange={(e) => {
                        setAuthorFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer rounded-full border border-white/[0.1] bg-[#111c15] px-3.5 py-1.5 font-['Ubuntu'] text-xs font-semibold text-white outline-none transition hover:border-white/20 w-full sm:w-auto"
                      data-testid="stories-author-filter"
                    >
                      <option value="ALL">All Authors ({dynamicAuthors.length})</option>
                      {dynamicAuthors.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset All Filters button */}
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="cursor-pointer rounded-full border border-[var(--orange)]/30 bg-[var(--orange)]/10 px-3.5 py-1.5 font-['Ubuntu'] text-xs font-bold text-[var(--orange)] transition hover:bg-[var(--orange)] hover:text-black whitespace-nowrap"
                      data-testid="stories-reset-filters-btn"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {/* Right: Results count & Close button */}
                <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                  <span className="font-['Ubuntu'] text-xs font-bold text-[var(--muted)]">
                    Showing {visiblePosts.length} of {totalPosts} {totalPosts === 1 ? 'story' : 'stories'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSearchVisible(false)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/5 text-[var(--muted)] transition hover:bg-white/15 hover:text-white"
                    title="Close search bar"
                    aria-label="Close search bar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Top Tags Pills Row with Search Button right beside the pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="stories-top-tags">
            {/* Search Button right beside the tags */}
            <button
              type="button"
              onClick={handleToggleSearch}
              data-testid="stories-search-btn"
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 font-['Ubuntu'] text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                isSearchVisible
                  ? 'border-[var(--green)] bg-[var(--green)] text-black'
                  : 'border-white/15 bg-white/5 text-white hover:border-[var(--green)] hover:text-[var(--green)]'
              }`}
              title="Search and filter stories"
              aria-label="Search and filter stories"
            >
              <Search size={14} />
              {isSearchVisible ? 'Hide Filters' : 'Search & Filters'}
              {hasActiveFilters && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--orange)] text-[10px] font-bold text-black">
                  !
                </span>
              )}
            </button>

            {/* Separator on desktop */}
            <div className="hidden sm:block h-4 w-[1px] bg-white/15 mx-1" />

            {/* Dynamic Top Tags Pills: Ranked by highest occurring order */}
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer rounded-full px-4 py-1.5 font-['Ubuntu'] text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[var(--green)] text-black'
                    : 'border border-white/[0.08] bg-[#0d1510] text-[var(--muted)] hover:border-[var(--green)] hover:text-white'
                }`}
                data-testid={`tag-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsContributeOpen(true)}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--green)]/40 bg-[var(--green)]/10 px-4 py-1.5 text-xs font-bold text-[var(--green)] transition hover:bg-[var(--green)] hover:text-black max-sm:ml-0 max-sm:mt-2 max-sm:w-full max-sm:justify-center"
            >
              <PlusCircle size={14} />
              Share Your Story
            </button>
          </div>
        </div>
      </section>

      {/* Stories Grid Section - Matching Quotes Page Grid Style with Image on Top & Text/Necessaries Below */}
      <section className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#0C100D] relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="h-3 w-1/3 bg-[#0C100D] rounded" />
                  <div className="h-5 w-3/4 bg-[#0C100D] rounded mt-2" />
                  <div className="h-5 w-1/2 bg-[#0C100D] rounded" />
                  <div className="h-3 w-1/4 bg-[#0C100D] rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post, idx) => {
              const storyUrl = `/stories/${post.slug || post.id || (post as any)._id || idx}`;
              const cover =
                post.coverImage ||
                post.thumbUrl ||
                placeholderUrl(post.headline, 1200, 800);
              const category = post.category || 'CREATOR NOTE';
              const readTime = post.readTime || '4 min read';
              const author = post.author || post.sub.split('|')[0]?.trim() || 'Creanote Creator';

              return (
                <Link
                  key={post.id || idx}
                  href={storyUrl}
                  className="group flex flex-col no-underline text-inherit"
                  data-testid={`story-card-${idx}`}
                >
                  {/* Story Card Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0c1510] transition-colors duration-300 group-hover:border-white/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={post.headline}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                    {/* Top Category Badge */}
                    <div className="absolute left-3.5 top-3.5 z-10 rounded-[4px] bg-[#0c1510]/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--green)] backdrop-blur-md">
                      {category}
                    </div>

                    {/* Corner Read Action Button */}
                    <div className="absolute bottom-3.5 right-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--green)] text-black opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-105">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Text Titles and Necessaries Below Each Card (User Request) */}
                  <div className="mt-4 flex flex-col">
                    {/* Date & Read Time */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-['Ubuntu'] font-bold uppercase tracking-wider text-[var(--orange)]">
                        {post.date}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                      <span className="flex items-center gap-1 text-[var(--muted)]">
                        <Clock size={12} />
                        {readTime}
                      </span>
                    </div>

                    {/* Main Story Headline */}
                    <h3 className="mt-2 font-['Ubuntu'] text-base font-bold leading-snug text-white transition-colors group-hover:text-[var(--green)] sm:text-lg">
                      {post.headline}
                    </h3>

                    {/* Author and Role Metadata */}
                    <div className="mt-2 text-xs text-[var(--muted)]">
                      By <span className="font-semibold text-white/90">{author}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[20px] border border-white/[0.08] bg-[#0c1510] py-16 text-center">
            <p className="font-['Ubuntu'] text-lg font-bold text-white">
              No creator stories found matching your filters.
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Try adjusting your search terms, author, or category selection.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 cursor-pointer rounded-full border border-[var(--green)] bg-[var(--green)]/10 px-5 py-2 font-['Ubuntu'] text-xs font-bold text-[var(--green)] transition hover:bg-[var(--green)] hover:text-black"
              data-testid="stories-empty-clear-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14">
            <Pagination
              currentPage={currentSafePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>

      <NewsletterBand />
      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSubmitSuccess={fetchPosts}
        defaultTab="story"
      />
    </main>
  );
}
