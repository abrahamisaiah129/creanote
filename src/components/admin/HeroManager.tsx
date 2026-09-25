'use client';

import React, { useState } from 'react';
import { SlideItem } from '../HeroSlider';
import { placeholderUrl } from '@/lib/defaultData';
import { ImageUploadField } from '../ImageUploadField';
import { DotsLoader } from '../DotsLoader';
import { useActivityLog } from '@/context/ActivityLogContext';

interface HeroManagerProps {
  slides: SlideItem[];
  onRefresh: () => void;
}

export const HeroManager: React.FC<HeroManagerProps> = ({ slides, onRefresh }) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(placeholderUrl('Hero slide', 2000, 1031));
  const [mobileImageUrl, setMobileImageUrl] = useState(placeholderUrl('Hero slide', 900, 1600));
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [headline, setHeadline] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setImageUrl(placeholderUrl('Hero slide', 2000, 1031));
    setMobileImageUrl(placeholderUrl('Hero slide', 900, 1600));
    setAlt('');
    setTitle('');
    setMeta('');
    setBadgeText('');
    setHeadline('');
    setLinkUrl('');
    setStatus('');
  };

  const handleEdit = (slide: SlideItem) => {
    setEditingId(slide.id || null);
    setImageUrl(slide.imageUrl);
    setMobileImageUrl(slide.mobileImageUrl || slide.imageUrl);
    setAlt(slide.alt || '');
    setTitle(slide.title || '');
    setMeta(slide.meta || '');
    setBadgeText(slide.badgeText || '');
    setHeadline(slide.headline || slide.title || '');
    setLinkUrl((slide as any).linkUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Hero slide deleted successfully.');
        addLog('Deleted a hero slide', 'delete');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting slide.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { imageUrl, mobileImageUrl, alt, title, meta, badgeText, headline, linkUrl };

    try {
      if (editingId) {
        const res = await fetch(`/api/hero-slides/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Slide updated successfully!');
          addLog(`Updated hero slide: "${title || alt || 'Untitled'}"`, 'update');
          resetForm();
          onRefresh();
        }
      } else {
        const res = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Slide created successfully!');
          addLog(`Created hero slide: "${title || alt || 'Untitled'}"`, 'create');
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving slide.');
    } finally {
      setIsSaving(false);
    }
  };

  const ITEMS_PER_PAGE = 6;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const totalTablePages = Math.ceil(slides.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedSlides = slides.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="section-label m-0">Manage Hero Slider</div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            const el = document.getElementById('hero-slide-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="admin-btn-primary text-xs py-2 px-3.5"
          data-testid="add-new-hero-slide-btn"
        >
          + Add Hero Slide
        </button>
      </div>

      <div className="admin-card" id="hero-slide-form">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold">
            {editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Slide
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <ImageUploadField
              label="Desktop Slide Image (2000x1031)"
              value={imageUrl}
              onChange={setImageUrl}
              fallbackPlaceholder={placeholderUrl('Hero slide', 2000, 1031)}
              testId="hero-image-input"
              aspectRatioHint="Recommended: 16:9 or ~2:1 landscape banner"
            />
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">Banner Title</label>
              <input
                className="admin-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Banner title"
                data-testid="hero-title-input"
              />
            </div>
            <ImageUploadField
              label="Mobile Slide Image (900x1600)"
              value={mobileImageUrl}
              onChange={setMobileImageUrl}
              fallbackPlaceholder={placeholderUrl('Hero slide', 900, 1600)}
              testId="hero-mobile-image-input"
              aspectRatioHint="Recommended: 9:16 portrait mobile visual"
            />
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">Banner Headline</label>
              <input
                className="admin-input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Banner headline"
                data-testid="hero-headline-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">Target Link URL</label>
              <input
                className="admin-input"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /stories/my-post or /quotes/123"
                data-testid="hero-link-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">Banner Badge</label>
              <input
                className="admin-input"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. ANONYMOUS"
                data-testid="hero-badge-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">Banner Meta</label>
              <input
                className="admin-input"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="e.g. CREANOTE TIMELINE"
                data-testid="hero-meta-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Alt Description
              </label>
              <input
                className="admin-input"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Creanote Hero Slide Description"
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button type="submit" className="admin-btn-primary" disabled={isSaving} data-testid="hero-submit-btn">
              {isSaving ? <DotsLoader /> : (editingId ? 'Save Changes' : 'Add Slide')}
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
            Active Slides ({slides.length})
          </h4>
          
          <div className="flex items-center gap-3">
            {slides.length > 0 && (
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
                const el = document.getElementById('hero-slide-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="admin-btn-primary text-xs py-1.5 px-3"
            >
              + Add Hero Slide
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {paginatedSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.alt || 'Slide'}
                className="w-full h-[140px] object-cover"
              />
              <div className="p-3">
                <div className="text-xs text-[var(--muted)] mb-2">
                  Slide {idx + 1}: {slide.alt || 'Untitled'}
                </div>
                <div className="flex gap-2">
                  <button
                    className="admin-btn-edit"
                    onClick={() => handleEdit(slide)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn-danger"
                    onClick={() => handleDelete(slide.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
