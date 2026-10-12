"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BuddyGridPage from "@/components/BuddyGridPage";

export default function BuddiesPageClient({
buddies = [],
searchPlaceholder = "Find a little friend…",
emptyMessage = "No little friends found this time.",
resetButtonLabel = "See all buddies",
}) {
const searchParams = useSearchParams();
const [query, setQuery] = useState("");
const [category, setCategory] = useState("All buddies");

const categories = useMemo(() => {
  const buddyCategories = buddies
    .flatMap((buddy) =>
      (buddy.category || "")
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean)
    );

  return [
    "All buddies",
    ...new Set(buddyCategories),
  ];
}, [buddies]);

useEffect(() => {
const requestedCategory = searchParams.get("category");


if (
  requestedCategory &&
  categories.includes(requestedCategory)
) {
  setCategory(requestedCategory);
} else {
  setCategory("All buddies");
}


}, [searchParams, categories]);

const items = useMemo(() => {
const search = query.trim().toLowerCase();

console.table(
  buddies
    .filter((buddy) => {
      const buddyCategories = (buddy.category || "")
        .split(",")
        .map((item) => item.trim());

      return (
        category === "All buddies" ||
        buddyCategories.includes(category)
      );
    })
    .map((buddy) => ({
      name: buddy.name,
      id: buddy.id,
      category: buddy.category,
    }))
);


return buddies.filter((buddy) => {
  const buddyCategories = (buddy.category || "")
    .split(",")
    .map((item) => item.trim());

  const matchesCategory =
    category === "All buddies" ||
    buddyCategories.includes(category);

  const searchableText = [
    buddy.name,
    buddy.category,
    buddy.line,
    buddy.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    matchesCategory &&
    searchableText.includes(search)
  );
});


}, [buddies, category, query]);

function changeCategory(item) {
setCategory(item);


const params = new URLSearchParams(window.location.search);

if (item === "All buddies") {
  params.delete("category");
} else {
  params.set("category", item);
}

const queryString = params.toString();
const newUrl = queryString
  ? `${window.location.pathname}?${queryString}`
  : window.location.pathname;

window.history.replaceState(null, "", newUrl);


}

function resetFilters() {
setQuery("");
setCategory("All buddies");


const params = new URLSearchParams(window.location.search);
params.delete("category");

const queryString = params.toString();
const newUrl = queryString
  ? `${window.location.pathname}?${queryString}`
  : window.location.pathname;

window.history.replaceState(null, "", newUrl);


}

return (
<> <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"> <div
       className="flex flex-wrap gap-2"
       aria-label="Buddy categories"
     >
{categories.map((item) => {
const isActive = item === category;


        return (
          <button
            key={item}
            type="button"
            onClick={() => changeCategory(item)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>

    <label className="flex w-full items-center gap-3 rounded-full border border-border bg-background px-4 py-3 lg:max-w-xs">
      <Search
        size={18}
        className="shrink-0 text-muted-foreground"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search buddies"
        placeholder={searchPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
  </div>

  <p className="mb-6 text-sm text-muted-foreground">
    {items.length}{" "}
    {items.length === 1 ? "buddy" : "buddies"} to meet
  </p>

  {items.length > 0 ? (
    <BuddyGridPage items={items} />
  ) : (
    <div className="py-12 text-center">
      <p className="mb-4 text-muted-foreground">
        {emptyMessage}
      </p>

      <button
        type="button"
        onClick={resetFilters}
        className="font-semibold text-primary transition-colors hover:text-foreground"
      >
        {resetButtonLabel}
      </button>
    </div>
  )}
</>


);
}
