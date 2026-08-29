import Image from "next/image";
import Link from "next/link";
import { CookieConsentLink } from "@/components/CookieConsentLink";
import { siteConfig } from "@/lib/site";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan/20 bg-[#020711] text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="relative">
          <Image src="/logo-dark.png" alt="dealshare" width={480} height={179} className="h-14 w-auto sm:h-16" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/68">
            Przychodzisz z potrzebą, wychodzisz z rozwiązaniem.
          </p>
        </div>
        <div className="relative">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Nawigacja</h2>
          <div className="mt-5 grid gap-3">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Social media</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {siteConfig.socials.map((item) => (
              <Link key={item.label} href={item.href} className="soft-lift !inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded border border-white/15 px-3 py-2 text-sm text-white/75 transition hover:border-cyan hover:bg-white/5 hover:text-white">
                {item.icon ? <Image src={item.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" /> : null}
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-7 grid gap-3">
            <Link href="/polityka-prywatnosci" className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white">
              Regulamin
            </Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} dealshare. Wszystkie prawa zastrzeżone.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <CookieConsentLink />
          </div>
        </Container>
      </div>
    </footer>
  );
}
