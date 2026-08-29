"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type ClosedOfferOverlayProps = {
  offerId: string;
  offerTitle: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ClosedOfferOverlay({ offerId, offerTitle }: ClosedOfferOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isVisible]);

  function updateEmail(value: string) {
    setEmail(value);

    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  }

  function updateConsent(value: boolean) {
    setConsent(value);

    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  }

  async function submitNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      setFeedback("Wpisz poprawny adres e-mail.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setFeedback("Zaakceptuj regulamin i zgodę na kontakt.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "closed-offer-notify",
          offerId,
          offerTitle,
          email: email.trim(),
          consent,
          sourceUrl: window.location.href
        })
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Nie udało się zapisać adresu e-mail.");
      }

      setStatus("success");
      setFeedback(data.message ?? "Dziękujemy. Damy znać, jeśli oferta wróci albo pojawi się podobna możliwość.");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Nie udało się zapisać adresu e-mail.");
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-white/68 px-4 py-6 backdrop-blur-xl sm:items-center sm:px-6 sm:py-8" role="dialog" aria-modal="true" aria-labelledby="closed-offer-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,91,255,0.14),transparent_42%)]" />
      <section className="relative w-full max-w-2xl rounded-lg border border-white/80 bg-white/92 p-5 text-center shadow-glow backdrop-blur-2xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-600">Oferta czasowo niedostępna</p>
        <h2 id="closed-offer-title" className="mt-2 text-2xl font-black tracking-tight text-navy sm:mt-3 sm:text-4xl">
          Cieszymy się, że zainteresowała Cię nasza oferta.
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-700 sm:mt-5 sm:leading-8">
          Niestety w tym momencie zakończyliśmy przyjmowanie zgłoszeń. Zachęcamy do sprawdzenia pozostałych możliwości, na pewno znajdziesz coś interesującego!
        </p>

        <form onSubmit={submitNotification} className="mt-5 rounded-lg border border-slate-200 bg-mist p-4 text-left sm:mt-7 sm:p-5" noValidate>
          <label className="block">
            <span className="text-sm font-bold leading-6 text-navy">
              Zostaw nam kontakt do siebie, poinformujemy Cię, kiedy oferta stanie się ponownie dostępna, albo znajdziemy dla Ciebie coś podobnego!
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => updateEmail(event.target.value)}
              placeholder="Twój adres e-mail"
              className="mt-3 h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-sm outline-none transition hover:border-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/10"
              required
            />
          </label>

          <label className="mt-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-white/80 p-3 text-sm leading-6 text-slate-700 sm:mt-4 sm:p-4">
            <input type="checkbox" checked={consent} onChange={(event) => updateConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-electric" required />
            <span>
              Akceptuję{" "}
              <Link href="/regulamin#formularze-i-zgody" className="font-bold text-electric underline underline-offset-4">
                regulamin
              </Link>{" "}
              i wyrażam zgodę na przetwarzanie mojego adresu e-mail oraz kontakt w sprawie ponownej dostępności tej oferty lub podobnych możliwości.
            </span>
          </label>

          {feedback ? (
            <p className={`mt-3 rounded-md border px-4 py-3 text-sm font-semibold ${status === "success" ? "border-teal/20 bg-teal/10 text-teal" : "border-electric/20 bg-electric/10 text-electric"}`}>
              {feedback}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="button-glass relative isolate mt-4 inline-flex min-h-11 w-full transform-gpu items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-5 py-3 text-sm font-black text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Zapisywanie..." : "Powiadom mnie"}
          </button>
        </form>

        <Link href="/oferty" className="mt-4 inline-flex min-h-11 w-full transform-gpu items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-black text-navy shadow-sm transition hover:border-electric/30 hover:text-electric sm:mt-5 sm:w-auto">
          Sprawdź pozostałe oferty
        </Link>
      </section>
    </div>
  );
}
