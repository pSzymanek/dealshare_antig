"use client";

export function CookieConsentLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("dealshare-open-cookie-banner"))}
      className="text-left text-xs text-white/55 underline-offset-4 transition hover:text-white hover:underline"
    >
      Ustawienia cookies
    </button>
  );
}
