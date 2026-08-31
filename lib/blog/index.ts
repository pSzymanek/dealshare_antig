import { staticBlogProvider, getStaticBlogPostsForBuild } from "./static-provider";
import { wordpressBlogProvider } from "./wordpress-provider";
import type { BlogContentProvider } from "./types";

export type { BlogContentProvider, BlogContentFormat, BlogCtaVariant, BlogFaqItem, BlogPost, BlogPostSummary, BlogQuery } from "./types";

export const blogUnavailableMessage = "Blog jest chwilowo niedostępny.";

export function getBlogProvider(): BlogContentProvider {
  return process.env.BLOG_PROVIDER === "wordpress" ? wordpressBlogProvider : staticBlogProvider;
}

export async function getBlogPosts(options?: Parameters<BlogContentProvider["getPosts"]>[0]) {
  try {
    const provider = getBlogProvider();
    const posts = await provider.getPosts(options);
    if (posts && posts.length > 0) {
      return posts;
    }
  } catch (error) {
    console.error("Błąd pobierania postów bloga:", error);
  }

  // Fallback to static blog provider
  return staticBlogProvider.getPosts(options);
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const provider = getBlogProvider();
    const post = await provider.getPostBySlug(slug);
    if (post) {
      return post;
    }
  } catch (error) {
    console.error(`Błąd pobierania wpisu "${slug}":`, error);
  }

  // Fallback to static blog provider
  return staticBlogProvider.getPostBySlug(slug);
}

export async function getBlogCategories() {
  try {
    const provider = getBlogProvider();
    const categories = await provider.getCategories();
    if (categories && categories.length > 0) {
      return categories;
    }
  } catch (error) {
    console.error("Błąd pobierania kategorii bloga:", error);
  }

  // Fallback to static blog provider
  return staticBlogProvider.getCategories();
}

export async function getRelatedBlogPosts(...args: Parameters<BlogContentProvider["getRelatedPosts"]>) {
  try {
    const provider = getBlogProvider();
    const related = await provider.getRelatedPosts(...args);
    if (related && related.length > 0) {
      return related;
    }
  } catch (error) {
    console.error("Błąd pobierania powiązanych wpisów:", error);
  }

  // Fallback to static blog provider
  return staticBlogProvider.getRelatedPosts(...args);
}

export function getStaticBlogSlugs() {
  return getStaticBlogPostsForBuild().map((post) => ({ slug: post.slug }));
}

export function getStaticBlogPosts() {
  return getStaticBlogPostsForBuild();
}
