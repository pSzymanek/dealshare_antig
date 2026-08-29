"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlogPostSummary } from "@/lib/blog";

type HeroBlogSlideshowProps = {
  posts: BlogPostSummary[];
};

export function HeroBlogSlideshow({ posts }: HeroBlogSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visiblePosts = useMemo(() => posts.slice(0, 5), [posts]);

  useEffect(() => {
    if (visiblePosts.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % visiblePosts.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [visiblePosts.length]);

  if (!visiblePosts.length) {
    return null;
  }

  const activePost = visiblePosts[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#050a13]/88 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32),0_0_44px_rgba(0,209,209,0.07)] backdrop-blur sm:p-5" aria-label="Wybrane artykuły z bloga">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#00d1d1_28%,#d946ef_72%,transparent)] shadow-[0_0_12px_rgba(0,209,209,0.6)]" />

      <div className="relative z-10 flex items-center justify-between gap-4 px-1 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Z bloga Dealshare</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Wiedza, która pomaga podjąć kolejny krok.</h2>
        </div>
        <Link href="/blog" className="arrow-link hidden shrink-0 text-sm font-bold text-cyan transition hover:text-white sm:inline-flex">
          Czytaj blog <span aria-hidden="true" className="arrow-mark ml-1">&rarr;</span>
        </Link>
      </div>

      <div className="relative z-10 min-h-[390px] overflow-hidden bg-[#020711] sm:min-h-[430px]">
        {visiblePosts.map((post, index) => {
          const isActive = index === activeIndex;
          const isPrevious = index === (activeIndex - 1 + visiblePosts.length) % visiblePosts.length;

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group absolute inset-0 block transition duration-700 ease-out ${
                isActive ? "z-20 translate-x-0 opacity-100" : isPrevious ? "z-10 -translate-x-8 opacity-0" : "z-0 translate-x-8 opacity-0"
              }`}
              aria-hidden={!isActive}
              tabIndex={isActive ? undefined : -1}
            >
              <Image src={post.heroImage} alt={post.imageAlt} fill priority={index === 0} sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover transition duration-[4200ms] ease-out" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,31,77,0.12)_0%,rgba(0,31,77,0.38)_44%,rgba(0,31,77,0.88)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="mb-4 inline-flex bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan backdrop-blur">
                  {post.category}
                </div>
                <h3 className="max-w-xl text-2xl font-black leading-tight tracking-tight text-white drop-shadow sm:text-3xl">{post.title}</h3>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/78">{post.excerpt}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-cyan transition group-hover:text-white">
                  Przeczytaj artykuł <span aria-hidden="true" className="ml-2">&rarr;</span>
                </span>
              </div>
            </Link>
          );
        })}

        <div className="absolute bottom-4 right-4 z-30 flex gap-2">
          {visiblePosts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              aria-label={`Pokaż artykuł ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-8 bg-cyan" : "w-2.5 bg-white/42 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
