# ProteGo Hygiene — website

Landing page for ProteGo Hygiene, built with Next.js 16 (App Router), React 19 and Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Where things are

| Path | What |
|---|---|
| `app/globals.css` | Brand tokens (palette, type scale, petal shape, animations) from the brand guidelines |
| `app/layout.tsx` | Manrope (local, from the brand asset pack), metadata |
| `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` | Favicons made from the brand icon |
| `app/page.tsx` | Section order |
| `components/TouchTest.tsx` | Interactive "touch test": ordinary disinfectant vs ProteGo between cleans |
| `components/Motion.tsx` | Entrance animations (Motion): `Reveal`, `Stagger` + `Item`, `Words` headline reveal. Opacity + `transform` only, one ease-out, no overshoot; reduced motion keeps only the fade |
| `components/sections/*` | Hero, cleaning gap, how it works, why ProteGo, products, services, industries, clients, FAQ, contact, footer |
| `public/brand/` | Official logo SVGs (horizontal lockup and icon, in dark, turquoise and white) |
| `public/images/` | Photography from the brand guidelines |
| `public/clients/` | Client logos, converted to one monochrome style |

Brand rules followed: only the approved palette (Sherpa Blue `#004A5D`, Orient `#00627B`, Turquoise `#6AE6DC`, Spring `#F8F8F9`), Manrope only, text left-aligned, logo at the top left and never centred, and a 12-column grid with 6% side margins. Content and claim wording come from `../docs/knowledge-base/`.

## Before launch
- Confirm prices (₹1,049 DIY kit, from ₹2.75/sq ft) and contact details with the client.
- Get written permission for each client logo and for the DAIS quote.
- The contact form opens the visitor's email app (`mailto:`). Swap it for the CRM's lead endpoint once that exists.
- The hero uses the client's campaign image `campaign-one-spray-30-days.jpg`, which is only 1366 px wide and looks soft on large screens. Ask the client for the full-resolution original.
- `components/HeroSplit.tsx` (the lift-panel "ordinary disinfectant vs ProteGo" visual) is kept for use in a later section but is not on the page. Its photo, `public/images/hero-lift-panel.jpg`, is a stock image: a lift panel by Arisa Chattasa on Unsplash (https://unsplash.com/photos/BoQ3FmPQgZI, Unsplash License: free for commercial use, no attribution required), cropped and toned to the brand duotone. The germ marks and rings are placed by % to match its buttons.
