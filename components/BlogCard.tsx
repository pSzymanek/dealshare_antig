import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";
import { Badge } from "./Badge";

type BlogCardProps = {
  post: BlogPostSummary;
};

export function BlogCard({ post }: BlogCardProps) {
  const date = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(post.publishedAt));

  return (
    <article className="card-glass soft-lift group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-card">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] bg-navy-gradient">
          <Image src={post.heroImage} alt={post.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="teal">{post.category}</Badge>
          <time dateTime={post.publishedAt} className="text-xs font-semibold text-slate-500">
            {date}
          </time>
          <span className="text-xs font-semibold text-slate-500">Autor: {post.author}</span>
          <span className="text-xs font-semibold text-slate-500">{post.readingTime} min czytania</span>
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-navy">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-electric">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="arrow-link mt-auto inline-flex pt-5 text-sm font-bold text-electric transition group-hover:text-teal">
          Czytaj więcej →
        </Link>
      </div>
    </article>
  );
}
