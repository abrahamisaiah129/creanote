'use client';

import React, { useState } from 'react';
import { TopCardData } from '../TopCard';
import { placeholderUrl } from '@/lib/defaultData';
import { Badge } from '../Badge';
import { ImageUploadField } from '../ImageUploadField';
import { DotsLoader } from '../DotsLoader';
import { useActivityLog } from '@/context/ActivityLogContext';

interface TopListManagerProps {
  items: TopCardData[];
  onRefresh: () => void;
}

export const TopListManager: React.FC<TopListManagerProps> = ({ items, onRefresh }) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeColor, setBadgeColor] = useState<'orange' | 'green'>('orange');
  const [imageUrl, setImageUrl] = useState(placeholderUrl('Top card', 800, 500));
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setMeta('');
    setBadgeText('');
    setBadgeColor('orange');
    setImageUrl(placeholderUrl('Top card', 800, 500));
    setLinkUrl('');
    setStatus('');
  };

  const handleEdit = (item: TopCardData) => {
    setEditingId(item.id || null);
    setTitle(item.title);
    setMeta(item.meta || '');
    setBadgeText(item.badgeText || '');
    setBadgeColor(item.badgeColor || 'orange');
    setImageUrl(item.imageUrl);
    setLinkUrl((item as any).linkUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this highlight?')) return;

    try {
      const res = await fetch(`/api/top-items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Item deleted successfully.');
        addLog('Deleted a highlight card', 'delete');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title,
      meta,
      badgeText: badgeText.trim() || undefined,
      badgeColor,
      imageUrl,
      linkUrl,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/top-items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Item updated successfully!');
          addLog(`Updated highlight card: "${title}"`, 'update');
          resetForm();
          onRefresh();
        }
      } else {
        const res = await fetch('/api/top-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Item created successfully!');
          addLog(`Created highlight card: "${title}"`, 'create');
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving item.');
    } finally {
      setIsSaving(false);
    }
  };

  const ITEMS_PER_PAGE = 5;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const totalTablePages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="section-label m-0">Manage &ldquo;Top on the List&rdquo; Cards</div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            const el = document.getElementById('top-card-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="admin-btn-primary text-xs py-2 px-3.5"
          data-testid="add-new-top-card-btn"
        >
          + Add Highlight Card
        </button>
      </div>

      <div className="admin-card" id="top-card-form">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold">
            {editingId ? 'Edit Highlight Card' : 'Add New Highlight Card'}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Card
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Title
              </label>
              <input
                className="admin-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g. "Just a hunger to make money..."'
                required
                data-testid="top-item-title-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Metadata Subtitle
              </label>
              <input
                className="admin-input"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="e.g. COPYWRITER · 48 MONTHS"
                required
                data-testid="top-item-meta-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Target Link URL
              </label>
              <input
                className="admin-input"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /stories/my-post or /quotes/123"
                data-testid="top-item-link-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Badge Text (Optional)
              </label>
              <input
                className="admin-input"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. ANONYMOUS, CREANOTE"
                data-testid="top-item-badge-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Badge Color
              </label>
              <select
                className="admin-select"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value as 'orange' | 'green')}
              >
                <option value="orange">Orange (var(--orange))</option>
                <option value="green">Green (var(--green))</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <ImageUploadField
              label="Highlight Card Visual (800x500)"
              value={imageUrl}
              onChange={setImageUrl}
              fallbackPlaceholder={placeholderUrl('Top card', 800, 500)}
              testId="top-card-image-input"
              aspectRatioHint="Recommended: 16:10 or 800x500 landscape visual"
            />
          </div>

          <div className="flex gap-3 items-center">
            <button type="submit" className="admin-btn-primary" disabled={isSaving} data-testid="top-item-submit-btn">
              {isSaving ? <DotsLoader /> : (editingId ? 'Save Changes' : 'Create Highlight Card')}
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
            Current Highlights ({items.length})
          </h4>
          
          <div className="flex items-center gap-3">
            {items.length > 0 && (
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
                const el = document.getElementById('top-card-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="admin-btn-primary text-xs py-1.5 px-3"
            >
              + Add Highlight Card
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="admin-table min-w-[550px]">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Meta</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-[60px] h-10 object-cover rounded"
                    />
                  </td>
                  <td className="font-semibold max-w-[300px]">{item.title}</td>
                  <td className="text-[var(--muted)]">{item.meta || '—'}</td>
                  <td>
                    {item.badgeText ? (
                      <Badge text={item.badgeText} color={item.badgeColor || 'orange'} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="admin-btn-edit"
                        onClick={() => handleEdit(item)}
                        data-testid={`edit-top-btn-${idx}`}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn-danger"
                        onClick={() => handleDelete(item.id)}
                        data-testid={`delete-top-btn-${idx}`}
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
