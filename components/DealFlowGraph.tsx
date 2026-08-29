"use client";

import type { CSSProperties } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import styles from "./DealFlowGraph.module.css";

type Side = "top" | "right" | "bottom" | "left";
type Tone = "cyan" | "magenta" | "mixed";

type Point = {
  x: number;
  y: number;
};

type BeamPath = {
  id: string;
  d: string;
  start: Point;
  end: Point;
  tone: Tone;
  delay: number;
  duration: number;
};

type GraphLayout = {
  width: number;
  height: number;
  paths: BeamPath[];
  joints: Point[];
};

type Connection = {
  id: string;
  from: string;
  to: string;
  fromSide: Side;
  toSide: Side;
  tone: Tone;
  delay: number;
};

const needs = [
  "Finansowanie",
  "Obniżenie kosztów",
  "Partner biznesowy",
  "Kontrakt / sprzedaż",
  "Prawo i restrukturyzacja",
  "Technologia / inwestycja",
  "Inna potrzeba"
];

const steps = [
  { number: "01", title: "Poznajemy", text: "Cel, sytuację i ograniczenia firmy." },
  { number: "02", title: "Analizujemy", text: "Kontekst i właściwy kierunek działania." },
  { number: "03", title: "Szukamy", text: "W sieci Dealshare albo aktywnie na rynku." },
  { number: "04", title: "Dobieramy", text: "Partnera, warunki i sens rozmowy." },
  { number: "05", title: "Łączymy", text: "Strony z opisanym kontekstem i kolejnym krokiem." }
];

const sources = [
  { id: "network", title: "Sieć Dealshare", text: "Partnerzy i rozwiązania, które już znamy.", tone: "cyan" as const },
  { id: "market", title: "Rynek / nowi partnerzy", text: "Poszukiwanie pod konkretną potrzebę.", tone: "magenta" as const }
];

const emptyLayout: GraphLayout = {
  width: 1,
  height: 1,
  paths: [],
  joints: []
};

function anchorPoint(element: HTMLElement, container: DOMRect, side: Side): Point {
  const rect = element.getBoundingClientRect();
  const left = rect.left - container.left;
  const top = rect.top - container.top;

  if (side === "left") return { x: left, y: top + rect.height / 2 };
  if (side === "right") return { x: left + rect.width, y: top + rect.height / 2 };
  if (side === "top") return { x: left + rect.width / 2, y: top };
  return { x: left + rect.width / 2, y: top + rect.height };
}

function connectionPath(start: Point, end: Point, fromSide: Side, toSide: Side): string {
  const horizontal = fromSide === "left" || fromSide === "right";

  if (horizontal) {
    const distance = Math.max(28, Math.abs(end.x - start.x) * 0.48);
    const startControlX = start.x + (fromSide === "right" ? distance : -distance);
    const endControlX = end.x + (toSide === "left" ? -distance : distance);
    return `M ${start.x} ${start.y} C ${startControlX} ${start.y}, ${endControlX} ${end.y}, ${end.x} ${end.y}`;
  }

  const distance = Math.max(28, Math.abs(end.y - start.y) * 0.48);
  const startControlY = start.y + (fromSide === "bottom" ? distance : -distance);
  const endControlY = end.y + (toSide === "top" ? -distance : distance);
  return `M ${start.x} ${start.y} C ${start.x} ${startControlY}, ${end.x} ${endControlY}, ${end.x} ${end.y}`;
}

function uniqueJoints(paths: BeamPath[]): Point[] {
  const points = new Map<string, Point>();

  for (const path of paths) {
    for (const point of [path.start, path.end]) {
      points.set(`${Math.round(point.x)}:${Math.round(point.y)}`, point);
    }
  }

  return [...points.values()];
}

function gradientStops(tone: Tone) {
  if (tone === "cyan") {
    return [
      { offset: "0%", color: "#006f86", opacity: 0.08 },
      { offset: "48%", color: "#00d1d1", opacity: 1 },
      { offset: "100%", color: "#67e8f9", opacity: 0.18 }
    ];
  }

  if (tone === "magenta") {
    return [
      { offset: "0%", color: "#7e22ce", opacity: 0.08 },
      { offset: "48%", color: "#d946ef", opacity: 1 },
      { offset: "100%", color: "#f0abfc", opacity: 0.18 }
    ];
  }

  return [
    { offset: "0%", color: "#00d1d1", opacity: 0.1 },
    { offset: "52%", color: "#00d1d1", opacity: 1 },
    { offset: "82%", color: "#d946ef", opacity: 0.95 },
    { offset: "100%", color: "#d946ef", opacity: 0.12 }
  ];
}

export function DealFlowGraph({ className = "" }: { className?: string }) {
  const graphId = useId().replaceAll(":", "");
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const [layout, setLayout] = useState<GraphLayout>(emptyLayout);

  function registerNode(id: string, node: HTMLElement | null) {
    if (node) {
      nodeRefs.current.set(id, node);
    } else {
      nodeRefs.current.delete(id);
    }
  }

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame = 0;

    const measure = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const desktop = containerRect.width >= 1100;
        const vertical = containerRect.width < 768;
        const connections: Connection[] = [
          ...needs.map((_, index) => ({
            id: `need-${index}-to-step-0`,
            from: `need-${index}`,
            to: "step-0",
            fromSide: desktop ? ("right" as const) : ("bottom" as const),
            toSide: desktop ? ("left" as const) : ("top" as const),
            tone: index % 3 === 2 ? ("magenta" as const) : ("cyan" as const),
            delay: index * -0.42
          })),
          ...steps.slice(0, -1).map((_, index) => ({
            id: `step-${index}-to-step-${index + 1}`,
            from: `step-${index}`,
            to: `step-${index + 1}`,
            fromSide: vertical ? ("bottom" as const) : ("right" as const),
            toSide: vertical ? ("top" as const) : ("left" as const),
            tone: index < 2 ? ("cyan" as const) : ("mixed" as const),
            delay: -0.8 - index * 0.55
          })),
          ...sources.map((source, index) => ({
            id: `${source.id}-to-step-2`,
            from: `source-${source.id}`,
            to: "step-2",
            fromSide: "top" as const,
            toSide: "bottom" as const,
            tone: source.tone,
            delay: -1.25 - index * 0.7
          })),
          {
            id: "step-4-to-result",
            from: "step-4",
            to: "result",
            fromSide: desktop ? ("right" as const) : ("bottom" as const),
            toSide: desktop ? ("left" as const) : ("top" as const),
            tone: "mixed" as const,
            delay: -2.1
          }
        ];

        const paths = connections.flatMap<BeamPath>((connection, index) => {
          const from = nodeRefs.current.get(connection.from);
          const to = nodeRefs.current.get(connection.to);
          if (!from || !to) return [];

          const start = anchorPoint(from, containerRect, connection.fromSide);
          const end = anchorPoint(to, containerRect, connection.toSide);

          return [
            {
              id: connection.id,
              d: connectionPath(start, end, connection.fromSide, connection.toSide),
              start,
              end,
              tone: connection.tone,
              delay: connection.delay,
              duration: 4.4 + (index % 4) * 0.45
            }
          ];
        });

        setLayout({
          width: Math.max(1, containerRect.width),
          height: Math.max(1, containerRect.height),
          paths,
          joints: uniqueJoints(paths)
        });
      });
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    nodeRefs.current.forEach((node) => resizeObserver.observe(node));
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    measure();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${styles.graph} ${className}`} aria-label="Proces działania Dealshare">
      <svg className={styles.canvas} viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <filter id={`${graphId}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {layout.paths.map((path) => (
            <linearGradient
              key={`${path.id}-gradient`}
              id={`${graphId}-${path.id}-gradient`}
              gradientUnits="userSpaceOnUse"
              x1={path.start.x}
              y1={path.start.y}
              x2={path.end.x}
              y2={path.end.y}
            >
              {gradientStops(path.tone).map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
              ))}
            </linearGradient>
          ))}
        </defs>

        <g className={styles.basePaths}>
          {layout.paths.map((path) => (
            <path key={`${path.id}-base`} d={path.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g filter={`url(#${graphId}-glow)`}>
          {layout.paths.map((path) => (
            <path
              key={`${path.id}-beam`}
              className={styles.beam}
              d={path.d}
              pathLength="1"
              stroke={`url(#${graphId}-${path.id}-gradient)`}
              vectorEffect="non-scaling-stroke"
              style={
                {
                  "--beam-delay": `${path.delay}s`,
                  "--beam-duration": `${path.duration}s`
                } as CSSProperties
              }
            />
          ))}
        </g>

        <g className={styles.joints}>
          {layout.joints.map((joint) => (
            <circle key={`${Math.round(joint.x)}-${Math.round(joint.y)}`} cx={joint.x} cy={joint.y} r="3" vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>

      <div className={styles.inputs}>
        <p className={styles.label}>Potrzeby firm</p>
        <div className={styles.inputList}>
          {needs.map((need, index) => (
            <div key={need} ref={(node) => registerNode(`need-${index}`, node)} className={styles.inputNode}>
              <span aria-hidden="true" />
              <strong>{need}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.process}>
        <div className={styles.processHeading}>
          <p className={styles.label}>Proces Dealshare</p>
          <p>Od rozpoznania sytuacji, do konkretnego działania.</p>
        </div>

        <div className={styles.pipeline}>
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(node) => registerNode(`step-${index}`, node)}
              className={`${styles.stepNode} ${styles[`step${index + 1}`]}`}
            >
              <span>{step.number}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          ))}

          <div className={styles.sources}>
            <p className={styles.sourceLabel}>Źródła dopasowania</p>
            <div className={styles.sourceGrid}>
              {sources.map((source) => (
                <div
                  key={source.id}
                  ref={(node) => registerNode(`source-${source.id}`, node)}
                  className={`${styles.sourceNode} ${source.tone === "magenta" ? styles.sourceMagenta : ""}`}
                >
                  <strong>{source.title}</strong>
                  <p>{source.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.resultArea}>
        <p className={styles.label}>Rezultat</p>
        <div ref={(node) => registerNode("result", node)} className={styles.resultNode}>
          <span className={styles.resultLight} aria-hidden="true" />
          <strong>Gotowe rozwiązanie.</strong>
          <p>Właściwa strona, opisany kontekst, uzgodniony zakres i następny krok.</p>
        </div>
      </div>
    </div>
  );
}
