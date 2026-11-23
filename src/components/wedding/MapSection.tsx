import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wedding } from "@/lib/wedding";
import { Reveal, SectionTitle } from "./Reveal";

export const MapSection = () => (
  <section className="px-6 py-14 md:py-20">
    <div className="container mx-auto max-w-4xl">
      <Reveal>
        <SectionTitle eyebrow="Find Your Way" title="The Venue" subtitle={wedding.venueFull} />
      </Reveal>
      <Reveal delay={0.15}>
        <div className="glass group relative overflow-hidden rounded-3xl p-2 transition-all duration-700 hover:shadow-xl">
          <div className="overflow-hidden rounded-2xl ring-1 ring-gold/30">
            <iframe
              title="Renuka Mangal Karyalay map"
              src={wedding.mapEmbed}
              className="h-[400px] w-full grayscale-[20%] sepia-[15%] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 md:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button asChild className="group h-auto rounded-full bg-gradient-to-r from-rose to-rose/90 px-8 py-3.5 text-primary-foreground transition-all duration-500 hover:shadow-lg">
            <a href={wedding.mapLink} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-4 w-4" /> Open in Google Maps <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>
      </Reveal>
    </div>
  </section>
);