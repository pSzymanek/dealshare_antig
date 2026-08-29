"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const promptStorageKey = "dealshare-contact-prompt-shown";
const promptSessionCounterKey = "dealshare-contact-prompt-session-count";
const promptSessionCountedKey = "dealshare-contact-prompt-session-counted";
const cookieConsentKey = "dealshare-cookie-consent";
const desktopScrollThreshold = 320;
const mobileScrollThreshold = 900;
const desktopPromptDelay = 9000;
const mobilePromptDelay = 14000;
const postCookieConsentPromptDelay = 10000;
const promptSessionFrequency = 3;

function getStoredSessionNumber() {
  const countedSession = sessionStorage.getItem(promptSessionCountedKey);

  if (countedSession) {
    return Number(countedSession);
  }

  const currentCount = Number(localStorage.getItem(promptSessionCounterKey) ?? "0");
  const nextCount = Number.isFinite(currentCount) ? currentCount + 1 : 1;
  localStorage.setItem(promptSessionCounterKey, String(nextCount));
  sessionStorage.setItem(promptSessionCountedKey, String(nextCount));
  return nextCount;
}

export function ContactPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isCookieConsentResolved, setIsCookieConsentResolved] = useState(false);
  const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);
  const [isPromptSessionEligible, setIsPromptSessionEligible] = useState(false);
  const pathname = usePathname();
  const hideTimerRef = useRef<number | undefined>(undefined);
  const removeTimerRef = useRef<number | undefined>(undefined);
  const wasCookieConsentJustResolvedRef = useRef(false);

  const closePrompt = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    window.clearTimeout(removeTimerRef.current);
    setIsEntered(false);
    removeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 420);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setIsCookieConsentResolved(Boolean(localStorage.getItem(cookieConsentKey)));
    });

    function handleConsent() {
      wasCookieConsentJustResolvedRef.current = true;
      setIsCookieConsentResolved(true);
      setIsCookieBannerVisible(false);
    }

    function handleCookieBannerVisibility(event: Event) {
      const isOpen = Boolean((event as CustomEvent<boolean>).detail);
      setIsCookieBannerVisible(isOpen);

      if (isOpen) {
        closePrompt();
      }
    }

    window.addEventListener("dealshare-cookie-consent", handleConsent);
    window.addEventListener("dealshare-cookie-banner-visibility", handleCookieBannerVisibility);

    return () => {
      window.removeEventListener("dealshare-cookie-consent", handleConsent);
      window.removeEventListener("dealshare-cookie-banner-visibility", handleCookieBannerVisibility);
    };
  }, [closePrompt]);

  useEffect(() => {
    if (!isCookieConsentResolved) {
      return;
    }

    queueMicrotask(() => {
      const sessionNumber = getStoredSessionNumber();
      setIsPromptSessionEligible(sessionNumber % promptSessionFrequency === 0);
    });
  }, [isCookieConsentResolved]);

  useEffect(() => {
    if (pathname === "/kontakt" || !isCookieConsentResolved || !isPromptSessionEligible || isCookieBannerVisible || sessionStorage.getItem(promptStorageKey)) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const scrollThreshold = isMobile ? mobileScrollThreshold : desktopScrollThreshold;
    const shouldUsePostConsentDelay = wasCookieConsentJustResolvedRef.current;
    const promptDelay = shouldUsePostConsentDelay ? postCookieConsentPromptDelay : isMobile ? mobilePromptDelay : desktopPromptDelay;
    wasCookieConsentJustResolvedRef.current = false;

    const showPrompt = () => {
      if (!isCookieBannerVisible && !sessionStorage.getItem(promptStorageKey)) {
        sessionStorage.setItem(promptStorageKey, "true");
        setIsVisible(true);
        window.requestAnimationFrame(() => {
          setIsEntered(true);
        });
      }
    };

    if (shouldUsePostConsentDelay) {
      const timer = window.setTimeout(showPrompt, promptDelay);

      return () => {
        window.clearTimeout(timer);
      };
    }

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        showPrompt();
      }
    };

    const timer = window.setTimeout(showPrompt, promptDelay);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCookieBannerVisible, isCookieConsentResolved, isPromptSessionEligible, pathname]);

  useEffect(() => {
    if (!isVisible || !isEntered) {
      return;
    }

    hideTimerRef.current = window.setTimeout(closePrompt, 15000);

    return () => {
      window.clearTimeout(hideTimerRef.current);
    };
  }, [closePrompt, isEntered, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={`fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-[520px] transition duration-500 ease-out sm:bottom-6 sm:left-6 ${
        isEntered ? "translate-x-0 opacity-100" : "-translate-x-[calc(100%+2rem)] opacity-0"
      }`}
      aria-label="Kontakt dealshare"
    >
      <div className="overflow-hidden rounded-lg border border-white/80 bg-white/88 shadow-glow backdrop-blur-2xl">
        <div className="bg-[radial-gradient(circle_at_14%_12%,rgba(0,209,209,0.1),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.92),rgba(247,251,255,0.78))]">
          <div className="flex items-start justify-between gap-4 p-5 pb-3 sm:p-6 sm:pb-4">
            <Image src="/sygnet.png" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
            <button
              type="button"
              aria-label="Zamknij komunikat"
              onClick={closePrompt}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white/80 text-navy shadow-sm transition hover:border-electric/30 hover:bg-white hover:text-electric"
            >
              <span className="absolute h-0.5 w-3.5 rotate-45 rounded-full bg-current" />
              <span className="absolute h-0.5 w-3.5 -rotate-45 rounded-full bg-current" />
            </button>
          </div>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <h2 className="text-lg font-black tracking-tight text-navy">Dla firm z ofertą B2B</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Jeśli chcesz zaprezentować swoją ofertę przedsiębiorcom, opisz krótko kategorię, profil klienta i model współpracy.
            </p>
            <Link
              href="/kontakt"
              onClick={closePrompt}
              className="button-glass relative isolate mt-5 inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 sm:w-auto"
            >
              <span className="relative z-10">Napisz do nas!</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
