import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Opisz potrzebę firmy, zgłoś rozwiązanie partnerskie albo skontaktuj się z Dealshare w sprawie współpracy B2B.",
  alternates: {
    canonical: "/kontakt"
  }
};

const contactPeople = [
  { email: "zaneta@dealshare.pl", whatsappHref: "https://wa.me/48500320055", role: "Relacje partnerskie & operacje" },
  { email: "michal@dealshare.pl", whatsappHref: "https://wa.me/48694942645", role: "Strategia & finanse" },
  { email: "piotr@dealshare.pl", whatsappHref: "https://wa.me/48512782456", role: "Wdrożenia & technologie" }
];

export default function ContactPage() {
  return (
    <main>
      <section className="hero-dark-base py-20 text-white">
        <Container>
          <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">Kontakt</p>
          <h1 className="heading-title-enter mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Opisz potrzebę firmy. Sprawdzimy właściwy kierunek.</h1>
          <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Napisz, czego szukasz, co chcesz usprawnić albo jakie rozwiązanie możesz dostarczyć innym firmom.
          </p>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading title="Dane kontaktowe" description="Możesz od razu opisać potrzebę w formularzu albo skorzystać z poniższych kanałów kontaktu." />
              <div className="mt-8 grid gap-3.5 text-sm leading-7 text-slate-700">
                {contactPeople.map((person, index) => (
                  <div key={person.email} className={`card-glass soft-lift reveal-on-scroll ${index > 0 ? `reveal-delay-${index}` : ""} group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-card`}>
                    <Image
                      src="/sygnet.png"
                      alt=""
                      width={80}
                      height={80}
                      className="pointer-events-none absolute bottom-5 right-5 h-16 w-16 object-contain opacity-[0.08] transition duration-300 group-hover:scale-105 group-hover:opacity-[0.16] sm:h-18 sm:w-18"
                      style={{ position: "absolute", right: "1.25rem", bottom: "1.25rem" }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 pr-20">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{person.role}</p>
                      <Link href={`mailto:${person.email}`} className="mt-1.5 flex w-fit items-center gap-2.5 font-black text-navy transition hover:text-electric">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan/10 text-sm font-black leading-none text-teal">@</span>
                        <span className="break-all text-base">{person.email}</span>
                      </Link>
                      <Link href={person.whatsappHref} target="_blank" rel="noreferrer" className="mt-2 flex w-fit items-center gap-2.5 font-bold text-slate-600 transition hover:text-teal">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal/10">
                          <Image src="/whatsapp-icon.svg" alt="" width={16} height={16} className="h-4 w-4" />
                        </span>
                        <span className="text-sm">Napisz na WhatsApp →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="reveal-on-scroll reveal-delay-2 mt-8">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Social media</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {siteConfig.socials.map((item) => (
                    <Link key={item.label} href={item.href} className="soft-lift !inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy shadow-sm transition hover:border-cyan/50 hover:bg-cyan/5 hover:text-navy">
                      {item.icon ? <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" /> : null}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card-glass soft-lift reveal-on-scroll reveal-delay-3 group relative isolate mt-8 overflow-hidden rounded-lg border border-cyan/35 bg-navy-gradient p-6 text-white shadow-glow transition duration-300 hover:shadow-card">
                <Image
                  src="/sygnet-white.png"
                  alt=""
                  width={90}
                  height={90}
                  className="pointer-events-none absolute -bottom-4 -right-4 z-0 h-24 w-24 object-contain opacity-10 transition group-hover:opacity-15"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">DLA DOSTAWCÓW I PARTNERÓW</p>
                  <h2 className="mt-3 text-xl font-black text-white">Masz ofertę B2B?</h2>
                  <p className="mt-2 text-sm leading-7 text-white/76">
                    Jeśli chcesz zaprezentować swoje rozwiązanie firmom na platformie, opisz krótko kategorię, profil klienta i model współpracy.
                  </p>
                  <div className="mt-5">
                    <Link href="/dla-partnerow" className="button-glass inline-flex items-center rounded-md border border-cyan/30 bg-cyan px-5 py-2.5 text-sm font-black text-navy shadow-sm transition hover:bg-teal hover:text-white">
                      Przejdź do formularza dla partnerów →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll reveal-delay-1">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
