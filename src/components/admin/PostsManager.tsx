'use client';

import React, { useState } from 'react';
import { PostData } from '../PostRow';

interface PostsManagerProps {
  posts: PostData[];
  onRefresh: () => void;
}

export const PostsManager: React.FC<PostsManagerProps> = ({ posts, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState('JAN 25');
  const [headline, setHeadline] = useState('');
  const [sub, setSub] = useState('');
  const [thumbUrl, setThumbUrl] = useState('/images/post-1.jpg');
  const [isFeatureBadge, setIsFeatureBadge] = useState(false);
  const [featureText, setFeatureText] = useState('Creanote\nFeature');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setDate('JAN 25');
    setHeadline('');
    setSub('');
    setThumbUrl('/images/post-1.jpg');
    setIsFeatureBadge(false);
    setFeatureText('Creanote\nFeature');
    setPage(1);
    setStatus('');
  };

  const handleEdit = (post: PostData) => {
    setEditingId(post.id || null);
    setDate(post.date);
    setHeadline(post.headline);
    setSub(post.sub);
    setThumbUrl(post.thumbUrl || '');
    setIsFeatureBadge(!!post.isFeatureBadge);
    setFeatureText(post.featureText || 'Creanote\nFeature');
    setPage(post.page || 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Story deleted successfully.');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting story.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    const payload = {
      date,
      headline,
      sub,
      thumbUrl: isFeatureBadge ? '' : thumbUrl,
      isFeatureBadge,
      featureText: isFeatureBadge ? featureText : '',
      page,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/posts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Story updated successfully!');
          resetForm();
          onRefresh();
        }
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Story created successfully!');
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving story.');
    }
  };

  return (
    <div>
      <div className="section-label">Manage Stories & Posts</div>

      <div className="admin-card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          {editingId ? 'Edit Story' : 'Add New Story'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Date
              </label>
              <input
                className="admin-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="JAN 21"
                required
                data-testid="post-date-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Headline
              </label>
              <input
                className="admin-input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. 2 months + dev shared a note..."
                required
                data-testid="post-headline-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Subtitle / Author Details
            </label>
            <input
              className="admin-input"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="e.g. Faith Borntowin | 2 months + | Developer"
              required
              data-testid="post-sub-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Thumbnail Mode
              </label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input
                    type="radio"
                    checked={!isFeatureBadge}
                    onChange={() => setIsFeatureBadge(false)}
                  />
                  Image Thumbnail
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input
                    type="radio"
                    checked={isFeatureBadge}
                    onChange={() => setIsFeatureBadge(true)}
                  />
                  Green Feature Card
                </label>
              </div>
            </div>

            <div>
              {isFeatureBadge ? (
                <>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Feature Card Text
                  </label>
                  <input
                    className="admin-input"
                    value={featureText}
                    onChange={(e) => setFeatureText(e.target.value)}
                    placeholder="Creanote\nFeature"
                  />
                </>
              ) : (
                <>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Thumbnail Path
                  </label>
                  <input
                    className="admin-input"
                    value={thumbUrl}
                    onChange={(e) => setThumbUrl(e.target.value)}
                    placeholder="/images/post-1.jpg"
                  />
                </>
              )}
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Page
              </label>
              <input
                type="number"
                min="1"
                className="admin-input"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="admin-btn-primary" data-testid="post-submit-btn">
              {editingId ? 'Save Changes' : 'Create Story'}
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
          Stories Feed ({posts.length})
        </h4>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Headline</th>
              <th>Author / Subtitle</th>
              <th>Thumbnail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post.id || idx}>
                <td style={{ color: 'var(--orange)', fontWeight: 700 }}>{post.date}</td>
                <td style={{ fontWeight: 600, maxWidth: '300px' }}>{post.headline}</td>
                <td style={{ color: 'var(--muted)' }}>{post.sub}</td>
                <td>
                  {post.isFeatureBadge ? (
                    <span style={{ color: 'var(--green)', fontSize: '12px', fontWeight: 700 }}>
                      [Feature Card]
                    </span>
                  ) : post.thumbUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.thumbUrl}
                      alt={post.headline}
                      style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="admin-btn-edit"
                      onClick={() => handleEdit(post)}
                      data-testid={`edit-post-btn-${idx}`}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn-danger"
                      onClick={() => handleDelete(post.id)}
                      data-testid={`delete-post-btn-${idx}`}
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
