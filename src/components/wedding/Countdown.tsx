import { useEffect, useState } from "react";
import { Reveal, SectionTitle } from "./Reveal";
import { wedding } from "@/lib/wedding";

type CountdownValue = { d: number; h: number; m: number; s: number };

const calc = (target: Date): CountdownValue | null => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
};

const Cell = ({ value, label }: { value: number; label: string }) => (
  <div className="flex min-w-11 flex-col items-center md:min-w-[110px]">
    <div key={value} className="animate-fade-in font-serif text-2xl tabular-nums text-rose drop-shadow-sm md:text-7xl">
      {String(value).padStart(2, "0")}
    </div>
    <span className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground md:mt-2 md:text-xs md:tracking-[0.3em]">
      {label}
    </span>
  </div>
);

const weddingTarget = new Date(wedding.date);

export const Countdown = () => {
  const [value, setValue] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const update = () => setValue(calc(weddingTarget));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative px-6 py-14 md:py-20">
      <div className="container mx-auto max-w-3xl">
        <Reveal>
          <SectionTitle title="Counting Down to Forever" />
        </Reveal>
        <Reveal delay={0.2}>
          <div className="glass bg-grain rounded-3xl p-4 text-center md:p-14">
            {value ? (
              <div className="flex flex-nowrap items-start justify-center gap-1 md:gap-5">
                <Cell value={value.d} label="Days" />
                <span className="self-start font-serif text-2xl leading-none text-gold/40 md:text-7xl">·</span>
                <Cell value={value.h} label="Hours" />
                <span className="self-start font-serif text-2xl leading-none text-gold/40 md:text-7xl">·</span>
                <Cell value={value.m} label="Minutes" />
                <span className="self-start font-serif text-2xl leading-none text-gold/40 md:text-7xl">·</span>
                <Cell value={value.s} label="Seconds" />
              </div>
            ) : (
              <p className="inline-block rounded-full px-8 py-4 font-script text-4xl text-rose md:text-6xl">
                The Celebration Begins
              </p>
            )}
            <p className="mt-8 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {wedding.dateLabel} · {wedding.venueShort}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};