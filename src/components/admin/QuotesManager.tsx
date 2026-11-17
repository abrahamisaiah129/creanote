'use client';

import React, { useState } from 'react';
import { QuoteData } from '../QuoteBand';
import { ImageUploadField } from '../ImageUploadField';
import { DotsLoader } from '../DotsLoader';
import { useActivityLog } from '@/context/ActivityLogContext';

import { SuccessLightbox } from './SuccessLightbox';
import { ConfirmLightbox } from './ConfirmLightbox';

interface QuotesManagerProps {
  quotes: QuoteData[];
  onRefresh: () => void;
}

export const QuotesManager: React.FC<QuotesManagerProps> = ({ quotes, onRefresh }) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [name, setName] = useState('');
  const [meaning, setMeaning] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [confirmBatchDeleteIds, setConfirmBatchDeleteIds] = useState<string[]>([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setImageUrl('');
    setOriginalUrl('');
    setQuoteText('');
    setName('');
    setMeaning('');
    setStatus('');
    setIsError(false);
  };

  const handleEdit = (q: QuoteData) => {
    setEditingId(q.id || (q as any)._id || null);
    setImageUrl(q.imageUrl || '');
    setOriginalUrl(q.originalUrl || '');
    setQuoteText(q.quoteText || '');
    setName(q.name || '');
    setMeaning(q.meaning || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };

  const performDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);
    setStatus('Deleting...');
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Quote deleted successfully!');
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

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuoteIds((current) =>
      current.includes(quoteId)
        ? current.filter((id) => id !== quoteId)
        : [...current, quoteId],
    );
  };

  const handleBatchDelete = () => {
    if (selectedQuoteIds.length > 0) {
      setConfirmBatchDeleteIds(selectedQuoteIds);
    }
  };

  const performBatchDelete = async () => {
    const ids = confirmBatchDeleteIds;
    if (ids.length === 0) return;

    setConfirmBatchDeleteIds([]);
    setIsBatchDeleting(true);
    setStatus(`Deleting ${ids.length} quotes...`);
    try {
      const results = await Promise.all(
        ids.map((id) => fetch(`/api/quotes/${id}`, { method: 'DELETE' })),
      );
      if (results.every((res) => res.ok)) {
        setSelectedQuoteIds([]);
        setStatus(`${ids.length} quotes deleted successfully!`);
        addLog(`Deleted ${ids.length} quotes`, 'delete');
        onRefresh();
      } else {
        setIsError(true);
        setStatus('Some quotes could not be deleted.');
      }
    } catch (e) {
      console.error(e);
      setIsError(true);
      setStatus('Error deleting selected quotes.');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('Saving...');

    const payload = {
      imageUrl,
      originalUrl: originalUrl.trim(),
      quoteText,
      name,
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
  const paginatedQuoteIds = paginatedQuotes
    .map((quote) => quote.id || (quote as any)._id)
    .filter((id): id is string => Boolean(id));

  const toggleCurrentPageSelection = () => {
    const allSelected = paginatedQuoteIds.every((id) => selectedQuoteIds.includes(id));
    setSelectedQuoteIds((current) =>
      allSelected
        ? current.filter((id) => !paginatedQuoteIds.includes(id))
        : Array.from(new Set([...current, ...paginatedQuoteIds])),
    );
  };

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

          <div className="mb-5">
            <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
              Original Quote URL (Optional)
            </label>
            <input
              type="url"
              className="admin-input"
              placeholder="https://..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              data-testid="quote-original-url-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase mb-1.5 block">
                Image Name / Creator (Optional)
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
        </form>
      </div>

      <div className="admin-card mt-8 overflow-hidden">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-base font-bold">Existing Quotes</h4>
          {selectedQuoteIds.length > 0 && (
            <button
              type="button"
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
              className="admin-btn-danger text-xs px-3 py-1.5"
              data-testid="delete-selected-quotes-btn"
            >
              Delete selected ({selectedQuoteIds.length})
            </button>
          )}
        </div>
        
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
                    {quoteId && (
                      <label className="absolute bottom-2 left-2 z-10 flex cursor-pointer items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        <input
                          type="checkbox"
                          checked={selectedQuoteIds.includes(quoteId)}
                          onChange={() => toggleQuoteSelection(quoteId)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select quote ${idx + 1}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-[var(--green)]"
                        />
                        Select
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {paginatedQuoteIds.length > 0 && (
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs font-bold text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={paginatedQuoteIds.every((id) => selectedQuoteIds.includes(id))}
                  onChange={toggleCurrentPageSelection}
                  aria-label="Select all quotes on this page"
                  className="h-4 w-4 cursor-pointer accent-[var(--green)]"
                />
                Select all quotes on this page
              </label>
            )}
            
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
                        <img src={q.imageUrl} alt="Preview" className="w-full rounded-lg object-contain max-h-[70vh] shadow-2xl" />
                      )}

                      <div className="w-full text-center mt-4 mb-2">
                        {q.quoteText && <p className="text-sm italic text-white/90">"{q.quoteText}"</p>}
                        {q.name && <p className="text-xs font-bold text-[var(--orange)] mt-2">- {q.name}</p>}
                      </div>
                      
                      <div className="w-full flex justify-end items-center mt-4 p-4 bg-[#0a0f0c] border border-[var(--border)] rounded-xl">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setPreviewId(null);
                              handleEdit(q);
                            }}
                            className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-gray-200 rounded-lg transition"
                          >
                            Edit Quote
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
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
      
      <ConfirmLightbox
        isOpen={!!confirmDeleteId}
        title="Delete Quote?"
        message="Are you sure you want to permanently delete this quote? This action cannot be undone."
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmLightbox
        isOpen={confirmBatchDeleteIds.length > 0}
        title="Delete Selected Quotes?"
        message={`Are you sure you want to permanently delete ${confirmBatchDeleteIds.length} selected quotes? This action cannot be undone.`}
        onConfirm={performBatchDelete}
        onCancel={() => setConfirmBatchDeleteIds([])}
      />

      <SuccessLightbox
        message={status}
        isError={isError}
        onClose={() => {
          setStatus("");
          setIsError(false);
        }}
      />
    </div>
  );
};
