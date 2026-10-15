
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";

export default function HomeHero({ blok }) {
  const isVideo = blok.media === "video";
  const videoUrl = blok.videoUrl;
  const mainImage = blok.mainImage?.filename;

  const [activeCard, setActiveCard] = useState(null);

  const sideCards = [
    {
      id: 1,
      image: blok.sideImage1?.filename,
      alt: blok.sideImage1Alt || "",
      label: blok.sideImage1Label || "01 / Figures",
    },
    {
      id: 2,
      image: blok.sideImage2?.filename,
      alt: blok.sideImage2Alt || "",
      label: blok.sideImage2Label || "02 / Trading cards",
    },
  ];

  const primaryLink = resolveLink(blok.primaryButtonLink);
  const secondaryLink = resolveLink(blok.secondaryButtonLink);

  return (
    <section
      {...storyblokEditable(blok)}
      id="top"
      className="relative mx-auto max-w-[1440px] overflow-hidden px-5 pb-16 pt-6 text-[#101321] sm:px-8 lg:px-12 lg:pb-24 lg:pt-8"
    >
      {/* Heading */}
      <div className="mb-5 flex items-end justify-between gap-5">
        <div>
          {blok.eyebrow && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#04bfe3]">
              {blok.eyebrow}
            </p>
          )}

          <h1 className="max-w-4xl font-heading text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.07em]">
            {blok.title}
            {blok.titleAccent && (
              <>
                {" "}
                <span className="text-[#04d9ff]">
                  {blok.titleAccent}
                </span>
              </>
            )}
          </h1>
        </div>

        {blok.tagline && (
          <p className="hidden shrink-0 text-right text-[11px] font-bold uppercase leading-relaxed tracking-[0.15em] text-[#647084] sm:block">
            {blok.tagline}
          </p>
        )}
      </div>

      {/* Image gallery */}
      <div
        className={`grid gap-3 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-cols-[minmax(0,1fr)_300px] ${
          activeCard !== null
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            : ""
        }`}
      >
        {/* Main image */}
        <div
          className={`group relative min-h-[390px] overflow-hidden rounded-[24px] bg-[#e8edf0] transition-[border-radius,box-shadow] duration-500 sm:min-h-[560px] lg:min-h-[650px] ${
            activeCard !== null
              ? "shadow-[0_0_30px_rgba(4,217,255,0.10)]"
              : ""
          }`}
        >
          {isVideo && videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          ) : mainImage ? (
            <Image
              src={mainImage}
              alt={blok.mainImageAlt || blok.mainImage?.alt || ""}
              fill
              priority
              quality={95}
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#647084]">
              Add a main image in Storyblok
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101321]/35 via-transparent to-transparent opacity-80" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-8 sm:bottom-8">
            {blok.imageStampTitle && (
              <span className="rounded-full bg-white/90 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#101321] backdrop-blur-md sm:text-[10px]">
                {blok.imageStampTitle}
              </span>
            )}

            {blok.imageStampText && (
              <span className="hidden rounded-full bg-[#04d9ff] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#101321] shadow-[0_0_24px_rgba(4,217,255,0.25)] sm:block">
                {blok.imageStampText}
              </span>
            )}
          </div>
        </div>

        {/* Side images */}
        <div
          className={`grid min-h-0 grid-cols-2 gap-3 transition-[grid-template-rows,grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-cols-1 ${
            activeCard === null
              ? "grid-rows-1 lg:grid-rows-2"
              : activeCard === 0
                ? "grid-rows-1 lg:grid-rows-[minmax(0,1fr)_minmax(0,0fr)]"
                : "grid-rows-1 lg:grid-rows-[minmax(0,0fr)_minmax(0,1fr)]"
          }`}
        >
          {sideCards.map((card, idx) => {
            const isActive = activeCard === idx;
            const isHidden = activeCard !== null && !isActive;

            return (
              <div
                key={card.id}
                role="button"
                tabIndex={isHidden ? -1 : 0}
                aria-expanded={isActive}
                aria-hidden={isHidden}
                aria-label={`${isActive ? "Collapse" : "Expand"} ${card.label}`}
                onClick={() => setActiveCard(isActive ? null : idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveCard(isActive ? null : idx);
                  }
                }}
                className={`group relative min-h-[190px] min-w-0 overflow-hidden rounded-[24px] border bg-[#e8edf0] transition-[opacity,transform,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[270px] lg:min-h-0 ${
                  isHidden
                    ? "pointer-events-none scale-[0.96] border-transparent opacity-0 hidden lg:block"
                    : isActive
                      ? "col-span-2 min-h-[390px] cursor-pointer border-[#04d9ff]/60 shadow-[0_0_25px_rgba(4,217,255,0.12)] sm:min-h-[560px] lg:col-span-1 lg:min-h-0"
                      : "cursor-pointer border-transparent hover:border-[#04d9ff]/60 hover:shadow-[0_8px_25px_rgba(16,19,33,0.08)]"
                }`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      quality={90}
                      sizes="(max-width: 1024px) 50vw, 600px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#647084]">
                      Add image in Storyblok
                    </div>
                  )}
                </div>

                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#101321] backdrop-blur-md sm:left-4 sm:top-4 sm:text-[9px]">
                  {card.label}
                </span>

                {isActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCard(null);
                    }}
                    aria-label="Collapse image"
                    className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm text-[#101321] backdrop-blur-md transition-colors hover:bg-[#04d9ff]"
                  >
                    ✕
                  </button>
                )}

                <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#04d9ff] text-[#101321] transition-transform duration-300 group-hover:translate-x-0.5 sm:bottom-4 sm:right-4">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description and buttons */}
      <div className="grid gap-6 pt-6 sm:pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          {blok.descriptionTitle && (
            <h2 className="font-heading text-xl font-bold tracking-[-0.04em] sm:text-2xl">
              {blok.descriptionTitle}
            </h2>
          )}

          {blok.description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#647084] sm:text-base">
              {blok.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {blok.primaryButtonText && (
            <Link
              href={primaryLink || "#"}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#101321] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#04d9ff] hover:text-[#101321]"
            >
              {blok.primaryButtonText}
            </Link>
          )}

          {blok.secondaryButtonText && (
            <Link
              href={secondaryLink || "#"}
              className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em]"
            >
              {blok.secondaryButtonText}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#04d9ff] text-[#101321] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
