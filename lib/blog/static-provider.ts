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
const requiredTextFields = ["id", "slug", "title", "excerpt", "category", "publishedAt", "updatedAt", "seoTitle", "seoDescription", "canonicalUrl", "heroImage", "ogImage", "imageAlt"] as const;
const requiredFrontmatterFields = [...requiredTextFields, "tags", "relatedSlugs", "ctaVariant", "sources", "author", "readingTime", "legalReviewRequired", "showUpdatedAt", "faq", "contentFormat", "schemaType", "status"] as const;

let cachedPosts: BlogPost[] | null = null;

function assertString(value: unknown, field: string, slug: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Blog post "${slug}" is missing required field "${field}".`);
  }
}

function assertDate(value: string, field: string, slug: string) {
  if (Number.isNaN(new Date(value).getTime())) {
    throw new Error(`Blog post "${slug}" has invalid date in "${field}".`);
  }
}

function assertPublicAsset(publicPath: string, slug: string) {
  const localPath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (!fs.existsSync(localPath)) {
    throw new Error(`Blog post "${slug}" references missing asset "${publicPath}".`);
  }
}

function validateFrontmatter(source: string, post: ManifestPost) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) {
    throw new Error(`Blog post "${post.slug}" is missing frontmatter.`);
  }

  for (const field of requiredFrontmatterFields) {
    if (!new RegExp(`^${field}:`, "m").test(match[1])) {
      throw new Error(`Blog post "${post.slug}" frontmatter is missing "${field}".`);
    }
  }

  const slugMatch = /^slug:\s*(.+)$/m.exec(match[1]);
  if (slugMatch?.[1]?.trim().replace(/^['"]|['"]$/g, "") !== post.slug) {
    throw new Error(`Blog post "${post.slug}" has a frontmatter slug mismatch.`);
  }
}

function readFrontmatterString(source: string, field: string, slug: string) {
  const match = new RegExp(`^${field}:\\s*(.+)$`, "m").exec(source);
  const value = match?.[1]?.trim().replace(/^['"]|['"]$/g, "");

  assertString(value, field, slug);
  return value;
}

function validatePosts(posts: BlogPost[]) {
  const slugs = new Set<string>();
  const seoTitles = new Set<string>();
  const seoDescriptions = new Set<string>();
  const graphics = graphicsManifest as GraphicManifestItem[];

  if (posts.length !== 30) {
    throw new Error(`Expected 30 blog posts, found ${posts.length}.`);
  }

  for (const post of posts) {
    for (const field of requiredTextFields) {
      assertString(post[field], field, post.slug || post.id || "unknown");
    }

    assertDate(post.publishedAt, "publishedAt", post.slug);
    assertDate(post.updatedAt, "updatedAt", post.slug);

    if (slugs.has(post.slug)) {
      throw new Error(`Duplicate blog slug "${post.slug}".`);
    }
    slugs.add(post.slug);

    if (seoTitles.has(post.seoTitle)) {
      throw new Error(`Duplicate blog SEO title "${post.seoTitle}".`);
    }
    seoTitles.add(post.seoTitle);

    if (seoDescriptions.has(post.seoDescription)) {
      throw new Error(`Duplicate blog SEO description "${post.seoDescription}".`);
    }
    seoDescriptions.add(post.seoDescription);

    if (!Array.isArray(post.tags) || !post.tags.length) {
      throw new Error(`Blog post "${post.slug}" is missing tags.`);
    }

    if (!Array.isArray(post.faq) || !post.faq.length) {
      throw new Error(`Blog post "${post.slug}" is missing FAQ items.`);
    }

    const contentPath = path.join(postsDirectory, `${post.slug}.mdx`);
    if (!fs.existsSync(contentPath)) {
      throw new Error(`Blog post "${post.slug}" is missing MDX content file.`);
    }

    assertPublicAsset(post.heroImage, post.slug);
    assertPublicAsset(post.ogImage, post.slug);

    const graphic = graphics.find((item) => item.slug === post.slug);
    if (!graphic) {
      throw new Error(`Blog post "${post.slug}" has no graphics manifest entry.`);
    }

    if (graphic.alt !== post.imageAlt) {
      throw new Error(`Blog post "${post.slug}" has image alt mismatch between content and graphics manifest.`);
    }

    if (post.relatedSlugs.some((slug) => !posts.some((related) => related.slug === slug))) {
      throw new Error(`Blog post "${post.slug}" references a missing related post.`);
    }

    if (post.canonicalUrl !== `${siteConfig.url}/blog/${post.slug}`) {
      throw new Error(`Blog post "${post.slug}" has invalid canonical URL.`);
    }
  }
}

function loadPosts() {
  if (cachedPosts) {
    return cachedPosts;
  }

  const posts = (manifest as ManifestPost[])
    .filter((post) => post.status !== "draft")
    .map((post) => {
      const source = fs.readFileSync(path.join(postsDirectory, `${post.slug}.mdx`), "utf8");
      validateFrontmatter(source, post);

      return {
        ...post,
        author: readFrontmatterString(source, "author", post.slug),
        content: stripFrontmatter(source),
        contentFormat: "mdx",
        stateOfInformation: post.updatedAt
      } satisfies BlogPost;
    })
    .sort((a, b) => {
      return a.title.localeCompare(b.title, "pl");
    });

  validatePosts(posts);
  cachedPosts = posts;
  return posts;
}

function toSummary(post: BlogPost): BlogPostSummary {
  const { seoTitle, seoDescription, canonicalUrl, ogImage, content, contentFormat, faq, relatedSlugs, ctaVariant, legalReviewRequired, showUpdatedAt, reviewAfter, stateOfInformation, sources, schemaType, searchIntent, primaryKeyword, ...summary } = post;
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
    const related = post.relatedSlugs
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
