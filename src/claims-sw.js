import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";

// self.__WB_MANIFEST is the default injection point for Workbox precaching
precacheAndRoute(self.__WB_MANIFEST);

// Clean old assets
cleanupOutdatedCaches();

let allowlist;
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// To allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);

self.skipWaiting();
clientsClaim();

// Push event listener
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/assets/pwa-64x64.png", // Ensure this path is correct
  };
  event.waitUntil(self.registration.showNotification("Holding Time", options));
});
