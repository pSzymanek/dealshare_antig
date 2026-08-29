import Link from "next/link";

export function BlogFloatingNav() {
  return (
    <nav aria-label="Szybka nawigacja bloga" className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      <div className="flex h-28 w-28 flex-col rounded-full border border-white/70 bg-white/90 p-1 shadow-[0_18px_50px_rgba(0,31,77,0.24)] backdrop-blur sm:h-32 sm:w-32">
        <Link
          href="/blog"
          className="relative z-10 flex flex-1 items-center justify-center rounded-t-full border-b border-navy/10 bg-white px-3 text-center text-[0.68rem] font-black leading-tight text-navy transition duration-200 hover:z-20 hover:scale-[1.04] hover:bg-cyan hover:text-navy hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric sm:text-xs"
        >
          Powrót na blog
        </Link>
        <Link
          href="/"
          className="relative z-10 flex flex-1 items-center justify-center rounded-b-full bg-cyan px-3 text-center text-[0.68rem] font-black leading-tight text-navy transition duration-200 hover:z-20 hover:scale-[1.04] hover:bg-electric hover:text-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric sm:text-xs"
        >
          Strona główna
        </Link>
      </div>
    </nav>
  );
}
