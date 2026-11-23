export const wedding = {
  groom: "Onkar Jalewar",
  bride: "Shruti Shriramwar",
  openingLine: "Onkar & Shruti invite you",
  tagline: "We are getting married",
  date: "2026-11-26T12:14:00+05:30",
  dateLabel: "Thursday, 26 November 2026",
  muhurat: "12:14 PM",
  venueShort: "Renuka Mangal Karyalay, Parbhani",
  venueFull: "Renuka Mangal Karyalay, Pathri Road, Renuka Nagar, Parbhani, Maharashtra 431401, India.",
  mapLink: "https://maps.app.goo.gl/1gnWUgE7weeMAZMh9",
  mapEmbed:
    "https://www.google.com/maps?q=Renuka+Mangal+Karyalay,+Pathri+Road,+Renuka+Nagar,+Parbhani,+Maharashtra+431401,+India&output=embed",
} as const;

export const events = [
  {
    key: "haldi",
    name: "HALDI",
    date: "Wednesday, 25 November 2026",
    time: "Evening",
    venue: "Renuka Mangal Karyalay, Parbhani",
    dress: "Anything in Yellow 💛",
    theme: "haldi",
  },
  {
    key: "phere",
    name: "PHERE",
    date: "Thursday, 26 November 2026",
    time: "Early Morning",
    venue: "Renuka Mangal Karyalay, Parbhani",
    dress: "Traditional Attire ✨",
    theme: "phere",
  },
  {
    key: "varmala",
    name: "VARMALA",
    date: "Thursday, 26 November 2026",
    time: "Muhurat: 12:14 PM",
    venue: "Renuka Mangal Karyalay, Parbhani",
    dress: "Anything That Sparkles ✨",
    theme: "varmala",
  },
] as const;

export const gallerySections = [
  { key: "our-beginning", title: "Our Beginning", kind: "single", photoCount: 1 },
  { key: "happily-engaged", title: "Happily Engaged", kind: "slider", photoCount: 2 },
  { key: "two-souls", title: "Two Souls, One Story", kind: "album", photoCount: 4 },
  { key: "a-little-laughter", title: "A Little Laughter", kind: "album", photoCount: 4 },
] as const;