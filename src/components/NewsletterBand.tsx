'use client';

import React, { useState } from 'react';

interface NewsletterBandProps {
  onSubscribe?: (email: string) => Promise<boolean> | void;
}

export const NewsletterBand: React.FC<NewsletterBandProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Thank you for subscribing! You are now on the list.');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="nl-band" data-testid="newsletter-band">
      <div className="nl-inner">
        <div className="nl-card">
          <div className="nl-card-content">
            <div className="nl-title">Get on the List</div>
            <div className="nl-desc">
              Stay updated with new releases, insights, and exclusive announcements.
            </div>
          </div>
        </div>
        <div>
          <div className="nl-label">
            Enter your email below to stay connected with the creative community.
          </div>
          <form className="nl-form" onSubmit={handleSubmit}>
            <input
              className="nl-input"
              type="email"
              placeholder="Enter mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              required
              data-testid="newsletter-input"
            />
            <button
              type="submit"
              className="nl-submit"
              disabled={status === 'loading'}
              data-testid="newsletter-submit"
            >
              {status === 'loading' ? 'Sending...' : 'Send'}
            </button>
          </form>
          {message && (
            <div
              style={{
                marginTop: '10px',
                fontSize: '13px',
                color: status === 'success' ? 'var(--green)' : '#ef4444',
              }}
              data-testid="newsletter-message"
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
