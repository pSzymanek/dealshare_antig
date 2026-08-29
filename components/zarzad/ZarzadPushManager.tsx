"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function ZarzadPushManager({ supabase }: { supabase: SupabaseClient }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BNPN4-9xeYkd-GUx0ScFQwmSscEE-0ifqaTjHxwqqy5LQkvLwwwkGIvq159W6NOTyXvdN0N0q3mvHP6BJp0q2iA";

  const getAuthToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  }, [supabase]);

  const syncSubscriptionToServer = useCallback(
    async (subscription: PushSubscription) => {
      const token = await getAuthToken();
      if (!token) return false;

      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        return false;
      }

      const response = await fetch("/api/zarzad/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : ""
        })
      });

      return response.ok;
    },
    [getAuthToken]
  );

  const checkStatus = useCallback(async () => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
      setIsSupported(true);
      setPermissionState(Notification.permission);

      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub && Notification.permission === "granted") {
          setIsSubscribed(true);
          await syncSubscriptionToServer(sub);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Błąd sprawdzania subskrypcji:", err);
      }
    }
  }, [syncSubscriptionToServer]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Click away listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function enableNotifications() {
    setLoading(true);
    setStatusMessage(null);

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission !== "granted") {
        setIsOpen(true);
        setStatusMessage("Powiadomienia są zablokowane w ustawieniach przeglądarki. Zobacz instrukcję poniżej.");
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/zarzad-sw.js");
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      const synced = await syncSubscriptionToServer(subscription);

      if (!synced) {
        throw new Error("Nie udało się zapisać powiadomień na serwerze.");
      }

      setIsSubscribed(true);
      setIsOpen(true);
      setStatusMessage("Powiadomienia włączone! Kliknij 'Wyślij test' poniżej.");
    } catch (err: any) {
      setStatusMessage(err.message || "Błąd włączania powiadomień.");
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    setLoading(true);
    setStatusMessage(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const token = await getAuthToken();
        await fetch("/api/zarzad/push/subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setIsOpen(false);
      setStatusMessage("Powiadomienia zostały wyłączone.");
    } catch (err: any) {
      setStatusMessage(err.message || "Błąd wyłączania powiadomień.");
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    setLoading(true);
    setStatusMessage(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      if (subscription) {
        await syncSubscriptionToServer(subscription);
      }

      const token = await getAuthToken();
      const response = await fetch("/api/zarzad/push/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (data.ok) {
        setIsSubscribed(true);
        setStatusMessage(data.message || "Wysłano test! Zablokuj telefon, aby zobaczyć powiadomienie.");
      } else {
        setStatusMessage(data.message || data.error || "Błąd testu powiadomień.");
      }
    } catch (err: any) {
      setStatusMessage(err.message || "Błąd wysyłki testu.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return null;
  }

  // 1. BLOCKED STATE: Permission was denied in browser
  if (permissionState === "denied") {
    return (
      <div ref={containerRef} className="relative inline-flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 items-center gap-1.5 rounded-md border border-amber-400/40 bg-amber-400/15 px-3 text-xs font-black text-amber-300 transition hover:bg-amber-400/25"
        >
          <span>⚠️ Powiadomienia zablokowane</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen ? (
          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-white/16 bg-[#041738]/98 p-4 shadow-2xl backdrop-blur-xl z-50 animate-fade-in text-left text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <p className="text-xs font-black uppercase tracking-wider text-amber-300">Jak odblokować powiadomienia?</p>
              <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-white/50 hover:text-white">✕</button>
            </div>
            
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
              <p>Przeglądarka zablokowała wysyłanie powiadomień. Aby to włączyć:</p>
              <div className="rounded-md bg-white/6 p-2.5 space-y-1.5 border border-white/10">
                <p className="font-bold text-white">📱 Na telefonie (Chrome / Android):</p>
                <p>Kliknij <strong>ikonę kłódki/ustawień</strong> obok adresu <code className="text-cyan">dealshare.pl</code> na górze &rarr; <em>Uprawnienia</em> &rarr; włącz <strong>Powiadomienia</strong>.</p>
              </div>
              <div className="rounded-md bg-white/6 p-2.5 space-y-1.5 border border-white/10">
                <p className="font-bold text-white">🍎 Na iPhone (iOS):</p>
                <p>Wejdź w <em>Ustawienia telefonu</em> &rarr; <em>Powiadomienia</em> &rarr; <em>DEALSHARE Board</em> (lub Safari) &rarr; włącz <strong>Pozwalaj na powiadomienia</strong>.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                await checkStatus();
                if (Notification.permission === "granted") {
                  await enableNotifications();
                } else {
                  setStatusMessage("Powiadomienia są nadal zablokowane w ustawieniach.");
                }
              }}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-3 py-2 text-xs font-black text-navy transition hover:bg-cyan/90"
            >
              🔄 Sprawdź ponownie po zmianie
            </button>
            {statusMessage ? <p className="mt-2 text-center text-[11px] font-semibold text-amber-300">{statusMessage}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  // 2. ACTIVE / SUBSCRIBED STATE
  if (isSubscribed) {
    return (
      <div ref={containerRef} className="relative inline-flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-teal/40 bg-teal/15 px-3 text-xs font-bold text-teal transition hover:bg-teal/25 focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
          <span className="whitespace-nowrap">Powiadomienia aktywne</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen ? (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-white/16 bg-[#041738]/98 p-3.5 shadow-2xl backdrop-blur-xl z-50 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-cyan">Opcje powiadomień</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={sendTestNotification}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan/20 border border-cyan/40 px-3 py-2 text-xs font-black text-cyan transition hover:bg-cyan/30 disabled:opacity-50"
              >
                {loading ? "Wysyłam test..." : "🔔 Wyślij test na telefon"}
              </button>

              <button
                type="button"
                onClick={disableNotifications}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-white/6 border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/30 disabled:opacity-50"
              >
                🔕 Wyłącz powiadomienia
              </button>
            </div>

            {statusMessage ? (
              <p className="mt-2.5 rounded bg-white/10 p-2 text-[11px] font-semibold text-cyan leading-snug">
                {statusMessage}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  // 3. INACTIVE STATE: Ready to enable
  return (
    <button
      type="button"
      onClick={enableNotifications}
      disabled={loading}
      className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-md border border-cyan/40 bg-cyan/15 px-3.5 text-xs font-black text-cyan transition hover:bg-cyan/25 disabled:opacity-50"
    >
      {loading ? "Włączam..." : "🔔 Włącz powiadomienia"}
    </button>
  );
}
