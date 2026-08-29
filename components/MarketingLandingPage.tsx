import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { getBriefConfig } from "@/lib/briefs";
import type { LandingPageConfig } from "@/lib/landing-pages";
import type { Offer } from "@/lib/offers";

const imageByOffer: Record<string, string> = {
  "optymalizacja-kosztow-energii": "/dealshare_umowy_na_energie_bolt.svg",
  "sankcja-kredytu-darmowego": "/dealshare_uniewaznienia_kredytow_cancel.svg"
};

type MarketingLandingPageProps = {
  landing: LandingPageConfig;
  offer: Offer;
};

export function MarketingLandingPage({ landing, offer }: MarketingLandingPageProps) {
  const briefConfig = getBriefConfig(offer.slug);
  const imageSrc = imageByOffer[offer.slug] ?? "/sygnet.png";

  return (
    <main className="bg-white text-ink">
      <section className="hero-dark-base py-12 text-white sm:py-16 lg:py-20">
        <Container>
          <nav className="mb-8 flex flex-wrap gap-2 text-sm font-semibold text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cyan">
              Strona główna
            </Link>
            <span>/</span>
            <Link href="/oferty" className="hover:text-cyan">
              Oferty
            </Link>
            <span>/</span>
            <span className="text-cyan">{offer.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={offer.isIndividual ? "dark" : "blue"}>{offer.category}</Badge>
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan">Wstępna analiza bez opłat</span>
              </div>
              <p className="heading-copy-enter mt-8 text-sm font-black uppercase tracking-[0.22em] text-cyan">{landing.eyebrow}</p>
              <h1 className="heading-title-enter mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{landing.title}</h1>
              <p className="heading-copy-enter mt-6 max-w-3xl text-lg leading-8 text-white/76 sm:text-xl sm:leading-9">{landing.lead}</p>

              <div className="heading-copy-enter mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="#formularz" variant="cyan" className="w-full sm:w-auto">
                  {landing.primaryCta} <span className="ml-2">→</span>
                </Button>
                <Button href="#szczegoly" variant="secondary" className="w-full sm:w-auto">
                  {landing.secondaryCta}
                </Button>
              </div>
            </div>

            <aside className="reveal-on-scroll reveal-delay-2 rounded-lg border border-cyan/35 bg-white/[0.05] p-6 text-white shadow-glow backdrop-blur-md">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/95 p-5 shadow-card">
                <Image src={imageSrc} alt="" width={96} height={96} className="h-full w-full object-contain" />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-white">Co dostajesz na start</h2>
              <ul className="mt-5 grid gap-3">
                {landing.proofPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm font-bold leading-6 text-white/82">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-xs text-cyan">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg border border-white/10 bg-white/10 p-4 text-sm font-semibold leading-7 text-white/72">
                Zostawienie kontaktu nie oznacza decyzji o współpracy. Najpierw sprawdzamy, czy temat ma sens.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="reveal-on-scroll">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Dlaczego warto sprawdzić</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-5xl">{landing.urgencyTitle}</h2>
            </div>
            <p className="reveal-on-scroll text-base leading-8 text-slate-600 sm:text-lg">{landing.urgencyText}</p>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Efekt analizy</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">{landing.quickWinsTitle}</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {landing.quickWins.map((item, index) => (
              <article key={item.title} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""} rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-cyan/40 hover:shadow-card`}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-deal-gradient text-lg font-black text-white">{index + 1}</span>
                <h3 className="mt-5 text-xl font-black text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="reveal-on-scroll">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Jak działamy</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">{landing.storyTitle}</h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-slate-600">
              {landing.storyParagraphs.map((paragraph) => (
                <p key={paragraph} className="reveal-on-scroll">
                  {paragraph}
                </p>
              ))}
              <div className="reveal-on-scroll pt-2">
                <Button href="#formularz" variant="ghost">
                  Przejdź do formularza <span className="ml-2">→</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="szczegoly" className="bg-[#f8fafc] py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="reveal-on-scroll">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Szczegóły</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy">Rozwiń to, co jest dla Ciebie ważne</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Najważniejsze informacje są wyżej. Tu znajdziesz konkrety dla osób, które chcą wejść głębiej przed zostawieniem kontaktu.</p>
            </div>
            <div className="reveal-on-scroll divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
              {landing.detailGroups.map((group, index) => (
                <details key={group.title} className="group p-5 sm:p-6" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-navy">
                    {group.title}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-electric transition group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{group.intro}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-slate-700">
                        <span className="mt-0.5 text-teal">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="reveal-on-scroll rounded-lg border border-cyan/35 bg-navy-gradient p-7 text-white shadow-glow sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{landing.conversionTitle}</h2>
              <p className="mt-4 text-base leading-8 text-white/76">{landing.conversionText}</p>
            </div>
            <Button href="#formularz" variant="cyan" className="mt-7 lg:mt-0">
              Zostaw kontakt <span className="ml-2">→</span>
            </Button>
          </div>
        </Container>
      </section>

      {briefConfig ? <LandingLeadForm config={briefConfig} title={landing.formTitle} text={landing.formText} /> : null}
    </main>
  );
}
