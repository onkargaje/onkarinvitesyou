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
          <div className="intro-scrim absolute inset-0" />
          <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="mb-3 font-script text-3xl text-inverse/90 drop-shadow-lg md:text-5xl">
                A Wedding Invitation
              </p>
              <h1 className="mb-8 font-serif text-4xl text-inverse drop-shadow-lg sm:text-5xl md:text-7xl">
                {wedding.openingLine}
              </h1>
              <Button
                type="button"
                variant="outline"
                onClick={handleEnter}
                className="glass-dark h-auto rounded-full border-gold/40 px-10 py-4 font-serif text-lg uppercase tracking-[0.25em] text-inverse hover:bg-ivory/15"
              >
                Open Invitation
              </Button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="mt-8 text-xs uppercase tracking-[0.3em] text-inverse/80"
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