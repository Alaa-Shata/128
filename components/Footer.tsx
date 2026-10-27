"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useApp } from "@/components/Providers";
import { CONTACT } from "@/lib/menu";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/Icons";

export default function Footer() {
  const { t, lang, toggleLang, dir } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink py-16 text-paper" dir={dir}>
      <Reveal className="edge" y={28}>
        <div className="flex flex-col gap-10 border-b border-paper/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="relative h-8 w-24">
              <Image src="/logo-mark-light.png" alt="128 Cafe & Bakery" fill className="object-contain object-left rtl:object-right" />
            </div>
            <p className="mt-6 font-display text-2xl font-medium leading-tight">
              {t.footer.line1}
              <br />
              <span className="text-clay">{t.footer.line2}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { label: "Facebook", href: CONTACT.facebook, Icon: FacebookIcon },
              { label: "Instagram", href: CONTACT.instagram, Icon: InstagramIcon },
              { label: "TikTok", href: CONTACT.tiktok, Icon: TiktokIcon },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper transition-all duration-300 hover:-rotate-6 hover:scale-105 hover:border-clay hover:text-clay"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <span>{t.footer.crafted}</span>
            <button
              onClick={toggleLang}
              className="rounded-full border border-paper/20 px-4 py-1.5 text-xs font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
