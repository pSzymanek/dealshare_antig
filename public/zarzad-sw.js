const CACHE_NAME = "dealshare-board-v3";
const APP_SHELL = ["/zarzad-manifest.webmanifest", "/sygnet.png", "/sygnet-white.png", "/logo-dark.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    requestUrl.origin !== self.location.origin ||
    event.request.mode === "navigate" ||
    requestUrl.pathname.startsWith("/api/") ||
    requestUrl.pathname.startsWith("/_next/")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      }

      return response;
    }).catch(() =>
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        throw new Error("Offline asset not available.");
      })
    )
  );
});

// Push notification received in background / closed browser
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "DEALSHARE Board";
    const options = {
      body: data.body || "Nowe powiadomienie z panelu Zarządu",
      icon: "/sygnet-white.png",
      badge: "/sygnet-white.png",
      vibrate: [200, 100, 200, 100, 200],
      tag: data.tag || "dealshare-push",
      renotify: true,
      data: {
        url: data.url || "/zarzad"
      }
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("Błąd parsowania powiadomienia push:", error);
  }
});

// User clicks notification on lock screen or notification tray
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/zarzad";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes("/zarzad") && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
