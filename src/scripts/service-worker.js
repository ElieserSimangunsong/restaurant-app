import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
  })
);

registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

registerRoute(
  new RegExp('https://restaurant-api.dicoding.dev/'),
  new StaleWhileRevalidate({
    cacheName: 'restaurant-api-cache',
  })
);
