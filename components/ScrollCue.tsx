"use client";

import { useEffect, useState } from "react";

type ScrollCueProps = {
  targetId: string;
};

export function ScrollCue({ targetId }: ScrollCueProps) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    function hideUntilRefresh() {
      setIsHidden(true);
    }

    function handleScroll() {
      if (window.scrollY > 48) {
        hideUntilRefresh();
      }
    }

    const target = document.getElementById(targetId);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let observer: IntersectionObserver | null = null;

    if (target) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hideUntilRefresh();
            observer?.disconnect();
          }
        },
        {
          rootMargin: "0px 0px -72% 0px",
          threshold: 0.01
        }
      );
      observer.observe(target);
    }
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer?.disconnect();
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className={`scroll-cue pointer-events-none fixed bottom-5 left-1/2 z-[95] -translate-x-1/2 transition duration-700 ease-out sm:absolute sm:z-10 ${isHidden ? "scroll-cue-hidden" : ""}`}
    >
      <span className="scroll-cue-arrow" />
    </div>
  );
}
