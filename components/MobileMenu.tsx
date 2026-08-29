"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

  function handleNavClick(href: string) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      closeMenu();
      if (pathname === href) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  }

  const menuContent =
    isMounted && typeof document !== "undefined"
      ? createPortal(
          <div className={`fixed inset-0 z-[9999] max-w-[100dvw] overflow-hidden transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button
              type="button"
              aria-label="Zamknij menu"
              onClick={closeMenu}
              className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            />
            <aside
              id="mobile-menu"
              className={`absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-[calc(100dvw-32px)] max-w-[340px] flex-col overflow-y-auto overflow-x-hidden border-l border-white/10 bg-[#060c18] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_0_50px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">Menu</p>
                </div>
                <button
                  type="button"
                  aria-label="Zamknij menu"
                  onClick={closeMenu}
                  className="button-glass relative inline-flex h-11 w-11 items-center justify-center rounded-lg bg-deal-gradient text-white shadow-glow transition hover:brightness-110 active:scale-95"
                >
                  <span className="absolute h-0.5 w-4 rotate-45 rounded-full bg-current" />
                  <span className="absolute h-0.5 w-4 -rotate-45 rounded-full bg-current" />
                </button>
              </div>

              <nav className="relative z-10 mt-6 grid gap-2.5 sm:mt-8 sm:gap-3" aria-label="Nawigacja mobilna">
                <Link
                  href="/"
                  onClick={handleNavClick("/")}
                  className="group flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.06] px-4 py-3 text-base font-bold text-white transition duration-200 hover:border-cyan/50 hover:bg-cyan/10 hover:text-cyan active:scale-[0.99]"
                >
                  <span>Strona główna</span>
                  <span aria-hidden="true" className="text-cyan transition group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick(item.href)}
                    className="group flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.06] px-4 py-3 text-base font-bold text-white transition duration-200 hover:border-cyan/50 hover:bg-cyan/10 hover:text-cyan active:scale-[0.99]"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="text-cyan transition group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </nav>

              <Link
                href="/kontakt"
                onClick={handleNavClick("/kontakt")}
                className="button-glass relative z-10 isolate mt-6 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-lg bg-deal-gradient px-5 py-3.5 text-base font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99]"
              >
                <span className="relative z-10">Porozmawiajmy!</span>
              </Link>

              <Link
                href="/"
                aria-label="dealshare - strona główna"
                onClick={handleNavClick("/")}
                className="relative z-10 mt-auto flex justify-center pb-2 pt-10"
              >
                <Image src="/logo-dark.png" alt="dealshare" width={180} height={60} className="h-auto w-[180px] opacity-90 transition hover:opacity-100" />
              </Link>
            </aside>
          </div>,
          document.body
        )
      : null;

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

      {menuContent}
    </div>
  );
}
