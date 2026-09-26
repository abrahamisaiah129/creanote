'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { QuoteData } from './QuoteBand';

interface QuoteLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: QuoteData[];
  currentIndex: number;
  onNavigate?: (index: number) => void;
}

export const QuoteLightbox: React.FC<QuoteLightboxProps> = ({
  isOpen,
  onClose,
  quotes,
  currentIndex,
  onNavigate,
}) => {
  const currentQuote = quotes[currentIndex] || quotes[0];

  const handlePrev = useCallback(() => {
    if (!quotes.length || !onNavigate) return;
    const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    onNavigate(prevIndex);
  }, [currentIndex, quotes.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (!quotes.length || !onNavigate) return;
    const nextIndex = (currentIndex + 1) % quotes.length;
    onNavigate(nextIndex);
  }, [currentIndex, quotes.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentQuote) return null;

  const imgSrc = currentQuote.imageUrl;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/92 p-4 backdrop-blur-xl transition-all duration-300 sm:p-8"
      onClick={onClose}
      data-testid="quote-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Quote Image Gallery"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
        aria-label="Close Lightbox"
        data-testid="lightbox-close"
      >
        <X size={22} />
      </button>

      {/* Prev Navigation Button */}
      {quotes.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-[var(--green)] hover:text-[var(--green)] active:scale-90 max-md:hidden"
          aria-label="Previous quote"
          data-testid="lightbox-prev"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Next Navigation Button */}
      {quotes.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-[var(--green)] hover:text-[var(--green)] active:scale-90 max-md:hidden"
          aria-label="Next quote"
          data-testid="lightbox-next"
        >
          <ChevronRight size={26} />
        </button>
      )}

      {/* Image Gallery Lightbox Modal Content */}
      <div
        className="relative flex max-h-[92vh] max-w-[94vw] flex-col items-center justify-center animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-[20px] border border-white/[0.12] bg-[#0a110d] transition-colors duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="Quote"
            className="max-h-[75vh] w-auto max-w-[88vw] object-contain sm:max-h-[82vh]"
            data-testid="lightbox-image"
          />
        </div>

        {/* Sleek Bottom Gallery Bar */}
        <div className="mt-4 flex w-full max-w-[600px] items-center justify-between px-2 text-xs text-white/70">
          <span className="font-['Ubuntu'] font-bold text-white/80">
            Quote {currentIndex + 1} of {quotes.length}
          </span>
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(imgSrc || '');
                alert('Quote image link copied to clipboard!');
              }
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-['Ubuntu'] text-xs font-bold text-white transition hover:border-[var(--green)] hover:text-[var(--green)]"
            data-testid="lightbox-share-btn"
          >
            <Share2 size={13} />
            Copy Image Link
          </button>
        </div>
      </div>
    </div>
  );
};
