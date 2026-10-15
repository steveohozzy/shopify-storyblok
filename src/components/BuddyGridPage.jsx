"use client";

import Link from "next/link";
import { ArrowRight, Heart, Plus, Check } from "lucide-react";
import { useBuddyFavourites } from "@/lib/useBuddyFavourites";
import { useBuddyCollection } from "@/lib/useBuddyCollection";

export default function BuddyGridPage({ items = [] }) {
  const { saved, toggleFavourite } = useBuddyFavourites(items);
  const { collected, toggleCollection } = useBuddyCollection(items);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((buddy, index) => {
          const isSaved = saved.includes(buddy.id);
          const isCollected = collected.includes(buddy.id);
          const imageBackground =
            index % 2 === 0 ? "bg-[#f9e6e2]" : "bg-[#e7f2ed]";

          return (
            <article key={buddy.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#edf1f1]">
              <a
                href={`/products/${buddy.handle}`}
                aria-label={`View ${buddy.name}`}
                className="block h-full w-full"
              >
                <img
                  src={buddy.image}
                  alt={buddy.imageAlt || buddy.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>

              <span className="absolute left-4 top-4 rounded-full bg-[#0a9df5] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                {String(index + 1).padStart(2, "0")} / {buddy.category}
              </span>

              <button
                type="button"
                onClick={() => toggleFavourite(buddy.id)}
                aria-label={`${isSaved ? "Remove" : "Save"} ${buddy.name}${
                  isSaved ? " from favourites" : ""
                }`}
                title={isSaved ? "Remove favourite" : "Save favourite"}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
              >
                <Heart
                  className="h-4 w-4"
                  fill={isSaved ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </button>

              <button
                type="button"
                onClick={() => toggleCollection(buddy.id)}
                aria-label={`${
                  isCollected ? "Remove" : "Add"
                } ${buddy.name} ${isCollected ? "from" : "to"} collection`}
                title={
                  isCollected
                    ? "Remove from collection"
                    : "Add to collection"
                }
                className="absolute right-4 top-16 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
              >
                {isCollected ? (
                  <Check className="h-4 w-4 text-[#0a9df5]" strokeWidth={2.5} />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </div>

            <div className="flex items-start justify-between gap-3 pt-4">
              <div className="min-w-0">
                <a
                  href={`/products/${buddy.handle}`}
                  className="text-sm font-bold tracking-tight text-foreground transition-colors hover:text-[#0a9df5]"
                >
                  {buddy.name}
                </a>

                {buddy.line && (
                  <p className="mt-1 text-[11px] text-[#64727c]">
                    {buddy.line}
                  </p>
                )}
              </div>

              <p className="shrink-0 text-sm font-bold text-foreground">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: buddy.currency || "GBP",
                }).format(Number(buddy.price))}
              </p>
            </div>
          </article>
          );
        })}
      </div>
    </>
  );
}
