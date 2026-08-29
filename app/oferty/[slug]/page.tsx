import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { BriefInlineForm } from "@/components/BriefInlineForm";
import { Button } from "@/components/Button";
import { BriefModal } from "@/components/BriefModal";
import { ClosedOfferOverlay } from "@/components/ClosedOfferOverlay";
import { Container } from "@/components/Container";
import { getBriefConfig } from "@/lib/briefs";
import { getOfferBySlug, isOfferClosed, offerStaticSlugs, offers, type Offer, type OfferCardItem } from "@/lib/offers";

type OfferDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return offerStaticSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: OfferDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  return {
    title: offer?.seo.title ?? "Oferta",
    description: offer?.seo.description ?? "Szczegóły oferty na platformie dealshare.",
    alternates: {
      canonical: offer ? `/oferty/${offer.slug}` : "/oferty"
    }
  };
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  const briefConfig = getBriefConfig(offer.slug);
  const isClosed = isOfferClosed(offer);

  return (
    <main className="bg-white text-ink">
      <section className="hero-dark-base py-12 text-white sm:py-16">
        <Container>
          <Breadcrumbs offer={offer} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                {offer.categories.map((category) => (
                  <Badge key={category.slug} tone="teal">
                    {category.name}
                  </Badge>
                ))}
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan">
                  {offer.status}
                </span>
              </div>
              <h1 className="heading-title-enter mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">{offer.title}</h1>
              <p className="heading-copy-enter mt-5 max-w-2xl text-xl font-semibold leading-8 text-white/88">{offer.headline}</p>
              <p className="heading-copy-enter mt-4 max-w-2xl text-base leading-8 text-white/72">{offer.lead}</p>
              <ul className="mt-7 grid gap-3">
                {offer.heroBenefits.map((benefit, index) => (
                  <li key={benefit} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""} flex items-center gap-3 text-sm font-bold text-white/84`}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-xs text-cyan">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                {briefConfig ? <BriefModal config={briefConfig} buttonLabel={briefConfig.cta} buttonVariant="cyan" /> : <Button href="/kontakt" variant="cyan">{offer.ctaPrimary}</Button>}
                <Button href="#proces" variant="secondary">
                  {offer.ctaSecondary} <span className="ml-2">→</span>
                </Button>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-delay-2">
              {offer.slug === "yamura-pro" ? (
                <div className="mx-auto mb-7 flex justify-center">
                  <Image
                    src="/yamura-logo-dark.png"
                    alt="YAMURA"
                    width={520}
                    height={54}
                    priority
                    className="h-auto w-52 object-contain brightness-0 invert sm:w-64"
                  />
                </div>
              ) : null}
              <aside className="rounded-lg border border-cyan/35 bg-white/[0.05] p-6 text-white shadow-glow backdrop-blur-md">
                <h2 className="text-2xl font-black tracking-tight text-white">{offer.sidePanel.title}</h2>
                <ul className="mt-5 grid gap-3.5">
                  {offer.sidePanel.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-white/80">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-xs text-cyan">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {briefConfig ? (
                  <BriefModal config={briefConfig} buttonLabel={offer.sidePanel.cta} buttonVariant="cyan" buttonClassName="mt-6 w-full" />
                ) : (
                  <Button href="/kontakt" variant="cyan" className="mt-6 w-full">
                    {offer.sidePanel.cta}
                  </Button>
                )}
                <p className="mt-3 text-center text-xs font-semibold text-cyan">Wstępna analiza jest całkowicie darmowa</p>
                <p className="mt-3 text-xs leading-6 text-white/60">{offer.sidePanel.note}</p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      <ContentBand>
        <SplitIntro title={offer.problemTitle} paragraphs={offer.problemText} />
        <CardGrid items={offer.problemCards} variant="problem" />
      </ContentBand>

      <ContentBand muted>
        <SplitIntro title={offer.solutionTitle} paragraphs={offer.solutionText} />
        <CardGrid items={offer.solutionCards} columns="4" />
      </ContentBand>

      <section className="border-y border-slate-200 bg-white py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-center">
            <div>
              <h2 className="heading-title-enter text-3xl font-black tracking-tight text-navy">{offer.forWhomTitle}</h2>
              <p className="heading-copy-enter mt-3 text-sm leading-7 text-slate-600">Sprawdź, czy sytuacja pasuje do tej oferty.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {offer.forWhom.map((item, index) => (
                <li key={item} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 5)}` : ""} flex gap-2 text-sm font-semibold text-slate-700`}>
                  <span className="mt-0.5 text-teal">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <ContentBand>
        <SectionTitle title={offer.scopeTitle} />
        <CardGrid items={offer.scope} columns="5" />
      </ContentBand>

      {offer.valueTitle && (offer.valueCards || offer.valueText) ? (
        <ContentBand muted>
          <SplitIntro title={offer.valueTitle} paragraphs={offer.valueText ?? []} />
          {offer.valueCards ? <CardGrid items={offer.valueCards} /> : null}
        </ContentBand>
      ) : null}

      <section id="proces" className="bg-white py-14">
        <Container>
          <SectionTitle title={offer.processTitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {offer.process.map((step, index) => (
              <article key={`${step.step}-${step.title}`} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 5)}` : ""} group rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-cyan/40 hover:shadow-card`}>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-deal-gradient text-lg font-black text-white">{step.step}</div>
                <h3 className="mt-4 text-base font-black text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <InfoPanel title={offer.documentsTitle} items={offer.documents} tone="blue" />
            <InfoPanel title={offer.checkpointTitle} paragraphs={offer.checkpointText} items={offer.checkpoints} tone="amber" />
          </div>
        </Container>
      </section>

      {offer.risks?.length ? (
        <ContentBand>
          <SectionTitle title={offer.risksTitle ?? "Co warto sprawdzić przed decyzją"} />
          <CardGrid items={offer.risks} />
        </ContentBand>
      ) : null}

      <section className="bg-white py-14">
        <Container>
          <SectionTitle title="Najczęściej zadawane pytania" />
          <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200/80 bg-white shadow-sm">
            {offer.faq.map((item, index) => (
              <details key={item.question} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 4)}` : ""} group p-5 transition hover:bg-slate-50/70`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-navy">
                  {item.question}
                  <span className="text-electric transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {briefConfig ? (
        <BriefInlineForm config={briefConfig} title={offer.finalCta.title} text={offer.finalCta.text} />
      ) : (
        <section id="formularz" className="bg-[#f8fafc] pb-16 pt-6">
          <Container>
            <div className="reveal-on-scroll rounded-lg border border-cyan/35 bg-navy-gradient p-8 text-white shadow-glow sm:p-10">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{offer.finalCta.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-white/76">{offer.finalCta.text}</p>
              <Button href="/kontakt" variant="cyan" className="mt-7">
                {offer.finalCta.buttonLabel} <span className="ml-2">→</span>
              </Button>
            </div>
          </Container>
        </section>
      )}
      {isClosed ? <ClosedOfferOverlay offerId={offer.slug} offerTitle={offer.title} /> : null}
    </main>
  );
}

function Breadcrumbs({ offer }: { offer: Offer }) {
  return (
    <nav className="flex flex-wrap gap-2 text-sm font-bold text-white/60" aria-label="Breadcrumb">
      <Link href="/" className="transition hover:text-cyan">
        Strona główna
      </Link>
      <span>/</span>
      <Link href="/oferty" className="transition hover:text-cyan">
        Oferty
      </Link>
      <span>/</span>
      <span className="text-cyan">{offer.title}</span>
    </nav>
  );
}

function ContentBand({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <section className={`${muted ? "bg-[#f8fafc]" : "bg-white"} py-14`}>
      <Container>{children}</Container>
    </section>
  );
}

function SplitIntro({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <SectionTitle title={title} />
      <div className="max-w-3xl space-y-4 text-sm leading-7 text-slate-600">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="heading-copy-enter">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="heading-title-enter text-3xl font-black tracking-tight text-navy">{title}</h2>;
}

function CardGrid({
  items,
  columns = "3",
  variant = "default"
}: {
  items: OfferCardItem[];
  columns?: "3" | "4" | "5";
  variant?: "default" | "problem";
}) {
  const gridClass = columns === "5" ? "lg:grid-cols-5" : columns === "4" ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className={`mt-8 grid gap-5 sm:grid-cols-2 ${gridClass}`}>
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`card-glass soft-lift reveal-on-scroll ${
            index > 0 ? `reveal-delay-${Math.min(index, 5)}` : ""
          } group rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-card ${
            variant === "problem"
              ? "border-slate-200/80 hover:border-magenta/40"
              : "border-slate-200/80 hover:border-cyan/40"
          }`}
        >
          <div
            className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black ${
              variant === "problem"
                ? "border border-magenta/30 bg-magenta/10 text-magenta shadow-sm"
                : "bg-deal-gradient text-white"
            }`}
          >
            {variant === "problem" ? "✕" : (item.icon ?? "✓")}
          </div>
          <h3 className="mt-4 text-base font-black text-navy">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function InfoPanel({ title, paragraphs, items, tone }: { title: string; paragraphs?: string[]; items: string[]; tone: "blue" | "amber" }) {
  const toneClasses = tone === "amber" ? "border-amber-300/60 bg-amber-50 text-amber-700" : "border-electric/20 bg-white text-electric";

  return (
    <section className={`card-glass soft-lift reveal-on-scroll rounded-lg border p-6 shadow-sm ${toneClasses}`}>
      <h2 className="text-2xl font-black tracking-tight text-navy">{title}</h2>
      {paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-600">
          {paragraph}
        </p>
      ))}
      <ul className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-0.5 text-teal">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
