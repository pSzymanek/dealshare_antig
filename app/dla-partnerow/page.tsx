import type { Metadata } from "next";
import Image from "next/image";
import { BriefModal } from "@/components/BriefModal";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { MagentaRibbons } from "@/components/MagentaRibbons";
import { SectionHeading } from "@/components/SectionHeading";
import { getBriefConfig } from "@/lib/briefs";
import styles from "./PartnersPage.module.css";

export const metadata: Metadata = {
  title: "Dla partnerów",
  description: "Zgłoś ofertę B2B do Dealshare i sprawdź, czy możemy włączyć ją do procesów dla firm szukających rozwiązań.",
  alternates: {
    canonical: "/dla-partnerow"
  }
};

const partnerBenefits = [
  {
    title: "Lepszy kontekst zgłoszeń",
    text: "Klient nie zostawia pustej wiadomości. Przechodzi przez brief, który porządkuje sytuację, potrzeby i etap decyzji."
  },
  {
    title: "Oferta z czytelnym przekazem",
    text: "Pomagamy przełożyć rozwiązanie B2B na jasny przekaz: dla kogo jest, kiedy ma sens i jaki jest następny krok."
  },
  {
    title: "Dopasowanie zamiast przypadkowych leadów",
    text: "Dealshare nie ma generować szumu. Ma kierować do rozmów, które mają sens dla obu stron."
  }
];

const partnerFlow = ["Zgłaszasz ofertę", "Porządkujemy przekaz", "Budujemy brief", "Publikujemy obszar", "Łączymy z firmami"];

export default function PartnersPage() {
  const partnerConfig = getBriefConfig("dodaj-oferte");

  return (
    <main>
      <div className={styles.darkWrapper}>
        <MagentaRibbons className={styles.lightRibbons} />

        <section className={`${styles.darkHero} py-20 text-white`}>
          <Container className={`${styles.content} grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center`}>
            <div>
              <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">Dla partnerów</p>
              <h1 className="heading-title-enter mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                Masz ofertę B2B? Pokaż ją firmom, które naprawdę jej <span className="text-cyan">potrzebują</span>.
              </h1>
              <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Dealshare pomaga partnerom opisać rozwiązanie w uporządkowany sposób i połączyć je z firmami, które przychodzą z konkretną potrzebą, a nie przypadkowym kliknięciem.
              </p>
              <div className="heading-copy-enter mt-9 flex flex-col gap-3 sm:flex-row">
                {partnerConfig ? (
                  <BriefModal
                    config={partnerConfig}
                    buttonLabel="Zgłoś ofertę"
                    buttonVariant="primary"
                    buttonClassName="w-full border border-cyan/25 bg-cyan text-navy shadow-glow hover:bg-teal hover:text-white sm:w-auto"
                  />
                ) : null}
                <Button href="/#jak-dziala" variant="secondary">
                  Zobacz model działania
                </Button>
              </div>
            </div>

            <div className={`hero-process-visual ${styles.flowLoose} reveal-on-scroll reveal-delay-2`}>
              <div className="relative z-10">
                <div className="grid gap-3">
                  {partnerFlow.map((item, index) => (
                    <div key={item} className="hero-process-step" style={{ "--flow-delay": `${index * 0.35}s` } as React.CSSProperties}>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan">0{index + 1}</span>
                      <strong className="block text-lg font-black text-white">{item}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className={`${styles.darkBenefits} pb-24 pt-4 text-white`}>
          <Container className={styles.content}>
            <div className="max-w-3xl">
              <p className="heading-copy-enter mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan">Co zyskujesz</p>
              <h2 className="heading-title-enter text-3xl font-black tracking-tight text-white sm:text-4xl">Nie tylko miejsce na stronie</h2>
              <p className="heading-copy-enter mt-4 text-base leading-8 text-white/66 sm:text-lg">
                Oferta partnera w Dealshare powinna być częścią procesu: klient ma zrozumieć, kiedy rozwiązanie pasuje do jego sytuacji i co powinien przygotować przed rozmową.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {partnerBenefits.map((item, index) => (
                <article key={item.title} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${index}` : ""} p-6 ${styles.benefitCard}`}>
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{item.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </div>

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow="Dla kogo"
              title="Dla firm, które mają konkretne rozwiązanie dla biznesu"
              description="Finansowanie, prawo, optymalizacja kosztów, technologia, energia, wykonawstwo, inwestycje, usługi specjalistyczne albo inne rozwiązania, które można sensownie dopasować do potrzeb firm."
            />
            <div className="reveal-on-scroll reveal-delay-1 rounded-lg border border-electric/15 bg-electric/5 p-6">
              <h2 className="text-xl font-black text-navy">Jak wygląda start?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Zgłaszasz ofertę, opisujesz grupę docelową i model współpracy. My sprawdzamy, jak ją zakwalifikować, jakiego briefu potrzebuje klient i czy temat pasuje do Dealshare.
              </p>
              <div className="mt-6">
                {partnerConfig ? (
                  <BriefModal
                    config={partnerConfig}
                    buttonLabel="Chcę dodać ofertę"
                    buttonVariant="primary"
                    buttonClassName="w-full sm:w-auto"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
