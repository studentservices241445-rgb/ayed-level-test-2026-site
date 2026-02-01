// Simple service worker for offline caching
const CACHE_NAME = 'step-level-cache-v1';

// List of assets to cache. Relative paths are used because the site may be
// hosted from a subdirectory (e.g. on GitHub Pages). If you add new pages
// or assets, make sure to include them here so they are available offline.
const URLS_TO_CACHE = [
  './',
  './index.html',
  './level-test.html',
  './results.html',
  './quiz.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/level-test.js',
  './assets/js/questions.js',
  './assets/js/results.js',
  './assets/js/quiz.js',
  './assets/img/hero-bg.jpg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches if necessary
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Serve from cache first, then fall back to network
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});