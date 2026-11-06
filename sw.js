// Network first for the app files, so updates arrive at once; the cache is only a fallback offline.
// The list data itself is cached by Firestore, not here.
const CACHE = "kniyot-v4";
const SHELL = ["./", "index.html", "app.css", "app.js", "manifest.webmanifest", "icon.svg", "icon-192.png"];
// The Firebase libraries come from gstatic. Without them the app cannot open at all, so they are kept
// here too: a phone opened with no reception (inside the supermarket) still reaches the saved list.
// The URLs carry the version, so their content never changes. Keep SDK in step with app.js.
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
const SDK_FILES = ["firebase-app.js", "firebase-auth.js", "firebase-firestore.js"].map(f => SDK + f);
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).then(() => c.addAll(SDK_FILES).catch(() => {}))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (e.request.url.startsWith(SDK)) {   // versioned library file: the saved copy first, the network only if missing
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
