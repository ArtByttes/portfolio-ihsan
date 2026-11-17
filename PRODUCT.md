# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Malaysian brands, organisations, and creative agencies that commission video work — documentaries, F&B and retail commercials, and post-production — plus agencies booking a freelance camera operator or editor by the day. They usually arrive before a project is fully defined, compare a handful of videographers, and decide whether to open a conversation. The site is a one-person studio's front door: Ihsan is both the seller and the subject. Full-time employment is explicitly not a target audience (confirmed 2026-11-17).

## Product Purpose

Turn nine years of professional production work and a national journalism award into paid commissions. Success is a qualified enquiry — a WhatsApp message that names a project, a timeline, and a rough budget — that leads to a booked project. The site is not a CV, a bare showreel, or a blog; every section exists to earn that contact.

## Positioning

A documentary-trained camera operator and editor who runs productions end to end — concept, shoot, edit, colour, sound — with shared national-award credit as Second Cameraman on "Kita Mesti Menang" (Best Video News, MPI Petronas 2020), and range from hard journalism to F&B commercials. He can work as a solo operator or inside a crew, based in Sungai Buloh/KL and available wherever the job needs. The distinction to protect is award-winning journalism plus commercial craft, not generic "creative video".

## Operating Context

- Commissions are per project: documentary and journalism, TVC and social content for F&B/retail, and post-production and multimedia.
- WhatsApp (+60 19-626 6072) is the primary conversion channel. The closing contact section is a direct `wa.me` link with a prefilled message prompt (project type, date, rough budget), plus email and phone links; there is no in-page form and no backend.
- Pricing is quote-based and no longer displayed on the page: the pricing strip (Day Rate / Contract and Project-Based / Full Production) was removed at the owner's instruction on 2026-11-17. Enquiries state the project type, date, and rough budget in the WhatsApp prefill, and the number is set privately.
- Standard terms are no longer displayed on the site as of 2026-11-17: 2–3 revision rounds, travel coverage, raw-footage delivery, and the three-phase process are service terms to state in conversation, not page copy.
- Page structure after the 2026-11-17 restructure: hero → portfolio → trust/award → about → contact band. The pricing section and FAQ section were removed at the owner's instruction on 2026-11-17, so the contact band closes the page directly.
- The portfolio is filtered with a custom wheel across nine categories: dokumentari, news, fnb, event, interview, animasi, brand, montage, shortvideo. Cards play in a fullscreen modal.
- Video and portrait assets remain absolute URLs on file.garden. Portfolio card covers were replaced on 2026-11-17 with frames extracted from the actual videos (around the 10-second mark, or mid-clip for short videos); the 36 JPEGs live in `public/thumbs/` (~2.7 MB) and are referenced as `/thumbs/...`. The Aliyaa animation card still uses its own GIF as the cover.
- Deployed at ihsansalleh.com (canonical, sitemap, robots).
- The default reading language is Bahasa Malaysia; English is available via a toggle and the choice persists in localStorage.

## Capabilities and Constraints

- Static Vite site: hand-written HTML, CSS, and vanilla JS. No framework, no build-time data layer, no CMS.
- Bilingual via a JS translation dictionary keyed by `data-i18n` attributes (84 hooks). MS is canonical; EN is a translation.
- Dark theme is the default; a light theme exists behind a toggle. The incumbent identity is dark-first.
- Binding language decision (2026-11-17): Bahasa Malaysia first, English toggle. Current MS copy mixes Indonesian wording ("Kualitas", "Layanan", "Anda", "Rakan Kolaborator") and must be standardized to Bahasa Malaysia.
- No server-side form handling; enquiries depend on WhatsApp being available on the device.
- Open decisions:
  - The "Minta CV melalui WhatsApp" button replaced the dead resume download (2026-11-17); no PDF is hosted.
  - Social links point to facebook.com/, linkedin.com, and vimeo.com — real profile URLs are pending from the owner.
  - Revision count was standardized to 2–3 rounds (2026-11-17); the term is now communicated in conversation since the sections that displayed it were removed.
  - Portfolio card covers are frames from the project videos themselves, chosen at roughly 10 seconds (or mid-clip when shorter) and stored in `public/thumbs/` (2026-11-17).

## Brand Commitments

- Name: Ihsan Salleh; domain ihsansalleh.com; "IS" monogram in the header.
- Voice: first-person, professional, Malaysian; speaks to brands and producers as a peer, not a vendor. The existing MS copy is the reference register once standardized.
- WhatsApp is the primary call to action across the page.
- Existing assets: showreel and project videos, portrait photography, and the award association, all already in use.

## Evidence on Hand

Confirmed by the owner on 2026-11-17:
- Best Video News, Anugerah Malam Wartawan Malaysia (MPI Petronas 2020), for "Kita Mesti Menang"; the site credits Ihsan as Second Cameraman — keep that role precise rather than implying sole authorship.
- Experience: 9+ years, 50+ ads and documentaries, 3 major agency collaborations.
- Project titles, credited roles, and results listed on the portfolio cards, including "Dari ICU ke Liang Lahad" (Second Cameraman, 500k+ digital views).
- Real video assets for the listed projects, hosted on file.garden.

Not cleared — must not be presented as verified:
- The testimonial attributed to Lengeswaran Munusamy (Video Producer, The Hatch) was unconfirmed and was removed from the site on 2026-11-17 pending clearance. Do not invent a substitute.
- No resume PDF exists; CV is offered on request via WhatsApp.
- Social profile URLs are still placeholders pending the owner's real URLs.

## Product Principles

1. Proof over adjectives: every claim carries a named project, credited role, or award.
2. One contact path: WhatsApp, prefilled, with as little friction as the project allows.
3. No prices on the page: the project scope is the conversation and the number is set privately, one-to-one.
4. One craft, two registers: journalistic weight and commercial polish must both be legible.
5. Bahasa Malaysia is the default reading; English is a translation, not a second voice.
