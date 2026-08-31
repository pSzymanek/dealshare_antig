import fs from "node:fs";
import path from "node:path";
import manifest from "@/content/posts-manifest.json";
import graphicsManifest from "@/content/graphics-manifest.json";
import { siteConfig } from "@/lib/site";
import { stripFrontmatter } from "./markdown";
import type { BlogContentProvider, BlogCtaVariant, BlogPost, BlogPostSummary } from "./types";

type ManifestPost = Omit<BlogPost, "author" | "content" | "contentFormat" | "stateOfInformation"> & {
  status?: string;
};

type GraphicManifestItem = {
  slug: string;
  cover: string;
  og: string;
  alt: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

let cachedPosts: BlogPost[] | null = null;

function readFrontmatterString(source: string, field: string, fallback = ""): string {
  const match = new RegExp(`^${field}:\\s*(.+)$`, "m").exec(source);
  const value = match?.[1]?.trim().replace(/^['"]|['"]$/g, "");
  return value || fallback;
}

function loadPosts(): BlogPost[] {
  if (cachedPosts && cachedPosts.length > 0) {
    return cachedPosts;
  }

  const postsDir = postsDirectory;

  const posts: BlogPost[] = (manifest as ManifestPost[])
    .filter((post) => post.status !== "draft")
    .map((post) => {
      let content = "";
      let author = "Zespół Dealshare";

      const contentPath = path.join(postsDir, `${post.slug}.mdx`);
      if (fs.existsSync(contentPath)) {
        try {
          const source = fs.readFileSync(contentPath, "utf8");
          author = readFrontmatterString(source, "author", "Zespół Dealshare");
          content = stripFrontmatter(source);
        } catch (err) {
          console.error(`Błąd odczytu MDX dla "${post.slug}":`, err);
        }
      }

      return {
        ...post,
        author,
        content,
        contentFormat: "mdx",
        stateOfInformation: post.updatedAt
      } satisfies BlogPost;
    })
    .sort((a, b) => {
      return a.title.localeCompare(b.title, "pl");
    });

  cachedPosts = posts;
  return posts;
}

function toSummary(post: BlogPost): BlogPostSummary {
  const {
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogImage,
    content,
    contentFormat,
    faq,
    relatedSlugs,
    ctaVariant,
    legalReviewRequired,
    showUpdatedAt,
    reviewAfter,
    stateOfInformation,
    sources,
    schemaType,
    searchIntent,
    primaryKeyword,
    ...summary
  } = post;
  void seoTitle;
  void seoDescription;
  void canonicalUrl;
  void ogImage;
  void content;
  void contentFormat;
  void faq;
  void relatedSlugs;
  void ctaVariant;
  void legalReviewRequired;
  void showUpdatedAt;
  void reviewAfter;
  void stateOfInformation;
  void sources;
  void schemaType;
  void searchIntent;
  void primaryKeyword;
  return summary;
}

export const staticBlogProvider: BlogContentProvider = {
  async getPosts(options = {}) {
    let posts = loadPosts();

    if (options.category) {
      posts = posts.filter((post) => post.category === options.category);
    }

    if (options.tag) {
      posts = posts.filter((post) => post.tags.includes(options.tag ?? ""));
    }

    const offset = options.offset ?? 0;
    const limit = options.limit ?? posts.length;
    return posts.slice(offset, offset + limit).map(toSummary);
  },

  async getPostBySlug(slug) {
    return loadPosts().find((post) => post.slug === slug) ?? null;
  },

  async getCategories() {
    return Array.from(new Set(loadPosts().map((post) => post.category))).sort((a, b) => a.localeCompare(b, "pl"));
  },

  async getRelatedPosts(post, limit = 3) {
    const posts = loadPosts();
    const related = (post.relatedSlugs || [])
      .map((slug) => posts.find((candidate) => candidate.slug === slug))
      .filter((candidate): candidate is BlogPost => Boolean(candidate))
      .slice(0, limit);

    if (related.length >= limit) {
      return related.map(toSummary);
    }

    const fallback = posts
      .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category && !related.some((item) => item.slug === candidate.slug))
      .slice(0, limit - related.length);

    return [...related, ...fallback].map(toSummary);
  }
};

export function getStaticBlogPostsForBuild() {
  return loadPosts();
}

export type { BlogCtaVariant };
