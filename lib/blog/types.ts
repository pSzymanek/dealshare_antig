export type BlogContentFormat = "mdx" | "html";

export type BlogCtaVariant = "finansowanie" | "restrukturyzacja" | "analiza-umowy" | "energia" | "kontakt";

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogSourceRef = {
  id: string;
  title?: string;
  url?: string;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  heroImage: string;
  imageAlt: string;
};

export type BlogPost = BlogPostSummary & {
  author: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  content: string;
  contentFormat: BlogContentFormat;
  faq: BlogFaqItem[];
  relatedSlugs: string[];
  ctaVariant: BlogCtaVariant;
  legalReviewRequired: boolean;
  showUpdatedAt: boolean;
  reviewAfter?: string;
  stateOfInformation?: string;
  sources: string[] | BlogSourceRef[];
  schemaType: "Article" | "BlogPosting";
  searchIntent?: string;
  primaryKeyword?: string;
};

export type BlogQuery = {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
};

export type BlogContentProvider = {
  getPosts(options?: BlogQuery): Promise<BlogPostSummary[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  getCategories(): Promise<string[]>;
  getRelatedPosts(post: BlogPost, limit?: number): Promise<BlogPostSummary[]>;
};
