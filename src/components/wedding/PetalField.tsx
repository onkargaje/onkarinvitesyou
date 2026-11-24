import { useEffect, useMemo, useState } from "react";

interface Petal {
  id: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
  rotation: number;
  tone: "rose" | "gold" | "blush";
}

const sample = (seed: number) => {
  const n = Math.sin(seed * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

const toneColors = {
  rose: { top: "#f8d0d8", mid: "#e07a94", bottom: "#c44d6d" },
  gold: { top: "#faecc8", mid: "#e4be73", bottom: "#b88a3a" },
  blush: { top: "#fde8ec", mid: "#f0b4c0", bottom: "#d97d91" },
} as const;

const PetalShape = ({ petal }: { petal: Petal }) => {
  const colors = toneColors[petal.tone];
  const size = Number(petal.size.toFixed(3));
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      className={`petal-${petal.tone}`}
    >
      <defs>
        <linearGradient id={`petal-${petal.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="60%" stopColor={colors.mid} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
      </defs>
      <path
        d="M16 2 C22 6 28 12 26 22 C24 28 18 30 16 30 C14 30 8 28 6 22 C4 12 10 6 16 2 Z"
        fill={`url(#petal-${petal.id})`}
      />
    </svg>
  );
};

const Field = ({ count, layer }: { count: number; layer: "bg" | "fg" }) => {
  const isBg = layer === "bg";
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = i + (isBg ? 100 : 0);
        const tones = ["rose", "gold", "blush"] as const;
        const duration = isBg ? 22 + sample(seed + 3) * 15 : 10 + sample(seed + 3) * 12;
        return {
          id: `${layer}-${i}`,
          left: sample(seed + 1) * 100,
          delay: -(sample(seed + 2) * duration),
          duration,
          size: isBg ? 26 + sample(seed + 4) * 30 : 10 + sample(seed + 4) * 18,
          opacity: isBg ? 0.18 + sample(seed + 6) * 0.18 : 0.55 + sample(seed + 6) * 0.3,
          drift: (sample(seed + 7) < 0.5 ? -1 : 1) * (40 + sample(seed + 8) * 140),
          rotation: 360 + sample(seed + 9) * 540,
          tone: tones[Math.floor(sample(seed + 10) * tones.length)] ?? "rose",
        };
      }),
    [count, isBg, layer],
  );

  if (count === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 select-none overflow-hidden ${isBg ? "z-[1]" : "z-[60]"}`}
      style={{ contain: "strict" }}
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-fall absolute top-0"
          style={
            {
              left: `${petal.left.toFixed(4)}%`,
              animationDuration: `${petal.duration.toFixed(4)}s`,
              animationDelay: `${petal.delay.toFixed(4)}s`,
              opacity: Number(petal.opacity.toFixed(6)),
              "--drift": `${petal.drift.toFixed(4)}px`,
              "--rotation": `${petal.rotation.toFixed(6)}deg`,
            } as React.CSSProperties
          }
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
