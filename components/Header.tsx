import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Button } from "./Button";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-[110] border-b border-slate-200 bg-white/[0.90] text-navy shadow-[0_10px_32px_rgba(0,31,77,0.08)] backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-3 py-2 sm:min-h-24 sm:gap-5 sm:py-3">
        <Link href="/" aria-label="dealshare - strona główna" className="flex items-center">
          <Image src="/logo-main-cropped.png" alt="dealshare" width={343} height={90} priority className="h-12 w-auto sm:h-16 xl:h-[68px]" style={{ width: "auto" }} />
        </Link>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Główna nawigacja">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="relative px-3 py-2 text-sm font-semibold text-navy/72 transition after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-cyan after:shadow-[0_0_8px_rgba(0,209,209,0.65)] after:transition hover:text-navy hover:after:scale-x-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:block">
          <Button href="/kontakt" variant="ghost">
            Porozmawiajmy!
          </Button>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}
