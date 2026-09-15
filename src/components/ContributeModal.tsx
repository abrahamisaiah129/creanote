'use client';

import React, { useState } from 'react';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [headline, setHeadline] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: 'JUST NOW',
          headline,
          sub: `${name} | ${role}`,
          thumbUrl: '/images/post-1.jpg',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit story');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        onSubmitSuccess?.();
      }, 1500);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="contribute-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h3 style={{ fontFamily: 'Ubuntu', fontSize: '20px', marginBottom: '8px' }}>
          Share Your Note
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
          If you create, then you belong here. Share a note from your journey to inspire other creatives.
        </p>

        {status === 'success' ? (
          <div style={{ color: 'var(--green)', padding: '24px 0', textAlign: 'center' }}>
            Thank you! Your note has been submitted to Creanote.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Your Name
              </label>
              <input
                className="nl-input"
                style={{ width: '100%', marginTop: '6px' }}
                placeholder="e.g. Faith Borntowin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Creative Role & Experience
              </label>
              <input
                className="nl-input"
                style={{ width: '100%', marginTop: '6px' }}
                placeholder="e.g. 2 months + | Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Headline / Key Takeaway
              </label>
              <input
                className="nl-input"
                style={{ width: '100%', marginTop: '6px' }}
                placeholder="e.g. 2 months + dev shared a note that keep her going."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Story Details
              </label>
              <textarea
                className="nl-input"
                style={{ width: '100%', marginTop: '6px', minHeight: '80px', resize: 'vertical' }}
                placeholder="Write your note, struggle, or insight..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="nl-submit"
              style={{ marginTop: '10px' }}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Note'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
