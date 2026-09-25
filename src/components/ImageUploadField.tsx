'use client';

import React, { useState, useRef } from 'react';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { UploadCloud, Image as ImageIcon, RotateCcw, X, Check, Link as LinkIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  fallbackPlaceholder?: string;
  testId?: string;
  aspectRatioHint?: string;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  fallbackPlaceholder = '',
  testId,
  aspectRatioHint = 'Recommended: PNG, JPG, WebP',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size exceeds 8MB limit');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        onChange(url);
      }
    } catch (err: unknown) {
      console.error('Image upload failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isPlaceholder = value.includes('placehold.co') || !value;
  const isCloudinary = value.includes('cloudinary.com') || value.includes('res.cloudinary');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {isCloudinary && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--green)]">
              <Check size={10} /> Cloudinary
            </span>
          )}
          {isPlaceholder && (
            <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
              Placeholder
            </span>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Visual Preview / Upload Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isDragging
            ? 'border-[var(--green)] bg-[var(--green)]/10 scale-[0.99]'
            : 'border-white/10 bg-[#0e1712] hover:border-white/20'
        }`}
      >
        {value ? (
          <div className="p-3">
            <div className="flex items-center gap-3">
              {/* Image Preview Box */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={label}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/15 hover:border-[var(--green)] active:scale-95 disabled:opacity-50"
                  >
                    <UploadCloud size={13} />
                    {isUploading ? 'Uploading...' : 'Replace Image'}
                  </button>

                  {fallbackPlaceholder && value !== fallbackPlaceholder && (
                    <button
                      type="button"
                      onClick={() => onChange(fallbackPlaceholder)}
                      className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-[var(--orange)] transition hover:underline"
                      title="Reset to default placeholder"
                    >
                      <RotateCcw size={11} />
                      Reset to Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput((prev) => !prev)}
                    className="cursor-pointer text-[11px] text-[var(--muted)] hover:text-white transition flex items-center gap-1"
                  >
                    <LinkIcon size={10} />
                    {showUrlInput ? 'Hide URL' : 'Edit URL directly'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload Prompt */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center p-6 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[var(--green)]">
              <UploadCloud size={18} />
            </div>
            <p className="mt-2 text-xs font-bold text-white">
              {isUploading ? 'Uploading image...' : 'Click to upload image or drag & drop'}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">
              {aspectRatioHint}
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <div className="flex items-center gap-2 rounded-full border border-[var(--green)]/30 bg-[#0c1611] px-4 py-1.5 text-xs font-bold text-[var(--green)] shadow-lg animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--green)] animate-ping" />
              Uploading to Cloudinary...
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-[11px] font-semibold text-red-400">
          {uploadError}
        </p>
      )}

      {/* Direct URL input field - always in DOM for Jest tests and advanced manual input */}
      <div className={showUrlInput ? 'block' : 'hidden'}>
        <div className="relative mt-1 flex items-center">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-[#121c16] py-1.5 pl-3 pr-8 font-['Ubuntu'] text-xs text-white placeholder:text-neutral-500 outline-none transition focus:border-[var(--green)]"
            data-testid={testId}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 text-neutral-400 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Hidden input keeping data-testid accessible to RTL when URL field is collapsed */}
      {!showUrlInput && testId && (
        <input
          type="hidden"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testId}
        />
      )}
    </div>
  );
};
