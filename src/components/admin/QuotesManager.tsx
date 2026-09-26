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
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setImageUrl('');
    setIsActive(false);
    setStatus('');
  };

  const handleEdit = (q: QuoteData) => {
    setEditingId(q.id || null);
    setImageUrl(q.imageUrl || '');
    setIsActive(!!q.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHero = async (q: QuoteData) => {
    if (!q.id) return;
    setStatus('Updating quote status...');
    try {
      const res = await fetch(`/api/quotes/${q.id}`, {
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
      imageUrl,
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
            placeholder="Image URL"
            required
            id="quote-image"
          />

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
              {isSaving ? <DotsLoader /> : editingId ? 'Update Quote' : 'Create Quote'}
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--text)] whitespace-nowrap">
                <thead className="bg-[#101814] text-xs uppercase text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {paginatedQuotes.map((q, idx) => (
                    <tr key={q.id || idx} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3">
                        {q.imageUrl ? (
                           /* eslint-disable-next-line @next/next/no-img-element */
                           <img src={q.imageUrl} alt="Quote" className="h-12 w-12 object-cover rounded" />
                        ) : (
                           <div className="h-12 w-12 bg-white/10 rounded flex items-center justify-center text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleHero(q)}
                          className={`text-xs px-2 py-1 rounded-full font-bold border transition ${
                            q.isActive 
                              ? 'bg-[var(--green)]/20 text-[var(--green)] border-[var(--green)]/30 hover:bg-[var(--green)]/30' 
                              : 'bg-white/5 text-[var(--muted)] border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {q.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white/20 rounded mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1.5 text-xs text-[var(--orange)] bg-[var(--orange)]/10 hover:bg-[var(--orange)]/20 rounded transition"
                        >
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalTablePages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-2">
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
          </>
        )}
      </div>
    </div>
  );
};
