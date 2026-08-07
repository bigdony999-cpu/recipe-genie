/**
 * Tiny, safe wrapper around Simple Analytics' `sa_event` goal tracking.
 * No-ops when the script hasn't loaded or isn't installed (e.g. local dev),
 * and never throws.
 */
export function trackEvent(name: string) {
  try {
    const w = window as unknown as { sa_event?: (n: string) => void };
    w.sa_event?.(name);
  } catch {
    /* analytics must never break the app */
  }
}
