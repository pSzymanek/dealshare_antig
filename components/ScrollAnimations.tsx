"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = ".heading-title-enter, .heading-copy-enter, .reveal-on-scroll";

export function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("has-scroll-animations");

    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    if (!elements.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.01
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
