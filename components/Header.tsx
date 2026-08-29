"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { Button } from "./Button";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [isDarkScreen, setIsDarkScreen] = useState(false);

  useEffect(() => {
    let ticking = false;

    function checkDarkDominance() {
      const viewportTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportBottom = viewportTop + viewportHeight;

      const darkElements = document.querySelectorAll<HTMLElement>(
        '.hero-dark-base, .bg-navy-gradient, #jak-dziala, [data-theme="dark"], [class*="darkWrapper"], [class*="darkHero"], [class*="darkBenefits"], footer'
      );

      let darkVisibleHeight = 0;

      darkElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + viewportTop;
        const elementBottom = elementTop + rect.height;

        const visibleTop = Math.max(viewportTop, elementTop);
        const visibleBottom = Math.min(viewportBottom, elementBottom);

        if (visibleBottom > visibleTop) {
          darkVisibleHeight += visibleBottom - visibleTop;
        }
      });

      const ratio = darkVisibleHeight / viewportHeight;
      setIsDarkScreen(ratio >= 0.35);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(checkDarkDominance);
        ticking = true;
      }
    }

    // Initial check
    checkDarkDominance();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  function handleNavClick(href: string) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === href) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  }

  return (
    <header className="sticky top-0 z-[110] border-b border-slate-200 bg-white/[0.90] text-navy shadow-[0_10px_32px_rgba(0,31,77,0.08)] backdrop-blur-xl transition duration-300">
      <Container className="flex min-h-20 items-center justify-between gap-3 py-2 sm:min-h-24 sm:gap-5 sm:py-3">
        <Link href="/" aria-label="dealshare - strona główna" onClick={handleNavClick("/")} className="group relative flex items-center">
          <div className="relative flex h-12 items-center sm:h-16 xl:h-[68px]">
            {/* Logo klasyczne kolorowe - 1:1 piksel w piksel */}
            <Image
              src="/logo-classic.png"
              alt="dealshare"
              width={1731}
              height={454}
              priority
              className={`h-12 w-auto object-contain transition-opacity duration-500 ease-in-out sm:h-16 xl:h-[68px] ${
                isDarkScreen ? "opacity-0" : "opacity-100"
              }`}
              style={{ width: "auto" }}
            />
            {/* Logo ciemne - identyczna geometria, idealne pokrycie */}
            <Image
              src="/logo-dark-aligned.png"
              alt="dealshare"
              width={1731}
              height={454}
              priority
              className={`absolute inset-0 h-12 w-auto object-contain transition-opacity duration-500 ease-in-out sm:h-16 xl:h-[68px] ${
                isDarkScreen ? "opacity-100" : "opacity-0"
              }`}
              style={{ width: "auto" }}
            />
          </div>
        </Link>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Główna nawigacja">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick(item.href)}
              className="relative px-3 py-2 text-sm font-semibold text-navy/72 transition after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-cyan after:shadow-[0_0_8px_rgba(0,209,209,0.65)] after:transition hover:text-navy hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:block">
          <Button href="/kontakt" variant="ghost" onClick={handleNavClick("/kontakt")}>
            Porozmawiajmy!
          </Button>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}
