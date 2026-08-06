import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wsc.savedRecipes";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Recipes the user bookmarked on this device. Kept in localStorage so the
 * whole feature works with zero backend — matching the "no sign-up" promise.
 */
export function useSavedRecipes() {
  const [saved, setSaved] = useState<string[]>(readSaved);

  // Keep open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setSaved(readSaved());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Private mode or quota — the in-memory state still works this tab.
      }
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => saved.includes(id),
    [saved],
  );

  return { saved, isSaved, toggleSaved };
}
