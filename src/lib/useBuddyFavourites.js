"use client";

import { useCallback, useEffect, useState } from "react";

const FAVOURITES_KEY = "snuggle-buddies-favourites";
const FAVOURITES_EVENT = "snuggle-buddies-favourites-change";

export function useBuddyFavourites() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(FAVOURITES_KEY) || "[]"
      );

      setSaved(
        Array.isArray(stored)
          ? stored.filter((id) => typeof id === "string")
          : []
      );
    } catch {
      setSaved([]);
    }

    function handleFavouritesChange(event) {
      if (Array.isArray(event.detail)) {
        setSaved(event.detail);
      }
    }

    function handleStorageChange(event) {
      if (event.key === FAVOURITES_KEY) {
        try {
          const stored = JSON.parse(event.newValue || "[]");

          setSaved(
            Array.isArray(stored)
              ? stored.filter((id) => typeof id === "string")
              : []
          );
        } catch {
          setSaved([]);
        }
      }
    }

    window.addEventListener(FAVOURITES_EVENT, handleFavouritesChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        FAVOURITES_EVENT,
        handleFavouritesChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleFavourite = useCallback((id) => {
    setSaved((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable.
      }

      window.dispatchEvent(
        new CustomEvent(FAVOURITES_EVENT, { detail: next })
      );

      return next;
    });
  }, []);

  return { saved, toggleFavourite };
}