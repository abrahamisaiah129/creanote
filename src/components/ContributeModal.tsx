'use client';

import React, { useState, useRef, useEffect } from 'react';
import { placeholderUrl } from '@/lib/defaultData';
import { UploadCloud, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { DotsLoader } from './DotsLoader';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  defaultTab?: 'quote' | 'story';
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  defaultTab = 'story',
}) => {
  const [activeTab, setActiveTab] = useState<'quote' | 'story'>(defaultTab);

  // Story state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [headline, setHeadline] = useState('');
  const [note, setNote] = useState('');
  const [storyThumbUrl, setStoryThumbUrl] = useState('');

  // Quote state
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [quoteRole, setQuoteRole] = useState('');
  const [quoteImageUrl, setQuoteImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  // Cloudinary Direct Unsigned Upload
  const uploadToCloudinary = async (imageFile: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddzpchp5x';
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'creanote-client-upload';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', preset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Handle image file selection with Cloudinary upload & local preview fallback
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    setErrorMessage('');
    setImageFileName(file.name);
    setIsUploadingImage(true);

    // Generate local preview immediately so user never waits
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setQuoteImageUrl(result);
      }
    };
    reader.readAsDataURL(file);

    // Direct upload to Cloudinary
    try {
      const secureUrl = await uploadToCloudinary(file);
      if (secureUrl) {
        setQuoteImageUrl(secureUrl);
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback to local data URL:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Submit Story / Note
  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: 'JUST NOW',
          headline,
          sub: `${name} | ${role}`,
          thumbUrl: storyThumbUrl.trim() || placeholderUrl(headline || 'Creanote note', 640, 360),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit story');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        onSubmitSuccess?.();
      }, 1400);
    } catch (e: unknown) {
      console.error(e);
      setStatus('error');
      setErrorMessage(e instanceof Error ? e.message : 'Submission failed');
    }
  };

  // Submit Quote with Desired Image Upload
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const finalImage = quoteImageUrl.trim();
      
      if (!finalImage) {
        throw new Error('Please upload an image for the quote.');
      }

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: finalImage,
          isActive: false, // Default to inactive until approved by admin
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit quote');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        onSubmitSuccess?.();
      }, 1400);
    } catch (e: unknown) {
      console.error(e);
      setStatus('error');
      setErrorMessage(e instanceof Error ? e.message : 'Submission failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/75 px-4 pb-6 pt-16 sm:pt-20 backdrop-blur-[8px]"
      onClick={onClose}
      data-testid="contribute-modal"
    >
      <div
        className="relative max-h-[calc(100vh-80px)] w-full max-w-[620px] overflow-y-auto rounded-3xl border border-white/10 bg-[#0c1410] p-6 sm:p-8 text-[var(--text)] shadow-[0_24px_80px_rgba(0,0,0,.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/5 text-neutral-400 transition hover:bg-[rgba(0,208,132,.15)] hover:text-[var(--green)]"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--green)]">
            Creanote Creator Contributions
          </div>
          <h3 className="font-['Ubuntu'] text-2xl font-extrabold text-white">
            {activeTab === 'quote' ? 'Submit an Inspiring Quote' : 'Share Your Creative Note'}
          </h3>
          <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
            {activeTab === 'quote'
              ? 'Share a meaningful quote with your desired image to inspire creators worldwide on the quotes canvas.'
              : 'Share an honest insight or breakthrough milestone from your journey to uplift other creatives.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex flex-col sm:flex-row rounded-2xl sm:rounded-full border border-white/10 bg-[#080d0a] p-1.5 gap-1.5 sm:gap-0" data-testid="contribute-tabs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quote');
              setStatus('idle');
            }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl sm:rounded-full py-2.5 sm:py-2 font-['Ubuntu'] text-xs font-bold transition active:scale-95 ${
              activeTab === 'quote'
                ? 'bg-[var(--green)] text-black shadow-md'
                : 'text-[var(--muted)] hover:text-white bg-white/5 sm:bg-transparent'
            }`}
            data-testid="tab-quote-btn"
          >
            Submit Quote with Image
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('story');
              setStatus('idle');
            }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl sm:rounded-full py-2.5 sm:py-2 font-['Ubuntu'] text-xs font-bold transition active:scale-95 ${
              activeTab === 'story'
                ? 'bg-[var(--green)] text-black shadow-md'
                : 'text-[var(--muted)] hover:text-white bg-white/5 sm:bg-transparent'
            }`}
            data-testid="tab-story-btn"
          >
            Share Story / Note
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-12 text-center animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green)]/15 text-[var(--green)]">
              <CheckCircle size={32} />
            </div>
            <h4 className="font-['Ubuntu'] text-lg font-bold text-white">Submission Received!</h4>
            <p className="mt-1 text-xs text-[var(--green)]">
              {activeTab === 'quote'
                ? 'Thank you! Your quote with desired image has been submitted to Creanote.'
                : 'Thank you! Your note has been submitted to Creanote.'}
            </p>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-300">
                {errorMessage}
              </div>
            )}

            {/* QUOTE SUBMISSION FORM WITH DESIRED IMAGE UPLOAD */}
            {activeTab === 'quote' ? (
              <form onSubmit={handleSubmitQuote} className="flex flex-col gap-4">
                {/* DESIRED IMAGE UPLOAD AREA */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-['Ubuntu'] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      Desired Quote Image (Visual) *
                    </label>
                    <span className="text-[11px] text-[var(--muted)]">PNG, JPG, WebP up to 5MB</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    data-testid="quote-image-file-input"
                  />

                  {quoteImageUrl ? (
                    /* Image Preview Card */
                    <div
                      className="mt-2 relative overflow-hidden rounded-2xl border border-[var(--green)]/30 bg-[#0a100c] p-3"
                      data-testid="quote-image-preview"
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={quoteImageUrl}
                            alt="Desired quote visual preview"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-['Ubuntu'] text-xs font-bold text-white">
                            {imageFileName || 'Uploaded Quote Image'}
                          </p>
                          {isUploadingImage ? (
                            <p className="mt-0.5 text-[11px] text-[var(--orange)] font-semibold flex items-center gap-1.5">
                              <span className="inline-block h-2 w-2 rounded-full bg-[var(--orange)] animate-ping" />
                              Uploading to Cloudinary...
                            </p>
                          ) : (
                            <p className="mt-0.5 text-[11px] text-[var(--green)] font-semibold">
                              ✓ Visual ready to publish
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-white/10"
                            >
                              Replace Image
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setQuoteImageUrl('');
                                setImageFileName('');
                              }}
                              className="cursor-pointer text-[10px] font-bold text-red-400 hover:text-red-300"
                              data-testid="quote-image-remove-btn"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Drag & Drop Upload Zone */
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                        isDragging
                          ? 'border-[var(--green)] bg-[var(--green)]/10 scale-[0.99]'
                          : 'border-white/15 bg-[#121c16]/50 hover:border-[var(--green)]/50 hover:bg-[#121c16]'
                      }`}
                      data-testid="quote-image-upload-zone"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-[var(--green)]">
                        <UploadCloud size={20} />
                      </div>
                      <p className="mt-2.5 font-['Ubuntu'] text-xs font-bold text-white">
                        Click to upload your desired image or drag and drop
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        Recommended: square or 4:3 high-resolution artwork
                      </p>
                    </div>
                  )}

                  {/* Optional Image URL Fallback */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-[var(--muted)]">Or paste Image URL:</span>
                    <input
                      type="url"
                      value={quoteImageUrl.startsWith('data:') ? '' : quoteImageUrl}
                      onChange={(e) => {
                        setQuoteImageUrl(e.target.value);
                        setImageFileName(e.target.value ? 'External Image URL' : '');
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 rounded-lg border border-white/10 bg-[#121c16] px-2.5 py-1 text-[11px] text-white placeholder:text-neutral-500 outline-none focus:border-[var(--green)]"
                      data-testid="quote-image-url-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[var(--green)] font-['Ubuntu'] text-xs font-bold text-black shadow-lg transition hover:bg-[var(--green-dark)] active:scale-98 disabled:opacity-50"
                  disabled={status === 'submitting'}
                  data-testid="quote-submit-btn"
                >
                  {status === 'submitting' ? <DotsLoader /> : 'Submit Quote & Visual'}
                </button>
              </form>
            ) : (
              /* STORY / NOTE SUBMISSION FORM */
              <form onSubmit={handleSubmitStory} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-['Ubuntu'] text-xs uppercase text-[var(--muted)]">
                    Your Name *
                  </label>
                  <input
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#121c16] px-3.5 font-['Ubuntu'] text-xs text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--green)]"
                    placeholder="e.g. Faith Borntowin"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-['Ubuntu'] text-xs uppercase text-[var(--muted)]">
                    Creative Role & Experience *
                  </label>
                  <input
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#121c16] px-3.5 font-['Ubuntu'] text-xs text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--green)]"
                    placeholder="e.g. 2 months + | Developer"
                    value={role || ''}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-['Ubuntu'] text-xs uppercase text-[var(--muted)]">
                    Headline / Key Takeaway *
                  </label>
                  <input
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#121c16] px-3.5 font-['Ubuntu'] text-xs text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--green)]"
                    placeholder="e.g. 2 months + dev shared a note that keep her going."
                    value={headline || ''}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-['Ubuntu'] text-xs uppercase text-[var(--muted)]">
                    Story Details *
                  </label>
                  <textarea
                    className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-[#121c16] p-3 font-['Ubuntu'] text-xs text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--green)] leading-relaxed"
                    placeholder="Write your note, struggle, or insight..."
                    value={note || ''}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </div>

                <ImageUploadField
                  label="Story Visual / Cover (Optional)"
                  value={storyThumbUrl}
                  onChange={setStoryThumbUrl}
                  fallbackPlaceholder=""
                  aspectRatioHint="Recommended: 16:9 widescreen or leave blank for auto-placeholder"
                />

                <button
                  type="submit"
                  className="mt-2.5 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[var(--green)] font-['Ubuntu'] text-xs font-bold text-black shadow-lg transition hover:bg-[var(--green-dark)] active:scale-98 disabled:opacity-50"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? <DotsLoader /> : 'Submit Note'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
