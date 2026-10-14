import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#080808",
          800: "#0e0e0f",
          700: "#161617",
        },
        titanium: {
          50: "#f4f4f5",
          200: "#d4d4d8",
          300: "#b4b4b8",
          400: "#8e8e93",
          500: "#6b6b70",
          600: "#48484c",
          700: "#2c2c2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        hyper: "-0.07em",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        dash: {
          to: { strokeDashoffset: "-40" },
        },
        "shimmer-bg": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s cubic-bezier(.4,0,.2,1) infinite",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "shimmer-bg": "shimmer-bg 8s linear infinite",
        dash: "dash 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
