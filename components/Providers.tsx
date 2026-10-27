"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { dictionary, type Dict, type Lang } from "@/lib/dictionary";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type AppState = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  ready: boolean;
  setReady: (r: boolean) => void;
  reduced: boolean;
};

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <Providers>");
  return ctx;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  // restore saved language + reduced-motion preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("128-lang") as Lang | null;
      if (saved === "en" || saved === "ar") setLangState(saved);
    } catch {}
    setReduced(prefersReducedMotion());
  }, []);

  // reflect language on <html> and persist
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem("128-lang", lang);
    } catch {}
    // layout changes with direction — let pinned triggers recompute
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lang, dir]);

  // Lenis smooth scroll wired to GSAP's ticker + ScrollTrigger
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // lock scroll while the loader is active
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!ready) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      // layout is now final — recompute pinned triggers
      window.setTimeout(() => ScrollTrigger.refresh(), 100);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((p) => (p === "en" ? "ar" : "en"));

  const value: AppState = {
    lang,
    dir,
    t: dictionary[lang],
    setLang,
    toggleLang,
    ready,
    setReady,
    reduced,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
