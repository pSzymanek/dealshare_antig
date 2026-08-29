import type { BlogPost, BlogPostSummary } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

type BlogJsonLdProps = {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
};

export function BlogJsonLd({ post, relatedPosts }: BlogJsonLdProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schemaType,
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo-main.png`
      }
    },
    image: `${siteConfig.url}${post.ogImage}`,
    mainEntityOfPage: post.canonicalUrl,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    isPartOf: {
      "@type": "Blog",
      name: "Blog Dealshare",
      url: `${siteConfig.url}/blog`
    },
    relatedLink: relatedPosts.map((related) => `${siteConfig.url}/blog/${related.slug}`)
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Start",
        item: siteConfig.url
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: post.canonicalUrl
      }
    ]
  };

  const faqSchema = post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </>
  );
}
