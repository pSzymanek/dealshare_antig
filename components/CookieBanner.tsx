"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const consentKey = "dealshare-cookie-consent";

type ConsentValue = "accepted" | "rejected";

function saveConsent(value: ConsentValue) {
  const payload = JSON.stringify({
    value,
    savedAt: new Date().toISOString()
  });

  localStorage.setItem(consentKey, payload);
  document.cookie = `${consentKey}=${value}; path=/; max-age=15552000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("dealshare-cookie-consent", { detail: value }));
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedConsent = localStorage.getItem(consentKey);
      setIsVisible(!storedConsent);
    });

    function openBanner() {
      setIsVisible(true);
    }

    window.addEventListener("dealshare-open-cookie-banner", openBanner);
    return () => window.removeEventListener("dealshare-open-cookie-banner", openBanner);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("dealshare-cookie-banner-visibility", { detail: isVisible }));
  }, [isVisible]);

  function handleChoice(value: ConsentValue) {
    saveConsent(value);
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-18px_55px_rgba(0,31,77,0.14)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">Cookies</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Używamy plików cookies niezbędnych do działania strony. Za Twoją zgodą używamy również cookies analitycznych i marketingowych, w tym narzędzi takich jak Google Analytics, tagi reklamowe lub podobne rozwiązania.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
            <Link href="/polityka-prywatnosci" className="text-electric underline-offset-4 hover:underline">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="text-electric underline-offset-4 hover:underline">
              Regulamin
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-cyan hover:text-teal"
          >
            Tylko niezbędne
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="button-glass relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            <span className="relative z-10">Akceptuję</span>
          </button>
        </div>
      </div>
    </div>
  );
}
