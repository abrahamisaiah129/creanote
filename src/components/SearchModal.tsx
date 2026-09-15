'use client';

import React, { useState } from 'react';
import { PostData } from './PostRow';
import { TopCardData } from './TopCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostData[];
  topItems: TopCardData[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  topItems,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredPosts = posts.filter(
    (p) =>
      p.headline.toLowerCase().includes(query.toLowerCase()) ||
      p.sub.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCards = topItems.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.meta && c.meta.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="search-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close search"
        >
          &times;
        </button>
        <h3 style={{ fontFamily: 'Ubuntu', fontSize: '20px', marginBottom: '16px' }}>
          Search Creanote
        </h3>
        <input
          type="text"
          className="nl-input"
          style={{ width: '100%', marginBottom: '20px' }}
          placeholder="Search stories, notes, creators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          data-testid="search-input"
        />

        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {query && (
            <>
              <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Stories ({filteredPosts.length})
              </div>
              {filteredPosts.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    {p.headline}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {p.sub}
                  </div>
                </div>
              ))}

              <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', margin: '20px 0 10px 0' }}>
                Top Highlights ({filteredCards.length})
              </div>
              {filteredCards.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    {c.title}
                  </div>
                  {c.meta && (
                    <div style={{ fontSize: '12px', color: 'var(--orange)' }}>
                      {c.meta}
                    </div>
                  )}
                </div>
              ))}

              {filteredPosts.length === 0 && filteredCards.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}
            </>
          )}
          {!query && (
            <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
              Type to search stories, quotes, and creative notes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
