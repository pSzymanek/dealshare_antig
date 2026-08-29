import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { BlogCta } from "@/components/blog/BlogCta";
import { BlogFloatingNav } from "@/components/blog/BlogFloatingNav";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";
import { HtmlRenderer } from "@/components/blog/HtmlRenderer";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { getBlogPostBySlug, getRelatedBlogPosts, getStaticBlogSlugs } from "@/lib/blog";
import { getTableOfContents } from "@/lib/blog/markdown";
import { siteConfig } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getStaticBlogSlugs();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return {
    title: post?.seoTitle ?? "Wpis blogowy",
    description: post?.seoDescription ?? "Wpis blogowy Dealshare.",
    alternates: {
      canonical: `/blog/${slug}`
    },
    openGraph: post
      ? {
          title: post.seoTitle,
          description: post.seoDescription,
          url: post.canonicalUrl,
          siteName: siteConfig.name,
          type: "article",
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          images: [
            {
              url: post.ogImage,
              width: 1200,
              height: 630,
              alt: post.imageAlt
            }
          ]
        }
      : undefined,
    twitter: post
      ? {
          card: "summary_large_image",
          title: post.seoTitle,
          description: post.seoDescription,
          images: [post.ogImage]
        }
      : undefined
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date(post.publishedAt));
  const updatedDate = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date(post.updatedAt));
  const toc = getTableOfContents(post.content);
  const relatedPosts = await getRelatedBlogPosts(post, 3);

  return (
    <main>
      <BlogJsonLd post={post} relatedPosts={relatedPosts} />
      <article>
        <section className="hero-dark-base py-20 text-white">
          <Container>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/64" aria-label="Ścieżka">
              <Link href="/" className="transition hover:text-cyan">
                Start
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="transition hover:text-cyan">
                Blog
              </Link>
            </nav>
            <div className="mt-8 max-w-4xl">
              <Badge tone="teal">{post.category}</Badge>
              <h1 className="heading-title-enter mt-6 text-4xl font-black tracking-tight sm:text-6xl">{post.title}</h1>
              <p className="heading-copy-enter mt-6 max-w-3xl text-lg leading-8 text-white/76">{post.excerpt}</p>
              <div className="heading-copy-enter mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/66">
                <span>Autor: {post.author}</span>
                <time dateTime={post.publishedAt}>Opublikowano: {publishedDate}</time>
                {post.showUpdatedAt ? <time dateTime={post.updatedAt}>Aktualizacja: {updatedDate}</time> : null}
                <span>{post.readingTime} min czytania</span>
              </div>
            </div>
          </Container>
        </section>

        <div className="bg-white">
          <Container className="-mt-10">
            <div className="reveal-on-scroll relative aspect-[16/9] overflow-hidden rounded-lg border border-white/80 shadow-card">
              <Image src={post.heroImage} alt={post.imageAlt} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Container>
        </div>

        <section className="bg-white py-16">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0">
                <div className="mb-8 rounded-lg border border-cyan/30 bg-cyan/10 p-5 text-sm leading-7 text-navy">
                  Materiał ma charakter informacyjny i nie zastępuje indywidualnej analizy prawnej, finansowej, podatkowej ani technicznej.
                </div>

                {post.contentFormat === "html" ? <HtmlRenderer content={post.content} /> : <MarkdownRenderer content={post.content} />}

                {post.faq.length ? (
                  <section className="reveal-on-scroll mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-2xl font-black tracking-tight text-navy">Najczęstsze pytania</h2>
                    <div className="mt-6 grid gap-4">
                      {post.faq.map((item) => (
                        <details key={item.question} className="rounded-md border border-slate-200 bg-white p-4">
                          <summary className="cursor-pointer text-sm font-black text-navy">{item.question}</summary>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}

                <div className="reveal-on-scroll mt-12">
                  <BlogCta variant={post.ctaVariant} />
                </div>
              </div>

              <aside className="lg:sticky lg:top-32 lg:self-start">
                {toc.length ? (
                  <div className="card-glass soft-lift rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">W artykule</p>
                    <nav className="mt-4 grid gap-2 text-sm" aria-label="Spis treści">
                      {toc.map((heading) => (
                        <a key={heading.id} href={`#${heading.id}`} className={`leading-6 text-slate-600 transition hover:text-electric ${heading.level === 3 ? "pl-3 text-xs" : "font-bold text-navy"}`}>
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                ) : null}

                <div className="card-glass soft-lift mt-6 rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Kategoria</p>
                  <p className="mt-2 text-sm font-bold text-navy">{post.category}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      {relatedPosts.length ? (
        <section className="bg-[#f8fafc] py-16">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">Czytaj dalej</p>
              <h2 className="heading-title-enter mt-3 text-3xl font-black tracking-tight text-navy">Powiązane artykuły</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${index}` : ""} rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-cyan/50 hover:shadow-card`}>
                  <Badge tone="teal">{related.category}</Badge>
                  <h3 className="mt-4 text-lg font-black tracking-tight text-navy">{related.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
      <BlogFloatingNav />
    </main>
  );
}
