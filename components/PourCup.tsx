import Image from "next/image";

/**
 * The opening cup, split into layers so it can physically lift off its saucer
 * and tilt to pour (source: so12.png, separated into cup / saucer with the
 * saucer area the cup hid inpainted).
 *
 *  [data-pour-slot]    keeps the cup's layout space in the hero column
 *   ├ [data-pour-saucer] stays put, sinks + fades as the cup lifts
 *   └ [data-pour-lift]   non-rotating wrapper (carries the soft shadow, lifts/rises)
 *      └ [data-pour-cup] rotates around the cup's centre of mass
 *         ├ rim markers [data-pour-lip]  → the lowest one is where coffee leaves the rim
 *         └ [data-pour-center]           → rim centre (to tuck the stream behind the lip)
 */

// outer rim ellipse of the cup in source-image pixels (1254 × 1254)
const RIM = { cx: 604, cy: 418, rx: 418, ry: 214 };
const IMG = 1254;
// front-left arc of the rim — where a CCW-tilting cup pours from
const LIP_ANGLES = [110, 117, 124, 131, 138, 145, 152, 159, 166, 173, 180];

export default function PourCup({ alt }: { alt: string }) {
  return (
    <div data-pour-slot className="relative mt-4 aspect-square w-[52vw] max-w-[360px] sm:w-[34vw] lg:w-[22vw]">
      <div data-pour-saucer className="absolute inset-0 will-change-transform">
        <Image src="/hero/cup-saucer.webp" alt="" fill priority sizes="(max-width:1024px) 50vw, 22vw" className="object-contain drop-shadow-[0_40px_55px_rgba(42,29,20,0.22)]" />
      </div>
      <div data-pour-lift className="absolute inset-0 will-change-transform drop-shadow-[0_30px_40px_rgba(42,29,20,0.2)]">
        <div data-pour-cup className="absolute inset-0 will-change-transform" style={{ transformOrigin: "58% 46%" }}>
          <Image src="/hero/cup-body.webp" alt={alt} fill priority sizes="(max-width:1024px) 50vw, 22vw" className="object-contain" />
          {LIP_ANGLES.map((a) => {
            const r = (a * Math.PI) / 180;
            // fixed decimals: identical strings on server and client (no hydration mismatch)
            const x = (((RIM.cx + RIM.rx * Math.cos(r)) / IMG) * 100).toFixed(3);
            const y = (((RIM.cy + RIM.ry * Math.sin(r)) / IMG) * 100).toFixed(3);
            return <span key={a} data-pour-lip aria-hidden className="pointer-events-none absolute h-px w-px" style={{ left: `${x}%`, top: `${y}%` }} />;
          })}
          <span
            data-pour-center
            aria-hidden
            className="pointer-events-none absolute h-px w-px"
            style={{ left: `${((RIM.cx / IMG) * 100).toFixed(3)}%`, top: `${((RIM.cy / IMG) * 100).toFixed(3)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
