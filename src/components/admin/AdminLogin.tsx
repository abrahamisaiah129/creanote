'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      data-testid="admin-login-screen"
    >
      <div
        className="admin-card"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="logo-box"
            style={{ margin: '0 auto 14px auto', width: '32px', height: '32px' }}
          >
            <svg viewBox="0 0 14 14" style={{ width: '20px', height: '20px' }}>
              <rect x="1" y="1" width="5" height="5" rx="1" />
              <rect x="8" y="1" width="5" height="5" rx="1" />
              <rect x="1" y="8" width="5" height="5" rx="1" />
              <rect x="8" y="8" width="5" height="5" rx="1" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: 'Ubuntu',
              fontWeight: 800,
              fontSize: '22px',
              color: 'var(--text)',
              marginBottom: '6px',
            }}
          >
            Creanote CMS
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
            Authorization required to access the admin console
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
            data-testid="admin-login-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
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
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
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
            className="admin-btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
            data-testid="admin-login-btn"
          >
            {loading ? 'Authenticating...' : 'Unlock Admin Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            href="/"
            style={{
              color: 'var(--muted)',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'color .2s',
            }}
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
