# Tanja Koller — nova spletna stran

Complete rebrand of https://tanjakoller.com/ — modern, high-end one-pager, **bilingual SL/DE**.
Static HTML/CSS/JS, no build step, no external services. Fonts AND libraries self-hosted (GDPR-safe):
GSAP 3.13 + ScrollTrigger and Three.js r149 are pinned copies in `assets/vendor/` (~725 KB total) — no CDN calls.

**Language:** auto-detects the browser language (German browsers → DE), manual SL/DE toggle in the nav,
choice persists in localStorage. All content translated including the interactive tools, form and e-mail template.

**Chakra journey:** GSAP ScrollTrigger pin on desktop with a short travel (~1.8 viewport heights — doesn't trap
the scroll); on mobile/tablets (<981px) there is no pinning at all — tap a chakra to explore.

**Hero:** Three.js particle field + chakra nebula with mouse parallax; automatically falls back to the lightweight
2D canvas when WebGL is unavailable, and to a static frame under `prefers-reduced-motion`.

## View it

```bash
open "/Users/alexkokol/AI Ordner/tanjakoller-website/index.html"
```

Works straight from the filesystem. For local serving: `python3 -m http.server` in this folder.

## Structure

| File | Purpose |
|---|---|
| `index.html` | All content/sections |
| `styles.css` | Design system ("Aurora": cosmic indigo · cream · gold · chakra spectrum) |
| `main.js` | All interactivity (see below) |
| `assets/img/` | Optimized web images (4.8 MB total) |
| `assets/original/` | Untouched originals downloaded from the old site (incl. excluded Buddha `3291-1.jpg`) |
| `assets/fonts/` | Self-hosted Fraunces + Inter (woff2, latin + latin-ext for š č ž) |
| `CONTENT.md` | Full content inventory extracted from the old site |

## Interactive features ("Aurora II")

1. **Preloader** — flower of life draws itself stroke by stroke, brand lockup, lifts away (once per session, click to skip)
2. **Aurora hero** — canvas particle field cycling the chakra spectrum, rotating flower-of-life SVG (her real symbol, replaces the Buddha stock photo), breathing aura, kinetic char-by-char headline, mouse + scroll parallax
3. **Custom cursor** — lerped ring + dot in difference blend, grows over interactive elements (fine pointers only)
4. **Magnetic buttons** — CTAs pull toward the cursor
5. **Chakra journey** — pinned scroll-driven section: the energy ascends root → crown as you scroll; ambient glow recolors per chakra; progress rail; nodes clickable (scrolls to that chakra)
6. **Marquee bands** — outlined kinetic type ("Harmonija · Energija · Ravnovesje · Samozdravljenje")
7. **Symptom finder** ("Kaj vas teži?") — pick symptoms → recommends one of her 6 service areas
8. **Energy ring** — animated 3×33% donut with rotating conic aura + hover highlighting
9. **Kinetic typography** — word-mask reveals on every heading, film-grain overlay, section numbering (01–10), nav hides on scroll down with chakra-gradient scroll-progress bar
10. **Testimonial slider** (auto/swipe), **gallery lightbox** (keyboard nav), **booking form** (prefilled e-mail), animated counters, image clip-path reveals, FAQ accordion
11. Full responsive + `prefers-reduced-motion` support (everything decorative is gated)

## Notes / deliberate decisions

- **Buddha image removed** as requested — kept only in `assets/original/`, never referenced.
- **No Google Fonts CDN, no map embeds, no analytics** — zero third-party requests (EU/GDPR-friendly). Location section links out to Google/Apple Maps instead of embedding an iframe.
- **Contact form is mailto-based.** If a real server-side form is wanted later, options: Formspree, the hosting provider's PHP mail, or a small serverless function (needs a decision about data/GDPR).
- **Medical disclaimer** added in the footer (standard for Energethiker in Austria): "Energetsko zdravljenje dopolnjuje, ne nadomešča zdravniške oskrbe." Removable if unwanted.
- `index.html?static` renders without scroll animations (used for testing, handy for print).

## Deploy

Upload the folder contents (index.html, styles.css, main.js, assets/) to any static host
(the current WordPress hosting can serve it as plain files, or Netlify/Cloudflare Pages).
`assets/original/` and the `.md` files don't need to be uploaded.
