const CACHE_NAME = "dealshare-board-v6";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Push notification received in background / closed browser
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "Zarząd DS";
    const options = {
      body: data.body || "Nowe powiadomienie z panelu Zarządu",
      icon: "/zarzad-icon-192.png",
      badge: "/zarzad-icon-192.png",
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
