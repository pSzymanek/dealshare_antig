"use client";

import Link from "next/link";
import { FocusEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { isOfferClosed, type Offer } from "@/lib/offers";

type HeroOfferTickerProps = {
  offers: Offer[];
};

const dragThreshold = 6;
const scrollSpeed = 0.022;
const hintStorageKey = "dealshare-offer-ticker-hint-shown";
const mobileHintDuration = 4000;

function wrapOffset(value: number, loopHeight: number) {
  if (loopHeight <= 0) {
    return 0;
  }

  return ((value % loopHeight) + loopHeight) % loopHeight;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button"));
}

export function HeroOfferTicker({ offers }: HeroOfferTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const captureElementRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const loopHeightRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isFocusedWithinRef = useRef(false);
  const isHoveringRef = useRef(false);
  const movedRef = useRef(false);
  const hintTimerRef = useRef<number | undefined>(undefined);
  const linkPauseTimerRef = useRef<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const loopedOffers = [...offers, ...offers];

  useEffect(() => {
    if (!trackRef.current) {
      return;
    }

    const trackElement = trackRef.current;

    function measure() {
      loopHeightRef.current = trackElement.scrollHeight / 2;
      offsetRef.current = wrapOffset(offsetRef.current, loopHeightRef.current);
      trackElement.style.transform = `translate3d(0, -${offsetRef.current}px, 0)`;
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(trackElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    let frameId = 0;
    let lastTime = performance.now();

    function tick(time: number) {
      const elapsed = time - lastTime;
      lastTime = time;

      if (track && !isPaused && !isDraggingRef.current) {
        offsetRef.current = wrapOffset(offsetRef.current + elapsed * scrollSpeed, loopHeightRef.current);
        track.style.transform = `translate3d(0, -${offsetRef.current}px, 0)`;
      }

      frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile || sessionStorage.getItem(hintStorageKey)) {
      return;
    }

    let previousScrollY = window.scrollY;

    function showHintOnce() {
      sessionStorage.setItem(hintStorageKey, "true");
      setShowMobileHint(true);
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = window.setTimeout(() => setShowMobileHint(false), mobileHintDuration);
      window.removeEventListener("scroll", handleScroll);
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80 && currentScrollY > previousScrollY + 12) {
        showHintOnce();
      }

      previousScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(hintTimerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(linkPauseTimerRef.current);
  }, []);

  function updatePausedState() {
    setIsPaused(Boolean(isDraggingRef.current || isFocusedWithinRef.current || isHoveringRef.current || linkPauseTimerRef.current));
  }

  function startDragging(event: PointerEvent<HTMLDivElement>) {
    const captureElement = event.currentTarget;

    pointerIdRef.current = event.pointerId;
    startYRef.current = event.clientY;
    startOffsetRef.current = offsetRef.current;
    captureElementRef.current = captureElement;
    isDraggingRef.current = true;
    movedRef.current = false;
    setIsDragging(true);
    updatePausedState();
    captureElement.setPointerCapture(event.pointerId);
  }

  function handleViewportPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if (isInteractiveTarget(event.target)) {
      movedRef.current = false;
      return;
    }

    startDragging(event);
  }

  function handleMobileHandlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setShowMobileHint(false);
    startDragging(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;

    if (!track || !isDraggingRef.current || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaY = event.clientY - startYRef.current;

    if (Math.abs(deltaY) > dragThreshold) {
      movedRef.current = true;
    }

    offsetRef.current = wrapOffset(startOffsetRef.current - deltaY, loopHeightRef.current);
    track.style.transform = `translate3d(0, -${offsetRef.current}px, 0)`;
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    const captureElement = captureElementRef.current;

    if (!captureElement || pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (captureElement.hasPointerCapture(event.pointerId)) {
      captureElement.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;
    captureElementRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    updatePausedState();
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!movedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    movedRef.current = false;
  }

  function pauseForLinkTap() {
    window.clearTimeout(linkPauseTimerRef.current);
    linkPauseTimerRef.current = window.setTimeout(() => {
      linkPauseTimerRef.current = undefined;
      updatePausedState();
    }, 300);
    updatePausedState();
  }

  function handleMouseEnter() {
    isHoveringRef.current = true;
    updatePausedState();
  }

  function handleMouseLeave() {
    isHoveringRef.current = false;
    updatePausedState();
  }

  function handleFocus() {
    isFocusedWithinRef.current = true;
    updatePausedState();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    isFocusedWithinRef.current = false;
    updatePausedState();
  }

  return (
    <div
      className={`hero-offer-ticker relative mt-6 h-[370px] overflow-hidden px-1 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerDown={handleViewportPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={handleClickCapture}
      aria-label="Najnowsze oferty"
    >
      <div ref={trackRef} className="grid gap-4 will-change-transform">
        {loopedOffers.map((offer, index) => {
          const isDuplicate = index >= offers.length;
          const isClosed = isOfferClosed(offer);

          return (
            <article
              key={`${offer.slug}-${index}`}
              aria-hidden={isDuplicate}
              className="group rounded-md border border-white/14 bg-white/8 p-4 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan/45 hover:bg-white/12"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className={`text-xs font-black uppercase tracking-[0.14em] ${offer.isIndividual ? "text-fuchsia-300" : "text-cyan"}`}>{offer.category}</p>
                  <h3 className="mt-2 text-lg font-black tracking-tight">{offer.title}</h3>
                </div>
                <span className="shrink-0 rounded border border-white/12 bg-white/10 px-2 py-1 text-xs font-bold text-white/72">{isClosed ? "Zamknięte" : offer.status}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/68">{offer.description}</p>
              <Link
                href={`/oferty/${offer.slug}`}
                tabIndex={isDuplicate ? -1 : undefined}
                draggable={false}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  movedRef.current = false;
                  pauseForLinkTap();
                }}
                className="mt-3 inline-flex text-sm font-bold text-cyan transition hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {isClosed ? "Zobacz ofertę" : "Sprawdź szczegóły"} <span aria-hidden="true" className="arrow-mark ml-2 transition group-hover:translate-x-1">&rarr;</span>
              </Link>
            </article>
          );
        })}
      </div>

      <div
        className="hero-offer-mobile-handle absolute inset-y-8 left-0 z-10 flex w-12 touch-none items-center justify-center md:hidden"
        onPointerDown={handleMobileHandlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        aria-label="Przesuwaj najnowsze oferty"
        role="button"
        tabIndex={-1}
      >
        <span
          className={`grid h-full w-full items-center justify-center gap-3 rounded-r-lg border text-2xl font-black leading-none backdrop-blur transition duration-300 ${
            showMobileHint ? "border-white/45 bg-white/24 text-white opacity-100 shadow-[0_10px_35px_rgba(255,255,255,0.24)]" : "border-transparent bg-transparent text-transparent opacity-0"
          }`}
        >
          <span aria-hidden="true" className={showMobileHint ? "hero-offer-hint-arrow-up drop-shadow" : ""}>↑</span>
          <span aria-hidden="true" className={showMobileHint ? "hero-offer-hint-arrow-down drop-shadow" : ""}>↓</span>
        </span>
      </div>
    </div>
  );
}
