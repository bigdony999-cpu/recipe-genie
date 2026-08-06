/* Minimal service worker for PWA installability.
 * Strategy: network-first with a runtime cache fallback for GET requests,
 * so the app always gets fresh content but still works offline once cached.
 */
const CACHE = "wsc-v1";

self.addEventListener("install", (event) => {
  // Best-effort pre-cache: if one asset fails (e.g. first visit offline) the
  // install still succeeds, so the SW activates and runtime caching works.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(
          ["/", "/manifest.webmanifest", "/logo.svg"].map((url) =>
            cache.add(url),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Never touch non-http(s) or dev-tool requests.
  const url = new URL(request.url);
  if (!/^https?:$/.test(url.protocol)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful same-origin GETs for offline use.
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/")),
      ),
  );
});
