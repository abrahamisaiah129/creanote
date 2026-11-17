"use client";

import React, { useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import { QuoteData } from "./QuoteBand";

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
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentQuote) return null;

  const imgSrc = currentQuote.imageUrl;
  const originalUrl = currentQuote.originalUrl?.trim();
  const canOpenOriginalUrl = Boolean(
    originalUrl && /^https?:\/\//i.test(originalUrl),
  );

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
        className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col items-stretch justify-center gap-4 overflow-y-auto animate-in fade-in zoom-in-95 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.12] bg-[#0a110d] transition-colors duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="Quote"
            className="max-h-[70vh] w-full max-w-full object-contain md:max-h-[82vh]"
            data-testid="lightbox-image"
          />
        </div>

        <div className="flex w-full shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[#0a110d] p-5 md:w-1/3 md:max-w-sm">
          <div>
            {currentQuote.name && (
              <h2 className="font-['Ubuntu'] text-lg font-bold text-white">
                {currentQuote.name}
              </h2>
            )}
            {currentQuote.meaning && (
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {currentQuote.meaning}
              </p>
            )}
            {canOpenOriginalUrl && (
              <a
                href={originalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[var(--green)] px-4 py-2 font-['Ubuntu'] text-xs font-bold text-black transition hover:bg-[var(--green)]/80"
                data-testid="lightbox-original-link"
              >
                Go to original link
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
            <span className="font-['Ubuntu'] font-bold text-white/80">
              Quote {currentIndex + 1} of {quotes.length}
            </span>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(imgSrc || "");
                  alert("Quote image link copied to clipboard!");
                }
              }}
              className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-['Ubuntu'] text-xs font-bold text-white transition hover:border-[var(--green)] hover:text-[var(--green)]"
              data-testid="lightbox-share-btn"
            >
              <Share2 size={13} />
              Copy Image Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
