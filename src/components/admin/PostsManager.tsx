'use client';

import React, { useState } from 'react';
import { PostData } from '../PostRow';
import { placeholderUrl } from '@/lib/defaultData';
import { ImageUploadField } from '../ImageUploadField';
import { DotsLoader } from '../DotsLoader';
import { useActivityLog } from '@/context/ActivityLogContext';

interface PostsManagerProps {
  posts: PostData[];
  onRefresh: () => void;
}

export const PostsManager: React.FC<PostsManagerProps> = ({ posts, onRefresh }) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState('JAN 25');
  const [headline, setHeadline] = useState('');
  const [sub, setSub] = useState('');
  const [thumbUrl, setThumbUrl] = useState(placeholderUrl('Post thumbnail', 640, 360));
  const [isFeatureBadge, setIsFeatureBadge] = useState(false);
  const [featureText, setFeatureText] = useState('Creanote\nFeature');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTopOnTheList, setIsTopOnTheList] = useState(false);
  const [content, setContent] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setDate('JAN 25');
    setHeadline('');
    setSub('');
    setThumbUrl(placeholderUrl('Post thumbnail', 640, 360));
    setIsFeatureBadge(false);
    setFeatureText('Creanote\nFeature');
    setIsFeatured(false);
    setIsTopOnTheList(false);
    setContent('');
    setAuthorAvatar('');
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
    setIsFeatured(!!post.isFeatured);
    setIsTopOnTheList(!!post.isTopOnTheList);
    setContent(post.content || '');
    setAuthorAvatar(post.authorAvatar || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Story deleted successfully.');
        addLog('Deleted a story', 'delete');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting story.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      date,
      headline,
      sub,
      content,
      thumbUrl: isFeatureBadge ? '' : thumbUrl,
      authorAvatar,
      isFeatureBadge,
      featureText: isFeatureBadge ? featureText : '',
      isFeatured,
      isTopOnTheList,
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
          addLog(`Updated story: "${headline}"`, 'update');
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
          addLog(`Created new story: "${headline}"`, 'create');
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving story.');
    } finally {
      setIsSaving(false);
    }
  };

  const ITEMS_PER_PAGE = 5;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const totalTablePages = Math.ceil(posts.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="section-label m-0">Manage Stories & Posts</div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            const el = document.getElementById('story-form-card');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="admin-btn-primary text-xs py-2 px-3.5"
          data-testid="add-new-story-btn"
        >
          + Add New Story
        </button>
      </div>

      <div className="admin-card" id="story-form-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold">
            {editingId ? 'Edit Story' : 'Add New Story'}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Post
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} id="story-form">
          <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 mb-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
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
              <label className="text-xs text-[var(--muted)] uppercase">
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

          <div className="mb-4">
            <label className="text-xs text-[var(--muted)] uppercase">
              Story Content (Write up)
            </label>
            <textarea
              className="admin-input h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full story content..."
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
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
            <ImageUploadField
              label="Author Avatar (Optional)"
              value={authorAvatar}
              onChange={setAuthorAvatar}
              testId="post-author-avatar-input"
              aspectRatioHint="Recommended: 1:1 circle/square avatar"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[var(--border)] p-4 rounded-lg bg-[var(--bg)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={!isFeatured && posts.filter(p => p.isFeatured).length >= 1}
                className="w-4 h-4 cursor-pointer accent-[var(--green)]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold">Featured Story</span>
                <span className="text-[11px] text-[var(--muted)]">Shows on Homepage (Max 1)</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTopOnTheList}
                onChange={(e) => setIsTopOnTheList(e.target.checked)}
                disabled={!isTopOnTheList && posts.filter(p => p.isTopOnTheList).length >= 4}
                className="w-4 h-4 cursor-pointer accent-[var(--green)]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold">Top on the List</span>
                <span className="text-[11px] text-[var(--muted)]">Shows in Top Items section (Max 4)</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px] gap-4 mb-5">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Thumbnail Mode
              </label>
              <div className="flex gap-4 mt-[10px]">
                <label className="flex items-center gap-[6px] text-[13px]">
                  <input
                    type="radio"
                    checked={!isFeatureBadge}
                    onChange={() => setIsFeatureBadge(false)}
                  />
                  Image Thumbnail
                </label>
                <label className="flex items-center gap-[6px] text-[13px]">
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
                  <label className="text-xs text-[var(--muted)] uppercase">
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
                <ImageUploadField
                  label="Thumbnail / Cover (640x360)"
                  value={thumbUrl}
                  onChange={setThumbUrl}
                  fallbackPlaceholder={placeholderUrl('Post thumbnail', 640, 360)}
                  testId="post-thumb-input"
                  aspectRatioHint="Recommended: 16:9 widescreen thumbnail"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button type="submit" className="admin-btn-primary" disabled={isSaving} data-testid="post-submit-btn">
              {isSaving ? <DotsLoader /> : (editingId ? 'Save Changes' : 'Create Story')}
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
            Stories Feed ({posts.length})
          </h4>
          
          <div className="flex items-center gap-3">
            {posts.length > 0 && (
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
                const el = document.getElementById('story-form-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="admin-btn-primary text-xs py-1.5 px-3"
            >
              + Create New Story
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="admin-table min-w-[620px]">
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
              {paginatedPosts.map((post, idx) => (
                <tr key={post.id || idx}>
                  <td className="text-[var(--orange)] font-bold">{post.date}</td>
                  <td className="font-semibold max-w-[300px]">{post.headline}</td>
                  <td className="text-[var(--muted)]">{post.sub}</td>
                  <td>
                    {post.isFeatureBadge ? (
                      <span className="text-[var(--green)] text-xs font-bold">
                        [Feature Card]
                      </span>
                    ) : post.thumbUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={post.thumbUrl}
                        alt={post.headline}
                        className="w-[50px] h-[30px] object-cover rounded"
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
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
    </div>
  );
};
