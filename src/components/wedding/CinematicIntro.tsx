import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { wedding } from "@/lib/wedding";

export const CinematicIntro = ({ onEnter }: { onEnter: () => void }) => {
  const [open, setOpen] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleEnter = () => {
    setOpen(false);
    window.setTimeout(onEnter, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="intro-video absolute inset-0 h-full w-full object-cover"
          />
          <div className="intro-scrim absolute inset-0 bg-ink/65" />
          <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl bg-ink/50 px-6 py-10 text-center backdrop-blur-sm sm:px-12 sm:py-12"
            >
              <p className="mx-auto mb-6 max-w-2xl font-sans text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-ivory [text-shadow:0_2px_14px_rgba(20,10,12,0.95)] sm:text-sm md:text-base">
                WE&apos;RE EXCITED TO ANNOUNCE OUR WEDDING. JOIN US FOR THE CELEBRATION
              </p>
              <h1 className="mb-8 font-serif text-4xl font-semibold text-ivory [text-shadow:0_3px_18px_rgba(20,10,12,0.95)] sm:text-5xl md:text-7xl">
                {wedding.openingLine}
              </h1>
              <Button
                type="button"
                variant="outline"
                onClick={handleEnter}
                className="glass-dark h-auto rounded-full border-gold/50 px-10 py-4 font-serif text-lg uppercase tracking-[0.25em] text-ivory shadow-xl hover:bg-ivory/15"
              >
                Open Invitation
              </Button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-ivory [text-shadow:0_2px_10px_rgba(20,10,12,0.9)]"
              >
                Tap to begin
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
