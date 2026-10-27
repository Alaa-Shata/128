import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": true,
  ...p,
});

export const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const WhatsappIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5 0a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.3-.5c0-.1 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3A2.8 2.8 0 0 0 6.9 11c0 1.6 1.2 3.2 1.4 3.4.2.2 2.3 3.6 5.6 4.9 2.8 1 2.8.7 3.3.6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z" />
  </svg>
);

export const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 6 9 6 9-6" />
  </svg>
);

export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
  </svg>
);

export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const TiktokIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M16.5 2h-3v13.3a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .7.1V9.7a5.6 5.6 0 1 0 4.9 5.6V8.9a7 7 0 0 0 4 1.3V7.1a4 4 0 0 1-4-4z" />
  </svg>
);
