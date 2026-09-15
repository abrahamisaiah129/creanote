'use client';

import React, { useState } from 'react';
import { SlideItem } from '../HeroSlider';

interface HeroManagerProps {
  slides: SlideItem[];
  onRefresh: () => void;
}

export const HeroManager: React.FC<HeroManagerProps> = ({ slides, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('/images/hero-0.jpg');
  const [alt, setAlt] = useState('');
  const [status, setStatus] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setImageUrl('/images/hero-0.jpg');
    setAlt('');
    setStatus('');
  };

  const handleEdit = (slide: SlideItem) => {
    setEditingId(slide.id || null);
    setImageUrl(slide.imageUrl);
    setAlt(slide.alt || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatus('Hero slide deleted successfully.');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus('Error deleting slide.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    const payload = { imageUrl, alt };

    try {
      if (editingId) {
        const res = await fetch(`/api/hero-slides/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('Slide updated successfully!');
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
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus('Error saving slide.');
    }
  };

  return (
    <div>
      <div className="section-label">Manage Hero Slider</div>

      <div className="admin-card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          {editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Image URL / Path
              </label>
              <input
                className="admin-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/hero-0.jpg"
                required
                data-testid="hero-image-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="admin-btn-primary" data-testid="hero-submit-btn">
              {editingId ? 'Save Changes' : 'Add Slide'}
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
          Active Slides ({slides.length})
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.alt || 'Slide'}
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                  Slide {idx + 1}: {slide.alt || 'Untitled'}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
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
