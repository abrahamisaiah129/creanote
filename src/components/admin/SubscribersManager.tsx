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

/**
 * SubscribersManager Component
 * 
 * Data Flow:
 * 1. Receives an array of `subscribers` via props from the parent AdminLayout/page.
 * 2. Maintains a local `filter` state for client-side search by email.
 * 3. `filtered` array is derived dynamically on every render based on the search input.
 * 4. Pagination is computed client-side using `filtered.slice`.
 */
export const SubscribersManager: React.FC<SubscribersManagerProps> = ({ subscribers }) => {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  // Derived state: Filter subscribers matching the search query
  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(filter.toLowerCase())
  );

  /**
   * Copies all currently visible (filtered) emails to the system clipboard
   * as a comma-separated string, useful for newsletter campaigns.
   */
  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Client-side pagination constants and derived state
  const ITEMS_PER_PAGE = 10;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const totalTablePages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  
  // Slice the filtered array to display only the current page's subscribers
  const paginatedSubscribers = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentTablePage(1);
  }, [filter]);

  return (
    <div>
      <div className="section-label">Newsletter Subscribers ({subscribers.length})</div>
      <p className="text-[var(--muted)] text-sm mb-6">
        Community members who have requested updates, notes, and exclusive announcements from Creanote.
      </p>

      <div className="admin-card">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center mb-4">
          <input
            className="admin-input sm:max-w-[360px] m-0 w-full"
            placeholder="Search email address..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="flex items-center gap-3">
            {filtered.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTablePage(p => Math.max(1, p - 1))}
                  disabled={currentTablePage === 1}
                  className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  &larr;
                </button>
                <span className="text-xs text-[var(--muted)] font-bold">
                  Page {currentTablePage} of {totalTablePages}
                </span>
                <button
                  onClick={() => setCurrentTablePage(p => Math.min(totalTablePages, p + 1))}
                  disabled={currentTablePage === totalTablePages}
                  className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  &rarr;
                </button>
              </div>
            )}
            <button
              className="admin-btn-primary shrink-0 text-xs py-2.5 px-4"
              onClick={handleCopyAll}
              data-testid="copy-subscribers-btn"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy All Emails'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="admin-table min-w-[480px]">
            <thead>
              <tr>
                <th>#</th>
                <th>Email Address</th>
                <th>Subscribed Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubscribers.map((sub, idx) => (
                <tr key={sub._id || startIdx + idx}>
                  <td className="text-[var(--muted)] w-[50px]">{startIdx + idx + 1}</td>
                  <td className="font-semibold text-[var(--text)]">{sub.email}</td>
                  <td className="text-[var(--muted)] text-xs">
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Just now'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-[var(--muted)] p-6">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
