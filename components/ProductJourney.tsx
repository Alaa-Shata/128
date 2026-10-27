"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/components/Providers";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pour } from "@/lib/pour";
import PourCup from "@/components/PourCup";
import { featured } from "@/lib/menu";

/**
 * Chapters 1–3 as ONE continuous pinned composition.
 *
 * A single pinned stage holds every scene stacked on top of each other; one
 * scrubbed master timeline crossfades/translates/scales them so each scene
 * physically hands off into the next with overlap — the brand opening flows
 * straight into the product world and the featured products without any hard
 * section break. Dominant cut-out products cross oversized editorial type.
 * Fully reversible on scroll. Real 128 content only.
 */

const src = (img: string) => `/products/${img.includes(".") ? img : img + ".webp"}`;

export default function ProductJourney() {
  const { t, lang, dir, reduced } = useApp();
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
      const n = scenes.length;

      // ONE shared canvas: each beat RESTS at a different position (a wandering path),
      // never re-centred. Beats enter from below, drift continuously through their rest
      // (so nothing freezes), and exit up-and-out — the next beat continues the flow.
      // x-shift always moves TOWARD centre on each scene's text side, so no title clips.
      // (featured flip = text-right on odd featured index → scenes 3,5,7; those use x<=0)
      const REST = [
        { x: 0, y: 0 },   // 0 brand opening (centred)
        { x: -10, y: 0 }, // 1 product-world statement — sits left so the pour falls beside it
        { x: 7, y: -7 },  // 2 latte     (text-left)  → shift right, toward centre
        { x: -8, y: 3 },  // 3 croissant (text-right) → shift left, toward centre
        { x: 8, y: 6 },   // 4 mousse    (text-left)  → shift right
        { x: -5, y: 10 }, // 5 matcha    (text-right) → shift left
        { x: 8, y: 0 },   // 6 waffle    (text-left)  → shift right
        { x: -8, y: 3 },  // 7 choc      (text-right) → shift left
      ];
      // stacked layouts (<1024) get no horizontal path (avoids clipping); in RTL the
      // text sides flip, so the "toward centre" shift flips too
      const stacked = window.innerWidth < 1024;
      const sx = dir === "rtl" ? -1 : 1;
      const restOf = (i: number) => {
        const r = REST[i] || { x: 0, y: 0 };
        return stacked ? { x: 0, y: r.y } : { x: r.x * sx, y: r.y };
      };

      // initial staging: scene 0 at its rest; the rest parked just below their rest spot
      gsap.set(scenes[0], { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 1 });
      scenes.forEach((s, i) => {
        if (i === 0) return;
        const r = restOf(i);
        const park: gsap.TweenVars = { xPercent: r.x, yPercent: r.y + 66, scale: 0.9, autoAlpha: 0 };
        if (i === 1) Object.assign(park, { yPercent: r.y + 4, scale: 0.985 }); // revealed in place by the pour
        gsap.set(s, park);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (window.innerWidth < 768 ? 8 : 10.5),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 10, // topmost pin: measure first so later sections stack below it
        },
      });

      // ---- OPENING (0 -> P0): upright → tilt → POUR → stream → cup leaves, pour opens the statement ----
      // Everything below is placed on the opening's own 0..1 clock: at(f) = f * P0.
      const P0 = 0.26;
      const at = (f: number) => f * P0;
      const len = (f: number) => f * P0;
      const cup = scenes[0].querySelector<HTMLElement>("[data-pour-cup]")!;
      const lift = scenes[0].querySelector<HTMLElement>("[data-pour-lift]")!;
      const slotEl = scenes[0].querySelector<HTMLElement>("[data-pour-slot]")!;
      const saucer = scenes[0].querySelector("[data-pour-saucer]");
      const text = scenes[0].querySelectorAll("[data-open-text]");
      const hint = scenes[0].querySelector("[data-open-hint]");
      const world = scenes[1].querySelector("[data-world]");
      const rtl = dir === "rtl";
      const POUR_ANGLE = -44;

      // where (relative to the cup) the coffee leaves the rim at the pouring angle — measured once
      gsap.set(cup, { rotation: POUR_ANGLE });
      const sr = slotEl.getBoundingClientRect();
      let lowest = { x: 0, y: -1e9 };
      scenes[0].querySelectorAll<HTMLElement>("[data-pour-lip]").forEach((m) => {
        const r = m.getBoundingClientRect();
        if (r.top > lowest.y) lowest = { x: r.left, y: r.top };
      });
      const lipRatio = (lowest.x - (sr.left + sr.width / 2)) / sr.width; // ≈ -0.3 (lip is left of centre)
      gsap.set(cup, { rotation: 0 });

      // the pour line: beside the statement on desktop, right of centre on stacked layouts
      const pourX = () => window.innerWidth * (stacked ? 0.58 : rtl ? 0.31 : 0.69);
      const slotBox = () => slotEl.getBoundingClientRect(); // the slot itself is never transformed
      const liftX = () => {
        const r = slotBox();
        return ((pourX() - lipRatio * r.width - (r.left + r.width / 2)) / r.width) * 100;
      };
      const liftY = (fracH: number) => () => {
        const r = slotBox();
        return ((window.innerHeight * fracH - (r.top + r.height / 2)) / r.width) * 100;
      };
      const liftOut = () => {
        const r = slotBox();
        return ((-0.85 * r.width - (r.top + r.height / 2)) / r.width) * 100;
      };

      gsap.set(pour, { flow: 0, reach: 0, cup: 1 });
      gsap.set(lift, { xPercent: 0, yPercent: 0 });
      if (world) gsap.set(world, { "--rv": "-26%" });

      // 0–25%: upright (only the scroll hint leaves)
      tl.to(hint, { autoAlpha: 0, yPercent: 60, duration: len(0.1), ease: "power1.in" }, at(0.04));
      // 22–30%: anticipation — lifted off the saucer, a small lean back
      tl.to(lift, { yPercent: -6, duration: len(0.08), ease: "power1.out" }, at(0.22));
      tl.to(cup, { rotation: 3, duration: len(0.08), ease: "sine.inOut" }, at(0.22));
      tl.to(saucer, { yPercent: 9, scale: 0.94, autoAlpha: 0, duration: len(0.09), ease: "power2.in" }, at(0.23));
      // 28–48%: the tilt — the hand carries the cup to the pour line and tips it over the lip
      tl.to(cup, { rotation: POUR_ANGLE - 3, duration: len(0.2), ease: "power2.inOut" }, at(0.28));
      tl.to(lift, { xPercent: liftX, yPercent: liftY(0.56), duration: len(0.2), ease: "sine.inOut" }, at(0.28));
      tl.to(cup, { rotation: POUR_ANGLE + 3, duration: len(0.1), ease: "sine.out" }, at(0.48)); // settle
      // 44–66%: coffee starts at the rim and falls the full height (accelerating head)
      tl.to(pour, { flow: 1, duration: len(0.14), ease: "power1.out" }, at(0.44));
      tl.to(pour, { reach: 1, duration: len(0.22), ease: "power2.in" }, at(0.45));
      // brand line clears once the pour is established
      tl.to(text, { yPercent: -10, duration: len(0.36), ease: "none" }, at(0.04));
      tl.to(text, { yPercent: -60, autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)", duration: len(0.14), ease: "power2.in" }, at(0.4));
      // 62–80%: cup rises a little and tips further — a longer, stronger stream
      tl.to(lift, { yPercent: liftY(0.3), duration: len(0.16), ease: "sine.inOut" }, at(0.62));
      tl.to(cup, { rotation: POUR_ANGLE - 7, duration: len(0.18), ease: "sine.inOut" }, at(0.62));
      tl.to(pour, { flow: 1.3, duration: len(0.18), ease: "sine.inOut" }, at(0.62));
      // 70–95%: the statement is opened from the stream outward (soft liquid-edged mask)
      tl.to(scenes[1], { autoAlpha: 1, yPercent: restOf(1).y, scale: 1, duration: len(0.12), ease: "power1.out" }, at(0.7));
      if (world) tl.to(world, { "--rv": "100%", duration: len(0.26), ease: "power1.inOut" }, at(0.7));
      // 86–100%: only now the cup leaves (up and out), still pouring; the stream stays
      tl.to(lift, { yPercent: liftOut, duration: len(0.14), ease: "power2.in" }, at(0.86));
      tl.to(cup, { rotation: POUR_ANGLE - 14, duration: len(0.14), ease: "sine.in" }, at(0.86));
      tl.to(pour, { flow: 1, duration: len(0.1), ease: "sine.inOut" }, at(0.9));
      tl.to(pour, { cup: 0, duration: len(0.08), ease: "sine.inOut" }, at(0.92));
      tl.set(scenes[0], { autoAlpha: 0 }, at(1.0));

      // ---- PRODUCT JOURNEY (P0 -> 1): approved choreography, rescaled ----
      const s2 = (1 - P0) / (n - 1);
      const B = (i: number) => P0 + (i - 1) * s2; // where scene i takes over
      const OV = s2 * 0.34; // product overlap window
      const driftTo = (i: number) => ({ x: restOf(i).x, y: restOf(i).y - 4 });

      for (let i = 1; i < n; i++) {
        const r = restOf(i);
        const pr = restOf(i - 1);

        if (i > 1) {
          const at = B(i) - OV / 2;
          const exDx = (r.x - pr.x) * 0.35; // outgoing drifts toward where the next one lives
          tl.to(scenes[i - 1], { xPercent: pr.x + exDx, yPercent: pr.y - 94, scale: 0.9, duration: OV, ease: "power1.in" }, at);
          tl.to(scenes[i - 1], { autoAlpha: 0, duration: OV * 0.5, ease: "power2.in" }, at);
          tl.fromTo(
            scenes[i],
            { xPercent: r.x, yPercent: r.y + 70, scale: 0.88, autoAlpha: 0 },
            { xPercent: r.x, yPercent: r.y, scale: 1, autoAlpha: 1, duration: OV, ease: "power2.out" },
            at + OV * 0.45
          );
        }

        // continuous drift through the hold, until this beat starts leaving
        const holdStart = i === 1 ? P0 : B(i) - OV / 2 + OV * 1.45;
        const nextExit = i < n - 1 ? B(i + 1) - OV / 2 : 1 - s2 * 0.42;
        const d = driftTo(i);
        if (nextExit - holdStart > 0.01) {
          tl.to(scenes[i], { xPercent: d.x, yPercent: d.y, duration: nextExit - holdStart, ease: "none" }, holdStart);
        }
      }

      // FINAL HAND-OFF: the last product drifts diagonally up and stays visible through
      // pin-release, coexisting with BrandIntro rising in underneath
      const last = restOf(n - 1);
      tl.to(
        scenes[n - 1],
        { xPercent: last.x + (stacked ? 0 : 9 * sx), yPercent: last.y - 12, scale: 0.95, autoAlpha: 0.8, duration: s2 * 0.42, ease: "power1.out" },
        1 - s2 * 0.42
      );
      tl.to({}, { duration: 0.001 }, 1); // anchor length to full scroll range
    }, section);
    // this pin is rebuilt when the language (dir) switches after the later sections already
    // measured themselves — re-sort and re-measure so they don't keep stale positions
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      Object.assign(pour, { flow: 0, reach: 0, cup: 1 });
    };
  }, [reduced, dir]);

  // reduced-motion: calm stacked read of the same content
  if (reduced) {
    return (
      <section id="hero" data-chapter-bg="#E9E0D1" className="py-24" dir={dir}>
        <div className="edge">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-clay">{t.hero.eyebrow}</span>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tightest text-ink sm:text-7xl">
            {t.hero.title1} <span className="text-clay">{t.hero.title2}</span>
          </h1>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <div key={p.name.en}>
                <div className="relative mx-auto aspect-square w-[70%] max-w-[240px]">
                  <Image src={src(p.image)} alt={p.name[lang]} fill sizes="30vw" className="object-contain" />
                </div>
                <p className="mt-4 font-display text-xl font-semibold text-ink">{p.name[lang]}</p>
                <p className="text-sm text-ink/55">{p.category[lang]}</p>
                <p className="mt-1 text-sm font-semibold text-clay">{p.price} {t.currency}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} id="hero" data-chapter-bg="#E9E0D1" className="relative h-screen w-full overflow-hidden" dir={dir} aria-label="128 Cafe & Bakery">
      {/* SCENE 0 — brand opening: the cup lifts, tilts and pours (PourCup + CoffeeStream) */}
      <div data-scene className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span data-open-text className="text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-espresso/80">{t.hero.eyebrow}</span>
        <h1 data-open-text className="mt-5 font-display text-ink">
          <span className="block text-[11vw] font-semibold leading-[0.9] tracking-tightest sm:text-[9vw] lg:text-[6.6vw]">{t.hero.title1}</span>
          <span className="block text-[11vw] font-semibold leading-[0.9] tracking-tightest text-clay sm:text-[9vw] lg:text-[6.6vw]">{t.hero.title2}</span>
        </h1>
        <PourCup alt="128 signature coffee" />
        <span data-open-hint className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-espresso/55">{t.hero.scroll}</span>
      </div>

      {/* SCENE 1 — product world identity (chapter 2): one clean typographic statement */}
      <div data-scene className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {/* where the poured coffee falls beside the statement */}
        <span
          data-stream
          aria-hidden
          className={`pointer-events-none absolute right-[42%] top-[62%] h-px w-px ${dir === "rtl" ? "lg:right-auto lg:left-[21%]" : "lg:right-[21%]"}`}
        />
        <h2
          data-world
          className="font-display text-ink"
          style={
            {
              "--rv": "100%",
              WebkitMaskImage: `linear-gradient(${dir === "rtl" ? "to right" : "to left"}, #000 var(--rv), transparent calc(var(--rv) + 26%))`,
              maskImage: `linear-gradient(${dir === "rtl" ? "to right" : "to left"}, #000 var(--rv), transparent calc(var(--rv) + 26%))`,
            } as React.CSSProperties
          }
        >
          {t.hero.world.map((w, i) => (
            <span
              key={i}
              className={`block text-[16vw] font-semibold leading-[0.86] tracking-tightest sm:text-[12vw] lg:text-[8.5vw] ${
                i === t.hero.world.length - 1 ? "text-clay" : ""
              }`}
            >
              {w}
            </span>
          ))}
        </h2>
      </div>

      {/* SCENES 2..7 — featured products, alternating composition */}
      {featured.map((p, i) => {
        const flip = i % 2 === 1;
        return (
          <div key={p.name.en} data-scene className="edge absolute inset-0 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            {/* product cut-out — dominant, no card */}
            <div className={`relative ${flip ? "lg:order-1 lg:col-span-7" : "lg:order-2 lg:col-span-7"}`}>
              <div data-prod className="relative mx-auto aspect-square w-[74%] max-w-[560px] lg:w-full">
                <Image src={src(p.image)} alt={p.name[lang]} fill sizes="(max-width:1024px) 74vw, 50vw" className="object-contain drop-shadow-[0_45px_70px_rgba(42,29,20,0.24)]" />
              </div>
            </div>
            {/* bound editorial type */}
            <div className={`${flip ? "lg:order-2 lg:col-span-5 lg:text-end" : "lg:order-1 lg:col-span-5 lg:text-start"} text-center lg:text-start`}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-espresso/70">{p.category[lang]}</span>
              <h2 className="mt-3 font-display text-[12vw] font-semibold leading-[0.9] tracking-tightest text-ink sm:text-[8vw] lg:text-[4.8vw]">{p.name[lang]}</h2>
              <p className={`mt-4 max-w-md text-base text-ink/65 ${flip ? "mx-auto lg:ms-auto lg:me-0" : "mx-auto lg:mx-0"}`}>{p.note[lang]}</p>
              <p className="mt-5 font-display text-3xl font-semibold text-clay">{p.price} <span className="text-lg text-ink/50">{t.currency}</span></p>
              {i === featured.length - 1 && (
                <a
                  href="#menu"
                  onClick={(e) => { e.preventDefault(); document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-espresso"
                >
                  {t.hero.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">→</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
