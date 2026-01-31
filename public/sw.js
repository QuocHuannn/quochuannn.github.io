const VERSION = '251202-p5';
const CACHE_NAME = `portfolio-v${VERSION}`;
const STATIC_CACHE = `static-v${VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/ava-dlat.webp',
  '/images/ava-dlat-800.webp',
  '/images/ava-dlat-400.webp',
  '/assets/js/index-Dcz5EtRH.js',
  '/assets/js/vendor-Dr3LqIF9.js',
  '/assets/js/react-vendor-Z_4RhRe6.js',
  '/assets/js/utils-B30PI53b.js',
  '/assets/js/hooks-Bg0oNxwz.js',
  '/assets/js/theme-core-CFJN5RsB.js',
  '/assets/js/motion-Bk-wstwu.js',
  '/assets/js/theme-advanced-8-y3tNqu.js',
  '/assets/js/theme-misc-BuaoJUQ8.js',
  '/assets/js/theme-components-OduIQvfo.js',
  '/assets/js/ui-D5DiGoh7.js',
  '/assets/js/sections-BxGVI77o.js',
  '/assets/js/themeChunkSplitter-gogGKRIm.js',
  '/assets/index-DjA_JYGh.css',
  '/assets/mobile-enhancements.css',
  '/assets/accessibility-enhancements.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except whitelisted APIs)
  if (url.origin !== location.origin && url.origin !== 'https://trae-api-sg.mchost.guru') {
    return;
  }
  
  // Stale-while-revalidate strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Determine cache strategy
            const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;

            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Fallback for offline
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }

            // Return a fallback image for failed image requests
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });

        // Return cached response immediately, update in background
        return cachedResponse || fetchPromise;
      })
  );
});

// Helper function to determine if asset is static
function isStaticAsset(url) {
  return url.includes('.js') || 
         url.includes('.css') || 
         url.includes('.woff') || 
         url.includes('.woff2') || 
         url.includes('/images/') ||
         url.includes('manifest.json');
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(
      // Sync analytics data when back online
      syncAnalytics()
    );
  }
});

function syncAnalytics() {
  // Implementation for syncing analytics data
  return Promise.resolve();
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});