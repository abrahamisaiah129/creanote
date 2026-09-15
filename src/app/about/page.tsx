import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <div className="section" style={{ minHeight: '60vh' }}>
        <div className="section-label">About Creanote</div>
        <div style={{ maxWidth: '800px', lineHeight: 1.8, color: 'var(--muted)', fontSize: '15px' }}>
          <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            If you create, then you belong here.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Creanote was founded on a simple truth: the creative journey is often romanticized at the finish line, but rarely documented in its raw, messy, and vulnerable beginnings.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Whether you are a developer pushing your first repository, a designer crafting interfaces late into the night, a writer battling blank pages, or an entrepreneur pivoting after unexpected hurdles, Creanote is your community timeline.
          </p>
          <p style={{ marginBottom: '24px' }}>
            We celebrate the failed attempts that teach mastery, the quiet daily commits that compound over time, and the unvarnished stories that remind every creator: your current struggle isn&apos;t your permanent reality.
          </p>

          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              marginTop: '32px',
            }}
          >
            <h4 style={{ color: 'var(--green)', fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
              Want to get involved?
            </h4>
            <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '16px' }}>
              Share your story, submit a note, or subscribe to our weekly digest.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/stories" className="nav-pill">
                Explore Stories
              </Link>
              <Link href="/quotes" className="nav-pill" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
                Read Quotes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
