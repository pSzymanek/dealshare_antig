import { Button } from "./Button";
import { Container } from "./Container";

type CTASectionProps = {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
};

export function CTASection({ title, description, buttonLabel, buttonHref }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden border-y border-cyan/15 bg-[#020711] py-20 text-white">
      <Container>
        <div className="reveal-on-scroll reveal-delay-1 relative border-l border-cyan/70 px-6 py-5 shadow-[inset_16px_0_40px_rgba(0,209,209,0.035)] sm:px-10 lg:px-14">
          <div className="cta-mark-bg" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
            {description ? <p className="mt-4 text-base leading-8 text-white/72">{description}</p> : null}
            <div className="mt-8">
              <Button href={buttonHref} variant="cyan">
                {buttonLabel} →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
