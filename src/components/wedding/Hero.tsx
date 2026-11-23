import { motion, useReducedMotion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { wedding } from "@/lib/wedding";

export const Hero = () => {
  const reduced = useReducedMotion();
  return (
    <section className="bg-grain relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div className="hero-scrim" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 pb-[8vh] pt-[32vh] text-center md:pt-[30vh]">
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 font-script text-5xl leading-[0.9] text-ivory drop-shadow-lg sm:text-6xl md:text-7xl"
        >
          {wedding.groom}
        </motion.h1>

        <motion.div
          initial={reduced ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="my-3 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/80 sm:w-16" />
          <span className="font-serif text-4xl italic text-rose drop-shadow-lg sm:text-6xl">&amp;</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/80 sm:w-16" />
        </motion.div>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-script text-5xl leading-[0.9] text-ivory drop-shadow-lg sm:text-6xl md:text-7xl"
        >
          {wedding.bride}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="mt-6 font-serif text-xl italic text-ivory/90 drop-shadow-md md:text-2xl"
        >
          {wedding.tagline}
        </motion.p>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-5 text-xs uppercase tracking-[0.3em] text-ivory drop-shadow-md sm:tracking-[0.5em]"
        >
          Save the Date · {wedding.dateLabel}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.7 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <p className="font-shlok whitespace-pre-line text-lg leading-relaxed text-ivory drop-shadow-md md:text-2xl">
            {`॥ समञ्जन्तु विश्वे देवाः\nसमापो हृदयानि नौ ।\nसं मातरिश्वा सं धाता\nसमुदेष्ट्रि दधातु नौ ॥`}
          </p>
          <p className="mt-4 font-serif text-sm italic text-ivory/85 drop-shadow md:text-base">
            May divine forces unite your hearts and keep you together in harmony forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
};