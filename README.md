# 128 Cafe & Bakery — Landing Page

Premium bilingual (EN / AR) landing page for **128 Cafe & Bakery**, New Damietta.
Built with Next.js App Router, TypeScript, Tailwind CSS, GSAP + ScrollTrigger and Lenis.

> Rule Number 1. Never Be Number 2.

## Run

```bash
cd web
npm install
npm run dev      # http://localhost:3000
# production
npm run build && npm run start
```

## What's inside

- **Loader** — ~3s mask/scale logo reveal + `00 → 128` counter, scroll locked, honours `prefers-reduced-motion`.
- **Hero** — pinned canvas frame sequence (192 WebP frames) scrubbed by scroll; DPR-capped, contain-framed so nothing is cropped; static poster fallback for reduced motion.
- **Brand intro, Menu universe, Featured products, Experience collage, the "128" moment, unified Visit & Contact, footer** — scroll-driven motion via GSAP/ScrollTrigger.
- **i18n** — EN/AR with full RTL, language persisted to `localStorage`.

## Assets (all derived from the real brand material in the project root)

- `public/frames/frame-0001…0192.webp` — the hero sequence, resized to 1600px / WebP (~5.4 MB total) from `128 frames/`.
- `public/products/*.webp` — product cut-outs keyed from `128 MENU.pdf`.
- `public/logo-mark.png`, `public/logo-mark-light.png` — the official 128 mark, background removed.
- `public/menu.pdf` — the full menu (linked from "View Full Menu").

Menu categories, items, prices and brand facts live in `lib/menu.ts`; copy in `lib/dictionary.ts`.

## Regenerating frames / cut-outs

The source art stays in the project root (`128 frames/`, `128 logo.jpg`, `128 MENU.pdf`).
Re-run the Pillow conversion used to build `public/frames` and `public/products` if the source changes.
