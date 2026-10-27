"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number; // kept for API compat; folded into the scrub window
  stagger?: number; // when set, animates direct children instead of self
  start?: string;
  end?: string;
};

/**
 * Unified editorial reveal for the whole V2 site.
 *
 * Instead of a one-shot fade-up, each block is SCROLL-SYNCED: a clip-path mask
 * wipes it in from below while it eases up and settles scale — tied to scroll
 * position (scrub), so motion flows continuously with the page rather than
 * popping once. Shared easing + distances keep every section on one rhythm.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 34,
  delay = 0,
  stagger,
  start = "top 90%",
  end = "top 58%",
}: Props) {
  const { reduced } = useApp();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, clipPath: "none" });
      return;
    }
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y, scale: 0.985, clipPath: "inset(0% 0% 100% 0%)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.out",
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: 1, // the reveal tracks scroll → continuous, reversible
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, y, delay, stagger, start, end]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
