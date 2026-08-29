"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const measurementId = "G-C8QD3F64PP";
const consentKey = "dealshare-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function hasAnalyticsConsent() {
  try {
    const storedConsent = localStorage.getItem(consentKey);

    if (!storedConsent) {
      return false;
    }

    return JSON.parse(storedConsent).value === "accepted";
  } catch {
    return false;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [canTrack, setCanTrack] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCanTrack(hasAnalyticsConsent());
    });

    function handleConsent(event: Event) {
      const consent = (event as CustomEvent<"accepted" | "rejected">).detail;
      setCanTrack(consent === "accepted");

      if (consent === "rejected" && window.gtag) {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied"
        });
      }
    }

    window.addEventListener("dealshare-cookie-consent", handleConsent);
    return () => window.removeEventListener("dealshare-cookie-consent", handleConsent);
  }, []);

  useEffect(() => {
    if (!canTrack || !window.gtag) {
      return;
    }

    window.gtag("config", measurementId, {
      page_path: pathname
    });
  }, [canTrack, pathname]);

  if (!canTrack) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'granted',
            analytics_storage: 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
