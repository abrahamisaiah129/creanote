'use client';

import React, { useState } from 'react';
import { QuoteData } from '../QuoteBand';

interface QuotesManagerProps {
  quotes: QuoteData[];
  onRefresh: () => void;
}

export const QuotesManager: React.FC<QuotesManagerProps> = ({ quotes, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [boldText, setBoldText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [tagText, setTagText] = useState('QUOTE');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('CREANOTE QUOTE TIMELINE');
  const [name, setName] = useState('');
  const [role, setRole] = useState('@creanote_hq');
  const [avatarUrl, setAvatarUrl] = useState('/images/quote-avatar.jpg');
  const [status, setStatus] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setBoldText('');
    setBodyText('');
    setTagText('QUOTE');
    setCaption('');
    setCredit('CREANOTE QUOTE TIMELINE');
    setName('');
    setRole('@creanote_hq');
    setAvatarUrl('/images/quote-avatar.jpg');
    setStatus('');
  };

  const handleEdit = (q: QuoteData) => {
    setEditingId(q.id || null);
    setBoldText(q.boldText);
    setBodyText(q.bodyText);
    setTagText(q.tagText || 'QUOTE');
    setCaption(q.caption);
    setCredit(q.credit || 'CREANOTE QUOTE TIMELINE');
    setName(q.name);
    setRole(q.role);
    setAvatarUrl(q.avatarUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Quote deleted successfully.');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting quote.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    const payload = {
      boldText,
      bodyText,
      tagText,
      caption,
      credit,
      name,
      role,
      avatarUrl,
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
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving quote.');
    }
  };

  return (
    <div>
      <div className="section-label">Manage Quotes Timeline</div>

      <div className="admin-card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          {editingId ? 'Edit Quote' : 'Add New Creator Quote'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Full Body Reflection
            </label>
            <textarea
              className="admin-textarea"
              style={{ minHeight: '80px' }}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Don't be afraid to pivot your ideas or start over..."
              required
              data-testid="quote-body-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Tag Text & Credit
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Creator Name
              </label>
              <input
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Software Developer"
                required
                data-testid="quote-name-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Avatar URL
              </label>
              <input
                className="admin-input"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="/images/quote-avatar.jpg"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="admin-btn-primary" data-testid="quote-submit-btn">
              {editingId ? 'Save Changes' : 'Create Quote'}
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
          Quotes Archive ({quotes.length})
        </h4>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Creator</th>
              <th>Bold Quote</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, idx) => (
              <tr key={q.id || idx}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={q.avatarUrl}
                    alt={q.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--green)' }}
                  />
                  <span style={{ fontWeight: 600 }}>{q.name}</span>
                </td>
                <td style={{ maxWidth: '350px' }}>{q.boldText}</td>
                <td style={{ color: 'var(--muted)' }}>{q.role}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
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
  );
};
