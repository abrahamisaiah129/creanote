"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { ContributeModal } from '@/components/ContributeModal';
import { UploadCloud, ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      <Navbar onContributeClick={() => setIsContributeOpen(true)} />

      <div className="mx-auto min-h-[60vh] max-w-[1280px] px-6 py-12 sm:px-10 sm:py-14">
        {/* Page Title */}
        <div className="mb-6 font-['Ubuntu'] text-xl font-bold text-[var(--text)] sm:text-2xl">
          About Creanote
        </div>

        {/* Narrative Section */}
        <div className="max-w-[850px] text-[15px] leading-[1.8] text-[var(--muted)]">
          <p className="mb-5 font-['Ubuntu'] text-xl font-bold text-white sm:text-2xl">
            If you create, then you belong here.
          </p>
          <p className="mb-4">
            Creanote was founded on a simple truth: the creative journey is often romanticized at the finish line, but rarely documented in its raw, messy, and vulnerable beginnings.
          </p>
          <p className="mb-4">
            Whether you are a developer pushing your first repository, a designer crafting interfaces late into the night, a writer battling blank pages, or an entrepreneur pivoting after unexpected hurdles, Creanote is your community timeline.
          </p>
          <p className="mb-6">
            We celebrate the failed attempts that teach mastery, the quiet daily commits that compound over time, and the unvarnished stories that remind every creator: your current struggle isn&apos;t your permanent reality.
          </p>
        </div>

        {/* Quote Upload CTA Section with Creanote Pattern Background */}
        <section
          className="relative mt-10 w-full overflow-hidden rounded-[24px] border border-white/10 sm:rounded-[28px] md:mt-14"
          data-testid="about-quote-cta"
        >
          {/* Background Pattern Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/creanote-pattern.png"
              alt="Creanote pattern"
              fill
              className="object-cover object-center select-none"
              priority
            />
            {/* Gradient Overlay for visual depth and high contrast readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b110d]/95 via-[#0e1712]/90 to-[#0b110d]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,244,106,0.15),transparent_60%)]" />
          </div>

          {/* CTA Content Container */}
          <div className="relative z-10 flex flex-col justify-between gap-8 p-6 sm:p-10 md:p-12 lg:flex-row lg:items-center">
            {/* Left Content */}
            <div className="max-w-[620px]">

              <h2 className="mt-4 font-['Ubuntu'] text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Have a Quote That Inspires Creators?
              </h2>

              <p className="mt-3 text-[14px] leading-relaxed text-[#c7d0cb] sm:text-[15px]">
                Share the words, lessons, or raw mantras that kept you going through your hardest builds. Upload your quote with your desired artwork or photo to be featured across the Creanote community timeline.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsContributeOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-6 py-3.5 font-['Ubuntu'] text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-[#20e365] active:scale-[0.98]"
                  data-testid="about-upload-quote-btn"
                >
                  <UploadCloud size={18} />
                  <span>Upload Quote</span>
                </button>

                <Link
                  href="/quotes"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-['Ubuntu'] text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
                >
                  <span>Explore Timeline</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="w-full max-w-[340px] rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-md max-lg:self-start">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="font-mono text-[11px] font-bold text-[var(--green)]">LIVE FEATURE</span>
              </div>
              <p className="mt-3 font-serif text-base italic leading-snug text-white">
                &ldquo;The quiet commits made when nobody is watching compound into monuments.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--green)]/20 text-xs font-bold text-[var(--green)]">
                  C
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Your Name & Visual</p>
                  <p className="text-[10px] text-[var(--muted)]">Your Niche</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Existing Explore Links */}
        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6">
          <h4 className="mb-2 text-base font-bold text-[var(--green)]">
            Explore More From Creanote
          </h4>
          <p className="mb-4 text-sm text-[var(--text)]">
            Dive into developer journals, startup retrospectives, and visual essays.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/stories"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--green)] px-6 font-['Ubuntu'] text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#20e365] active:scale-[0.98]"
            >
              Explore Stories
            </Link>
            <Link
              href="/quotes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-6 font-['Ubuntu'] text-sm font-bold text-white transition hover:border-[var(--green)] hover:text-[var(--green)] active:scale-[0.98]"
            >
              Read Quotes
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Contribute Modal Pre-configured for Quote Upload */}
      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        defaultTab="quote"
      />
    </main>
  );
}
