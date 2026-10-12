
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Heart,
  Search,
  X,
  ArrowLeft,
  Bookmark,
  Plus,
  Check,
} from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";
import { useBuddyFavourites } from "@/lib/useBuddyFavourites";
import { useBuddyCollection } from "@/lib/useBuddyCollection";

export default function Header({ blok, buddies = [] }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState("");
  const { saved, toggleFavourite } = useBuddyFavourites(buddies);
  const { collected, toggleCollection } = useBuddyCollection(buddies);
  const [selected, setSelected] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setPanel(null);
        setSelected(null);
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function getNavHref(item) {
    const pageLink = resolveLink(item.Link);

    if (item.HomepageAnchor) {
      if (pathname === "/") {
        return `#${item.HomepageAnchor}`;
      }

      if (pageLink && pageLink !== "/") {
        return `${pageLink}#${item.HomepageAnchor}`;
      }

      return `/#${item.HomepageAnchor}`;
    }

    return pageLink || "/";
  }

  function openSearch() {
    setQuery("");
    setSelected(null);
    setPanel("search");
    setOpen(false);
  }

  function openFavourites() {
    setQuery("");
    setSelected(null);
    setPanel("saved");
    setOpen(false);
  }

  function openCollection() {
    setQuery("");
    setSelected(null);
    setPanel("collection");
    setOpen(false);
  }

  const results = buddies.filter((buddy) => {
    if (panel === "saved" && !saved.includes(buddy.id)) {
      return false;
    }

    if (panel === "collection" && !collected.includes(buddy.id)) {
      return false;
    }

    const searchText = [
      buddy.name,
      buddy.category,
      buddy.description,
      buddy.line,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(query.toLowerCase());
  });

  return (
    <>
      <header
        {...storyblokEditable(blok)}
        className="sticky top-0 z-50 border-b border-border bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex h-24 items-center justify-between">
            <Link
              href="/"
              className="relative h-20 w-40 shrink-0"
              onClick={() => setOpen(false)}
            >
              <Image
                src={
                  blok?.Logo?.filename ||
                  "https://www.addoplay.com/wp-content/uploads/2025/04/AP_Licensing.png"
                }
                alt={blok?.LogoAlt || "ADDO Play"}
                fill
                className="object-contain object-left"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              {blok?.Navigation?.map((item) => (
                <Link
                  key={item._uid}
                  href={getNavHref(item)}
                  target={item.OpenInNewTab ? "_blank" : undefined}
                  rel={
                    item.OpenInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group inline-flex items-center gap-1.5 py-2 font-heading text-sm text-foreground transition-colors hover:text-primary lg:text-base"
                >
                  <span>{item.Label}</span>

                  {item.OpenInNewTab && (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search Snuggle Buddies"
                title="Search"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={openFavourites}
                aria-label={`Favourite buddies (${saved.length})`}
                title="Favourites"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Heart
                  className="h-5 w-5"
                  fill={saved.length ? "currentColor" : "none"}
                />

                {saved.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {saved.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openCollection}
                aria-label={`My collection (${collected.length})`}
                title="My collection"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Bookmark className="h-5 w-5" />

                {collected.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {collected.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:bg-muted md:hidden"
              >
                <div className="relative h-6 w-6">
                  <span
                    className={`absolute left-0 top-1 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "translate-y-2 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-3 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-5 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "-translate-y-2 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile navigation flyout */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[60] flex h-dvh w-full max-w-[400px] flex-col overflow-y-auto border-l border-border bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <Link
            href="/"
            className="relative h-14 w-40 shrink-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src={
                blok?.Logo?.filename ||
                "https://www.addoplay.com/wp-content/uploads/2025/04/AP_Licensing.png"
              }
              alt={blok?.LogoAlt || "ADDO Play"}
              fill
              className="object-contain object-left"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-2xl text-foreground transition-colors hover:bg-muted"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-5 py-4">
          {blok?.Navigation?.map((item) => (
            <Link
              key={item._uid}
              href={getNavHref(item)}
              target={item.OpenInNewTab ? "_blank" : undefined}
              rel={
                item.OpenInNewTab ? "noopener noreferrer" : undefined
              }
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between border-b border-border px-3 py-5 font-heading text-lg text-foreground transition-colors hover:text-primary"
            >
              <span>{item.Label}</span>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-2 gap-3 border-t border-border p-5">
          <button
            type="button"
            onClick={openFavourites}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Heart className="h-4 w-4" />
            Favourites ({saved.length})
          </button>

          <button
            type="button"
            onClick={openCollection}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Bookmark className="h-4 w-4" />
            My collection ({collected.length})
          </button>

          <button
            type="button"
            onClick={openSearch}
            className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Find a buddy
          </button>
        </div>
      </aside>

      {/* Search, favourites and collection dialog */}
      {panel && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground/40 px-4 py-8 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPanel(null);
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="buddy-dialog-title"
            className="my-auto flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2
                  id="buddy-dialog-title"
                  className="font-heading text-2xl font-bold text-foreground"
                >
                  {panel === "saved"
                    ? "Your favourite buddies"
                    : panel === "collection"
                      ? "My collection"
                      : "Find your buddy"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {panel === "saved"
                    ? "Your little cuddle collection."
                    : panel === "collection"
                      ? "The buddies you already own."
                      : "A little friend is waiting to meet you."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPanel(null);
                  setSelected(null);
                }}
                aria-label="Close dialog"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selected ? (
              <div className="overflow-y-auto p-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to results
                </button>

                <img
                  src={selected.image}
                  alt={selected.name}
                  className="mb-5 aspect-square w-full rounded-2xl bg-muted object-cover"
                />

                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {selected.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.category}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  {selected.description || selected.line}
                </p>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`https://www.thetoyshop.com/p/${encodeURIComponent(
                      selected.id
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Find at The Entertainer
                    <ArrowUpRight className="h-4 w-4" />
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
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={
                        saved.includes(selected.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCollection(selected.id)}
                    aria-label={
                      collected.includes(selected.id)
                        ? "Remove from my collection"
                        : "Add to my collection"
                    }
                    title={
                      collected.includes(selected.id)
                        ? "Remove from my collection"
                        : "Add to my collection"
                    }
                    className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted ${
                      collected.includes(selected.id)
                        ? "bg-primary text-primary-foreground"
                        : "text-primary"
                    }`}
                  >
                    {collected.includes(selected.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {panel === "search" && (
                  <div className="px-5 pt-5">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary">
                      <Search className="h-5 w-5 shrink-0 text-muted-foreground" />

                      <input
                        type="search"
                        autoFocus
                        aria-label="Search animal buddies"
                        placeholder="Elephant, fox, dinosaur..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-12 min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                      />

                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label="Clear search"
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {results.map((buddy) => {
                        const isSaved = saved.includes(buddy.id);
                        const isCollected = collected.includes(buddy.id);

                        return (
                          <div
                            key={buddy.id}
                            className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted"
                          >
                            <button
                              type="button"
                              onClick={() => setSelected(buddy)}
                              className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                            >
                              <img
                                src={buddy.image}
                                alt={buddy.name}
                                className="h-16 w-16 shrink-0 rounded-xl bg-muted object-cover"
                              />

                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-heading text-base font-bold text-foreground">
                                  {buddy.name}
                                </span>

                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {buddy.category}
                                </span>
                              </span>

                              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleFavourite(buddy.id)}
                              aria-label={
                                isSaved
                                  ? `Remove ${buddy.name} from favourites`
                                  : `Add ${buddy.name} to favourites`
                              }
                              title={
                                isSaved
                                  ? "Remove favourite"
                                  : "Add favourite"
                              }
                              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-white"
                            >
                              <Heart
                                className="h-5 w-5"
                                fill={isSaved ? "currentColor" : "none"}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCollection(buddy.id)}
                              aria-label={
                                isCollected
                                  ? `Remove ${buddy.name} from my collection`
                                  : `Add ${buddy.name} to my collection`
                              }
                              title={
                                isCollected
                                  ? "Remove from my collection"
                                  : "Add to my collection"
                              }
                              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white ${
                                isCollected
                                  ? " text-primary"
                                  : "bg-primary text-primary text-primary-foreground"
                              }`}
                            >
                              {isCollected ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      {panel === "collection" ? (
                        <Bookmark className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      ) : (
                        <Heart className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      )}

                      <p className="mt-4 font-heading text-lg font-bold text-foreground">
                        {panel === "saved"
                          ? "No favourites just yet"
                          : panel === "collection"
                            ? "Your collection is waiting"
                            : "No buddies found"}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {panel === "saved"
                          ? "Search for a buddy and tap the heart to save it here."
                          : panel === "collection"
                            ? "Add buddies you already own using the plus button on their cards."
                            : "Try another name or category, such as fox or dinosaur."}
                      </p>

                      {(panel === "saved" || panel === "collection") && (
                        <button
                          type="button"
                          onClick={openSearch}
                          className="mt-5 cursor-pointer rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Find a buddy
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-border px-6 py-3">
                  <p className="text-xs text-muted-foreground">
                    {panel === "saved"
                      ? `${results.length} favourite${results.length === 1 ? "" : "s"}`
                      : panel === "collection"
                        ? `${results.length} buddy${results.length === 1 ? "" : "ies"} in your collection`
                        : `${results.length} buddy${results.length === 1 ? "" : "ies"} found`}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}