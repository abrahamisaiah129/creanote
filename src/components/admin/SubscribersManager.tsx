'use client';

import React, { useState } from 'react';

interface SubscriberItem {
  _id?: string;
  email: string;
  createdAt?: string | Date;
}

interface SubscribersManagerProps {
  subscribers: SubscriberItem[];
}

export const SubscribersManager: React.FC<SubscribersManagerProps> = ({ subscribers }) => {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="section-label">Newsletter Subscribers ({subscribers.length})</div>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
        Community members who have requested updates, notes, and exclusive announcements from Creanote.
      </p>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          <input
            className="admin-input"
            style={{ maxWidth: '360px', margin: 0 }}
            placeholder="Search email address..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            className="admin-btn-primary"
            onClick={handleCopyAll}
            data-testid="copy-subscribers-btn"
          >
            {copied ? 'Copied to Clipboard!' : 'Copy All Emails'}
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email Address</th>
              <th>Subscribed Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub, idx) => (
              <tr key={sub._id || idx}>
                <td style={{ color: 'var(--muted)', width: '50px' }}>{idx + 1}</td>
                <td style={{ fontWeight: 600, color: 'var(--text)' }}>{sub.email}</td>
                <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                  {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Just now'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
