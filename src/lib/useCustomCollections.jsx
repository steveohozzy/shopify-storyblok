
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dropzone-custom-collections";

export function useCustomCollections() {
  const [collections, setCollections] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCollections(
            parsed.filter(
              (item) =>
                item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Array.isArray(item.buddyIds)
            )
          );
        }
      }
    } catch {
      // Keep an empty collection list if saved data is invalid.
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    } catch {
      // Keep the current session working if storage is unavailable.
    }
  }, [collections, loaded]);

  function createCollection(name) {
    const cleanName = name.trim();

    if (!cleanName) return;

    const newCollection = {
      id: `collection-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      buddyIds: [],
    };

    setCollections((current) => [...current, newCollection]);

    return newCollection.id;
  }

  function renameCollection(id, name) {
    const cleanName = name.trim();

    if (!cleanName) return;

    setCollections((current) =>
      current.map((item) =>
        item.id === id ? { ...item, name: cleanName } : item
      )
    );
  }

  function deleteCollection(id) {
    setCollections((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function toggleBuddyInCollection(collectionId, buddyId) {
    const id = String(buddyId);

    setCollections((current) =>
      current.map((item) => {
        if (item.id !== collectionId) return item;

        const exists = item.buddyIds.includes(id);

        return {
          ...item,
          buddyIds: exists
            ? item.buddyIds.filter((buddyId) => buddyId !== id)
            : [...item.buddyIds, id],
        };
      })
    );
  }

  return {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    toggleBuddyInCollection,
    loaded,
  };
}
