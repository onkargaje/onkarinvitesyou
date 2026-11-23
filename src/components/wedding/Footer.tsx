import { wedding } from "@/lib/wedding";

export const Footer = () => (
  <footer className="relative px-6 py-16 text-center">
    <div className="container mx-auto max-w-2xl">
      <p className="mb-4 font-script text-5xl text-rose">{wedding.groom} &amp; {wedding.bride}</p>
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{wedding.dateLabel}</p>
      <div className="divider-ornament" />
      <p className="text-sm italic text-muted-foreground">Made with love, for those who love us.</p>
    </div>
  </footer>
);