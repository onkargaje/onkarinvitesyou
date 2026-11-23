# Onkar & Shruti Digital Wedding Invitation

## Goal
Build the new invitation in this separate project, using Akshay’s site as the visual and interaction reference. The original Akshay project and its live site remain untouched.

## Plan
1. Recreate the reference’s single-page invitation in this project while retaining its pastel styling, typography, section order, opening animation, flower petals, background music controls, countdown, map, transitions, and mobile behavior.
2. Set the couple to Onkar Jalewar and Shruti Shriramwar, with Onkar shown first throughout. Use the exact opening text “Onkar & Shruti invite you.” Set the wedding countdown to November 26, 2026 at 12:14 PM India time and update the venue and map details.
3. Keep only the three event cards, in order: HALDI, PHERE, VARMALA. Use the provided dates, “Evening” and “Early Morning” without inventing times, the supplied venue, and the optional dress suggestions as written.
4. Retain the gallery’s existing layouts and interactions, with four sections: Our Beginning (one placeholder), Happily Engaged (two placeholders), Two Souls, One Story (album), and A Little Laughter (album). Do not reuse Akshay’s couple photos or add stock or generated photographs.
5. Omit the Gift section and its payment details.
6. Set up a fresh, separate Lovable Cloud backend for blessings and likes. Start with no messages or likes; preserve submission confirmation, liking, live counts, most-liked sorting, top-three highlighting, and editing one’s own message. Do not copy or share guest data from Akshay’s site.
7. Verify the invitation on desktop and mobile, including the event cards, gallery placeholders, countdown, music controls, map link, and blessings interactions. Prepare the separate site for publishing at the requested `onkarinvitesyou.lovable.app` address, subject to availability in the publish flow.

## Technical notes
- The current project uses TanStack Start; the reference uses a different React setup. Port the invitation into the existing home page rather than introducing another router.
- Reuse the reference’s implementation and non-couple decorative assets where appropriate, while keeping all new couple-photo slots empty until photographs are supplied.
- Create the blessings data store only in this project’s own Lovable Cloud environment. If separate Cloud provisioning or approval is unavailable, pause and ask before using any other backend.
