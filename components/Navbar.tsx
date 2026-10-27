"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useApp } from "@/components/Providers";
import { gsap } from "@/lib/gsap";

const LINKS = [
  { key: "home", href: "#top" },
  { key: "menu", href: "#menu" },
  { key: "experience", href: "#experience" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;

export default function Navbar() {
  const { t, ready, toggleLang, lang } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // entrance once the loader releases
  useEffect(() => {
    if (!ready || !bar.current) return;
    gsap.fromTo(
      bar.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
    );
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const el = href === "#top" ? document.body : document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        ref={bar}
        style={{ opacity: ready ? undefined : 0 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-paper/85 shadow-[0_1px_0_rgba(14,14,12,0.08)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav className="edge flex h-16 items-center justify-between sm:h-20">
          <button
            onClick={() => go("#top")}
            aria-label="128 Cafe & Bakery — home"
            className="relative h-6 w-[76px] sm:h-7 sm:w-[90px]"
          >
            <Image src="/logo-mark.png" alt="128 Cafe & Bakery" fill className="object-contain object-left rtl:object-right" />
          </button>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => go(l.href)}
                className="group relative text-sm font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {t.nav[l.key]}
                <span className="absolute -bottom-1 start-0 h-px w-0 bg-clay transition-all duration-300 ease-128 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={toggleLang}
              aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              {t.nav.switch}
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLang}
              aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
              className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink"
            >
              {t.nav.switch}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
            >
              <span className="h-px w-6 bg-ink" />
              <span className="h-px w-6 bg-ink" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/30 transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 end-0 flex w-[82%] max-w-sm flex-col bg-paper px-8 pb-10 pt-6 transition-transform duration-500 ease-128 ${
            open ? "translate-x-0" : "rtl:-translate-x-full ltr:translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="relative h-6 w-[76px]">
              <Image src="/logo-mark.png" alt="128" fill className="object-contain object-left rtl:object-right" />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-2xl text-ink"
            >
              ✕
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-6">
            {LINKS.map((l, i) => (
              <button
                key={l.key}
                onClick={() => go(l.href)}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                className={`font-display text-start text-4xl font-medium text-ink transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {t.nav[l.key]}
              </button>
            ))}
          </nav>
          <div className="mt-auto text-sm text-ink/50">
            <p className="font-display">{t.footer.line1}</p>
            <p className="font-display text-clay">{t.footer.line2}</p>
          </div>
        </div>
      </div>
    </>
  );
}
