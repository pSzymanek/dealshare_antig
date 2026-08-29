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
  { email: "zaneta@dealshare.pl", whatsappHref: "https://wa.me/48500320055" },
  { email: "michal@dealshare.pl", whatsappHref: "https://wa.me/48694942645" },
  { email: "piotr@dealshare.pl", whatsappHref: "https://wa.me/48512782456" }
];

export default function ContactPage() {
  return (
    <main>
      <section className="bg-navy-gradient py-20 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Kontakt</p>
          <h1 className="heading-title-enter mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Opisz potrzebę firmy. Sprawdzimy właściwy kierunek.</h1>
          <p className="heading-copy-enter mt-6 max-w-2xl text-lg leading-8 text-white/74">
            Napisz, czego szukasz, co chcesz usprawnić albo jakie rozwiązanie możesz dostarczyć innym firmom.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading title="Dane kontaktowe" description="Możesz od razu opisać potrzebę w formularzu albo skorzystać z poniższych kanałów kontaktu." />
              <div className="mt-8 grid gap-4 text-sm leading-7 text-slate-700">
                {contactPeople.map((person) => (
                  <div key={person.email} className="soft-lift rounded-md border border-slate-200 bg-white p-5 transition hover:border-electric/40 hover:shadow-card">
                    <Link href={`mailto:${person.email}`} className="flex w-fit items-center gap-3 font-black text-navy transition hover:text-electric">
                      <span className="grid h-7 w-7 shrink-0 place-items-center text-base font-black leading-none text-teal">@</span>
                      <span className="break-all">{person.email}</span>
                    </Link>
                    <Link href={person.whatsappHref} target="_blank" rel="noreferrer" className="mt-3 flex w-fit items-center gap-3 font-black text-navy transition hover:text-teal">
                      <span className="grid h-7 w-7 shrink-0 place-items-center">
                        <Image src="/whatsapp-icon.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                      </span>
                      <span>Napisz na WhatsApp</span>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Social media</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {siteConfig.socials.map((item) => (
                    <Link key={item.label} href={item.href} className="soft-lift !inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-navy transition hover:border-electric hover:bg-electric/5 hover:text-electric">
                      {item.icon ? <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" /> : null}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="card-glass soft-lift mt-8 rounded-lg border border-electric/20 bg-electric/5 p-5 hover:border-electric/30 hover:shadow-card">
                <Image src="/sygnet.png" alt="" width={42} height={42} className="mb-4" />
                <h2 className="text-lg font-black text-navy">Dla firm z ofertą B2B</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Jeśli chcesz zaprezentować swoją ofertę przedsiębiorcom, opisz krótko kategorię, profil klienta i model współpracy.
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
