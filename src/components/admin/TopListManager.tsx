'use client';

import React, { useState } from 'react';
import { TopCardData } from '../TopCard';
import { Badge } from '../Badge';

interface TopListManagerProps {
  items: TopCardData[];
  onRefresh: () => void;
}

export const TopListManager: React.FC<TopListManagerProps> = ({ items, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeColor, setBadgeColor] = useState<'orange' | 'green'>('orange');
  const [imageUrl, setImageUrl] = useState('/images/top-card-1.jpg');
  const [status, setStatus] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setMeta('');
    setBadgeText('');
    setBadgeColor('orange');
    setImageUrl('/images/top-card-1.jpg');
    setStatus('');
  };

  const handleEdit = (item: TopCardData) => {
    setEditingId(item.id || null);
    setTitle(item.title);
    setMeta(item.meta || '');
    setBadgeText(item.badgeText || '');
    setBadgeColor(item.badgeColor || 'orange');
    setImageUrl(item.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this highlight?')) return;

    try {
      const res = await fetch(`/api/top-items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Item deleted successfully.');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    const payload = {
      title,
      meta,
      badgeText: badgeText.trim() || undefined,
      badgeColor,
      imageUrl,
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
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving item.');
    }
  };

  return (
    <div>
      <div className="section-label">Manage &ldquo;Top on the List&rdquo; Cards</div>

      <div className="admin-card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          {editingId ? 'Edit Highlight Card' : 'Add New Highlight Card'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Image Path / URL
              </label>
              <input
                className="admin-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/top-card-1.jpg"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="admin-btn-primary" data-testid="top-item-submit-btn">
              {editingId ? 'Save Changes' : 'Create Highlight Card'}
            </button>
            {editingId && (
              <button type="button" className="admin-tab-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
            {status && (
              <span style={{ fontSize: '13px', color: 'var(--green)' }}>
                {status}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          Current Highlights ({items.length})
        </h4>

        <table className="admin-table">
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
            {items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td style={{ width: '80px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ fontWeight: 600, maxWidth: '300px' }}>{item.title}</td>
                <td style={{ color: 'var(--muted)' }}>{item.meta || '—'}</td>
                <td>
                  {item.badgeText ? (
                    <Badge text={item.badgeText} color={item.badgeColor || 'orange'} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
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
  );
};
