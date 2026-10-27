"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/Providers";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * One backdrop for the entire page.
 *
 * A single fixed layer whose colour is interpolated every frame from the
 * positions of the chapter sections — cream through the product chapters,
 * darkening into the 128 moment + menu, then lightening again for contact.
 * Each chapter sets its bg transparent and tags itself with
 * data-chapter-bg="<hex>"; the page then reads as one evolving surface rather
 * than stacked boxes with hard edges. Continuous and reversible.
 */

const hex = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function ContinuousBackdrop() {
  const el = useRef<HTMLDivElement>(null);
  const { reduced } = useApp();

  useEffect(() => {
    const bg = el.current;
    if (!bg) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-bg]"));
    if (!nodes.length) return;
    const cols = nodes.map((n) => hex(n.dataset.chapterBg || "#E9E0D1"));

    const setColor = (rgb: number[]) => {
      bg.style.backgroundColor = `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
    };
    setColor(cols[0]);
    if (reduced) return;

    const update = () => {
      const ih = window.innerHeight;
      const line = ih * 0.5; // which chapter "owns" the surface
      // colour transitions late — only once the next chapter is well into view — so the
      // outgoing chapter's text has cleared before the surface changes under it.
      const top = ih * 0.55;
      const band = ih * 0.45;
      let idx = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].getBoundingClientRect().top <= line) idx = i;
      }
      const cur = cols[idx];
      const next = nodes[idx + 1];
      if (!next) {
        setColor(cur);
        return;
      }
      const nextTop = next.getBoundingClientRect().top;
      const t = clamp01((top - nextTop) / band); // 0 until next reaches 0.55vh → 1 by 0.1vh
      setColor([cur[0] + (cols[idx + 1][0] - cur[0]) * t, cur[1] + (cols[idx + 1][1] - cur[1]) * t, cur[2] + (cols[idx + 1][2] - cur[2]) * t]);
    };

    // run every frame — independent of Lenis / ScrollTrigger scroll wiring
    gsap.ticker.add(update);
    update();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      window.clearTimeout(id);
      gsap.ticker.remove(update);
    };
  }, [reduced]);

  return <div ref={el} className="fixed inset-0 -z-10" aria-hidden />;
}
