'use client';

import React, { useState } from 'react';

interface OverviewProps {
  topCount: number;
  postCount: number;
  quoteCount: number;
  heroCount: number;
  subCount: number;
  onRefresh: () => void;
}

export const OverviewManager: React.FC<OverviewProps> = ({
  topCount,
  postCount,
  quoteCount,
  heroCount,
  subCount,
  onRefresh,
}) => {
  const [seedStatus, setSeedStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setSeedStatus('Seeding database with default Creanote content...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedStatus(data.message || 'Database seeded successfully!');
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error seeding database';
      setSeedStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Top Highlights', count: topCount, color: 'var(--green)' },
    { label: 'Posts & Stories', count: postCount, color: 'var(--orange)' },
    { label: 'Quotes', count: quoteCount, color: '#38bdf8' },
    { label: 'Hero Slides', count: heroCount, color: '#a855f7' },
    { label: 'Subscribers', count: subCount, color: '#ec4899' },
  ];

  return (
    <div>
      <div className="section-label" style={{ marginBottom: '8px' }}>
        CMS Dashboard Overview
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '28px' }}>
        Manage all content on the Creanote platform, add new stories, adjust top highlights, and track community members.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="admin-card"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>
          Database Initialization & Seeding
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
          If your MongoDB collections are empty, you can initialize them with the original Creanote Figma dataset with one click.
        </p>
        <button
          className="admin-btn-primary"
          onClick={handleSeed}
          disabled={loading}
          data-testid="seed-database-btn"
        >
          {loading ? 'Seeding...' : 'Seed Database with Default Data'}
        </button>
        {seedStatus && (
          <div style={{ marginTop: '12px', color: 'var(--green)', fontSize: '13px' }}>
            {seedStatus}
          </div>
        )}
      </div>
    </div>
  );
};
