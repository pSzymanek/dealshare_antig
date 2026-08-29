import { Button } from "@/components/Button";
import type { BlogCtaVariant } from "@/lib/blog";

type BlogCtaProps = {
  variant: BlogCtaVariant;
};

const ctaCopy: Record<BlogCtaVariant, { title: string; description: string; button: string; href: string }> = {
  finansowanie: {
    title: "Zanim złożysz wniosek, sprawdź sytuację firmy",
    description: "Zbierzmy dane finansowe, zobowiązania i raporty BIK, aby wstępnie ocenić możliwe kierunki finansowania i potrzebne dokumenty.",
    button: "Przejdź do wstępnej analizy",
    href: "/oferty/kredyty-dla-firm"
  },
  restrukturyzacja: {
    title: "Im wcześniej pojawią się liczby, tym więcej zostaje możliwości",
    description: "Uporządkuj listę wierzycieli, egzekucje i przepływy. Sprawa może następnie zostać oceniona z udziałem właściwego specjalisty restrukturyzacyjnego.",
    button: "Omów sytuację firmy",
    href: "/oferty/restrukturyzacje"
  },
  "analiza-umowy": {
    title: "Umowę trzeba ocenić razem z historią rozliczeń",
    description: "Przygotuj umowę, aneksy, harmonogramy i historię spłat. Wstępna analiza wskaże, czy istnieją podstawy do dalszych działań.",
    button: "Sprawdź wymagane dokumenty",
    href: "/oferty/sankcja-kredytu-darmowego"
  },
  energia: {
    title: "Przygotuj projekt do rozmowy o finansowaniu",
    description: "Uporządkuj status gruntu, przyłączenia, pozwolenia, model finansowy i data room, aby rozmawiać z inwestorem lub finansującym na konkretnych danych.",
    button: "Omów projekt",
    href: "/oferty/optymalizacja-kosztow-energii"
  },
  kontakt: {
    title: "Porozmawiajmy o możliwym kolejnym kroku",
    description: "Opisz sytuację firmy, a pomożemy ustalić, czy Dealshare może połączyć Cię z właściwym rozwiązaniem.",
    button: "Opisz potrzebę",
    href: "/kontakt#formularz"
  }
};

export function BlogCta({ variant }: BlogCtaProps) {
  const copy = ctaCopy[variant];

  return (
    <section className="rounded-lg border border-electric/15 bg-gradient-to-br from-navy to-[#073b70] p-6 text-white shadow-glow sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Następny krok</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">{copy.description}</p>
      <p className="mt-4 max-w-2xl text-xs leading-6 text-white/58">
        Kontakt i przekazanie dokumentów nie oznaczają gwarancji finansowania, rozstrzygnięcia prawnego ani zawarcia transakcji. Zakres dalszych działań zależy od analizy konkretnej sprawy.
      </p>
      <div className="mt-6">
        <Button href={copy.href} variant="cyan">
          {copy.button}
        </Button>
      </div>
    </section>
  );
}
