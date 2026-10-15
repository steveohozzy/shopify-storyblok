"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crosshair, Sparkles } from "lucide-react";
import { storyblokEditable } from "@storyblok/react";
import { resolveLink } from "@/lib/storyblok";

export default function CollectorVault({ blok }) {
  const items = blok.items || blok.Items || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedItem = items[selectedIndex];
  const displayImage =
    blok.displayImage?.filename ||
    blok.DisplayImage?.filename ||
    "/hero-collectibles.png";

  const getItemValue = (item, lower, upper) =>
    item?.[lower] ?? item?.[upper] ?? "";

  const getItemImage = (item) =>
    getItemValue(item, "image", "Image")?.filename || "";

  const getItemLink = (item) =>
    resolveLink(getItemValue(item, "link", "Link")) || "";

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative overflow-hidden bg-[#101321] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#04d9ff]">
              <Sparkles className="h-4 w-4" />
              {blok.eyebrow || "Inside the vault"}
            </p>

            <h2 className="max-w-3xl font-heading text-5xl font-black leading-[0.92] tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl">
              {blok.title || "Not just collected."}
              <span className="block text-[#04d9ff]">
                {blok.titleAccent || "Discovered."}
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            {blok.description ||
              "Every collection has a story. Explore the vault and uncover the details behind the pieces worth knowing."}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="relative min-h-[380px] overflow-hidden rounded-[24px] border border-white/10 bg-[#191e30] sm:min-h-[520px] lg:min-h-[620px]">
            <Image
              src={displayImage}
              alt={blok.displayImageAlt || "Collectibles inside the vault"}
              fill
              sizes="(max-width: 1023px) 100vw, 65vw"
              className="object-cover"
              priority={false}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101321]/75 via-transparent to-[#101321]/20" />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#101321]/75 px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#04d9ff]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
                Interactive display
              </span>
            </div>

            {items.map((item, index) => {
              const x = getItemValue(item, "x", "X");
              const y = getItemValue(item, "y", "Y");
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={item._uid || item.id || index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Explore ${getItemValue(item, "title", "Title") || `collectible ${index + 1}`}`}
                  aria-pressed={isSelected}
                  className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ${
                    isSelected
                      ? "scale-110 border-[#04d9ff] bg-[#04d9ff] text-[#101321] shadow-[0_0_30px_rgba(4,217,255,0.65)]"
                      : "border-white/70 bg-[#101321]/70 text-white backdrop-blur-sm hover:scale-110 hover:border-[#04d9ff] hover:text-[#04d9ff]"
                  }`}
                  style={{
                    left: `${Math.min(100, Math.max(0, Number(x) || 50))}%`,
                    top: `${Math.min(100, Math.max(0, Number(y) || 50))}%`,
                  }}
                >
                  {isSelected ? (
                    <Crosshair className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </button>
              );
            })}

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#04d9ff]">
                  Select a piece
                </p>
                <p className="text-sm text-white/70">
                  {items.length
                    ? `${String(selectedIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")} collectibles`
                    : "Add collectibles in Storyblok to get started"}
                </p>
              </div>

              <span className="hidden rounded-full border border-white/20 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-white/70 sm:inline-flex">
                Click the markers
              </span>
            </div>
          </div>

          <div className="flex min-h-[380px] flex-col rounded-[24px] border border-white/10 bg-[#171b2b] p-6 sm:p-8 lg:min-h-0">
            {selectedItem ? (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#04d9ff]">
                    Vault entry {String(selectedIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/60">
                    {getItemValue(selectedItem, "category", "Category") ||
                      "Featured collectible"}
                  </span>
                </div>

                {getItemImage(selectedItem) && (
                  <div className="relative mb-8 aspect-[5/3] overflow-hidden rounded-2xl bg-[#22283b]">
                    <Image
                      src={getItemImage(selectedItem)}
                      alt={
                        getItemValue(selectedItem, "imageAlt", "ImageAlt") ||
                        getItemValue(selectedItem, "title", "Title") ||
                        "Featured collectible"
                      }
                      fill
                      sizes="(max-width: 1023px) 100vw, 35vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
                )}

                <div className="flex-1">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                    {getItemValue(selectedItem, "rarity", "Rarity") ||
                      "Collector's pick"}
                  </p>

                  <h3 className="font-heading text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">
                    {getItemValue(selectedItem, "title", "Title") ||
                      "Untitled collectible"}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    {getItemValue(
                      selectedItem,
                      "description",
                      "Description"
                    ) || "Add a description for this collectible in Storyblok."}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-white/40">
                    <span>Explore the collection</span>
                    <span>
                      {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                      {String(items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {items.map((item, index) => (
                      <button
                        key={item._uid || item.id || index}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        aria-label={`Select collectible ${index + 1}`}
                        aria-pressed={selectedIndex === index}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          selectedIndex === index
                            ? "bg-[#04d9ff]"
                            : "bg-white/15 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  {getItemLink(selectedItem) && (
                    <Link
                      href={getItemLink(selectedItem)}
                      className="mt-6 flex w-full items-center justify-between rounded-full bg-[#04d9ff] px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#101321] transition-colors hover:bg-white"
                    >
                      {getItemValue(selectedItem, "buttonText", "ButtonText") ||
                        "Discover this piece"}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Sparkles className="mb-5 h-8 w-8 text-[#04d9ff]" />
                <h3 className="font-heading text-2xl font-black">
                  Your vault awaits.
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
                  Add some collectible entries to this component in Storyblok
                  and they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}