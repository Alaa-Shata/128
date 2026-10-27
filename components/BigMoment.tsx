"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";

const DIGITS = ["1", "2", "8"];
const FILL = "/frames/frame-0096.webp";

export default function BigMoment() {
  const { t, reduced, dir } = useApp();
  const section = useRef<HTMLElement>(null);
  const solid = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const digits = gsap.utils.toArray<HTMLElement>("[data-digit]");
      const speeds = [-10, 14, -8];
      digits.forEach((d, i) => {
        gsap.fromTo(
          d,
          { yPercent: speeds[i] },
          {
            yPercent: -speeds[i],
            ease: "none",
            scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
      // image-filled numerals resolve into clean type
      gsap.fromTo(
        solid.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "center bottom", end: "center center", scrub: true },
        }
      );
      gsap.fromTo(
        caption.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: caption.current, start: "top 92%", end: "top 62%", scrub: 1 },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="moment"
      data-chapter-bg="#2A1D14"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden py-24"
      dir={dir}
    >
      <div className="relative flex items-center justify-center" aria-label="128" dir="ltr">
        <div className="flex">
          {DIGITS.map((d, i) => (
            <span
              key={i}
              data-digit
              aria-hidden
              className="font-display text-[34vw] font-bold leading-[0.8] tracking-tightest text-transparent lg:text-[26vw]"
              style={{
                backgroundImage: reduced ? undefined : `url(${FILL})`,
                backgroundSize: "300% 100%",
                backgroundPosition: `${i * 50}% 40%`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: reduced ? "#FAF7F2" : "transparent",
              }}
            >
              {d}
            </span>
          ))}
        </div>
        {/* clean resolved numerals */}
        <div
          ref={solid}
          aria-hidden
          className="font-display pointer-events-none absolute inset-0 flex items-center justify-center text-[34vw] font-bold leading-[0.8] tracking-tightest text-paper lg:text-[26vw]"
        >
          128
        </div>
      </div>

      <div ref={caption} className="mt-8 text-center">
        <p className="font-display text-xl font-medium tracking-[0.1em] text-paper sm:text-3xl">
          {t.moment.line}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.4em] text-clay">{t.moment.caption}</p>
      </div>
    </section>
  );
}
