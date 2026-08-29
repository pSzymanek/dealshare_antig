"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export function MobileMenu() {
  const [openedPathname, setOpenedPathname] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isOpen = openedPathname === pathname;

  useEffect(() => {
    if (isOpen) {
      return;
    }

    if (!isMounted) {
      return;
    }

    const timer = window.setTimeout(() => setIsMounted(false), 300);
    return () => window.clearTimeout(timer);
  }, [isMounted, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function openMenu() {
    setIsMounted(true);
    setOpenedPathname(pathname);
  }

  function closeMenu() {
    setOpenedPathname(null);
  }

  return (
    <div className="shrink-0 xl:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={openMenu}
        onTouchEnd={(event) => {
          event.preventDefault();
          openMenu();
        }}
        className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-sm font-bold text-navy/78 transition hover:-translate-y-0.5 hover:text-electric"
      >
        <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
          <span className="absolute h-0.5 w-3.5 -translate-y-1.5 rounded-full bg-deal-gradient" />
          <span className="absolute h-0.5 w-3.5 rounded-full bg-deal-gradient" />
          <span className="absolute h-0.5 w-3.5 translate-y-1.5 rounded-full bg-deal-gradient" />
        </span>
        <span className="hidden min-[380px]:inline">Menu</span>
      </button>

      {isMounted ? (
        <div className={`fixed inset-0 z-[100] max-w-[100dvw] overflow-hidden transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeMenu}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
          />
          <aside
            id="mobile-menu"
            className={`absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-[calc(100dvw-32px)] max-w-[340px] flex-col overflow-y-auto overflow-x-hidden border-l border-cyan/20 bg-[#050a13]/96 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_0_50px_rgba(0,0,0,0.48)] backdrop-blur-2xl transition-transform duration-300 ease-out sm:px-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pt-5 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:44px_44px]" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Menu</p>
            </div>
            <button
              type="button"
              aria-label="Zamknij menu"
              onClick={closeMenu}
              className="button-glass relative inline-flex h-11 w-11 items-center justify-center rounded-md bg-deal-gradient text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="absolute h-0.5 w-4 rotate-45 rounded-full bg-current" />
              <span className="absolute h-0.5 w-4 -rotate-45 rounded-full bg-current" />
            </button>
          </div>

          <nav className="relative z-10 mt-6 grid gap-2.5 sm:mt-8 sm:gap-3" aria-label="Nawigacja mobilna">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between border border-white/12 bg-white/[0.035] px-4 py-2.5 text-sm font-bold text-white/76 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-cyan/[0.055] hover:text-white sm:py-3 sm:text-base"
              >
                {item.label}
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            ))}
          </nav>

          <Link
            href="/kontakt"
            onClick={closeMenu}
            className="button-glass relative z-10 isolate mt-6 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow"
          >
            <span className="relative z-10">Porozmawiajmy!</span>
          </Link>

          <Link href="/" aria-label="dealshare - strona główna" onClick={closeMenu} className="relative z-10 mt-auto flex justify-center pb-2 pt-10">
            <Image src="/logo-dark.png" alt="dealshare" width={204} height={76} className="h-auto w-[204px] opacity-95 drop-shadow-[0_8px_18px_rgba(0,31,77,0.24)]" />
          </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
