"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { ContributeModal } from '@/components/ContributeModal';
import { Scale, ArrowLeft, CheckSquare, AlertTriangle, Copyright, HeartHandshake } from 'lucide-react';

export default function TermsPage() {
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
            <Scale size={14} />
            <span>Creanote Legal & Governance</span>
          </div>
          <h1 className="font-['Ubuntu'] text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Last updated: September 2026 &bull; Effective immediately
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-[15px] leading-[1.8] text-[#c7d0cb]">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <CheckSquare className="text-[var(--green)]" size={20} />
              1. Agreement to Terms
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              Welcome to Creanote (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing, browsing, reading, or submitting content to Creanote (available at our website and associated digital services), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <HeartHandshake className="text-[var(--green)]" size={20} />
              2. Community Guidelines &amp; Submissions
            </h2>
            <p className="mb-4 text-[var(--muted)]">
              Creanote is a positive, supportive sanctuary built for creators worldwide. When submitting quotes, stories, or creative notes:
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-[#d4ded7]">
              <li>
                <strong className="text-white">Authenticity:</strong> You must only submit original thoughts, real journey experiences, or properly credited quotes that inspire the craft.
              </li>
              <li>
                <strong className="text-white">Respect &amp; Civility:</strong> Content promoting hate speech, harassment, defamation, explicit violence, or illegal conduct is strictly prohibited and will be removed immediately.
              </li>
              <li>
                <strong className="text-white">Appropriate Visuals:</strong> Any images uploaded alongside quotes must respect intellectual property rights and be appropriate for a broad creative audience.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <Copyright className="text-[var(--green)]" size={20} />
              3. Intellectual Property &amp; Attribution
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              All branding, logos, design systems, illustrations, and proprietary code comprising Creanote are the exclusive property of Creanote and its founders. Creator-submitted quotes and narratives remain the property of their respective creators. Creanote is granted the perpetual right to display and archive approved submissions within our platform.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <AlertTriangle className="text-[var(--green)]" size={20} />
              4. Disclaimer &amp; Platform Availability
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              Creanote is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While we strive for maximum uptime and reliability, we do not warrant uninterrupted or error-free operation. We reserve the right to curate, edit formatting, or moderate any submission to maintain quality and community safety.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 font-['Ubuntu'] text-xl font-bold text-white">
              <Scale className="text-[var(--green)]" size={20} />
              5. Governing Law &amp; Inquiries
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              For any questions regarding these Terms or licensing queries, please contact our team directly at{' '}
              <a
                href="mailto:officialcreanote@gmail.com"
                className="font-bold text-[var(--green)] underline transition hover:text-white"
              >
                officialcreanote@gmail.com
              </a>
              .
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
