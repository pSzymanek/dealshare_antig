import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { WordPressPostGrid } from "@/components/WordPressPostGrid";
import { getBlogCategories, getBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog Dealshare",
  description: "Praktyczne artykuły dla firm o finansowaniu, restrukturyzacji, analizie umów kredytowych i projektach energetycznych.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Blog Dealshare",
    description: "Konkretna wiedza dla przedsiębiorców szukających właściwego kierunku działania.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website"
  }
};

type BlogPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const categories = await getBlogCategories();
  const category = categories.find((item) => item === resolvedSearchParams?.category);
  const posts = await getBlogPosts(category ? { category } : undefined);

  return (
    <main>
      <section className="hero-dark-base py-20 text-white">
        <Container>
          <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">Baza wiedzy</p>
          <h1 className="heading-title-enter mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Konkretna wiedza dla decyzji firmowych.</h1>
          <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Finansowanie, restrukturyzacja, analiza umów i energia opisane prostym językiem, z myślą o przedsiębiorcy, który chce przejść od problemu do działania.
          </p>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container>
          <div className="max-w-3xl">
            <h2 className="heading-title-enter text-2xl font-black tracking-tight text-navy sm:text-3xl">Wybierz kategorię</h2>
            <p className="heading-copy-enter mt-2 text-sm leading-7 text-slate-600 sm:text-base">Zawęź listę artykułów do obszaru, który najbardziej dotyczy Twojej firmy.</p>
          </div>
          <div className="reveal-on-scroll reveal-delay-1 mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/blog"
              className={`soft-lift rounded-lg border px-4 py-2 text-sm font-bold transition duration-200 ${!category ? "border-cyan/40 bg-cyan text-navy shadow-sm" : "border-slate-200/90 bg-white text-slate-700 hover:border-cyan/50 hover:bg-cyan/5 hover:text-navy"}`}
            >
              Wszystkie wpisy
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={`/blog?category=${encodeURIComponent(item)}`}
                className={`soft-lift rounded-lg border px-4 py-2 text-sm font-bold transition duration-200 ${category === item ? "border-cyan/40 bg-cyan text-navy shadow-sm" : "border-slate-200/90 bg-white text-slate-700 hover:border-cyan/50 hover:bg-cyan/5 hover:text-navy"}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="heading-copy-enter mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan">{category ?? "Wszystkie artykuły"}</p>
            <h2 className="heading-title-enter text-3xl font-black tracking-tight text-navy sm:text-4xl">Aktualne publikacje</h2>
          </div>
          <div className="mt-8">
            <WordPressPostGrid posts={posts} />
          </div>
        </Container>
      </section>

      <CTASection title="Szukasz konkretnego rozwiązania dla firmy?" buttonLabel="Opisz potrzebę" buttonHref="/kontakt#formularz" />
    </main>
  );
}
