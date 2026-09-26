'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuoteCardVisual } from './QuoteCardVisual';
import { QuoteLightbox } from './QuoteLightbox';
import { QuoteData } from './QuoteBand';

interface QuoteSectionProps {
  quotes: QuoteData[];
  title?: string;
  itemsPerPage?: number;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  quotes,
  title = 'Quote',
  itemsPerPage = 3,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!quotes || quotes.length === 0) return null;

  const currentQuotes = quotes.slice(0, itemsPerPage);

  const handleOpenLightbox = (indexInSlice: number) => {
    setLightboxIndex(indexInSlice);
  };

  return (
    <section
      className="w-full bg-[#060a07] px-6 py-12 md:px-10 md:py-16"
      data-testid="quote-section"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-['Ubuntu'] text-2xl font-bold tracking-tight text-white md:text-3xl">
            {title}
          </h2>
          <Link
            href="/quotes"
            className="group flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[#0c120e] px-4 py-2 text-xs font-bold text-[var(--green)] transition hover:border-[var(--green)] hover:bg-[var(--green)] hover:text-black"
            data-testid="see-more-quotes-btn"
          >
            <span>See more quotes</span>
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* 3-Column Isometric Quote Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentQuotes.map((q, idx) => {
            return (
              <div
                key={q.id || idx}
                className="flex flex-col"
                data-testid={`quote-card-item-${idx}`}
              >
                {/* Pure Quote Image Card */}
                <QuoteCardVisual
                  imageUrl={q.imageUrl}
                  onClick={() => handleOpenLightbox(idx)}
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <QuoteLightbox
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          quotes={quotes}
          currentIndex={lightboxIndex}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
    </section>
  );
};
