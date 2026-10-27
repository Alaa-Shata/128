"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";
import { pour } from "@/lib/pour";

/**
 * The poured coffee — one liquid that leaves the opening cup and drives the page.
 *
 * BACK canvas (behind content): the falling stream. It starts at the lowest
 * point of the tilting cup's rim (read live from markers inside the rotating
 * cup), leaves it with a little outward velocity and falls under gravity. Its
 * shape is the HISTORY of where the source has been (a parcel d px down left the
 * source sqrt(2d/g) s ago), so when the source moves the bend travels down the
 * stream like real poured liquid. After the cup rises away the stream keeps
 * pouring from above, its source gliding to whichever product / gallery image
 * dominates (it passes behind them). Width thins as it accelerates, carries
 * moving surface ripples, and is shaded in bands (caramel translucent edge,
 * dark core, glossy specular with flowing glints).
 *
 * FRONT canvas (over content, only during transitions): the same coffee pools
 * into a glossy liquid surface — a wipe into "More than coffee.", a low pool as
 * the gallery begins, and a flood that turns the page to dark espresso before
 * the 128 moment. The stream lands in the wave. Everything is driven by live
 * scroll positions, so it reverses naturally.
 */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

type P = { x: number; y: number; w: number; nx: number; ny: number };

export default function CoffeeStream() {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const { reduced } = useApp();

  useEffect(() => {
    if (reduced) return;
    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return;
    const bx = back.getContext("2d");
    const fx = front.getContext("2d");
    if (!bx || !fx) return;

    let W = 0;
    let H = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [back, front]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      bx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const G = 5200; // screen gravity, px/s²
    const hist: { t: number; x: number }[] = [];
    let springX = W * 0.5;
    let springV = 0;
    let lastT = performance.now() / 1000;
    let targetCache = W * 0.5;
    let domCY = H * 0.5;
    let domEl: HTMLElement | null = null;
    let phoneK = 1; // stacked layouts (<1024): the stream only lives in the product journey (no free column beside copy)
    let backBlank = false;
    let frontBlank = false;

    const sampleHist = (tq: number) => {
      const n = hist.length;
      if (!n) return springX;
      if (tq >= hist[n - 1].t) return hist[n - 1].x;
      for (let i = n - 1; i > 0; i--) {
        const a = hist[i - 1];
        if (tq >= a.t) {
          const b = hist[i];
          return a.x + (b.x - a.x) * ((tq - a.t) / Math.max(1e-4, b.t - a.t));
        }
      }
      return hist[0].x;
    };

    const topOf = (id: string) => {
      const e = document.getElementById(id);
      return e ? e.getBoundingClientRect().top : 1e9;
    };

    // x of whatever product / image dominates the frame, weighted by its visibility
    const findTarget = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-prod],[data-stream]");
      let sw = 0;
      let sx = 0;
      let best = 0;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -H * 0.2 || r.top > H * 1.2) return;
        const scene = el.closest<HTMLElement>("[data-scene],[data-g-scene]");
        let a = 1;
        if (scene) {
          const cs = getComputedStyle(scene);
          a = cs.visibility === "hidden" ? 0 : parseFloat(cs.opacity);
        }
        if (a <= 0.02) return;
        const cy = (r.top + r.bottom) / 2;
        const w = a * a * Math.exp(-Math.pow((cy - H * 0.5) / (H * 0.55), 2));
        // aim at the product's OUTER edge (away from the copy): the pour slips behind
        // the silhouette and reappears below it, instead of skewering the centre
        const cx = (r.left + r.right) / 2;
        const side = cx < W * 0.42 ? -1 : 1;
        sw += w;
        const m = W < 768 ? 0.08 : 0.14;
        sx += w * Math.min(W * (1 - m), Math.max(W * m, cx + side * 0.24 * r.width));
        if (w > best) {
          best = w;
          domCY = cy;
          domEl = el;
        }
      });
      if (sw > 1e-3) targetCache = sx / sw;
      return targetCache;
    };

    // lowest rim point of the (rotating) cup = where the coffee leaves it
    const lipPoint = (inset: number) => {
      let best: { x: number; y: number } | null = null;
      document.querySelectorAll<HTMLElement>("[data-pour-lip]").forEach((m) => {
        const r = m.getBoundingClientRect();
        const p = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        if (!best || p.y > best.y) best = p;
      });
      const c = document.querySelector<HTMLElement>("[data-pour-center]");
      if (best && c) {
        const b = best as { x: number; y: number };
        const r = c.getBoundingClientRect();
        const dx = r.left - b.x;
        const dy = r.top - b.y;
        const L = Math.hypot(dx, dy) || 1;
        best = { x: b.x + (dx / L) * inset, y: b.y + (dy / L) * inset };
      }
      return best as { x: number; y: number } | null;
    };

    // ---- stream geometry helpers ----
    const band = (c: CanvasRenderingContext2D, pts: P[], o1: number, o2: number) => {
      c.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const h = p.w * 0.5;
        const x = p.x + p.nx * h * o1;
        const y = p.y + p.ny * h * o1;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        const h = p.w * 0.5;
        c.lineTo(p.x + p.nx * h * o2, p.y + p.ny * h * o2);
      }
      c.closePath();
    };
    const line = (c: CanvasRenderingContext2D, pts: P[], o: number) => {
      c.beginPath();
      pts.forEach((p, i) => {
        const h = p.w * 0.5;
        const x = p.x + p.nx * h * o;
        const y = p.y + p.ny * h * o;
        if (i) c.lineTo(x, y);
        else c.moveTo(x, y);
      });
    };

    /**
     * One falling column of coffee, shaded as a glossy cylinder lit from the upper left
     * (+ offsets = lit side): translucent amber rim, core shadow right of centre, a
     * continuous crisp specular with brighter glints racing down it, and — at the lip —
     * a wider crema-tinted sheet where the coffee rolls over the rim.
     */
    const drawStream = (c: CanvasRenderingContext2D, pts: P[], alpha: number, lipK: number, growing: boolean, srcY: number, t: number) => {
      c.save();
      c.globalAlpha = alpha;
      // soft cast shadow on the page
      c.save();
      c.filter = "blur(7px)";
      c.translate(8, 5);
      band(c, pts, -1, 1);
      c.fillStyle = "rgba(60,34,16,0.13)";
      c.fill();
      c.restore();
      // translucent amber skin (light shines through the thin edges)
      band(c, pts, -1, 1);
      c.fillStyle = "rgba(128,66,24,0.9)";
      c.fill();
      // body: smooth falloff into a core shadow right of centre
      c.save();
      c.filter = "blur(0.8px)";
      band(c, pts, -0.9, 0.93);
      c.fillStyle = "#5c2b0f";
      c.fill();
      band(c, pts, -0.8, 0.66);
      c.fillStyle = "#3e1c09";
      c.fill();
      band(c, pts, -0.62, 0.34);
      c.fillStyle = "#2a1206";
      c.fill();
      band(c, pts, -0.42, 0.06);
      c.fillStyle = "#1b0a03";
      c.fill();
      c.restore();
      // back-light glow along the shadow edge
      band(c, pts, -0.96, -0.74);
      c.fillStyle = "rgba(232,160,96,0.34)";
      c.fill();
      // broad warm sheen on the lit side
      c.save();
      c.filter = "blur(1.6px)";
      band(c, pts, 0.24, 0.86);
      c.fillStyle = "rgba(222,150,88,0.32)";
      c.fill();
      c.restore();
      const w0 = pts[Math.min(pts.length - 1, 30)].w;
      // continuous crisp specular — what makes it read as wet and round
      line(c, pts, 0.56);
      c.lineCap = "round";
      c.lineJoin = "round";
      c.lineWidth = Math.max(1.4, w0 * 0.085);
      c.strokeStyle = "rgba(255,240,220,0.62)";
      c.stroke();
      // brighter glints travelling down with the flow
      c.save();
      c.filter = "blur(0.9px)";
      line(c, pts, 0.54);
      c.lineWidth = Math.max(2, w0 * 0.13);
      c.setLineDash([42, 30, 96, 44, 20, 70]);
      c.lineDashOffset = -t * 640;
      c.strokeStyle = "rgba(255,250,240,0.6)";
      c.stroke();
      c.setLineDash([]);
      c.restore();
      // faint inner flow lines
      line(c, pts, 0.12);
      c.lineWidth = Math.max(1, w0 * 0.05);
      c.setLineDash([60, 40, 26, 90]);
      c.lineDashOffset = -t * 700;
      c.strokeStyle = "rgba(255,214,170,0.13)";
      c.stroke();
      c.setLineDash([]);
      // the lip: coffee rolling over the rim is lighter (crema) and spread into a sheet
      if (lipK > 0.01) {
        const n = Math.min(pts.length, 12);
        const lg = c.createLinearGradient(0, srcY - 4, 0, srcY + 46);
        lg.addColorStop(0, `rgba(204,128,64,${0.95 * lipK})`);
        lg.addColorStop(0.45, `rgba(150,86,38,${0.55 * lipK})`);
        lg.addColorStop(1, "rgba(120,62,22,0)");
        band(c, pts.slice(0, n), -1, 1);
        c.fillStyle = lg;
        c.fill();
        // melt the stream's top edge into the crema ring it rolls out of (no hard cut)
        const a = pts[0];
        c.save();
        c.globalCompositeOperation = "destination-out";
        const eg = c.createLinearGradient(0, srcY - 2, 0, srcY + 12);
        eg.addColorStop(0, `rgba(0,0,0,${lipK})`);
        eg.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = eg;
        c.fillRect(a.x - a.w * 2, srcY - 30, a.w * 4, 42);
        c.restore();
      }
      // heavy leading drop while the first pour is still falling
      if (growing && pts.length > 14) {
        const tip = pts[pts.length - 1];
        const r = Math.min(tip.w, pts[14].w) * 0.56; // sized from the stream, never the wide lip sheet
        // teardrop head: same skin/core as the stream, merging into it
        c.beginPath();
        c.ellipse(tip.x, tip.y - r * 0.3, r, r * 1.55, 0, 0, Math.PI * 2);
        c.fillStyle = "rgba(128,66,24,0.9)";
        c.fill();
        c.beginPath();
        c.ellipse(tip.x - r * 0.15, tip.y - r * 0.3, r * 0.72, r * 1.35, 0, 0, Math.PI * 2);
        c.fillStyle = "#2a1206";
        c.fill();
        c.beginPath();
        c.ellipse(tip.x + r * 0.4, tip.y - r * 0.55, r * 0.14, r * 0.42, 0, 0, Math.PI * 2);
        c.fillStyle = "rgba(255,240,220,0.55)";
        c.fill();
      }
      c.restore();
    };

    // ---- liquid surface (front canvas) ----
    const drawWave = (level: number, kind: "wipe" | "pool" | "flood", alpha: number, t: number, sx: number | null) => {
      const A = kind === "flood" ? 20 : kind === "pool" ? 8 : 15;
      const yAt = (x: number) => {
        let y =
          level +
          A * (0.55 * Math.sin(x * 0.0085 + t * 1.05) + 0.3 * Math.sin(x * 0.019 - t * 0.8 + 1.3) + 0.15 * Math.sin(x * 0.041 + t * 1.9));
        if (sx !== null) {
          const dd = Math.abs(x - sx);
          y += 6 * Math.cos(dd * 0.075 - t * 7) * Math.exp(-dd / 75); // rings where the stream lands
        }
        return y;
      };
      const crest: [number, number][] = [];
      for (let x = -10; x <= W + 10; x += 8) crest.push([x, yAt(x)]);

      fx.save();
      fx.globalAlpha = alpha;
      // body
      fx.beginPath();
      fx.moveTo(-10, H + 20);
      crest.forEach(([x, y]) => fx.lineTo(x, y));
      fx.lineTo(W + 10, H + 20);
      fx.closePath();
      const depth = kind === "flood" ? Math.max(260, H * 0.8) : 230;
      const g = fx.createLinearGradient(0, level - A - 8, 0, level + depth);
      g.addColorStop(0, "rgba(176,104,50,0.9)"); // thin translucent caramel at the crest
      g.addColorStop(0.06, "#6d3a17");
      g.addColorStop(0.24, "#3b1e0c");
      g.addColorStop(1, kind === "flood" ? "#2a1d14" : "#1d0f06");
      fx.fillStyle = g;
      fx.fill();

      const strokeCrest = (off: number) => {
        fx.beginPath();
        crest.forEach(([x, y], i) => (i ? fx.lineTo(x, y + off) : fx.moveTo(x, y + off)));
      };
      // crema lip just under the crest
      strokeCrest(2);
      fx.lineWidth = 3;
      fx.strokeStyle = "rgba(201,142,82,0.55)";
      fx.stroke();
      // broken glossy glints along the crest (not a uniform outline)
      strokeCrest(3.5);
      fx.lineWidth = 1.3;
      fx.setLineDash([46, 30, 14, 52]);
      fx.lineDashOffset = -t * 38;
      fx.strokeStyle = "rgba(255,238,212,0.8)";
      fx.stroke();
      fx.setLineDash([]);
      // soft sheen band a little below the surface
      strokeCrest(16);
      fx.lineWidth = 16;
      fx.strokeStyle = "rgba(255,214,168,0.06)";
      fx.stroke();
      // a couple of slow drifting reflections on the surface
      for (let k = 0; k < 3; k++) {
        const rx = ((t * (18 + k * 7) + k * 410) % (W + 400)) - 200;
        const ry = yAt(rx) + 34 + k * 26;
        const rg = fx.createRadialGradient(rx, ry, 0, rx, ry, 120 - k * 20);
        rg.addColorStop(0, "rgba(255,220,180,0.08)");
        rg.addColorStop(1, "rgba(255,220,180,0)");
        fx.fillStyle = rg;
        fx.beginPath();
        fx.ellipse(rx, ry, 130 - k * 20, 16, 0, 0, Math.PI * 2);
        fx.fill();
      }
      fx.restore();
      return yAt;
    };

    const frame = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - lastT));
      lastT = now;
      const t = now;

      // chapter transitions (live positions → reversible)
      const pa = clamp01((H - topOf("about")) / (0.95 * H));
      const pg = clamp01((H - topOf("experience")) / (0.8 * H));
      const pm = clamp01((H - topOf("moment")) / (0.85 * H));

      let wave: { level: number; kind: "wipe" | "pool" | "flood"; alpha: number } | null = null;
      if (pm > 0 && pm < 1) {
        wave = { level: lerp(H + 40, -90, easeInOut(clamp01(pm / 0.55))), kind: "flood", alpha: 1 - sstep(0.6, 0.92, pm) };
      } else if (pa > 0 && pa < 1) {
        const lv = pa < 0.42 ? lerp(H + 40, H * 0.3, easeOut(pa / 0.42)) : pa < 0.5 ? H * 0.3 : lerp(H * 0.3, H + 80, easeIn((pa - 0.5) / 0.45));
        wave = { level: lv, kind: "wipe", alpha: 1 };
      } else if (pg > 0 && pg < 1) {
        const lv = pg < 0.4 ? lerp(H + 20, H * 0.95, easeOut(pg / 0.4)) : lerp(H * 0.95, H + 40, easeIn((pg - 0.4) / 0.5));
        wave = { level: lv, kind: "pool", alpha: 1 };
      }

      // ---- source of the stream ----
      const cupK = clamp01(pour.cup);
      const frontPour = W >= 1024; // stacked layouts keep the pour behind the copy
      const lip = cupK > 0.001 && pour.flow > 0.001 ? lipPoint(frontPour ? 9 : 7) : null;
      const tX = findTarget();
      const om = 6.5; // critically damped spring → the pour glides between products
      if (lip) {
        // anchored to the cup: the source IS the lip, even while the cup rises out of frame
        springX = lip.x;
        springV = 0;
      } else {
        const wander = W * 0.012 * Math.sin(t * 0.45) + W * 0.005 * Math.sin(t * 1.1 + 1); // never a static pole
        springV += (-om * om * (springX - tX - wander) - 2 * om * springV) * dt;
        springX += springV * dt;
      }
      const srcX = springX;
      const srcY = lip ? Math.max(lip.y, -400) : -60;
      hist.push({ t, x: srcX });
      while (hist.length > 2 && hist[0].t < t - 1.5) hist.shift();

      const streamOn = pour.flow > 0.001 && pm < 0.62;
      const onFront = streamOn && lip !== null && frontPour; // opening: pour drawn over the cup
      let pts: P[] = [];
      let sAlpha = 1;
      let growing = false;

      if (streamOn) {
        const inHero = !!domEl && !!domEl.closest("#hero");
        phoneK += ((W >= 1024 || inHero || lip ? 1 : 0) - phoneK) * Math.min(1, dt * 5);
        sAlpha = (1 - sstep(0.5, 0.62, pm)) * phoneK;
        const scaleW = Math.min(1.25, Math.max(0.62, W / 1440));
        // with the cup on screen the stream is sized from the cup itself (~1/10 of its width)
        const slot = lip ? document.querySelector<HTMLElement>("[data-pour-slot]") : null;
        const cupW = slot ? slot.getBoundingClientRect().width * 0.1 : 0;
        const baseW = lerp(24 * scaleW, Math.max(cupW, 16), cupK) * (1 + 0.35 * sstep(0.1, 0.5, pm));
        const flowK = Math.sqrt(Math.min(1.4, Math.max(0, pour.flow)));
        growing = lip !== null && pour.reach < 0.999;
        let end = growing ? srcY + clamp01(pour.reach) * (H + 120 - srcY) : H + 120;
        if (W < 1024 && !lip && domEl && domEl.getBoundingClientRect().width > 40) end = Math.min(end, domCY); // stacked layouts: the pour disappears behind the product, never across the copy

        const v0x = -240 * cupK; // poured liquid leaves the lip moving outward, then gravity takes over
        const step = 4;
        let crestAt: ((x: number) => number) | null = null;
        if (wave) {
          const A = wave.level; // the stream ends where it lands in the wave
          crestAt = (x: number) => A + 15 * (0.55 * Math.sin(x * 0.0085 + t * 1.05) + 0.3 * Math.sin(x * 0.019 - t * 0.8 + 1.3));
        }
        for (let d = 0; d < 4000; d += step) {
          const tau = Math.sqrt((2 * d) / G);
          // slow sway + a sinuous wobble that travels down with the liquid
          const sway = (3 * Math.sin(t * 1.3 + d * 0.011) + 1.6 * Math.sin((d - t * 520) / 70)) * Math.min(1, d / 160);
          const x = sampleHist(t - tau) + v0x * tau * Math.exp(-tau * 1.6) + sway;
          const y = srcY + d;
          const v = Math.sqrt(420 * 420 + 2 * G * d);
          const thin = lerp(0.82 + 0.18 * Math.pow(420 / v, 0.3), Math.pow(420 / v, 0.22), cupK); // accelerating liquid narrows
          const sheet = 1 + 0.6 * Math.exp(-d / 14) * cupK; // spread into a sheet right at the rim
          const ph = (d - t * 560) / (baseW * 2.4);
          const amp = 0.035 + 0.075 * Math.min(1, d / 520); // surface undulation grows as it falls
          const rip = 1 + Math.min(1, d / 30) * (amp * Math.sin(ph * Math.PI * 2) + amp * 0.45 * Math.sin(ph * 2.6 * Math.PI * 2 + 1.7));
          pts.push({ x, y, w: baseW * flowK * thin * sheet * rip, nx: 0, ny: 0 });
          const stopY = crestAt ? Math.min(end, crestAt(x) + 4) : end;
          if (y >= stopY) break;
        }
        for (let i = 0; i < pts.length; i++) {
          const a = pts[Math.max(0, i - 1)];
          const b = pts[Math.min(pts.length - 1, i + 1)];
          const tx = b.x - a.x;
          const ty = b.y - a.y;
          const L = Math.hypot(tx, ty) || 1;
          pts[i].nx = -ty / L; // normal points to the lit (left) side
          pts[i].ny = tx / L;
        }
      }
      const hasPts = streamOn && pts.length > 2;

      // ================= BACK: the stream behind the content =================
      if (hasPts && !onFront) {
        backBlank = false;
        bx.clearRect(0, 0, W, H);
        drawStream(bx, pts, sAlpha, lip ? cupK : 0, growing, srcY, t);
      } else if (!backBlank) {
        bx.clearRect(0, 0, W, H);
        backBlank = true;
      }

      // ================= FRONT: the opening pour + liquid surfaces =================
      const waveOn = !!wave && wave.level < H + 30;
      if ((hasPts && onFront) || waveOn) {
        frontBlank = false;
        fx.clearRect(0, 0, W, H);
        if (hasPts && onFront) drawStream(fx, pts, sAlpha, cupK, growing, srcY, t);
        if (wave && waveOn) drawWave(wave.level, wave.kind, wave.alpha, t, streamOn ? springX : null);
      } else if (!frontBlank) {
        fx.clearRect(0, 0, W, H);
        frontBlank = true;
      }
    };

    gsap.ticker.add(frame);
    return () => {
      gsap.ticker.remove(frame);
      window.removeEventListener("resize", size);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <>
      <canvas ref={backRef} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] h-full w-full" />
      <canvas ref={frontRef} aria-hidden className="pointer-events-none fixed inset-0 z-[30] h-full w-full" />
    </>
  );
}
