"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BNPN4-9xeYkd-GUx0ScFQwmSscEE-0ifqaTjHxwqqy5LQkvLwwwkGIvq159W6NOTyXvdN0N0q3mvHP6BJp0q2iA";

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
      setIsSupported(true);

      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(Boolean(sub));
        });
      });
    }
  }, []);

  async function getAuthToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  }

  async function enableNotifications() {
    setLoading(true);
    setStatusMessage(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatusMessage("Uprawnienie do powiadomień zostało zablokowane w ustawieniach przeglądarki.");
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

      const token = await getAuthToken();
      const subJson = subscription.toJSON();

      const response = await fetch("/api/zarzad/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        throw new Error("Nie udało się zapisać subskrypcji na serwerze.");
      }

      setIsSubscribed(true);
      setStatusMessage("Powiadomienia zostały włączone! Możesz wysłać test.");
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
      setStatusMessage("Powiadomienia na tym urządzeniu zostały wyłączone.");
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
      const token = await getAuthToken();
      const response = await fetch("/api/zarzad/push/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = (await response.json()) as { message?: string; error?: string };
      setStatusMessage(data.message || data.error || "Wysłano powiadomienie testowe.");
    } catch (err: any) {
      setStatusMessage(err.message || "Błąd wysyłki testu.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isSubscribed ? (
        <>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-teal/30 bg-teal/10 px-3 py-2 text-xs font-bold text-teal">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            Powiadomienia aktywne
          </span>
          <button
            type="button"
            onClick={sendTestNotification}
            disabled={loading}
            className="min-h-11 rounded-md border border-white/20 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            {loading ? "Wysyłam..." : "🔔 Wyślij test"}
          </button>
          <button
            type="button"
            onClick={disableNotifications}
            disabled={loading}
            className="min-h-11 rounded-md border border-white/14 bg-white/5 px-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            title="Wyłącz powiadomienia na tym urządzeniu"
          >
            Wyłącz
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={enableNotifications}
          disabled={loading}
          className="min-h-11 rounded-md border border-cyan/40 bg-cyan/15 px-3.5 text-xs font-black text-cyan transition hover:bg-cyan/25 disabled:opacity-50"
        >
          {loading ? "Włączam..." : "🔔 Włącz powiadomienia na telefonie"}
        </button>
      )}

      {statusMessage ? (
        <span className="text-xs font-semibold text-cyan animate-fade-in sm:ml-2">
          {statusMessage}
        </span>
      ) : null}
    </div>
  );
}
