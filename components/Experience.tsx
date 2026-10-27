"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/Providers";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Gallery chapter — a continuation of the ProductJourney motion language.
 *
 * One pinned stage; a text beat then three image beats move through a shared
 * canvas. Each image rises in (position + clip), rests at its own spot on a
 * wandering path, drifts while it holds (never freezes) and travels out as the
 * next arrives — one dominant composition at a time, short overlap, no ghosts.
 * The opening beat is visible as the section scrolls in (so BrandIntro's visual
 * is still present as the first image arrives); the last image stays visible as
 * the dark 128 chapter rises in underneath. Reversible on scroll.
 */
const IMAGES = ["/products/so8.png", "/products/so9.png", "/products/so10.png", "/products/so11.png"];

export default function Experience() {
  const { t, dir, reduced } = useApp();
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-g-scene]");
      const n = scenes.length;
      // wandering rest path — each beat settles at a different spot on the canvas
      const REST = [
        { x: 0, y: 0 },   // 0 heading + first image
        { x: 8, y: -5 },  // 1 → upper-right
        { x: -9, y: 4 },  // 2 → lower-left
        { x: 7, y: 3 },   // 3 → right
      ];
      const restOf = (i: number) => REST[i] || { x: 0, y: 0 };

      gsap.set(scenes[0], { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 1 });
      scenes.forEach((s, i) => {
        if (i > 0) {
          const r = restOf(i);
          gsap.set(s, { xPercent: r.x, yPercent: r.y + 66, scale: 0.9, autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (window.innerWidth < 768 ? 3 : 4),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const slot = 1 / n;
      const OV = slot * 0.34; // short overlap (~8% here; 4 beats)
      // gentle continuous drift so a beat never freezes while it holds
      tl.to(scenes[0], { yPercent: -4, duration: slot * 0.8, ease: "none" }, 0);

      for (let i = 1; i < n; i++) {
        const r = restOf(i);
        const pr = restOf(i - 1);
        const at = i * slot - OV / 2;
        const exDx = (r.x - pr.x) * 0.35;
        // outgoing: travel farther out + scale down, fade in the first half (loses priority early)
        tl.to(scenes[i - 1], { xPercent: pr.x + exDx, yPercent: pr.y - 92, scale: 0.9, duration: OV, ease: "power1.in" }, at);
        tl.to(scenes[i - 1], { autoAlpha: 0, duration: OV * 0.5, ease: "power2.in" }, at);
        // incoming: delayed, rises in with a clip reveal to its rest spot
        tl.fromTo(
          scenes[i],
          { xPercent: r.x, yPercent: r.y + 68, scale: 0.9, autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
          { xPercent: r.x, yPercent: r.y, scale: 1, autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: OV, ease: "power2.out" },
          at + OV * 0.45
        );
        // continuous drift through the hold
        const holdStart = i * slot - OV / 2 + OV * 1.45;
        const nextExit = i < n - 1 ? (i + 1) * slot - OV / 2 : 1;
        if (nextExit - holdStart > 0.01) {
          tl.to(scenes[i], { yPercent: r.y - 4, duration: nextExit - holdStart, ease: "none" }, holdStart);
        }
      }
      tl.to({}, { duration: 0.001 }, 1); // anchor length
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  // reduced-motion: calm stacked read
  if (reduced) {
    return (
      <section id="experience" data-chapter-bg="#E9E0D1" className="py-24" dir={dir}>
        <div className="edge">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">{t.experience.kicker}</span>
          <h2 className="mt-5 font-display text-4xl font-semibold tracking-tightest text-ink sm:text-6xl">
            {t.experience.heading1} <span className="text-clay">{t.experience.heading2}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ink/65">{t.experience.body}</p>
          <div className="mt-12 flex flex-col gap-10">
            {IMAGES.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="128 café moment" className="w-full rounded-2xl object-cover" loading="lazy" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} id="experience" data-chapter-bg="#E9E0D1" className="relative h-screen w-full overflow-hidden" dir={dir}>
      {/* BEAT 0 — heading statement + first image */}
      <div data-g-scene className="edge absolute inset-0 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">{t.experience.kicker}</span>
          <h2 className="mt-5 font-display text-[11vw] font-semibold leading-[0.95] tracking-tightest text-ink sm:text-[7vw] lg:text-[4.2vw]">
            {t.experience.heading1}
            <br />
            <span className="text-clay">{t.experience.heading2}</span>
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-ink/65">{t.experience.body}</p>
        </div>
        <div className="lg:col-span-7">
          <div data-stream className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES[0]} alt="128 café moment" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* BEATS 1–3 — dominant single images handing off */}
      {IMAGES.slice(1).map((src) => (
        <div key={src} data-g-scene className="absolute inset-0 flex items-center justify-center">
          <div data-stream className="relative aspect-[16/9] w-[90vw] max-w-[1280px] overflow-hidden rounded-2xl bg-cream will-change-[transform,opacity] shadow-[0_40px_70px_rgba(42,29,20,0.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="128 café moment" className="h-full w-full object-cover" />
          </div>
        </div>
      ))}
    </section>
  );
}
