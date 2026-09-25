"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DotsLoader } from "@/components/DotsLoader";

interface NewsletterBandProps {
  onSubscribe?: (email: string) => Promise<boolean> | void;
}

export const NewsletterBand: React.FC<NewsletterBandProps> = ({
  onSubscribe,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div
      className="w-full bg-[var(--green)] px-2 py-2 md:px-2 md:py-2 rounded-[24px]"
      data-testid="newsletter-band"
    >
      {/* 25px radius matched brim clip definition */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id="cup-brim-clip" clipPathUnits="objectBoundingBox">
            <path
              d="
                M 0 0 
                H 1 
                C 0.967 0, 0.94 0.043, 0.94 0.095 
                V 0.92 
                C 0.94 0.98, 0.90 1, 0.84 1 
                H 0.16 
                C 0.10 1, 0.06 0.98, 0.06 0.92 
                V 0.095 
                C 0.06 0.043, 0.033 0, 0 0 
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto max-w-[98%]">
        {/* Main Base Card Container */}
        <div className="relative w-full rounded-[24px] overflow-hidden min-h-[240px] md:min-h-[290px]">
          {/* Base Layout Layer: Full Bleed Background Pattern */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/creanote-pattern.png"
              alt=""
              fill
              className="object-cover object-center select-none"
              priority
            />
          </div>

          {/* 
            Foreground Component:
            Updated with larger side padding (px-8 md:px-12 lg:px-14)
            to clear the clipped curves cleanly.
          */}
          <div
            style={{ clipPath: "url(#cup-brim-clip)" }}
            className="absolute top-0 left-4 bottom-4 md:left-12 md:bottom-12 z-10 bg-[var(--green)] w-[38%] max-xl:w-[45%] max-lg:w-[52%] max-md:w-[70%] max-sm:w-[85%] px-8 py-5 md:px-12 md:py-8 lg:px-14 lg:py-10 flex flex-col justify-center"
          >
            <div className="w-full">
              <h3 className="font-['Ubuntu'] text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#131917]">
                Get on the List
              </h3>
              <p className="mt-1.5 md:mt-2 font-['Ubuntu'] text-[11px] sm:text-xs md:text-[13px] font-normal leading-[1.35] text-[#131917] max-w-[320px]">
                Stay updated with new releases, insights,
                <br />
                and exclusive announcements.
              </p>

              {/* Form */}
              <form
                className="mt-4 md:mt-5 flex items-stretch w-full max-w-[340px] md:max-w-[370px] h-9 md:h-10 rounded-[8px] overflow-hidden"
                onSubmit={handleSubmit}
              >
                <input
                  className="h-full min-w-0 flex-1 bg-[#D9D9D9] px-3 md:px-3.5 text-xs md:text-[13px] font-['Ubuntu'] font-normal text-[#131917] placeholder:italic placeholder:text-[#525252] outline-none border-none"
                  type="email"
                  placeholder="officialcreanote@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  required
                  data-testid="newsletter-input"
                />
                <button
                  type="submit"
                  className="h-full px-5 md:px-6 bg-[#131917] text-xs md:text-[13px] font-['Ubuntu'] font-bold text-[var(--green)] transition hover:bg-[#1c2420] active:scale-[0.98] flex items-center justify-center shrink-0 cursor-pointer"
                  disabled={status === "loading"}
                  data-testid="newsletter-submit"
                >
                  {status === "loading" ? <DotsLoader /> : "Send"}
                </button>
              </form>

              {/* Status Output */}
              {message && (
                <div
                  className={`absolute mt-1 md:mt-2 pl-1 text-[11px] md:text-xs font-bold ${
                    status === "success" ? "text-neutral-900" : "text-red-800"
                  }`}
                  data-testid="newsletter-message"
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
