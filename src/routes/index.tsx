import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Blessings } from "@/components/wedding/Blessings";
import { CinematicIntro } from "@/components/wedding/CinematicIntro";
import { Countdown } from "@/components/wedding/Countdown";
import { EventCards } from "@/components/wedding/EventCards";
import { Footer } from "@/components/wedding/Footer";
import { Hero } from "@/components/wedding/Hero";
import { MapSection } from "@/components/wedding/MapSection";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { PetalField } from "@/components/wedding/PetalField";
import { PhotoBlock } from "@/components/wedding/PhotoBlock";
import { PhotoSlider } from "@/components/wedding/PhotoSlider";
import { Quote } from "@/components/wedding/Quote";
import { gallerySections } from "@/lib/wedding";

import ourBeginningImg from "@/assets/photos/our-beginning.jpg";
import happilyEngaged1 from "@/assets/photos/happily-engaged-1.jpg";
import happilyEngaged2 from "@/assets/photos/happily-engaged-2.jpg";
import twoSouls1 from "@/assets/photos/two-souls-1.jpg";
import twoSouls2 from "@/assets/photos/two-souls-2.jpg";
import twoSouls3 from "@/assets/photos/two-souls-3.jpg";
import twoSouls4 from "@/assets/photos/two-souls-4.jpg";
import twoSouls5 from "@/assets/photos/two-souls-5.jpg";
import twoSouls6 from "@/assets/photos/two-souls-6.jpg";
import twoSouls7 from "@/assets/photos/two-souls-7.jpg";
import twoSouls8 from "@/assets/photos/two-souls-8.jpg";
import twoSouls9 from "@/assets/photos/two-souls-9.jpg";
import twoSouls10 from "@/assets/photos/two-souls-10.jpg";
import littleLaughter1 from "@/assets/photos/little-laughter-1.jpg";
import littleLaughter2 from "@/assets/photos/little-laughter-2.jpg";
import littleLaughter3 from "@/assets/photos/little-laughter-3.jpg";
import littleLaughter4 from "@/assets/photos/little-laughter-4.jpg";
import littleLaughter5 from "@/assets/photos/little-laughter-5.jpg";
import foreverBeginsHereImg from "@/assets/photos/forever-begins-here.jpg";

const happilyEngagedImages = [
  { id: "happily-engaged-1", src: happilyEngaged1, alt: "Onkar and Shruti — Happily Engaged 1" },
  { id: "happily-engaged-2", src: happilyEngaged2, alt: "Onkar and Shruti — Happily Engaged 2" },
];

const twoSoulsImages = [
  { id: "two-soul-1", src: twoSouls1, alt: "Two Souls, One Story — 1" },
  { id: "two-soul-2", src: twoSouls2, alt: "Two Souls, One Story — 2" },
  { id: "two-soul-3", src: twoSouls3, alt: "Two Souls, One Story — 3" },
  { id: "two-soul-4", src: twoSouls4, alt: "Two Souls, One Story — 4" },
  { id: "two-soul-5", src: twoSouls5, alt: "Two Souls, One Story — 5" },
  { id: "two-soul-6", src: twoSouls6, alt: "Two Souls, One Story — 6" },
  { id: "two-soul-7", src: twoSouls7, alt: "Two Souls, One Story — 7" },
  { id: "two-soul-8", src: twoSouls8, alt: "Two Souls, One Story — 8" },
  { id: "two-soul-9", src: twoSouls9, alt: "Two Souls, One Story — 9" },
  { id: "two-soul-10", src: twoSouls10, alt: "Two Souls, One Story — 10" },
];

const littleLaughterImages = [
  { id: "laughter-1", src: littleLaughter1, alt: "A Little Laughter — 1" },
  { id: "laughter-2", src: littleLaughter2, alt: "A Little Laughter — 2" },
  { id: "laughter-3", src: littleLaughter3, alt: "A Little Laughter — 3" },
  { id: "laughter-4", src: littleLaughter4, alt: "A Little Laughter — 4" },
  { id: "laughter-5", src: littleLaughter5, alt: "A Little Laughter — 5" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Onkar & Shruti — A Wedding Invitation" },
      {
        name: "description",
        content:
          "Join Onkar Jalewar and Shruti Shriramwar in Parbhani for their wedding celebrations.",
      },
      { property: "og:title", content: "Onkar & Shruti — A Wedding Invitation" },
      {
        property: "og:description",
        content:
          "Join Onkar Jalewar and Shruti Shriramwar in Parbhani for their wedding celebrations.",
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
        <PhotoBlock
          title={gallerySections[0].title}
          photoId="our-beginning-1"
          image={ourBeginningImg}
        />
        <Countdown />
        <PhotoSlider
          variant="center"
          images={happilyEngagedImages}
          title={gallerySections[1].title}
          interval={6000}
          effect="slide"
          aspect="aspect-square"
          showDots
          likeIdPrefix="happily-engaged"
        />
        <PhotoSlider
          variant="left"
          images={twoSoulsImages}
          title={gallerySections[2].title}
          text="From quiet conversations to whispered promises — every moment led us here. To this season, this love, this forever."
          rotate={-2}
          interval={7000}
          effect="slide"
          aspect="aspect-square"
          showDots
          likeIdPrefix="two-soul"
        />
        <Quote />
        <PhotoSlider
          variant="right"
          images={littleLaughterImages}
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
        <PhotoBlock
          title="Forever begins here"
          photoId="forever-begins-here"
          image={foreverBeginsHereImg}
        />
        <Blessings />
        <MapSection />
        <Footer />
      </div>
    </main>
  );
}
