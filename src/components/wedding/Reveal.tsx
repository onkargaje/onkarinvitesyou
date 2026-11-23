import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const Reveal = ({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Ornament = () => (
  <div className="divider-ornament" aria-hidden="true">
    <svg width="28" height="28" viewBox="0 0 28 28" className="text-gold">
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8">
        <circle cx="14" cy="14" r="2" fill="currentColor" />
        <path d="M14 4 Q18 9 14 14 Q10 9 14 4 Z" fill="currentColor" opacity="0.5" />
        <path d="M14 24 Q10 19 14 14 Q18 19 14 24 Z" fill="currentColor" opacity="0.5" />
        <path d="M4 14 Q9 10 14 14 Q9 18 4 14 Z" fill="currentColor" opacity="0.5" />
        <path d="M24 14 Q19 18 14 14 Q19 10 24 14 Z" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  </div>
);

export const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-12 text-center">
    {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.4em] text-rose/80">{eyebrow}</p>}
    <h2 className="font-serif text-3xl text-foreground md:text-5xl">{title}</h2>
    <Ornament />
    {subtitle && <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">{subtitle}</p>}
  </div>
);