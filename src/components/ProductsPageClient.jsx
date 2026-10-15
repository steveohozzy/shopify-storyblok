
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BuddyGridPage from "@/components/BuddyGridPage";

export default function ProductsPageClient({
  products = [],
  searchPlaceholder = "Search products...",
  emptyMessage = "No products found.",
  resetButtonLabel = "View all products",
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category?.trim())
      .filter(Boolean);

    return ["All products", ...new Set(productCategories)];
  }, [products]);

  useEffect(() => {
    const requestedCategory = searchParams.get("category");

    setCategory(
      requestedCategory && categories.includes(requestedCategory)
        ? requestedCategory
        : "All products"
    );
  }, [searchParams, categories]);

  const items = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All products" ||
        product.category === category;

      const searchableText = [
        product.name,
        product.category,
        product.line,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(search);
    });
  }, [products, category, query]);

  function changeCategory(item) {
    setCategory(item);

    const params = new URLSearchParams(window.location.search);

    if (item === "All products") {
      params.delete("category");
    } else {
      params.set("category", item);
    }

    const queryString = params.toString();

    window.history.replaceState(
      null,
      "",
      queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname
    );
  }

  function resetFilters() {
    setQuery("");
    changeCategory("All products");
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          aria-label="Product categories"
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
                    ? "border-[#0a9df5] bg-[#0a9df5] text-white"
                    : "border-[#d9dedf] bg-white text-foreground hover:border-[#0a9df5] hover:text-[#0a9df5]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <label className="flex w-full items-center gap-3 rounded-full border border-[#d9dedf] bg-white px-4 py-3 lg:max-w-xs">
          <Search
            size={18}
            className="shrink-0 text-[#64727c]"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search products"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-[#64727c]"
          />
        </label>
      </div>

      <p className="mb-6 text-sm text-[#64727c]">
        {items.length} {items.length === 1 ? "product" : "products"}
      </p>

      {items.length > 0 ? (
        <BuddyGridPage items={items} />
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-sm text-[#64727c]">
            {emptyMessage}
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[#0a9df5] transition-colors hover:text-foreground"
          >
            {resetButtonLabel}
          </button>
        </div>
      )}
    </>
  );
}
