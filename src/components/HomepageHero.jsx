"use client";

import Image from "next/image";
import Link from "next/link";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";

export default function HomeHero({ blok }) {
  const isVideo = blok.Media === "video";
  const videoId = blok.videoURL;

  return (
    <>
      <section
        {...storyblokEditable(blok)}
        id="top"
        className="relative isolate overflow-hidden bg-[#f9e6e2] text-[#004c46]"
      >
        {/* Hero background */}
        <div className="absolute inset-0">
          {isVideo && videoId ? (
            <video
              src={videoId}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : blok.BackgroundImage?.filename ? (
            <Image
              src={blok.BackgroundImage.filename}
              alt={blok.BackgroundImage.alt || "Snuggle Buddies soft toys"}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-[#f9e6e2]" />
          )}
        </div>

        {/* Content */}
        <div className="relative mx-auto grid min-h-[550px] max-w-7xl grid-cols-1 items-center px-4 py-10 sm:min-h-[600px] sm:px-10 sm:py-16 lg:min-h-[550px] lg:grid-cols-2 lg:px-14 lg:py-20">
          <div className="relative z-10 max-w-[450px]">
            {blok.Tagline && (
              <div className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#004c46] sm:text-xs drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                  <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
                </svg>
                {blok.Tagline}
              </div>
            )}

            <h1 className="font-heading text-6xl font-bold leading-[0.95] sm:text-7xl lg:text-[76px] drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
              {blok.Title}
              {blok.TitleAccent && (
                <>
                  <br />
                  {blok.TitleAccent}
                </>
              )}
            </h1>

            {blok.Subtitle && (
              <p className="hidden md:block mt-6 max-w-[300px] whitespace-pre-line text-base leading-[1.8] text-[#004c46] sm:text-lg drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                {blok.Subtitle}
              </p>
            )}

            {blok.CtaPrimaryText && (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={resolveLink(blok.CtaPrimaryLink) || "#"}
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#00594f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003f39] drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"
                >
                  {blok.CtaPrimaryText}
                  <span
                    className="text-lg transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>

                {blok.CtaSecondaryText && (
                  <Link
                    href={resolveLink(blok.CtaSecondaryLink) || "#"}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#00594f] px-6 py-3 text-sm font-bold text-[#00594f] transition-colors hover:bg-white/60"
                  >
                    {blok.CtaSecondaryText}
                  </Link>
                )}
              </div>
            )}

            {/* Supporting note */}
            {blok.ImageStampText && (
              <div className="mt-5 flex items-center gap-2 text-xs text-[#004c46]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
                {blok.ImageStampText}
              </div>
            )}

            {blok.Stats?.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-6 border-t border-[#004c46]/15 pt-5">
                {blok.Stats.map((stat, i) => (
                  <div key={i}>
                    <dt className="font-heading text-2xl font-black">
                      {stat.Value}
                    </dt>
                    <dd className="mt-1 text-xs font-bold uppercase tracking-wide">
                      {stat.Label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {blok.ImageStampTitle && (
            <div className="absolute right-0 top-10 z-20 flex h-24 w-24 rotate-[10deg] flex-col items-center justify-center rounded-full bg-sunshine px-2 text-center text-primary sm:right-0 sm:top-12 sm:h-28 sm:w-28">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-1 h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
              <span className="text-xs font-medium leading-tight sm:text-sm">
                {blok.ImageStampTitle}
              </span>
              {blok.ImageStampText && (
                <span className="mt-0.5 text-[10px] leading-tight sm:text-xs">
                  {blok.ImageStampText}
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
