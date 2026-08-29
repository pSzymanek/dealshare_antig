import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { DealFlowGraph } from "@/components/DealFlowGraph";
import { HeroBlogSlideshow } from "@/components/HeroBlogSlideshow";
import { OfferCard } from "@/components/OfferCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getStaticBlogPosts, type BlogPostSummary } from "@/lib/blog";
import { offers } from "@/lib/offers";
import styles from "./HomePage.module.css";

const benefits = [
  {
    title: "Zaczynamy od potrzeby",
    icon: "/dealshare_icon_wyselekcjonowane_oferty.svg",
    description: "Firma opisuje sytuację, cel albo problem. Dopiero później dobieramy właściwy kierunek działania."
  },
  {
    title: "Analiza przed kontaktem",
    icon: "/dealshare_icon_mniej_chaosu_wiecej_konkretow.svg",
    description: "Porządkujemy kontekst, dokumenty i ograniczenia, zanim połączymy firmę z partnerem."
  },
  {
    title: "Sieć i aktywne poszukiwanie",
    icon: "/dealshare_icon_partnerzy_b2b.svg",
    description: "Korzystamy z istniejącej sieci Dealshare, a gdy trzeba, szukamy nowego rozwiązania na rynku."
  },
  {
    title: "Połączenie stron",
    icon: "/dealshare_ikona_suwaki.svg",
    description: "Doprowadzamy do rozmowy z jasnym zakresem, kontekstem i kolejnym krokiem po obu stronach."
  }
];

const scenarios = [
  {
    title: "Potrzebujesz finansowania",
    text: "Nie zaczynamy od listy banków. Najpierw sprawdzamy cel, kondycję firmy i realne ścieżki rozmów."
  },
  {
    title: "Chcesz obniżyć koszty",
    text: "Analizujemy obszar kosztowy, dokumenty i możliwe źródła oszczędności, a później dobieramy partnera."
  },
  {
    title: "Szukasz wykonawcy albo partnera",
    text: "Opisujesz projekt, zakres i oczekiwany model współpracy. My sprawdzamy, kto może dowieźć temat."
  },
  {
    title: "Nie pasujesz do katalogu",
    text: "To normalne. Dealshare ma obsługiwać nietypowe potrzeby, nie tylko gotowe formularze ofertowe."
  }
];

const featuredOfferSlugs = ["kredyty-dla-firm", "restrukturyzacje", "yamura-pro"];
const featuredOffers = featuredOfferSlugs.map((slug) => {
  const offer = offers.find((candidate) => candidate.slug === slug);

  if (!offer) {
    throw new Error(`Missing featured offer: ${slug}`);
  }

  return offer;
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  }
};

function hashSlug(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getHeroBlogPosts(): BlogPostSummary[] {
  return getStaticBlogPosts()
    .map(({ id, slug, title, excerpt, category, tags, author, publishedAt, updatedAt, readingTime, heroImage, imageAlt }) => ({
      id,
      slug,
      title,
      excerpt,
      category,
      tags,
      author,
      publishedAt,
      updatedAt,
      readingTime,
      heroImage,
      imageAlt
    }))
    .sort((a, b) => hashSlug(`home-hero-blog:${a.slug}`) - hashSlug(`home-hero-blog:${b.slug}`))
    .slice(0, 7);
}

export default function HomePage() {
  const heroBlogPosts = getHeroBlogPosts();

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={`${styles.heroEyebrow} heading-copy-enter text-sm font-bold uppercase tracking-[0.18em] text-cyan`}>Dealshare dla Twojej firmy</p>
            <h1 className="heading-title-enter mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
              Przychodzisz z potrzebą. Wychodzisz z <span className={styles.heroTitleAccent}>rozwiązaniem</span>.
            </h1>
            <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Dealshare porządkuje potrzeby firm i prowadzi je do właściwych rozwiązań. Analizujemy sprawę, następnie dobieramy właściwy kolejny krok.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/kontakt#formularz">Opisz swoją potrzebę</Button>
              <Button href="#jak-dziala" variant="secondary">
                Zobacz, jak działamy
              </Button>
            </div>
          </div>
          <div className={`${styles.heroBlog} min-w-0`}>
            <HeroBlogSlideshow posts={heroBlogPosts} />
          </div>
        </Container>
      </section>

      <section className={`${styles.benefitSection} py-20`}>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className={`${styles.benefitCard} soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""}`}>
                <span className={styles.benefitIndex}>0{index + 1}</span>
                <div className={styles.benefitIcon}>
                  <Image src={benefit.icon} alt="" width={52} height={52} className="h-11 w-11 object-contain" />
                </div>
                <h2 className="mt-5 flex min-h-[3.5rem] items-start text-lg font-black tracking-tight text-navy">{benefit.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="jak-dziala" className={`${styles.graphSection} scroll-mt-24 overflow-hidden py-20 text-white`}>
        <Container>
          <div className={styles.graphIntro}>
            <div className="max-w-3xl">
              <p className={`${styles.sectionEyebrow} mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan`}>Jak działa Dealshare</p>
              <h2 className="heading-title-enter text-3xl font-black tracking-tight text-white sm:text-4xl">Od potrzeby Twojej firmy, do właściwego rozwiązania</h2>
              <p className="heading-copy-enter mt-4 text-base leading-8 text-white/66 sm:text-lg">
                Dealshare nie jest zamkniętym katalogiem ofert. Traktujemy ofertę jako możliwy kierunek, a nie punkt startowy. Punktem startowym jest realna potrzeba firmy.
              </p>
            </div>
          </div>

          <DealFlowGraph className="mt-12" />
          <p className={`${styles.graphFootnote} mt-8 max-w-3xl text-sm leading-7 text-white/58`}>
            Łączymy analizę, sieć partnerów i aktywne poszukiwanie na rynku. Jeśli właściwego partnera nie ma jeszcze w naszej bazie, szukamy go pod konkretną sprawę.
          </p>
        </Container>
      </section>

      <section className={`${styles.searchSection} py-20`}>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow="Nie mamy gotowego partnera?"
              title="To go szukamy."
              description="Nie zamykamy rozmowy tylko dlatego, że temat nie pasuje do obecnej listy ofert. Jeśli potrzeba ma sens biznesowy, sprawdzamy rynek i szukamy właściwej strony."
              align="right"
            />
            <div className={styles.searchSteps}>
              {["Opis sprawy", "Szybka kwalifikacja", "Poszukiwanie partnera"].map((item, index) => (
                <div key={item} className={`${styles.searchStep} reveal-on-scroll ${index > 0 ? `reveal-delay-${index}` : ""}`}>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-teal">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-black text-navy">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className={`${styles.scenarioSection} py-20`}>
        <Container>
          <SectionHeading eyebrow="Od potrzeby do rozwiązania" title="Z czym możesz przyjść do Dealshare?" theme="dark" />
          <div className={`${styles.scenarioGrid} mt-10`}>
            {scenarios.map((scenario, index) => (
              <div key={scenario.title} className={`${styles.scenarioCard} reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""}`}>
                <span className={styles.scenarioIndex}>0{index + 1}</span>
                <h3 className="mt-5 text-lg font-black text-white">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{scenario.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className={`${styles.offersSection} py-20`}>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Przykładowe obszary"
              title="Rozwiązania, które już obsługujemy"
              description="Poniższe oferty pokazują obszary, w których mamy gotowe ścieżki rozmów. To nie jest pełna lista możliwości Dealshare."
            />
            <Link href="/oferty" className="arrow-link text-sm font-bold text-electric transition hover:text-teal">
              Zobacz przykłady <span aria-hidden="true" className="arrow-mark ml-1">&rarr;</span>
            </Link>
          </div>
          <div className={`${styles.offersGrid} mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
            {featuredOffers.map((offer, index) => (
              <OfferCard key={offer.slug} offer={offer} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${index}` : ""}`} />
            ))}
          </div>
        </Container>
      </section>

      <section className={`${styles.partnerSection} py-20`}>
        <Container>
          <div className={`${styles.partnerLayout} reveal-on-scroll`}>
            <div>
              <p className={`${styles.sectionEyebrow} text-sm font-bold uppercase tracking-[0.18em] text-teal`}>Dla partnerów</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">Masz rozwiązanie, którego mogą potrzebować firmy?</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Opisz kategorię, profil klienta i model współpracy. Sprawdzimy, czy możemy włączyć Twoje rozwiązanie do procesów Dealshare.
              </p>
            </div>
            <Button href="/kontakt#formularz" className="w-full sm:w-auto">
              Zostań partnerem
            </Button>
          </div>
        </Container>
      </section>

      <CTASection
        title="Masz konkretną potrzebę, ale nie wiesz, od czego zacząć?"
        description="Opisz sytuację firmy. Sprawdzimy, czy mamy gotowe rozwiązanie, czy trzeba uruchomić aktywne poszukiwanie partnera."
        buttonLabel="Opisz swoją potrzebę"
        buttonHref="/kontakt#formularz"
      />
    </main>
  );
}
