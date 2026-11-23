import { describe, expect, it } from "vitest";
import { canEditBlessing, EDIT_WINDOW_MS, isTopBlessing, sortBlessings } from "@/lib/blessings";
import { events, gallerySections, wedding } from "@/lib/wedding";

describe("wedding details", () => {
  it("keeps the groom listed before the bride", () => {
    expect([wedding.groom, wedding.bride]).toEqual(["Onkar Jalewar", "Shruti Shriramwar"]);
  });

  it("uses the supplied wedding date, muhurat, venue, and map", () => {
    expect(wedding.date).toBe("2026-11-26T12:14:00+05:30");
    expect(wedding.muhurat).toBe("12:14 PM");
    expect(wedding.venueFull).toBe("Renuka Mangal Karyalay, Pathri Road, Renuka Nagar, Parbhani, Maharashtra 431401, India.");
    expect(wedding.mapLink).toBe("https://maps.app.goo.gl/1gnWUgE7weeMAZMh9");
  });

  it("keeps only the three requested functions in order without inventing times", () => {
    expect(events.map((event) => event.name)).toEqual(["HALDI", "PHERE", "VARMALA"]);
    expect(events[0]?.time).toBe("Evening");
    expect(events[1]?.time).toBe("Early Morning");
    expect(events[2]?.time).toBe("Muhurat: 12:14 PM");
  });

  it("uses the requested optional attire suggestions", () => {
    expect(events.map((event) => event.dress)).toEqual([
      "Anything in Yellow 💛",
      "Traditional Attire ✨",
      "Anything That Sparkles ✨",
    ]);
  });

  it("provides the four requested photo sections and supplied single-photo counts", () => {
    expect(gallerySections.map((section) => section.title)).toEqual([
      "Our Beginning",
      "Happily Engaged",
      "Two Souls, One Story",
      "A Little Laughter",
    ]);
    expect(gallerySections.slice(0, 2).map((section) => section.photoCount)).toEqual([1, 2]);
    expect(gallerySections.slice(2).map((section) => section.kind)).toEqual(["album", "album"]);
  });
});

describe("blessing interactions", () => {
  it("allows editing only by the matching browser session within ten minutes", () => {
    const blessing = { session_id: "guest-session-1", created_at: new Date(0).toISOString() };
    expect(canEditBlessing(blessing, "guest-session-1", EDIT_WINDOW_MS - 1)).toBe(true);
    expect(canEditBlessing(blessing, "guest-session-2", 1)).toBe(false);
    expect(canEditBlessing(blessing, "guest-session-1", EDIT_WINDOW_MS)).toBe(false);
  });

  it("sorts blessings by their live like counts and highlights only the top three", () => {
    const blessings = [
      { id: "first", created_at: "2026-11-01T00:00:00Z", like_count: 0 },
      { id: "second", created_at: "2026-11-02T00:00:00Z", like_count: 0 },
      { id: "third", created_at: "2026-11-03T00:00:00Z", like_count: 0 },
      { id: "fourth", created_at: "2026-11-04T00:00:00Z", like_count: 0 },
    ];
    expect(sortBlessings(blessings, { first: 2, second: 4, third: 1 }).map((item) => item.id)).toEqual([
      "second",
      "first",
      "third",
      "fourth",
    ]);
    expect([isTopBlessing(0), isTopBlessing(1), isTopBlessing(2), isTopBlessing(3)]).toEqual([true, true, true, false]);
  });
});