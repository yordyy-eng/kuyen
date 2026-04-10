import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8f4ef", // stone-50
        surface: "#f0ebe2",    // stone-100
        border: "#ddd4c5",     // stone-200
        primary: "#1a1612",    // stone-950
        secondary: "#7a6e5e",  // stone-500
        gold: "#c9a84c",
        "gold-light": "#e2c97a",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
