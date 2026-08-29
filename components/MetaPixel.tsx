"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pixelId = "1004105325950726";
const consentKey = "dealshare-cookie-consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

function hasMarketingConsent() {
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

export function MetaPixel() {
  const pathname = usePathname();
  const [canTrack, setCanTrack] = useState(false);
  const [isPixelReady, setIsPixelReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCanTrack(hasMarketingConsent());
    });

    function handleConsent(event: Event) {
      const consent = (event as CustomEvent<"accepted" | "rejected">).detail;
      setCanTrack(consent === "accepted");
    }

    window.addEventListener("dealshare-cookie-consent", handleConsent);
    return () => window.removeEventListener("dealshare-cookie-consent", handleConsent);
  }, []);

  useEffect(() => {
    if (!canTrack || !isPixelReady || !window.fbq) {
      return;
    }

    window.fbq("track", "PageView");
  }, [canTrack, isPixelReady, pathname]);

  if (!canTrack) {
    return null;
  }

  return (
    <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setIsPixelReady(true)}>
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
      `}
    </Script>
  );
}
