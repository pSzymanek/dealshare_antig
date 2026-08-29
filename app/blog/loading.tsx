import { Container } from "@/components/Container";

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="aspect-[16/9] animate-pulse rounded-md bg-slate-200" />
      <div className="mt-5 h-3 w-28 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

export default function BlogLoading() {
  return (
    <main>
      <section className="bg-navy-gradient py-20 text-white">
        <Container>
          <div className="h-4 w-24 animate-pulse rounded bg-cyan/40" />
          <div className="mt-5 h-12 max-w-3xl animate-pulse rounded bg-white/18" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse rounded bg-white/12" />
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="h-5 w-36 animate-pulse rounded bg-teal/20" />
          <div className="mt-4 h-9 w-60 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
