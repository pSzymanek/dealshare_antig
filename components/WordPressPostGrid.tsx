import { blogUnavailableMessage, type BlogPostSummary } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

type WordPressPostGridProps = {
  posts: BlogPostSummary[];
  emptyMessage?: string;
};

export function WordPressPostGrid({ posts, emptyMessage = blogUnavailableMessage }: WordPressPostGridProps) {
  if (!posts.length) {
    return (
      <div className="card-glass rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 5)}` : ""}`} />
      ))}
    </div>
  );
}
