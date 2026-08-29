import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "O nas",
  description: "Dealshare jako platforma B2B dla firm, które chcą przejść od potrzeby do właściwego rozwiązania lub partnera.",
  alternates: {
    canonical: "/o-nas"
  }
};

const sections = [
  {
    index: "01",
    title: "Kim jesteśmy",
    text: "Dealshare to platforma B2B tworzona z myślą o przedsiębiorcach, którzy chcą szybciej przechodzić od potrzeby do właściwego kontaktu, partnera albo rozwiązania."
  },
  {
    index: "02",
    title: "Co robimy",
    text: "Porządkujemy wybrane możliwości biznesowe: od partnerstw i usług po technologie, optymalizację kosztów oraz rozwiązania wspierające rozwój firm."
  },
  {
    index: "03",
    title: "Dlaczego Dealshare",
    text: "Stawiamy na jasny kontekst, selekcję i rozmowy, które mają większą szansę przełożyć się na konkretne działania po stronie przedsiębiorcy."
  },
  {
    index: "04",
    title: "Dla kogo jest platforma",
    text: "Dla właścicieli firm, zarządów MŚP, zespołów sprzedaży, operatorów usług B2B i partnerów, którzy chcą prezentować oferty w profesjonalnym środowisku."
  }
];

export default function AboutPage() {
  return (
    <main>
      <section className="hero-dark-base py-20 text-white">
        <Container>
          <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">O nas</p>
          <h1 className="heading-title-enter mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Platforma dla firm, <br />
            które chcą <span className="text-cyan">widzieć więcej</span>
          </h1>
          <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Budujemy środowisko, które pomaga firmom uporządkować potrzebę, znaleźć właściwy kierunek i przejść do konkretnej rozmowy.
          </p>
          <div className="heading-copy-enter mt-8">
            <Button href="/kontakt#formularz" variant="cyan">
              Porozmawiajmy! →
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-20">
        <Container>
          <SectionHeading title="Jak myślimy o rynku B2B" description="Firmy nie potrzebują więcej szumu. Potrzebują lepszego kontekstu, jasnych kategorii i sprawniejszego przejścia do właściwej rozmowy." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sections.map((section, index) => (
              <section key={section.title} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""} group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-card`}>
                <Image
                  src="/sygnet.png"
                  alt=""
                  width={80}
                  height={80}
                  className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 object-contain opacity-[0.03] transition duration-300 group-hover:opacity-[0.07]"
                  aria-hidden="true"
                />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan">{section.index}</span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-navy">{section.title}</h2>
                <p className="mt-4 leading-8 text-slate-600">{section.text}</p>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <CTASection title="Chcesz dołączyć jako partner albo szukasz rozwiązania dla firmy?" buttonLabel="Przejdź do kontaktu" buttonHref="/kontakt#formularz" />
    </main>
  );
}
