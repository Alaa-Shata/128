"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";

export default function Loader() {
  const { setReady, reduced, t, dir } = useApp();
  const [hidden, setHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const logoWrap = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finish = () => {
      setReady(true);
      setHidden(true);
    };

    if (reduced) {
      gsap.set([logoWrap.current], { opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" });
      const id = window.setTimeout(() => {
        gsap.to(root.current, { opacity: 0, duration: 0.5, onComplete: finish });
      }, 700);
      return () => window.clearTimeout(id);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const count = { v: 0 };

      tl.fromTo(
        logoWrap.current,
        { clipPath: "inset(0 0 100% 0)", scale: 0.96, opacity: 1 },
        { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.1, ease: "power3.out" }
      )
        .fromTo(
          [line1.current, line2.current],
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          count,
          {
            v: 128,
            duration: 2.1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current)
                counter.current.textContent = String(Math.round(count.v)).padStart(2, "0");
            },
          },
          0.2
        )
        .to({}, { duration: 0.25 })
        .to(
          root.current,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut", onComplete: finish },
          ">"
        );
    }, root);

    return () => ctx.revert();
  }, [reduced, setReady]);

  if (hidden) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper"
      aria-hidden="true"
    >
      <div ref={logoWrap} className="w-[min(46vw,230px)]">
        <Image
          src="/logo-mark.png"
          alt=""
          width={907}
          height={658}
          priority
          className="h-auto w-full"
        />
      </div>

      <div className="mt-10 overflow-hidden text-center" dir={dir}>
        <div className="overflow-hidden">
          <span ref={line1} className="font-display block text-sm font-medium tracking-[0.18em] text-ink sm:text-base">
            {t.loader.line1}
          </span>
        </div>
        <div className="overflow-hidden">
          <span ref={line2} className="font-display block text-sm font-medium tracking-[0.18em] text-clay sm:text-base">
            {t.loader.line2}
          </span>
        </div>
      </div>

      <span
        ref={counter}
        className="font-display absolute bottom-8 end-8 text-xs tabular-nums tracking-[0.2em] text-ink/40"
      >
        00
      </span>
    </div>
  );
}
