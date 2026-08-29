import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";
import { Badge } from "./Badge";

type BlogCardProps = {
  post: BlogPostSummary;
  className?: string;
};

export function BlogCard({ post, className = "" }: BlogCardProps) {
  const date = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(post.publishedAt));

  return (
    <article className={`card-glass soft-lift group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-card ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[16/9] bg-[#020711]">
          <Image src={post.heroImage} alt={post.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="teal">{post.category}</Badge>
          <time dateTime={post.publishedAt} className="text-xs font-semibold text-slate-500">
            {date}
          </time>
          <span className="text-xs font-semibold text-slate-500">{post.readingTime} min czytania</span>
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-navy">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-electric">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="arrow-link mt-auto inline-flex items-center pt-5 text-sm font-black text-electric transition group-hover:text-teal">
          <span>Czytaj więcej</span> <span className="ml-1 transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
