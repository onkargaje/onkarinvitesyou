import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Blessings } from "@/components/wedding/Blessings";
import { CinematicIntro } from "@/components/wedding/CinematicIntro";
import { Countdown } from "@/components/wedding/Countdown";
import { EventCards } from "@/components/wedding/EventCards";
import { Footer } from "@/components/wedding/Footer";
import { Hero } from "@/components/wedding/Hero";
import { LikeButton } from "@/components/wedding/LikeButton";
import { MapSection } from "@/components/wedding/MapSection";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { PetalField } from "@/components/wedding/PetalField";
import { PhotoBlock } from "@/components/wedding/PhotoBlock";
import { PhotoSlider } from "@/components/wedding/PhotoSlider";
import { Quote } from "@/components/wedding/Quote";
import { gallerySections } from "@/lib/wedding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Onkar & Shruti — A Wedding Invitation" },
      {
        name: "description",
        content: "Join Onkar Jalewar and Shruti Shriramwar in Parbhani for their wedding celebrations.",
      },
      { property: "og:title", content: "Onkar & Shruti — A Wedding Invitation" },
      {
        property: "og:description",
        content: "Join Onkar Jalewar and Shruti Shriramwar in Parbhani for their wedding celebrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&family=Noto+Serif+Devanagari:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="relative overflow-x-hidden">
      <CinematicIntro onEnter={() => setIntroDone(true)} />
      <MusicPlayer active={introDone} />
      <PetalField density={26} />

      <div className="relative z-10">
        <Hero />
        <PhotoBlock title={gallerySections[0].title} photoId="our-beginning-1" />
        <Countdown />
        <PhotoSlider
          variant="center"
          images={["happily-engaged-1", "happily-engaged-2"]}
          title={gallerySections[1].title}
          interval={6000}
          effect="fade"
          aspect="aspect-square"
          showDots
          likeIdPrefix="happily-engaged"
        />
        <PhotoSlider
          variant="left"
          images={["two-soul-1", "two-soul-2", "two-soul-3", "two-soul-4"]}
          title={gallerySections[2].title}
          text="From quiet conversations to whispered promises — every moment led us here. To this season, this love, this forever."
          rotate={-2}
          interval={7000}
          effect="fade"
          aspect="aspect-square"
          showDots
          likeIdPrefix="two-soul"
        />
        <Quote />
        <PhotoSlider
          variant="right"
          images={["laughter-1", "laughter-2", "laughter-3", "laughter-4"]}
          title={gallerySections[3].title}
          text="Because love is grand, but laughter is the music it dances to. Here's to a lifetime of inside jokes and stolen smiles."
          rotate={2}
          interval={6000}
          effect="slide"
          aspect="aspect-square"
          showDots
          bright
          likeIdPrefix="laughter"
        />
        <EventCards />
        <Blessings />
        <MapSection />
        <Footer />
      </div>
    </main>
  );
}
