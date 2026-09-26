'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ContributeModal } from '@/components/ContributeModal';
import { QuoteCardVisual } from '@/components/QuoteCardVisual';
import { QuoteLightbox } from '@/components/QuoteLightbox';
import { QuoteData } from '@/components/QuoteBand';

const PAGE_SIZE = 8; // Load 8 images at a time for infinite scroll

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchQuotes = async (page: number, append = false) => {
    try {
      const params = new URLSearchParams({
        paginated: 'true',
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      });

      const res = await fetch(`/api/quotes?${params.toString()}`);
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.data) {
          if (append) {
            setQuotes((prev) => [...prev, ...payload.data]);
          } else {
            setQuotes(payload.data);
          }
          setTotalPages(payload.totalPages || 1);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch quotes:', e);
    }
  };

  // Initial fetch
  useEffect(() => {
    setIsLoading(true);
    fetchQuotes(1).finally(() => setIsLoading(false));
  }, []);

  // Infinite scroll intersection observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isFetchingMore && currentPage < totalPages) {
      setIsFetchingMore(true);
      const nextPage = currentPage + 1;
      fetchQuotes(nextPage, true).then(() => {
        setCurrentPage(nextPage);
        setIsFetchingMore(false);
      });
    }
  }, [currentPage, totalPages, isFetchingMore]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleContributeSuccess = () => {
    fetchQuotes(1);
    setCurrentPage(1);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white" data-testid="quotes-page">
      <Navbar onSearchClick={() => setIsSearchModalOpen(true)} />

      <section className="flex-1 pt-32 pb-24 lg:pt-48 lg:pb-32 px-6">
        <div className="mx-auto w-full max-w-[1280px]">
          
          <div className="mb-16 flex items-center justify-between">
            <h1 className="font-['Ubuntu'] text-[clamp(40px,5vw,72px)] font-extrabold leading-[1.1] text-neutral-950">
              Quotes
            </h1>
            
            <button
              type="button"
              onClick={() => setIsContributeOpen(true)}
              className="flex cursor-pointer items-center justify-center rounded-full border-2 border-neutral-950 bg-neutral-950 px-8 py-3 font-['Ubuntu'] text-sm font-bold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95"
              data-testid="submit-quote-btn"
            >
              Submit a Quote
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {quotes.map((q, idx) => (
              <div
                key={q.id || idx}
                className="group relative flex flex-col overflow-hidden rounded-[20px] transition-all duration-300"
                data-testid={`quotes-grid-item-${idx}`}
              >
                <QuoteCardVisual
                  imageUrl={q.imageUrl}
                  onClick={() => setLightboxIndex(idx)}
                />
              </div>
            ))}
            
            {/* Infinite Scroll Loaders & Trigger */}
            {(isLoading || isFetchingMore) && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={`skeleton-${i}`} className="flex flex-col overflow-hidden rounded-[20px] bg-[#0C100D] relative border border-white/5 animate-pulse min-h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                  </div>
                ))}
              </>
            )}
            
            <div ref={loaderRef} className="col-span-full h-10 w-full" />
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
        onSubmitSuccess={handleContributeSuccess}
        defaultTab="quote"
      />
    </main>
  );
}
