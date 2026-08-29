import { staticBlogProvider, getStaticBlogPostsForBuild } from "./static-provider";
import { wordpressBlogProvider } from "./wordpress-provider";
import type { BlogContentProvider } from "./types";

export type { BlogContentProvider, BlogContentFormat, BlogCtaVariant, BlogFaqItem, BlogPost, BlogPostSummary, BlogQuery } from "./types";

export const blogUnavailableMessage = "Blog jest chwilowo niedostępny.";

export function getBlogProvider(): BlogContentProvider {
  return process.env.BLOG_PROVIDER === "wordpress" ? wordpressBlogProvider : staticBlogProvider;
}

export async function getBlogPosts(options?: Parameters<BlogContentProvider["getPosts"]>[0]) {
  return getBlogProvider().getPosts(options);
}

export async function getBlogPostBySlug(slug: string) {
  return getBlogProvider().getPostBySlug(slug);
}

export async function getBlogCategories() {
  return getBlogProvider().getCategories();
}

export async function getRelatedBlogPosts(...args: Parameters<BlogContentProvider["getRelatedPosts"]>) {
  return getBlogProvider().getRelatedPosts(...args);
}

export function getStaticBlogSlugs() {
  if (process.env.BLOG_PROVIDER === "wordpress") {
    return [];
  }

  return getStaticBlogPostsForBuild().map((post) => ({ slug: post.slug }));
}

export function getStaticBlogPosts() {
  return getStaticBlogPostsForBuild();
}
