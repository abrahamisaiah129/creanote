'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface QuoteData {
  id?: string;
  imageUrl?: string;
  createdAt?: string | Date;
  isActive?: boolean;
  order?: number;
}

interface QuoteBandProps {
  quotes: QuoteData[];
}

export const QuoteBand: React.FC<QuoteBandProps> = ({ quotes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[activeIndex] || quotes[0];
  const currentSafeId = currentQuote.id || (currentQuote as any)._id;
  const quoteHref = currentSafeId ? `/quotes/${currentSafeId}` : '/quotes';
  const dots = quotes.length > 1 ? (
    <div className="flex gap-1.5 quote-banner-dots">
      {quotes.map((_, idx) => (
        <button
          key={idx}
          type="button"
          className={`h-[7px] w-[7px] cursor-pointer rounded-full border-0 bg-[var(--muted)] transition-colors ${idx === activeIndex ? 'active bg-[var(--green)]' : ''}`}
          onClick={() => setActiveIndex(idx)}
          aria-label={`Show quote ${idx + 1}`}
          data-testid={`quote-dot-${idx}`}
        />
      ))}
    </div>
  ) : null;

  return (
    <div className="border-y border-[var(--border)] bg-[var(--bg2)] px-10 py-14 max-md:px-6" data-testid="quote-band">
      <div className="relative mx-auto max-w-[1280px]">
        <Link href={quoteHref} className="quote-link" aria-label="Read quote">
          <div className="relative aspect-[2000/1031] w-full overflow-hidden rounded-[14px] bg-black border border-white/[0.08] transition-colors duration-300 hover:border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentQuote.imageUrl}
              alt="Creanote Quote"
              className="block h-full w-full object-contain"
            />
          </div>
        </Link>
        {dots}
      </div>
    </div>
  );
};
