'use client';

import React from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  children,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'top-list', label: 'Top on List' },
    { id: 'posts', label: 'Posts & Stories' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'hero', label: 'Hero Slides' },
    { id: 'subscribers', label: 'Subscribers' },
  ];

  return (
    <div className="admin-container" data-testid="admin-layout">
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" className="logo" style={{ color: 'var(--text)' }}>
            <div className="logo-box">
              <svg viewBox="0 0 14 14">
                <rect x="1" y="1" width="5" height="5" rx="1" />
                <rect x="8" y="1" width="5" height="5" rx="1" />
                <rect x="1" y="8" width="5" height="5" rx="1" />
                <rect x="8" y="8" width="5" height="5" rx="1" />
              </svg>
            </div>
            Creanote CMS
          </Link>
          <span style={{ fontSize: '12px', background: 'var(--green)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            ADMIN
          </span>
        </div>

        <div className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
          <Link
            href="/"
            className="admin-tab-btn"
            style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.06)' }}
          >
            &larr; View Live Site
          </Link>
          {onLogout && (
            <button
              type="button"
              className="admin-tab-btn"
              onClick={onLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
              }}
              data-testid="admin-logout-btn"
            >
              Log Out
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px' }}>
        {children}
      </div>
    </div>
  );
};
