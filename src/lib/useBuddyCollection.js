
"use client";

import { useCallback, useEffect, useState } from "react";

const COLLECTION_KEY = "snuggle-buddies-collection";
const COLLECTION_EVENT = "snuggle-buddies-collection-change";

export function useBuddyCollection(buddies = []) {
  const [collected, setCollected] = useState([]);

  const validIds = buddies.map((buddy) => buddy.id);

  const filterCollected = useCallback(
    (ids) => ids.filter((id) => validIds.includes(id)),
    [buddies]
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(COLLECTION_KEY) || "[]"
      );

      setCollected(
        Array.isArray(stored)
          ? filterCollected(
              stored.filter((id) => typeof id === "string")
            )
          : []
      );
    } catch {
      setCollected([]);
    }

    function handleCollectionChange(event) {
      if (Array.isArray(event.detail)) {
        setCollected(filterCollected(event.detail));
      }
    }

    function handleStorageChange(event) {
      if (event.key === COLLECTION_KEY) {
        try {
          const stored = JSON.parse(event.newValue || "[]");

          setCollected(
            Array.isArray(stored) ? filterCollected(stored) : []
          );
        } catch {
          setCollected([]);
        }
      }
    }

    window.addEventListener(
      COLLECTION_EVENT,
      handleCollectionChange
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        COLLECTION_EVENT,
        handleCollectionChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [filterCollected]);

  const toggleCollection = useCallback((id) => {
    setCollected((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      try {
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable.
      }

      window.dispatchEvent(
        new CustomEvent(COLLECTION_EVENT, { detail: next })
      );

      return next;
    });
  }, []);

  return { collected, toggleCollection };
}