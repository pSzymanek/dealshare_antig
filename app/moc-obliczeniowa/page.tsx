import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedStatValue } from "@/components/AnimatedStatValue";
import { Container } from "@/components/Container";
import { ScrollCue } from "@/components/ScrollCue";

const marketStats = [
  {
    target: 26.5,
    suffix: "%",
    decimals: 1,
    label: "CAGR rynku GPUaaS 2025-2030",
    source: "MarketsandMarkets [3]"
  },
  {
    target: 3,
    prefix: "~",
    suffix: "x",
    label: "popytu na capacity data center do 2030",
    source: "McKinsey [1]"
  },
  {
    target: 6.7,
    prefix: "~$",
    suffix: "T",
    decimals: 1,
    label: "globalny CAPEX data center do 2030",
    source: "McKinsey [2]"
  },
  {
    target: 500,
    suffix: " MW+",
    label: "możliwa moc data center w Polsce w 2030",
    source: "PAIH / PLDCA [5]"
  }
];

const reasons = [
  "Popyt: AI, rendering, automatyzacja, analityka i HPC tworzą zapotrzebowanie na moc GPU.",
  "Podaż: obiekty wymagają energii, chłodzenia, sprzętu, przyłączy i kompetencji.",
  "Sprzedaż: najemca kupuje dostęp do mocy bez własnego CAPEX-u i rekrutacji technicznej."
];

const revenueModel = [
  {
    step: "1",
    title: "Kapitał",
    text: "alokacja w jednostkę lub pakiet"
  },
  {
    step: "2",
    title: "Sprzęt i hosting",
    text: "zasilanie, chłodzenie, obsługa"
  },
  {
    step: "3",
    title: "Monetyzacja",
    text: "sprzedaż mocy AI/HPC/rendering"
  },
  {
    step: "4",
    title: "Cashflow",
    text: "czynsz / udział / abonament"
  }
];

const checklist = [
  "Profil: kapitał 3-5 lat, akceptacja ryzyka, cashflow.",
  "Ryzyka: technologia, rynek, energia, operator.",
  "Ograniczanie: serwis, ubezpieczenie, kontrakty, raportowanie.",
  "Sprawdź: sprzęt, własność, VAT, uptime, wyjście, zabezpieczenia."
];

const financialScenarios = [
  {
    variant: "Start",
    capital: "220 000 zł",
    monthly: "6 400 zł",
    fiveYears: "384 000 zł",
    payback: "ok. 34 mies.",
    yearly: "34.9%"
  },
  {
    variant: "Core",
    capital: "300 000 zł",
    monthly: "9 600 zł",
    fiveYears: "576 000 zł",
    payback: "ok. 31 mies.",
    yearly: "38.4%"
  },
  {
    variant: "Prime",
    capital: "420 000 zł",
    monthly: "14 200 zł",
    fiveYears: "852 000 zł",
    payback: "ok. 30 mies.",
    yearly: "40.6%"
  }
];

export const metadata: Metadata = {
  title: "Moc obliczeniowa jako aktywo infrastrukturalne",
  description: "AI Compute Infrastructure: karta informacyjna o mocy obliczeniowej, GPU, hostingu i modelu potencjalnego cashflow.",
  alternates: {
    canonical: "/moc-obliczeniowa"
  }
};

export default function ComputePowerLandingPage() {
  return (
    <main className="bg-white text-ink">
      <section className="relative overflow-hidden bg-[#041127] py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,209,209,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(0,209,209,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan/40" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-1/2 w-2/3 bg-[radial-gradient(circle_at_80%_100%,rgba(0,91,255,0.32),transparent_56%)]" />
        <Container className="relative">
          <div className="reveal-on-scroll flex items-center justify-between gap-4 border-b border-white/12 pb-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan">AI Compute Infrastructure</p>
            <Image src="/sygnet-white.png" alt="" width={52} height={52} className="h-11 w-11 opacity-80" />
          </div>

          <div className="pt-10">
            <div className="max-w-5xl">
              <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.2em] text-white/48">Informator inwestycyjny</p>
              <h1 className="heading-title-enter mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Moc obliczeniowa jako aktywo infrastrukturalne
              </h1>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div className="reveal-on-scroll reveal-delay-1 border-l-2 border-cyan pl-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">Teza</p>
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  Kapitał finansuje zasób, którego rynek AI potrzebuje już teraz.
                </h2>
              </div>
              <div className="reveal-on-scroll reveal-delay-2">
                <p className="max-w-3xl text-lg leading-8 text-white/76">
                  Rynek AI potrzebuje fizycznego zaplecza: GPU, hostingu, energii, chłodzenia, sieci i sprawnego operatora. Model pokazuje,
                  jak kapitał może finansować zasób, którego rynek płaci za dostęp.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/dealshare_informator_gpu.pdf"
                    download
                    className="button-glass relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-6 py-3 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-card"
                  >
                    Pobierz szczegółowy informator
                  </a>
                  <a
                    href="#scenariusze"
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/12"
                  >
                    Zobacz model poglądowy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <ScrollCue targetId="compute-market-stats" />
      </section>

      <section id="compute-market-stats" className="border-b border-slate-200 bg-mist py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketStats.map((stat, index) => (
              <article key={stat.label} className={`reveal-on-scroll rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : index === 3 ? "reveal-delay-3" : ""}`}>
                <p className="text-3xl font-black tracking-tight text-electric">
                  <AnimatedStatValue
                    target={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    delay={index * 520}
                    duration={1300}
                  />
                </p>
                <p className="mt-3 text-sm font-black leading-6 text-navy">{stat.label}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">{stat.source}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="heading-title-enter">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Dlaczego to ma sens</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-navy sm:text-4xl">AI nie skaluje się wyłącznie przez software.</h2>
            </div>
            <div className="grid gap-4">
              {reasons.map((reason, index) => (
                <p key={reason} className={`reveal-on-scroll rounded-lg border border-slate-200 bg-white p-5 text-base font-semibold leading-8 text-slate-700 shadow-sm ${index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : ""}`}>
                  {reason}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-16">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="heading-title-enter">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Model przychodu</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-navy sm:text-4xl">Od kapitału do cashflow</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {revenueModel.map((item, index) => (
              <article key={item.step} className={`reveal-on-scroll rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : index === 3 ? "reveal-delay-3" : ""}`}>
                <div className="grid h-11 w-11 place-items-center rounded-full border border-electric/30 bg-electric/5 text-lg font-black text-electric">{item.step}</div>
                <h3 className="mt-5 text-lg font-black text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="reveal-on-scroll rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Profil, ryzyka, checklista</p>
              <ul className="mt-5 grid gap-3 text-sm font-semibold leading-7 text-slate-700">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="reveal-on-scroll reveal-delay-1 rounded-lg border border-electric/20 bg-electric/5 p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-electric">Kolejny krok</p>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-navy">Analiza parametrów konkretnej umowy, sprzętu, operatora i zabezpieczeń.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Szczegółowy informator rozwija kontekst rynku, model najmu mocy obliczeniowej i elementy, które warto sprawdzić przed decyzją.
              </p>
              <a
                href="/dealshare_informator_gpu.pdf"
                download
                className="button-glass relative isolate mt-6 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-5 py-3 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Pobierz szczegółowy informator
              </a>
            </article>
          </div>
        </Container>
      </section>

      <section id="scenariusze" className="bg-white pb-16">
        <Container>
          <div className="reveal-on-scroll rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <div className="max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Scenariusze finansowe - model poglądowy</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-navy">Warianty pokazują mechanikę potencjalnego przychodu.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Finalne parametry powinny wynikać z umowy, sprzętu i warunków operacyjnych.
              </p>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <th className="py-3 pr-4">Wariant</th>
                    <th className="px-4 py-3">Kapitał</th>
                    <th className="px-4 py-3">Miesięcznie</th>
                    <th className="px-4 py-3">5 lat</th>
                    <th className="px-4 py-3">Zwrot kapitału</th>
                    <th className="py-3 pl-4">Rocznie brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {financialScenarios.map((scenario) => (
                    <tr key={scenario.variant} className="font-semibold text-slate-700">
                      <td className="py-4 pr-4 text-base font-black text-navy">{scenario.variant}</td>
                      <td className="px-4 py-4">{scenario.capital}</td>
                      <td className="px-4 py-4">{scenario.monthly}</td>
                      <td className="px-4 py-4">{scenario.fiveYears}</td>
                      <td className="px-4 py-4">{scenario.payback}</td>
                      <td className="py-4 pl-4 text-electric">{scenario.yearly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-xs font-semibold leading-6 text-slate-500">
              Uwaga: wszystkie symulacje finansowe mają charakter poglądowy. Nie stanowią gwarancji zysku, rekomendacji inwestycyjnej ani oferty publicznej.
              Rzeczywisty wynik zależy od umowy, kosztów, podatków, uptime, sprzedaży mocy, waluty, sprzętu i ryzyka operatora.
            </p>
            <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">
              Źródła skrócone: [1][2] McKinsey / Data Center Dynamics, [3] MarketsandMarkets, [4] Atman / PMR, [5] PAIH / PLDCA, [6] publiczne benchmarki stawek GPU cloud.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
