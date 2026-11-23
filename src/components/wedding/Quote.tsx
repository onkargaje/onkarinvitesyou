import { Reveal } from "./Reveal";

export const Quote = () => (
  <section className="relative px-6 py-32 md:py-40">
    <div className="container mx-auto max-w-3xl text-center">
      <Reveal>
        <span className="block font-serif text-8xl leading-none text-gold/40 md:text-9xl">&ldquo;</span>
        <p className="-mt-6 font-serif text-2xl italic leading-relaxed text-foreground md:text-4xl">
          We are tying the sacred bond of marriage
        </p>
        <p className="font-shlok mt-8 text-lg font-medium tracking-wider text-rose/70 md:text-xl">
          ॥ वयं विवाहबन्धने बद्धौ ॥
        </p>
      </Reveal>
    </div>
  </section>
);