"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/Providers";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * V2 cinematic hero — one continuous, scroll-scrubbed opening chapter.
 *
 * The real 128 product-spread frame sequence plays on a canvas, but the motion
 * language is cinematic rather than a slideshow: the playhead EASES toward the
 * scroll position (seamless, bidirectional), a slow camera push-in + gentle
 * drift ride on top, a filmic vignette frames it, and the headline evolves
 * through 5 editorial stages with mask/blur reveals. Pinned ~450vh (desktop).
 */

const FRAME_COUNT = 192;
const EAGER = 24;
const frameUrl = (i: number) => `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;
const POSTER = frameUrl(95); // reduced-motion fallback

const STAGE_BOUNDS = [0.2, 0.4, 0.6, 0.8]; // 5 headline stages
const stageFor = (p: number) => {
  for (let i = 0; i < STAGE_BOUNDS.length; i++) if (p < STAGE_BOUNDS[i]) return i;
  return STAGE_BOUNDS.length;
};
const STAGE_X = [0, -14, 12, -8, 6]; // editorial asymmetry per stage
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function Hero() {
  const { t, ready, reduced, dir } = useApp();
  const story = t.hero.story;

  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textShell = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState(0);
  const shownRef = useRef(0);
  const targetRef = useRef(0);
  const animatingRef = useRef(false);

  // mask-reveal headline swap; re-checks target on finish → fast / reverse scroll settles
  const runText = () => {
    if (animatingRef.current) return;
    const el = textRef.current;
    if (!el || targetRef.current === shownRef.current) return;
    animatingRef.current = true;
    const next = targetRef.current;
    gsap
      .timeline({
        onComplete: () => {
          animatingRef.current = false;
          runText();
        },
      })
      .to(el, { autoAlpha: 0, y: -44, scale: 0.9, filter: "blur(10px)", duration: 0.45, ease: "power3.in" })
      .add(() => {
        shownRef.current = next;
        setStage(next);
        gsap.set(el, { xPercent: STAGE_X[next] });
      })
      .fromTo(
        el,
        { autoAlpha: 0, y: 52, scale: 1.1, filter: "blur(12px)", clipPath: "inset(0% 0% 100% 0%)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.out", immediateRender: false }
      );
  };

  // ---- canvas frame sequence (cinematic, eased scrub) ----
  useEffect(() => {
    if (reduced) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: false })!;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let scrollP = 0; // raw scroll progress 0..1
    let smoothP = 0; // eased progress → seamless continuous motion
    let raf = 0;

    const nearestReady = (idx: number) => {
      if (images[idx]?.complete && images[idx]!.naturalWidth) return idx;
      for (let d = 1; d < FRAME_COUNT; d++) {
        const lo = idx - d;
        const hi = idx + d;
        if (lo >= 0 && images[lo]?.complete && images[lo]!.naturalWidth) return lo;
        if (hi < FRAME_COUNT && images[hi]?.complete && images[hi]!.naturalWidth) return hi;
      }
      return -1;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // DPR cap
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (frameIdx: number, zoom: number, panX: number, panY: number) => {
      const idx = nearestReady(frameIdx);
      if (idx === -1) return;
      const img = images[idx]!;
      const cw = cv.clientWidth;
      const ch = cv.clientHeight;
      ctx.fillStyle = "#E9E0D1"; // cream — hides letterbox
      ctx.fillRect(0, 0, cw, ch);
      const base = Math.min(cw / img.naturalWidth, ch / img.naturalHeight); // contain
      const scale = base * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2 + panX, (ch - dh) / 2 + panY, dw, dh);
    };

    // expose eased progress so the text layer shares the same camera
    const tick = () => {
      smoothP += (scrollP - smoothP) * 0.1;
      if (Math.abs(scrollP - smoothP) < 0.0002) smoothP = scrollP;
      const frameIdx = Math.min(FRAME_COUNT - 1, Math.round(smoothP * (FRAME_COUNT - 1)));
      const zoom = 1 + smoothP * 0.28; // strong, dominant push-in
      const panX = Math.sin(smoothP * Math.PI * 1.5) * cv.clientWidth * 0.06; // reframe sweep
      const panY = (Math.sin(smoothP * Math.PI) * -0.05 + smoothP * -0.05) * cv.clientHeight; // drift + rise
      draw(frameIdx, zoom, panX, panY);
      // bind the headline to the same camera (parallax + shared scale), fully reversible
      if (textShell.current) {
        gsap.set(textShell.current, {
          yPercent: smoothP * -9,
          xPercent: Math.sin(smoothP * Math.PI * 1.5) * -3.2,
          scale: 1 + smoothP * 0.07,
        });
      }
      raf = requestAnimationFrame(tick);
    };

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.src = frameUrl(i);
        images[i] = im;
        im.onload = im.onerror = () => resolve();
      });

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    Promise.all(Array.from({ length: EAGER }, (_, i) => loadFrame(i))).then(() => {
      draw(0, 1, 0, 0);
      let i = EAGER;
      const loadNext = () => {
        const batch = Math.min(i + 8, FRAME_COUNT);
        const jobs = [];
        for (; i < batch; i++) jobs.push(loadFrame(i));
        Promise.all(jobs).then(() => {
          if (i < FRAME_COUNT) {
            if ("requestIdleCallback" in window) (window as any).requestIdleCallback(loadNext);
            else setTimeout(loadNext, 60);
          }
        });
      };
      loadNext();
    });

    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: () => "+=" + window.innerHeight * (window.innerWidth < 768 ? 3 : 4),
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollP = self.progress; // tick eases toward this
        const s = stageFor(scrollP);
        if (s !== targetRef.current) {
          targetRef.current = s;
          runText();
        }
        const chrome = 1 - clamp01(scrollP / 0.1);
        gsap.set([eyebrow.current, scrollHint.current], { opacity: chrome });
        gsap.set(cta.current, { opacity: clamp01((scrollP - 0.88) / 0.1) });
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      st.kill();
    };
  }, [reduced]);

  // intro reveal after loader
  useEffect(() => {
    if (!ready) return;
    gsap.fromTo(
      [eyebrow.current, textRef.current, scrollHint.current],
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.2 }
    );
  }, [ready]);

  return (
    <section
      ref={section}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-cream"
      aria-label="128 Cafe & Bakery"
    >
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={POSTER} alt="128 Cafe & Bakery — coffee, croissant and waffle" className="absolute inset-0 h-full w-full object-contain" />
      ) : (
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}

      {/* soft edges + centred cream glow for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/40 via-transparent to-cream/50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 56% 38% at 50% 48%, rgba(233,224,209,0.5) 0%, rgba(233,224,209,0) 64%)" }}
      />
      {/* cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 52%, rgba(58,35,23,0.20) 100%)" }}
      />


      {/* final beat: floating attribute cards settle in (reference ending), 128 pillars */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden>
          {t.intro.pillars.slice(0, 3).map((p, i) => {
            const pos = ["top-[40%] start-[5%]", "top-[58%] start-[9%]", "top-[47%] end-[6%]"][i];
            const isFinal = stage === story.length - 1;
            return (
              <div
                key={p}
                className={`absolute ${pos} rounded-2xl border border-ink/10 bg-paper/80 px-5 py-3 shadow-[0_18px_30px_rgba(42,29,20,0.12)] backdrop-blur-sm transition-all duration-700 ease-128 ${
                  isFinal ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: isFinal ? `${i * 110}ms` : "0ms" }}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-espresso">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  {p}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="edge pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
        dir={dir}
      >
        <div ref={eyebrow} className="mb-5">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-espresso/80">{t.hero.eyebrow}</span>
        </div>

        {/* headline bound to the camera via a parallax shell; only its CONTENT changes */}
        <div ref={textShell} className="relative w-full will-change-transform">
          <div className="relative w-full h-[54vw] sm:h-[40vw] lg:h-[32vw]">
            <div
              ref={textRef}
              className="absolute inset-0 flex flex-col items-center justify-center will-change-[transform,opacity,filter]"
            >
              <h1 className="font-display text-ink drop-shadow-[0_2px_18px_rgba(233,224,209,0.55)]">
                <span className="block text-[14vw] font-semibold leading-[0.9] tracking-tightest sm:text-[9.5vw] lg:text-[7.6vw]">
                  {story[stage].title1}
                </span>
                <span className="block text-[14vw] font-semibold leading-[0.9] tracking-tightest text-clay sm:text-[9.5vw] lg:text-[7.6vw]">
                  {story[stage].title2}
                </span>
                {story[stage].title3 ? (
                  <span className="block text-[14vw] font-semibold leading-[0.9] tracking-tightest text-espresso sm:text-[9.5vw] lg:text-[7.6vw]">
                    {story[stage].title3}
                  </span>
                ) : null}
              </h1>
            </div>
          </div>
        </div>

        <div ref={cta} className="pointer-events-auto absolute bottom-[12vh] opacity-0">
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-espresso"
          >
            {t.hero.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">→</span>
          </a>
        </div>
      </div>

      <div ref={scrollHint} className="pointer-events-none absolute bottom-7 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-espresso/60">{t.hero.scroll}</span>
      </div>
    </section>
  );
}
