import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// self.__WB_MANIFEST is the default injection point for Workbox precaching
precacheAndRoute(self.__WB_MANIFEST);

// Clean old assets
cleanupOutdatedCaches();

// To allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

// Push event listener
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/assets/icon.png", // Ensure this path is correct
  };
  event.waitUntil(self.registration.showNotification("Holding Time", options));
});
