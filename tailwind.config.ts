import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // extracted from the real 128 logo, frame sequence and menu PDF
        paper: "#FAF7F2",      // warm off-white, dominant surface
        cream: "#E9E0D1",      // beige (hero frame background)
        ink: "#0E0E0C",        // near-black typography
        espresso: "#3A2317",   // coffee brown
        clay: "#B56A4F",       // signature terracotta / dusty-rose accent
        blush: "#F0DDD4",      // soft pink band
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        ar: ["var(--font-ar)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      transitionTimingFunction: {
        "128": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
