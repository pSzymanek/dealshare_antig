import { siteConfig } from "@/lib/site";
import type { BlogContentProvider, BlogPost, BlogPostSummary } from "./types";

type WordPressRendered = {
  rendered: string;
};

type RawWordPressCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
};

type RawWordPressPost = {
  id: number;
  date_gmt?: string;
  date?: string;
  modified_gmt?: string;
  modified?: string;
  slug: string;
  link: string;
  title: WordPressRendered;
  excerpt: WordPressRendered;
  content: WordPressRendered;
  categories: number[];
  meta?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
    }>;
    "wp:term"?: Array<Array<RawWordPressCategory>>;
  };
};

const apiUrl = process.env.WORDPRESS_API_URL;

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function sanitizeWordPressHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\shref=["']javascript:[^"']*["']/gi, "")
    .replace(/javascript:/gi, "");
}

function readStringMeta(meta: Record<string, unknown> | undefined, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = meta?.[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return fallback;
}

function readStringArrayMeta(meta: Record<string, unknown> | undefined, key: string) {
  const value = meta?.[key];
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value as string[];
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return parsed;
      }
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapPost(post: RawWordPressPost): BlogPost {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms[0]?.name ?? "Blog";
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const publishedAt = post.date_gmt ?? post.date ?? new Date().toISOString();
  const updatedAt = post.modified_gmt ?? post.modified ?? publishedAt;
  const image = media?.source_url ?? "/sygnet.png";
  const imageAlt = media?.alt_text || title;
  const meta = post.meta;

  return {
    id: String(post.id),
    slug: post.slug,
    title,
    excerpt,
    category,
    tags: readStringArrayMeta(meta, "tags"),
    publishedAt,
    updatedAt,
    readingTime: Number(meta?.readingTime ?? meta?.reading_time ?? 4),
    heroImage: image,
    imageAlt,
    author: readStringMeta(meta, ["author"], "Zespół Dealshare"),
    seoTitle: readStringMeta(meta, ["seoTitle", "seo_title"], title),
    seoDescription: readStringMeta(meta, ["seoDescription", "seo_description"], excerpt),
    canonicalUrl: `${siteConfig.url}/blog/${post.slug}`,
    ogImage: readStringMeta(meta, ["ogImage", "og_image"], image),
    content: sanitizeWordPressHtml(post.content.rendered),
    contentFormat: "html",
    faq: [],
    relatedSlugs: readStringArrayMeta(meta, "relatedSlugs"),
    ctaVariant: "kontakt",
    legalReviewRequired: Boolean(meta?.legalReviewRequired ?? meta?.legal_review_required ?? false),
    showUpdatedAt: true,
    reviewAfter: readStringMeta(meta, ["reviewAfter", "review_after"]),
    stateOfInformation: readStringMeta(meta, ["stateOfInformation", "state_of_information"], updatedAt),
    sources: readStringArrayMeta(meta, "sources"),
    schemaType: "Article",
    searchIntent: readStringMeta(meta, ["searchIntent", "search_intent"]),
    primaryKeyword: readStringMeta(meta, ["primaryKeyword", "primary_keyword"])
  };
}

async function wpFetch<T>(path: string): Promise<T | null> {
  if (!apiUrl) {
    return null;
  }

  try {
    const separator = path.includes("?") ? "&" : "?";
    const response = await fetch(`${apiUrl}${path}${separator}_embed=1`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime,
    heroImage: post.heroImage,
    imageAlt: post.imageAlt
  };
}

export const wordpressBlogProvider: BlogContentProvider = {
  async getPosts(options = {}) {
    const perPage = options.limit ?? 30;
    const posts = await wpFetch<RawWordPressPost[]>(`/posts?per_page=${perPage}`);
    let mapped = posts?.map(mapPost) ?? [];

    if (options.category) {
      mapped = mapped.filter((post) => post.category === options.category);
    }

    if (options.tag) {
      mapped = mapped.filter((post) => post.tags.includes(options.tag ?? ""));
    }

    return mapped.map(toSummary);
  },

  async getPostBySlug(slug) {
    const posts = await wpFetch<RawWordPressPost[]>(`/posts?slug=${slug}`);
    return posts?.[0] ? mapPost(posts[0]) : null;
  },

  async getCategories() {
    const categories = await wpFetch<RawWordPressCategory[]>("/categories?per_page=100");
    return categories?.filter((category) => category.count > 0).map((category) => category.name).sort((a, b) => a.localeCompare(b, "pl")) ?? [];
  },

  async getRelatedPosts(post, limit = 3) {
    const posts = await this.getPosts({ category: post.category, limit: limit + 1 });
    return posts.filter((candidate) => candidate.slug !== post.slug).slice(0, limit);
  }
};
