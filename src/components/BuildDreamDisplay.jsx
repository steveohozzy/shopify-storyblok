"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { storyblokEditable } from "@storyblok/react";
import { resolveLink } from "@/lib/storyblok";

const STORAGE_KEY = "dropzone-dream-display";
const MAX_ITEMS = 4;

const getField = (item, lower, upper) =>
  item?.[lower] ?? item?.[upper] ?? "";

const getImage = (item) =>
  getField(item, "image", "Image")?.filename || "";

const displayStyles = [
  { id: "gallery", label: "Gallery" },
  { id: "shelf", label: "The Shelf" },
  { id: "neon", label: "After Dark" },
];

export default function BuildDreamDisplay({ blok }) {
  const items = blok.items || blok.Items || [];

  const [selectedIds, setSelectedIds] = useState([]);
  const [displayStyle, setDisplayStyle] = useState("gallery");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed.selectedIds)) {
          setSelectedIds(parsed.selectedIds);
        }

        if (
          displayStyles.some(
            (style) => style.id === parsed.displayStyle
          )
        ) {
          setDisplayStyle(parsed.displayStyle);
        }
      }
    } catch {
      // Continue with an empty display if saved data is unavailable.
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedIds, displayStyle })
      );
    } catch {
      // The display remains usable if localStorage is unavailable.
    }
  }, [selectedIds, displayStyle, loaded]);

  const getItemId = (item, index) =>
    item._uid ||
    item.id ||
    getField(item, "title", "Title") ||
    String(index);

  const isSelected = (item, index) =>
    selectedIds.includes(getItemId(item, index));

  const selectedItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => isSelected(item, index));

  function toggleItem(item, index) {
    const id = getItemId(item, index);

    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      if (current.length >= MAX_ITEMS) {
        return current;
      }

      return [...current, id];
    });
  }

  function clearDisplay() {
    setSelectedIds([]);
  }

  const heading = blok.title || "Build your";
  const accent = blok.titleAccent || "dream display.";

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
              {blok.eyebrow || "Your collection. Your rules."}
            </p>

            <h2 className="max-w-3xl font-heading text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-8xl">
              {heading}
              <span className="block text-[#04d9ff]">{accent}</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/55 lg:justify-self-end">
            {blok.description ||
              "Pick your favourite pieces, build your ultimate lineup and give your collection a place of its own."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div
              className={`relative flex min-h-[390px] flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 p-5 transition-colors duration-500 sm:min-h-[510px] sm:p-8 ${
                displayStyle === "neon"
                  ? "bg-[#101a2c]"
                  : displayStyle === "shelf"
                    ? "bg-[#25202a]"
                    : "bg-[#1a2031]"
              }`}
            >
              {displayStyle === "neon" && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(4,217,255,0.15),transparent_65%)]" />
              )}

              <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Your display
                </span>

                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em]">
                  {selectedItems.length} / {MAX_ITEMS} pieces
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="relative z-10 mx-auto my-auto max-w-sm py-16 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#04d9ff]/50 text-[#04d9ff]">
                    <Sparkles className="h-7 w-7" />
                  </div>

                  <h3 className="font-heading text-2xl font-black sm:text-3xl">
                    Your space. Your statement.
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45">
                    Choose a few pieces below and watch your display come
                    together.
                  </p>
                </div>
              ) : (
                <div className="relative z-10 mt-14 flex flex-1 flex-col justify-end">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {selectedItems.map(({ item, index }, position) => {
                      const image = getImage(item);
                      const title =
                        getField(item, "title", "Title") ||
                        "Collectible";

                      return (
                        <div
                          key={getItemId(item, index)}
                          className={`group relative flex min-w-0 flex-col items-center justify-end transition-all duration-500 ${
                            displayStyle === "neon"
                              ? "drop-shadow-[0_0_18px_rgba(4,217,255,0.2)]"
                              : ""
                          }`}
                          style={{
                            animationDelay: `${position * 100}ms`,
                          }}
                        >
                          <div className="relative flex h-36 w-full items-center justify-center sm:h-48">
                            {image ? (
                              <Image
                                src={image}
                                alt={
                                  getField(item, "imageAlt", "ImageAlt") ||
                                  title
                                }
                                fill
                                sizes="(max-width: 639px) 40vw, 20vw"
                                className="object-contain p-1 transition-transform duration-300 group-hover:-translate-y-2"
                              />
                            ) : (
                              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 text-white/25">
                                <Sparkles className="h-8 w-8" />
                              </div>
                            )}
                          </div>

                          <div
                            className={`h-2 w-full rounded-sm ${
                              displayStyle === "neon"
                                ? "bg-[#04d9ff] shadow-[0_0_15px_rgba(4,217,255,0.45)]"
                                : displayStyle === "shelf"
                                  ? "bg-[#95745d]"
                                  : "bg-white/20"
                            }`}
                          />

                          <p className="mt-3 max-w-full truncate text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 sm:text-xs">
                            {title}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`mt-8 h-1 rounded-full ${
                      displayStyle === "neon"
                        ? "bg-[#04d9ff]/30"
                        : "bg-white/10"
                    }`}
                  />
                </div>
              )}

              <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Display style
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {displayStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setDisplayStyle(style.id)}
                        aria-pressed={displayStyle === style.id}
                        className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] transition-colors sm:px-4 ${
                          displayStyle === style.id
                            ? "bg-[#04d9ff] text-[#101321]"
                            : "border border-white/15 text-white/55 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearDisplay}
                  disabled={selectedItems.length === 0}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-[#04d9ff] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Start again
                </button>
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-white/35">
              Your display is saved in this browser. It is a prototype, so
              it won't sync between devices.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#171b2b] p-5 sm:p-7">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#04d9ff]">
                  The lineup
                </p>

                <h3 className="font-heading text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                  Choose your pieces
                </h3>
              </div>

              <span className="pb-1 text-xs text-white/40">
                {items.length} available
              </span>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {items.map((item, index) => {
                  const selected = isSelected(item, index);
                  const image = getImage(item);
                  const title =
                    getField(item, "title", "Title") ||
                    "Untitled collectible";
                  const description = getField(
                    item,
                    "category",
                    "Category"
                  );

                  return (
                    <button
                      key={getItemId(item, index)}
                      type="button"
                      onClick={() => toggleItem(item, index)}
                      aria-pressed={selected}
                      disabled={!selected && selectedIds.length >= MAX_ITEMS}
                      className={`group relative min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                        selected
                          ? "border-[#04d9ff] bg-[#04d9ff]/[0.08]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/30"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white/[0.025] p-3">
                        {image ? (
                          <Image
                            src={image}
                            alt={
                              getField(item, "imageAlt", "ImageAlt") || title
                            }
                            fill
                            sizes="(max-width: 639px) 45vw, 20vw"
                            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Sparkles className="h-8 w-8 text-white/20" />
                        )}

                        <span
                          className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                            selected
                              ? "border-[#04d9ff] bg-[#04d9ff] text-[#101321]"
                              : "border-white/20 bg-[#101321]/80 text-transparent"
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="p-3 sm:p-4">
                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                          {title}
                        </p>

                        {description && (
                          <p className="mt-1 truncate text-[9px] uppercase tracking-[0.12em] text-white/40">
                            {description}
                          </p>
                        )}

                        <p
                          className={`mt-3 text-[9px] font-bold uppercase tracking-[0.12em] ${
                            selected
                              ? "text-[#04d9ff]"
                              : "text-white/40"
                          }`}
                        >
                          {selected
                            ? "In your display −"
                            : selectedIds.length >= MAX_ITEMS
                              ? "Display full"
                              : "+ Add to display"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                <p className="text-sm text-white/50">
                  Add collectible entries to this component in Storyblok to
                  start building your display.
                </p>
              </div>
            )}

            {blok.ctaText && resolveLink(blok.ctaLink) && (
              <Link
                href={resolveLink(blok.ctaLink)}
                className="mt-6 flex items-center justify-between rounded-full bg-[#04d9ff] px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#101321] transition-colors hover:bg-white"
              >
                {blok.ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}