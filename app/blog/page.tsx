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
      <section className="bg-navy-gradient py-20 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Blog</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Konkretna wiedza dla decyzji firmowych.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">
            Finansowanie, restrukturyzacja, analiza umów i energia opisane prostym językiem, z myślą o przedsiębiorcy, który chce przejść od problemu do działania.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Kategorie</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">Wybierz obszar, który najlepiej pasuje do aktualnej sytuacji firmy.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className={`soft-lift rounded-md border px-4 py-2 text-sm font-bold transition ${!category ? "border-electric bg-electric text-white" : "border-slate-200 bg-white text-navy hover:border-electric hover:bg-electric/5"}`}
            >
              Wszystkie
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={`/blog?category=${encodeURIComponent(item)}`}
                className={`soft-lift rounded-md border px-4 py-2 text-sm font-bold transition ${category === item ? "border-electric bg-electric text-white" : "border-slate-200 bg-white text-navy hover:border-electric hover:bg-electric/5"}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-teal">{category ?? "Wszystkie wpisy"}</p>
            <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Artykuły</h2>
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
