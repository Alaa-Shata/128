"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useApp } from "@/components/Providers";
import { primaryCategories, allCategories } from "@/lib/menu";

export default function MenuUniverse() {
  const { t, lang, dir } = useApp();
  const [active, setActive] = useState(0);

  return (
    <section id="menu" data-chapter-bg="#0E0E0C" className="relative py-24 text-paper sm:py-32" dir={dir}>
      <div className="edge">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
                {t.menu.kicker}
              </span>
            </Reveal>
            <Reveal y={40}>
              <h2 className="mt-4 font-display text-[11vw] font-semibold leading-[0.95] tracking-tightest sm:text-[6vw] lg:text-[4.4vw]">
                {t.menu.heading}
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <p className="text-sm text-paper/55">{t.menu.sub}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* image panel */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto aspect-square w-[70%] max-w-md lg:w-full">
                {primaryCategories.map((c, i) => (
                  <Image
                    key={c.id}
                    src={`/products/${c.image?.includes(".") ? c.image : c.image + ".webp"}`}
                    alt={c.name[lang]}
                    fill
                    sizes="(max-width: 1024px) 60vw, 35vw"
                    className={`object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-128 ${
                      active === i ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                  />
                ))}
                <span
                  aria-hidden
                  className="font-display pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-[36vw] font-bold leading-none text-paper/[0.04] lg:text-[18vw]"
                >
                  {String(active + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-6 text-center lg:text-start">
                <p className="font-display text-xl font-semibold">{primaryCategories[active].name[lang]}</p>
                <p className="mt-1 text-sm text-paper/55">{primaryCategories[active].tagline[lang]}</p>
              </div>
            </div>
          </div>

          {/* category list */}
          <ul className="order-2 divide-y divide-paper/10 lg:order-1 lg:col-span-7">
            {primaryCategories.map((c, i) => (
              <li key={c.id}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className="group flex w-full items-baseline gap-5 py-6 text-start transition-colors sm:py-7"
                >
                  <span
                    className={`font-display text-sm tabular-nums transition-colors ${
                      active === i ? "text-clay" : "text-paper/35"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-[9vw] font-medium leading-none tracking-tight transition-all duration-300 ease-128 sm:text-[5vw] lg:text-[3.4vw] ${
                      active === i ? "text-paper translate-x-2 rtl:-translate-x-2" : "text-paper/55"
                    }`}
                  >
                    {c.name[lang]}
                  </span>
                  <span
                    className={`ms-auto hidden text-2xl text-clay transition-all duration-300 sm:block ${
                      active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 rtl:translate-x-2"
                    }`}
                  >
                    <span className="rtl:inline-block rtl:rotate-180">→</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* secondary full index + CTA */}
        <div className="mt-16 border-t border-paper/10 pt-10">
          <Reveal className="flex flex-wrap gap-x-5 gap-y-2" stagger={0.03}>
            {allCategories.map((c) => (
              <span key={c.en} className="text-sm text-paper/45">
                {c[lang]}
              </span>
            ))}
          </Reveal>
          <div className="mt-10">
            <a
              href="/menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              {t.menu.viewAll}
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:inline-block rtl:rotate-180 rtl:group-hover:-translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
