import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Regulamin korzystania z serwisu dealshare.",
  alternates: {
    canonical: "/regulamin"
  }
};

const operator = "Michał Szwankowski, 41-503 Chorzów, ul. Narutowicza 15, NIP: 6272468482";

const sections: Array<{ id?: string; title: string; content: string[] }> = [
  {
    title: "1. Postanowienia ogólne",
    content: [
      "Regulamin określa zasady korzystania z serwisu internetowego dealshare dostępnego pod adresem dealshare.pl.",
      "Serwis ma obecnie charakter informacyjny i prezentacyjny. Służy do przedstawienia informacji o dealshare, ofertach B2B oraz umożliwienia kontaktu przez formularz."
    ]
  },
  {
    title: "2. Operator serwisu",
    content: [
      `Operatorem serwisu jest ${operator}.`,
      "Kontakt z operatorem jest możliwy pod adresem: biuro@dealshare.pl."
    ]
  },
  {
    title: "3. Korzystanie z serwisu",
    content: [
      "Użytkownik może przeglądać treści dostępne w serwisie oraz korzystać z formularza kontaktowego.",
      "Użytkownik zobowiązuje się korzystać z serwisu zgodnie z prawem, dobrymi obyczajami oraz bez naruszania praw osób trzecich."
    ]
  },
  {
    title: "4. Formularz kontaktowy",
    content: [
      "Formularz kontaktowy służy do przesyłania zapytań dotyczących ofert, współpracy biznesowej i kontaktu z dealshare.",
      "W formularzu nie należy przesyłać treści bezprawnych, obraźliwych, naruszających prawa osób trzecich ani informacji poufnych, jeżeli nie zostało to wcześniej uzgodnione z operatorem.",
      "Przesłanie formularza nie oznacza zawarcia umowy ani gwarancji nawiązania współpracy."
    ]
  },
  {
    id: "formularze-i-zgody",
    title: "5. Formularze landing page, załączniki i zgody",
    content: [
      "Formularze dostępne na dedykowanych stronach ofertowych służą do przesłania zgłoszenia, dokumentów i danych kontaktowych potrzebnych do wstępnej analizy sprawy oraz przygotowania odpowiedzi.",
      "Użytkownik może załączyć pliki, w szczególności faktury, umowy, harmonogramy, aneksy albo inne dokumenty związane ze zgłoszeniem. Użytkownik powinien przesyłać wyłącznie dokumenty, do których ma prawo, oraz nie powinien załączać danych osób trzecich, jeżeli nie ma podstawy do ich przekazania.",
      "Załączniki i informacje wpisane w formularzu są wykorzystywane w celu obsługi zgłoszenia, kontaktu z użytkownikiem, oceny możliwości dalszego działania oraz przedstawienia informacji zwrotnej dotyczącej zgłoszonej sprawy.",
      "Warunkiem wysłania formularza landing page jest akceptacja regulaminu oraz wyrażenie zgody na przetwarzanie danych przekazanych w formularzu i załącznikach w celu obsługi zgłoszenia.",
      "Akceptując regulamin przy formularzu, użytkownik wyraża również zgodę na kontakt ze strony Dealshare w sprawie zgłoszenia telefonicznie, mailowo, SMS-em lub przez komunikator, w zależności od danych podanych w formularzu i potrzeb obsługi sprawy.",
      "Zgoda obejmuje wyłącznie kontakt związany ze zgłoszeniem, analizą przekazanych informacji, przedstawieniem kolejnych kroków oraz obsługą sprawy. Przesłanie formularza nie oznacza obowiązku skorzystania z usługi ani zawarcia umowy."
    ]
  },
  {
    title: "6. Charakter informacji w serwisie",
    content: [
      "Informacje publikowane w serwisie mają charakter ogólny, informacyjny i biznesowy.",
      "Treści dostępne w serwisie nie stanowią oferty w rozumieniu Kodeksu cywilnego, chyba że wyraźnie wskazano inaczej."
    ]
  },
  {
    title: "7. Prawa autorskie",
    content: [
      "Treści, grafiki, układ strony, nazwa i elementy identyfikacji wizualnej serwisu mogą podlegać ochronie prawnej.",
      "Kopiowanie, rozpowszechnianie lub wykorzystywanie materiałów z serwisu bez zgody operatora jest zabronione, chyba że przepisy prawa stanowią inaczej."
    ]
  },
  {
    title: "8. Odpowiedzialność",
    content: [
      "Operator dokłada starań, aby informacje w serwisie były aktualne i rzetelne, ale nie gwarantuje, że każda informacja będzie kompletna albo wolna od błędów.",
      "Operator nie ponosi odpowiedzialności za działanie zewnętrznych serwisów, do których prowadzą linki umieszczone na stronie, w tym serwisów społecznościowych."
    ]
  },
  {
    title: "9. Reklamacje i kontakt",
    content: [
      "Uwagi dotyczące działania serwisu można zgłaszać na adres: biuro@dealshare.pl.",
      "Zgłoszenie powinno zawierać opis sprawy oraz dane kontaktowe umożliwiające udzielenie odpowiedzi."
    ]
  },
  {
    title: "10. Zmiany regulaminu",
    content: [
      "Regulamin może zostać zmieniony w przypadku rozwoju serwisu, wdrożenia nowych funkcji, uruchomienia newslettera, kont użytkowników, panelu ofert albo innych usług."
    ]
  }
];

export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="bg-navy-gradient py-20 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Dokumenty</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Regulamin serwisu</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">Ostatnia aktualizacja: 13 lipca 2026 r.</p>
        </Container>
      </section>
      <section className="py-16">
        <Container className="max-w-4xl">
          <div className="article-content">
            {sections.map((section) => (
              <section key={section.title} id={section.id}>
                <h2>{section.title}</h2>
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
