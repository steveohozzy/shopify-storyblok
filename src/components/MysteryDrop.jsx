"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import { storyblokEditable } from "@storyblok/react";

export default function MysteryDrop({ blok }) {
  const [phase, setPhase] = useState("sealed");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const image = product?.image || "";
  const imageAlt = product?.imageAlt || product?.name || "Mystery collectible";
  const title = product?.name || "";
  const description = product?.description || "";
  const productUrl = product?.url || "";

  const price = product
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: product.currency,
      }).format(Number(product.price))
    : "";

  const heading =
    blok.Title || blok.title || "Something special";

  const headingAccent =
    blok.TitleAccent || blok.titleAccent || "is waiting.";

  const eyebrow =
    blok.Eyebrow || blok.eyebrow || "The next drop";

  const intro =
    blok.Description ||
    blok.description ||
    "Every collector loves a surprise. Open the box to discover this drop.";

  const teaserTitle =
    blok.TeaserTitle ||
    blok.teaserTitle ||
    "You never know what’s inside.";

  const teaserText =
    blok.TeaserText ||
    blok.teaserText ||
    "One box. One special collectible. Open the drop and see what’s waiting for you.";

  const openButtonText =
    blok.OpenButtonText ||
    blok.openButtonText ||
    "Open mystery drop";

  const replayButtonText =
    blok.ReplayButtonText ||
    blok.replayButtonText ||
    "Open it again";

  const revealedButtonText =
    blok.RevealedButtonText ||
    blok.revealedButtonText ||
    "Discover the collectible";

  useEffect(() => {
    if (phase !== "opening") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setPhase("revealed");
      return;
    }

    const timeout = window.setTimeout(() => {
      setPhase("revealed");
    }, 1900);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  async function openDrop() {
    if (phase === "opening" || loading) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      const vendorFilter =
        blok.VendorFilter || blok.vendorFilter || "";

      const productTypeFilter =
        blok.ProductTypeFilter || blok.productTypeFilter || "";

      if (vendorFilter.trim()) {
        params.set("vendor", vendorFilter.trim());
      }

      if (productTypeFilter.trim()) {
        params.set("productType", productTypeFilter.trim());
      }

      const query = params.toString();

      const response = await fetch(
        `/api/mystery-drop${query ? `?${query}` : ""}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to open the Mystery Drop."
        );
      }

      setProduct(result);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      setPhase(reducedMotion ? "revealed" : "opening");
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function replayDrop() {
    setProduct(null);
    setError("");
    setPhase("sealed");
  }

  const revealed = phase === "revealed";
  const opening = phase === "opening";

  return (
    <section
      {...storyblokEditable(blok)}
      className="overflow-hidden bg-[#101321] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#04d9ff]">
              <Sparkles className="h-4 w-4" />
              {eyebrow}
            </p>

            <h2 className="max-w-3xl font-heading text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-8xl">
              {heading}
              <span className="block text-[#04d9ff]">
                {headingAccent}
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/55 lg:justify-self-end">
            {intro}
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-[#171b2b] lg:grid-cols-2">
          <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden border-b border-white/10 bg-[#121a2a] px-6 py-12 sm:min-h-[500px] lg:border-b-0 lg:border-r">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(4,217,255,0.13),transparent_60%)]" />

            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#04d9ff]/10 transition-all duration-700 sm:h-80 sm:w-80 ${
                opening || revealed
                  ? "scale-125 border-[#04d9ff]/35 opacity-100"
                  : "scale-90 opacity-50"
              }`}
            />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 sm:h-64 sm:w-64" />

            <div
              className={`relative z-10 flex flex-col items-center ${
                opening ? "mystery-shaking" : ""
              } ${revealed ? "mystery-box-open" : ""}`}
            >
              {revealed ? (
                <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
                  <div className="absolute inset-5 rounded-full bg-[#04d9ff]/10 blur-2xl" />

                  {image ? (
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      priority
                      sizes="(max-width: 639px) 70vw, 320px"
                      className="relative z-10 object-contain drop-shadow-[0_0_28px_rgba(4,217,255,0.22)]"
                      unoptimized
                    />
                  ) : (
                    <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-3xl border border-white/15 bg-white/5">
                      <Sparkles className="h-12 w-12 text-[#04d9ff]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                  <div
                    className={`absolute -inset-8 rounded-full bg-[#04d9ff]/10 blur-3xl transition-opacity duration-500 ${
                      opening ? "opacity-100" : "opacity-40"
                    }`}
                  />

                  <div className="absolute bottom-4 left-1/2 h-5 w-48 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />

                  <div
                    className={`absolute bottom-8 left-1/2 h-36 w-44 -translate-x-1/2 rounded-b-xl border border-[#04d9ff]/30 bg-gradient-to-br from-[#26384b] via-[#142333] to-[#0b111e] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 sm:h-40 sm:w-48 ${
                      opening ? "mystery-box-base" : ""
                    }`}
                  >
                    <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-[#04d9ff]/80 shadow-[0_0_20px_rgba(4,217,255,0.35)]" />
                    <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-[#04d9ff]/80 shadow-[0_0_20px_rgba(4,217,255,0.35)]" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="relative z-10 h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(4,217,255,0.9)]" />
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-[156px] left-1/2 z-10 h-12 w-48 -translate-x-1/2 rounded-t-lg border border-[#04d9ff]/40 bg-gradient-to-br from-[#35495d] to-[#142333] shadow-[0_0_25px_rgba(4,217,255,0.08)] transition-all duration-700 sm:bottom-[168px] sm:w-52 ${
                      opening
                        ? "-translate-y-12 rotate-[-12deg] opacity-0"
                        : ""
                    }`}
                  >
                    <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-[#04d9ff]/80" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
                  </div>

                  {opening && (
                    <>
                      <Sparkles className="absolute left-3 top-8 h-5 w-5 animate-ping text-[#04d9ff]" />
                      <Sparkles className="absolute right-1 top-16 h-4 w-4 animate-pulse text-white" />
                      <Sparkles className="absolute bottom-20 right-0 h-6 w-6 animate-ping text-[#04d9ff]" />
                    </>
                  )}
                </div>
              )}

              <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
                {revealed
                  ? "Drop unlocked"
                  : opening
                    ? "Something is inside..."
                    : "Sealed. Until you say so."}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <div className="mb-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#04d9ff]">
              {revealed ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <LockKeyhole className="h-4 w-4" />
              )}
              {revealed ? "Your mystery revealed" : "A mystery awaits"}
            </div>

            {revealed ? (
              <div className="mystery-reveal">
                <h3 className="mt-5 font-heading text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
                  {title || "The mystery collectible"}
                </h3>

                {price && (
                  <p className="mt-3 text-lg font-bold text-[#04d9ff]">
                    {price}
                  </p>
                )}

                {description && (
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                    {description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {productUrl && (
                    <Link
                      href={productUrl}
                      className="inline-flex items-center justify-between gap-4 rounded-full bg-[#04d9ff] px-6 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#101321] transition-colors hover:bg-white"
                    >
                      {revealedButtonText}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={replayDrop}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65 transition-colors hover:border-[#04d9ff]/60 hover:text-[#04d9ff]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {replayButtonText}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-3xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
                  {opening
                    ? "The moment of truth."
                    : teaserTitle}
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50">
                  {opening
                    ? "Something special is making its entrance."
                    : teaserText}
                </p>

                <button
                  type="button"
                  onClick={openDrop}
                  disabled={loading || opening}
                  className="mt-8 inline-flex w-full items-center justify-between gap-4 rounded-full bg-[#04d9ff] px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-[#101321] transition-all hover:bg-white disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                >
                  {loading
                    ? "Finding your drop..."
                    : opening
                      ? "Opening the drop..."
                      : openButtonText}
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 text-sm leading-relaxed text-red-300"
                  >
                    {error}
                  </p>
                )}

                <p className="mt-4 text-[9px] leading-relaxed text-white/30">
                  A little surprise for your inner collector.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes mystery-shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          20% { transform: translateX(-5px) rotate(-2deg); }
          40% { transform: translateX(5px) rotate(2deg); }
          60% { transform: translateX(-4px) rotate(-1deg); }
          80% { transform: translateX(4px) rotate(1deg); }
        }

        @keyframes mystery-reveal {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mystery-shaking {
          animation: mystery-shake 0.35s ease-in-out infinite;
        }

        .mystery-reveal {
          animation: mystery-reveal 0.6s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .mystery-shaking,
          .mystery-reveal {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}