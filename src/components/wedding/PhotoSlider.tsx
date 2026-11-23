import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { LikeButton } from "./LikeButton";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export type SliderImage = string | { id: string; src: string; alt?: string };

interface PhotoSliderProps {
  images: SliderImage[];
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
  const isFade = effect === "fade";
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setSelected((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setSelected((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(goNext, interval);
    return () => window.clearInterval(id);
  }, [count, goNext, interval, paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    setPaused(false);
    if (startX == null || endX == null) return;
    const delta = startX - endX;
    if (Math.abs(delta) > 35) {
      if (delta > 0) goNext();
      else goPrev();
    }
  };

  const renderSlideContent = (item: SliderImage, index: number) => {
    const src = typeof item === "string" ? undefined : item.src;
    const alt = typeof item === "string" ? undefined : item.alt;

    return (
      <>
        <div
          className={`flex h-full w-full items-center justify-center bg-cream ${
            bright && index === selected ? "brightness-105 saturate-105" : ""
          }`}
        >
          {src ? (
            <img
              src={src}
              alt={alt || `${title} — ${index + 1}`}
              loading="eager"
              decoding="async"
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
            />
          ) : (
            <PhotoPlaceholder aspect="h-full" />
          )}
        </div>
        <div className="absolute right-3 top-3 z-20">
          <LikeButton kind="photo" itemId={`${likeIdPrefix}-${index + 1}`} variant="overlay" />
        </div>
      </>
    );
  };

  const frame = (
    <div
      className="polaroid mx-auto max-w-lg md:max-w-xl"
      style={{ transform: `rotate(${rotate}deg)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`relative overflow-hidden rounded-sm bg-cream touch-pan-y ${aspect}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isFade ? (
          images.map((item, index) => {
            const photoId = typeof item === "string" ? item : item.id;
            const active = index === selected;
            return (
              <div
                key={photoId}
                className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
                  active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                }`}
              >
                {renderSlideContent(item, index)}
              </div>
            );
          })
        ) : (
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translate3d(-${selected * 100}%, 0, 0)` }}
          >
            {images.map((item, index) => {
              const photoId = typeof item === "string" ? item : item.id;
              return (
                <div key={photoId} className="relative h-full w-full shrink-0 basis-full">
                  {renderSlideContent(item, index)}
                </div>
              );
            })}
          </div>
        )}

        {count > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Previous photo"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-ink/35 text-ivory backdrop-blur-sm hover:bg-ink/55"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Next photo"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-ink/35 text-ivory backdrop-blur-sm hover:bg-ink/55"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
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
              onClick={() => setSelected(index)}
              className={`h-2 min-h-2 p-0 transition-all duration-300 ${
                index === selected ? "w-6 rounded-full bg-rose" : "w-2 rounded-full bg-rose/30"
              }`}
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
        <div
          className={`container mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16 ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
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