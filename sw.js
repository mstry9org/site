// --- Nightscout Stats Service Worker ---
// Version 3 - strips referer/origin and forces fresh network fetches

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Always fetch from network with no cached headers
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  // Create a clean request with no referer/origin
  const cleanRequest = new Request(req.url, {
    method: "GET",
    headers: new Headers(), // empty headers = no referer/origin
    cache: "no-store",
    redirect: "follow",
    mode: "cors",
    credentials: "omit"
  });

  event.respondWith(
    fetch(cleanRequest).catch(() => fetch(req, { cache: "no-store" }))
  );
});
