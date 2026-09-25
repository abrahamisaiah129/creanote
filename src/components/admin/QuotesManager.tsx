'use client';

import React, { useState } from 'react';
import { QuoteData } from '../QuoteBand';
import { placeholderUrl } from '@/lib/defaultData';
import { ImageUploadField } from '../ImageUploadField';
import { DotsLoader } from '../DotsLoader';
import { useActivityLog } from '@/context/ActivityLogContext';

interface QuotesManagerProps {
  quotes: QuoteData[];
  onRefresh: () => void;
}

export const QuotesManager: React.FC<QuotesManagerProps> = ({ quotes, onRefresh }) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [boldText, setBoldText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [tagText, setTagText] = useState('QUOTE');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('CREANOTE QUOTE TIMELINE');
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('@creanote_hq');
  const [avatarUrl, setAvatarUrl] = useState(placeholderUrl('Quote avatar', 160, 160));
  const [bannerUrl, setBannerUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setBoldText('');
    setBodyText('');
    setTagText('QUOTE');
    setCaption('');
    setCredit('CREANOTE QUOTE TIMELINE');
    setAuthor('');
    setName('');
    setRole('@creanote_hq');
    setAvatarUrl(placeholderUrl('Quote avatar', 160, 160));
    setBannerUrl('');
    setImageUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsActive(false);
    setStatus('');
  };

  const handleEdit = (q: QuoteData) => {
    setEditingId(q.id || null);
    setBoldText(q.boldText);
    setBodyText(q.bodyText);
    setTagText(q.tagText || 'QUOTE');
    setCaption(q.caption);
    setCredit(q.credit || 'CREANOTE QUOTE TIMELINE');
    setAuthor(q.author || q.name || '');
    setName(q.name);
    setRole(q.role);
    setAvatarUrl(q.avatarUrl);
    setBannerUrl(q.bannerUrl || '');
    setImageUrl(q.imageUrl || '');
    setDate(q.date || (typeof q.createdAt === 'string' ? q.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]));
    setIsActive(!!q.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHero = async (q: QuoteData) => {
    if (!q.id) return;
    setStatus('Updating hero banner quote...');
    try {
      const res = await fetch(`/api/quotes/${q.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...q, isActive: !q.isActive }),
      });
      if (res.ok) {
        setStatus(`Quote ${!q.isActive ? 'set as' : 'removed from'} hero banner!`);
        addLog(`${!q.isActive ? 'Set' : 'Removed'} hero quote: "${q.boldText}"`, 'update');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error updating hero banner quote.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Quote deleted successfully.');
        addLog('Deleted a quote', 'delete');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting quote.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      boldText,
      bodyText,
      tagText,
      caption,
      credit,
      name,
      author: author || name,
      role,
      avatarUrl,
      bannerUrl,
      imageUrl,
      date,
      isActive,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/quotes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Quote updated successfully!');
          addLog(`Updated quote: "${boldText}"`, 'update');
          resetForm();
          onRefresh();
        }
      } else {
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Quote created successfully!');
          addLog(`Created new quote: "${boldText}"`, 'create');
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving quote.');
    } finally {
      setIsSaving(false);
    }
  };

  const ITEMS_PER_PAGE = 5;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const totalTablePages = Math.ceil(quotes.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedQuotes = quotes.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="section-label m-0">Manage Quotes Timeline</div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            const el = document.getElementById('quote-form-card');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="admin-btn-primary text-xs py-2 px-3.5"
          data-testid="add-new-quote-btn"
        >
          + Add New Quote
        </button>
      </div>

      <div className="admin-card" id="quote-form-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold">
            {editingId ? 'Edit Quote' : 'Add New Creator Quote'}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Quote
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} id="quote-form">
          <div className="mb-4">
            <label className="text-xs text-[var(--muted)] uppercase">
              Headline / Bold Quote
            </label>
            <input
              className="admin-input"
              value={boldText}
              onChange={(e) => setBoldText(e.target.value)}
              placeholder="e.g. Your current struggle isn't your permanent reality."
              required
              data-testid="quote-bold-input"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-[var(--muted)] uppercase">
              Full Body Reflection
            </label>
            <textarea
              className="admin-textarea min-h-[80px]"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Don't be afraid to pivot your ideas or start over..."
              required
              data-testid="quote-body-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Caption Reminder
              </label>
              <input
                className="admin-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="This is your reminder that struggle doesn't mean failing..."
                required
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Tag Text & Credit
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2">
                <input
                  className="admin-input"
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  placeholder="QUOTE"
                />
                <input
                  className="admin-input"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  placeholder="CREANOTE QUOTE TIMELINE"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Quoter Name (Author)
              </label>
              <input
                className="admin-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. OLUWADARA AFOLABI"
                data-testid="quote-author-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Creator Display Name
              </label>
              <input
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Oluwadara Afolabi"
                required
                data-testid="quote-name-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Role / Handle
              </label>
              <input
                className="admin-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="@creanote_hq"
                required
                data-testid="quote-role-input"
              />
            </div>
            <ImageUploadField
              label="Quote Image / Graphic Visual"
              value={imageUrl}
              onChange={setImageUrl}
              fallbackPlaceholder=""
              testId="quote-image-input"
              aspectRatioHint="Recommended: 1:1 square or 4:3 high-res quote visual"
            />
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Quote Date
              </label>
              <input
                type="date"
                className="admin-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="quote-date-input"
              />
            </div>
            <ImageUploadField
              label="Author Avatar Visual (160x160)"
              value={avatarUrl}
              onChange={setAvatarUrl}
              fallbackPlaceholder={placeholderUrl('Quote avatar', 160, 160)}
              testId="quote-avatar-input"
              aspectRatioHint="Recommended: 1:1 circle/square avatar"
            />
          </div>

          <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[#090f0b] p-3">
            <input
              type="checkbox"
              id="isActiveQuote"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[var(--green)]"
              data-testid="quote-hero-checkbox"
            />
            <label htmlFor="isActiveQuote" className="cursor-pointer text-xs font-bold text-white select-none">
              Featured Hero Quote (Featured at top headline banner of Quotes Page)
            </label>
          </div>

          <div className="flex gap-3 items-center">
            <button type="submit" className="admin-btn-primary" disabled={isSaving} data-testid="quote-submit-btn">
              {isSaving ? <DotsLoader /> : (editingId ? 'Save Changes' : 'Create Quote')}
            </button>
            {editingId && (
              <button type="button" className="admin-tab-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
            {status && (
              <span className="text-[13px] text-[var(--green)]">
                {status}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h4 className="text-base font-bold flex items-center gap-3">
            Quotes Archive ({quotes.length})
          </h4>
          
          <div className="flex items-center gap-3">
            {quotes.length > 0 && (
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
              type="button"
              onClick={() => {
                resetForm();
                const el = document.getElementById('quote-form-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="admin-btn-primary text-xs py-1.5 px-3"
            >
              + Create New Quote
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="admin-table min-w-[650px]">
            <thead>
              <tr>
                <th>Creator / Quoter</th>
                <th>Bold Quote</th>
                <th>Date</th>
                <th>Hero Banner</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotes.map((q, idx) => (
                <tr key={q.id || idx}>
                  <td className="flex items-center gap-[10px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={q.avatarUrl}
                      alt={q.name}
                      className="w-8 h-8 rounded-full border border-[var(--green)]"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-white">{q.author || q.name}</span>
                      {q.author && q.name !== q.author && (
                        <span className="text-[10px] text-[var(--muted)]">{q.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[320px]">{q.boldText}</td>
                  <td className="text-xs text-[var(--muted)]">
                    {q.date || (typeof q.createdAt === 'string' ? q.createdAt.split('T')[0] : '—')}
                  </td>
                  <td>
                    {q.isActive ? (
                      <span className="whitespace-nowrap inline-block rounded-full bg-[var(--green)]/20 px-2.5 py-0.5 text-[11px] font-bold text-[var(--green)] border border-[var(--green)]/40">
                        Active Hero
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleHero(q)}
                        className="cursor-pointer rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[11px] font-bold text-neutral-300 hover:border-[var(--green)] hover:text-white"
                        title="Set this quote as the top hero headline on /quotes"
                        data-testid={`set-hero-quote-${idx}`}
                      >
                        Set as Hero
                      </button>
                    )}
                  </td>
                  <td className="text-[var(--muted)]">{q.role}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="admin-btn-edit"
                        onClick={() => handleEdit(q)}
                        data-testid={`edit-quote-btn-${idx}`}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn-danger"
                        onClick={() => handleDelete(q.id)}
                        data-testid={`delete-quote-btn-${idx}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
