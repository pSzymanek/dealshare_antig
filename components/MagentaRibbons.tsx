"use client";

import { useEffect, useRef } from "react";

type MagentaRibbonsProps = {
  className?: string;
  variant?: "hero" | "secondary";
};

type Ribbon = {
  base: number;
  amplitude: number;
  phase: number;
  speed: number;
  width: number;
  colors: [string, string];
};

const ribbons: Ribbon[] = [
  {
    base: 0.2,
    amplitude: 0.17,
    phase: 0.2,
    speed: 0.2,
    width: 0.1,
    colors: ["255, 32, 188", "255, 64, 236"]
  },
  {
    base: 0.52,
    amplitude: 0.2,
    phase: 2.35,
    speed: -0.16,
    width: 0.075,
    colors: ["240, 36, 202", "186, 55, 255"]
  },
  {
    base: 0.83,
    amplitude: 0.15,
    phase: 4.4,
    speed: 0.13,
    width: 0.055,
    colors: ["255, 38, 171", "224, 62, 255"]
  }
];

export function MagentaRibbons({ className = "", variant = "hero" }: MagentaRibbonsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrame = 0;
    let isVisible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawRibbon = (ribbon: Ribbon, index: number, time: number) => {
      const variantOffset = variant === "secondary" ? Math.PI * 0.78 : 0;
      const phase = time * ribbon.speed + ribbon.phase + variantOffset;
      const y = height * (variant === "secondary" ? 1 - ribbon.base : ribbon.base);
      const amplitude = height * ribbon.amplitude;
      const points = [-0.14, 0.12, 0.36, 0.61, 0.87, 1.14].map((x, pointIndex) => ({
        x: width * x,
        y: y + Math.sin(phase + pointIndex * 1.14) * amplitude * (pointIndex % 2 === 0 ? 0.92 : 1.16)
      }));
      const path = new Path2D();

      path.moveTo(points[0].x, points[0].y);
      for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex += 1) {
        const point = points[pointIndex];
        const nextPoint = points[pointIndex + 1];
        path.quadraticCurveTo(point.x, point.y, (point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2);
      }
      const finalPoint = points.at(-1);
      const finalControlPoint = points.at(-2);
      if (finalPoint && finalControlPoint) {
        path.quadraticCurveTo(finalControlPoint.x, finalControlPoint.y, finalPoint.x, finalPoint.y);
      }

      const gradient = context.createLinearGradient(-width * 0.1, 0, width * 1.1, 0);
      gradient.addColorStop(0, `rgba(${ribbon.colors[0]}, 0)`);
      gradient.addColorStop(0.18, `rgba(${ribbon.colors[0]}, 0.52)`);
      gradient.addColorStop(0.53, `rgba(${ribbon.colors[1]}, 0.6)`);
      gradient.addColorStop(0.82, `rgba(${ribbon.colors[0]}, 0.46)`);
      gradient.addColorStop(1, `rgba(${ribbon.colors[1]}, 0)`);

      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = gradient;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = Math.max(30, height * ribbon.width);
      context.shadowColor = `rgba(${ribbon.colors[0]}, 0.48)`;
      context.shadowBlur = Math.max(24, height * 0.055);
      context.filter = `blur(${Math.max(9, height * 0.016)}px)`;
      context.globalAlpha = index === 1 ? 0.42 : 0.32;
      context.stroke(path);

      context.lineWidth = Math.max(2, height * 0.006);
      context.shadowBlur = Math.max(12, height * 0.022);
      context.filter = "none";
      context.globalAlpha = index === 1 ? 0.56 : 0.44;
      context.stroke(path);
      context.restore();
    };

    const draw = (timestamp: number) => {
      frameId = window.requestAnimationFrame(draw);
      if (!isVisible || (!reducedMotion && timestamp - lastFrame < 33)) {
        return;
      }

      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);
      const time = reducedMotion ? 0 : timestamp / 1000;
      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, index, time));

      if (reducedMotion) {
        window.cancelAnimationFrame(frameId);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });

    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    resize();
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
