"use client";

import Reveal from "@/components/Reveal";
import { useApp } from "@/components/Providers";
import { CONTACT } from "@/lib/menu";
import {
  PhoneIcon,
  WhatsappIcon,
  MailIcon,
  PinIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
} from "@/components/Icons";

const INTL = "+201096781000";

export default function VisitContact() {
  const { t, lang, dir } = useApp();

  const socials = [
    { label: "Facebook", href: CONTACT.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: CONTACT.instagram, Icon: InstagramIcon },
    { label: "TikTok", href: CONTACT.tiktok, Icon: TiktokIcon },
  ];

  return (
    <section id="contact" data-chapter-bg="#F7F2EA" className="relative overflow-hidden py-24 sm:py-32" dir={dir}>
      <div className="edge">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clay">
            {t.visit.kicker}
          </span>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* info side */}
          <div className="flex flex-col">
            <Reveal y={40}>
              <h2 className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tightest text-ink sm:text-[8vw] lg:text-[5vw]">
                {t.visit.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-md text-lg text-ink/65">{t.visit.body}</p>
            </Reveal>

            <Reveal className="mt-10 flex flex-col gap-3" stagger={0.08}>
              <a
                href={`tel:${INTL}`}
                className="group flex items-center gap-4 rounded-2xl border border-ink/10 px-5 py-4 transition-colors hover:border-ink/30 hover:bg-cream/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-clay">
                  <PhoneIcon />
                </span>
                <span className="flex flex-col text-start">
                  <span className="text-xs uppercase tracking-wide text-ink/45">{t.visit.call}</span>
                  <span className="font-display text-lg font-medium text-ink" dir="ltr">
                    {CONTACT.phoneDisplay}
                  </span>
                </span>
              </a>

              <a
                href={`https://wa.me/${INTL.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-ink/10 px-5 py-4 transition-colors hover:border-ink/30 hover:bg-cream/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-clay">
                  <WhatsappIcon />
                </span>
                <span className="flex flex-col text-start">
                  <span className="text-xs uppercase tracking-wide text-ink/45">{t.visit.whatsapp}</span>
                  <span className="font-display text-lg font-medium text-ink" dir="ltr">
                    {CONTACT.phoneDisplay}
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-ink/10 px-5 py-4 transition-colors hover:border-ink/30 hover:bg-cream/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-clay">
                  <MailIcon />
                </span>
                <span className="flex flex-col text-start">
                  <span className="text-xs uppercase tracking-wide text-ink/45">{t.visit.email}</span>
                  <span className="font-display text-base font-medium text-ink" dir="ltr">
                    {CONTACT.email}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal className="mt-10 flex items-center gap-4">
              <span className="text-xs uppercase tracking-[0.25em] text-ink/45">{t.visit.follow}</span>
              <div className="flex gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:-rotate-6 hover:scale-105 hover:border-clay hover:text-clay"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* map side */}
          <Reveal className="flex flex-col" delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-cream">
              {/* fallback shown if the map fails to load */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-clay">
                <PinIcon width={28} height={28} />
                <span className="font-display text-sm font-medium text-ink/60">{CONTACT.area[lang]}</span>
              </div>
              <iframe
                title="128 Cafe & Bakery location"
                src="https://maps.google.com/maps?q=128%20Cafe%20%26%20Bakery%20New%20Damietta&z=15&output=embed"
                className="h-[320px] w-full grayscale-[0.2] sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-clay">
                  <PinIcon />
                </span>
                <div>
                  <p className="font-display font-medium text-ink">{CONTACT.area[lang]}</p>
                  <p className="text-sm text-ink/55">{t.visit.hours}</p>
                </div>
              </div>
              <a
                href={CONTACT.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay"
              >
                {t.visit.directions}
                <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:inline-block rtl:rotate-180 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
