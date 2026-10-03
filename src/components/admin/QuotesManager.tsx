'use client';

import React, { useState } from 'react';
import { QuoteData } from '../QuoteBand';
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
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [meaning, setMeaning] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setImageUrl('');
    setIsActive(false);
    setQuoteText('');
    setName('');
    setAvatarUrl('');
    setMeaning('');
    setStatus('');
  };

  const handleEdit = (q: QuoteData) => {
    setEditingId(q.id || (q as any)._id || null);
    setImageUrl(q.imageUrl || '');
    setIsActive(!!q.isActive);
    setQuoteText(q.quoteText || '');
    setName(q.name || '');
    setAvatarUrl(q.avatarUrl || '');
    setMeaning(q.meaning || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHero = async (q: QuoteData) => {
    const quoteId = q.id || (q as any)._id;
    if (!quoteId) return;
    setStatus('Updating quote status...');
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...q, isActive: !q.isActive }),
      });
      if (res.ok) {
        setStatus(`Quote ${!q.isActive ? 'set as active' : 'deactivated'}!`);
        addLog(`${!q.isActive ? 'Activated' : 'Deactivated'} quote image`, 'update');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error updating quote.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this quote?')) return;

    setDeletingId(id);
    setStatus('Deleting...');
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
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('Saving...');

    const payload = {
      imageUrl,
      isActive,
      quoteText,
      name,
      avatarUrl,
      meaning
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
          addLog(`Updated quote image`, 'update');
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
          addLog(`Uploaded new quote image`, 'create');
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
            {editingId ? 'Edit Quote' : 'Add New Quote'}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Quote
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} id="quote-form">
          <ImageUploadField
            label="Quote Image"
            value={imageUrl}
            onChange={setImageUrl}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
                User Name (Optional)
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
                User Avatar URL (Optional)
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="https://example.com/avatar.png"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
              Quote Text
            </label>
            <textarea
              className="admin-input min-h-[80px]"
              placeholder="Enter quote text..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
              What does this mean to you? (Optional)
            </label>
            <textarea
              className="admin-input min-h-[80px]"
              placeholder="User's reflection..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
          </div>

          <div className="mb-6 flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <div className="font-bold text-sm mb-1">Make Active</div>
              <div className="text-xs text-[var(--muted)]">If active, this quote will show on the main timeline.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
                data-testid="quote-is-active-toggle"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--green)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 text-xs font-bold text-[var(--muted)] hover:text-white transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || !imageUrl}
              className="admin-btn-primary flex items-center justify-center min-w-[120px]"
              data-testid="quote-submit-btn"
            >
              {isSaving ? <DotsLoader /> : editingId ? 'Update Quote' : 'Add Quote'}
            </button>
          </div>
          {status && (
            <p className="mt-4 text-xs font-bold text-[var(--green)] text-right">
              {status}
            </p>
          )}
        </form>
      </div>

      <div className="admin-card mt-8 overflow-hidden">
        <h4 className="text-base font-bold mb-4">Existing Quotes</h4>
        
        {quotes.length === 0 ? (
          <div className="text-center py-10 text-[var(--muted)] text-sm">
            No quotes available. Add one above.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedQuotes.map((q, idx) => {
                const quoteId = q.id || (q as any)._id;
                return (
                  <div 
                    key={quoteId || idx} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg border border-[var(--border)] bg-black/40 aspect-[3/4]"
                    onClick={() => setPreviewId(quoteId)}
                  >
                    {q.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={q.imageUrl} alt="Quote" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-[var(--muted)]">No Img</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold border backdrop-blur-md ${
                        q.isActive 
                          ? 'bg-[var(--green)]/30 text-[var(--green)] border-[var(--green)]/50' 
                          : 'bg-black/50 text-white border-white/20'
                      }`}>
                        {q.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {totalTablePages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-6">
                <span className="text-xs text-[var(--muted)]">
                  Showing {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, quotes.length)} of {quotes.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentTablePage(p => Math.max(1, p - 1))}
                    disabled={currentTablePage === 1}
                    className="px-3 py-1 text-xs bg-white/5 border border-[var(--border)] rounded disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentTablePage(p => Math.min(totalTablePages, p + 1))}
                    disabled={currentTablePage === totalTablePages}
                    className="px-3 py-1 text-xs bg-white/5 border border-[var(--border)] rounded disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Admin Quote Lightbox */}
            {previewId && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
                {(() => {
                  const q = quotes.find(quote => (quote.id || (quote as any)._id) === previewId);
                  if (!q) return null;
                  return (
                    <div className="relative flex flex-col items-center max-w-lg w-full">
                      <button
                        onClick={() => setPreviewId(null)}
                        className="absolute -top-12 right-0 text-white hover:text-[var(--orange)]"
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      {q.imageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={q.imageUrl} alt="Preview" className="w-full rounded-t-lg object-contain max-h-[50vh] shadow-2xl bg-black" />
                      )}
                      
                      <div className="w-full flex flex-col p-5 sm:p-6 bg-[#0a0f0c] border border-[var(--border)] rounded-b-lg shadow-2xl">
                        {(q.quoteText || q.meaning || q.name) && (
                          <div className="mb-6 flex flex-col gap-4">
                            {(q.quoteText || q.meaning) && (
                              <div className="flex flex-col gap-2">
                                {q.quoteText && (
                                  <p className="text-sm italic text-white/90 font-serif leading-relaxed">"{q.quoteText}"</p>
                                )}
                                {q.meaning && (
                                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                                    <strong className="text-white/70">Meaning:</strong> {q.meaning}
                                  </p>
                                )}
                              </div>
                            )}
                            {(q.name || q.avatarUrl) && (
                              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                {q.avatarUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={q.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[var(--muted)] uppercase">
                                    {q.name ? q.name.charAt(0) : 'U'}
                                  </div>
                                )}
                                {q.name && <span className="text-xs font-bold text-white tracking-wide">{q.name}</span>}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                          <div className="text-xs text-[var(--muted)]">
                            <span className={q.isActive ? 'text-[var(--green)] font-bold tracking-wide uppercase' : 'text-white/50 tracking-wide uppercase'}>
                              {q.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setPreviewId(null);
                                handleEdit(q);
                              }}
                              className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-gray-200 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setPreviewId(null);
                                handleDelete(previewId);
                              }}
                              className="px-4 py-2 text-xs font-bold text-white bg-[var(--orange)] hover:bg-[#d64a2a] rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
