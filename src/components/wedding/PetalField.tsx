import { useEffect, useMemo, useState } from "react";

interface Petal {
  id: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  blur: number;
  opacity: number;
  drift: number;
  rotation: number;
  tone: "rose" | "gold" | "blush";
}

const sample = (seed: number) => {
  const n = Math.sin(seed * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

const PetalShape = ({ petal }: { petal: Petal }) => (
  <svg viewBox="0 0 32 32" width={petal.size} height={petal.size} aria-hidden="true" className={`petal-${petal.tone}`}>
    <defs>
      <linearGradient id={`petal-${petal.id}`} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" className="petal-stop-top" />
        <stop offset="60%" className="petal-stop-mid" />
        <stop offset="100%" className="petal-stop-bottom" />
      </linearGradient>
    </defs>
    <path d="M16 2 C22 6 28 12 26 22 C24 28 18 30 16 30 C14 30 8 28 6 22 C4 12 10 6 16 2 Z" fill={`url(#petal-${petal.id})`} />
  </svg>
);

const Field = ({ count, layer }: { count: number; layer: "bg" | "fg" }) => {
  const isBg = layer === "bg";
  const petals = useMemo<Petal[]>(() => Array.from({ length: count }, (_, i) => {
    const seed = i + (isBg ? 100 : 0);
    const tones = ["rose", "gold", "blush"] as const;
    return {
      id: `${layer}-${i}`,
      left: sample(seed + 1) * 100,
      delay: sample(seed + 2) * 14,
      duration: isBg ? 22 + sample(seed + 3) * 15 : 10 + sample(seed + 3) * 12,
      size: isBg ? 26 + sample(seed + 4) * 30 : 10 + sample(seed + 4) * 18,
      blur: isBg ? 2 + sample(seed + 5) * 3 : sample(seed + 5) < 0.25 ? sample(seed + 6) * 1.2 : 0,
      opacity: isBg ? 0.2 + sample(seed + 6) * 0.2 : 0.55 + sample(seed + 6) * 0.3,
      drift: (sample(seed + 7) < 0.5 ? -1 : 1) * (40 + sample(seed + 8) * 140),
      rotation: 360 + sample(seed + 9) * 540,
      tone: tones[Math.floor(sample(seed + 10) * tones.length)] ?? "rose",
    };
  }), [count, isBg, layer]);

  if (count === 0) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[${isBg ? "1" : "60"}] overflow-hidden`}>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-fall absolute top-0"
          style={{
            left: `${petal.left}%`,
            filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
            "--drift": `${petal.drift}px`,
            "--rotation": `${petal.rotation}deg`,
          } as React.CSSProperties}
        >
          <PetalShape petal={petal} />
        </div>
      ))}
    </div>
  );
};

export const PetalField = ({ density = 18 }: { density?: number }) => {
  const [counts, setCounts] = useState({ bg: Math.round(density * 0.6), fg: density });

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setCounts({ bg: 0, fg: 0 });
    else if (isMobile) setCounts({ bg: Math.floor(density * 0.35), fg: Math.floor(density / 2) });
  }, [density]);

  return (
    <>
      <Field count={counts.bg} layer="bg" />
      <Field count={counts.fg} layer="fg" />
    </>
  );
};