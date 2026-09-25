"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { ContributeModal } from '@/components/ContributeModal';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Bell } from 'lucide-react';

export default function PrivacyPage() {
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar onContributeClick={() => setIsContributeOpen(true)} />

      <div className="mx-auto min-h-[70vh] max-w-[960px] px-6 py-12 sm:px-10 sm:py-16">
        {/* Breadcrumb / Back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] transition hover:text-[var(--green)]"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--green)]/30 bg-[var(--green)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--green)]">
            <ShieldCheck size={14} />
            <span>Creanote Legal & Trust</span>
          </div>
          <h1 className="font-['Ubuntu'] text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Last updated: September 2026 &bull; Effective immediately
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-[15px] leading-[1.8] text-[#c7d0cb]">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <Eye className="text-[var(--green)]" size={20} />
              1. Information We Collect
            </h2>
            <p className="mb-4 text-[var(--muted)]">
              At Creanote, we believe in radical transparency and minimal data collection. We only collect information that is strictly necessary to operate our creative publishing platform and celebrate creator stories:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[#d4ded7]">
              <li>
                <strong className="text-white">Community Submissions:</strong> When you submit a quote, note, or creative story through our contribute forms, we store your provided name, role, quote/story copy, and any optional visual artwork or avatars you upload.
              </li>
              <li>
                <strong className="text-white">Newsletter Subscriptions:</strong> If you choose to subscribe to our weekly note or dispatch, we collect and store your email address to deliver updates. You can unsubscribe at any time with one click.
              </li>
              <li>
                <strong className="text-white">Usage &amp; Performance Metrics:</strong> We track anonymous aggregated browsing statistics (such as page views and search queries) to improve platform responsiveness and discoverability.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <Lock className="text-[var(--green)]" size={20} />
              2. How We Protect &amp; Use Your Data
            </h2>
            <p className="mb-4 text-[var(--muted)]">
              Your trust is our cornerstone. We handle all creator data in accordance with modern security standards:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[#d4ded7]">
              <li>We never sell, rent, or monetize your personal data to third parties or advertisers.</li>
              <li>Community submissions that are approved are published publicly on Creanote to inspire other creators across the timeline.</li>
              <li>All database transmissions are encrypted via TLS/SSL, and visual assets are securely hosted on hardened cloud storage.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <FileText className="text-[var(--green)]" size={20} />
              3. Creator Content Rights
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              You retain 100% intellectual property ownership of your quotes, notes, and visual artwork submitted to Creanote. By submitting your content, you grant Creanote a non-exclusive license to display, format, and share your contribution within our community timeline and official social channels with attribution to your name and role.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <Bell className="text-[var(--green)]" size={20} />
              4. Contact &amp; Data Requests
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              If you ever wish to modify, edit, or delete a story or quote you submitted, or unsubscribe your email address, simply reach out to us at{' '}
              <a
                href="mailto:officialcreanote@gmail.com"
                className="font-bold text-[var(--green)] underline transition hover:text-white"
              >
                officialcreanote@gmail.com
              </a>
              . We will process your request promptly.
            </p>
          </section>
        </div>
      </div>

      <Footer />
      <BackToTop />
      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
      />
    </main>
  );
}
