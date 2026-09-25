'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterBand } from '@/components/NewsletterBand';
import { QuoteData } from '@/components/QuoteBand';
import { defaultQuotes } from '@/lib/defaultData';
import { DotsLoader } from '@/components/DotsLoader';

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteData | null>(
    defaultQuotes.find((item) => item.id === params.id) || null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Quote not found');
        return response.json();
      })
      .then(setQuote)
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <main>
      <Navbar />
      <section className="quote-detail section">
        <Link href="/quotes" className="back-link">← Back to quotes</Link>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="font-['Ubuntu'] text-sm font-bold text-[var(--muted)] tracking-widest uppercase">Loading Quote</div>
            <DotsLoader />
          </div>
        ) : quote ? (
          <article className="quote-detail-card">
            {quote.bannerUrl && (
              <div className="quote-detail-banner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quote.bannerUrl} alt={quote.boldText} />
              </div>
            )}
            <div className="quote-mark">&quot;</div>
            <h1 className="quote-bold">{quote.boldText}</h1>
            <p className="quote-body">{quote.bodyText}</p>
            <div className="quote-detail-meta">
              <span className="quote-tag badge-orange">{quote.tagText || 'QUOTE'}</span>
              <p className="quote-caption">{quote.caption}</p>
              <p className="quote-credit">{quote.credit || 'CREANOTE QUOTE TIMELINE'}</p>
            </div>
            <div className="quote-detail-person">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={quote.avatarUrl} alt={quote.name} />
              <div>
                <strong>{quote.name}</strong>
                <span>{quote.role}</span>
              </div>
            </div>
          </article>
        ) : (
          <p className="quote-empty">This quote could not be found.</p>
        )}
      </section>
      <NewsletterBand />
      <Footer />
    </main>
  );
}
