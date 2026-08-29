const words = ["Możliwości", "Biznes", "Oferty", "Partnerzy", "Kontrakty", "Rozwój"];

export function HeroRotatingWord() {
  return (
    <span className="hero-word-rotator" aria-label={words.join(", ")}>
      {words.map((word, index) => (
        <span key={word} style={{ animationDelay: `${index * 2.2}s` }}>
          {word}
        </span>
      ))}
    </span>
  );
}
