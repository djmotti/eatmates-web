
const cachePrefix = 'eatmates-web-shell-';
const cacheName = cachePrefix + '751f30f6592f93cc';
const shellUrls = ["assets/index-BpeHy41U.js","assets/index-CKHVtu-M.css","assets/index.esm-CYjVuxfc.js","assets/index.esm-CxOwZfKi.js","assets/index.esm-hBmI33oz.js","assets/index.esm-x8vGtbx-.js","icons/eatmates-logo.png","index.html","legal/delete-account/index.html","legal/privacy/index.html","manifest.json","manifest.webmanifest"].map(file => new URL(file, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shellUrls)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(cachePrefix) && key !== cacheName)
    .map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin
      || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(cacheName)
      .then(cache => cache.match(new URL('index.html', self.registration.scope).href))));
  } else if (shellUrls.includes(url.href)) {
    event.respondWith(caches.open(cacheName).then(async cache =>
      (await cache.match(request)) || fetch(request)));
  }
});
