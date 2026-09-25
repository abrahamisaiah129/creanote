'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DotsLoader } from '@/components/DotsLoader';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-5"
      data-testid="admin-login-screen"
    >
      <div
        className="admin-card max-w-[420px] w-full p-10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-[var(--border)]"
      >
        <div className="text-center mb-7">
          <div className="logo-box mx-auto mb-[14px] flex justify-center">
            <img
              src="/images/creanote-logo-white.png"
              alt="Creanote CMS"
              className="h-20 w-auto"
            />
          </div>
          <h2
            className="font-[Ubuntu] font-extrabold text-[22px] text-[var(--text)] mb-[6px]"
          >
            Creanote CMS
          </h2>
          <p className="text-[var(--muted)] text-[13px]">
            Authorization required to access the admin console
          </p>
        </div>

        {error && (
          <div
            className="text-[#ef4444] bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] py-[10px] px-[14px] rounded-lg text-[13px] mb-5"
            data-testid="admin-login-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="text-[11px] text-[var(--muted)] tracking-[1px] uppercase font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. abrahamisaiah129"
              required
              autoFocus
              data-testid="admin-username-input"
            />
          </div>

          <div>
            <label
              className="text-[11px] text-[var(--muted)] tracking-[1px] uppercase font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              data-testid="admin-password-input"
            />
          </div>

          <button
            type="submit"
            className="admin-btn-primary w-full mt-2 p-3"
            disabled={loading}
            data-testid="admin-login-btn"
          >
            {loading ? <DotsLoader /> : 'Unlock Admin Dashboard'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-[var(--muted)] text-[13px] no-underline transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
