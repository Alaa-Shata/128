"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useApp } from "@/components/Providers";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { featured } from "@/lib/menu";

const N = featured.length;
// image field is a basename (→ .webp) unless it already carries an extension
const imgSrc = (img: string) => `/products/${img.includes(".") ? img : img + ".webp"}`;

export default function FeaturedProducts() {
  const { t, lang, dir, reduced } = useApp();
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: () => "+=" + window.innerHeight * (N * 0.85),
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(N - 1, Math.floor(self.progress * N));
        setActive((p) => (p === idx ? p : idx));
      },
    });
    return () => st.kill();
  }, [reduced]);

  if (reduced) {
    // reduced-motion: simple editorial grid, no pinning
    return (
      <section id="featured" className="bg-blush py-24" dir={dir}>
        <div className="edge">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
            {t.featured.kicker}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl">
            {t.featured.heading}
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-3">
            {featured.map((p) => (
              <div key={p.name.en} className="text-center">
                <div className="relative mx-auto aspect-square w-full max-w-[220px]">
                  <Image src={imgSrc(p.image)} alt={p.name[lang]} fill sizes="30vw" className="object-contain" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-ink">{p.name[lang]}</p>
                <p className="text-sm text-ink/55">{p.category[lang]}</p>
                <p className="mt-1 text-sm font-semibold text-clay">
                  {p.price} {t.currency}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      id="featured"
      className="relative h-screen overflow-hidden bg-blush"
      dir={dir}
    >
      <div className="edge absolute inset-x-0 top-24 z-10 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
          {t.featured.kicker}
        </span>
        <span className="font-display text-sm tabular-nums text-ink/50">
          {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
        </span>
      </div>

      <div className="edge relative z-10 grid h-full grid-cols-1 items-center gap-6 lg:grid-cols-2">
        {/* text side */}
        <div className="relative order-2 h-[36vh] lg:order-1 lg:h-[50vh]">
          {featured.map((p, i) => (
            <div
              key={p.name.en}
              className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-128 ${
                active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-espresso/70">
                {p.category[lang]}
              </span>
              <h3 className="mt-3 font-display text-[12vw] font-semibold leading-[0.92] tracking-tightest text-ink sm:text-[8vw] lg:text-[5vw]">
                {p.name[lang]}
              </h3>
              <p className="mt-4 max-w-md text-base text-ink/65">{p.note[lang]}</p>
              <p className="mt-5 font-display text-2xl font-semibold text-clay">
                {p.price} <span className="text-base text-ink/50">{t.currency}</span>
              </p>
            </div>
          ))}
        </div>

        {/* image side */}
        <div className="relative order-1 h-[42vh] lg:order-2 lg:h-[70vh]">
          {featured.map((p, i) => (
            <div
              key={p.name.en}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-128 ${
                active === i ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              <div className="relative h-full w-full translate-y-[2vh] lg:translate-y-[5vh]">
                <Image
                  src={imgSrc(p.image)}
                  alt={p.name[lang]}
                  fill
                  sizes="(max-width: 1024px) 70vw, 45vw"
                  className="object-contain drop-shadow-[0_35px_55px_rgba(58,35,23,0.22)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* progress rail */}
      <div className="edge absolute inset-x-0 bottom-10 flex gap-2">
        {featured.map((_, i) => (
          <span
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
              active >= i ? "bg-clay" : "bg-ink/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
