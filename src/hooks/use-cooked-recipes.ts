import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wsc.cookedRecipes";

function readCooked(): string[] {
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
 * Recipes the user has marked as "cooked it". Kept in localStorage so the
 * feature works with zero backend — matching the "no sign-up" promise.
 */
export function useCookedRecipes() {
  const [cooked, setCooked] = useState<string[]>(readCooked);

  // Keep open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setCooked(readCooked());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleCooked = useCallback((id: string) => {
    setCooked((prev) => {
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

  const isCooked = useCallback(
    (id: string) => cooked.includes(id),
    [cooked],
  );

  return { cooked, isCooked, toggleCooked };
}
