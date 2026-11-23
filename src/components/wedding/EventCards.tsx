import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, MapPin, Shirt, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/wedding";
import eventHaldi from "@/assets/event-haldi.jpg";
import eventPhere from "@/assets/event-phere.jpg";
import eventVarmala from "@/assets/event-varmala.jpg";
import { Reveal, SectionTitle } from "./Reveal";

const themeBg = { haldi: eventHaldi, phere: eventPhere, varmala: eventVarmala };
type EventItem = (typeof events)[number];

export const EventCards = () => {
  const [active, setActive] = useState<EventItem | null>(null);

  return (
    <section className="px-4 py-12 md:px-6 md:py-20">
      <div className="container mx-auto max-w-5xl">
        <Reveal>
          <SectionTitle
            eyebrow="Wedding Functions"
            title="The Celebrations"
            subtitle="Magical events, woven together with love, laughter and tradition."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {events.map((event, index) => (
            <Reveal key={event.key} delay={index * 0.08} className="opacity-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActive(event)}
                className="group relative mx-auto flex aspect-[3/4] h-auto w-full max-w-md flex-col items-center justify-start overflow-hidden rounded-3xl bg-cream bg-contain bg-center bg-no-repeat px-6 py-12 text-left shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{ backgroundImage: `url(${themeBg[event.theme]})` }}
                aria-label={`Open ${event.name} details`}
              >
                <div className="relative z-10 flex w-full flex-col items-center text-center">
                  <div className="max-w-sm px-5 py-6 md:px-8 md:py-8">
                    <h3 className="mb-5 mt-2 font-serif text-4xl font-bold text-rose md:mb-6 md:text-6xl">
                      {event.name}
                    </h3>
                    <ul className="inline-block space-y-2 text-left md:space-y-2.5">
                      <Row icon={<Calendar className="h-4 w-4" />} value={event.date} />
                      <Row icon={<Clock className="h-4 w-4" />} value={event.time} />
                      <Row icon={<MapPin className="h-4 w-4" />} value={event.venue} />
                      <Row icon={<Shirt className="h-4 w-4" />} value={event.dress} label="Optional suggestion" />
                    </ul>
                  </div>
                </div>
              </Button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/55 px-4 py-6 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream shadow-2xl"
              style={{ backgroundImage: `url(${themeBg[active.theme]})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setActive(null)}
                aria-label="Close event details"
                className="absolute right-3 top-3 z-10 rounded-full bg-cream/90 text-rose shadow-md hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative z-[1] px-8 py-12 text-center md:px-12 md:py-16">
                <p className="text-[0.7rem] uppercase tracking-[0.4em] text-rose/70 md:text-xs">Wedding Function</p>
                <h3 className="mb-8 mt-2 font-serif text-4xl font-bold text-rose md:text-6xl">{active.name}</h3>
                <ul className="inline-block space-y-4 text-left">
                  <Row icon={<Calendar className="h-5 w-5" />} value={active.date} large />
                  <Row icon={<Clock className="h-5 w-5" />} value={active.time} large />
                  <Row icon={<MapPin className="h-5 w-5" />} value={active.venue} large />
                  <Row icon={<Shirt className="h-5 w-5" />} value={active.dress} label="Optional suggestion" large />
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Row = ({
  icon,
  value,
  label,
  large = false,
}: {
  icon: ReactNode;
  value: string;
  label?: string;
  large?: boolean;
}) => (
  <li className="flex items-start gap-3">
    <span className="mt-1 text-gold-deep">{icon}</span>
    <div>
      {label && <span className="block text-[0.65rem] text-muted-foreground">{label}</span>}
      <p className={`whitespace-pre-line text-left font-serif font-semibold leading-snug text-foreground ${large ? "text-base md:text-xl" : "text-xs md:text-lg"}`}>
        {value}
      </p>
    </div>
  </li>
);