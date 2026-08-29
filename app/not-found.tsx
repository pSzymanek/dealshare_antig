import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <main className="bg-white py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">404</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy">Nie znaleziono strony.</h1>
          <p className="mt-4 text-slate-600">Adres jest nieaktywny albo treść została przeniesiona.</p>
          <Link href="/" className="mt-8 inline-flex rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white">
            Wróć na start
          </Link>
        </div>
      </Container>
    </main>
  );
}
