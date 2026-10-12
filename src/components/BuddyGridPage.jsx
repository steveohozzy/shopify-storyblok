"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Heart, X } from "lucide-react";
import { useBuddyFavourites } from "@/lib/useBuddyFavourites";

export default function BuddyGridPage({ items = [] }) {
const { saved, toggleFavourite } = useBuddyFavourites(items);
const [selected, setSelected] = useState(null);

useEffect(() => {
function handleKeyDown(event) {
if (event.key === "Escape") {
setSelected(null);
}
}


window.addEventListener("keydown", handleKeyDown);

return () => {
  window.removeEventListener("keydown", handleKeyDown);
};


}, []);

function openBuddy(buddy) {
setSelected(buddy);
}

return (
<> <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
{items.map((buddy, index) => {
const isSaved = saved.includes(buddy.id);
const imageBackground =
index % 2 === 0 ? "bg-[#f9e6e2]" : "bg-[#e7f2ed]";


      return (
        <article
          key={buddy.id}
          className="group overflow-hidden rounded-[24px] border border-[#004c46]/20 md:border-[#004c46]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#004c46]/20 shadow-[0_8px_17px_rgba(0,76,70,0.10)] md:shadow-none hover:shadow-[0_16px_35px_rgba(0,76,70,0.10)]"
        >
          <div
            className={`buddy-image relative aspect-square overflow-hidden ${imageBackground}`}
          >
            <button
              type="button"
              onClick={() => openBuddy(buddy)}
              aria-label={`Meet ${buddy.name}`}
              className="block h-full w-full cursor-pointer"
            >
              <img
                src={buddy.image}
                alt={`Snuggle Buddies ${buddy.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
            </button>

            <span className="buddy-kind absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#004c46] shadow-sm backdrop-blur-sm">
              {buddy.category}
            </span>

            <button
              type="button"
              className={`favorite absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#004c46] shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white ${
                isSaved ? "is-saved !text-primary" : ""
              }`}
              onClick={() => toggleFavourite(buddy.id)}
              aria-label={`${isSaved ? "Unsave" : "Save"} ${buddy.name}`}
              title={isSaved ? "Remove favourite" : "Add favourite"}
            >
              <Heart
                size={19}
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 p-5 bg-background">
            <div className="min-w-0">
              <h3 className="mb-1 font-heading text-xl font-bold leading-tight text-[#004c46] sm:text-2xl">
                {buddy.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#004c46]/70">
                {buddy.line}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00594f] text-white transition-all duration-300 hover:rotate-[-35deg] hover:bg-[#003f39] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00594f] focus-visible:ring-offset-2"
              aria-label={`Discover ${buddy.name}`}
              onClick={() => openBuddy(buddy)}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </article>
      );
    })}
  </div>

  {selected && (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setSelected(null);
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="buddy-modal-title"
        aria-describedby="buddy-modal-description"
        className="relative my-auto grid w-full max-w-md shrink-0 gap-4 rounded-2xl border border-border bg-background p-4 shadow-lg sm:p-6"
      >
        <img
          src={selected.image}
          alt={selected.name}
          className="modal-product aspect-square w-full rounded-xl object-cover"
        />

        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2
            id="buddy-modal-title"
            className="font-heading text-2xl font-bold tracking-tight text-[#004c46]"
          >
            {selected.name}
          </h2>

          <p
            id="buddy-modal-description"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {selected.description || selected.line}
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={`https://www.thetoyshop.com/p/${encodeURIComponent(
              selected.id
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#00594f] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003f39] [&_svg]:size-4"
          >
            Find at The Entertainer
            <ArrowRight />
          </a>

          <button
            type="button"
            onClick={() => toggleFavourite(selected.id)}
            aria-label={
              saved.includes(selected.id)
                ? "Remove from favourites"
                : "Add to favourites"
            }
            title="Toggle favourite"
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#004c46]/20 bg-white text-primary shadow-sm transition-colors hover:bg-[#f9e6e2]"
          >
            <Heart
              className="h-4 w-4"
              fill={
                saved.includes(selected.id) ? "currentColor" : "none"
              }
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSelected(null)}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer rounded-full border border-input bg-background p-2 shadow-md transition-colors hover:bg-[#f9e6e2] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </section>
    </div>
  )}
</>


);
}
