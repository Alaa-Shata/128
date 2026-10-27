"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";

export default function BrandIntro() {
  const { t, reduced, dir } = useApp();
  const section = useRef<HTMLElement>(null);
  const watermark = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(watermark.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      // the faint 128 graphic fades in AS the section enters — part of the cross-section
      // hand-off from ProductJourney's exiting product.
      gsap.fromTo(
        watermark.current,
        { autoAlpha: 0, scale: 0.94 },
        { autoAlpha: 1, scale: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "top 55%", scrub: true } }
      );
      gsap.fromTo(
        image.current,
        { scale: 0.86, yPercent: 8 },
        {
          scale: 1.02,
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="about"
      data-chapter-bg="#E9E0D1"
      className="relative overflow-hidden py-28 sm:py-40"
      dir={dir}
    >
      {/* oversized 128 watermark */}
      <div
        ref={watermark}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center"
      >
        <span
          className="font-display text-[42vw] font-bold leading-none tracking-tightest text-transparent lg:text-[34vw]"
          style={{ WebkitTextStroke: "1.5px rgba(181,106,79,0.16)" }}
        >
          128
        </span>
      </div>

      <div className="edge relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
              {t.intro.kicker}
            </span>
          </Reveal>
          <div className="mt-6 overflow-hidden">
            {/* "More than coffee." rises in as the section enters → coexists with the exiting product */}
            <Reveal y={80} start="top bottom" end="top 55%">
              <h2 className="font-display text-[12vw] font-semibold leading-[0.95] tracking-tightest text-ink sm:text-[8vw] lg:text-[5.4vw]">
                {t.intro.heading}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">{t.intro.body}</p>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-x-6 gap-y-3" stagger={0.08}>
            {t.intro.pillars.map((p) => (
              <span key={p} className="flex items-center gap-2 text-sm font-medium text-espresso">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                {p}
              </span>
            ))}
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <div ref={image} data-stream className="relative mx-auto aspect-[4/5] w-[78%] max-w-sm">
            <Image
              src="/products/so1.png"
              alt="128 signature dessert"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-contain drop-shadow-[0_30px_40px_rgba(58,35,23,0.18)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
