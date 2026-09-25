'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ContributeModal } from '@/components/ContributeModal';
import { QuoteCardVisual } from '@/components/QuoteCardVisual';
import { QuoteLightbox } from '@/components/QuoteLightbox';
import { QuoteData } from '@/components/QuoteBand';

import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 4;

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [quoterNames, setQuoterNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuoter, setSelectedQuoter] = useState<string>('ALL');
  const [dateSort, setDateSort] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = () => {
    setIsSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          searchBarRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
          searchInputRef.current?.focus();
        }, 120);
      }
      return next;
    });
  };

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        paginated: 'true',
        page: currentPage.toString(),
        limit: PAGE_SIZE.toString(),
        sort: dateSort,
      });
      if (selectedQuoter !== 'ALL') params.append('name', selectedQuoter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/quotes?${params.toString()}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.data) {
          setQuotes(payload.data);
          setTotalPages(payload.totalPages || 1);
          setTotalQuotes(payload.total || 0);
          if (payload.quoters) setQuoterNames(payload.quoters);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch quotes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when dependencies change
  useEffect(() => {
    fetchQuotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedQuoter, dateSort]);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchQuotes();
    }, 300);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Dynamic hero quote from admin / data: finds active hero quote or fallback to first
  const heroQuote = quotes.find((q) => q.isActive) || quotes[0] || {
    boldText: 'there is no true road to success, work harder than ever.',
    author: 'Anonymous',
    name: 'Anonymous',
  };

  const currentSafePage = Math.min(currentPage, totalPages);
  const visibleQuotes = quotes;

  const hasActiveFilters =
    selectedQuoter !== 'ALL' || dateSort !== 'NEWEST' || searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#060a07]">
      <Navbar
        onSearchClick={() => setIsSearchModalOpen(true)}
        onContributeClick={() => setIsContributeOpen(true)}
      />

      {/* Hero Quote Banner - Dynamic from Admin/Data (Figma Node 56-626) */}
      <section className="w-full bg-[var(--green)] px-6 py-16 text-center text-neutral-950 md:py-24" data-testid="quotes-hero-section">
        <div className="mx-auto max-w-[960px]">
          <div className="mb-4 inline-flex items-center rounded-full bg-black/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-neutral-900">
            Quotes
          </div>
          <h1
            className="font-['Ubuntu'] text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            data-testid="quotes-hero-headline"
          >
            &ldquo;{heroQuote.boldText.replace(/^["“”]|["“”]$/g, '')}&rdquo;
          </h1>
          <p
            className="mt-4 font-['Ubuntu'] text-base font-bold text-neutral-900/80 sm:text-lg"
            data-testid="quotes-hero-author"
          >
            {(heroQuote.author || heroQuote.name || 'Anonymous').replace(/^[\s—–-]+/, '')}
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={handleToggleSearch}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/20 bg-black/10 px-5 py-2 font-['Ubuntu'] text-xs font-bold text-neutral-900 transition hover:bg-black/20 hover:border-black/40 active:scale-95"
              data-testid="quotes-search-btn"
            >
              <Search size={14} />
              {isSearchVisible ? 'Hide Search & Filters' : 'Search & Filter Quotes'}
            </button>
          </div>
        </div>
      </section>

      {/* Quotes Canvas Grid Section - Matching Figma 2x2 Layout */}
      <section className="bg-[var(--green)] pb-20 pt-4 px-6 md:px-12">
        <div className="mx-auto max-w-[1200px]">
          {/* Collapsible Hidden Search & Filter Bar at top of quotes (just below hero quote) */}
          <div
            ref={searchBarRef}
            className={`transition-all duration-700 ease-in-out ${
              isSearchVisible
                ? 'max-h-[500px] opacity-100 mb-8 pointer-events-auto'
                : 'max-h-0 opacity-0 mb-0 overflow-hidden pointer-events-none'
            }`}
            data-testid="quotes-filter-bar"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-black/15 bg-white/70 p-4 shadow-lg backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search Input Box */}
                <div className="relative flex min-w-[200px] max-w-[320px] flex-1 items-center">
                  <Search size={15} className="absolute left-3.5 text-neutral-500 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by quoter name..."
                    className="w-full rounded-full border border-black/15 bg-white py-1.5 pl-9 pr-8 font-['Ubuntu'] text-xs font-bold text-neutral-950 placeholder:text-neutral-500 outline-none transition focus:border-black/40"
                    data-testid="quotes-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-2.5 text-neutral-400 hover:text-black cursor-pointer"
                      title="Clear"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Quoter Name Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="quoter-select" className="font-['Ubuntu'] text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Quoter:
                  </label>
                  <select
                    id="quoter-select"
                    value={selectedQuoter}
                    onChange={(e) => {
                      setSelectedQuoter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer rounded-full border border-black/15 bg-white px-3.5 py-1.5 font-['Ubuntu'] text-xs font-bold text-neutral-950 outline-none transition hover:border-black/30"
                    data-testid="quotes-quoter-select"
                  >
                    <option value="ALL">All Quoters ({quotes.length})</option>
                    {quoterNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Sorter / Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="date-sort-select" className="font-['Ubuntu'] text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Sort Date:
                  </label>
                  <select
                    id="date-sort-select"
                    value={dateSort}
                    onChange={(e) => {
                      setDateSort(e.target.value as 'NEWEST' | 'OLDEST');
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer rounded-full border border-black/15 bg-white px-3.5 py-1.5 font-['Ubuntu'] text-xs font-bold text-neutral-950 outline-none transition hover:border-black/30"
                    data-testid="quotes-date-select"
                  >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                  </select>
                </div>

                {/* Clear / Reset Filters Button */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuoter('ALL');
                      setDateSort('NEWEST');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer rounded-full bg-neutral-950 px-3.5 py-1.5 font-['Ubuntu'] text-xs font-bold text-white transition hover:bg-neutral-800"
                    data-testid="quotes-reset-filters-btn"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Right side: Results count & Close button */}
              <div className="flex items-center gap-3">
                <span className="font-['Ubuntu'] text-xs font-bold text-neutral-900/80">
                  Showing {visibleQuotes.length} of {totalQuotes} quotes
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchVisible(false)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/10 text-neutral-800 transition hover:bg-black/20 hover:text-black"
                  title="Close search bar"
                  aria-label="Close search bar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-[20px] bg-[#0C100D] relative border border-white/5 animate-pulse min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          ) : visibleQuotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {visibleQuotes.map((q, idx) => {
                const globalIndex = (currentSafePage - 1) * PAGE_SIZE + idx;
                return (
                  <div
                    key={q.id || idx}
                    className="group relative flex flex-col overflow-hidden rounded-[20px] transition-all duration-300"
                    data-testid={`quotes-grid-item-${idx}`}
                  >
                    <QuoteCardVisual
                      boldText={q.boldText}
                      bodyText={q.bodyText}
                      author={q.author || q.name}
                      name={q.name}
                      role={q.role}
                      tagText={q.tagText}
                      avatarUrl={q.avatarUrl}
                      imageUrl={q.imageUrl || q.bannerUrl}
                      onClick={() => setLightboxIndex(idx)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] bg-black/10 py-16 text-center">
              <p className="font-['Ubuntu'] text-lg font-bold text-neutral-950">
                No quotes found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="mt-3 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-900 underline hover:text-black"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Numbered Pagination (< 1 2 3 >) */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2" data-testid="quotes-pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentSafePage === 1}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-neutral-950 font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous Page"
                data-testid="quotes-prev-page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Pagination in sets of 3 */}
              {(() => {
                const SET_SIZE = 3;
                const currentSet = Math.floor((currentSafePage - 1) / SET_SIZE);
                const startPage = currentSet * SET_SIZE + 1;
                const endPage = Math.min(startPage + SET_SIZE - 1, totalPages);
                const pages = Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => startPage + i
                );

                return (
                  <>
                    {startPage > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(startPage - 1)}
                        className="flex h-10 min-w-10 px-2 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-transparent font-['Ubuntu'] text-sm font-bold text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                        title="Previous set"
                        data-testid="quotes-prev-set"
                      >
                        ...
                      </button>
                    )}

                    {pages.map((pageNum) => {
                      const isActive = pageNum === currentSafePage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 font-['Ubuntu'] text-sm font-bold transition ${
                            isActive
                              ? 'bg-neutral-950 text-[var(--green)] shadow-lg'
                              : 'bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-white'
                          }`}
                          data-testid={`quotes-page-${pageNum}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {endPage < totalPages && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(endPage + 1)}
                        className="flex h-10 min-w-10 px-2 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-transparent font-['Ubuntu'] text-sm font-bold text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                        title="Next set"
                        data-testid="quotes-next-set"
                      >
                        ...
                      </button>
                    )}
                  </>
                );
              })()}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentSafePage === totalPages}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-neutral-950 font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next Page"
                data-testid="quotes-next-page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Action Row: Submit a Quote & Small Search Icon beside it */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsContributeOpen(true)}
              className="flex cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-transparent px-8 py-3 font-['Ubuntu'] text-sm font-bold text-neutral-950 shadow-sm transition hover:bg-neutral-950 hover:text-[var(--green)] active:scale-95"
              data-testid="submit-quote-btn"
            >
              Submit a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal on Image / Card Click */}
      {lightboxIndex !== null && (
        <QuoteLightbox
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          quotes={quotes}
          currentIndex={lightboxIndex}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}

      <Footer />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        quotes={quotes}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSubmitSuccess={fetchQuotes}
        defaultTab="quote"
      />
    </main>
  );
}
