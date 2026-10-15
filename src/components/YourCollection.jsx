
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  FolderPlus,
  LayoutGrid,
  Layers,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCustomCollections } from "@/lib/useCustomCollections";
import { useBuddyCollection } from "@/lib/useBuddyCollection";

const themes = [
  { id: "shelf", name: "Collector shelf" },
  { id: "gallery", name: "Gallery" },
  { id: "neon", name: "Neon vault" },
];

const backgrounds = [
  { id: "dark", name: "Midnight", value: "#101321" },
  { id: "blue", name: "Deep blue", value: "#101d35" },
  { id: "light", name: "Ice", value: "#edf4f7" },
  { id: "pink", name: "Blush", value: "#f5e5e8" },
];

const DEFAULT_DISPLAY = {
  theme: "shelf",
  background: "dark",
  lighting: "#04d9ff",
  displayIds: [],
};

export default function YourCollection({ items = [] }) {
  const { collected, toggleCollection } = useBuddyCollection(items);

  const {
    collections: customCollections,
    createCollection,
    renameCollection,
    deleteCollection,
    toggleBuddyInCollection,
  } = useCustomCollections();

  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [browseAllItems, setBrowseAllItems] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [displaySettingsByCollection, setDisplaySettingsByCollection] =
    useState({});
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [category, setCategory] = useState("All items");
  const [search, setSearch] = useState("");

  const collection = useMemo(
    () => items.filter((item) => collected.includes(String(item.id))),
    [items, collected]
  );

  const categories = useMemo(
    () => [
      "All items",
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ],
    [items]
  );

  const activeCustomCollection = customCollections.find(
    (item) => item.id === activeCollectionId
  );

  const displayKey = activeCollectionId || "main";

  const displaySourceItems = activeCustomCollection
    ? items.filter((item) =>
        activeCustomCollection.buddyIds.includes(String(item.id))
      )
    : collection;

  const memberIds = displaySourceItems.map((item) => String(item.id));

  const savedDisplay = displaySettingsByCollection[displayKey];

  const currentDisplay = savedDisplay
    ? {
        ...DEFAULT_DISPLAY,
        ...savedDisplay,
        displayIds: Array.isArray(savedDisplay.displayIds)
          ? savedDisplay.displayIds.map(String)
          : memberIds,
      }
    : {
        ...DEFAULT_DISPLAY,
        displayIds: memberIds,
      };

  const { theme, background, lighting, displayIds } = currentDisplay;

  const sourceItems = activeCustomCollection
    ? browseAllItems
      ? items
      : displaySourceItems
    : collection;

  const filteredItems = sourceItems.filter((item) => {
    const matchesCategory =
      category === "All items" || item.category === category;

    const matchesSearch = `${item.name} ${item.category || ""} ${
      item.line || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const displayItems = displaySourceItems.filter((item) =>
    displayIds.includes(String(item.id))
  );

  const isLight = background === "light" || background === "pink";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dropzone-collection-displays");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setDisplaySettingsByCollection(parsed);
        }
      } else {
        // Migrate display settings saved by the previous version.
        const legacy = localStorage.getItem("dropzone-collection-display");

        if (legacy) {
          const parsed = JSON.parse(legacy);

          setDisplaySettingsByCollection({
            main: {
              ...DEFAULT_DISPLAY,
              ...parsed,
              displayIds: Array.isArray(parsed.displayIds)
                ? parsed.displayIds.map(String)
                : [],
            },
          });
        }
      }
    } catch {
      // Keep the default display settings.
    }

    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    try {
      localStorage.setItem(
        "dropzone-collection-displays",
        JSON.stringify(displaySettingsByCollection)
      );
    } catch {
      // Keep the current display settings if storage is unavailable.
    }
  }, [displaySettingsByCollection, settingsLoaded]);

  // Keep each display in sync with its own collection membership.
  useEffect(() => {
    if (!settingsLoaded) return;

    setDisplaySettingsByCollection((current) => {
      const existingSettings = current[displayKey] || {
        ...DEFAULT_DISPLAY,
        displayIds: memberIds,
      };

      const existingIds = Array.isArray(existingSettings.displayIds)
        ? existingSettings.displayIds.map(String)
        : [];

      const nextIds = existingIds.filter((id) => memberIds.includes(id));
      const addedIds = memberIds.filter((id) => !existingIds.includes(id));
      const reconciledIds = [...nextIds, ...addedIds];

      if (
        current[displayKey] &&
        reconciledIds.length === existingIds.length &&
        reconciledIds.every((id, index) => id === existingIds[index])
      ) {
        return current;
      }

      return {
        ...current,
        [displayKey]: {
          ...existingSettings,
          displayIds: reconciledIds,
        },
      };
    });
  }, [displayKey, settingsLoaded, activeCustomCollection, collection, items]);

  function updateDisplaySetting(key, value) {
    setDisplaySettingsByCollection((current) => {
      const existing = current[displayKey] || currentDisplay;

      return {
        ...current,
        [displayKey]: {
          ...DEFAULT_DISPLAY,
          ...existing,
          [key]: value,
        },
      };
    });
  }

  function setTheme(value) {
    updateDisplaySetting("theme", value);
  }

  function setBackground(value) {
    updateDisplaySetting("background", value);
  }

  function setLighting(value) {
    updateDisplaySetting("lighting", value);
  }

  function setDisplayIds(updater) {
    setDisplaySettingsByCollection((current) => {
      const existing = current[displayKey] || currentDisplay;

      const nextIds =
        typeof updater === "function"
          ? updater(existing.displayIds || [])
          : updater;

      return {
        ...current,
        [displayKey]: {
          ...DEFAULT_DISPLAY,
          ...existing,
          displayIds: nextIds.map(String),
        },
      };
    });
  }

  function toggleDisplay(id) {
    const value = String(id);

    setDisplayIds((current) =>
      current.includes(value)
        ? current.filter((itemId) => itemId !== value)
        : [...current, value]
    );
  }

  function resetDisplay() {
    setDisplaySettingsByCollection((current) => ({
      ...current,
      [displayKey]: {
        ...DEFAULT_DISPLAY,
        displayIds: memberIds,
      },
    }));
  }

  function openAllItems() {
    setActiveCollectionId(null);
    setBrowseAllItems(true);
    setCategory("All items");
    setSearch("");
  }

  function openCustomCollection(id) {
    setActiveCollectionId(id);
    setBrowseAllItems(false);
    setCategory("All items");
    setSearch("");
  }

  function handleCreateCollection(event) {
    event.preventDefault();

    const id = createCollection(newCollectionName);

    if (id) {
      setActiveCollectionId(id);
      setBrowseAllItems(true);
      setNewCollectionName("");
      setCategory("All items");
      setSearch("");
    }
  }

  function handleDeleteCollection(customCollection) {
    if (
      !window.confirm(
        `Delete "${customCollection.name}"? This won't remove your buddies from your main collection.`
      )
    ) {
      return;
    }

    deleteCollection(customCollection.id);

    if (activeCollectionId === customCollection.id) {
      openAllItems();
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#04d9ff]">
              DROPZONE / COLLECTOR PROFILE
            </p>

            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight sm:text-6xl">
              Your collection<span className="text-[#04d9ff]">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/60">
              Your finds, your display, your rules. Build a space for the
              collectibles you have saved.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-5 py-4">
            <Layers className="h-6 w-6 text-[#04d9ff]" />

            <div>
              <p className="text-2xl font-bold">{collection.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                Collected items
              </p>
            </div>
          </div>
        </header>

        {collection.length === 0 && customCollections.length === 0 ? (
          <section className="rounded-[28px] border border-foreground/10 bg-foreground/[0.03] px-6 py-20 text-center sm:px-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#04d9ff]/10">
              <Layers className="h-8 w-8 text-[#04d9ff]" />
            </div>

            <h2 className="font-heading text-2xl font-bold uppercase">
              Your collection starts here
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground/60">
              Explore the range and hit the + button on anything you want to
              add. You can also create named collections below.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#04d9ff] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#101321] transition hover:brightness-110"
            >
              Explore collectibles
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mx-auto mt-10 max-w-md text-left">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider">
                Create a collection
              </h3>

              <form
                onSubmit={handleCreateCollection}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(event) =>
                    setNewCollectionName(event.target.value)
                  }
                  placeholder="Name your collection..."
                  maxLength={50}
                  aria-label="New collection name"
                  className="min-w-0 flex-1 rounded-xl border border-foreground/10 bg-background px-3 py-3 text-xs outline-none focus:border-[#04d9ff]"
                />

                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  aria-label="Create collection"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#04d9ff] text-[#101321] disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold uppercase">
                  Your items
                </h2>

                <span className="text-xs text-foreground/50">
                  {collection.length} items
                </span>
              </div>

              <section className="mb-5 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    My collections
                  </h3>

                  <FolderPlus className="h-4 w-4 text-[#04d9ff]" />
                </div>

                <form
                  onSubmit={handleCreateCollection}
                  className="mb-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(event) =>
                      setNewCollectionName(event.target.value)
                    }
                    placeholder="Name your collection..."
                    maxLength={50}
                    aria-label="New collection name"
                    className="min-w-0 flex-1 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 text-xs outline-none focus:border-[#04d9ff]"
                  />

                  <button
                    type="submit"
                    disabled={!newCollectionName.trim()}
                    aria-label="Create collection"
                    title="Create collection"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#04d9ff] text-[#101321] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={openAllItems}
                  className={`mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${
                    !activeCollectionId
                      ? "border-[#04d9ff] bg-[#04d9ff]/10 text-[#04d9ff]"
                      : "border-foreground/10 hover:border-foreground/30"
                  }`}
                >
                  <span>All collectibles</span>
                  <span>{collection.length}</span>
                </button>

                <div className="space-y-2">
                  {customCollections.map((customCollection) => {
                    const isActive =
                      activeCollectionId === customCollection.id;

                    const memberCount = customCollection.buddyIds.filter(
                      (id) =>
                        items.some(
                          (buddy) => String(buddy.id) === String(id)
                        )
                    ).length;

                    return (
                      <div
                        key={customCollection.id}
                        className={`rounded-xl border p-3 transition ${
                          isActive
                            ? "border-[#04d9ff] bg-[#04d9ff]/[0.06]"
                            : "border-foreground/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openCustomCollection(customCollection.id)
                          }
                          className="flex w-full items-center justify-between gap-2 text-left"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Layers
                              className={`h-4 w-4 shrink-0 ${
                                isActive
                                  ? "text-[#04d9ff]"
                                  : "text-foreground/50"
                              }`}
                            />

                            <span className="truncate text-xs font-bold">
                              {customCollection.name}
                            </span>
                          </span>

                          <span className="text-[10px] text-foreground/50">
                            {memberCount}
                          </span>
                        </button>

                        <div className="mt-3 flex gap-3 pl-6">
                          <button
                            type="button"
                            onClick={() => {
                              const name = window.prompt(
                                "Rename collection",
                                customCollection.name
                              );

                              if (name !== null && name.trim()) {
                                renameCollection(customCollection.id, name);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground/50 transition hover:text-[#04d9ff]"
                          >
                            <Pencil className="h-3 w-3" />
                            Rename
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCollection(customCollection)
                            }
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground/50 transition hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {activeCustomCollection && (
                <button
                  type="button"
                  onClick={() => {
                    setBrowseAllItems((current) => !current);
                    setCategory("All items");
                    setSearch("");
                  }}
                  className="mb-3 flex w-full items-center justify-between rounded-xl border border-foreground/10 px-3 py-3 text-xs font-bold transition hover:border-[#04d9ff]"
                >
                  <span>
                    {browseAllItems
                      ? "Browsing all collectibles"
                      : `Viewing ${activeCustomCollection.name}`}
                  </span>

                  <span className="text-[#04d9ff]">
                    {browseAllItems ? "Show collection" : "Browse all"}
                  </span>
                </button>
              )}

              <div className="mb-4 flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3">
                <Search className="h-4 w-4 shrink-0 text-foreground/40" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    activeCustomCollection && browseAllItems
                      ? "Find any buddy..."
                      : "Find in your collection..."
                  }
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-foreground/40"
                  aria-label="Search collectibles"
                />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
                      category === item
                        ? "border-[#04d9ff] bg-[#04d9ff] text-[#101321]"
                        : "border-foreground/10 text-foreground/60 hover:border-foreground/30"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {activeCustomCollection && browseAllItems && (
                <p className="mb-3 text-xs leading-5 text-foreground/50">
                  Add any buddy below to {activeCustomCollection.name}.
                </p>
              )}

              <div className="max-h-[780px] space-y-3 overflow-y-auto pr-1">
                {filteredItems.map((item) => {
                  const isCollected = collection.some(
                    (buddy) => String(buddy.id) === String(item.id)
                  );

                  const isDisplayed = displayIds.includes(String(item.id));

                  const isInCustomCollection =
                    activeCustomCollection?.buddyIds.includes(
                      String(item.id)
                    ) || false;

                  return (
                    <article
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-3"
                    >
                      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-foreground/[0.06]">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.imageAlt || item.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}

                        {isDisplayed && isCollected && (
                          <span className="absolute inset-0 flex items-center justify-center bg-[#04d9ff]/25">
                            <Check className="h-5 w-5 text-white drop-shadow" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {item.name}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-foreground/50">
                          {item.category || item.line || "Collectible"}
                        </p>

                        {isCollected && (
                          <button
                            type="button"
                            onClick={() => toggleDisplay(item.id)}
                            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#04d9ff]"
                          >
                            {isDisplayed ? "In display" : "Add to display"}
                          </button>
                        )}

                        {activeCustomCollection && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleBuddyInCollection(
                                activeCustomCollection.id,
                                item.id
                              )
                            }
                            className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#04d9ff]"
                          >
                            {isInCustomCollection ? (
                              <>
                                <Minus className="h-3 w-3" />
                                Remove from collection
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                Add to collection
                              </>
                            )}
                          </button>
                        )}

                        {!activeCustomCollection && !isCollected && (
                          <button
                            type="button"
                            onClick={() => toggleCollection(item.id)}
                            className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#04d9ff]"
                          >
                            <Plus className="h-3 w-3" />
                            Add to main collection
                          </button>
                        )}
                      </div>

                      {isCollected && (
                        <button
                          type="button"
                          onClick={() => toggleCollection(item.id)}
                          aria-label={`Remove ${item.name} from your main collection`}
                          title="Remove from main collection"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/40 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </article>
                  );
                })}

                {filteredItems.length === 0 && (
                  <p className="py-8 text-center text-sm text-foreground/50">
                    {activeCustomCollection && !browseAllItems
                      ? "This collection is empty. Choose Browse all to add buddies."
                      : "No items match your search."}
                  </p>
                )}
              </div>
            </aside>

            <section className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#04d9ff]">
                    Customise your space
                  </p>

                  <h2 className="font-heading text-xl font-bold uppercase">
                    {activeCustomCollection
                      ? `${activeCustomCollection.name} display`
                      : "Display studio"}
                  </h2>

                  <p className="mt-1 text-xs text-foreground/50">
                    {activeCustomCollection
                      ? "Your own items and settings for this collection"
                      : "Your main collection display"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetDisplay}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground/60 transition hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset display
                </button>
              </div>

              <div
                className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-foreground/10 p-5 transition-colors duration-300 sm:p-8 lg:min-h-[620px]"
                style={{
                  backgroundColor:
                    backgrounds.find((item) => item.id === background)?.value ||
                    "#101321",
                  color: isLight ? "#101321" : "#f5f7fb",
                }}
              >
                {theme === "neon" && (
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[90px]"
                    style={{ backgroundColor: lighting }}
                  />
                )}

                <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p
                      className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: lighting }}
                    >
                      {activeCustomCollection
                        ? activeCustomCollection.name
                        : "Personal display / 001"}
                    </p>

                    <h3 className="font-heading text-2xl font-bold uppercase sm:text-3xl">
                      {theme === "shelf"
                        ? "The collector shelf"
                        : theme === "gallery"
                          ? "The gallery"
                          : "The neon vault"}
                    </h3>

                    <p className="mt-2 text-xs opacity-60">
                      {displayItems.length} collectibles on display
                    </p>
                  </div>

                  <Sparkles
                    className="h-6 w-6 shrink-0"
                    style={{ color: lighting }}
                  />
                </div>

                <div
                  className={`relative z-10 mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 ${
                    theme === "gallery" ? "lg:grid-cols-4" : ""
                  }`}
                >
                  {displayItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group relative min-w-0 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 ${
                        theme === "shelf"
                          ? "border border-white/10 bg-black/10 p-2"
                          : theme === "gallery"
                            ? "border border-foreground/10 bg-white/70 p-2 shadow-sm"
                            : "border p-2"
                      }`}
                      style={
                        theme === "neon"
                          ? {
                              borderColor: `${lighting}80`,
                              boxShadow: `0 0 22px ${lighting}20`,
                              backgroundColor: `${lighting}08`,
                            }
                          : undefined
                      }
                    >
                      <Link
                        href={`/products/${item.handle || item.slug || item.id}`}
                        className="block"
                        aria-label={`View ${item.name}`}
                      >
                        <div className="aspect-square overflow-hidden rounded-xl bg-black/5">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.imageAlt || item.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Layers className="h-8 w-8 opacity-20" />
                            </div>
                          )}
                        </div>

                        <div className="px-1 pb-1 pt-3">
                          <p className="truncate text-xs font-bold">
                            {item.name}
                          </p>

                          <p className="mt-1 truncate text-[9px] uppercase tracking-wider opacity-50">
                            {item.category || item.line || "Collectible"}
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleDisplay(item.id)}
                        aria-label={`Remove ${item.name} from display`}
                        title="Remove from display"
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition hover:bg-black group-hover:opacity-100 focus:opacity-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      {theme === "shelf" && (
                        <div
                          className="mx-1 mt-1 h-[3px] rounded-full"
                          style={{
                            backgroundColor: lighting,
                            opacity: 0.75,
                            boxShadow: `0 0 12px ${lighting}70`,
                          }}
                        />
                      )}

                      <span className="sr-only">
                        Display item {index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {displayItems.length === 0 && (
                  <div className="relative z-10 flex min-h-[250px] flex-col items-center justify-center text-center">
                    <LayoutGrid
                      className="mb-4 h-10 w-10 opacity-40"
                      style={{ color: lighting }}
                    />

                    <p className="font-heading text-lg font-bold uppercase">
                      Your space, your way
                    </p>

                    <p className="mt-2 max-w-xs text-xs leading-5 opacity-60">
                      {activeCustomCollection
                        ? "Add buddies to this collection using the left panel."
                        : "Select items from your collection to start building your display."}
                    </p>
                  </div>
                )}

                {theme === "shelf" && displayItems.length > 0 && (
                  <div
                    className="relative z-10 mt-4 h-2 rounded-full"
                    style={{
                      backgroundColor: lighting,
                      opacity: 0.45,
                      boxShadow: `0 0 24px ${lighting}60`,
                    }}
                  />
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-foreground/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-[#04d9ff]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Display style
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {themes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTheme(item.id)}
                        className={`rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                          theme === item.id
                            ? "border-[#04d9ff] bg-[#04d9ff]/10 text-[#04d9ff]"
                            : "border-foreground/10 text-foreground/60 hover:border-foreground/30"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#04d9ff]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Background
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {backgrounds.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBackground(item.id)}
                        title={item.name}
                        aria-label={`Use ${item.name} background`}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                          background === item.id
                            ? "border-[#04d9ff]"
                            : "border-foreground/20"
                        }`}
                        style={{ backgroundColor: item.value }}
                      >
                        {background === item.id && (
                          <Check className="h-3.5 w-3.5 text-[#04d9ff]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#04d9ff]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Lighting
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "#04d9ff",
                      "#a78bfa",
                      "#fb7185",
                      "#a3e635",
                      "#ffffff",
                    ].map((colour) => (
                      <button
                        key={colour}
                        type="button"
                        onClick={() => setLighting(colour)}
                        aria-label={`Set lighting to ${colour}`}
                        title={colour}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                          lighting === colour
                            ? "border-foreground"
                            : "border-foreground/20"
                        }`}
                        style={{
                          backgroundColor: colour,
                          boxShadow:
                            lighting === colour
                              ? `0 0 12px ${colour}70`
                              : "none",
                        }}
                      >
                        {lighting === colour && (
                          <Check className="h-3.5 w-3.5 text-[#101321]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
