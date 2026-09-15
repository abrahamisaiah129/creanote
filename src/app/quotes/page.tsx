'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { QuoteBand, QuoteData } from '@/components/QuoteBand';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { defaultQuotes } from '@/lib/defaultData';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>(defaultQuotes);

  useEffect(() => {
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setQuotes(data);
      })
      .catch((e) => console.warn('Using default quotes:', e));
  }, []);

  return (
    <main>
      <Navbar />
      <div className="section">
        <div className="section-label">Creanote Quotes Timeline</div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '32px', maxWidth: '700px', lineHeight: 1.6 }}>
          A curated collection of thoughts, reflections, and reminders from creators navigating the highs and lows of the creative journey.
        </p>
      </div>

      <QuoteBand quotes={quotes} />

      <div className="section">
        <div className="section-label" style={{ marginTop: '20px' }}>All Quotes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {quotes.map((q, idx) => (
            <div
              key={q.id || idx}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div style={{ color: 'var(--green)', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                &ldquo;
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '10px' }}>
                {q.boldText}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '16px' }}>
                {q.bodyText}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={q.avatarUrl || '/images/quote-avatar.jpg'}
                  alt={q.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--green)' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{q.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewsletterBand />
      <Footer />
    </main>
  );
}
