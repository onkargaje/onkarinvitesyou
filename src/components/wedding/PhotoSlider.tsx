import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { LikeButton } from "./LikeButton";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

interface PhotoSliderProps {
  images: string[];
  title: string;
  text?: string;
  interval?: number;
  effect?: "fade" | "slide";
  showDots?: boolean;
  aspect?: string;
  bright?: boolean;
  variant?: "left" | "right" | "center";
  rotate?: number;
  likeIdPrefix: string;
}

export const PhotoSlider = ({
  images,
  title,
  text,
  interval = 5500,
  effect = "slide",
  showDots = false,
  aspect = "aspect-[4/5]",
  bright = false,
  variant = "center",
  rotate = 0,
  likeIdPrefix,
}: PhotoSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", dragFree: false }, [
    Autoplay({ delay: interval, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const frame = (
    <div className="polaroid mx-auto max-w-lg md:max-w-xl" style={{ transform: `rotate(${rotate}deg)` }}>
      <div className={`relative overflow-hidden rounded-sm bg-cream ${aspect} ${effect === "fade" ? "embla-fade" : ""}`} ref={emblaRef}>
        <div className="embla__container">
          {images.map((photoId, index) => (
            <div
              key={photoId}
              className={`embla__slide relative h-full flex-[0_0_100%] ${effect === "fade" ? `absolute inset-0 ${index === selected ? "z-10 opacity-100" : "z-0 opacity-0"}` : ""}`}
            >
              <div className={`h-full w-full ${bright && index === selected ? "brightness-105 saturate-105" : ""}`}>
                <PhotoPlaceholder aspect="h-full" />
              </div>
              <div className="absolute right-3 top-3 z-20">
                <LikeButton kind="photo" itemId={`${likeIdPrefix}-${index + 1}`} variant="overlay" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDots && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 min-h-2 p-0 transition-all duration-300 ${index === selected ? "w-6 rounded-full bg-rose" : "w-2 rounded-full bg-rose/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (variant === "left" || variant === "right") {
    const reverse = variant === "right";
    return (
      <section className="px-6 py-12 md:py-20">
        <div className={`container mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
          <Reveal>{frame}</Reveal>
          <Reveal delay={0.15}>
            <div className={reverse ? "text-center md:text-right" : "text-center md:text-left"}>
              <h3 className="mb-4 font-serif text-2xl text-foreground md:text-4xl">{title}</h3>
              {text && <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 md:py-20">
      <div className="container mx-auto max-w-3xl">
        <Reveal>{frame}</Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 text-center">
            <h3 className="font-serif text-2xl text-foreground md:text-4xl">{title}</h3>
            {text && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{text}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
};