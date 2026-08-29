"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatValueProps = {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  duration?: number;
};

function easeOutExpo(value: number) {
  return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
}

export function AnimatedStatValue({ target, prefix = "", suffix = "", decimals = 0, delay = 0, duration = 1300 }: AnimatedStatValueProps) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasStarted) return;
    const revealParent = element.closest(".reveal-on-scroll");

    if (revealParent) {
      if (revealParent.classList.contains("is-visible")) {
        setHasStarted(true);
        return;
      }

      const mutationObserver = new MutationObserver(() => {
        if (revealParent.classList.contains("is-visible")) {
          setHasStarted(true);
          mutationObserver.disconnect();
        }
      });

      mutationObserver.observe(revealParent, {
        attributes: true,
        attributeFilter: ["class"]
      });

      return () => mutationObserver.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let frame = 0;
    let startTime = 0;
    const timeout = window.setTimeout(() => {
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = easeOutExpo(progress);
        const nextValue = target * eased;

        setValue(progress === 1 ? target : nextValue);

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      };

      frame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [delay, duration, hasStarted, target]);

  const visibleValue = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString("pl-PL");

  return (
    <span ref={ref}>
      {prefix}
      {visibleValue}
      {suffix}
    </span>
  );
}
